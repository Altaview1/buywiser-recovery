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
  const data = await response.json();
  console.log(`SMS sent to ${formattedTo}: ${data.sid || data.message}`);
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const { data, old_data } = payload;

    // Only fire when status just moved TO Qualified
    if (data?.status !== 'Qualified' || old_data?.status === 'Qualified') {
      return Response.json({ status: 'skipped', reason: 'Not a new Qualified transition' });
    }

    const name = data.name || 'Homeowner';
    const firstName = name.split(' ')[0];
    const email = data.email;
    const phone = data.phone;
    const address = data.address_or_link || 'your property';

    const smsBody =
      `Hi ${firstName}! This is BuyWiser Home Loans. Great news — your Veteran's Next Home™ Benefit Review for ${address} is now scheduled. ` +
      `A specialist will be in touch shortly to walk you through your options. Questions? Call us at (818) 300-2642.`;

    const emailHtml = `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;padding:24px;color:#1e293b">
        <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height:36px;margin-bottom:24px" />
        <h2 style="font-size:20px;font-weight:800;margin:0 0 8px">Your Benefit Review Is Scheduled 🎖️</h2>
        <p style="color:#475569;line-height:1.6;margin:0 0 16px">
          Hi ${firstName},<br/><br/>
          Thank you for starting your <strong>Veteran's Next Home™ Benefit Review</strong>. We've received your information for
          <strong>${address}</strong> and a BuyWiser specialist will be reaching out shortly to walk you through your options.
        </p>
        <div style="background:#f1f5f9;border-radius:12px;padding:16px;margin-bottom:20px">
          <p style="margin:0;font-size:13px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:.05em">What to expect next</p>
          <ul style="margin:8px 0 0;padding-left:18px;color:#334155;font-size:14px;line-height:1.8">
            <li>A personal call from your BuyWiser advisor</li>
            <li>A breakdown of your estimated veteran purchase benefit</li>
            <li>No obligation — just clarity on your options</li>
          </ul>
        </div>
        <p style="color:#475569;font-size:14px;line-height:1.6">
          Questions? Reply to this email or call us at <a href="tel:+18183002642" style="color:#1d4ed8">(818) 300-2642</a>.
        </p>
        <p style="color:#94a3b8;font-size:12px;margin-top:24px">
          BuyWiser Technology, Inc. · NMLS #1887767 · Not affiliated with the U.S. Department of Veterans Affairs.
        </p>
      </div>
    `;

    const tasks = [];

    if (email) {
      tasks.push(
        resend.emails.send({
          from: 'BuyWiser Home Loans <notifications@buywiser.com>',
          to: email,
          subject: '🎖️ Your Veteran\'s Next Home™ Benefit Review Is Scheduled',
          html: emailHtml,
        }).then(() => console.log(`Thank-you email sent to ${email}`))
      );
    }

    if (phone) {
      tasks.push(sendSMS(phone, smsBody));
    }

    await Promise.all(tasks);

    return Response.json({ success: true, emailSent: !!email, smsSent: !!phone });
  } catch (error) {
    console.error('thankHomeownerOnVerified error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});