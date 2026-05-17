import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Behavioral Trigger Engine
 * Auto-sends follow-ups based on engagement patterns
 * Examples: 3x site visits → personalized follow-up
 *           clicked but no booking → reminder
 */

Deno.serve(async (req) => {
   try {
     const base44 = createClientFromRequest(req);
     const user = await base44.auth.me();
     if (!user || user.role !== 'admin') {
       return Response.json({ error: 'Admin access required' }, { status: 403 });
     }
     const { lead_id, event_type } = await req.json();

     if (!lead_id) {
       return Response.json({ error: 'Missing lead_id' }, { status: 400 });
     }

    const leads = await base44.entities.VTONLead.filter({ id: lead_id });
    if (leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];
    const triggers = [];

    // TRIGGER 1: 3+ site visits without booking
    if ((lead.site_visits || 0) >= 3 && !lead.appointment_booked) {
      triggers.push({
        name: 'multiple_visits_no_booking',
        action: 'send_follow_up_sms',
        message: `Hi {{first_name}}, still reviewing your benefits for {{property_address}}? Your estimated benefit is {{estimated_benefit}}. Book a quick 15-minute call: [link]`
      });
    }

    // TRIGGER 2: Email opened but not clicked
    if (lead.email_status === 'opened' && !lead.appointment_booked && lead.sms_status !== 'clicked') {
      triggers.push({
        name: 'email_opened_no_action',
        action: 'send_follow_up_email',
        message: `Hi {{first_name}},\n\nI noticed you reviewed the details about your Veteran Transition Benefit for {{property_address}}. Would you like to schedule a quick 15-minute call to discuss how this {{estimated_benefit}} benefit applies to your situation?\n\nReply to confirm a time.`
      });
    }

    // TRIGGER 3: 7+ days since creation with no engagement
    const createdDate = new Date(lead.created_date);
    const daysSinceCreation = Math.floor((new Date() - createdDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceCreation >= 7 && lead.site_visits === 0 && lead.sms_status === 'pending') {
      triggers.push({
        name: 'no_engagement_7_days',
        action: 'send_final_outreach',
        message: `Hi {{first_name}}, one last thing about your {{property_address}} sale: you may be missing out on {{estimated_benefit}} in Veteran Transition Benefits. No pressure — just want to make sure you have all the options. [link]`
      });
    }

    // TRIGGER 4: Booking attempt but not confirmed
    if (lead.site_visits && lead.site_visits > 2 && !lead.appointment_booked) {
      triggers.push({
        name: 'high_intent_no_booking',
        action: 'send_personalized_reminder',
        message: `Hi {{first_name}}, you're clearly interested in learning more about your {{estimated_benefit}} benefit. Can I help remove any barriers to booking your call? Call me directly: [phone]`
      });
    }

    // Execute triggered actions
    for (const trigger of triggers) {
      console.log(`Behavioral trigger fired: ${trigger.name}`);
      
      // In production, route to appropriate SMS/email sender
      // await base44.functions.invoke('notifyLeadSMS', { lead_id, message: trigger.message });
    }

    // Update lead with last trigger timestamp
    if (triggers.length > 0) {
      await base44.entities.VTONLead.update(lead_id, {
        last_engagement: new Date().toISOString()
      });
    }

    return Response.json({
      status: 'success',
      lead_id,
      triggers_fired: triggers.map(t => t.name),
      message: `${triggers.length} behavioral trigger(s) fired`
    });
  } catch (error) {
    console.error('Behavioral trigger error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});