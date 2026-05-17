import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    // Only process if pipeline_stage changed to 'meeting_set'
    if (data.pipeline_stage !== 'meeting_set') {
      return Response.json({ skipped: true, reason: 'Not meeting_set stage' });
    }

    // Verify we have email
    if (!data.email) {
      return Response.json({ skipped: true, reason: 'No email on lead' });
    }

    const firstName = data.first_name || 'Homeowner';
    const propertyAddress = data.property_address || 'your property';

    // Send confirmation email
    await base44.integrations.Core.SendEmail({
      to: data.email,
      subject: 'Your Consultation Meeting is Confirmed',
      body: `Hi ${firstName},

We're excited to confirm your upcoming consultation regarding your property at ${propertyAddress}.

Our team will be in touch shortly with specific meeting details. In the meantime, if you have any questions or need to reschedule, please don't hesitate to reach out.

We look forward to speaking with you!

Best regards,
The Buywiser Team`,
      from_name: 'Buywiser Home Loans'
    });

    return Response.json({ 
      success: true, 
      message: 'Confirmation email sent',
      email: data.email,
      leadId: data.id
    });

  } catch (error) {
    console.error('Error sending meeting confirmation:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});