import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@3.2.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const TWILIO_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_FROM = Deno.env.get('TWILIO_FROM_NUMBER');

function formatPhone(phone) {
  if (!phone) return null;
  if (phone.startsWith('+')) return phone;
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) return `+1${cleaned}`;
  if (cleaned.length === 11) return `+${cleaned}`;
  return `+${cleaned}`;
}

async function sendSMS(to, body) {
  if (!to || !TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) return;
  const formattedTo = formatPhone(to);
  if (!formattedTo) return;
  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ To: formattedTo, From: TWILIO_FROM, Body: body }),
      }
    );
    console.log(`SMS sent to ${formattedTo}`);
  } catch (err) {
    console.error('SMS error:', err.message);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const { data, old_data } = payload;

    // Fire when status just moved TO QUALIFIED (from scan)
    if (data?.status !== 'QUALIFIED' || (old_data?.status === 'QUALIFIED' && !old_data?.appointment_scheduled)) {
      return Response.json({ status: 'skipped', reason: 'Not a new QUALIFIED transition or already processed' });
    }

    const name = data.first_name || 'Homeowner';
    const firstName = name.split(' ')[0];
    const email = data.email;
    const phone = data.phone;
    const propertyAddress = data.property_address || 'your property';

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <div style="background: #0B1F3B; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height: 28px;" />
          <p style="margin: 8px 0 0; font-size: 11px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.5);">Benefit Review Confirmation</p>
        </div>
        <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
          <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 6px; color: #0B1F3B;">You're All Set! 🇺🇸</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
            Hi ${firstName},<br/><br/>
            Thank you for starting your <strong>Veteran's Next Home™ Benefit Review</strong>. You've been confirmed for <strong>${propertyAddress}</strong>.
          </p>

          <div style="background: #f1f5f9; border-left: 4px solid #0B1F3B; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">What Happens Next</p>
            <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px; line-height: 1.8;">
              <li>Your BuyWiser specialist will call you within 24 hours</li>
              <li>You'll get your personalized benefit estimate</li>
              <li>Schedule a 15-minute consultation (no obligation)</li>
              <li>Your \$50 charity donation will be processed upon completion</li>
            </ul>
          </div>

          <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 8px; font-size: 11px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; color: #3b82f6;">Questions?</p>
            <p style="margin: 0; font-size: 13px; color: #1e40af;">Call us directly at <strong>(818) 300-2642</strong> or reply to this email.</p>
          </div>

          <p style="font-size: 12px; color: #94a3b8; margin-top: 16px;">
            BuyWiser Technology, Inc. · NMLS #1887767<br/>
            Not affiliated with the U.S. Department of Veterans Affairs.
          </p>
        </div>
      </div>
    `;

    const smsBody = `Hi ${firstName}! Your Veteran's Next Home™ Benefit Review is confirmed. A BuyWiser specialist will call you within 24 hours. Questions? Call (818) 300-2642.`;

    // Send in parallel
    await Promise.all([
      email ? resend.emails.send({
        from: 'BuyWiser VTON <notifications@buywiser.com>',
        to: email,
        subject: '✓ Your Veteran\'s Next Home™ Benefit Review is Confirmed',
        html: emailHtml,
      }).catch(err => console.error('Email send error:', err)) : Promise.resolve(),
      phone ? sendSMS(phone, smsBody) : Promise.resolve(),
    ]);

    console.log(`Homeowner confirmation sent to ${email}, ${phone}`);
    return Response.json({ success: true, email_sent: !!email, sms_sent: !!phone });
  } catch (error) {
    console.error('notifyQRScanHomeowner error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});