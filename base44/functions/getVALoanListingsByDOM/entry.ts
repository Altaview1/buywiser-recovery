import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Fetch VA Loan Listings grouped by Days on Market (DOM) buckets
 * Returns breakdown by DOM ranges with ability to drill down to individual leads
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { domBucket = null } = body; // 'new', '7-30', '30-60', '60-90' or null for summary

    // Query all active ActivatorLeads (these are VA listings filtered)
    // We need to filter by listing_date to calculate DOM
    const allLeads = await base44.asServiceRole.entities.ActivatorLead.list();
    
    // Calculate DOM for each lead
    const now = new Date();
    const leadsWithDOM = allLeads
      .map(lead => {
        if (!lead.listing_date) return null;
        const listingDate = new Date(lead.listing_date);
        const domDays = Math.floor((now - listingDate) / (1000 * 60 * 60 * 24));
        
        // Only include 0-90 day listings
        if (domDays < 0 || domDays > 90) return null;
        
        return { ...lead, domDays };
      })
      .filter(l => l !== null);

    // Define DOM buckets
    const buckets = {
      'new': { label: '0-7 Days', min: 0, max: 7, color: 'blue' },
      'week-2': { label: '8-14 Days', min: 8, max: 14, color: 'indigo' },
      '15-30': { label: '15-30 Days', min: 15, max: 30, color: 'green' },
      '30-60': { label: '31-60 Days', min: 31, max: 60, color: 'amber' },
      '60-90': { label: '61-90 Days', min: 61, max: 90, color: 'red' }
    };

    // Group leads by bucket
    const grouped = {};
    Object.keys(buckets).forEach(key => {
      grouped[key] = leadsWithDOM.filter(l => 
        l.domDays >= buckets[key].min && l.domDays <= buckets[key].max
      );
    });

    // If drilling down to specific bucket, return full lead list
    if (domBucket && buckets[domBucket]) {
      const leads = grouped[domBucket];
      return Response.json({
        success: true,
        bucket: domBucket,
        label: buckets[domBucket].label,
        total: leads.length,
        leads: leads.map(l => ({
          id: l.id,
          name: `${l.first_name} ${l.last_name}`,
          phone: l.phone,
          email: l.email,
          address: l.property_address,
          city: l.city,
          state: l.state,
          listing_date: l.listing_date,
          domDays: l.domDays,
          status: l.status,
          estimated_equity: l.estimated_equity,
          listing_price: l.estimated_price,
          distress_score: l.distress_score
        }))
      });
    }

    // Return summary breakdown
    return Response.json({
      success: true,
      total_va_listings: leadsWithDOM.length,
      summary: Object.keys(buckets).map(key => ({
        bucket: key,
        label: buckets[key].label,
        count: grouped[key].length,
        color: buckets[key].color,
        percentage: leadsWithDOM.length > 0 
          ? Math.round((grouped[key].length / leadsWithDOM.length) * 100)
          : 0
      }))
    });

  } catch (error) {
    console.error('VA listings DOM error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});