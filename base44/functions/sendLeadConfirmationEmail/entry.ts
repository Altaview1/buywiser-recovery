import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@3.2.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const VTON_BRANDING_HTML = `
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

const STANDARD_BRANDING_HTML = `
<div style="background:#0B1F3B;padding:20px;text-align:center;">
  <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height:32px;margin-bottom:8px;" />
  <p style="margin:0;font-size:12px;color:#94a3b8;">California's Boutique Mortgage Experts Since 1991</p>
</div>
`;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { event, data } = await req.json();

    if (!data || event.type !== 'create') {
      return Response.json({ status: 'skipped' });
    }

    const lead = data;
    if (!lead.email) {
      return Response.json({ status: 'skipped - no email' });
    }

    const homeownerName = lead.name || lead.first_name || 'Homeowner';
    const property = lead.address_or_link || lead.property_address || 'your property';

    // Check if this is a VTON lead
    const isVTON = !!lead.veteran_indicator || lead.lead_category === 'VTON' || !!lead.estimated_benefit;

    const brandingHtml = isVTON ? VTON_BRANDING_HTML : STANDARD_BRANDING_HTML;

    const html = `
${brandingHtml}
<div style="padding:24px 20px;background:#ffffff;font-family:Georgia,serif;color:#1a1a1a;line-height:1.8;">
  <h2 style="margin:0 0 16px 0;font-size:18px;font-weight:bold;color:#0B1F3B;">Thank You for Your Information</h2>
  
  <p style="margin:0 0 16px 0;font-size:14px;color:#1a1a1a;">Hi ${homeownerName},</p>
  
  <p style="margin:0 0 16px 0;font-size:14px;color:#1a1a1a;line-height:1.8;">
    Thank you for submitting your information with BuyWiser Home Loans. We've received your details for ${property}. A member of our team will review your information and contact you within one business day to discuss your options and next steps.
  </p>
  
  <div style="background:#f8fafc;border-left:3px solid #0B1F3B;padding:16px;margin:16px 0;">
    <p style="margin:0 0 8px 0;font-size:13px;font-weight:bold;color:#0B1F3B;">What to Expect:</p>
    <ul style="margin:0;padding-left:20px;font-size:13px;color:#1a1a1a;line-height:1.8;">
      <li>A personalized mortgage review based on your situation</li>
      <li>Options tailored to your financial goals</li>
      <li>No pressure, no obligations — just honest advice</li>
    </ul>
  </div>
  
  <p style="margin:0 0 16px 0;font-size:14px;color:#1a1a1a;">
    In the meantime, if you have any questions, please feel free to call us directly:<br/>
    <strong style="color:#0B1F3B;">📞 (818) 300-2642</strong>
  </p>
  
  <p style="margin:0;font-size:14px;color:#1a1a1a;">
    We look forward to helping you explore your refinancing or purchase options.
  </p>
</div>

<div style="background:#f8fafc;padding:16px 20px;border-top:1px solid #e2e8f0;text-align:center;">
  <p style="margin:0 0 4px 0;font-size:11px;color:#64748b;"><strong>Buywiser Technology, Inc. DBA Buywiser Home Loans</strong></p>
  <p style="margin:0;font-size:10px;color:#94a3b8;">Company NMLS #1887767 · Individual NMLS #1524446 · Licensed by California DFPI · Equal Housing Opportunity</p>
</div>
`;

    await resend.emails.send({
      from: isVTON ? 'BuyWiser VTON <notifications@buywiser.com>' : 'BuyWiser Home Loans <notifications@buywiser.com>',
      to: lead.email,
      subject: isVTON ? '🎖️ We Received Your VTON Information — Thank You!' : 'We Received Your Information — Thank You!',
      html,
    });

    return Response.json({ 
      status: 'success', 
      email_sent: true,
      recipient: lead.email,
      isVTON
    });
  } catch (error) {
    console.error('Confirmation email error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});