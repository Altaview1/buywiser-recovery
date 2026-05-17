import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Periodically polls Lob API for recent letter status updates
 * Acts as a safety net to catch any webhook events that might have been missed
 * Should be run via scheduled automation every 15-30 minutes
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Verify LOB_API_KEY is set
    const lobApiKey = Deno.env.get('LOB_API_KEY');
    if (!lobApiKey) {
      return Response.json({ error: 'LOB_API_KEY not configured' }, { status: 500 });
    }

    // Get all leads with pending or in-transit mail
    const leads = await base44.asServiceRole.entities.VTONLead.filter({});
    const leadsWithMail = leads.filter(l => 
      l.lob_letter_id && 
      (!l.lob_delivery_status || ['processing', 'mailed'].includes(l.lob_delivery_status))
    );

    console.log(`Polling ${leadsWithMail.length} leads for Lob status updates...`);

    let updated = 0;
    let errors = 0;

    for (const lead of leadsWithMail) {
      try {
        // Fetch letter details from Lob API
        const response = await fetch(
          `https://api.lob.com/v1/letters/${lead.lob_letter_id}`,
          {
            headers: { 'Authorization': `Basic ${btoa(lobApiKey + ':')}` }
          }
        );

        if (!response.ok) {
          console.warn(`Failed to fetch ${lead.lob_letter_id}: ${response.status}`);
          errors++;
          continue;
        }

        const letterData = await response.json();
        const newStatus = letterData.status || 'processing';

        // Only update if status has changed
        if (newStatus !== lead.lob_delivery_status) {
          await base44.asServiceRole.entities.VTONLead.update(lead.id, {
            lob_delivery_status: newStatus,
            lob_last_updated: new Date().toISOString(),
            lob_estimated_cost: letterData.price / 100 || lead.lob_estimated_cost // Lob sends price in cents
          });

          console.log(`✓ Updated ${lead.first_name} ${lead.last_name}: ${lead.lob_delivery_status} → ${newStatus}`);
          updated++;
        }
      } catch (err) {
        console.error(`Error polling ${lead.lob_letter_id}:`, err.message);
        errors++;
      }
    }

    return Response.json({
      status: 'success',
      message: `Polled ${leadsWithMail.length} leads`,
      updated,
      errors
    });

  } catch (error) {
    console.error('Polling error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});