import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * PropertyRadar to VTONOpportunity Daily Import
 * Uses the LimitedREI fieldset + PhoneAvailability/EmailAvailability flags.
 * Actual phone/email are purchased separately via the Persons API — leads missing
 * contact availability are tagged in crm_notes for manual enrichment.
 */

Deno.serve(async (req) => {
  try {
    console.log('=== importPropertyRadarOpportunities START ===');
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const PROPERTY_RADAR_API_KEY = Deno.env.get('PROPERTY_RADAR_API_KEY');
    if (!PROPERTY_RADAR_API_KEY) {
      return Response.json({ error: 'PROPERTY_RADAR_API_KEY not configured' }, { status: 500 });
    }

    let bodyParams = {};
    try { bodyParams = await req.json(); } catch (_) {}
    const limit = bodyParams.limit || 50;
    const purchase = bodyParams.purchase ?? 1;

    // Comma-separated Fields works! But combined fieldsets must be <= 50 fields total.
    // Grid (14 fields): PType Address City SqFt AVM AvailableEquity Owner PhoneAvailability EmailAvailability DistressScore + flags
    // Individual extras we need: RadarID State ZipFive FirstPurpose FirstLoanType ListingPrice DaysOnMarket TotalLoanBalance OwnerFirstName OwnerLastName
    const fieldsQuery = 'Fields=Grid,RadarID,State,ZipFive,FirstPurpose,FirstLoanType,ListingPrice,DaysOnMarket,TotalLoanBalance,OwnerFirstName,OwnerLastName';

    const searchResponse = await fetch(
      `https://api.propertyradar.com/v1/properties?Purchase=${purchase}&Limit=${limit}&${fieldsQuery}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PROPERTY_RADAR_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Criteria: [
            { name: "State", value: ["CA"] },
            { name: "FirstLoanType", value: ["V"] },
            { name: "DaysOnMarket", value: [[1, 90]] },
            { name: "ListingStatus", value: ["Active"] }
          ]
        })
      }
    );

    const responseText = await searchResponse.text();
    console.log('PropertyRadar HTTP status:', searchResponse.status);
    console.log('PropertyRadar raw response (first 800 chars):', responseText.substring(0, 800));

    if (!searchResponse.ok) {
      throw new Error(`PropertyRadar API error: ${searchResponse.status} - ${responseText}`);
    }

    const apiData = JSON.parse(responseText);
    const firstResult = (apiData.results || [])[0] || null;
    console.log('totalResultCount:', apiData.totalResultCount, '| returned:', (apiData.results || []).length);

    const properties = apiData.results || [];

    if (properties.length === 0) {
      return Response.json({
        status: 'success',
        message: 'No properties returned from PropertyRadar API',
        totalResultCount: apiData.totalResultCount || 0,
        imported: 0
      });
    }

    // Get active partners for round-robin assignment
    const partners = await base44.asServiceRole.entities.PartnerApplication.filter({ status: 'approved' });
    if (partners.length === 0) {
      return Response.json({ error: 'No approved partners available to assign opportunities' }, { status: 500 });
    }

    // Get existing opportunity addresses for deduplication
    const existingOpps = await base44.asServiceRole.entities.VTONOpportunity.list();
    const existingAddresses = new Set(
      existingOpps.map(o => (o.property_address || '').toLowerCase().trim())
    );

    const results = { total: properties.length, created: 0, needsEnrichment: 0, duplicates: 0, errors: [] };
    let partnerIndex = 0;

    for (const prop of properties) {
      try {
        const address = (prop.Address || '').trim();
        if (!address || existingAddresses.has(address.toLowerCase())) {
          results.duplicates++;
          continue;
        }

        const assignedPartner = partners[partnerIndex % partners.length];
        partnerIndex++;

        const firstPurpose = (prop.FirstPurpose || '').toUpperCase();
        const vaLoanConfirmed = firstPurpose.includes('VA') || firstPurpose.includes('VETERAN');

        const ownerName = prop.OwnerFirstName && prop.OwnerLastName
          ? `${prop.OwnerFirstName} ${prop.OwnerLastName}`.trim()
          : (prop.Owner || '').trim();

        const distressScore = parseFloat(prop.DistressScore) || 0;
        const dom = parseFloat(prop.DaysOnMarket) || 0;
        const priority = distressScore >= 70 || dom >= 90 ? 'high'
          : distressScore >= 40 || dom >= 60 ? 'medium' : 'low';

        // PhoneAvailability / EmailAvailability: true means contact data exists and can be purchased
        const phoneAvailable = prop.PhoneAvailability === true || prop.PhoneAvailability === 1;
        const emailAvailable = prop.EmailAvailability === true || prop.EmailAvailability === 1;
        const needsEnrichment = !phoneAvailable || !emailAvailable;
        const missingFields = [!phoneAvailable && 'phone', !emailAvailable && 'email'].filter(Boolean).join(', ');

        const enrichmentTag = needsEnrichment
          ? ` | ⚠️ NEEDS ENRICHMENT: ${missingFields} not available`
          : ` | ✅ Phone & email available — purchase via Persons API`;

        await base44.asServiceRole.entities.VTONOpportunity.create({
          partner_email: assignedPartner.email,
          homeowner_name: ownerName,
          homeowner_phone: '',
          homeowner_email: '',
          property_address: address,
          city: prop.City || '',
          state: prop.State || 'CA',
          property_type: mapPropertyType(prop.PType || ''),
          estimated_price: parseFloat(prop.ListingPrice || prop.AVM) || 0,
          estimated_equity: parseFloat(prop.AvailableEquity) || 0,
          distress_score: distressScore,
          listing_dom: dom,
          va_loan_confirmed: vaLoanConfirmed,
          listing_status: mapListingStatus(prop.ListingStatus || 'active'),
          opportunity_status: 'assigned',
          priority,
          crm_notes: `Auto-imported from PropertyRadar on ${new Date().toISOString().split('T')[0]} | RadarID: ${prop.RadarID || 'N/A'} | Distress: ${distressScore} | DOM: ${dom}${enrichmentTag}`,
          qr_scanned: false,
          needs_reassignment: false
        });

        existingAddresses.add(address.toLowerCase());
        results.created++;
        if (needsEnrichment) results.needsEnrichment++;

      } catch (err) {
        results.errors.push({ property: prop.Address || 'Unknown', error: err.message });
      }
    }

    // Notify admin of import results
    if (results.created > 0 || results.errors.length > 0) {
      try {
        await base44.functions.invoke('notifyPropertyRadarImportResults', {
          created: results.created,
          duplicates: results.duplicates,
          total: results.total,
          errors: results.errors
        });
      } catch (notifyErr) {
        console.warn('Admin notification failed:', notifyErr.message);
      }
    }

    return Response.json({
      status: 'success',
      message: `Imported ${results.created} new opportunities (${results.needsEnrichment} need contact enrichment). ${results.duplicates} duplicates skipped.`,
      details: results,
      note: purchase === 0 ? 'PREVIEW MODE — no records billed' : 'LIVE MODE — records billed to PropertyRadar account'
    });

  } catch (error) {
    console.error('PropertyRadar import error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function mapPropertyType(type) {
  const t = (type || '').toLowerCase();
  if (t.includes('condo')) return 'Condo';
  if (t.includes('town')) return 'Townhouse';
  if (t.includes('multi') || t.includes('duplex')) return 'Multi-Family';
  return 'SFR';
}

function mapListingStatus(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('pending') || s.includes('contingent')) return 'pending';
  if (s.includes('sold') || s.includes('closed')) return 'sold';
  if (s.includes('off') || s.includes('expired')) return 'off_market';
  return 'active';
}