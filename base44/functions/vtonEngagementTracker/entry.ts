import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Track VTON lead engagement (clicks, visits, opens)
 * Called from frontend when user interacts with benefit page
 */
Deno.serve(async (req) => {
   try {
     const base44 = createClientFromRequest(req);
     const user = await base44.auth.me();
     if (!user) {
       return Response.json({ error: 'Unauthorized' }, { status: 401 });
     }
     const payload = await req.json();
     const { lead_id, event_type } = payload; // event_type: 'visit', 'click', 'email_open', etc.

     if (!lead_id) {
       return Response.json({ error: 'No lead_id provided' }, { status: 400 });
     }

    const leads = await base44.asServiceRole.entities.VTONLead.filter({ id: lead_id });
    if (!leads.length) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];
    // Verify user owns or is assigned to this lead (via assigned_advisor)
    if (lead.created_by !== user.email && lead.assigned_advisor !== user.email) {
      return Response.json({ error: 'Forbidden: Not authorized for this lead' }, { status: 403 });
    }

    let updates = {
      last_engagement: new Date().toISOString()
    };

    if (event_type === 'visit') {
      updates.site_visits = (lead.site_visits || 0) + 1;
    }

    // Update email/SMS status based on engagement
    if (event_type === 'email_open' && lead.email_status === 'sent') {
      updates.email_status = 'opened';
    }
    if (event_type === 'sms_click' && lead.sms_status === 'sent') {
      updates.sms_status = 'clicked';
    }

    // Behavioral trigger: If visited 3x without booking, send follow-up
    if (updates.site_visits >= 3 && !lead.appointment_booked) {
      // Trigger behavioral follow-up email via backend function
      base44.functions.invoke('vtonBehavioralFollowup', {
        lead_id,
        behavior: 'multiple_visits_no_booking'
      }).catch(err => console.error('Behavioral follow-up failed:', err));
    }

    // Use user-scoped update to enforce RLS permissions
    await base44.entities.VTONLead.update(lead_id, updates);

    return Response.json({ success: true, message: 'Engagement tracked' });
  } catch (error) {
    console.error('Engagement Tracker Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});