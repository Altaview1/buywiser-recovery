import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@3.2.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

// Admin contact info
const ADMIN_EMAIL = 'bennett@buywiser.com';
const ADMIN_PHONE = Deno.env.get('TWILIO_FROM_NUMBER') ? '+18183002642' : null;

// Format phone for SMS
function formatPhone(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('1') && digits.length === 11) return '+' + digits;
  if (digits.length === 10) return '+1' + digits;
  return null;
}

// Send SMS via Twilio
async function sendSMS(to, message) {
  const from = Deno.env.get('TWILIO_FROM_NUMBER');
  if (!from || !to) return;
  
  const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
  if (!accountSid || !authToken) return;

  try {
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: from,
        To: to,
        Body: message,
      }),
    });
  } catch (err) {
    console.error('SMS error:', err.message);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    // Only trigger on create events
    if (event.type !== 'create') {
      return Response.json({ status: 'skipped', reason: 'Not a create event' });
    }

    const opportunity = data;
    if (!opportunity) {
      return Response.json({ error: 'No opportunity data' }, { status: 400 });
    }

    const propertyAddress = opportunity.property_address || 'Unknown Property';
    const homeownerName = opportunity.homeowner_name || 'Unknown Homeowner';
    const city = opportunity.city || '';
    const state = opportunity.state || '';
    const phone = opportunity.homeowner_phone || 'N/A';
    const email = opportunity.homeowner_email || 'N/A';
    const partnerEmail = opportunity.partner_email || 'Unassigned';
    const estimatedPrice = opportunity.estimated_price ? `$${opportunity.estimated_price.toLocaleString()}` : 'Unknown';

    // Email HTML
    const emailHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:8px;">
        <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" height="32" style="margin-bottom:16px;" />
        <h2 style="color:#0B1F3B;margin:0 0 12px;">🎖️ New VTON Opportunity Assigned</h2>
        <p style="color:#64748b;font-size:14px;margin:0 0 16px;">A new veteran homeowner opportunity has been added to the pipeline.</p>
        
        <div style="background:white;border:1px solid #e2e8f0;border-radius:6px;padding:16px;margin-bottom:16px;">
          <h3 style="color:#0B1F3B;margin:0 0 12px;font-size:16px;">Homeowner Details</h3>
          <table style="width:100%;font-size:14px;border-collapse:collapse;">
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-weight:600;">Name</td><td style="color:#0f172a;">${homeownerName}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-weight:600;">Property</td><td style="color:#0f172a;">${propertyAddress}${city ? `, ${city}` : ''}${state ? `, ${state}` : ''}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-weight:600;">Phone</td><td><a href="tel:${phone}" style="color:#2563eb;">${phone}</a></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-weight:600;">Email</td><td><a href="mailto:${email}" style="color:#2563eb;">${email}</a></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-weight:600;">Est. Value</td><td style="color:#0f172a;">${estimatedPrice}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-weight:600;">Assigned Partner</td><td style="color:#0f172a;">${partnerEmail}</td></tr>
          </table>
        </div>

        <div style="background:#fff8e1;border:1px solid #f5c842;border-radius:4px;padding:12px;margin-bottom:16px;">
          <p style="margin:0;font-size:13px;color:#7a5c00;"><strong>⚡ Action Required:</strong> Contact this homeowner within 24 hours to schedule their Veterans GAP NextMove™ Benefit Review consultation.</p>
        </div>

        <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:4px;padding:12px;">
          <p style="margin:0;font-size:12px;color:#0c4a6e;"><strong>VTON Program:</strong> This is a privately funded benefit program for veteran homeowners. Not affiliated with the VA or any government agency.</p>
        </div>

        <p style="margin-top:20px;font-size:11px;color:#94a3b8;text-align:center;">BuyWiser Technology, Inc. · NMLS #1887767</p>
      </div>
    `;

    // SMS message
    const smsMessage = `🎖️ NEW VTON OPPORTUNITY\n\n${homeownerName}\n${propertyAddress}\n${city}, ${state}\nPhone: ${phone}\nValue: ${estimatedPrice}\n\nContact within 24hrs to schedule benefit review.`;

    // Send email notification
    const emailResult = await resend.emails.send({
      from: 'BuyWiser VTON <notifications@buywiser.com>',
      to: ADMIN_EMAIL,
      subject: `🎖️ New VTON Opportunity: ${homeownerName} — ${propertyAddress}`,
      html: emailHtml,
    });

    // Log the notification
    await base44.asServiceRole.entities.VTONEmailLog.create({
      lead_id: opportunity.id || 'unknown',
      lead_name: homeownerName,
      lead_email: ADMIN_EMAIL,
      email_type: 'lead_confirmation',
      subject: `🎖️ New VTON Opportunity: ${homeownerName}`,
      status: 'sent',
      sent_date: new Date().toISOString(),
      notes: `Automated notification for new VTON opportunity`
    });

    // Send SMS notification
    if (ADMIN_PHONE) {
      await sendSMS(ADMIN_PHONE, smsMessage);
    }

    console.log(`VTON opportunity notification sent for ${homeownerName}`);
    return Response.json({ 
      success: true, 
      opportunityId: opportunity.id,
      homeownerName,
      email_sent: true,
      sms_sent: !!ADMIN_PHONE
    });
  } catch (error) {
    console.error('notifyNewVTONOpportunity error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});