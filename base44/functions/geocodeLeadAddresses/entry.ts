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

    // Get all ActivatorLeads with valid addresses
    const allLeads = await base44.entities.ActivatorLead.list('-created_date', 1000);
    const leads = allLeads.filter(l => l.property_address && !l.lat);
    
    let processedCount = 0;
    const errors = [];

    for (const lead of leads) {
      try {
        // Geocode using Google Maps Geocoding API
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(lead.property_address)}&key=${apiKey}`;
        const res = await fetch(url, { timeout: 5000 });
        
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`);
        }

        const data = await res.json();

        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          
          // Update lead with coordinates
          await base44.entities.ActivatorLead.update(lead.id, { lat, lng });
          processedCount++;
        }
      } catch (err) {
        errors.push({ address: lead.property_address, error: String(err) });
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