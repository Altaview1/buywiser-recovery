import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Weekly Summary Report
 * Sends admin notification with new leads count and field activator scans from the past week
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const adminEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL');
    if (!adminEmail) {
      return Response.json({ error: 'ADMIN_NOTIFICATION_EMAIL not configured' }, { status: 500 });
    }

    // Calculate date range: past 7 days
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startDateISO = startDate.toISOString();

    // Get all new leads from past week
    const newLeads = await base44.asServiceRole.entities.VTONLead.list();
    const newLeadsThisWeek = newLeads.filter(lead => {
      const leadDate = new Date(lead.created_date);
      return leadDate >= startDate;
    });

    // Get all activator leads with scans from past week
    const activatorLeads = await base44.asServiceRole.entities.ActivatorLead.list();
    const scansThisWeek = activatorLeads.filter(lead => {
      const scanDate = lead.scan_timestamp ? new Date(lead.scan_timestamp) : null;
      return scanDate && scanDate >= startDate;
    });

    // Calculate additional metrics
    const completedScans = scansThisWeek.filter(lead => lead.status === 'COMPLETED').length;
    const scheduledScans = scansThisWeek.filter(lead => lead.benefit_review_status === 'SCHEDULED').length;

    // Format dates for display
    const dateRange = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 8px;">
            <h2 style="color: #1f2937; border-bottom: 3px solid #3b82f6; padding-bottom: 10px;">
              📊 Weekly Lead & Scan Summary
            </h2>
            
            <p style="color: #6b7280; font-size: 14px;">
              Report Period: <strong>${dateRange}</strong>
            </p>

            <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1f2937; margin-top: 0;">📝 New VTON Leads</h3>
              <p style="font-size: 28px; color: #3b82f6; font-weight: bold; margin: 10px 0;">
                ${newLeadsThisWeek.length}
              </p>
              <p style="color: #6b7280; margin: 0;">New veteran homeowner leads captured this week</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #1f2937; margin-top: 0;">📍 Field Activator Scans</h3>
              <p style="font-size: 28px; color: #10b981; font-weight: bold; margin: 10px 0;">
                ${scansThisWeek.length}
              </p>
              <ul style="color: #6b7280; margin: 10px 0; padding-left: 20px;">
                <li>Completed: <strong>${completedScans}</strong></li>
                <li>Scheduled for Benefit Review: <strong>${scheduledScans}</strong></li>
              </ul>
            </div>

            <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; color: #6b7280; font-size: 13px;">
                <strong>Quick Actions:</strong>
              </p>
              <ul style="margin: 8px 0; padding-left: 20px; color: #6b7280; font-size: 13px;">
                <li><a href="https://buywiser.com/vton-campaign" style="color: #3b82f6; text-decoration: none;">View VTON Campaign Dashboard</a></li>
                <li><a href="https://buywiser.com/qr-scans" style="color: #3b82f6; text-decoration: none;">View QR Scan Activity</a></li>
                <li><a href="https://buywiser.com/leads" style="color: #3b82f6; text-decoration: none;">View All Leads</a></li>
              </ul>
            </div>

            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              This is an automated weekly summary. Report generated at ${new Date().toLocaleString()}.
            </p>
          </div>
        </body>
      </html>
    `;

    // Send email via Resend integration
    await base44.integrations.Core.SendEmail({
      to: adminEmail,
      subject: `📊 Weekly Summary: ${newLeadsThisWeek.length} New Leads, ${scansThisWeek.length} Scans`,
      body: emailBody,
      from_name: 'BuyWiser Admin System'
    });

    return Response.json({
      success: true,
      message: 'Weekly summary report sent successfully',
      metrics: {
        newLeads: newLeadsThisWeek.length,
        totalScans: scansThisWeek.length,
        completedScans: completedScans,
        scheduledReviews: scheduledScans,
        reportPeriod: dateRange
      }
    });

  } catch (error) {
    console.error('Weekly summary error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});