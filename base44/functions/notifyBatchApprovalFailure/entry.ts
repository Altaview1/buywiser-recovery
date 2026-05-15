import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Send immediate email alert when batch approval/send fails
 * Includes specific error details for debugging
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const payload = await req.json();
    const { action, lead_count, failed_count, error_message, lead_ids } = payload;

    if (!action || failed_count === undefined) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const actionLabel = action === 'send_to_lob' ? 'Send to Lob' : action === 'approve' ? 'Approve' : action;

    const emailBody = `
<h2>⚠️ VTON Batch ${actionLabel} Failed</h2>

<p><strong>Action:</strong> ${actionLabel}</p>
<p><strong>Admin:</strong> ${user.email}</p>
<p><strong>Time:</strong> ${new Date().toISOString()}</p>

<h3>Summary</h3>
<ul>
  <li><strong>Total Selected:</strong> ${lead_count || 'N/A'}</li>
  <li><strong>Failed:</strong> ${failed_count}</li>
  <li><strong>Success Rate:</strong> ${lead_count ? (((lead_count - failed_count) / lead_count) * 100).toFixed(1) + '%' : 'N/A'}</li>
</ul>

<h3>Error Details</h3>
<pre style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; overflow-x: auto;">
${error_message || 'No error message provided'}
</pre>

${lead_ids && lead_ids.length > 0 ? `
<h3>Affected Lead IDs</h3>
<ul>
${lead_ids.slice(0, 10).map(id => `  <li><code>${id}</code></li>`).join('\n')}
${lead_ids.length > 10 ? `  <li>... and ${lead_ids.length - 10} more</li>` : ''}
</ul>
` : ''}

<h3>Next Steps</h3>
<ol>
  <li>Review the error details above</li>
  <li>Check the <a href="https://buywiser.com/vton-mail-dashboard">VTON Mail Dashboard</a> for more context</li>
  <li>Retry the batch operation or contact support if the error persists</li>
</ol>

<hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
<p style="color: #666; font-size: 12px;">This is an automated alert from the VTON Mail System</p>
    `;

    // Send email to admin
    const emailResult = await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: `⚠️ VTON Batch ${actionLabel} Failed - ${failed_count} error(s)`,
      body: emailBody,
      from_name: 'VTON Mail Alerts'
    });

    console.log(`Batch failure alert sent to ${user.email}`);

    return Response.json({
      success: true,
      message: 'Alert email sent',
      recipient: user.email
    });
  } catch (error) {
    console.error('Batch failure notification error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});