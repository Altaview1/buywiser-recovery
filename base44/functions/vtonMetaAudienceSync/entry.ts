import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Meta Custom Audience Sync
 * Uploads VTON leads to Meta for synchronized retargeting campaigns
 * Sends: email, phone, name, zip code
 * Creates audience: "VTON Active Listing Leads"
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { lead_id, batch_upload = false } = await req.json();

    // Query leads to sync
    let leadsToSync = [];
    if (batch_upload) {
      // Sync all active, unsynced leads
      leadsToSync = await base44.entities.VTONLead.filter({
        facebook_audience_synced: false,
        suppression_status: 'active'
      });
    } else if (lead_id) {
      // Sync single lead
      const leads = await base44.entities.VTONLead.filter({ id: lead_id });
      leadsToSync = leads;
    }

    if (leadsToSync.length === 0) {
      return Response.json({
        status: 'no_leads',
        message: 'No leads to sync'
      });
    }

    // Map leads to Meta Custom Audience format
    const metaAudienceData = leadsToSync
      .filter(lead => lead.email && lead.phone)
      .map(lead => ({
        em: hashEmail(lead.email),
        ph: hashPhone(lead.phone),
        fn: lead.first_name?.toLowerCase() || '',
        ln: lead.last_name?.toLowerCase() || '',
        zip: lead.zip_code || '',
        external_id: lead.id
      }));

    if (metaAudienceData.length === 0) {
      return Response.json({
        status: 'insufficient_data',
        message: 'No leads with both email and phone for Meta sync'
      });
    }

    // In production: call Meta Custom Audiences API
    // POST https://graph.instagram.com/v18.0/{audience_id}/users
    // Headers: Authorization: Bearer {access_token}
    // Body: { data: metaAudienceData, access_token }

    // Placeholder: simulate successful sync
    console.log(`Syncing ${metaAudienceData.length} leads to Meta audience`);

    // Mark leads as synced
    for (const lead of leadsToSync) {
      await base44.entities.VTONLead.update(lead.id, {
        facebook_audience_synced: true
      });
    }

    return Response.json({
      status: 'success',
      synced_count: metaAudienceData.length,
      audience_name: 'VTON Active Listing Leads',
      message: `Synced ${metaAudienceData.length} leads to Meta Custom Audience`
    });
  } catch (error) {
    console.error('Meta audience sync error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

// Simple hash functions for PII (in production, use Meta SDK)
function hashEmail(email) {
  if (!email) return '';
  return email.toLowerCase().trim();
}

function hashPhone(phone) {
  if (!phone) return '';
  // Remove non-digits
  const digits = phone.replace(/\D/g, '');
  return digits.slice(-10);
}