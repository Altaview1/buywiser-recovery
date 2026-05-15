import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role === 'admin') {
      return Response.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { letter_id, status, cost } = await req.json();

    if (!letter_id || !status) {
      return Response.json({ error: 'Missing letter_id or status' }, { status: 400 });
    }

    // Find the lead with this Lob letter ID
    const leads = await base44.entities.VTONLead.filter({ lob_letter_id: letter_id });
    
    if (leads.length === 0) {
      console.log(`No lead found for letter_id: ${letter_id}`);
      return Response.json({ 
        status: 'not_found',
        message: `No lead found with Lob letter ID: ${letter_id}`
      }, { status: 404 });
    }

    const lead = leads[0];
    
    // Map Lob status to our tracking status
    const statusMap = {
      'in_production': 'processing',
      'in_transit': 'mailed',
      'delivered': 'delivered',
      'failed': 'failed',
      'returned_to_sender': 'returned',
      'processed': 'mailed'
    };

    const mappedStatus = statusMap[status] || status;

    // Update the lead with new status
    const updated = await base44.entities.VTONLead.update(lead.id, {
      lob_delivery_status: mappedStatus,
      lob_last_updated: new Date().toISOString(),
      lob_estimated_cost: cost || lead.lob_estimated_cost
    });

    console.log(`✓ Synced letter ${letter_id}: ${status} → ${mappedStatus}`);

    return Response.json({ 
      status: 'success',
      lead_id: lead.id,
      lead_name: `${lead.first_name} ${lead.last_name}`,
      lob_status: status,
      synced_status: mappedStatus,
      message: `Updated to "${mappedStatus}"`
    });

  } catch (error) {
    console.error('Sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});