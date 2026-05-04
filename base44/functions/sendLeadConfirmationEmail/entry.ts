import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    if (!data || event.type !== 'create') {
      return Response.json({ status: 'skipped' });
    }

    const lead = data;
    if (!lead.email) {
      return Response.json({ status: 'skipped - no email' });
    }

    const homeownerName = lead.name || 'Homeowner';
    const property = lead.address_or_link || 'your property';

    const emailBody = `Hi ${homeownerName},

Thank you for submitting your information with BuyWiser Home Loans!

We've received your details for ${property}. A member of our team will review your information and contact you within one business day to discuss your options and next steps.

In the meantime, if you have any questions, please feel free to call us directly:
📞 (818) 300-2642

What to expect:
• A personalized mortgage review based on your situation
• Options tailored to your financial goals
• No pressure, no obligation — just honest advice

We look forward to helping you explore your refinancing or purchase options.

Best regards,
Bennett Liss & The BuyWiser Team
California's Boutique Mortgage Experts Since 1991

NMLS #1887767 | CA DRE #01107013`;

    await base44.integrations.Core.SendEmail({
      to: lead.email,
      from_name: 'BuyWiser Home Loans',
      subject: 'We Received Your Information — Thank You!',
      body: emailBody,
    });

    return Response.json({ 
      status: 'success', 
      email_sent: true,
      recipient: lead.email
    });
  } catch (error) {
    console.error('Confirmation email error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});