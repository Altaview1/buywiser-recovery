import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

function formatPhone(phone) {
  if (!phone) return null;
  // If already has +, return as-is
  if (phone.startsWith('+')) return phone;
  // Otherwise clean and format
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) return `+1${cleaned}`;
  if (cleaned.length === 11) return `+${cleaned}`;
  return `+${cleaned}`;
}

Deno.serve(async (req) => {
   try {
     const base44 = createClientFromRequest(req);
     const user = await base44.auth.me();
     if (!user) {
       return Response.json({ error: 'Unauthorized — SMS requires authenticated user' }, { status: 401 });
     }
     const { message, phone } = await req.json();

    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const from = Deno.env.get("TWILIO_FROM_NUMBER");
    const rawPhone = phone || Deno.env.get("BENNETT_PHONE");
    const to = formatPhone(rawPhone);

    if (!to) {
      return Response.json({ error: "Invalid phone number" }, { status: 400 });
    }

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": "Basic " + btoa(`${accountSid}:${authToken}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: to, From: from, Body: message }),
      }
    );

  const data = await response.json();

  if (!response.ok) {
    return Response.json({ error: data.message }, { status: 500 });
  }

    return Response.json({ sid: data.sid });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});