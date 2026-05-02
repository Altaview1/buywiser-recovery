import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const OFFICE_EMAIL = 'bennett@buywiser.com';
const STALE_DAYS = 7;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const cutoff = new Date(Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000);

    // Get all leads with "Contacted" or "Qualified" status (in-progress statuses)
    const allLeads = await base44.asServiceRole.entities.Lead.list('-updated_date', 500);

    const staleLeads = allLeads.filter(lead => {
      const inProgress = lead.status === 'Contacted' || lead.status === 'Qualified';
      const lastUpdated = new Date(lead.updated_date || lead.created_date);
      return inProgress && lastUpdated < cutoff;
    });

    if (staleLeads.length === 0) {
      console.log('No stale in-progress leads found.');
      return Response.json({ success: true, reminded: 0 });
    }

    // Group by assigned agent
    const byAgent = {};
    for (const lead of staleLeads) {
      const agent = lead.assigned_agent || 'Unassigned';
      if (!byAgent[agent]) byAgent[agent] = [];
      byAgent[agent].push(lead);
    }

    // Look up approved partners to get their emails
    const partners = await base44.asServiceRole.entities.PartnerApplication.filter({ status: 'approved' }, 'name', 200);
    const partnerByName = {};
    for (const p of partners) {
      partnerByName[p.name] = p;
    }

    let totalReminded = 0;
    const officeRows = [];

    for (const [agentName, leads] of Object.entries(byAgent)) {
      const partner = partnerByName[agentName];
      const agentEmail = partner?.email;
      const firstName = agentName.split(' ')[0];

      const leadRows = leads.map(lead => {
        const daysSince = Math.floor((Date.now() - new Date(lead.updated_date || lead.created_date)) / 86400000);
        const addr = lead.address_or_link || '—';
        const name = lead.name || '—';
        const statusColor = lead.status === 'Qualified' ? '#7c3aed' : '#d97706';
        officeRows.push({ lead, agentName, daysSince });
        return `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#0f172a;">${name}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#475569;max-width:200px;">${addr}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;font-weight:700;color:${statusColor};">${lead.status}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#C62828;font-weight:600;">${daysSince}d ago</td>
          </tr>`;
      }).join('');

      // Send individual reminder to each agent if we have their email
      if (agentEmail) {
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'VTON — Lead Follow-Up Reminder',
          to: agentEmail,
          subject: `⏰ Follow-Up Needed: ${leads.length} Lead${leads.length !== 1 ? 's' : ''} Awaiting Action`,
          body: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b;">
              <div style="background:#0B1F3B;padding:20px 24px;border-radius:8px 8px 0 0;">
                <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height:30px;" />
                <p style="margin:8px 0 0;font-size:10px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">VTON · Daily Follow-Up Reminder</p>
              </div>
              <div style="height:4px;background:#C62828;"></div>
              <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
                <p style="font-size:15px;margin:0 0 4px;">Hi ${firstName},</p>
                <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 20px;">
                  You have <strong style="color:#C62828;">${leads.length} lead${leads.length !== 1 ? 's' : ''}</strong> that ${leads.length !== 1 ? 'have' : 'has'} been in-progress for <strong>more than ${STALE_DAYS} days</strong> without a status update. Please review and follow up.
                </p>

                <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:20px;">
                  <thead>
                    <tr style="background:#f8fafc;">
                      <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Name</th>
                      <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Property</th>
                      <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Status</th>
                      <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>${leadRows}</tbody>
                </table>

                <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:14px 18px;margin-bottom:20px;font-size:13px;color:#92400e;line-height:1.6;">
                  <strong>Action needed:</strong> Log in to update each lead's status, add notes, or mark as Closed/Lost so it no longer appears on follow-up reminders.
                </div>

                <div style="text-align:center;">
                  <a href="https://buywiser.base44.app/leads"
                    style="display:inline-block;padding:12px 28px;background:#C62828;color:#fff;font-weight:700;border-radius:10px;text-decoration:none;font-size:14px;">
                    Open Leads Dashboard →
                  </a>
                </div>
              </div>
              <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:12px;line-height:1.6;">
                BuyWiser Technology, Inc. · NMLS #1887767
              </p>
            </div>
          `,
        });
        totalReminded++;
        console.log(`Reminder sent to ${agentEmail} for ${leads.length} stale lead(s).`);
      }
    }

    // Send office digest
    const officeTableRows = officeRows.map(({ lead, agentName, daysSince }) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#0f172a;">${lead.name || '—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#475569;">${lead.address_or_link || '—'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#0f172a;">${agentName}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;font-weight:600;color:#C62828;">${daysSince}d ago</td>
      </tr>`).join('');

    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'VTON — Office Digest',
      to: OFFICE_EMAIL,
      subject: `📋 Daily Follow-Up Digest: ${staleLeads.length} Stale Lead${staleLeads.length !== 1 ? 's' : ''}`,
      body: `
        <div style="font-family:sans-serif;max-width:640px;margin:0 auto;color:#1e293b;">
          <div style="background:#0B1F3B;padding:20px 24px;border-radius:8px 8px 0 0;">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height:30px;" />
            <p style="margin:8px 0 0;font-size:10px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">VTON · Daily Stale Lead Digest</p>
          </div>
          <div style="height:4px;background:#C62828;"></div>
          <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
            <p style="font-size:15px;margin:0 0 4px;font-weight:700;">Hi Bennett,</p>
            <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 20px;">
              <strong style="color:#C62828;">${staleLeads.length} lead${staleLeads.length !== 1 ? 's' : ''}</strong> across <strong>${Object.keys(byAgent).length} agent${Object.keys(byAgent).length !== 1 ? 's' : ''}</strong> have been in-progress for more than ${STALE_DAYS} days. Reminder emails have been sent to agents with registered emails.
            </p>

            <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:20px;">
              <thead>
                <tr style="background:#f8fafc;">
                  <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Lead</th>
                  <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Property</th>
                  <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Agent</th>
                  <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Last Updated</th>
                </tr>
              </thead>
              <tbody>${officeTableRows}</tbody>
            </table>

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

    console.log(`Daily follow-up reminder complete. ${staleLeads.length} stale leads, ${totalReminded} agent(s) notified.`);
    return Response.json({ success: true, staleLeads: staleLeads.length, agentsNotified: totalReminded });
  } catch (error) {
    console.error('dailyLeadFollowUpReminder error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});