import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
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

    // Prepare letter content (HTML template for Lob)
    const letterHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 40px;">
          <p>Dear ${first_name} ${last_name || ''},</p>
          
          <p>Congratulations on listing your home at:</p>
          <p style="font-weight: bold; margin-left: 20px;">
            ${property_address}<br/>
            ${city}, ${state} ${zip_code}
          </p>

          <p>As a veteran, you may be eligible for the Veteran's Next Home™ Program, which includes the Buywiser 1.5 GAP Benefit™—up to 1.5% back at closing on your next home purchase.</p>

          <p>Our team specializes in helping veteran homeowners maximize their next-home purchase through expert negotiation and market insights not available to the general public.</p>

          <p style="margin-top: 30px;">
            <strong>Secure Your Next Home Benefits Today:</strong><br/>
            Visit our personalized benefit page or call us to schedule a consultation.<br/>
            <strong>Phone:</strong> (818) 300-2642<br/>
            <strong>Website:</strong> buywiser.com/b
          </p>

          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            This letter is being sent to provide information about programs available to qualifying veterans. 
            Veteran's Next Home™ is a private program offered through Buywiser, not affiliated with the U.S. Department of Veterans Affairs.
          </p>
        </body>
      </html>
    `;

    // Encode HTML as base64 for Lob API
    const base64Html = btoa(letterHtml);

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
        'from[name]': 'Buywiser Home Loans',
        'from[address_line1]': '12640 Riverside Drive',
        'from[address_city]': 'North Hollywood',
        'from[address_state]': 'CA',
        'from[address_zip]': '91607',
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

    // Update lead to mark letter as sent
    await base44.asServiceRole.entities.VTONLead.update(leadId, {
      direct_mail_sent: true,
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