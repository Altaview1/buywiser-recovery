import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const FORFEIT_HOURS = 36;

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

    let forfeited = 0;

    for (const opp of stale) {
      await base44.asServiceRole.entities.VTONOpportunity.update(opp.id, {
        opportunity_status: 'forfeited',
        crm_notes: (opp.crm_notes ? opp.crm_notes + '\n\n' : '') +
          `[Auto-forfeited: no action taken within ${FORFEIT_HOURS} hours of assignment]`,
      });

      // Notify partner via email
      const partners = await base44.asServiceRole.entities.PartnerApplication.filter({ email: opp.partner_email });
      const partnerName = partners.length > 0 ? partners[0].name.split(' ')[0] : 'Partner';
      const partnerPhone = partners.length > 0 ? partners[0].phone : null;
      const addr = [opp.property_address, opp.city, opp.state].filter(Boolean).join(', ');

      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'VTON — Veteran Transition Opportunity Network',
        to: opp.partner_email,
        subject: `⚠️ Opportunity Forfeited: ${addr}`,
        body: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b;">
            <div style="background:#0B1F3B;padding:20px 24px;border-radius:8px 8px 0 0;">
              <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height:30px;" />
              <p style="margin:8px 0 0;font-size:10px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">VTON · Opportunity Forfeited</p>
            </div>
            <div style="height:4px;background:#C62828;"></div>
            <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
              <p style="font-size:15px;margin:0 0 12px;">Hi ${partnerName},</p>
              <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 16px;">
                The following opportunity was <strong style="color:#C62828;">forfeited</strong> because no action was taken within <strong>${FORFEIT_HOURS} hours</strong> of assignment.
              </p>
              <div style="background:#fef2f2;border:1px solid #fecaca;border-left:4px solid #C62828;border-radius:6px;padding:14px 18px;margin-bottom:20px;">
                <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#0f172a;">${opp.homeowner_name || 'Homeowner'}</p>
                <p style="margin:0;font-size:13px;color:#64748b;">${addr}</p>
              </div>
              <p style="font-size:13px;color:#64748b;line-height:1.6;">
                This opportunity has been returned to the VTON pool. To avoid future forfeitures, log your first contact within 36 hours of assignment.
              </p>
              <div style="text-align:center;margin-top:20px;">
                <a href="https://buywiser.base44.app/partner" style="display:inline-block;padding:12px 28px;background:#0B1F3B;color:#fff;font-weight:700;border-radius:10px;text-decoration:none;font-size:14px;">View My Dashboard →</a>
              </div>
            </div>
            <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:12px;">BuyWiser Technology, Inc. · NMLS #1887767</p>
          </div>
        `,
      });

      // SMS partner if phone on file
      if (partnerPhone) {
        const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
        const twilioAuth = Deno.env.get('TWILIO_AUTH_TOKEN');
        const twilioFrom = Deno.env.get('TWILIO_FROM_NUMBER');
        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${btoa(`${twilioSid}:${twilioAuth}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: partnerPhone,
            From: twilioFrom,
            Body: `⚠️ VTON: Opportunity forfeited — ${addr}. No action was taken within 36 hours. Log in to stay on top of new leads: https://buywiser.base44.app/partner`,
          }),
        });
      }

      forfeited++;
    }

    console.log(`Forfeited ${forfeited} stale opportunity(ies).`);
    return Response.json({ success: true, forfeited });
  } catch (error) {
    console.error('forfeitStaleOpportunities error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});