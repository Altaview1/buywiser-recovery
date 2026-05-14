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
 * Flexible to handle various PropertyRadar export formats
 */
function mapPropertyRadarLead(rawLead) {
  return {
    // Owner info (PropertyRadar fields: owner_first_name, first_name, name, etc.)
    first_name: rawLead.owner_first_name || rawLead.first_name || rawLead.name?.split(' ')[0] || '',
    last_name: rawLead.owner_last_name || rawLead.last_name || rawLead.name?.split(' ').slice(1).join(' ') || '',
    spouse_name: rawLead.spouse_name || rawLead.co_owner_name || '',
    
    // Contact info
    phone: normalizePhone(rawLead.phone || rawLead.phone_number || ''),
    email: (rawLead.email || rawLead.owner_email || '').toLowerCase(),
    
    // Mailing address
    mailing_address: rawLead.mailing_address || rawLead.owner_address || '',
    
    // Property address (PropertyRadar fields: property_address, address, street_address, etc.)
    property_address: rawLead.property_address || rawLead.address || rawLead.street_address || '',
    city: rawLead.city || rawLead.property_city || '',
    state: rawLead.state || rawLead.property_state || '',
    zip_code: rawLead.zip_code || rawLead.zip || rawLead.postal_code || '',
    
    // Listing info
    listing_date: rawLead.listing_date || rawLead.listed_date || null,
    listing_price: parseFloat(rawLead.listing_price || rawLead.list_price || 0),
    
    // Equity estimates
    estimated_equity: parseFloat(rawLead.estimated_equity || rawLead.equity || 0),
    estimated_mortgage_balance: parseFloat(rawLead.estimated_mortgage_balance || rawLead.mortgage_balance || 0),
    
    // Indicators
    veteran_indicator: rawLead.veteran_indicator === true || rawLead.veteran_indicator === 'true',
    likely_va_loan_indicator: rawLead.likely_va_loan === true || rawLead.likely_va_loan === 'true' || rawLead.va_loan === true,
    
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

function normalizePhone(phone) {
  if (!phone) return '';
  // Remove all non-digits and return
  return phone.replace(/\D/g, '');
}