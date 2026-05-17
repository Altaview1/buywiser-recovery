import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
   try {
     const base44 = createClientFromRequest(req);
     const user = await base44.auth.me();
     if (!user || user.role !== 'admin') {
       return Response.json({ error: 'Admin access required' }, { status: 403 });
     }
     const { buyerName, buyerPhone, serviceName, expert, note, tokenCost, poolRemaining } = await req.json();

    const smsBody = [
      `🔓 SmartBuy™ Unlock Request!`,
      `Service: ${serviceName}`,
      `Expert: ${expert}`,
      `Buyer: ${buyerName}`,
      `Phone: ${buyerPhone}`,
      note ? `Note: ${note}` : null,
      `Token Cost: $${Number(tokenCost).toLocaleString()}`,
      `Pool After: $${Number(poolRemaining).toLocaleString()}`,
    ].filter(Boolean).join('\n');

    const emailBody = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0f172a;color:#e2e8f0;padding:28px;border-radius:12px;">
        <div style="background:#f59e0b;color:#1e293b;font-size:11px;font-weight:900;letter-spacing:3px;text-transform:uppercase;padding:8px 14px;border-radius:6px;display:inline-block;margin-bottom:20px;">
          🔓 SmartBuy™ Unlock Request
        </div>
        <h2 style="margin:0 0 4px;font-size:22px;color:#fff;">${buyerName} wants help</h2>
        <p style="margin:0 0 20px;color:#94a3b8;font-size:14px;">A SmartBuy™ user just unlocked professional support — reach out now.</p>

        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          ${[
            ['Service Requested', serviceName],
            ['Expert Assigned', expert],
            ['Buyer Name', buyerName],
            ['Buyer Phone', `<a href="tel:${buyerPhone.replace(/\D/g,'')}" style="color:#34d399;">${buyerPhone}</a>`],
            ['Note', note || '—'],
            ['Token Cost', `$${Number(tokenCost).toLocaleString()}`],
            ['Pool Balance After', `$${Number(poolRemaining).toLocaleString()}`],
          ].map(([label, value]) => `
            <tr>
              <td style="padding:8px 10px;background:#1e293b;border-bottom:1px solid #0f172a;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;width:40%;">${label}</td>
              <td style="padding:8px 10px;background:#1e293b;border-bottom:1px solid #0f172a;font-size:13px;color:#e2e8f0;">${value}</td>
            </tr>
          `).join('')}
        </table>

        <a href="tel:${buyerPhone.replace(/\D/g,'')}" style="display:inline-block;background:#f59e0b;color:#1e293b;font-weight:900;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;">
          📞 Call ${buyerName} Now
        </a>
        <p style="margin-top:16px;font-size:11px;color:#334155;">BuyWiser SmartBuy™ · NMLS #1887767</p>
      </div>
    `;

    // Send SMS and email in parallel
    await Promise.all([
      base44.asServiceRole.integrations.Core.SendEmail({
        to: Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || 'admin@buywiser.com',
        from_name: 'SmartBuy™ Alerts',
        subject: `🔓 Unlock Request — ${buyerName} needs ${serviceName}`,
        body: emailBody,
      }),
      base44.functions.invoke('sendSMS', { message: smsBody }),
    ]);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});