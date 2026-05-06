import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Called when a lead's benefit_review_status is set to ATTENDED.
 * Creates the appropriate attendance payment based on activation_source,
 * with duplicate prevention.
 *
 * Payload: { lead_id: string }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    // When called from automation, payload is { event, data, old_data }; when called directly, { lead_id }
    const lead_id = body.lead_id || body.event?.entity_id;

    if (!lead_id) {
      return Response.json({ error: 'lead_id is required' }, { status: 400 });
    }

    // Fetch the lead
    const leads = await base44.asServiceRole.entities.ActivatorLead.filter({ id: lead_id });
    if (!leads || leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }
    const lead = leads[0];

    // Validate required fields
    if (!lead.activator_id || !lead.rep_code) {
      return Response.json({ error: 'Lead is missing activator_id or rep_code — no payment created' }, { status: 400 });
    }

    if (lead.benefit_review_status !== 'ATTENDED') {
      return Response.json({ error: 'Lead benefit_review_status is not ATTENDED' }, { status: 400 });
    }

    // Determine payment type based on activation source
    const paymentType = lead.activation_source === 'IN_PERSON_ACTIVATION'
      ? 'IN_PERSON_ATTENDED'
      : 'LEAVE_BEHIND_ATTENDED';

    // Duplicate guard — only one of each type per lead
    const existing = await base44.asServiceRole.entities.ActivatorPayment.filter({
      lead_id: lead_id,
      type: paymentType,
    });

    if (existing.length > 0) {
      return Response.json({
        skipped: true,
        reason: `${paymentType} payment already exists for this lead`,
      });
    }

    // Create the attendance payment — $150 for both paths
    const payment = await base44.asServiceRole.entities.ActivatorPayment.create({
      activator_id: lead.activator_id,
      lead_id: lead_id,
      rep_code: lead.rep_code,
      type: paymentType,
      amount: 150,
      status: 'PENDING',
    });

    return Response.json({ success: true, payment });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});