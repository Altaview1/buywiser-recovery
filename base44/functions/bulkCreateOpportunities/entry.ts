import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const { records, entityName } = await req.json();

    if (!records || !Array.isArray(records) || records.length === 0) {
      return Response.json({ error: 'No records provided' }, { status: 400 });
    }

    if (!['VTONOpportunity', 'ActivatorLead'].includes(entityName)) {
      return Response.json({ error: 'Invalid entity name' }, { status: 400 });
    }

    // Use service role to bypass RLS (public admin page — no user session)
    const results = await Promise.allSettled(
      records.map(r => base44.asServiceRole.entities[entityName].create(r))
    );

    const response = results.map((r, i) => ({
      index: i,
      status: r.status === 'fulfilled' ? 'success' : 'error',
      data: r.status === 'fulfilled' ? r.value : null,
      error: r.status === 'rejected' ? (r.reason?.message || 'Unknown error') : null,
    }));

    return Response.json({ results: response });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});