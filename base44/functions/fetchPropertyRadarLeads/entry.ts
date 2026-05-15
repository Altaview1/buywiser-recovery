import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * PropertyRadar Direct API Integration
 * Fetches new listings from PropertyRadar API and imports them as VTON leads
 * Supports both scheduled polling and manual triggers
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Admin-only function
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const PROPERTY_RADAR_API_KEY = Deno.env.get('PROPERTY_RADAR_API_KEY');
    if (!PROPERTY_RADAR_API_KEY) {
      return Response.json({ error: 'PROPERTY_RADAR_API_KEY not configured' }, { status: 500 });
    }

    // Fetch leads from PropertyRadar API
    // Note: Adjust endpoint and parameters based on PropertyRadar API docs
    const response = await fetch('https://api.propertyradar.com/prcore/v1/properties', {
      headers: {
        'Authorization': `Bearer ${PROPERTY_RADAR_API_KEY}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        limit: 100,
        offset: 0,
        filters: {
          state: 'CA',
          listing_status: 'active',
          veteran_friendly: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`PropertyRadar API error: ${response.status} ${response.statusText}`);
    }

    const apiData = await response.json();
    const leads = apiData.results || apiData.data || [];

    if (!Array.isArray(leads) || leads.length === 0) {
      return Response.json({
        status: 'success',
        message: 'No new leads found',
        imported: 0
      });
    }

    // Use bulk import function to process leads
    const importResult = await base44.functions.invoke('vtonBulkImportPropertyRadar', {
      leads: leads,
      source: 'PropertyRadar_API'
    });

    return Response.json({
      status: 'success',
      message: `Successfully imported ${importResult.import_summary?.created || 0} leads`,
      details: importResult.import_summary
    });

  } catch (error) {
    console.error('PropertyRadar fetch error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});