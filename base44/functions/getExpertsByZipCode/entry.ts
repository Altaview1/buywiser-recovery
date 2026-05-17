import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const MOCK_EXPERTS_BY_ZIP = {
  // Los Angeles area
  '90001': ['buyer-agent', 'structural', 'appraisers', 'inspectors', 'cleaners', 'movers'],
  '90210': ['buyer-agent', 'appraisers', 'inspectors', 'cleaners', 'movers'],
  '91001': ['buyer-agent', 'structural', 'appraisers', 'legal', 'inspectors', 'movers'],
  
  // San Francisco area
  '94102': ['buyer-agent', 'structural', 'appraisers', 'inspectors', 'legal', 'movers', 'cleaners'],
  '94301': ['buyer-agent', 'appraisers', 'inspectors', 'movers'],
  
  // San Diego area
  '92101': ['buyer-agent', 'appraisers', 'inspectors', 'cleaners', 'movers'],
  '92103': ['buyer-agent', 'structural', 'inspectors', 'movers'],
};

// Default experts available statewide
const STATEWIDE_EXPERTS = ['bennett'];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await req.json();
    const { zipCode } = body;

    if (!zipCode) {
      return Response.json({ error: 'Zip code required' }, { status: 400 });
    }

    // Get market-specific experts for this zip code
    const marketExperts = MOCK_EXPERTS_BY_ZIP[zipCode] || [];
    
    // Always include statewide experts (bennett/mortgage)
    const allExpertIds = [...STATEWIDE_EXPERTS, ...marketExperts];

    // Remove duplicates
    const uniqueExpertIds = [...new Set(allExpertIds)];

    return Response.json({
      zipCode,
      availableExperts: uniqueExpertIds,
      matchedCount: uniqueExpertIds.length,
      statewide: STATEWIDE_EXPERTS,
      marketSpecific: marketExperts,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});