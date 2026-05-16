import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Twilio Inbound SMS Webhook
 * Handles incoming SMS replies: STOP, HELP, and general responses
 * Set this URL in Twilio console → Phone Numbers → Messaging → Webhook
 */

Deno.serve(async (req) => {
  try {
    // Twilio sends form-encoded POST data
    const body = await req.text();
    const params = new URLSearchParams(body);

    const from = params.get('From') || '';
    const messageBody = (params.get('Body') || '').trim();
    const messageLower = messageBody.toLowerCase().trim();

    console.log(`Inbound SMS from ${from}: "${messageBody}"`);

    const base44 = createClientFromRequest(req);

    // Normalize phone for lookup (strip non-digits, handle +1)
    const normalizedPhone = from.replace(/\D/g, '').replace(/^1/, '');

    // Find matching VTONLead by phone
    const allLeads = await base44.asServiceRole.entities.VTONLead.list();
    const matchingLead = allLeads.find(lead => {
      const leadPhone = (lead.phone || '').replace(/\D/g, '').replace(/^1/, '');
      return leadPhone === normalizedPhone;
    });

    // Handle STOP / opt-out keywords
    const stopKeywords = ['stop', 'stopall', 'unsubscribe', 'cancel', 'end', 'quit'];
    const helpKeywords = ['help', 'info'];

    if (stopKeywords.includes(messageLower)) {
      // Update lead suppression status
      if (matchingLead) {
        await base44.asServiceRole.entities.VTONLead.update(matchingLead.id, {
          suppression_status: 'unsubscribed',
          sms_status: 'unsubscribed',
          notes: (matchingLead.notes || '') + `\n[${new Date().toISOString()}] Replied STOP — opted out of SMS.`
        });
        console.log(`Lead ${matchingLead.id} opted out via STOP`);
      }

      // Twilio TwiML response — required acknowledgment
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Message>You have been unsubscribed and will receive no further messages. Reply START to re-subscribe.</Message></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      );
    }

    if (helpKeywords.includes(messageLower)) {
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Message>VTON Veteran Benefit Program. Reply STOP to opt out. For assistance call (818) 300-2642 or email bennett@buywiser.com</Message></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      );
    }

    // Handle START / re-subscribe
    if (messageLower === 'start' || messageLower === 'yes') {
      if (matchingLead) {
        await base44.asServiceRole.entities.VTONLead.update(matchingLead.id, {
          suppression_status: 'active',
          sms_status: 'opened',
          notes: (matchingLead.notes || '') + `\n[${new Date().toISOString()}] Re-subscribed via START.`
        });
      }
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Message>You have been re-subscribed to VTON benefit updates. Reply STOP at any time to opt out.</Message></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      );
    }

    // General reply — log it as a note on the lead
    if (matchingLead) {
      await base44.asServiceRole.entities.VTONLead.update(matchingLead.id, {
        sms_status: 'opened',
        last_engagement: new Date().toISOString(),
        notes: (matchingLead.notes || '') + `\n[${new Date().toISOString()}] SMS reply: "${messageBody}"`
      });
      console.log(`Logged SMS reply on lead ${matchingLead.id}`);
    } else {
      console.log(`No matching lead found for phone ${from}`);
    }

    // Empty TwiML response — don't auto-reply to general messages
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
      { headers: { 'Content-Type': 'text/xml' } }
    );

  } catch (error) {
    console.error('Inbound SMS webhook error:', error);
    // Always return valid TwiML even on error
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
      { headers: { 'Content-Type': 'text/xml' } }
    );
  }
});