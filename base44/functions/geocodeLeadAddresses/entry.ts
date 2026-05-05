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

    // Get all ActivatorLeads with valid addresses (force refresh on all)
    const leads = await base44.entities.ActivatorLead.list('-created_date', 1000);
    const validLeads = leads.filter(l => l.property_address && l.property_address.trim() !== '');
    
    console.log(`Found ${validLeads.length} leads to geocode (forcing refresh on all)`);
    
    let processedCount = 0;
    const errors = [];

    for (const lead of validLeads) {
      try {
        // Format address for API: normalize whitespace, remove special chars
        const formattedAddress = lead.property_address
          .trim()
          .replace(/\s+/g, ' ')
          .replace(/,\s*,/g, ',')
          .replace(/\b(CA|California)\b/gi, 'California')
          .replace(/\b(US|USA|United States)\b/gi, 'USA');
        
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(formattedAddress)}&key=${apiKey}`;
        console.log(`Geocoding: ${formattedAddress}`);
        
        const res = await fetch(url);
        const data = await res.json();

        console.log(`Status: ${data.status}, Address: ${formattedAddress}`);
        
        if (data.status === 'OK' && data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          console.log(`✓ Geocoded: ${lat}, ${lng}`);
          
          await base44.entities.ActivatorLead.update(lead.id, { lat, lng });
          processedCount++;
        } else {
          const errorMsg = data.error_message || data.status || 'Unknown error';
          errors.push({ address: formattedAddress, error: errorMsg });
          console.log(`✗ Error - ${errorMsg}`);
          
          // If REQUEST_DENIED, log API key issue
          if (data.status === 'REQUEST_DENIED') {
            console.error('CRITICAL: API key restricted or billing disabled. Check Google Cloud Console.');
          }
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
      skipped: leads.length - validLeads.length,
      errors: errors.length,
      totalAddresses: validLeads.length,
      message: `Force-refreshed ${processedCount}/${validLeads.length} leads`
    });
  } catch (error) {
    console.error('Geocoding error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
});