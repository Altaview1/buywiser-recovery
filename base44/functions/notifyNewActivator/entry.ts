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
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: formattedTo, From: TWILIO_FROM, Body: body }),
  });
  const data = await response.json();
  console.log(`SMS sent to ${formattedTo}:`, data.sid || data.message);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Entity automation — no user auth needed, uses service role
    const payload = await req.json();

    const { event, data } = payload;
    if (!data) return Response.json({ error: 'No data' }, { status: 400 });

    const activator = data;
    const name = activator.name || 'Field Activator';
    const repCode = activator.rep_code || '—';
    const email = activator.email;
    const phone = activator.phone;

    // Determine the app's base URL from the request
    const origin = req.headers.get('origin') || 'https://preview-sandbox--69984fca7363ecc074d7a3fc.base44.app';
    const dashboardUrl = `${origin}/activator`;
    const qrUrl = `${origin}/vton-scan?rep=${repCode}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px;">
    
    <div style="background:#0B1F3B;border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
      <p style="color:#93c5fd;font-size:11px;font-weight:900;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">Welcome to the Team</p>
      <h1 style="color:#ffffff;font-size:24px;font-weight:900;margin:0;">Veteran's Next Home™</h1>
      <p style="color:#93c5fd;font-size:13px;margin:8px 0 0;">Field Activator Program</p>
    </div>

    <div style="background:#ffffff;border-radius:0 0 16px 16px;padding:32px;border:1px solid #e2e8f0;border-top:none;">
      
      <p style="color:#1e293b;font-size:16px;margin:0 0 16px;">Hi <strong>${name}</strong>,</p>
      <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 24px;">
        You've been added as a Field Activator for the Veteran's Next Home™ program. Here's everything you need to get started:
      </p>

      <!-- Rep Code Box -->
      <div style="background:#f0f9ff;border:2px solid #0B1F3B;border-radius:12px;padding:20px;text-align:center;margin:0 0 24px;">
        <p style="color:#64748b;font-size:11px;font-weight:900;letter-spacing:3px;text-transform:uppercase;margin:0 0 8px;">Your Rep Code</p>
        <p style="color:#0B1F3B;font-size:36px;font-weight:900;letter-spacing:8px;margin:0;">${repCode}</p>
        <p style="color:#64748b;font-size:12px;margin:8px 0 0;">Use this code on all your QR materials</p>
      </div>

      <!-- Dashboard Link -->
      <div style="margin:0 0 24px;">
        <p style="color:#374151;font-size:13px;font-weight:700;margin:0 0 8px;">📱 Your Dashboard</p>
        <a href="${dashboardUrl}" style="display:block;background:#0B1F3B;color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:10px;font-weight:700;font-size:14px;text-align:center;">
          Access My Activator Dashboard →
        </a>
        <p style="color:#94a3b8;font-size:11px;margin:6px 0 0;text-align:center;">Sign in with your email: ${email}</p>
      </div>

      <!-- QR Link -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin:0 0 24px;">
        <p style="color:#374151;font-size:13px;font-weight:700;margin:0 0 6px;">🔗 Your Personal QR Scan Link</p>
        <p style="color:#3b82f6;font-size:12px;word-break:break-all;margin:0;">${qrUrl}</p>
        <p style="color:#64748b;font-size:12px;margin:8px 0 0;">This link is embedded in your QR code. When homeowners scan it, the lead is attributed to you.</p>
      </div>

      <!-- How it works -->
      <div style="margin:0 0 24px;">
        <p style="color:#374151;font-size:13px;font-weight:700;margin:0 0 12px;">How It Works:</p>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:flex-start;gap:10px;">
            <span style="background:#0B1F3B;color:#fff;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;flex-shrink:0;line-height:22px;text-align:center;">1</span>
            <p style="color:#475569;font-size:13px;margin:0;line-height:1.5;">Log in to your dashboard and generate your QR code</p>
          </div>
          <div style="display:flex;align-items:flex-start;gap:10px;">
            <span style="background:#0B1F3B;color:#fff;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;flex-shrink:0;line-height:22px;text-align:center;">2</span>
            <p style="color:#475569;font-size:13px;margin:0;line-height:1.5;">Print the QR flyer and distribute it to veteran homeowners</p>
          </div>
          <div style="display:flex;align-items:flex-start;gap:10px;">
            <span style="background:#0B1F3B;color:#fff;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;flex-shrink:0;line-height:22px;text-align:center;">3</span>
            <p style="color:#475569;font-size:13px;margin:0;line-height:1.5;">Every scan is tracked and attributed to your rep code</p>
          </div>
          <div style="display:flex;align-items:flex-start;gap:10px;">
            <span style="background:#10b981;color:#fff;border-radius:50%;width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;flex-shrink:0;line-height:22px;text-align:center;">$</span>
            <p style="color:#475569;font-size:13px;margin:0;line-height:1.5;">Earn payouts as leads progress through the pipeline</p>
          </div>
        </div>
      </div>

      <p style="color:#94a3b8;font-size:12px;border-top:1px solid #f1f5f9;padding-top:16px;margin:0;">
        Questions? Contact the BuyWiser team at <a href="mailto:bennett@buywiser.com" style="color:#3b82f6;">bennett@buywiser.com</a> or call <a href="tel:+18183002642" style="color:#3b82f6;">(818) 300-2642</a>
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const promises = [];

    // Send welcome email
    if (email) {
      promises.push(
        resend.emails.send({
          from: 'BuyWiser VTON <notifications@buywiser.com>',
          to: email,
          subject: `🎖️ Welcome to VTON — Your Rep Code is ${repCode}`,
          html: emailHtml,
        }).then(() => console.log(`Welcome email sent to ${email}`))
      );
    }

    // Send welcome SMS
    if (phone) {
      const smsBody = `Welcome to VTON, ${name}! 🇺🇸\n\nYour Rep Code: ${repCode}\n\nAccess your dashboard: ${dashboardUrl}\n\nLog in with your email (${email}) to get your QR code and start earning.\n\n— BuyWiser Team`;
      promises.push(sendSMS(phone, smsBody));
    }

    await Promise.all(promises);

    return Response.json({ success: true, emailSent: !!email, smsSent: !!phone });
  } catch (error) {
    console.error('notifyNewActivator error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});