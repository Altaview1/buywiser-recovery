import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Lob Webhook Handler
 * Receives tracking events from Lob when mail pieces are printed, in transit, or delivered
 * Updates VTONLead records with delivery status
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    console.log('Lob Webhook Event:', payload);

    // Lob sends different event types
    const { event_type, id, object_type, object } = payload;

    // We only care about letter tracking events
    if (object_type !== 'letter') {
      return Response.json({ received: true });
    }

    // Extract tracking information
    const letterId = id;
    const trackingStatus = object?.tracking?.status; // 'in_transit', 'delivered', 'returned', etc.
    const expectedDeliveryDate = object?.tracking?.expected_delivery_date;
    
    console.log(`Letter ${letterId} status: ${trackingStatus}`);

    // Find the lead associated with this letter
    // We need to store the Lob letter_id when we send the letter
    const leads = await base44.asServiceRole.entities.VTONLead.filter({});
    const lead = leads.find(l => l.lob_letter_id === letterId);

    if (!lead) {
      console.log(`No lead found for Lob letter ${letterId}`);
      return Response.json({ received: true, warning: 'Lead not found' });
    }

    // Update lead with tracking status
    const updateData: any = {
      lob_delivery_status: trackingStatus,
      lob_last_updated: new Date().toISOString()
    };

    if (trackingStatus === 'delivered') {
      updateData.lob_delivered_date = expectedDeliveryDate || new Date().toISOString();
    }

    await base44.asServiceRole.entities.VTONLead.update(lead.id, updateData);

    console.log(`Updated lead ${lead.id} with delivery status: ${trackingStatus}`);

    return Response.json({ 
      received: true, 
      lead_id: lead.id, 
      status: trackingStatus 
    });
  } catch (error) {
    console.error('Lob Webhook Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});