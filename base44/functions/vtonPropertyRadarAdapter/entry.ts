import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { createHmac } from 'node:crypto';

/**
 * PropertyRadar Adapter — Abstraction layer for PropertyRadar API
 * Handles lead ingestion, field mapping, and webhook validation
 * Vendor-agnostic: replaceable without CRM logic changes
 */

/**
 * Validate PropertyRadar webhook signature
 * Compares HMAC-SHA256 hash of payload with signature header
 */
function validateWebhookSignature(signature, payload, apiKey) {
  if (!signature || !apiKey) return false;
  
  try {
    const expectedSignature = createHmac('sha256', apiKey)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return signature === `sha256=${expectedSignature}`;
  } catch (error) {
    console.error('Signature validation error:', error);
    return false;
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    // Webhook authentication - validate PropertyRadar signature
    const signature = req.headers.get('x-propertyradar-signature');
    if (!validateWebhookSignature(signature, body, Deno.env.get('PROPERTY_RADAR_API_KEY'))) {
      return Response.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    // PropertyRadar webhook payload structure
    const leadData = body.lead || {};

    // Field mapping: PropertyRadar → VTONLead
    const mappedLead = {
      first_name: leadData.owner_first_name || 'Homeowner',
      last_name: leadData.owner_last_name || '',
      mailing_address: leadData.mailing_address || '',
      property_address: leadData.property_address || '',
      city: leadData.city || '',
      state: leadData.state || '',
      zip_code: leadData.zip_code || '',
      listing_date: leadData.listing_date || null,
      listing_price: leadData.listing_price ? parseFloat(leadData.listing_price) : 0,
      estimated_equity: leadData.estimated_equity ? parseFloat(leadData.estimated_equity) : 0,
      estimated_mortgage_balance: leadData.estimated_mortgage_balance ? parseFloat(leadData.estimated_mortgage_balance) : 0,
      likely_va_loan_indicator: leadData.likely_va_loan === true,
      veteran_indicator: true, // Assumed from PropertyRadar filter
      phone: leadData.phone || '',
      email: leadData.email || '',
      lead_source: 'PropertyRadar',
      listing_source: leadData.listing_source || 'PropertyRadar',
      listing_url: leadData.listing_url || '',
      listing_photo_url: leadData.listing_photo_url || '',
      campaign_stage: 'initial_outreach',
      sms_status: 'pending',
      email_status: 'pending',
      suppression_status: 'active'
    };

    // Create lead in VTONLead entity
    const created = await base44.entities.VTONLead.create(mappedLead);

    // Trigger listing verification
    await base44.functions.invoke('vtonListingVerification', {
      lead_id: created.id,
      property_address: mappedLead.property_address,
      city: mappedLead.city,
      state: mappedLead.state,
      zip_code: mappedLead.zip_code
    });

    return Response.json({
      status: 'success',
      lead_id: created.id,
      message: 'PropertyRadar lead ingested and verification triggered'
    });
  } catch (error) {
    console.error('PropertyRadar adapter error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});