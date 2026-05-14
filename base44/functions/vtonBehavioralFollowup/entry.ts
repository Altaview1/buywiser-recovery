import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Send behavioral follow-up messages
 * Triggered by engagement patterns
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const { lead_id, behavior } = payload;

    const leads = await base44.asServiceRole.entities.VTONLead.filter({ id: lead_id });
    if (!leads.length) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];

    if (behavior === 'multiple_visits_no_booking') {
      // Send follow-up SMS
      const followupSMS = `Hi ${lead.first_name}, still reviewing your Veteran Transition Benefits? Your estimated buyer benefit is $${(lead.estimated_benefit || 0).toLocaleString()}. Book your quick 15-min Benefit Review: https://myrebate.house/vton-benefit?lead=${lead_id}`;

      base44.functions.invoke('sendSMS', {
        phone: lead.phone,
        message: followupSMS
      }).catch(err => console.error('Behavioral SMS failed:', err));

      // Send follow-up email
      base44.integrations.Core.SendEmail({
        to: lead.email,
        from_name: 'Veteran Transition Opportunity Network',
        subject: `Would You Like a Personalized Benefit Review? (${lead.property_address})`,
        body: `Hi ${lead.first_name},

We noticed you've been exploring your Veteran Transition benefits. We wanted to reach out personally.

Your potential buyer benefit: $${(lead.estimated_benefit || 0).toLocaleString()}

A quick 15-minute Benefit Review with one of our veteran specialists can clarify exactly how much you could receive on your next home purchase.

No pressure. No obligation. Just honest conversation.

BOOK YOUR BENEFIT REVIEW:
https://myrebate.house/vton-benefit?lead=${lead_id}

Questions? Reply to this email.

Regards,
The Veteran Transition Opportunity Network`
      }).catch(err => console.error('Behavioral email failed:', err));
    }

    return Response.json({ success: true, message: 'Behavioral follow-up sent' });
  } catch (error) {
    console.error('Behavioral Followup Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});