import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { email, firstName, code } = await req.json();

    if (!email || !code) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background:#f5f5f0;font-family:sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:32px 0;"><tr><td align="center"><table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:2px solid #003366;"><tr><td style="background:#003366;padding:14px 24px;border-bottom:3px solid #c9a84c;"><p style="margin:0;color:#c9a84c;font-size:11px;letter-spacing:0.2em;font-weight:900;text-transform:uppercase;">California Homebuyers Rebate Coupon Program</p></td></tr><tr><td style="padding:32px 24px;"><p style="font-size:18px;font-weight:bold;color:#003366;font-family:Georgia,serif;margin-bottom:8px;">Email Verification</p><p style="font-size:14px;color:#444;line-height:1.6;margin-bottom:24px;">Hello ${firstName || ""},<br><br>To receive your official CA Homebuyers Rebate Coupon, please verify your email address using the code below.</p><div style="background:#003366;border:2px solid #c9a84c;padding:24px;text-align:center;margin-bottom:24px;"><p style="margin:0 0 6px;color:#c9a84c;font-size:10px;letter-spacing:0.3em;font-weight:900;text-transform:uppercase;">Your Verification Code</p><p style="margin:0;color:#ffffff;font-size:42px;font-weight:900;font-family:monospace;letter-spacing:0.25em;">${code}</p></div><p style="font-size:12px;color:#777;line-height:1.6;">This code expires in 15 minutes. If you did not request this, please disregard this email.</p></td></tr><tr><td style="background:#f5f5f0;padding:14px 24px;border-top:1px solid #e0d9c8;"><p style="margin:0;font-size:10px;color:#999;">BuyWiser Technology, Inc. NMLS 1887767. Not state-administered or state-funded.</p></td></tr></table></td></tr></table></body></html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "BuyWiser Rebates <onboarding@resend.dev>",
        to: [email],
        subject: "Your CA Homebuyers Coupon — Email Verification Code",
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return Response.json({ error: "Failed to send email", details: err }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("sendVerificationEmail error:", error);
    return Response.json({ error: error.message || "Failed to send email" }, { status: 500 });
  }
});