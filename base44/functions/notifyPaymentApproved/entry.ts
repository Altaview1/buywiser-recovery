import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@3.2.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

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
 * Fires when an ActivatorPayment status changes to APPROVED.
 * Notifies the field activator by email + SMS that their payment was approved.
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const { data, old_data } = payload;

    // Only fire when transitioning INTO APPROVED
    if (data?.status !== 'APPROVED' || old_data?.status === 'APPROVED') {
      return Response.json({ skipped: true, reason: 'Not a new APPROVED transition' });
    }

    const payment = data;
    const activatorId = payment.activator_id;
    const amount = payment.amount || 0;
    const type = payment.type || 'PAYMENT';

    if (!activatorId) {
      return Response.json({ skipped: true, reason: 'No activator_id on payment' });
    }

    // Look up activator
    const activators = await base44.asServiceRole.entities.FieldActivator.filter({ id: activatorId });
    if (!activators.length) {
      return Response.json({ skipped: true, reason: 'Activator not found' });
    }
    const activator = activators[0];
    const firstName = activator.name?.split(' ')[0] || 'Field Activator';
    const email = activator.email;
    const phone = activator.phone;

    const typeLabel = {
      VERIFIED_DOOR_ATTEMPT: 'Verified Door Attempt',
      IN_PERSON_SCAN: 'In-Person Scan',
      IN_PERSON_VERIFIED_SCAN: 'Verified In-Person Scan',
      CONSULTATION: 'Consultation Completed',
      CLOSED: 'Deal Closed',
      SCAN: 'Scan Verified',
      CONSULT: 'Consultation',
      CLOSE: 'Deal Closed',
    }[type] || type;

    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1e293b;">
        <div style="background: #0B1F3B; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height: 26px;" />
          <p style="margin: 8px 0 0; font-size: 10px; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.45);">Field Activator · Payment Approved</p>
        </div>
        <div style="height: 4px; background: #10b981;"></div>
        <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
          <h2 style="font-size: 19px; font-weight: 800; margin: 0 0 6px; color: #0B1F3B;">✅ Payment Approved — $${amount}</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
            Hi ${firstName},<br/><br/>
            Your payment of <strong style="color: #10b981;">$${amount}</strong> for <strong>${typeLabel}</strong> has been <strong>approved</strong> and is queued for disbursement.
          </p>
          <div style="background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 13px; color: #065f46; line-height: 1.6;">
              <strong>Payment Type:</strong> ${typeLabel}<br/>
              <strong>Amount:</strong> $${amount}<br/>
              <strong>Status:</strong> Approved — pending disbursement
            </p>
          </div>
          <p style="font-size: 12px; color: #94a3b8;">
            Log in to your Field Activator portal to view your full payment history.<br/>
            BuyWiser Technology, Inc. · NMLS #1887767
          </p>
        </div>
      </div>
    `;

    const smsBody = `✅ BuyWiser Payment Approved: $${amount} for ${typeLabel}. Queued for disbursement. Great work, ${firstName}!`;

    await Promise.all([
      email ? resend.emails.send({
        from: 'BuyWiser Field Ops <notifications@buywiser.com>',
        to: email,
        subject: `✅ Payment Approved — $${amount} (${typeLabel})`,
        html: emailHtml,
      }).catch(err => console.error('Email error:', err.message)) : Promise.resolve(),
      phone ? sendSMS(phone, smsBody) : Promise.resolve(),
    ]);

    console.log(`Payment approval notification sent to ${activator.name} for $${amount}`);
    return Response.json({ success: true, email_sent: !!email, sms_sent: !!phone });
  } catch (error) {
    console.error('notifyPaymentApproved error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});