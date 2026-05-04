import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@3.2.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const ADMIN_EMAIL = 'bennett@buywiser.com';
const PARTNER_EMAIL = 'bennett@buywiser.com';
const ADMIN_PHONE = Deno.env.get('BENNETT_PHONE');
const TWILIO_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_FROM = Deno.env.get('TWILIO_FROM_NUMBER');

function formatPhone(phone) {
  if (!phone) return null;
  // If already has +, return as-is
  if (phone.startsWith('+')) return phone;
  // Otherwise clean and format
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) return `+1${cleaned}`;
  if (cleaned.length === 11) return `+${cleaned}`;
  return `+${cleaned}`;
}

async function sendSMS(to, body) {
  if (!to || !TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) return;
  try {
    const formattedTo = formatPhone(to);
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: formattedTo, From: TWILIO_FROM, Body: body }),
    });
    const data = await response.json();
    console.log(`SMS sent to ${formattedTo}: ${data.sid}`);
  } catch (err) {
    console.error('SMS error:', err.message);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const { event, data } = payload;

    if (!data) return Response.json({ error: 'No data' }, { status: 400 });

    const entityType = event.entity_name;
    const eventType = event.type;
    let subject = '';
    let adminBody = '';
    let smsBody = '';
    let partnerEmail = null;
    let partnerPhone = null;

    // Handle VTONOpportunity
    if (entityType === 'VTONOpportunity') {
      const opp = data;
      const homeowner = opp.homeowner_name || 'Veteran Homeowner';
      const address = opp.property_address || 'Address pending';
      const city = opp.city ? `, ${opp.city}` : '';
      const state = opp.state ? `, ${opp.state}` : '';
      const fullAddress = `${address}${city}${state}`;

      if (eventType === 'create') {
        subject = `🆕 New VTON Opportunity: ${homeowner}`;
        adminBody = `New VTON opportunity created:\n\nHomeowner: ${homeowner}\nProperty: ${fullAddress}\nStatus: ${opp.opportunity_status || 'assigned'}\nPartner: ${opp.partner_email || 'Unassigned'}\n\nLog in to the dashboard to review.`;
        smsBody = `🆕 New VTON Opp: ${homeowner}\n${fullAddress}\n${opp.partner_email ? 'Assigned' : 'Waiting assignment'}`;
      } else if (eventType === 'update') {
        subject = `📝 VTON Opportunity Updated: ${homeowner}`;
        adminBody = `VTON opportunity updated:\n\nHomeowner: ${homeowner}\nProperty: ${fullAddress}\nStatus: ${opp.opportunity_status || 'pending'}\nPartner: ${opp.partner_email || 'Unassigned'}\n\nLog in to review changes.`;
        smsBody = `📝 VTON Update: ${homeowner}\n${fullAddress}\nStatus: ${opp.opportunity_status || 'pending'}`;
      }

      partnerEmail = opp.partner_email;

      // Look up partner phone if assigned
      if (partnerEmail && partnerEmail !== 'unassigned') {
        const partners = await base44.asServiceRole.entities.PartnerApplication.filter({ email: partnerEmail });
        if (partners.length > 0) {
          partnerPhone = partners[0].phone;
        }
      }
    }

    // Handle Lead
    if (entityType === 'Lead') {
      const lead = data;
      const leadName = lead.name || 'Unknown Lead';
      const leadAddress = lead.address_or_link || 'Address pending';

      if (eventType === 'create') {
        subject = `🆕 New Lead: ${leadName}`;
        adminBody = `New lead submitted:\n\nName: ${leadName}\nEmail: ${lead.email || 'Not provided'}\nPhone: ${lead.phone || 'Not provided'}\nProperty: ${leadAddress}\nAssigned Agent: ${lead.assigned_agent || 'Not assigned'}\nStatus: ${lead.status || 'New'}\n\nLog in to the dashboard.`;
        smsBody = `🆕 New Lead: ${leadName}\n${leadAddress}\nAgent: ${lead.assigned_agent || 'Unassigned'}`;
      } else if (eventType === 'update') {
        subject = `📝 Lead Updated: ${leadName}`;
        adminBody = `Lead updated:\n\nName: ${leadName}\nEmail: ${lead.email || 'Not provided'}\nPhone: ${lead.phone || 'Not provided'}\nProperty: ${leadAddress}\nAssigned Agent: ${lead.assigned_agent || 'Not assigned'}\nStatus: ${lead.status || 'New'}\n\nLog in to review changes.`;
        smsBody = `📝 Lead Update: ${leadName}\nStatus: ${lead.status || 'New'}\nAgent: ${lead.assigned_agent || 'Unassigned'}`;
      }

      // Get partner email if assigned
      if (lead.assigned_agent) {
        const partners = await base44.asServiceRole.entities.PartnerApplication.filter({
          name: lead.assigned_agent,
          status: 'approved'
        });
        if (partners.length > 0) {
          partnerEmail = partners[0].email;
          partnerPhone = partners[0].phone;
        }
      }
    }

    if (!subject) return Response.json({ status: 'skipped', reason: 'No matching entity or event type' });

    // Send email to admin
    await resend.emails.send({
      from: 'BuyWiser <notifications@buywiser.com>',
      to: ADMIN_EMAIL,
      subject,
      text: adminBody,
    });
    console.log(`Email sent to admin: ${subject}`);

    // Send SMS to admin
    await sendSMS(ADMIN_PHONE, smsBody);

    // Send email to partner using unified email address
    if (partnerEmail && partnerEmail !== 'unassigned') {
      await resend.emails.send({
        from: 'BuyWiser <notifications@buywiser.com>',
        to: PARTNER_EMAIL,
        subject,
        text: adminBody.replace('Log in to the dashboard', 'Log in to your partner dashboard'),
      });
      console.log(`Email sent to partner address: ${PARTNER_EMAIL}`);
    }

    // Send SMS to partner if applicable
    if (partnerPhone && partnerPhone !== 'unassigned') {
      await sendSMS(partnerPhone, smsBody);
    }

    return Response.json({ success: true, adminNotified: true, partnerNotified: !!partnerEmail });
  } catch (error) {
    console.error('notifyOnAnyChange error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});