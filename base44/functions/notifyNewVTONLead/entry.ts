import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@3.2.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const BRANDING_HTML = `
<div style="background:#0B1F3B;padding:24px 20px;text-align:center;border-bottom:3px solid #B8860B;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <img src="https://media.base44.com/images/public/6a03e2a66969bf6b43fd5faf/a1ebeee25_BuywiserLogoGoldLighterBlueforFBCircle.jpg" alt="BuyWiser" width="56" height="56" style="display:block;border-radius:6px;margin-bottom:12px;" />
        <h1 style="margin:0 0 4px 0;font-size:20px;font-weight:bold;color:#ffffff;letter-spacing:0.5px;">Veterans GAP NextMove™</h1>
        <p style="margin:0;font-size:13px;color:#B8860B;font-weight:600;letter-spacing:0.3px;">Benefit Program</p>
        <p style="margin:8px 0 0 0;font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:0.5px;">Private Program · Not a Government Program</p>
      </td>
    </tr>
  </table>
</div>
`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Entity automation — no user auth needed, uses service role
    const { data } = await req.json();

    if (!data) return Response.json({ status: 'skipped' });

    const lead = data;
    const adminEmail = 'bennett@buywiser.com';

    const address = [lead.property_address, lead.city, lead.state, lead.zip_code].filter(Boolean).join(', ');
    const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'Unknown';

    const html = `
${BRANDING_HTML}
<div style="padding:24px 20px;background:#ffffff;font-family:Georgia,serif;color:#1a1a1a;line-height:1.8;">
  <h2 style="margin:0 0 16px 0;font-size:18px;font-weight:bold;color:#0B1F3B;">🎖️ New VTON Prospect Ready for Review</h2>
  
  <p style="margin:0 0 16px 0;font-size:14px;color:#1a1a1a;">A new veteran prospect has been imported and is ready for review.</p>
  
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc;border-left:3px solid #0B1F3B;margin:16px 0;">
    <tr><td style="padding:16px;">
      <p style="margin:0 0 8px 0;font-size:13px;"><strong style="color:#0B1F3B;">Veteran:</strong> <span style="color:#1a1a1a;">${name}</span></p>
      <p style="margin:0 0 8px 0;font-size:13px;"><strong style="color:#0B1F3B;">Phone:</strong> <span style="color:#1a1a1a;">${lead.phone || 'Not provided'}</span></p>
      <p style="margin:0 0 8px 0;font-size:13px;"><strong style="color:#0B1F3B;">Email:</strong> <span style="color:#1a1a1a;">${lead.email || 'Not provided'}</span></p>
      <p style="margin:0 0 8px 0;font-size:13px;"><strong style="color:#0B1F3B;">Property:</strong> <span style="color:#1a1a1a;">${address || 'Not provided'}</span></p>
      <p style="margin:0 0 8px 0;font-size:13px;"><strong style="color:#0B1F3B;">Listing Price:</strong> <span style="color:#1a1a1a;">${lead.listing_price ? '$' + Number(lead.listing_price).toLocaleString() : 'Unknown'}</span></p>
      <p style="margin:0 0 8px 0;font-size:13px;"><strong style="color:#0B1F3B;">Estimated Equity:</strong> <span style="color:#1a1a1a;">${lead.estimated_equity ? '$' + Number(lead.estimated_equity).toLocaleString() : 'Unknown'}</span></p>
      <p style="margin:0 0 8px 0;font-size:13px;"><strong style="color:#0B1F3B;">Campaign Stage:</strong> <span style="color:#1a1a1a;">${lead.campaign_stage || 'initial_outreach'}</span></p>
      <p style="margin:0;font-size:13px;"><strong style="color:#0B1F3B;">VA Loan Indicator:</strong> <span style="color:#1a1a1a;">${lead.likely_va_loan_indicator ? 'Yes' : 'No'}</span></p>
    </td></tr>
  </table>
  
  <div style="margin:20px 0;padding:16px;background:#fff8e1;border:1px solid #f5c842;border-radius:4px;">
    <p style="margin:0;font-size:12px;color:#7a5c00;line-height:1.6;">
      <strong>⚠ Private Program Notice:</strong> This program is privately funded and operated exclusively by BuyWiser. It is not affiliated with, endorsed by, or connected to the U.S. Department of Veterans Affairs, any military branch, or any government agency.
    </p>
  </div>
  
  <p style="margin:20px 0 0 0;">
    <a href="https://buywiser.com/vton-campaign" style="display:inline-block;padding:12px 24px;background:#0B1F3B;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;border-radius:4px;">Review in VTON Dashboard →</a>
  </p>
</div>

<div style="background:#f8fafc;padding:16px 20px;border-top:1px solid #e2e8f0;text-align:center;">
  <p style="margin:0 0 4px 0;font-size:11px;color:#64748b;"><strong>Buywiser Technology, Inc. DBA Buywiser Home Loans</strong></p>
  <p style="margin:0;font-size:10px;color:#94a3b8;">Company NMLS #1887767 · Individual NMLS #1524446 · Licensed by California DFPI · Equal Housing Opportunity</p>
</div>
`;

    const emailResult = await resend.emails.send({
      from: 'BuyWiser VTON <notifications@buywiser.com>',
      to: adminEmail,
      subject: `🎖️ New VTON Prospect: ${name}`,
      html,
    });

    // Log the email with initial status
    await base44.asServiceRole.entities.VTONEmailLog.create({
      lead_id: data.id || 'unknown',
      lead_name: name,
      lead_email: adminEmail,
      email_type: 'lead_confirmation',
      subject: `🎖️ New VTON Prospect: ${name}`,
      status: 'sent',
      sent_date: new Date().toISOString(),
      notes: `Automated notification for new VTON lead import`
    });

    // Track delivery status (Resend webhook will update this)
    // For now, mark as delivered after successful send
    setTimeout(async () => {
      try {
        const logs = await base44.asServiceRole.entities.VTONEmailLog.filter({
          lead_id: data.id || 'unknown',
          email_type: 'lead_confirmation'
        }, '-sent_date', 1);
        if (logs.length > 0) {
          await base44.asServiceRole.entities.VTONEmailLog.update(logs[0].id, {
            status: 'delivered'
          });
        }
      } catch (err) {
        console.error('Failed to update delivery status:', err);
      }
    }, 5000);

    return Response.json({ status: 'success', leadName: name, emailId: emailResult.id });
  } catch (error) {
    // Log the failure
    await base44.asServiceRole.entities.VTONEmailLog.create({
      lead_id: data?.id || 'unknown',
      lead_name: name || 'Unknown',
      lead_email: adminEmail,
      email_type: 'lead_confirmation',
      subject: `🎖️ New VTON Prospect`,
      status: 'failed',
      sent_date: new Date().toISOString(),
      error_message: error.message,
      notes: `Failed to send automated notification`
    });

    return Response.json({ error: error.message }, { status: 500 });
  }
});