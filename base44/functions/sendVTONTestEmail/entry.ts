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

    const { toEmail, leadId } = await req.json();

    if (!toEmail) {
      return Response.json({ error: 'toEmail is required' }, { status: 400 });
    }

    // Load template from DB
    const configs = await base44.asServiceRole.entities.VTONMailConfig.list();
    const templateHtml = configs.length > 0 ? configs[0].letter_html : null;
    if (!templateHtml) {
      return Response.json({ error: 'No template found in database. Please save a template first.' }, { status: 400 });
    }

    // If a leadId is provided, personalize with that lead's data
    let lead = null;
    if (leadId) {
      lead = await base44.asServiceRole.entities.VTONLead.get(leadId);
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

    const emailResult = await resend.emails.send({
      from: 'BuyWiser VTON <notifications@buywiser.com>',
      to: toEmail,
      subject: `VTON Letter Preview${lead ? ` — ${first_name} ${last_name}` : ' — Sample'}`,
      html: personalizedHtml,
    });

    // Log the email
    await base44.asServiceRole.entities.VTONEmailLog.create({
      lead_id: lead?.id || 'test',
      lead_name: lead ? `${first_name} ${last_name}` : 'Test Preview',
      lead_email: toEmail,
      email_type: 'test_email',
      subject: `VTON Letter Preview${lead ? ` — ${first_name} ${last_name}` : ' — Sample'}`,
      status: 'sent',
      sent_date: new Date().toISOString(),
      notes: `Manual test email sent by admin`
    });

    // Track delivery status
    setTimeout(async () => {
      try {
        const logs = await base44.asServiceRole.entities.VTONEmailLog.filter({
          lead_id: lead?.id || 'test',
          email_type: 'test_email'
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

    return Response.json({ success: true, message: `Test email sent to ${toEmail}`, emailId: emailResult.id });
  } catch (error) {
    // Log the failure
    await base44.asServiceRole.entities.VTONEmailLog.create({
      lead_id: lead?.id || 'test',
      lead_name: lead ? `${first_name} ${last_name}` : 'Test Preview',
      lead_email: toEmail,
      email_type: 'test_email',
      subject: `VTON Letter Preview`,
      status: 'failed',
      sent_date: new Date().toISOString(),
      error_message: error.message,
      notes: `Failed to send test email`
    });

    return Response.json({ error: error.message }, { status: 500 });
  }
});