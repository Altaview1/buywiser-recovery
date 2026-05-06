import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Supports being called directly OR from entity automation
    const { event, data, old_data } = body;
    const lead = data;

    if (!lead || !lead.id) {
      return Response.json({ skipped: true, reason: 'No lead data' });
    }

    const leadId = lead.id || event?.entity_id;
    const repCode = lead.rep_code;
    const status = lead.status;

    if (!repCode) {
      console.log(`Lead ${leadId} has no rep_code — skipping payout`);
      return Response.json({ skipped: true, reason: 'No rep_code' });
    }

    // Look up activator
    const activators = await base44.asServiceRole.entities.FieldActivator.filter({ rep_code: repCode });
    if (activators.length === 0) {
      console.log(`No activator found for rep_code ${repCode}`);
      return Response.json({ skipped: true, reason: 'No activator found' });
    }
    const activator = activators[0];

    // Load payout config (use first record, or defaults)
    const configs = await base44.asServiceRole.entities.PayoutConfig.list('-created_date', 1);
    const config = configs[0] || {};
    const SCAN_AMOUNT = config.scan_bonus_amount ?? 25;
    const CONSULT_AMOUNT = config.consult_bonus_amount ?? 50;
    const CLOSE_AMOUNT = config.close_bonus_amount ?? 500;

    const oldStatus = old_data?.status;
    const results = [];

    // Helper: create payment only if no duplicate exists
    const maybeCreatePayment = async (type, amount) => {
      const existing = await base44.asServiceRole.entities.ActivatorPayment.filter({
        activator_id: activator.id,
        lead_id: leadId,
        type,
      });
      if (existing.length > 0) {
        console.log(`Duplicate payout blocked: ${type} for lead ${leadId}`);
        return null;
      }
      const payment = await base44.asServiceRole.entities.ActivatorPayment.create({
        activator_id: activator.id,
        lead_id: leadId,
        rep_code: repCode,
        type,
        amount,
        status: 'PENDING',
      });
      console.log(`✓ Payout created: ${type} $${amount} for activator ${activator.name} (lead ${leadId})`);
      results.push({ type, amount, payment_id: payment.id });
      return payment;
    };

    // EVENT 1: SCAN VERIFIED — fires when status transitions to VERIFIED
    if (status === 'VERIFIED' && oldStatus !== 'VERIFIED') {
      await maybeCreatePayment('SCAN', SCAN_AMOUNT);
    }

    // EVENT 2: CONSULT COMPLETED — fires when status transitions to COMPLETED
    if (status === 'COMPLETED' && oldStatus !== 'COMPLETED') {
      await maybeCreatePayment('CONSULT', CONSULT_AMOUNT);
    }

    // EVENT 3: DEAL CLOSED — fires when status transitions to CLOSED
    if (status === 'CLOSED' && oldStatus !== 'CLOSED') {
      await maybeCreatePayment('CLOSE', CLOSE_AMOUNT);
    }

    return Response.json({
      success: true,
      lead_id: leadId,
      activator_id: activator.id,
      payouts_created: results,
    });
  } catch (error) {
    console.error('triggerActivatorPayout error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});