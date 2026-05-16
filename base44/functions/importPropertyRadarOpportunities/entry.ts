import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * PropertyRadar to VTONOpportunity Daily Import
 * POST /v1/properties — filters for active CA listings with VA loan indicators
 * Bearer token auth
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const PROPERTY_RADAR_API_KEY = Deno.env.get('PROPERTY_RADAR_API_KEY');
    if (!PROPERTY_RADAR_API_KEY) {
      return Response.json({ error: 'PROPERTY_RADAR_API_KEY not configured' }, { status: 500 });
    }

    // Parse optional body params (e.g. manual trigger with custom limit)
    let bodyParams = {};
    try { bodyParams = await req.json(); } catch (_) {}
    const limit = bodyParams.limit || 50;
    const purchase = bodyParams.purchase ?? 0; // Default 0 = preview (no charge). Set to 1 in production.

    // Search PropertyRadar for active CA listings that likely have VA financing
    // Fields go as query params, Criteria in the POST body
    const fields = [
      "RadarID", "Address", "City", "State", "ZipFive",
      "Owner", "OwnerFirstName", "OwnerLastName",
      "AVM", "AvailableEquity", "TotalLoanBalance",
      "ListingPrice", "DaysOnMarket", "ListingStatus",
      "DistressScore", "PType",
      "FirstPurpose", "FirstLenderOriginal",
      "Latitude", "Longitude"
    ].map(f => `Fields=${encodeURIComponent(f)}`).join('&');

    const searchResponse = await fetch(
      `https://api.propertyradar.com/v1/properties?Purchase=${purchase}&Limit=${limit}&${fields}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PROPERTY_RADAR_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Criteria: [
            { name: "State", value: ["CA"] },
            { name: "isListedForSale", value: [1] }
          ]
        })
      }
    );

    const responseText = await searchResponse.text();
    console.log('PropertyRadar response status:', searchResponse.status);
    console.log('PropertyRadar response:', responseText.substring(0, 500));

    if (!searchResponse.ok) {
      throw new Error(`PropertyRadar API error: ${searchResponse.status} - ${responseText}`);
    }

    const apiData = JSON.parse(responseText);
    const properties = apiData.results || [];

    console.log(`PropertyRadar returned ${properties.length} properties (resultCount: ${apiData.resultCount})`);

    if (properties.length === 0) {
      return Response.json({
        status: 'success',
        message: 'No properties returned from PropertyRadar',
        resultCount: apiData.resultCount || 0,
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

    const results = { total: properties.length, created: 0, duplicates: 0, skipped: 0, errors: [] };
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

        // Detect VA loan: FirstPurpose often contains "VA" for VA-originated loans
        const firstPurpose = (prop.FirstPurpose || '').toUpperCase();
        const vaLoanConfirmed = firstPurpose.includes('VA') || firstPurpose.includes('VETERAN');

        // Build homeowner name
        const ownerName = prop.OwnerFirstName && prop.OwnerLastName
          ? `${prop.OwnerFirstName} ${prop.OwnerLastName}`.trim()
          : (prop.Owner || '').trim();

        // Calculate priority
        const distressScore = parseFloat(prop.DistressScore) || 0;
        const dom = parseFloat(prop.DaysOnMarket) || 0;
        const priority = distressScore >= 70 || dom >= 90 ? 'high'
          : distressScore >= 40 || dom >= 60 ? 'medium' : 'low';

        const opportunity = await base44.asServiceRole.entities.VTONOpportunity.create({
          partner_email: assignedPartner.email,
          homeowner_name: ownerName,
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
          crm_notes: `Auto-imported from PropertyRadar on ${new Date().toISOString().split('T')[0]} | RadarID: ${prop.RadarID || 'N/A'} | Distress: ${distressScore} | DOM: ${dom}`,
          qr_scanned: false,
          needs_reassignment: false
        });

        existingAddresses.add(address.toLowerCase());
        results.created++;

        // Notify partner
        try {
          await base44.functions.invoke('notifyNewVTONOpportunity', {
            opportunity_id: opportunity.id,
            property_address: opportunity.property_address,
            homeowner_name: opportunity.homeowner_name,
            estimated_price: opportunity.estimated_price,
            partner_email: opportunity.partner_email
          });
        } catch (notifyErr) {
          console.warn('Notification failed for', address, notifyErr.message);
        }

      } catch (err) {
        results.errors.push({ property: prop.Address || 'Unknown', error: err.message });
      }
    }

    return Response.json({
      status: 'success',
      message: `Imported ${results.created} new opportunities. ${results.duplicates} duplicates skipped.`,
      details: results,
      note: purchase === 0 ? 'PREVIEW MODE — set purchase=1 to actually import and be billed' : 'LIVE MODE — records billed to PropertyRadar account'
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