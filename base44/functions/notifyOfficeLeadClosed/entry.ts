import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await req.json();
    const opp = payload.data;

    if (!opp) return Response.json({ error: 'No opportunity data' }, { status: 400 });

    const status = opp.opportunity_status;
    const isClosed = status === 'closed_won' || status === 'closed_lost';
    if (!isClosed) return Response.json({ skipped: true });

    const statusLabel = status === 'closed_won' ? '🏆 Closed Won' : '❌ Closed Lost';
    const partnerEmail = opp.partner_email || 'Unknown';
    const homeowner = opp.homeowner_name || 'Homeowner';
    const addr = [opp.property_address, opp.city, opp.state].filter(Boolean).join(', ');
    const price = opp.estimated_price
      ? opp.estimated_price.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
      : null;
    const benefit = opp.estimated_price
      ? (opp.estimated_price * 0.015).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
      : null;
    const notes = opp.crm_notes || 'No notes logged.';
    const outcome = opp.outcome ? opp.outcome.replace(/_/g, ' ') : '—';
    const date = new Date().toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Look up partner name
    const partners = await base44.asServiceRole.entities.PartnerApplication.filter({ email: partnerEmail });
    const partnerName = partners.length > 0 ? partners[0].name : partnerEmail;
    const territory = partners.length > 0 && partners[0].territory ? partners[0].territory : '—';

    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'VTON Alert',
      to: 'bennett@buywiser.com',
      subject: `${statusLabel}: ${homeowner} — ${addr}`,
      body: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b;">

          <!-- Header -->
          <div style="background:#0B1F3B;padding:20px 24px;border-radius:8px 8px 0 0;">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height:30px;" />
            <p style="margin:8px 0 0;font-size:10px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">
              VTON · Lead Status Alert
            </p>
          </div>
          <div style="height:4px;background:${status === 'closed_won' ? '#16a34a' : '#C62828'};"></div>

          <!-- Body -->
          <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
            <p style="font-size:16px;font-weight:700;margin:0 0 4px;color:${status === 'closed_won' ? '#16a34a' : '#C62828'};">${statusLabel}</p>
            <p style="font-size:13px;color:#64748b;margin:0 0 20px;">${date} PT</p>

            <!-- Details card -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #0B1F3B;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;width:130px;">Homeowner</td>
                  <td style="padding:5px 0;font-weight:600;color:#0f172a;">${homeowner}</td>
                </tr>
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;">Property</td>
                  <td style="padding:5px 0;font-weight:600;color:#0f172a;">${addr}</td>
                </tr>
                ${price ? `<tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;">Est. Price</td>
                  <td style="padding:5px 0;font-weight:600;color:#0f172a;">${price}</td>
                </tr>` : ''}
                ${benefit ? `<tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;">GAP Benefit</td>
                  <td style="padding:5px 0;font-weight:700;color:#C62828;">up to ${benefit}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;">Partner</td>
                  <td style="padding:5px 0;font-weight:600;color:#0f172a;">${partnerName} (${partnerEmail})</td>
                </tr>
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;">Territory</td>
                  <td style="padding:5px 0;color:#0f172a;">${territory}</td>
                </tr>
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;">Outcome</td>
                  <td style="padding:5px 0;color:#0f172a;text-transform:capitalize;">${outcome}</td>
                </tr>
              </table>
            </div>

            <!-- Notes -->
            <p style="font-size:11px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;margin:0 0 6px;">Partner Notes</p>
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:6px;padding:12px 16px;font-size:13px;color:#475569;line-height:1.6;white-space:pre-line;">${notes}</div>

            <!-- CTA -->
            <div style="text-align:center;margin-top:20px;">
              <a href="https://buywiser.base44.app/partner"
                style="display:inline-block;padding:12px 28px;background:#0B1F3B;color:#fff;font-weight:700;border-radius:10px;text-decoration:none;font-size:14px;">
                View in Partner Dashboard →
              </a>
            </div>
          </div>

          <!-- Footer -->
          <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:12px;line-height:1.6;">
            VTON, Veteran's Next Home™ — BuyWiser Technology, Inc. · NMLS #1887767
          </p>
        </div>
      `,
    });

    console.log(`Office notified: lead closed (${status}) for ${homeowner} at ${addr}`);
    return Response.json({ success: true });
  } catch (error) {
    console.error('notifyOfficeLeadClosed error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});