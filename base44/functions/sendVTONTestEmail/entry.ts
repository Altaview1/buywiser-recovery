import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { toEmail, templateHtml, leadId } = await req.json();

    if (!toEmail || !templateHtml) {
      return Response.json({ error: 'toEmail and templateHtml are required' }, { status: 400 });
    }

    // If a leadId is provided, personalize with that lead's data
    let lead = null;
    if (leadId) {
      lead = await base44.asServiceRole.entities.VTONLead.read(leadId);
    }

    // Apply personalization (use lead data or sample placeholders)
    const first_name = lead?.first_name || 'John';
    const last_name = lead?.last_name || 'Veteran';
    const property_address = lead?.property_address || '123 Main Street';
    const city = lead?.city || 'Los Angeles';
    const state = lead?.state || 'CA';
    const zip_code = lead?.zip_code || '90001';
    const estimated_benefit = lead?.estimated_benefit ? `$${lead.estimated_benefit.toLocaleString()}` : '$12,500';
    const estimated_equity = lead?.estimated_equity ? `$${lead.estimated_equity.toLocaleString()}` : '$150,000';
    const listing_price = lead?.listing_price ? `$${lead.listing_price.toLocaleString()}` : '$500,000';

    const personalizedHtml = templateHtml
      .replace(/\$\{first_name\}/g, first_name)
      .replace(/\$\{last_name\}/g, last_name)
      .replace(/\$\{property_address\}/g, property_address)
      .replace(/\$\{city\}/g, city)
      .replace(/\$\{state\}/g, state)
      .replace(/\$\{zip_code\}/g, zip_code)
      .replace(/\$\{estimated_benefit\}/g, estimated_benefit)
      .replace(/\$\{estimated_equity\}/g, estimated_equity)
      .replace(/\$\{listing_price\}/g, listing_price);

    // Wrap in test banner
    const testBanner = `
      <div style="background:#f59e0b;color:#1a1a1a;text-align:center;padding:12px;font-family:sans-serif;font-size:13px;font-weight:bold;border-bottom:2px solid #d97706;">
        ⚠️ TEST EMAIL — This is a preview of the VTON letter. Not a real mailing.
        ${lead ? ` | Personalized for: ${first_name} ${last_name} · ${property_address}` : ' | Using sample placeholder data'}
      </div>
    `;
    const emailBody = testBanner + personalizedHtml;

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: toEmail,
      subject: `[TEST] VTON Letter Preview${lead ? ` — ${first_name} ${last_name}` : ''}`,
      body: emailBody,
    });

    return Response.json({ success: true, message: `Test email sent to ${toEmail}` });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});