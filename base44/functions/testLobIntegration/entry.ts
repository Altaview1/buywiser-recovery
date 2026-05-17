import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Test Lob Integration
 * Sends a test letter to verify API key and template are working
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Verify admin access
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Check Lob API key
    const lobApiKey = Deno.env.get('LOB_API_KEY');
    if (!lobApiKey) {
      return Response.json({ error: 'LOB_API_KEY not configured' }, { status: 500 });
    }

    // Check if it's a live key or test key
    const isLiveKey = lobApiKey.startsWith('live_');
    const isTestKey = lobApiKey.startsWith('test_');
    
    console.log(`LOB API Key Type: ${isLiveKey ? 'LIVE' : isTestKey ? 'TEST' : 'UNKNOWN'}`);

    // Load approved letter template
    const configs = await base44.asServiceRole.entities.VTONMailConfig.list();
    if (configs.length === 0) {
      return Response.json({ 
        error: 'No letter template found', 
        message: 'Please create a template in VTON Letter Template Review' 
      }, { status: 400 });
    }

    if (!configs[0].is_approved) {
      return Response.json({ 
        error: 'Letter template not approved', 
        message: 'Please approve a template before sending mail' 
      }, { status: 400 });
    }

    // Create a test lead for demonstration
    const testLeadData = {
      first_name: 'Test',
      last_name: 'Homeowner',
      email: 'test@example.com',
      phone: '5551234567',
      property_address: '123 Test Street',
      city: 'Los Angeles',
      state: 'CA',
      zip_code: '90210',
      estimated_equity: 50000,
      veteran_indicator: true,
      direct_mail_sent: false
    };

    // Create test lead
    const testLead = await base44.entities.VTONLead.create(testLeadData);
    console.log(`Created test lead: ${testLead.id}`);

    // Load sender address from environment with fallback defaults
    const fromAddress = {
      name: Deno.env.get('LOB_FROM_NAME') || 'Buywiser Home Loans',
      company: Deno.env.get('LOB_FROM_COMPANY'),
      address_line1: Deno.env.get('LOB_FROM_ADDRESS_LINE1') || '12640 Riverside Drive',
      address_line2: Deno.env.get('LOB_FROM_ADDRESS_LINE2'),
      address_city: Deno.env.get('LOB_FROM_CITY') || 'North Hollywood',
      address_state: Deno.env.get('LOB_FROM_STATE') || 'CA',
      address_zip: Deno.env.get('LOB_FROM_ZIP') || '91607',
      address_country: Deno.env.get('LOB_FROM_COUNTRY') || 'US'
    };

    // Send letter to test lead using Lob API v1 format
    const letterResponse = await fetch('https://api.lob.com/v1/letters', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(lobApiKey + ':')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'to[name]': 'Test Homeowner',
        'to[address_line1]': '123 Test Street',
        'to[address_city]': 'Los Angeles',
        'to[address_state]': 'CA',
        'to[address_zip]': '90210',
        'from[name]': fromAddress.name,
        'from[company]': fromAddress.company,
        'from[address_line1]': fromAddress.address_line1,
        'from[address_line2]': fromAddress.address_line2,
        'from[address_city]': fromAddress.address_city,
        'from[address_state]': fromAddress.address_state,
        'from[address_zip]': fromAddress.address_zip,
        'file': '<html><body><h1>Test Letter</h1><p>This is a test of the Lob integration.</p></body></html>',
        'color': 'false',
      }).toString(),
    });

    if (!letterResponse.ok) {
      const errorData = await letterResponse.text();
      return Response.json({ 
        error: 'Lob API error', 
        details: errorData,
        key_type: isLiveKey ? 'live' : 'test'
      }, { status: 500 });
    }

    const lobData = await letterResponse.json();

    // Update test lead with letter info
    await base44.entities.VTONLead.update(testLead.id, {
      direct_mail_sent: true,
      lob_letter_id: lobData.id,
      lob_delivery_status: 'processing',
      lob_last_updated: new Date().toISOString()
    });

    return Response.json({
      success: true,
      message: 'Test letter sent successfully!',
      lead_id: testLead.id,
      letter_id: lobData.id,
      key_type: isLiveKey ? 'LIVE (Production)' : 'TEST (Sandbox)',
      next_steps: [
        'Check Lob dashboard to see the letter: https://dashboard.lob.com',
        'Letter will be delivered in 2-5 business days',
        'Webhook will update status when delivered (if configured)',
        'Delete test lead after verification if needed'
      ]
    });

  } catch (error) {
    console.error('Test Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});