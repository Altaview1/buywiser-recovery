import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@3.2.0';
import twilio from 'npm:twilio@4.19.3';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const ADMIN_PHONE = Deno.env.get("BENNETT_PHONE");
const TWILIO_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_FROM = Deno.env.get("TWILIO_FROM_NUMBER");

function formatPhone(phone) {
  if (!phone) return null;
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) return `+1${cleaned}`;
  if (cleaned.length === 11) return `+${cleaned}`;
  return `+${cleaned}`;
}

async function sendSMS(to, body) {
  if (!to || !TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) return;
  try {
    const formattedTo = formatPhone(to);
    const client = twilio(TWILIO_SID, TWILIO_TOKEN);
    await client.messages.create({ from: TWILIO_FROM, to: formattedTo, body });
    console.log(`SMS sent to ${formattedTo}`);
  } catch (err) {
    console.error('SMS error:', err.message);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Entity automation — no user auth needed
    const { event, data } = await req.json();

    if (!data || (event.type !== 'create' && event.type !== 'update')) {
      return Response.json({ status: 'skipped' });
    }

    const lead = data;
    const adminEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL');
    if (!adminEmail) {
      return Response.json({ error: 'ADMIN_NOTIFICATION_EMAIL not configured' }, { status: 500 });
    }

    // Get partner email if assigned
    let partner = null;
    if (lead.assigned_agent) {
      const partners = await base44.asServiceRole.entities.PartnerApplication.filter({
        name: lead.assigned_agent,
        status: 'approved'
      }, 'name', 1);
      if (partners.length > 0) {
        partner = partners[0];
      }
    }

    // Format lead details
    const leadDetails = `
Name: ${lead.name || 'Not provided'}
Email: ${lead.email || 'Not provided'}
Phone: ${lead.phone || 'Not provided'}
Property: ${lead.address_or_link || 'Not provided'}
Code: ${lead.code || 'None'}
Assigned Agent: ${lead.assigned_agent || 'Not assigned'}
Status: ${lead.status || 'New'}
UTM Source: ${lead.utm_source || 'Direct'}
Internal Notes: ${lead.internal_notes || 'None'}
`;

    // Email to admin
    await resend.emails.send({
      from: 'BuyWiser <notifications@buywiser.com>',
      to: adminEmail,
      subject: `New Lead Submitted: ${lead.name || 'Unknown'}`,
      text: `A new lead has been submitted.\n\n${leadDetails}\n\nLog in to the dashboard to view and manage this lead.`,
    });

    // SMS to admin
    const smsBody = `🆕 New Lead: ${lead.name || 'Unknown'}\n${lead.address_or_link || 'Address pending'}\nAgent: ${lead.assigned_agent || 'Unassigned'}`;
    await sendSMS(ADMIN_PHONE, smsBody);

    // Email to assigned partner if applicable
    if (partner && partner.email) {
      await resend.emails.send({
        from: 'BuyWiser <notifications@buywiser.com>',
        to: partner.email,
        subject: `New Lead Assigned: ${lead.name || 'Unknown'}`,
        text: `A new lead has been assigned to you.\n\n${leadDetails}\n\nLog in to your partner dashboard to view details and follow up.`,
      });

      // SMS to partner
      if (partner.phone) {
        await sendSMS(partner.phone, smsBody);
      }
    }

    return Response.json({ 
      status: 'success', 
      adminNotified: true,
      partnerNotified: !!partner
    });
  } catch (error) {
    console.error('Email notification error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});