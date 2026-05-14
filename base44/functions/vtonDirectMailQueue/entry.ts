import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Queue direct mail for VTON leads
 * In production, this integrates with Lob or similar print service
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const { lead_id, first_name, property_address, city, state, zip_code, estimated_benefit } = payload;

    // For now, just mark as queued
    // In production: call Lob API to create personalized mailer
    
    // TODO: Integrate with print service
    // const lobResponse = await fetch('https://api.lob.com/v1/letters', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${Deno.env.get('LOB_API_KEY')}`
    //   },
    //   body: JSON.stringify({
    //     to: { ... },
    //     from: { ... },
    //     file: `<html>personalized letter HTML</html>`
    //   })
    // });

    // Mark in database as sent
    await base44.asServiceRole.entities.VTONLead.update(lead_id, {
      direct_mail_sent: true
    });

    return Response.json({ 
      success: true, 
      message: 'Direct mail queued for processing',
      lead_id 
    });
  } catch (error) {
    console.error('Direct Mail Queue Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});