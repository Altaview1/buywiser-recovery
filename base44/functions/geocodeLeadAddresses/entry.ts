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

    // Get all ActivatorLeads with valid addresses (using user's auth context)
    const allLeads = await base44.entities.ActivatorLead.list('-created_date', 1000);
    const leads = allLeads.filter(l => l.property_address && !l.lat);
    
    console.log(`Found ${leads.length} leads to geocode`);
    
    let processedCount = 0;
    const errors = [];

    for (const lead of leads) {
      try {
        // Geocode using Google Maps Geocoding API with region bias
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(lead.property_address)}&componentRestrictions=country:us&key=${apiKey}`;
        console.log(`Geocoding: ${lead.property_address}`);
        
        const res = await fetch(url);
        const data = await res.json();

        console.log(`Response status: ${data.status}`);
        
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          console.log(`✓ Found coords for ${lead.property_address}: ${lat}, ${lng}`);
          
          // Update lead with coordinates (using user's auth context)
          await base44.entities.ActivatorLead.update(lead.id, { lat, lng });
          processedCount++;
        } else {
          errors.push({ address: lead.property_address, error: data.status || 'No results' });
          console.log(`✗ ${data.status || 'No results'}: ${lead.property_address}`);
        }
      } catch (err) {
        const errMsg = String(err);
        console.error(`Error geocoding ${lead.property_address}:`, errMsg);
        errors.push({ address: lead.property_address, error: errMsg });
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return Response.json({
      success: true,
      processed: processedCount,
      skipped: allLeads.length - leads.length,
      errors: errors.length,
      message: `Geocoded ${processedCount} leads`
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
});