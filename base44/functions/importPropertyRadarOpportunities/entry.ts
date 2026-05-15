import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * PropertyRadar to VTONOpportunity Daily Import
 * Fetches new listings from PropertyRadar API and creates VTONOpportunity records
 * Automatically assigns to partners and triggers notifications
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Admin-only function
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const PROPERTY_RADAR_API_KEY = Deno.env.get('PROPERTY_RADAR_API_KEY');
    if (!PROPERTY_RADAR_API_KEY) {
      return Response.json({ error: 'PROPERTY_RADAR_API_KEY not configured' }, { status: 500 });
    }

    // Fetch leads from PropertyRadar API
    const response = await fetch('https://api.propertyradar.com/prcore/v1/properties', {
      headers: {
        'Authorization': `Bearer ${PROPERTY_RADAR_API_KEY}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        limit: 100,
        offset: 0,
        filters: {
          state: 'CA',
          listing_status: 'active',
          veteran_friendly: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`PropertyRadar API error: ${response.status} ${response.statusText}`);
    }

    const apiData = await response.json();
    const properties = apiData.results || apiData.data || [];

    if (!Array.isArray(properties) || properties.length === 0) {
      return Response.json({
        status: 'success',
        message: 'No new properties found',
        imported: 0
      });
    }

    // Get active partners for assignment
    const partners = await base44.entities.PartnerApplication.filter({ status: 'approved' });
    if (partners.length === 0) {
      return Response.json({ 
        error: 'No approved partners available to assign opportunities' 
      }, { status: 500 });
    }

    const results = {
      total: properties.length,
      created: 0,
      duplicates: 0,
      errors: [],
      notifications_sent: 0
    };

    // Get existing opportunities for deduplication
    const existingOpps = await base44.entities.VTONOpportunity.list();
    const existingAddresses = new Set(
      existingOpps.map(opp => opp.property_address?.toLowerCase())
    );

    // Process each property
    for (const property of properties) {
      try {
        const address = property.property_address || property.Address || property.address;
        
        // Skip if already exists
        if (!address || existingAddresses.has(address.toLowerCase())) {
          results.duplicates++;
          continue;
        }

        // Parse owner info
        const ownerInfo = parseOwnerField(property.Owner || property.owner_name || '');
        
        // Round-robin partner assignment
        const assignedPartner = partners[results.created % partners.length];

        // Create VTONOpportunity record
        const opportunity = await base44.entities.VTONOpportunity.create({
          partner_email: assignedPartner.email,
          homeowner_name: `${ownerInfo.first_name} ${ownerInfo.last_name}`.trim(),
          homeowner_phone: normalizePhone(property.phone || property.owner_phone || ''),
          homeowner_email: (property.email || property.owner_email || '').toLowerCase(),
          property_address: address,
          city: property.city || property.City || '',
          state: property.state || property.property_state || 'CA',
          property_type: property.property_type || 'SFR',
          estimated_price: parseFloat(property.listing_price || property['Est Value'] || 0),
          estimated_equity: parseFloat(property.estimated_equity || property['Est Equity $'] || 0),
          distress_score: parseFloat(property['Distress Score'] || 0),
          listing_dom: parseFloat(property['Listing DOM'] || 0),
          va_loan_confirmed: true,
          listing_status: 'active',
          opportunity_status: 'assigned',
          priority: calculatePriority(property),
          crm_notes: `Auto-imported from PropertyRadar API on ${new Date().toISOString().split('T')[0]}`
        });

        results.created++;

        // Trigger notification to admin (already configured via automation)
        await base44.functions.invoke('notifyNewVTONOpportunity', {
          opportunity_id: opportunity.id,
          property_address: opportunity.property_address,
          homeowner_name: opportunity.homeowner_name,
          homeowner_phone: opportunity.homeowner_phone,
          homeowner_email: opportunity.homeowner_email,
          estimated_price: opportunity.estimated_price,
          partner_email: opportunity.partner_email
        });

        results.notifications_sent++;

      } catch (err) {
        results.errors.push({
          property: property.property_address,
          error: err.message
        });
      }
    }

    return Response.json({
      status: 'success',
      message: `Imported ${results.created} opportunities, ${results.duplicates} duplicates skipped`,
      details: results
    });

  } catch (error) {
    console.error('PropertyRadar import error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Parse PropertyRadar Owner field: "LASTNAME,FIRSTNAME MIDDLE & SPOUSE"
 */
function parseOwnerField(owner) {
  if (!owner) return { first_name: '', last_name: '' };

  const parts = owner.split('&').map(p => p.trim());
  const primary = parts[0];
  
  const [lastName, firstAndMiddle] = primary.split(',').map(p => p.trim());
  const firstName = firstAndMiddle?.split(' ')[0] || '';

  return {
    first_name: firstName,
    last_name: lastName || ''
  };
}

function normalizePhone(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Calculate priority based on distress score and DOM
 */
function calculatePriority(property) {
  const distressScore = parseFloat(property['Distress Score'] || 0);
  const dom = parseFloat(property['Listing DOM'] || 0);
  
  if (distressScore >= 70 || dom >= 90) return 'high';
  if (distressScore >= 40 || dom >= 60) return 'medium';
  return 'low';
}