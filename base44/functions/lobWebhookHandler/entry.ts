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

    console.log('Lob Webhook Event Type:', payload.event_type);

    // Lob sends different event types - we care about letter events
    const { event_type, data } = payload;

    // Ignore non-letter events
    if (!event_type?.includes('letter')) {
      console.log('Ignoring non-letter event:', event_type);
      return Response.json({ received: true });
    }

    // Extract letter ID from Lob webhook structure
    const letterId = data?.id;
    if (!letterId) {
      console.warn('No letter ID found in webhook payload');
      return Response.json({ received: true, warning: 'No letter ID' });
    }

    // Extract tracking status - map Lob event types to status
    let trackingStatus = 'processing';
    if (event_type === 'letter.rendered_pdf') {
      trackingStatus = 'processing';
    } else if (event_type === 'letter.created') {
      trackingStatus = 'processing';
    } else if (event_type === 'letter.in_transit') {
      trackingStatus = 'in_transit';
    } else if (event_type === 'letter.delivered') {
      trackingStatus = 'delivered';
    } else if (event_type === 'letter.failed') {
      trackingStatus = 'failed';
    } else if (event_type === 'letter.returned') {
      trackingStatus = 'returned';
    }

    const expectedDeliveryDate = data?.expected_delivery_date;
    
    console.log(`Letter ${letterId} event: ${event_type} -> status: ${trackingStatus}`);

    // Find the lead associated with this letter
    const leads = await base44.asServiceRole.entities.VTONLead.filter({});
    const lead = leads.find(l => l.lob_letter_id === letterId);

    if (!lead) {
      console.log(`No lead found for Lob letter ${letterId} (event: ${event_type})`);
      return Response.json({ received: true, warning: 'Lead not found' });
    }

    // Update lead with tracking status
    const updateData = {
      lob_delivery_status: trackingStatus,
      lob_last_updated: new Date().toISOString()
    };

    if (trackingStatus === 'delivered' && expectedDeliveryDate) {
      updateData.lob_delivery_date = expectedDeliveryDate;
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