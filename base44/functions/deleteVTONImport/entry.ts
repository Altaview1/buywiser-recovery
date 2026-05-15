import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Delete leads from a specific import session
 * Deletes leads by import_batch_id or by date range (last 24 hours)
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Admin-only function
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { import_batch_id, delete_all_today = false } = body;

    let query = {};

    if (import_batch_id) {
      // Delete by specific import batch
      query = { import_batch_id: import_batch_id };
    } else if (delete_all_today) {
      // Delete all leads created today (within last 48 hours to be safe)
      const now = new Date();
      const fortyEightHoursAgo = new Date(now.getTime() - (48 * 60 * 60 * 1000));
      query = { 
        created_date: { $gte: fortyEightHoursAgo.toISOString() }
      };
    } else {
      return Response.json({ error: 'Must provide import_batch_id or delete_all_today' }, { status: 400 });
    }

    // Get ALL leads to delete (no limit)
    const leadsToDelete = await base44.entities.VTONLead.filter(query, undefined, 10000);
    
    console.log(`Delete query:`, JSON.stringify(query));
    console.log(`Found ${leadsToDelete.length} leads to delete`);
    
    console.log(`Found ${leadsToDelete.length} leads to delete`);
    
    if (leadsToDelete.length === 0) {
      return Response.json({ 
        status: 'success', 
        message: 'No leads found to delete',
        deleted_count: 0
      });
    }

    // Delete in smaller batches to avoid timeout
    const batchSize = 20;
    let deletedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < leadsToDelete.length; i += batchSize) {
      const batch = leadsToDelete.slice(i, i + batchSize);
      
      const results = await Promise.allSettled(
        batch.map(lead => base44.entities.VTONLead.delete(lead.id))
      );
      
      results.forEach(result => {
        if (result.status === 'fulfilled') deletedCount++;
        else errorCount++;
      });
      
      console.log(`Deleted batch ${Math.floor(i/batchSize) + 1}, total so far: ${deletedCount}`);
    }

    return Response.json({
      status: 'success',
      message: `Deleted ${deletedCount} leads`,
      deleted_count: deletedCount,
      error_count: errorCount,
      total_found: leadsToDelete.length
    });

  } catch (error) {
    console.error('Delete import error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});