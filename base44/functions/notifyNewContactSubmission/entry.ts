import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const { data } = payload;

    const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || "Unknown";
    const phone = data.phone || "N/A";
    const email = data.email || "N/A";
    const loanType = data.loan_type || "N/A";
    const comments = data.comments ? `\nNote: ${data.comments}` : "";

    const message =
      `🔔 New BuyWiser Lead!\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Goal: ${loanType}${comments}`;

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
          Body: message,
        }),
      }
    );

    const result = await smsRes.json();

    if (!smsRes.ok) {
      console.error("Twilio error:", result);
      return Response.json({ error: result.message }, { status: 500 });
    }

    return Response.json({ success: true, sid: result.sid });
  } catch (error) {
    console.error("Error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});