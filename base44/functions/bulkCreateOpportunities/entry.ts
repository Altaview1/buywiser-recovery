import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { records, entityName } = await req.json();

    if (!records || !Array.isArray(records) || records.length === 0) {
      return Response.json({ error: 'No records provided' }, { status: 400 });
    }

    if (!['VTONOpportunity', 'ActivatorLead'].includes(entityName)) {
      return Response.json({ error: 'Invalid entity name' }, { status: 400 });
    }

    // Process in chunks of 50 to avoid timeouts
    const chunkSize = 50;
    const allResults = [];

    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      const chunkResults = await Promise.allSettled(
        chunk.map(r => base44.asServiceRole.entities[entityName].create(r))
      );
      chunkResults.forEach((r, j) => {
        allResults.push({
          index: i + j,
          status: r.status === 'fulfilled' ? 'success' : 'error',
          data: r.status === 'fulfilled' ? r.value : null,
          error: r.status === 'rejected' ? (r.reason?.message || 'Unknown error') : null,
        });
      });
    }

    return Response.json({ results: allResults });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});