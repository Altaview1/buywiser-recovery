import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@3.2.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const ADMIN_EMAIL = 'bennett@buywiser.com';
const ADMIN_PHONE = Deno.env.get('BENNETT_PHONE');
const CALENDLY_URL = 'https://calendly.com/bennett-13/pre-consultation-call-with-bennett-liss-ceo-of-buywiser';

function formatPhone(phone) {
  if (!phone) return null;
  if (phone.startsWith('+')) return phone;
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) return `+1${cleaned}`;
  if (cleaned.length === 11) return `+${cleaned}`;
  return `+${cleaned}`;
}

async function sendSMS(to, body) {
  const sid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const token = Deno.env.get('TWILIO_AUTH_TOKEN');
  const from = Deno.env.get('TWILIO_FROM_NUMBER');
  if (!sid || !token || !from || !to) return;
  const formatted = formatPhone(to);
  if (!formatted) return;
  try {
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${sid}:${token}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: formatted, From: from, Body: body }),
    });
    console.log(`SMS sent to ${formatted}`);
  } catch (err) {
    console.error('SMS error:', err.message);
  }
}

/**
 * Fires when ActivatorLead status changes to SCHEDULED.
 * 1. Sends homeowner a branded email with the Calendly booking link.
 * 2. Sends homeowner an SMS with the booking link.
 * 3. Alerts admin (email + SMS) that a consultation was booked.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const { data, old_data } = payload;

    // Only fire when transitioning INTO SCHEDULED
    if (data?.status !== 'SCHEDULED' || old_data?.status === 'SCHEDULED') {
      return Response.json({ skipped: true, reason: 'Not a new SCHEDULED transition' });
    }

    const firstName = data.first_name || 'Homeowner';
    const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ') || 'Homeowner';
    const email = data.email;
    const phone = data.phone;
    const address = data.property_address || 'your property';

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <div style="background: #0B1F3B; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height: 28px;" />
          <p style="margin: 8px 0 0; font-size: 11px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.5);">Veteran's Next Home™ Benefit Review</p>
        </div>
        <div style="height: 4px; background: #C62828;"></div>
        <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; padding: 28px 24px;">
          <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 6px; color: #0B1F3B;">🎖️ You're In — Now Let's Book Your Review</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
            Hi ${firstName},<br/><br/>
            Great news — your profile for <strong>${address}</strong> has been confirmed and you qualify for the <strong>Buywiser 1.5 GAP Benefit™</strong>.<br/><br/>
            Your next step is to schedule your free 15-minute <strong>Veteran's Next Home™ Benefit Review</strong> with a BuyWiser specialist.
          </p>

          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${CALENDLY_URL}" style="display: inline-block; padding: 14px 32px; background: #C62828; color: #fff; font-weight: 800; font-size: 15px; border-radius: 10px; text-decoration: none; letter-spacing: 0.02em;">
              📅 Book My Free Benefit Review →
            </a>
            <p style="margin: 10px 0 0; font-size: 12px; color: #94a3b8;">No obligation. Takes 15 minutes. Completely free.</p>
          </div>

          <div style="background: #f1f5f9; border-left: 4px solid #0B1F3B; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">What We'll Cover</p>
            <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px; line-height: 1.9;">
              <li>Your exact Buywiser 1.5 GAP Benefit™ estimate</li>
              <li>How to structure your next home purchase to maximize your benefit</li>
              <li>VA financing vs. conventional options for your next home</li>
              <li>Timeline planning for your move</li>
            </ul>
          </div>

          <div style="background: #fef9c3; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 14px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 12px; color: #78350f;">
              <strong>🎗️ Remember:</strong> Your $50 donation to a veteran charity of your choice will be processed upon completing your review.
            </p>
          </div>

          <p style="font-size: 13px; color: #475569; line-height: 1.6;">
            Prefer to call? Reach us at <a href="tel:+18183002642" style="color: #1e40af; font-weight: 600;">(818) 300-2642</a>
          </p>

          <p style="font-size: 11px; color: #94a3b8; margin-top: 20px;">
            BuyWiser Technology, Inc. · NMLS #1887767<br/>
            Not affiliated with the U.S. Department of Veterans Affairs.
          </p>
        </div>
      </div>
    `;

    const homeSMS = `Hi ${firstName}! Your Veteran's Next Home™ Benefit Review is confirmed. Book your free 15-min consultation here: ${CALENDLY_URL} — or call us at (818) 300-2642. Looking forward to it!`;
    const adminSMS = `📅 CONSULTATION BOOKED: ${fullName} | ${phone || 'no phone'} | ${email || 'no email'} | Property: ${address}`;

    await Promise.all([
      // Email to homeowner
      email ? resend.emails.send({
        from: 'BuyWiser VTON <notifications@buywiser.com>',
        to: email,
        subject: '📅 Book Your Veteran\'s Next Home™ Benefit Review — You\'re Confirmed',
        html: emailHtml,
      }).catch(err => console.error('Homeowner email error:', err.message)) : Promise.resolve(),

      // SMS to homeowner
      phone ? sendSMS(phone, homeSMS) : Promise.resolve(),

      // Alert admin by email
      resend.emails.send({
        from: 'BuyWiser VTON <notifications@buywiser.com>',
        to: ADMIN_EMAIL,
        subject: `📅 Consultation Booked: ${fullName} — ${address}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:8px;">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" height="28" style="margin-bottom:16px;" />
          <h2 style="color:#0B1F3B;margin:0 0 8px;">📅 New Consultation Booked</h2>
          <table style="font-size:14px;width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-weight:600;">Name</td><td style="color:#0f172a;">${fullName}</td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-weight:600;">Email</td><td><a href="mailto:${email}" style="color:#2563eb;">${email || 'N/A'}</a></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-weight:600;">Phone</td><td><a href="tel:${phone}" style="color:#2563eb;">${phone || 'N/A'}</a></td></tr>
            <tr><td style="padding:6px 12px 6px 0;color:#64748b;font-weight:600;">Property</td><td style="color:#0f172a;">${address}</td></tr>
          </table>
          <p style="margin-top:16px;font-size:12px;color:#94a3b8;">BuyWiser Technology, Inc. · NMLS #1887767</p>
        </div>`,
      }).catch(err => console.error('Admin email error:', err.message)),

      // SMS to admin
      ADMIN_PHONE ? sendSMS(ADMIN_PHONE, adminSMS) : Promise.resolve(),
    ]);

    console.log(`Consultation booking notification sent for ${fullName}`);
    return Response.json({ success: true, email_sent: !!email, sms_sent: !!phone });
  } catch (error) {
    console.error('notifyConsultationBooked error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});