import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Create VERIFIED_DOOR_ATTEMPT payment ($15) for Field Activators
 * Requires: knock confirmation, outcome, visit duration >= 45s, proof photo if NO_ANSWER
 * Anti-gaming: flags short visits for admin review
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const lead_id = body.lead_id || body.event?.entity_id;

    if (!lead_id) {
      return Response.json({ error: 'lead_id required' }, { status: 400 });
    }

    // Fetch lead
    const leads = await base44.asServiceRole.entities.ActivatorLead.filter({ id: lead_id });
    if (!leads || leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }
    const lead = leads[0];

    // VALIDATION: All required fields for VERIFIED_DOOR_ATTEMPT
    if (!lead.knock_attempt_confirmed) {
      return Response.json({ skipped: true, reason: 'knock_attempt_confirmed not set' });
    }
    if (!lead.attempt_outcome) {
      return Response.json({ skipped: true, reason: 'attempt_outcome not selected' });
    }
    if (!lead.visit_duration_seconds || lead.visit_duration_seconds < 1) {
      return Response.json({ skipped: true, reason: 'visit_duration_seconds missing or invalid' });
    }

    // VALIDATION: Proof photo required if NO_ANSWER
    if (lead.attempt_outcome === 'NO_ANSWER' && !lead.proof_photo_url) {
      return Response.json({ skipped: true, reason: 'proof_photo_url required for NO_ANSWER outcome' });
    }

    // Fetch activator to check tier (only FIELD_ACTIVATOR gets VERIFIED_DOOR_ATTEMPT)
    if (!lead.activator_id) {
      return Response.json({ error: 'Lead missing activator_id' }, { status: 400 });
    }
    const activators = await base44.asServiceRole.entities.FieldActivator.filter({ id: lead.activator_id });
    if (!activators || activators.length === 0) {
      return Response.json({ error: 'Activator not found' }, { status: 404 });
    }
    const activator = activators[0];

    // Only FIELD_ACTIVATOR tier gets VERIFIED_DOOR_ATTEMPT payment
    const tier = activator.activator_tier || 'FIELD_ACTIVATOR';
    if (tier !== 'FIELD_ACTIVATOR') {
      return Response.json({ skipped: true, reason: `Tier ${tier} does not receive VERIFIED_DOOR_ATTEMPT payments` });
    }

    // ANTI-GAMING: Check for short visits (< 45 seconds)
    let shouldFlag = false;
    if (lead.visit_duration_seconds < 45) {
      shouldFlag = true;
      console.log(`⚠️ SHORT VISIT DETECTED: ${lead.visit_duration_seconds}s for lead ${lead_id} — flagging for audit`);
    }

    // Duplicate guard
    const existing = await base44.asServiceRole.entities.ActivatorPayment.filter({
      lead_id: lead_id,
      type: 'VERIFIED_DOOR_ATTEMPT',
    });
    if (existing.length > 0) {
      return Response.json({ skipped: true, reason: 'VERIFIED_DOOR_ATTEMPT payment already exists' });
    }

    // Create payment
    const payment = await base44.asServiceRole.entities.ActivatorPayment.create({
      activator_id: lead.activator_id,
      lead_id: lead_id,
      rep_code: lead.rep_code,
      type: 'VERIFIED_DOOR_ATTEMPT',
      amount: 15,
      status: shouldFlag ? 'PENDING_AUDIT' : 'PENDING',
    });

    // Update lead audit flag if needed
    if (shouldFlag) {
      await base44.asServiceRole.entities.ActivatorLead.update(lead_id, { audit_flag: true });
    }

    const msg = shouldFlag
      ? `✓ VERIFIED_DOOR_ATTEMPT payment created ($15) — flagged for audit (${lead.visit_duration_seconds}s visit)`
      : `✓ VERIFIED_DOOR_ATTEMPT payment created ($15) for ${activator.name}`;

    console.log(msg);
    return Response.json({
      success: true,
      payment_id: payment.id,
      amount: 15,
      flagged_for_audit: shouldFlag,
      visit_duration: lead.visit_duration_seconds,
      outcome: lead.attempt_outcome,
    });
  } catch (error) {
    console.error('createVerifiedDoorPayment error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});