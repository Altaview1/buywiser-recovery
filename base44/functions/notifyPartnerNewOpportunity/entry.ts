import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

async function sendTwilioSMS(to, body) {
  const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const twilioAuth = Deno.env.get('TWILIO_AUTH_TOKEN');
  const twilioFrom = Deno.env.get('TWILIO_FROM_NUMBER');
  if (!twilioSid || !twilioAuth || !twilioFrom || !to) return;
  const cleaned = to.replace(/\D/g, '');
  const formatted = cleaned.length === 10 ? `+1${cleaned}` : `+${cleaned}`;
  try {
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${twilioSid}:${twilioAuth}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: formatted, From: twilioFrom, Body: body }),
    });
    console.log(`SMS sent to ${formatted}`);
  } catch (err) {
    console.error('SMS error:', err.message);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Entity automation — no user auth needed
    const payload = await req.json();
    const opp = payload.data;

    if (!opp) return Response.json({ error: 'No opportunity data' }, { status: 400 });

    const partnerEmail = opp.partner_email;
    if (!partnerEmail) return Response.json({ error: 'No partner email on opportunity' }, { status: 400 });

    // Look up partner name and phone
    const partners = await base44.asServiceRole.entities.PartnerApplication.filter({ email: partnerEmail });
    const partnerName = partners.length > 0 ? partners[0].name.split(' ')[0] : 'Partner';
    const territory = partners.length > 0 && partners[0].territory ? partners[0].territory : 'your territory';
    const partnerPhone = partners.length > 0 ? partners[0].phone : null;

    const address = opp.property_address || 'Address pending';
    const city = opp.city ? `, ${opp.city}` : '';
    const state = opp.state ? `, ${opp.state}` : '';
    const fullAddress = `${address}${city}${state}`;
    const homeowner = opp.homeowner_name || 'Veteran Homeowner';
    const priority = opp.priority ? opp.priority.charAt(0).toUpperCase() + opp.priority.slice(1) : 'Medium';
    const price = opp.estimated_price
      ? opp.estimated_price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
      : null;
    const benefit = opp.estimated_price
      ? (opp.estimated_price * 0.015).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
      : null;

    const adminPhone = Deno.env.get('BENNETT_PHONE');

    const date = new Date().toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const resendKey = Deno.env.get('RESEND_API_KEY');

    // Email to partner
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VTON — Veteran Transition Opportunity Network <notifications@buywiser.com>',
        to: [partnerEmail],
        subject: `🎯 New Opportunity Assigned: ${fullAddress}`,
        html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b;">
          <div style="background:#0B1F3B;padding:20px 24px;border-radius:8px 8px 0 0;">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height:32px;" />
            <p style="margin:8px 0 0;font-size:10px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">
              VTON · Veteran Transition Opportunity Network
            </p>
          </div>
          <div style="height:4px;background:#C62828;"></div>
          <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:28px 24px;">
            <p style="font-size:16px;margin:0 0 4px;">Hi ${partnerName},</p>
            <p style="font-size:15px;line-height:1.6;margin:0 0 20px;color:#475569;">
              A new veteran transition opportunity has been assigned to you in <strong style="color:#0B1F3B;">${territory}</strong>.
              Log in to your partner dashboard to review the details and begin outreach.
            </p>
            <div style="background:#F5F7FA;border:1px solid #e2e8f0;border-left:4px solid #C62828;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
              <p style="margin:0 0 10px;font-size:11px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#94a3b8;">Opportunity Details</p>
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr><td style="padding:5px 12px 5px 0;color:#64748b;width:120px;">Homeowner</td><td style="padding:5px 0;font-weight:600;color:#0f172a;">${homeowner}</td></tr>
                <tr><td style="padding:5px 12px 5px 0;color:#64748b;">Property</td><td style="padding:5px 0;font-weight:600;color:#0f172a;">${fullAddress}</td></tr>
                ${price ? `<tr><td style="padding:5px 12px 5px 0;color:#64748b;">Est. Price</td><td style="padding:5px 0;font-weight:600;color:#0f172a;">${price}</td></tr>` : ''}
                ${benefit ? `<tr><td style="padding:5px 12px 5px 0;color:#64748b;">GAP Benefit</td><td style="padding:5px 0;font-weight:700;color:#C62828;">up to ${benefit}</td></tr>` : ''}
                <tr><td style="padding:5px 12px 5px 0;color:#64748b;">VA Confirmed</td><td style="padding:5px 0;font-weight:600;color:#0f172a;">${opp.va_loan_confirmed ? 'Yes' : 'Pending'}</td></tr>
                <tr><td style="padding:5px 12px 5px 0;color:#64748b;">Priority</td><td style="padding:5px 0;font-weight:700;color:${priority === 'High' ? '#C62828' : '#0f172a'};">${priority}</td></tr>
                <tr><td style="padding:5px 12px 5px 0;color:#64748b;">Assigned</td><td style="padding:5px 0;color:#64748b;">${date} PT</td></tr>
              </table>
            </div>
            <div style="background:#eff6ff;border:1px solid #dbeafe;border-radius:6px;padding:14px 18px;margin-bottom:20px;font-size:13px;color:#1e40af;line-height:1.6;">
              <strong>VTON Protocol:</strong> You have a 48-hour decision window. Accept or decline in your dashboard. To earn your $200 verified conversation credit, make contact, log your CRM notes, and select an outcome.
            </div>
            <div style="text-align:center;margin-bottom:20px;">
              <a href="https://buywiser.base44.app/partner" style="display:inline-block;padding:13px 28px;background:#C62828;color:#fff;font-weight:700;border-radius:10px;text-decoration:none;font-size:14px;">View in Partner Dashboard →</a>
            </div>
          </div>
          <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:12px;">BuyWiser Technology, Inc. · NMLS #1887767</p>
        </div>
        `,
      }),
    });

    const smsSummary = `🎯 VTON: New opportunity, ${partnerName}!\n${homeowner} — ${fullAddress}${benefit ? ` (up to ${benefit})` : ''}\nPriority: ${priority}\nLog in: https://buywiser.base44.app/partner`;
    const adminSms = `🎯 VTON Opp assigned: ${homeowner} → ${fullAddress}\nPriority: ${priority}\nPartner: ${partnerEmail}`;

    // Send SMS to partner (once) and admin (once)
    await Promise.all([
      partnerPhone ? sendTwilioSMS(partnerPhone, smsSummary) : Promise.resolve(),
      adminPhone ? sendTwilioSMS(adminPhone, adminSms) : Promise.resolve(),
    ]);

    console.log(`Opportunity notification sent to ${partnerEmail} at ${fullAddress}`);
    return Response.json({ success: true });
  } catch (error) {
    console.error('notifyPartnerNewOpportunity error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});