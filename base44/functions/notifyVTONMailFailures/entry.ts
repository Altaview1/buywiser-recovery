import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Check for failed mail deliveries and send admin notification
 * Runs on schedule to alert admin of any mailers that failed to send
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Admin-only function
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get failed mailers from the last 24 hours
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const allLeads = await base44.asServiceRole.entities.VTONLead.list();
    
    const failedMailers = allLeads.filter(lead => {
      const status = lead.lob_delivery_status;
      const lastUpdated = lead.lob_last_updated ? new Date(lead.lob_last_updated) : null;
      
      // Check for failed status or processing for more than 24 hours
      const isFailed = status === 'failed' || status === 'cancelled';
      const isStuck = status === 'processing' && lastUpdated && lastUpdated < twentyFourHoursAgo;
      
      return (isFailed || isStuck) && lead.direct_mail_sent === true;
    });

    if (failedMailers.length === 0) {
      return Response.json({ 
        success: true, 
        message: 'No failed mailers detected',
        checked_count: allLeads.filter(l => l.direct_mail_sent).length 
      });
    }

    // Build notification email
    const failedListHtml = failedMailers.map(lead => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 8px; font-size: 14px; color: #1f2937;">
          <strong>${lead.first_name} ${lead.last_name}</strong><br/>
          <span style="color: #6b7280; font-size: 13px;">${lead.email}</span>
        </td>
        <td style="padding: 12px 8px; font-size: 13px; color: #4b5563;">
          ${lead.property_address}<br/>
          <span style="color: #9ca3af;">${lead.city}, ${lead.state} ${lead.zip_code}</span>
        </td>
        <td style="padding: 12px 8px;">
          <span style="inline-block; padding: 4px 8px; background: #fee2e2; color: #dc2626; border-radius: 4px; font-size: 12px; font-weight: 600;">
            ${lead.lob_delivery_status?.toUpperCase() || 'UNKNOWN'}
          </span>
        </td>
        <td style="padding: 12px 8px; font-size: 13px; color: #6b7280;">
          ${lead.lob_letter_id || 'N/A'}
        </td>
        <td style="padding: 12px 8px; font-size: 13px; color: #6b7280;">
          ${lead.lob_last_updated ? new Date(lead.lob_last_updated).toLocaleDateString() : 'N/A'}
        </td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: #fee2e2; border-left: 4px solid #dc2626; padding: 16px 20px; margin-bottom: 24px; }
            .header h1 { color: #dc2626; margin: 0 0 8px 0; font-size: 20px; }
            .header p { margin: 0; color: #7f1d1d; }
            .stats { background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
            .stat-item { display: inline-block; margin-right: 24px; }
            .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
            .stat-value { font-size: 24px; font-weight: bold; color: #dc2626; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th { text-align: left; padding: 12px 8px; background: #f3f4f6; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; }
            .action-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; margin-top: 24px; border-radius: 0 4px 4px 0; }
            .action-box h3 { color: #92400e; margin: 0 0 8px 0; font-size: 16px; }
            .action-box p { margin: 0; color: #78350f; font-size: 14px; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ VTON Direct Mail Delivery Failures Detected</h1>
              <p>${failedMailers.length} mailer(s) require your attention</p>
            </div>
            
            <div class="stats">
              <div class="stat-item">
                <div class="stat-label">Failed Mailers</div>
                <div class="stat-value">${failedMailers.length}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Check Time</div>
                <div class="stat-value" style="color: #4b5563; font-size: 18px;">${new Date().toLocaleString()}</div>
              </div>
            </div>

            <h2 style="font-size: 16px; color: #1f2937; margin-bottom: 12px;">Failed Mailer Details</h2>
            <table>
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Property Address</th>
                  <th>Status</th>
                  <th>Lob Letter ID</th>
                  <th>Last Updated</th>
                </tr>
              </thead>
              <tbody>
                ${failedListHtml}
              </tbody>
            </table>

            <div class="action-box">
              <h3>🔧 Recommended Actions</h3>
              <p>
                1. Log into your <a href="https://dashboard.lob.com" style="color: #92400e; font-weight: 600;">Lob dashboard</a> to investigate delivery issues<br/>
                2. Verify address accuracy for the listed recipients<br/>
                3. Re-queue mailers after correcting any address or template issues<br/>
                4. Contact Lob support if issues persist for specific letter IDs
              </p>
            </div>

            <div class="footer">
              <p>This is an automated alert from your VTON Direct Mail Monitoring System.</p>
              <p>View full mailer queue: <a href="https://buywiser.com/vton-mail-dashboard" style="color: #6b7280;">vton-mail-dashboard</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Get Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return Response.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
    }

    // Send notification email to admin
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VTON System <noreply@buywiser.com>',
        to: ['bennett@buywiser.com'], // Admin email
        subject: `⚠️ VTON Mail Alert: ${failedMailers.length} Failed Delivery(ies)`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      return Response.json({ error: 'Failed to send notification email', details: errorData }, { status: 500 });
    }

    const emailData = await emailResponse.json();

    return Response.json({ 
      success: true, 
      message: `Notification sent for ${failedMailers.length} failed mailers`,
      failed_count: failedMailers.length,
      failed_leads: failedMailers.map(l => ({ id: l.id, name: `${l.first_name} ${l.last_name}`, status: l.lob_delivery_status })),
      email_id: emailData.id
    });
  } catch (error) {
    console.error('Mail Failure Notification Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});