import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Entity automation — no user auth needed
    const payload = await req.json();

    const { data } = payload;

    const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || "Unknown";
    const phone = data.phone || "N/A";
    const email = data.email || "N/A";
    const loanType = data.loan_type || "N/A";
    const comments = data.comments ? `\n\nNote: ${data.comments}` : "";
    const formType = data.form_type || "contact";
    const howHeard = data.how_heard || "N/A";

    const smsMessage =
      `🔔 New BuyWiser Lead!\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Goal: ${loanType}${comments}`;

    const emailBody =
      `🔔 New Veteran Inquiry — Action Required\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Goal / Loan Type: ${loanType}\n` +
      `Form Type: ${formType}\n` +
      `Source: ${howHeard}` +
      comments +
      `\n\n---\nReply promptly — veterans respond best within the first hour.`;

    // Send SMS via Twilio
    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const fromNumber = Deno.env.get("TWILIO_FROM_NUMBER");
    const toNumber = Deno.env.get("BENNETT_PHONE");

    const credentials = btoa(`${accountSid}:${authToken}`);

    const smsRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: fromNumber,
          To: toNumber,
          Body: smsMessage,
        }),
      }
    );

    const smsResult = await smsRes.json();
    if (!smsRes.ok) {
      console.error("Twilio error:", smsResult);
    }

    // Send email alert via Base44
    const adminEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL');
    if (!adminEmail) {
      return Response.json({ error: 'ADMIN_NOTIFICATION_EMAIL not configured' }, { status: 500 });
    }
    await base44.asServiceRole.integrations.Core.SendEmail({
      to: adminEmail,
      from_name: "BuyWiser Alerts",
      subject: `🔔 New Veteran Inquiry: ${name} — ${phone}`,
      body: emailBody,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});