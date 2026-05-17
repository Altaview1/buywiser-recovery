import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Send immediate email notification when a single VTON mailing fails
 * Triggered by entity automation when lob_delivery_status becomes 'failed' or 'returned'
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Admin-only function
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get lead data from automation payload
    const { lead_id, lob_letter_id, lob_delivery_status, error_details } = await req.json();

    if (!lead_id) {
      return Response.json({ error: 'lead_id is required' }, { status: 400 });
    }

    // Fetch lead details
    const lead = await base44.asServiceRole.entities.VTONLead.get(lead_id);
    
    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Build notification email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #fee2e2; border-left: 4px solid #dc2626; padding: 16px 20px; margin-bottom: 24px; }
            .header h1 { color: #dc2626; margin: 0 0 8px 0; font-size: 20px; }
            .header p { margin: 0; color: #7f1d1d; }
            .lead-info { background: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
            .info-row { margin-bottom: 8px; }
            .info-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
            .info-value { font-size: 14px; color: #1f2937; font-weight: 500; }
            .status-badge { display: inline-block; padding: 6px 12px; background: #fee2e2; color: #dc2626; border-radius: 4px; font-size: 14px; font-weight: 700; text-transform: uppercase; }
            .action-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; margin-top: 24px; border-radius: 0 4px 4px 0; }
            .action-box h3 { color: #92400e; margin: 0 0 8px 0; font-size: 16px; }
            .action-box p { margin: 0; color: #78350f; font-size: 14px; }
            .button { display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 12px; }
            .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 VTON Mail Delivery Failed</h1>
              <p>Immediate action required</p>
            </div>
            
            <div class="lead-info">
              <div class="info-row">
                <div class="info-label">Recipient</div>
                <div class="info-value">${lead.first_name} ${lead.last_name}${lead.spouse_name ? ' & ' + lead.spouse_name : ''}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Email</div>
                <div class="info-value">${lead.email || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Property Address</div>
                <div class="info-value">${lead.property_address}<br/>${lead.city}, ${lead.state} ${lead.zip_code}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Lob Letter ID</div>
                <div class="info-value">${lob_letter_id || lead.lob_letter_id || 'N/A'}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Delivery Status</div>
                <div><span class="status-badge">${lob_delivery_status || lead.lob_delivery_status || 'FAILED'}</span></div>
              </div>
              ${error_details ? `
              <div class="info-row">
                <div class="info-label">Error Details</div>
                <div class="info-value" style="color: #dc2626;">${error_details}</div>
              </div>
              ` : ''}
            </div>

            <div class="action-box">
              <h3>🔧 Next Steps</h3>
              <p>
                1. Review the delivery failure in your Lob dashboard<br/>
                2. Verify the address is correct and deliverable<br/>
                3. Update or reject the mailer in the VTON Mail Dashboard<br/>
                4. Contact Lob support if the issue is unclear
              </p>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <a href="https://buywiser.com/vton-mail-dashboard" class="button">View in Mail Dashboard</a>
            </div>

            <div class="footer">
              <p>This is an automated real-time alert from your VTON Direct Mail Monitoring System.</p>
              <p>Failure detected at: ${new Date().toLocaleString()}</p>
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
    const adminEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL');
    if (!adminEmail) {
      return Response.json({ error: 'ADMIN_NOTIFICATION_EMAIL not configured' }, { status: 500 });
    }
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VTON System <noreply@buywiser.com>',
        to: [adminEmail],
        subject: `🚨 VTON Mail Failed: ${lead.first_name} ${lead.last_name} - ${lob_delivery_status || 'Delivery Failed'}`,
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
      message: 'Immediate failure notification sent',
      lead_id: lead.id,
      lead_name: `${lead.first_name} ${lead.last_name}`,
      status: lob_delivery_status || lead.lob_delivery_status,
      email_id: emailData.id
    });
  } catch (error) {
    console.error('Immediate Mail Failure Notification Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});