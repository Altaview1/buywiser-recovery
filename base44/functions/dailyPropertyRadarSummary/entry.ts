import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@3.2.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

/**
 * Daily PropertyRadar Import Summary Report
 * Sends email summary of yesterday's imported opportunities
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Admin-only function
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Calculate yesterday's date range
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch opportunities created yesterday
    const opportunities = await base44.entities.VTONOpportunity.list();
    const yesterdayOpps = opportunities.filter(opp => {
      const createdDate = new Date(opp.created_date);
      return createdDate >= yesterday && createdDate < today;
    });

    // Calculate statistics
    const totalImported = yesterdayOpps.length;
    const byPriority = {
      high: yesterdayOpps.filter(o => o.priority === 'high').length,
      medium: yesterdayOpps.filter(o => o.priority === 'medium').length,
      low: yesterdayOpps.filter(o => o.priority === 'low').length
    };
    
    const byStatus = {
      assigned: yesterdayOpps.filter(o => o.opportunity_status === 'assigned').length,
      contacted: yesterdayOpps.filter(o => o.opportunity_status === 'contacted').length,
      conversation_verified: yesterdayOpps.filter(o => o.opportunity_status === 'conversation_verified').length,
      consultation_scheduled: yesterdayOpps.filter(o => o.opportunity_status === 'consultation_scheduled').length,
      closed_won: yesterdayOpps.filter(o => o.opportunity_status === 'closed_won').length,
      closed_lost: yesterdayOpps.filter(o => o.opportunity_status === 'closed_lost').length,
      forfeited: yesterdayOpps.filter(o => o.opportunity_status === 'forfeited').length
    };

    // Calculate average metrics
    const avgDistressScore = yesterdayOpps.length > 0 
      ? Math.round(yesterdayOpps.reduce((sum, o) => sum + (o.distress_score || 0), 0) / yesterdayOpps.length)
      : 0;
    
    const avgDOM = yesterdayOpps.length > 0
      ? Math.round(yesterdayOpps.reduce((sum, o) => sum + (o.listing_dom || 0), 0) / yesterdayOpps.length)
      : 0;

    const avgEstimatedPrice = yesterdayOpps.length > 0
      ? Math.round(yesterdayOpps.reduce((sum, o) => sum + (o.estimated_price || 0), 0) / yesterdayOpps.length)
      : 0;

    // Get partner distribution
    const partnerDistribution = {};
    yesterdayOpps.forEach(opp => {
      const partner = opp.partner_email || 'Unassigned';
      partnerDistribution[partner] = (partnerDistribution[partner] || 0) + 1;
    });

    // Build HTML email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
            .header h1 { margin: 0 0 10px 0; font-size: 24px; }
            .header p { margin: 0; opacity: 0.9; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 12px 12px; }
            .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
            .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
            .stat-value { font-size: 32px; font-weight: bold; color: #1e40af; margin-bottom: 5px; }
            .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
            .section { margin: 25px 0; }
            .section h3 { color: #1e3a8a; margin-bottom: 15px; font-size: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
            .metric-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
            .metric-label { color: #475569; }
            .metric-value { font-weight: 600; color: #1e293b; }
            .priority-high { color: #dc2626; }
            .priority-medium { color: #f59e0b; }
            .priority-low { color: #16a34a; }
            .partner-list { background: white; border-radius: 8px; padding: 15px; }
            .partner-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
            .partner-item:last-child { border-bottom: none; }
            .footer { text-align: center; padding: 20px; color: #94a3b8; font-size: 12px; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
            .badge-high { background: #fef2f2; color: #dc2626; }
            .badge-medium { background: #fffbeb; color: #d97706; }
            .badge-low { background: #f0fdf4; color: #16a34a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Daily Import Summary</h1>
              <p>PropertyRadar → VTON Opportunities</p>
              <p style="margin-top: 10px; font-size: 14px;">${yesterday.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div class="content">
              <!-- Key Metrics -->
              <div class="stat-grid">
                <div class="stat-card">
                  <div class="stat-value">${totalImported}</div>
                  <div class="stat-label">Total Imported</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value priority-high">${byPriority.high}</div>
                  <div class="stat-label">High Priority</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value priority-medium">${byPriority.medium}</div>
                  <div class="stat-label">Medium Priority</div>
                </div>
              </div>

              <!-- Priority Breakdown -->
              <div class="section">
                <h3>🎯 Priority Breakdown</h3>
                <div class="metric-row">
                  <span class="metric-label"><span class="badge badge-high">HIGH</span> Priority Leads</span>
                  <span class="metric-value priority-high">${byPriority.high}</span>
                </div>
                <div class="metric-row">
                  <span class="metric-label"><span class="badge badge-medium">MEDIUM</span> Priority Leads</span>
                  <span class="metric-value priority-medium">${byPriority.medium}</span>
                </div>
                <div class="metric-row">
                  <span class="metric-label"><span class="badge badge-low">LOW</span> Priority Leads</span>
                  <span class="metric-value priority-low">${byPriority.low}</span>
                </div>
              </div>

              <!-- Quality Metrics -->
              <div class="section">
                <h3>📈 Lead Quality Metrics</h3>
                <div class="metric-row">
                  <span class="metric-label">Average Distress Score</span>
                  <span class="metric-value">${avgDistressScore}/100</span>
                </div>
                <div class="metric-row">
                  <span class="metric-label">Average Days on Market</span>
                  <span class="metric-value">${avgDOM} days</span>
                </div>
                <div class="metric-row">
                  <span class="metric-label">Average Estimated Price</span>
                  <span class="metric-value">$${avgEstimatedPrice.toLocaleString()}</span>
                </div>
              </div>

              <!-- Pipeline Status -->
              <div class="section">
                <h3>🔄 Pipeline Status</h3>
                <div class="metric-row">
                  <span class="metric-label">Assigned (New)</span>
                  <span class="metric-value">${byStatus.assigned}</span>
                </div>
                <div class="metric-row">
                  <span class="metric-label">Contacted</span>
                  <span class="metric-value">${byStatus.contacted}</span>
                </div>
                <div class="metric-row">
                  <span class="metric-label">Conversation Verified</span>
                  <span class="metric-value">${byStatus.conversation_verified}</span>
                </div>
                <div class="metric-row">
                  <span class="metric-label">Consultation Scheduled</span>
                  <span class="metric-value">${byStatus.consultation_scheduled}</span>
                </div>
                ${byStatus.closed_won > 0 ? `
                <div class="metric-row">
                  <span class="metric-label">Closed Won</span>
                  <span class="metric-value" style="color: #16a34a;">${byStatus.closed_won}</span>
                </div>
                ` : ''}
                ${byStatus.closed_lost > 0 ? `
                <div class="metric-row">
                  <span class="metric-label">Closed Lost</span>
                  <span class="metric-value" style="color: #dc2626;">${byStatus.closed_lost}</span>
                </div>
                ` : ''}
              </div>

              <!-- Partner Distribution -->
              <div class="section">
                <h3>👥 Partner Distribution</h3>
                <div class="partner-list">
                  ${Object.entries(partnerDistribution)
                    .sort(([,a], [,b]) => b - a)
                    .map(([partner, count]) => `
                    <div class="partner-item">
                      <span class="metric-label">${partner}</span>
                      <span class="metric-value">${count}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <div class="footer">
                <p>This is an automated daily summary from your VTON Campaign Dashboard</p>
                <p>Generated on ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PST</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to admin
    const emailResult = await resend.emails.send({
      from: 'VTON Campaign <notifications@buywiser.com>',
      to: user.email,
      subject: `📊 Daily VTON Import Summary - ${totalImported} New Opportunities`,
      html: emailHtml
    });

    return Response.json({
      success: true,
      message: `Daily summary sent to ${user.email}`,
      emailId: emailResult.id,
      stats: {
        totalImported,
        byPriority,
        byStatus,
        avgDistressScore,
        avgDOM,
        avgEstimatedPrice,
        partnerCount: Object.keys(partnerDistribution).length
      }
    });

  } catch (error) {
    console.error('Daily summary error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});