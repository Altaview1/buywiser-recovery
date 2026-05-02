import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const OFFICE_EMAIL = 'bennett@buywiser.com';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const lead = payload.data;

    if (!lead || lead.status !== 'Closed') {
      return Response.json({ skipped: true });
    }

    const agentName = lead.assigned_agent || 'Unassigned';
    const leadName = lead.name || 'Unknown Lead';
    const property = lead.address_or_link || '—';
    const date = new Date().toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Look up agent email and deposit info
    const partners = await base44.asServiceRole.entities.PartnerApplication.filter({ name: agentName });
    const partner = partners[0] || null;
    const agentEmail = partner?.email || null;
    const depositBalance = partner?.deposit_balance || 2000;
    const verifiedConversations = partner?.verified_conversations || 0;
    const depositUsed = verifiedConversations * 200;
    const depositRemaining = Math.max(0, depositBalance - depositUsed);

    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'VTON — Lead Closed Alert',
      to: OFFICE_EMAIL,
      subject: `✅ Lead Closed & Refund Triggered: ${leadName}`,
      body: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b;">
          <div style="background:#0B1F3B;padding:20px 24px;border-radius:8px 8px 0 0;">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height:30px;" />
            <p style="margin:8px 0 0;font-size:10px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">VTON · Lead Closed &amp; Refund Triggered</p>
          </div>
          <div style="height:4px;background:#16a34a;"></div>
          <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">

            <p style="font-size:16px;font-weight:700;color:#16a34a;margin:0 0 4px;">✅ Lead Closed</p>
            <p style="font-size:13px;color:#64748b;margin:0 0 20px;">${date} PT</p>

            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-left:4px solid #16a34a;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;width:140px;">Lead Name</td>
                  <td style="padding:5px 0;font-weight:600;color:#0f172a;">${leadName}</td>
                </tr>
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;">Property</td>
                  <td style="padding:5px 0;color:#0f172a;">${property}</td>
                </tr>
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;">Agent</td>
                  <td style="padding:5px 0;font-weight:600;color:#0f172a;">${agentName}${agentEmail ? ` (${agentEmail})` : ''}</td>
                </tr>
                ${lead.internal_notes ? `
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;vertical-align:top;">Notes</td>
                  <td style="padding:5px 0;color:#475569;white-space:pre-line;">${lead.internal_notes}</td>
                </tr>` : ''}
              </table>
            </div>

            ${partner ? `
            <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:14px 18px;margin-bottom:20px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#3b82f6;">Agent Deposit Status</p>
              <table style="width:100%;font-size:13px;border-collapse:collapse;">
                <tr>
                  <td style="padding:3px 12px 3px 0;color:#64748b;">Verified Conversations</td>
                  <td style="font-weight:600;color:#0f172a;">${verifiedConversations}</td>
                </tr>
                <tr>
                  <td style="padding:3px 12px 3px 0;color:#64748b;">Deposit Used</td>
                  <td style="font-weight:600;color:#0f172a;">$${depositUsed.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding:3px 12px 3px 0;color:#64748b;">Deposit Remaining</td>
                  <td style="font-weight:700;color:#C62828;">$${depositRemaining.toLocaleString()}</td>
                </tr>
              </table>
            </div>` : ''}

            <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:14px 18px;margin-bottom:20px;font-size:13px;color:#92400e;line-height:1.6;">
              <strong>Action needed:</strong> Process any applicable deposit refund or commission credit for this closed lead in your records.
            </div>

            <div style="text-align:center;">
              <a href="https://buywiser.base44.app/leads"
                style="display:inline-block;padding:12px 28px;background:#0B1F3B;color:#fff;font-weight:700;border-radius:10px;text-decoration:none;font-size:14px;">
                Open Leads Dashboard →
              </a>
            </div>
          </div>
          <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:12px;">BuyWiser Technology, Inc. · NMLS #1887767</p>
        </div>
      `,
    });

    // SMS alert to Bennett
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
          Body: `✅ Lead Closed & Refund Triggered\n\nLead: ${leadName}\nProperty: ${property}\nAgent: ${agentName}\nDeposit Remaining: $${depositRemaining.toLocaleString()}\n\nReview: https://buywiser.base44.app/leads`,
        }),
      });
    }

    console.log(`Lead closed alert sent for "${leadName}" assigned to ${agentName}.`);
    return Response.json({ success: true });
  } catch (error) {
    console.error('notifyLeadClosedRefund error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});