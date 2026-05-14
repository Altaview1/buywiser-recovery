import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Bulk Import Engine for PropertyRadar Data
 * Accepts CSV or JSON, maps to VTONLead, deduplicates, batch creates
 * Triggers rapid response campaign on each lead
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    
    const { leads, source = 'PropertyRadar' } = body;

    if (!Array.isArray(leads) || leads.length === 0) {
      return Response.json({ error: 'Invalid or empty leads array' }, { status: 400 });
    }

    const results = {
      total: leads.length,
      created: 0,
      duplicates: 0,
      errors: [],
      campaign_triggered: 0
    };

    // Get existing leads for deduplication (email + phone + address combo)
    const existingLeads = await base44.entities.VTONLead.list();
    const existingLookup = new Map();
    
    existingLeads.forEach(lead => {
      const key = `${lead.email || ''}|${lead.phone || ''}|${lead.property_address || ''}`;
      existingLookup.set(key, lead.id);
    });

    // Process each lead
    for (const rawLead of leads) {
      try {
        // Map PropertyRadar fields to VTONLead schema
        const mappedLead = mapPropertyRadarLead(rawLead);

        // Deduplication key
        const dedupKey = `${mappedLead.email || ''}|${mappedLead.phone || ''}|${mappedLead.property_address || ''}`;
        
        if (existingLookup.has(dedupKey)) {
          results.duplicates++;
          continue;
        }

        // Validate required fields
        if (!mappedLead.first_name || !mappedLead.property_address) {
          results.errors.push({
            lead: rawLead,
            error: 'Missing required: first_name or property_address'
          });
          continue;
        }

        // Create lead
        const created = await base44.entities.VTONLead.create(mappedLead);
        results.created++;

        // Trigger listing verification
        await base44.functions.invoke('vtonListingVerification', {
          lead_id: created.id,
          property_address: mappedLead.property_address,
          city: mappedLead.city,
          state: mappedLead.state,
          zip_code: mappedLead.zip_code
        });

        // Trigger rapid response campaign
        await base44.functions.invoke('vtonRapidResponse', {
          lead_id: created.id,
          verification_confidence: 'HIGH'
        });

        results.campaign_triggered++;

      } catch (err) {
        results.errors.push({
          lead: rawLead,
          error: err.message
        });
      }
    }

    return Response.json({
      status: 'success',
      import_summary: results,
      message: `Imported ${results.created} leads, ${results.duplicates} duplicates, ${results.campaign_triggered} campaigns triggered`
    });

  } catch (error) {
    console.error('Bulk import error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Map PropertyRadar export fields to VTONLead entity
 * Handles standard PropertyRadar format: Type, Address, City, Est Value, Est Equity $, Owner, Distress Score, Listing DOM
 */
function mapPropertyRadarLead(rawLead) {
  // Parse Owner field: "LASTNAME,FIRSTNAME MIDDLE & SPOUSE" → {first_name, last_name, spouse_name}
  const { first_name, last_name, spouse_name } = parseOwnerField(rawLead.Owner || '');

  return {
    // Owner info
    first_name: first_name || rawLead.owner_first_name || rawLead.first_name || '',
    last_name: last_name || rawLead.owner_last_name || rawLead.last_name || '',
    spouse_name: spouse_name || rawLead.spouse_name || rawLead.co_owner_name || '',
    
    // Contact info
    phone: normalizePhone(rawLead.phone || rawLead.phone_number || ''),
    email: (rawLead.email || rawLead.owner_email || '').toLowerCase(),
    
    // Mailing address
    mailing_address: rawLead.mailing_address || rawLead.owner_address || '',
    
    // Property address
    property_address: rawLead.property_address || rawLead.Address || rawLead.address || rawLead.street_address || '',
    city: rawLead.city || rawLead.City || rawLead.property_city || '',
    state: rawLead.state || rawLead.property_state || 'CA', // Default to CA if not provided
    zip_code: rawLead.zip_code || rawLead.zip || rawLead.postal_code || '',
    
    // Listing info
    listing_date: rawLead.listing_date || rawLead.listed_date || null,
    listing_price: parseFloat(rawLead.listing_price || rawLead['Est Value'] || rawLead.list_price || 0),
    
    // Equity estimates
    estimated_equity: parseFloat(rawLead.estimated_equity || rawLead['Est Equity $'] || rawLead.equity || 0),
    estimated_mortgage_balance: parseFloat(rawLead.estimated_mortgage_balance || rawLead.mortgage_balance || 0),
    
    // Indicators (assume veteran for now, can refine with distress scoring)
    veteran_indicator: true, // PropertyRadar lists typically filtered
    likely_va_loan_indicator: parseFloat(rawLead['Distress Score'] || 0) >= 30, // Higher distress = more likely VA loan
    
    // System fields
    lead_source: 'PropertyRadar',
    listing_source: 'PropertyRadar',
    listing_url: rawLead.listing_url || rawLead.mls_url || '',
    listing_photo_url: rawLead.listing_photo_url || rawLead.property_photo || '',
    
    campaign_stage: 'initial_outreach',
    sms_status: 'pending',
    email_status: 'pending',
    suppression_status: 'active',
    facebook_audience_synced: false,
    direct_mail_sent: false,
    appointment_booked: false,
    listing_verified: false
  };
}

/**
 * Parse PropertyRadar Owner field format: "LASTNAME,FIRSTNAME MIDDLE & SPOUSE"
 */
function parseOwnerField(owner) {
  if (!owner) return { first_name: '', last_name: '', spouse_name: '' };

  const parts = owner.split('&').map(p => p.trim());
  const primary = parts[0];
  const spouse = parts[1] || '';

  const [lastName, firstAndMiddle] = primary.split(',').map(p => p.trim());
  const firstName = firstAndMiddle?.split(' ')[0] || '';

  return {
    first_name: firstName,
    last_name: lastName || '',
    spouse_name: spouse
  };
}

function normalizePhone(phone) {
  if (!phone) return '';
  // Remove all non-digits and return
  return phone.replace(/\D/g, '');
}