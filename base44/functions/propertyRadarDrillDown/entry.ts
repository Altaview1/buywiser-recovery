import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Admin-only: drill-down queries for PropertyRadar dashboard
/**
 * Drill-down query for PropertyRadar dashboard.
 * Accepts { metric: "new_listings" | "total_pool" } and returns
 * a breakdown by DOM buckets so the user can see depth.
 */

async function queryCount(apiKey, domRange) {
  const response = await fetch(
    'https://api.propertyradar.com/v1/properties?Purchase=0&Limit=1&Fields=RadarID',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Criteria: [
          { name: "State", value: ["CA"] },
          { name: "FirstLoanType", value: ["V"] },
          { name: "DaysOnMarket", value: [domRange] },
          { name: "ListingStatus", value: ["Active"] }
        ]
      })
    }
  );
  const text = await response.text();
  if (!response.ok) throw new Error(`PropertyRadar API error: ${response.status} - ${text}`);
  const data = JSON.parse(text);
  return data.totalResultCount || 0;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }
    const PROPERTY_RADAR_API_KEY = Deno.env.get('PROPERTY_RADAR_API_KEY');
    if (!PROPERTY_RADAR_API_KEY) {
      return Response.json({ error: 'PROPERTY_RADAR_API_KEY not configured' }, { status: 500 });
    }

    let body = {};
    try { body = await req.json(); } catch (_) {}
    const metric = body.metric || 'total_pool';

    if (metric === 'new_listings') {
      // Breakdown: just entered market (today = 0-1 DOM)
      const [dom0, dom1] = await Promise.all([
        queryCount(PROPERTY_RADAR_API_KEY, [0, 0]),
        queryCount(PROPERTY_RADAR_API_KEY, [1, 1]),
      ]);
      return Response.json({
        metric: 'new_listings',
        title: 'New Listings Breakdown',
        subtitle: 'CA VA Active · 0–1 Days on Market',
        total: dom0 + dom1,
        buckets: [
          { label: 'Just Listed (0 days)', count: dom0, color: 'blue' },
          { label: '1 Day on Market', count: dom1, color: 'indigo' },
        ]
      });
    } else {
      // Total pool breakdown by DOM range
      const [d1_7, d8_30, d31_60, d61_90] = await Promise.all([
        queryCount(PROPERTY_RADAR_API_KEY, [1, 7]),
        queryCount(PROPERTY_RADAR_API_KEY, [8, 30]),
        queryCount(PROPERTY_RADAR_API_KEY, [31, 60]),
        queryCount(PROPERTY_RADAR_API_KEY, [61, 90]),
      ]);
      const total = d1_7 + d8_30 + d31_60 + d61_90;
      return Response.json({
        metric: 'total_pool',
        title: 'Total Pool Breakdown',
        subtitle: 'CA VA Active · 1–90 Days on Market',
        total,
        buckets: [
          { label: '1–7 Days (Fresh)', count: d1_7, color: 'green' },
          { label: '8–30 Days (Recent)', count: d8_30, color: 'blue' },
          { label: '31–60 Days (Aging)', count: d31_60, color: 'amber' },
          { label: '61–90 Days (Stale)', count: d61_90, color: 'red' },
        ]
      });
    }
  } catch (error) {
    console.error('propertyRadarDrillDown error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});