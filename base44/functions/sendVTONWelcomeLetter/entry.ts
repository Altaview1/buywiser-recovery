import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }
    const body = await req.json();
    const { leadId } = body;

    if (!leadId) {
      return Response.json({ error: 'leadId is required' }, { status: 400 });
    }

    // Fetch the lead details
    const lead = await base44.asServiceRole.entities.VTONLead.read(leadId);
    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Validate address fields
    const { first_name, last_name, property_address, city, state, zip_code } = lead;
    if (!property_address || !city || !state || !zip_code) {
      return Response.json({ error: 'Missing required address fields' }, { status: 400 });
    }

    const lobApiKey = Deno.env.get('LOB_API_KEY');
    if (!lobApiKey) {
      return Response.json({ error: 'LOB_API_KEY not configured' }, { status: 500 });
    }

    // Load approved letter template
    const configs = await base44.asServiceRole.entities.VTONMailConfig.list();
    let templateHtml = '';
    
    if (configs.length > 0 && configs[0].is_approved) {
      templateHtml = configs[0].letter_html;
    } else {
      // Template not approved yet, skip sending
      return Response.json({ 
        error: 'Letter template not yet approved', 
        message: 'Please approve a template before sending letters' 
      }, { status: 400 });
    }

    // Personalize the template with lead data
    const letterHtml = templateHtml
      .replace(/\$\{first_name\}/g, first_name || '')
      .replace(/\$\{last_name\}/g, last_name || '')
      .replace(/\$\{property_address\}/g, property_address)
      .replace(/\$\{city\}/g, city)
      .replace(/\$\{state\}/g, state)
      .replace(/\$\{zip_code\}/g, zip_code);

    // Generate personalized QR code URL (points to benefit review page with tracking)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://buywiser.com/vton-benefit?lead=${leadId}`)}`;

    // Insert QR code into personalized HTML
    const finalLetterHtml = letterHtml.replace(
      '${qrUrl}',
      qrUrl
    );

    // Encode HTML as base64 for Lob API
    const base64Html = btoa(finalLetterHtml);

    // Create letter via Lob API
    const lobResponse = await fetch('https://api.lob.com/v1/letters', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(lobApiKey + ':')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'to[name]': `${first_name} ${last_name || ''}`.trim(),
        'to[address_line1]': property_address,
        'to[address_city]': city,
        'to[address_state]': state,
        'to[address_zip]': zip_code,
        'from[name]': Deno.env.get('LOB_FROM_NAME') || 'Buywiser Home Loans',
        'from[address_line1]': Deno.env.get('LOB_FROM_ADDRESS_LINE1') || '12640 Riverside Drive',
        'from[address_city]': Deno.env.get('LOB_FROM_CITY') || 'North Hollywood',
        'from[address_state]': Deno.env.get('LOB_FROM_STATE') || 'CA',
        'from[address_zip]': Deno.env.get('LOB_FROM_ZIP') || '91607',
        'html': base64Html,
        'color': 'false',
      }).toString(),
    });

    if (!lobResponse.ok) {
      const errorData = await lobResponse.text();
      return Response.json(
        { error: 'Lob API error', details: errorData },
        { status: 500 }
      );
    }

    const lobData = await lobResponse.json();

    // Update lead to mark letter as sent and store Lob letter ID for tracking
    await base44.asServiceRole.entities.VTONLead.update(leadId, {
      direct_mail_sent: true,
      lob_letter_id: lobData.id,
      lob_delivery_status: 'processing',
      lob_last_updated: new Date().toISOString()
    });

    return Response.json({
      success: true,
      message: 'Welcome letter sent successfully',
      letterId: lobData.id,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});