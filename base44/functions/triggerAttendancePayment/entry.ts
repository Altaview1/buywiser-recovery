import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Called when a lead's benefit_review_status is set to ATTENDED.
 * Creates the appropriate attendance payment based on activator tier and activation_source.
 * Payload (automation): { event: { entity_id }, data }
 * Payload (direct):     { lead_id }
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Entity automation — no user auth needed, uses service role
    const body = await req.json();
    const lead_id = body.lead_id || body.event?.entity_id;

    if (!lead_id) {
      return Response.json({ error: 'lead_id is required' }, { status: 400 });
    }

    const leads = await base44.asServiceRole.entities.ActivatorLead.filter({ id: lead_id });
    if (!leads || leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }
    const lead = leads[0];

    if (!lead.activator_id || !lead.rep_code) {
      return Response.json({ error: 'Lead missing activator_id or rep_code' }, { status: 400 });
    }
    if (lead.benefit_review_status !== 'ATTENDED') {
      return Response.json({ error: 'benefit_review_status is not ATTENDED' }, { status: 400 });
    }

    // Fetch activator to check tier
    const activators = await base44.asServiceRole.entities.FieldActivator.filter({ id: lead.activator_id });
    if (!activators || activators.length === 0) {
      return Response.json({ error: 'Activator not found' }, { status: 404 });
    }
    const activator = activators[0];
    const tier = activator.activator_tier || 'FIELD_ACTIVATOR';

    // Tier 1 (FIELD_ACTIVATOR): no attendance payments
    if (tier === 'FIELD_ACTIVATOR') {
      return Response.json({ skipped: true, reason: 'Tier 1 Field Activators do not receive attendance payments' });
    }

    // Tier 2 (SENIOR_FIELD_ACTIVATOR): payment type depends on activation source
    const paymentType = lead.activation_source === 'IN_PERSON_ACTIVATION'
      ? 'IN_PERSON_ATTENDED'
      : 'LEAVE_BEHIND_ATTENDED';

    // Duplicate guard
    const existing = await base44.asServiceRole.entities.ActivatorPayment.filter({
      lead_id: lead_id,
      type: paymentType,
    });
    if (existing.length > 0) {
      return Response.json({ skipped: true, reason: `${paymentType} payment already exists for this lead` });
    }

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