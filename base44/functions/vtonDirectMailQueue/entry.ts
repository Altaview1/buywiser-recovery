import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Send personalized VTON welcome letters via Lob API
 * Uses approved HTML template from VTONMailConfig entity
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const { lead_id, first_name, last_name, property_address, city, state, zip_code, estimated_benefit } = payload;

    // Validate required fields
    if (!lead_id || !property_address || !city || !state || !zip_code) {
      return Response.json({ error: 'Missing required address fields' }, { status: 400 });
    }

    // Check Lob API key
    const lobApiKey = Deno.env.get('LOB_API_KEY');
    if (!lobApiKey) {
      return Response.json({ error: 'LOB_API_KEY not configured' }, { status: 500 });
    }

    // Load approved letter template
    const configs = await base44.asServiceRole.entities.VTONMailConfig.list();
    if (configs.length === 0 || !configs[0].is_approved) {
      return Response.json({ 
        error: 'Letter template not approved', 
        message: 'Please approve a template in VTON Letter Template Review before sending mail' 
      }, { status: 400 });
    }

    let templateHtml = configs[0].letter_html;

    // Personalize the template with lead data
    const letterHtml = templateHtml
      .replace(/\$\{first_name\}/g, first_name || '')
      .replace(/\$\{last_name\}/g, last_name || '')
      .replace(/\$\{property_address\}/g, property_address)
      .replace(/\$\{city\}/g, city)
      .replace(/\$\{state\}/g, state)
      .replace(/\$\{zip_code\}/g, zip_code)
      .replace(/\$\{estimated_benefit\}/g, estimated_benefit?.toString() || 'TBD');

    // Generate personalized QR code URL
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://buywiser.com/vton-benefit?lead=${lead_id}`)}`;
    const finalLetterHtml = letterHtml.replace(/\$\{qrUrl\}/g, qrUrl);

    // Encode HTML as base64 for Lob API
    const base64Html = btoa(finalLetterHtml);

    // Send to Lob API
    const lobResponse = await fetch('https://api.lob.com/v1/letters', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(lobApiKey + ':')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'to[name]': `${first_name || ''} ${last_name || ''}`.trim() || 'Homeowner',
        'to[address_line1]': property_address,
        'to[address_city]': city,
        'to[address_state]': state,
        'to[address_zip]': zip_code,
        'from[name]': 'Buywiser Home Loans',
        'from[address_line1]': '12640 Riverside Drive',
        'from[address_city]': 'North Hollywood',
        'from[address_state]': 'CA',
        'from[address_zip]': '91607',
        'file': finalLetterHtml,
        'color': 'false',
      }).toString(),
    });

    if (!lobResponse.ok) {
      const errorData = await lobResponse.text();
      return Response.json({ error: 'Lob API error', details: errorData }, { status: 500 });
    }

    const lobData = await lobResponse.json();

    // Lob API response includes cost breakdown
    const estimatedCost = lobData.amount ? (lobData.amount / 100) : 1.50; // Convert cents to USD, default $1.50

    // Update lead to mark letter as sent and store Lob letter ID for tracking
    await base44.asServiceRole.entities.VTONLead.update(lead_id, {
      direct_mail_sent: true,
      lob_letter_id: lobData.id,
      lob_delivery_status: 'processing',
      lob_last_updated: new Date().toISOString(),
      lob_estimated_cost: estimatedCost
    });

    return Response.json({ 
      success: true, 
      message: 'Direct mail sent successfully',
      lead_id,
      letterId: lobData.id
    });
  } catch (error) {
    console.error('Direct Mail Queue Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});