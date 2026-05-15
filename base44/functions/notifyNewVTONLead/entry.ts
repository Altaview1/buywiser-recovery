import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@3.2.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { data } = await req.json();

    if (!data) return Response.json({ status: 'skipped' });

    const lead = data;
    const adminEmail = 'bennett@buywiser.com';

    const address = [lead.property_address, lead.city, lead.state, lead.zip_code].filter(Boolean).join(', ');
    const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ') || 'Unknown';

    const subject = `🎖️ New VTON Prospect Ready for Review: ${name}`;
    const text = `A new veteran prospect has been imported and is ready for review.

Name: ${name}
Phone: ${lead.phone || 'Not provided'}
Email: ${lead.email || 'Not provided'}
Property: ${address || 'Not provided'}
Listing Price: ${lead.listing_price ? '$' + Number(lead.listing_price).toLocaleString() : 'Unknown'}
Estimated Equity: ${lead.estimated_equity ? '$' + Number(lead.estimated_equity).toLocaleString() : 'Unknown'}
Campaign Stage: ${lead.campaign_stage || 'initial_outreach'}
VA Loan Indicator: ${lead.likely_va_loan_indicator ? 'Yes' : 'No'}

Review this lead in the VTON Campaign Dashboard:
https://buywiser.com/vton-campaign
`;

    await resend.emails.send({
      from: 'BuyWiser VTON <notifications@buywiser.com>',
      to: adminEmail,
      subject,
      text,
    });

    return Response.json({ status: 'success', leadName: name });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});