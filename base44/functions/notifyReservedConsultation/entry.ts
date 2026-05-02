import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const OFFICE_EMAIL = 'bennett@buywiser.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const lead = payload.data;

    if (!lead || lead.close_reason !== 'Reserved Consultation') {
      return Response.json({ skipped: true });
    }

    const agentName = lead.assigned_agent || 'Unassigned';
    const leadName = lead.name || 'Unknown Lead';
    const property = lead.address_or_link || '—';
    const phone = lead.phone || '—';
    const email = lead.email || '—';
    const notes = lead.internal_notes || 'No notes logged.';
    const date = new Date().toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Look up agent email
    const partners = await base44.asServiceRole.entities.PartnerApplication.filter({ name: agentName });
    const agentEmail = partners[0]?.email || null;

    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'VTON — Consultation Reserved',
      to: OFFICE_EMAIL,
      subject: `🗓️ Consultation Reserved: ${leadName} — Follow Up Now`,
      body: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b;">
          <div style="background:#0B1F3B;padding:20px 24px;border-radius:8px 8px 0 0;">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height:30px;" />
            <p style="margin:8px 0 0;font-size:10px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">VTON · Reserved Consultation Alert</p>
          </div>
          <div style="height:4px;background:#16A34A;"></div>
          <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">

            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #16A34A;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
              <p style="margin:0 0 4px;font-size:16px;font-weight:800;color:#15803d;">🗓️ Consultation Reserved — Follow Up Immediately</p>
              <p style="margin:0;font-size:13px;color:#166534;">${date} PT — An agent just marked this lead as <strong>Reserved Consultation</strong>. Contact the lead now while intent is high.</p>
            </div>

            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #0B1F3B;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;width:130px;">Lead Name</td>
                  <td style="padding:5px 0;font-weight:700;color:#0f172a;">${leadName}</td>
                </tr>
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;">Property</td>
                  <td style="padding:5px 0;color:#0f172a;">${property}</td>
                </tr>
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;">Phone</td>
                  <td style="padding:5px 0;font-weight:600;color:#0f172a;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;">Email</td>
                  <td style="padding:5px 0;color:#0f172a;">${email}</td>
                </tr>
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;">Agent</td>
                  <td style="padding:5px 0;color:#0f172a;">${agentName}${agentEmail ? ` (${agentEmail})` : ''}</td>
                </tr>
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;vertical-align:top;">Agent Notes</td>
                  <td style="padding:5px 0;color:#475569;white-space:pre-line;">${notes}</td>
                </tr>
              </table>
            </div>

            <div style="text-align:center;">
              <a href="https://buywiser.base44.app/leads"
                style="display:inline-block;padding:12px 28px;background:#16A34A;color:#fff;font-weight:700;border-radius:10px;text-decoration:none;font-size:14px;">
                Open Leads Dashboard →
              </a>
            </div>
          </div>
          <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:12px;">BuyWiser Technology, Inc. · NMLS #1887767</p>
        </div>
      `,
    });

    // SMS alert
    const twilioSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuth = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioFrom = Deno.env.get('TWILIO_FROM_NUMBER');
    const bennettPhone = Deno.env.get('BENNETT_PHONE');

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
          Body: `🗓️ CONSULTATION RESERVED\n\nLead: ${leadName}\nPhone: ${phone}\nProperty: ${property}\nAgent: ${agentName}\n\nFollow up now: https://buywiser.base44.app/leads`,
        }),
      });
    }

    console.log(`Reserved Consultation alert sent for "${leadName}" (agent: ${agentName}).`);
    return Response.json({ success: true });
  } catch (error) {
    console.error('notifyReservedConsultation error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});