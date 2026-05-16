import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * PropertyRadar to VTONOpportunity Daily Import
 * Fetches new listings from PropertyRadar API and creates VTONOpportunity records
 * Automatically assigns to partners and triggers notifications
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Use service role for scheduled/automated calls
    const PROPERTY_RADAR_API_KEY = Deno.env.get('PROPERTY_RADAR_API_KEY');
    if (!PROPERTY_RADAR_API_KEY) {
      return Response.json({ error: 'PROPERTY_RADAR_API_KEY not configured' }, { status: 500 });
    }

    // Fetch leads from PropertyRadar API - First try to get account info to verify API key
    const testResponse = await fetch('https://api.propertyradar.com/v1/account', {
      headers: {
        'Authorization': `Bearer ${PROPERTY_RADAR_API_KEY}`,
        'Content-Type': 'application/json'
      },
      method: 'GET'
    });

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      throw new Error(`PropertyRadar API authentication failed: ${testResponse.status} ${testResponse.statusText} - ${errorText}`);
    }

    const accountInfo = await testResponse.json();
    console.log('Account info:', accountInfo);

    // Now search for properties
    const searchResponse = await fetch('https://api.propertyradar.com/v1/properties', {
      headers: {
        'Authorization': `Bearer ${PROPERTY_RADAR_API_KEY}`,
        'Content-Type': 'application/json'
      },
      method: 'GET',
      body: JSON.stringify({
        limit: 50
      })
    });

    if (!searchResponse.ok) {
      const errorText = await searchResponse.text();
      throw new Error(`PropertyRadar search error: ${searchResponse.status} ${searchResponse.statusText} - ${errorText}`);
    }

    const apiData = await searchResponse.json();
    console.log('Search response:', apiData);
    const properties = apiData.results || apiData.data || apiData.properties || [];

    if (!Array.isArray(properties) || properties.length === 0) {
      return Response.json({
        status: 'success',
        message: 'No new properties found',
        imported: 0
      });
    }

    // Get active partners for assignment
    const partners = await base44.asServiceRole.entities.PartnerApplication.filter({ status: 'approved' });
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
      skipped: [],
      notifications_sent: 0
    };

    // Get existing opportunities for deduplication
    const existingOpps = await base44.asServiceRole.entities.VTONOpportunity.list();
    const existingAddresses = new Set(
      existingOpps.map(opp => opp.property_address?.toLowerCase())
    );

    // Round-robin partner assignment index
    let partnerIndex = 0;

    // Process each property
    for (const property of properties) {
      try {
        const address = normalizeAddress(property.property_address || property.Address || property.address || '');
        
        // Skip if already exists
        if (!address || existingAddresses.has(address.toLowerCase())) {
          results.duplicates++;
          continue;
        }

        // Parse owner info
        const ownerInfo = parseOwnerField(property.Owner || property.owner_name || '');
        const spouseInfo = parseSpouseField(property.Owner || '');
        
        // Round-robin partner assignment
        const assignedPartner = partners[partnerIndex % partners.length];
        partnerIndex++;

        // Map PropertyRadar fields to VTONOpportunity format
        const opportunity = await base44.asServiceRole.entities.VTONOpportunity.create({
          partner_email: assignedPartner.email,
          
          // Homeowner information
          homeowner_name: buildHomeownerName(ownerInfo, spouseInfo),
          homeowner_phone: normalizePhone(property.phone || property.owner_phone || ''),
          homeowner_email: normalizeEmail(property.email || property.owner_email || ''),
          
          // Property address
          property_address: address,
          city: normalizeText(property.city || property.City || ''),
          state: normalizeState(property.state || property.property_state || 'CA'),
          
          // Property details
          property_type: mapPropertyType(property.property_type || ''),
          estimated_price: parseCurrency(property.listing_price || property['Est Value'] || 0),
          estimated_equity: parseCurrency(property.estimated_equity || property['Est Equity $'] || 0),
          
          // Distress indicators
          distress_score: parseNumber(property['Distress Score'] || 0),
          listing_dom: parseNumber(property['Listing DOM'] || property.days_on_market || 0),
          
          // Loan indicators
          va_loan_confirmed: detectVALoanIndicator(property),
          
          // Listing information
          listing_status: mapListingStatus(property.listing_status || 'active'),
          
          // Opportunity tracking
          opportunity_status: 'assigned',
          priority: calculatePriority(property),
          crm_notes: buildCrmNotes(property),
          
          // Default values
          qr_scanned: false,
          needs_reassignment: false
        });

        results.created++;

        // Trigger notification to admin
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
          property: property.property_address || 'Unknown',
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

// ============ FIELD MAPPING UTILITIES ============

/**
 * Parse PropertyRadar Owner field: "LASTNAME,FIRSTNAME MIDDLE & SPOUSE"
 */
function parseOwnerField(owner) {
  if (!owner) return { first_name: '', last_name: '', middle_name: '' };

  const parts = owner.split('&').map(p => p.trim());
  const primary = parts[0];
  
  const [lastName, firstAndMiddle] = primary.split(',').map(p => p.trim());
  const nameParts = (firstAndMiddle || '').split(' ').filter(p => p);
  const firstName = nameParts[0] || '';
  const middleName = nameParts.slice(1).join(' ') || '';

  return { first_name: firstName, last_name: lastName || '', middle_name: middleName };
}

/**
 * Parse spouse/co-owner from Owner field
 */
function parseSpouseField(owner) {
  if (!owner || !owner.includes('&')) return '';
  const parts = owner.split('&').map(p => p.trim());
  return parts[1] || '';
}

/**
 * Build full homeowner name
 */
function buildHomeownerName(ownerInfo, spouseInfo) {
  const fullName = `${ownerInfo.first_name} ${ownerInfo.last_name}`.trim();
  return spouseInfo ? `${fullName} & ${spouseInfo}` : fullName;
}

/**
 * Calculate priority based on distress score and DOM
 */
function calculatePriority(property) {
  const distressScore = parseNumber(property['Distress Score'] || 0);
  const dom = parseNumber(property['Listing DOM'] || 0);
  
  if (distressScore >= 70 || dom >= 90) return 'high';
  if (distressScore >= 40 || dom >= 60) return 'medium';
  return 'low';
}

/**
 * Detect VA loan likelihood
 */
function detectVALoanIndicator(property) {
  const distressScore = parseNumber(property['Distress Score'] || 0);
  const hasMortgage = parseCurrency(property.estimated_mortgage_balance || 0) > 0;
  return distressScore >= 30 && hasMortgage;
}

/**
 * Map property type to standard format
 */
function mapPropertyType(type) {
  const typeMap = {
    'single_family_residential': 'SFR',
    'single family residential': 'SFR',
    'sfr': 'SFR',
    'condo': 'Condo',
    'condominium': 'Condo',
    'townhouse': 'Townhouse',
    'multi_family': 'Multi-Family',
    'manufactured': 'Manufactured',
    'mobile': 'Mobile'
  };
  
  const normalized = (type || '').toLowerCase().trim();
  return typeMap[normalized] || 'SFR';
}

/**
 * Map listing status
 */
function mapListingStatus(status) {
  const statusMap = {
    'active': 'active',
    'for_sale': 'active',
    'pending': 'pending',
    'contingent': 'pending',
    'sold': 'sold',
    'closed': 'sold',
    'off_market': 'off_market',
    'withdrawn': 'off_market',
    'expired': 'off_market'
  };
  
  const normalized = (status || '').toLowerCase().trim();
  return statusMap[normalized] || 'active';
}

/**
 * Normalize phone number
 */
function normalizePhone(phone) {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Normalize email
 */
function normalizeEmail(email) {
  if (!email) return '';
  return email.toLowerCase().trim();
}

/**
 * Normalize address
 */
function normalizeAddress(address) {
  if (!address) return '';
  return address.trim();
}

/**
 * Normalize text
 */
function normalizeText(text) {
  if (!text) return '';
  return text.trim();
}

/**
 * Normalize state to 2-letter code
 */
function normalizeState(state) {
  if (!state) return 'CA';
  const stateMap = { 'california': 'CA', 'ca': 'CA' };
  const normalized = (state || '').toLowerCase().trim();
  return stateMap[normalized] || normalized.toUpperCase().slice(0, 2);
}

/**
 * Parse currency values
 */
function parseCurrency(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const cleaned = value.toString().replace(/[$,]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Parse number values
 */
function parseNumber(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  return parseFloat(value) || 0;
}

/**
 * Build CRM notes
 */
function buildCrmNotes(property) {
  return `Auto-imported from PropertyRadar on ${new Date().toISOString().split('T')[0]} | Distress: ${property['Distress Score'] || 'N/A'} | DOM: ${property['Listing DOM'] || 'N/A'}`;
}