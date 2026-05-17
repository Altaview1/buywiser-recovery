import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * WAAV Adapter — Abstraction layer for WAAV calling/SMS platform
 * Logs all communication activity (calls, SMS, voicemail)
 * Vendor-agnostic: replaceable without activity timeline changes
 */

Deno.serve(async (req) => {
   try {
     const base44 = createClientFromRequest(req);
     // Webhook from WAAV — validate HMAC-SHA256 signature for security
     const secret = Deno.env.get('WAAV_WEBHOOK_SECRET');
     if (!secret) {
       return Response.json({ error: 'WAAV_WEBHOOK_SECRET not configured' }, { status: 403 });
     }
     
     const signature = req.headers.get('x-waav-signature');
     if (!signature) {
       return Response.json({ error: 'Missing signature header' }, { status: 403 });
     }

     const bodyText = await req.text();
     const encoder = new TextEncoder();
     const bodyBytes = encoder.encode(bodyText);
     const secretBytes = encoder.encode(secret);
     const key = await crypto.subtle.importKey('raw', secretBytes, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
     const computed = await crypto.subtle.sign('HMAC', key, bodyBytes);
     const computedHex = Array.from(new Uint8Array(computed)).map(b => b.toString(16).padStart(2, '0')).join('');

     if (computedHex !== signature) {
       return Response.json({ error: 'Invalid signature' }, { status: 403 });
     }

     const body = JSON.parse(bodyText);

    const { lead_id, event_type, data } = body;

    if (!lead_id) {
      return Response.json({ error: 'Missing lead_id' }, { status: 400 });
    }

    // Map WAAV events to unified activity log
    const activityMap = {
      call_initiated: { type: 'call_attempt', status: 'initiated' },
      call_completed: { type: 'call_attempt', status: 'completed' },
      call_no_answer: { type: 'call_attempt', status: 'no_answer' },
      voicemail_drop: { type: 'voicemail', status: 'sent' },
      sms_sent: { type: 'sms', status: 'sent' },
      sms_replied: { type: 'sms', status: 'replied' },
      sms_failed: { type: 'sms', status: 'failed' }
    };

    const activityType = activityMap[event_type];

    if (!activityType) {
      return Response.json({ error: 'Unknown event type' }, { status: 400 });
    }

    // Create activity record
    const activity = {
      lead_id,
      event_type: activityType.type,
      status: activityType.status,
      source: 'WAAV',
      timestamp: new Date().toISOString(),
      duration_seconds: data.duration_seconds || null,
      recording_url: data.recording_url || null,
      message_content: data.message || null,
      disposition: data.disposition || null,
      callback_requested: data.callback_requested === true,
      notes: data.notes || null
    };

    // If no VTONActivity entity exists yet, store in lead notes
    // (Can be refactored to separate entity later)
    const lead = await base44.entities.VTONLead.filter({ id: lead_id });
    if (lead.length > 0) {
      const existingNotes = lead[0].notes || '';
      const newNote = `[${new Date().toISOString()}] ${event_type}: ${data.message || 'Activity recorded'}`;
      await base44.entities.VTONLead.update(lead_id, {
        notes: existingNotes ? `${existingNotes}\n${newNote}` : newNote,
        last_engagement: new Date().toISOString()
      });
    }

    return Response.json({
      status: 'success',
      activity: activity,
      message: 'WAAV activity logged'
    });
  } catch (error) {
    console.error('WAAV adapter error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});