import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'Maps API key not configured' }, { status: 500 });
    }

    // Get all ActivatorLeads
    const leads = await base44.asServiceRole.entities.ActivatorLead.list('-created_date', 1000);
    
    let processedCount = 0;
    let errorCount = 0;

    for (const lead of leads) {
      if (!lead.property_address) continue;

      try {
        // Geocode the address using Google Maps Geocoding API
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(lead.property_address)}&key=${apiKey}`;
        const geocodeRes = await fetch(geocodeUrl);
        const geocodeData = await geocodeRes.json();

        if (geocodeData.results && geocodeData.results.length > 0) {
          const location = geocodeData.results[0].geometry.location;
          
          // Update lead with lat/lng
          await base44.asServiceRole.entities.ActivatorLead.update(lead.id, {
            lat: location.lat,
            lng: location.lng,
          });
          
          processedCount++;
        }
      } catch (err) {
        console.error(`Failed to geocode ${lead.property_address}:`, err);
        errorCount++;
      }
    }

    return Response.json({
      success: true,
      processed: processedCount,
      errors: errorCount,
      total: leads.length,
      message: `Geocoded ${processedCount} leads successfully`
    });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});