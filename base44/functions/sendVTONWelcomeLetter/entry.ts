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

    const staticLetterHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; }
            body { font-family: 'Georgia', serif; color: #1a1a1a; line-height: 1.6; }
            .wrapper { width: 100%; max-width: 850px; margin: 0 auto; padding: 60px 50px; }
            .letterhead { border-top: 3px solid #0B1F3B; border-bottom: 1px solid #ccc; padding-bottom: 20px; margin-bottom: 40px; }
            .logo { font-size: 18px; font-weight: bold; color: #0B1F3B; letter-spacing: 1px; }
            .date { font-size: 11px; color: #666; margin-top: 8px; }
            .recipient { margin-bottom: 30px; font-size: 12px; }
            .salutation { margin-bottom: 25px; font-size: 13px; }
            .body-text { margin-bottom: 18px; font-size: 12px; line-height: 1.8; text-align: justify; }
            .property-box { background: #f5f5f5; border-left: 4px solid #0B1F3B; padding: 15px 18px; margin: 25px 0; font-size: 12px; }
            .property-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #666; margin-bottom: 4px; }
            .property-address { font-size: 13px; font-weight: bold; color: #1a1a1a; }
            .benefit-highlight { background: #f9f9f9; border: 1px solid #ddd; padding: 15px; margin: 22px 0; font-size: 12px; line-height: 1.7; }
            .benefit-title { font-weight: bold; color: #0B1F3B; font-size: 12px; margin-bottom: 6px; }
            .cta-section { margin: 35px 0; }
            .primary-cta { font-size: 13px; font-weight: bold; color: #0B1F3B; margin-bottom: 12px; }
            .qr-container { display: inline-block; margin: 15px 0; text-align: center; }
            .qr-label { font-size: 10px; color: #666; margin-top: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
            .contact-info { margin: 20px 0; font-size: 12px; }
            .contact-line { margin: 6px 0; }
            .closing { margin-top: 35px; font-size: 12px; }
            .signature { margin-top: 25px; font-size: 11px; }
            .signature-name { font-weight: bold; color: #0B1F3B; }
            .signature-title { color: #666; font-size: 11px; }
            .disclaimer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 10px; color: #999; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <!-- Letterhead -->
            <div class="letterhead">
              <div class="logo">VETERAN TRANSITION OPPORTUNITY NETWORK™</div>
              <div class="date">May 2026</div>
            </div>

            <!-- Recipient -->
            <div class="recipient">
              ${first_name} ${last_name || ''}<br/>
              ${property_address}<br/>
              ${city}, ${state} ${zip_code}
            </div>

            <!-- Salutation -->
            <div class="salutation">
              Dear ${first_name},
            </div>

            <!-- Body -->
            <div class="body-text">
              We are writing to inform you of a significant opportunity that may be available to you during this important transition period.
            </div>

            <div class="body-text">
              Our records indicate that your property is currently being offered for sale:
            </div>

            <!-- Property Box -->
            <div class="property-box">
              <div class="property-label">Current Property</div>
              <div class="property-address">${property_address}</div>
              <div style="margin-top: 8px; font-size: 11px; color: #666;">${city}, ${state} ${zip_code}</div>
            </div>

            <div class="body-text">
              Based on your homeownership history, you may qualify for the VTON™ Veteran Homeowner Transition Benefit—a qualification-based financial benefit designed specifically for veterans purchasing their next home. This benefit recognizes the unique financial position of veteran homeowners navigating the transition from one property to the next.
            </div>

            <!-- Benefit Highlight -->
            <div class="benefit-highlight">
              <div class="benefit-title">Your Potential Qualification</div>
              <div style="font-size: 12px;">
                Qualifying veteran homeowners may receive up to 1.5% in transition benefits applied at closing on their next home purchase. The actual benefit depends on how your next purchase is structured and your specific circumstances.
              </div>
            </div>

            <div class="body-text">
              <strong>Timing is important.</strong> As you prepare to transition from your current home, understanding your available benefits before making next-home decisions will ensure you capture opportunities that may not be available later.
            </div>

            <!-- CTA Section -->
            <div class="cta-section">
              <div class="primary-cta">Schedule a Confidential Benefit Review</div>
              <div class="body-text" style="margin-bottom: 0;">
                We invite you to schedule a brief, no-obligation benefit review consultation. Our team will assess your specific situation and clarify exactly what you may qualify for.
              </div>
            </div>

            <!-- QR Code -->
            <div class="qr-container">
              <img src="${qrUrl}" alt="QR Code" style="border: 1px solid #ccc; padding: 5px; background: white;" />
              <div class="qr-label">Scan to Schedule</div>
            </div>

            <!-- Contact Info -->
            <div class="contact-info">
              <div class="contact-line"><strong>Phone:</strong> (818) 300-2642</div>
              <div class="contact-line"><strong>Web:</strong> buywiser.com/vton</div>
              <div class="contact-line"><strong>Personalized Benefit Page:</strong> buywiser.com/b</div>
            </div>

            <!-- Closing -->
            <div class="closing">
              Thank you for your service. We look forward to discussing how we can support your next home transition.
            </div>

            <!-- Signature -->
            <div class="signature">
              Sincerely,<br/>
              <br/>
              <span class="signature-name">Bennett Liss</span><br/>
              <span class="signature-title">Founder, VTON™ | Buywiser Home Loans</span><br/>
              <span style="color: #999; font-size: 10px;">NMLS #1524446 | CA RE License #01107013</span>
            </div>

            <!-- Disclaimer -->
            <div class="disclaimer">
              <strong>Important Notice:</strong> This communication is being sent to provide information about programs available to qualifying veteran homeowners. The VTON™ Veteran Homeowner Transition Benefit is a private program operated by Buywiser Home Loans and is not affiliated with, endorsed by, or connected to the United States Department of Veterans Affairs or any government agency. All benefit amounts are qualification-based and subject to final verification and loan approval.
            </div>
          </div>
        </body>
      </html>
    `;

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