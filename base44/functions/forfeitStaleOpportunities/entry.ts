import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const FORFEIT_HOURS = 36;
const OFFICE_EMAIL = 'bennett@buywiser.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get all opportunities still in "assigned" status
    const opps = await base44.asServiceRole.entities.VTONOpportunity.filter(
      { opportunity_status: 'assigned' },
      '-created_date',
      500
    );

    const cutoff = new Date(Date.now() - FORFEIT_HOURS * 60 * 60 * 1000);
    const stale = opps.filter(o => new Date(o.created_date) < cutoff);

    if (stale.length === 0) {
      console.log('No stale opportunities found.');
      return Response.json({ success: true, forfeited: 0 });
    }

    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuth = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioFrom = Deno.env.get('TWILIO_FROM_NUMBER');
    const bennettPhone = Deno.env.get('BENNETT_PHONE');

    const forfeitedList = [];

    for (const opp of stale) {
      const addr = [opp.property_address, opp.city, opp.state].filter(Boolean).join(', ');
      const previousPartner = opp.partner_email;

      // Mark as forfeited, clear partner assignment, flag for reassignment
      await base44.asServiceRole.entities.VTONOpportunity.update(opp.id, {
        opportunity_status: 'forfeited',
        needs_reassignment: true,
        forfeited_from_partner: previousPartner,
        partner_email: '',
        crm_notes: (opp.crm_notes ? opp.crm_notes + '\n\n' : '') +
          `[Auto-forfeited ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PT: no action taken within ${FORFEIT_HOURS} hours. Returned to pool for reassignment.]`,
      });

      // Look up partner info
      const partners = await base44.asServiceRole.entities.PartnerApplication.filter({ email: previousPartner });
      const partnerName = partners.length > 0 ? partners[0].name : previousPartner;
      const partnerPhone = partners.length > 0 ? partners[0].phone : null;
      const firstName = partners.length > 0 ? partners[0].name.split(' ')[0] : 'Partner';

      forfeitedList.push({ opp, addr, partnerName, previousPartner });

      // --- Notify partner ---
      if (previousPartner) {
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'VTON — Veteran Transition Opportunity Network',
          to: previousPartner,
          subject: `⚠️ Opportunity Forfeited: ${addr}`,
          body: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b;">
              <div style="background:#0B1F3B;padding:20px 24px;border-radius:8px 8px 0 0;">
                <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height:30px;" />
                <p style="margin:8px 0 0;font-size:10px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">VTON · Opportunity Forfeited</p>
              </div>
              <div style="height:4px;background:#C62828;"></div>
              <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
                <p style="font-size:15px;margin:0 0 12px;">Hi ${firstName},</p>
                <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 16px;">
                  The following opportunity was <strong style="color:#C62828;">forfeited</strong> because no action was taken within <strong>${FORFEIT_HOURS} hours</strong> of assignment. It has been <strong>returned to the VTON pool</strong> for reassignment.
                </p>
                <div style="background:#fef2f2;border:1px solid #fecaca;border-left:4px solid #C62828;border-radius:6px;padding:14px 18px;margin-bottom:20px;">
                  <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#0f172a;">${opp.homeowner_name || 'Homeowner'}</p>
                  <p style="margin:0;font-size:13px;color:#64748b;">${addr}</p>
                </div>
                <p style="font-size:13px;color:#64748b;line-height:1.6;">
                  To avoid future forfeitures, log your first contact within 36 hours of assignment in the partner dashboard.
                </p>
                <div style="text-align:center;margin-top:20px;">
                  <a href="https://buywiser.base44.app/partner" style="display:inline-block;padding:12px 28px;background:#0B1F3B;color:#fff;font-weight:700;border-radius:10px;text-decoration:none;font-size:14px;">View My Dashboard →</a>
                </div>
              </div>
              <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:12px;">BuyWiser Technology, Inc. · NMLS #1887767</p>
            </div>
          `,
        });

        if (partnerPhone) {
          await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${btoa(`${twilioSid}:${twilioAuth}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              To: partnerPhone,
              From: twilioFrom,
              Body: `⚠️ VTON: Opportunity forfeited — ${addr}. No action in 36 hrs. Lead returned to pool. Log in: https://buywiser.base44.app/partner`,
            }),
          });
        }
      }
    }

    // --- Office alert: consolidated digest ---
    const rows = forfeitedList.map(({ opp, addr, partnerName }) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#0f172a;">${opp.homeowner_name || '—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#475569;">${addr}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#C62828;font-weight:600;">${partnerName}</td>
      </tr>`).join('');

    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'VTON — Office Alert',
      to: OFFICE_EMAIL,
      subject: `🔁 ${forfeitedList.length} Lead(s) Returned to Pool — Reassignment Needed`,
      body: `
        <div style="font-family:sans-serif;max-width:640px;margin:0 auto;color:#1e293b;">
          <div style="background:#0B1F3B;padding:20px 24px;border-radius:8px 8px 0 0;">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height:30px;" />
            <p style="margin:8px 0 0;font-size:10px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">VTON · Reassignment Required</p>
          </div>
          <div style="height:4px;background:#C62828;"></div>
          <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
            <p style="font-size:15px;margin:0 0 4px;font-weight:700;">Hi Bennett,</p>
            <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 20px;">
              <strong style="color:#C62828;">${forfeitedList.length} opportunity(ies)</strong> were auto-forfeited after 36 hours of inactivity and have been <strong>returned to the unassigned pool</strong>. Each has been flagged <code style="background:#f1f5f9;padding:1px 5px;border-radius:3px;font-size:12px;">needs_reassignment = true</code> in the system.
            </p>

            <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:20px;">
              <thead>
                <tr style="background:#f8fafc;">
                  <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Homeowner</th>
                  <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Property</th>
                  <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Forfeited By</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>

            <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:14px 18px;margin-bottom:20px;font-size:13px;color:#92400e;line-height:1.6;">
              <strong>Action needed:</strong> Log in to the VTON admin dashboard, locate leads flagged for reassignment, and assign each to a new partner.
            </div>

            <div style="text-align:center;">
              <a href="https://buywiser.base44.app/leads" style="display:inline-block;padding:12px 28px;background:#C62828;color:#fff;font-weight:700;border-radius:10px;text-decoration:none;font-size:14px;">Open Admin Dashboard →</a>
            </div>
          </div>
          <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:12px;">BuyWiser Technology, Inc. · NMLS #1887767</p>
        </div>
      `,
    });

    // SMS Bennett
    if (bennettPhone) {
      await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${twilioSid}:${twilioAuth}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: bennettPhone,
          From: twilioFrom,
          Body: `🔁 VTON: ${forfeitedList.length} lead(s) forfeited & returned to pool for reassignment.\n\n${forfeitedList.map(f => `• ${f.opp.homeowner_name || 'Homeowner'} — ${f.addr} (was: ${f.partnerName})`).join('\n')}\n\nOpen admin: https://buywiser.base44.app/leads`,
        }),
      });
    }

    console.log(`Forfeited ${forfeitedList.length} opportunity(ies) and notified office.`);
    return Response.json({ success: true, forfeited: forfeitedList.length });
  } catch (error) {
    console.error('forfeitStaleOpportunities error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});