import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Entity automation — no user auth needed, uses service role
    const payload = await req.json();

    const app = payload?.data;
    if (!app) {
      return Response.json({ error: 'No application data' }, { status: 400 });
    }

    const name = `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Unknown';
    const loanAmount = app.loan_amount ? `$${Number(app.loan_amount).toLocaleString()}` : 'Not specified';
    const propertyValue = app.property_value ? `$${Number(app.property_value).toLocaleString()}` : 'Not specified';

    const body = `
New Mortgage Application Submitted
===================================

Applicant:       ${name}
Email:           ${app.email || 'N/A'}
Phone:           ${app.phone || 'N/A'}

Loan Purpose:    ${app.loan_purpose || 'N/A'}
Loan Amount:     ${loanAmount}
Property Value:  ${propertyValue}
Property City:   ${app.property_city || 'N/A'}
Property Type:   ${app.property_type || 'N/A'}

Employment:      ${app.employment_type || 'N/A'} — ${app.employer_name || 'N/A'}
Annual Income:   ${app.annual_income || 'N/A'}
Credit Score:    ${app.credit_score_range || 'N/A'}

Submitted:       ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} PT

Review this application in the admin dashboard.
    `.trim();

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: 'bennett@buywiser.com',
      subject: `New Mortgage Application — ${name}`,
      body,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});