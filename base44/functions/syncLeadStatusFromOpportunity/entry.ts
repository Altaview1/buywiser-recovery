import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Opportunity statuses that indicate an agent has actively confirmed / engaged with a lead
const CONFIRMED_STATUSES = new Set([
  'accepted',
  'in_progress',
  'conversation_verified',
  'consultation_scheduled',
  'closed_won',
  'completed',
]);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
     const user = await base44.auth.me();
     if (!user || user.role !== 'admin') {
       return Response.json({ error: 'Admin access required' }, { status: 403 });
     }
    const payload = await req.json();
    const { event, data, old_data } = payload;

    if (event?.entity_name !== 'VTONOpportunity' || event?.type !== 'update') {
      return Response.json({ status: 'skipped', reason: 'Not a VTONOpportunity update' });
    }

    const newStatus = data?.opportunity_status;
    const oldStatus = old_data?.opportunity_status;

    // Only act when the status just moved into a confirmed state
    if (!CONFIRMED_STATUSES.has(newStatus) || newStatus === oldStatus) {
      return Response.json({ status: 'skipped', reason: 'Status not newly confirmed' });
    }

    const propertyAddress = data?.property_address;
    const homeownerName = data?.homeowner_name;

    if (!propertyAddress) {
      return Response.json({ status: 'skipped', reason: 'No property_address on opportunity' });
    }

    // Find matching Lead by property address (address_or_link contains the address)
    const leads = await base44.asServiceRole.entities.Lead.filter({
      address_or_link: propertyAddress,
    });

    if (leads.length === 0) {
      console.log(`No matching Lead found for address: ${propertyAddress}`);
      return Response.json({ status: 'no_match', address: propertyAddress });
    }

    // Update all matching leads that are not already beyond "Qualified"
    const TERMINAL_STATUSES = new Set(['Qualified', 'Closed']);
    const toUpdate = leads.filter(l => !TERMINAL_STATUSES.has(l.status));

    if (toUpdate.length === 0) {
      console.log(`Lead(s) already at Qualified/Closed, skipping.`);
      return Response.json({ status: 'skipped', reason: 'Lead already at or beyond Qualified' });
    }

    await Promise.all(
      toUpdate.map(lead =>
        base44.asServiceRole.entities.Lead.update(lead.id, {
          status: 'Qualified',
          internal_notes: (lead.internal_notes ? lead.internal_notes + '\n\n' : '') +
            `[Auto-verified ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}] ` +
            `VTONOpportunity confirmed by agent (status: ${newStatus})` +
            (homeownerName ? ` — Homeowner: ${homeownerName}` : ''),
        })
      )
    );

    console.log(`Updated ${toUpdate.length} lead(s) to Qualified for address: ${propertyAddress}`);
    return Response.json({ success: true, updated: toUpdate.length, address: propertyAddress });

  } catch (error) {
    console.error('syncLeadStatusFromOpportunity error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});