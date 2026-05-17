import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Entity automation — no user auth needed
    const payload = await req.json();
    const lead = payload.data;

    if (!lead) return Response.json({ error: 'No lead data' }, { status: 400 });

    const address = lead.address_or_link || 'N/A';
    const email = lead.email || null;
    const name = lead.name || null;
    const phone = lead.phone || 'N/A';
    const code = lead.code ? `${lead.code}${lead.code_matched ? ' ✓ Matched' : ' (unmatched)'}` : 'None';
    const source = lead.utm_source || 'web';
    const date = new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles', dateStyle: 'medium', timeStyle: 'short' });

    // 1. Notify admin
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'BuyWiser Leads',
      to: Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || 'admin@buywiser.com',
      subject: `🔔 New Lead: ${address}`,
      body: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b;">
          <div style="background:#0a1f5c;padding:20px 24px;border-radius:8px 8px 0 0;">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height:36px;" />
          </div>
          <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
            <h2 style="margin:0 0 16px;font-size:18px;color:#0a1f5c;">New Lead Captured</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:8px 0;color:#64748b;width:130px;">Property / Link</td><td style="padding:8px 0;font-weight:600;">${address}</td></tr>
              ${name ? `<tr><td style="padding:8px 0;color:#64748b;">Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>` : ''}
              ${email ? `<tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#1d4ed8;">${email}</a></td></tr>` : ''}
              <tr><td style="padding:8px 0;color:#64748b;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Source</td><td style="padding:8px 0;">${source}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Benefit Code</td><td style="padding:8px 0;">${code}</td></tr>
              <tr><td style="padding:8px 0;color:#64748b;">Captured</td><td style="padding:8px 0;">${date} PT</td></tr>
            </table>
            <div style="margin-top:20px;">
              <a href="https://app.base44.com" style="display:inline-block;padding:10px 20px;background:#cc0000;color:#fff;font-weight:700;border-radius:8px;text-decoration:none;font-size:13px;">View in Leads Dashboard →</a>
            </div>
          </div>
          <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:12px;">BuyWiser Technology, Inc. · NMLS #1887767</p>
        </div>
      `
    });

    // 2. Thank-you email to lead (only if email provided)
    if (email) {
      const greeting = name ? `Hi ${name.split(' ')[0]},` : 'Hello,';
      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'Bennett Liss — BuyWiser',
        to: email,
        subject: 'Your Veteran Home Transition Benefit — We\'ve Received Your Request',
        body: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b;">
            <div style="background:#0a1f5c;padding:20px 24px;border-radius:8px 8px 0 0;">
              <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height:36px;" />
            </div>
            <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:32px 24px;">
              <p style="font-size:16px;margin:0 0 12px;">${greeting}</p>
              <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">
                Thank you for submitting your property information. We have received your request and I will personally review your details and reach out within <strong>one business day</strong>.
              </p>
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #cc0000;border-radius:6px;padding:16px 20px;margin:20px 0;">
                <p style="margin:0;font-size:14px;color:#475569;font-style:italic;">
                  "Your VA loan is what makes this benefit available. Before you commit to buyer representation on your next home, I want to make sure you understand exactly how to structure it."
                </p>
                <p style="margin:10px 0 0;font-size:13px;font-weight:700;color:#0a1f5c;">— Bennett Liss</p>
              </div>
              <p style="font-size:14px;line-height:1.6;color:#475569;margin:0 0 20px;">
                In the meantime, if you have any questions, please don't hesitate to reach out directly:
              </p>
              <table style="font-size:14px;color:#1e293b;">
                <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Phone</td><td><a href="tel:+18183002642" style="color:#1d4ed8;font-weight:600;">(818) 300-2642</a></td></tr>
                <tr><td style="padding:4px 12px 4px 0;color:#64748b;">Email</td><td><a href="mailto:bennett@buywiser.com" style="color:#1d4ed8;">bennett@buywiser.com</a></td></tr>
              </table>
              <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:13px;font-weight:700;color:#0a1f5c;">Bennett Liss</p>
                <p style="margin:4px 0 0;font-size:12px;color:#64748b;">CA Real Estate License #01107013 · NMLS #1524446</p>
                <p style="margin:4px 0 0;font-size:12px;color:#64748b;">BuyWiser Technology, Inc. · NMLS #1887767</p>
              </div>
            </div>
            <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:12px;">
              This is a private benefit program — not affiliated with the U.S. Department of Veterans Affairs or any government agency.
            </p>
          </div>
        `
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('onNewLead error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});