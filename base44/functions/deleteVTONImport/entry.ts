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
    const { import_batch_id, delete_all_today = false, delete_new_only = false } = body;

    let query = {};

    if (import_batch_id) {
      // Delete by specific import batch
      query = { import_batch_id: import_batch_id };
    } else if (delete_new_only) {
      // Delete only leads with status "New"
      query = { contact_status: "New" };
    } else if (delete_all_today) {
      // Delete ALL VTON leads (no date filter)
      query = {};
    } else {
      return Response.json({ error: 'Must provide import_batch_id, delete_all_today, or delete_new_only' }, { status: 400 });
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

    // Delete in smaller batches to avoid rate limiting
    const batchSize = 10;
    let deletedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < leadsToDelete.length; i += batchSize) {
      const batch = leadsToDelete.slice(i, i + batchSize);
      
      // Delete sequentially with small delay to avoid rate limits
      for (const lead of batch) {
        try {
          await base44.entities.VTONLead.delete(lead.id);
          deletedCount++;
        } catch (err) {
          console.error(`Failed to delete lead ${lead.id}:`, err.message);
          errorCount++;
        }
      }
      
      // Add delay between batches to avoid rate limiting
      if (i + batchSize < leadsToDelete.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
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