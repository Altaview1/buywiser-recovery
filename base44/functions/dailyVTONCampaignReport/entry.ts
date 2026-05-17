import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@3.2.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const adminEmail = Deno.env.get('OFFICE_ADMIN_EMAIL') || Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || 'admin@buywiser.com';

    // Fetch all data in parallel
    const [leads, emailLogs] = await Promise.all([
      base44.asServiceRole.entities.VTONLead.list(),
      base44.asServiceRole.entities.VTONEmailLog.list('-sent_date', 1000)
    ]);

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Lead stats
    const totalLeads = leads.length;
    const newLeads24h = leads.filter(l => new Date(l.created_date) > yesterday).length;
    const activeLeads = leads.filter(l => l.suppression_status === 'active').length;
    const suppressed = leads.filter(l => l.suppression_status !== 'active').length;
    const booked = leads.filter(l => l.appointment_booked).length;
    const metaSynced = leads.filter(l => l.facebook_audience_synced).length;

    // Outreach stats
    const smsSent = leads.filter(l => l.sms_status === 'sent' || l.sms_status === 'opened').length;
    const emailSent = leads.filter(l => l.email_status === 'sent' || l.email_status === 'opened').length;
    const lobSent = leads.filter(l => l.lob_letter_id).length;
    const lobDelivered = leads.filter(l => l.lob_delivery_status === 'delivered').length;
    const lobFailed = leads.filter(l => ['failed', 'returned'].includes(l.lob_delivery_status)).length;
    const lobProcessing = leads.filter(l => l.lob_letter_id && !l.lob_delivery_status).length;

    const untouched = leads.filter(l =>
      (l.sms_status === 'pending' || !l.sms_status) &&
      (l.email_status === 'pending' || !l.email_status) &&
      !l.lob_letter_id
    ).length;
    const reachRate = totalLeads > 0 ? Math.round((totalLeads - untouched) / totalLeads * 100) : 0;

    // Email log stats
    const emailsLast24h = emailLogs.filter(l => new Date(l.sent_date) > yesterday).length;
    const emailsThisWeek = emailLogs.filter(l => new Date(l.sent_date) > weekAgo).length;
    const emailsFailed = emailLogs.filter(l => l.status === 'failed' || l.status === 'bounced').length;

    // Pipeline breakdown
    const pipeline = {
      New: leads.filter(l => (l.contact_status || 'New') === 'New').length,
      Contacted: leads.filter(l => l.contact_status === 'Contacted').length,
      Qualified: leads.filter(l => l.contact_status === 'Qualified').length
    };

    // Recent bookings (last 7 days)
    const recentBookings = leads
      .filter(l => l.appointment_booked && l.appointment_date && new Date(l.appointment_date) > weekAgo)
      .map(l => `${l.first_name} ${l.last_name} — ${l.property_address}, ${l.city}`);

    const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;background:#f8fafc;">
        <!-- Header -->
        <div style="background:#0B1F3B;padding:28px 32px;border-radius:8px 8px 0 0;">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" height="36" style="margin-bottom:12px;" />
          <h1 style="color:white;margin:0;font-size:22px;">VTON™ Daily Campaign Report</h1>
          <p style="color:#93c5fd;margin:4px 0 0;font-size:14px;">${dateStr}</p>
        </div>

        <div style="padding:24px 32px;background:white;">

          <!-- Lead Overview -->
          <h2 style="color:#0B1F3B;font-size:15px;margin:0 0 12px;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">📊 Lead Overview</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:8px 12px;background:#f0f9ff;border-radius:6px;width:25%">
                <div style="font-size:28px;font-weight:bold;color:#1d4ed8;">${totalLeads}</div>
                <div style="font-size:11px;color:#64748b;text-transform:uppercase;font-weight:600;">Total Leads</div>
              </td>
              <td style="width:2%;"></td>
              <td style="padding:8px 12px;background:#f0fdf4;border-radius:6px;width:25%">
                <div style="font-size:28px;font-weight:bold;color:#16a34a;">${newLeads24h}</div>
                <div style="font-size:11px;color:#64748b;text-transform:uppercase;font-weight:600;">New (24h)</div>
              </td>
              <td style="width:2%;"></td>
              <td style="padding:8px 12px;background:#fefce8;border-radius:6px;width:25%">
                <div style="font-size:28px;font-weight:bold;color:#ca8a04;">${booked}</div>
                <div style="font-size:11px;color:#64748b;text-transform:uppercase;font-weight:600;">Appts Booked</div>
              </td>
              <td style="width:2%;"></td>
              <td style="padding:8px 12px;background:#fdf4ff;border-radius:6px;width:25%">
                <div style="font-size:28px;font-weight:bold;color:#9333ea;">${reachRate}%</div>
                <div style="font-size:11px;color:#64748b;text-transform:uppercase;font-weight:600;">Reach Rate</div>
              </td>
            </tr>
          </table>

          <!-- Outreach Channels -->
          <h2 style="color:#0B1F3B;font-size:15px;margin:0 0 12px;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">📬 Outreach Channels</h2>
          <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px;">
            <thead>
              <tr style="background:#f8fafc;">
                <th style="padding:8px 12px;text-align:left;color:#475569;font-weight:600;">Channel</th>
                <th style="padding:8px 12px;text-align:right;color:#475569;font-weight:600;">Sent</th>
                <th style="padding:8px 12px;text-align:right;color:#475569;font-weight:600;">Delivered</th>
                <th style="padding:8px 12px;text-align:right;color:#475569;font-weight:600;">Failed</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-top:1px solid #f1f5f9;">
                <td style="padding:8px 12px;color:#334155;">📧 Email</td>
                <td style="padding:8px 12px;text-align:right;font-weight:600;">${emailSent}</td>
                <td style="padding:8px 12px;text-align:right;color:#16a34a;">—</td>
                <td style="padding:8px 12px;text-align:right;color:${emailsFailed > 0 ? '#dc2626' : '#94a3b8'};">${emailsFailed}</td>
              </tr>
              <tr style="border-top:1px solid #f1f5f9;">
                <td style="padding:8px 12px;color:#334155;">💬 SMS</td>
                <td style="padding:8px 12px;text-align:right;font-weight:600;">${smsSent}</td>
                <td style="padding:8px 12px;text-align:right;color:#16a34a;">—</td>
                <td style="padding:8px 12px;text-align:right;color:#94a3b8;">—</td>
              </tr>
              <tr style="border-top:1px solid #f1f5f9;">
                <td style="padding:8px 12px;color:#334155;">📮 Lob Direct Mail</td>
                <td style="padding:8px 12px;text-align:right;font-weight:600;">${lobSent}</td>
                <td style="padding:8px 12px;text-align:right;color:#16a34a;">${lobDelivered}</td>
                <td style="padding:8px 12px;text-align:right;color:${lobFailed > 0 ? '#dc2626' : '#94a3b8'};">${lobFailed}</td>
              </tr>
            </tbody>
          </table>

          <!-- Pipeline -->
          <h2 style="color:#0B1F3B;font-size:15px;margin:0 0 12px;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">🔄 Lead Pipeline</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:8px 12px;background:#f8fafc;border-radius:6px;text-align:center;width:30%;">
                <div style="font-size:24px;font-weight:bold;color:#475569;">${pipeline.New}</div>
                <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:600;">New</div>
              </td>
              <td style="width:5%;text-align:center;color:#cbd5e1;font-size:20px;">→</td>
              <td style="padding:8px 12px;background:#eff6ff;border-radius:6px;text-align:center;width:30%;">
                <div style="font-size:24px;font-weight:bold;color:#2563eb;">${pipeline.Contacted}</div>
                <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:600;">Contacted</div>
              </td>
              <td style="width:5%;text-align:center;color:#cbd5e1;font-size:20px;">→</td>
              <td style="padding:8px 12px;background:#f0fdf4;border-radius:6px;text-align:center;width:30%;">
                <div style="font-size:24px;font-weight:bold;color:#16a34a;">${pipeline.Qualified}</div>
                <div style="font-size:11px;color:#94a3b8;text-transform:uppercase;font-weight:600;">Qualified</div>
              </td>
            </tr>
          </table>

          <!-- Health Indicators -->
          <h2 style="color:#0B1F3B;font-size:15px;margin:0 0 12px;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">🔍 Health Indicators</h2>
          <table style="width:100%;border-collapse:collapse;font-size:13px;margin-bottom:24px;">
            <tr style="border-top:1px solid #f1f5f9;">
              <td style="padding:8px 12px;color:#334155;">Active (not suppressed)</td>
              <td style="padding:8px 12px;text-align:right;font-weight:600;color:#16a34a;">${activeLeads}</td>
            </tr>
            <tr style="border-top:1px solid #f1f5f9;">
              <td style="padding:8px 12px;color:#334155;">Suppressed / Opted Out</td>
              <td style="padding:8px 12px;text-align:right;font-weight:600;color:${suppressed > 0 ? '#dc2626' : '#94a3b8'};">${suppressed}</td>
            </tr>
            <tr style="border-top:1px solid #f1f5f9;">
              <td style="padding:8px 12px;color:#334155;">Untouched (zero outreach)</td>
              <td style="padding:8px 12px;text-align:right;font-weight:600;color:${untouched > 0 ? '#f59e0b' : '#16a34a'};">${untouched}</td>
            </tr>
            <tr style="border-top:1px solid #f1f5f9;">
              <td style="padding:8px 12px;color:#334155;">Meta Audience Synced</td>
              <td style="padding:8px 12px;text-align:right;font-weight:600;color:#7c3aed;">${metaSynced}</td>
            </tr>
            <tr style="border-top:1px solid #f1f5f9;">
              <td style="padding:8px 12px;color:#334155;">Lob Letters In Transit</td>
              <td style="padding:8px 12px;text-align:right;font-weight:600;color:#f59e0b;">${lobProcessing}</td>
            </tr>
            <tr style="border-top:1px solid #f1f5f9;">
              <td style="padding:8px 12px;color:#334155;">Emails Sent (last 24h)</td>
              <td style="padding:8px 12px;text-align:right;font-weight:600;">${emailsLast24h}</td>
            </tr>
            <tr style="border-top:1px solid #f1f5f9;">
              <td style="padding:8px 12px;color:#334155;">Emails Sent (last 7 days)</td>
              <td style="padding:8px 12px;text-align:right;font-weight:600;">${emailsThisWeek}</td>
            </tr>
          </table>

          ${recentBookings.length > 0 ? `
          <!-- Recent Bookings -->
          <h2 style="color:#0B1F3B;font-size:15px;margin:0 0 12px;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">🗓️ Recent Bookings (Last 7 Days)</h2>
          <ul style="margin:0 0 24px;padding-left:20px;">
            ${recentBookings.map(b => `<li style="padding:4px 0;font-size:13px;color:#334155;">${b}</li>`).join('')}
          </ul>
          ` : ''}

          <!-- CTA -->
          <div style="text-align:center;margin-top:8px;">
            <a href="https://app.base44.com/vton-campaign" style="display:inline-block;background:#0B1F3B;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Open Campaign Dashboard →</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding:16px 32px;background:#f1f5f9;border-radius:0 0 8px 8px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#94a3b8;">BuyWiser Technology, Inc. · NMLS #1887767 · VTON™ Campaign Report</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'VTON Reports <notifications@buywiser.com>',
      to: adminEmail,
      subject: `📊 VTON Daily Report — ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} | ${totalLeads} leads · ${booked} booked · ${reachRate}% reached`,
      html
    });

    console.log(`Daily VTON report sent to ${adminEmail}`);
    return Response.json({
      success: true,
      message: 'Daily report sent',
      stats: { totalLeads, newLeads24h, booked, reachRate, emailsLast24h }
    });

  } catch (error) {
    console.error('dailyVTONCampaignReport error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});