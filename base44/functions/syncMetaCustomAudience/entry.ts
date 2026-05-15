import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Sync VTON veteran leads to Meta custom audience
 * Uploads hashed email + phone for retargeting campaigns
 * Can be triggered manually or via scheduled automation
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const { manual_trigger } = payload;

    // Check for required Meta credentials
    const metaAccessToken = Deno.env.get('META_ACCESS_TOKEN');
    const metaAudienceId = Deno.env.get('META_CUSTOM_AUDIENCE_ID');

    if (!metaAccessToken || !metaAudienceId) {
      return Response.json({
        error: 'Meta API credentials not configured',
        message: 'Set META_ACCESS_TOKEN and META_CUSTOM_AUDIENCE_ID secrets'
      }, { status: 500 });
    }

    // Fetch all VTON leads with email and phone
    const leads = await base44.asServiceRole.entities.VTONLead.list();
    
    // Filter leads with valid contact info
    const leadsWithContacts = leads.filter(l => 
      (l.email || l.phone) && l.veteran_indicator === true
    );

    if (leadsWithContacts.length === 0) {
      return Response.json({
        success: true,
        message: 'No veteran leads with contact info to sync',
        synced_count: 0
      });
    }

    // Prepare hashed contacts for Meta
    const hashes = [];
    
    for (const lead of leadsWithContacts) {
      // Hash email if present
      if (lead.email) {
        const emailHash = await hashValue(lead.email.toLowerCase().trim());
        hashes.push(emailHash);
      }
      
      // Hash phone if present (remove formatting)
      if (lead.phone) {
        const phoneNormalized = lead.phone.replace(/\D/g, '');
        if (phoneNormalized.length >= 10) {
          const phoneHash = await hashValue(phoneNormalized);
          hashes.push(phoneHash);
        }
      }
    }

    if (hashes.length === 0) {
      return Response.json({
        error: 'No valid contact hashes to upload',
        message: 'All leads missing or invalid email/phone'
      }, { status: 400 });
    }

    // Upload to Meta custom audience
    const metaResponse = await fetch(
      `https://graph.instagram.com/v19.0/${metaAudienceId}/users`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: metaAccessToken,
          payload: {
            schema: ['EMAIL', 'PHONE'],
            is_hashed: true,
            data: hashes.map((h, i) => [h])
          }
        })
      }
    );

    if (!metaResponse.ok) {
      const errorData = await metaResponse.text();
      console.error('Meta API error:', errorData);
      return Response.json({
        error: 'Meta API error',
        details: errorData,
        synced_count: 0
      }, { status: 500 });
    }

    const metaData = await metaResponse.json();

    // Log sync event
    console.log(`✓ Meta audience sync: ${leadsWithContacts.length} leads, ${hashes.length} hashes uploaded`);

    return Response.json({
      success: true,
      message: 'Meta audience synced successfully',
      leads_synced: leadsWithContacts.length,
      hashes_uploaded: hashes.length,
      synced_at: new Date().toISOString(),
      manual_trigger: manual_trigger || false,
      meta_response: metaData
    });

  } catch (error) {
    console.error('Meta Audience Sync Error:', error);
    return Response.json({
      error: error.message,
      synced_count: 0
    }, { status: 500 });
  }
});

// Helper: SHA256 hash value (Meta requirement)
async function hashValue(value) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}