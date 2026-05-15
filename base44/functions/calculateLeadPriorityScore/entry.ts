import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user?.role === 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch all VTON leads
    const leads = await base44.asServiceRole.entities.VTONLead.list();
    const today = new Date();
    const results = [];

    for (const lead of leads) {
      let score = 0;

      // Veteran status: +50 points for confirmed veteran
      if (lead.veteran_indicator === true) {
        score += 50;
      }

      // Years at property: calculate from listing_date
      if (lead.listing_date) {
        const listingDate = new Date(lead.listing_date);
        const yearsAtProperty = (today - listingDate) / (1000 * 60 * 60 * 24 * 365);
        
        // 1 year = 10 points, cap at 30 points max
        const yearsScore = Math.min(Math.floor(yearsAtProperty * 10), 30);
        score += yearsScore;
      }

      // Bonus: VA loan indicator adds 10 points
      if (lead.likely_va_loan_indicator === true) {
        score += 10;
      }

      // Update the lead with calculated score
      await base44.asServiceRole.entities.VTONLead.update(lead.id, {
        contact_priority_score: Math.min(score, 100) // Cap at 100
      });

      results.push({
        id: lead.id,
        name: `${lead.first_name} ${lead.last_name}`,
        score: Math.min(score, 100),
        veteran: lead.veteran_indicator,
        va_loan: lead.likely_va_loan_indicator,
        listing_date: lead.listing_date
      });
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    return Response.json({
      success: true,
      leads_scored: results.length,
      top_leads: results.slice(0, 10),
      results
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});