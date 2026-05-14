import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * VTON Rapid Response Engine
 * Triggered when a new VTON lead is created
 * Launches: SMS, email, engagement tracking, and campaign orchestration
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { data } = await req.json();

    if (!data?.id) {
      return Response.json({ error: 'No lead data' }, { status: 400 });
    }

    const leadId = data.id;

    // Fetch full lead record
    const leads = await base44.asServiceRole.entities.VTONLead.filter({ id: leadId });
    if (!leads.length) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];

    // Skip if already suppressed
    if (lead.suppression_status !== 'active') {
      return Response.json({ message: 'Lead suppressed, skipping campaign' });
    }

    // Calculate estimated benefit (1.5% of listing price)
    const estimatedBenefit = lead.listing_price ? Math.round(lead.listing_price * 0.015) : 0;

    // Update lead with benefit and initial campaign stage
    await base44.asServiceRole.entities.VTONLead.update(leadId, {
      estimated_benefit: estimatedBenefit,
      campaign_stage: 'initial_outreach',
      last_engagement: new Date().toISOString()
    });

    // === LAUNCH SMS CAMPAIGN ===
    if (lead.phone && lead.sms_status === 'pending') {
      const smsMessage = `Hi ${lead.first_name}, because your home at ${lead.property_address}, ${lead.city} was recently listed for sale, you may qualify for substantial buyer benefits through the Veteran Transition Opportunity Network. Review your potential benefits here: https://myrebate.house/vton-benefit?lead=${leadId} Reply STOP to opt out.`;

      base44.functions.invoke('sendSMS', {
        phone: lead.phone,
        message: smsMessage
      }).catch(err => console.error('SMS send failed:', err));

      // Mark SMS as sent
      await base44.asServiceRole.entities.VTONLead.update(leadId, {
        sms_status: 'sent'
      });
    }

    // === LAUNCH EMAIL CAMPAIGN ===
    if (lead.email && lead.email_status === 'pending') {
      const emailSubject = `Veteran Benefit Opportunity For ${lead.property_address}`;
      const emailBody = `Hi ${lead.first_name},

Because your home at ${lead.property_address} in ${lead.city}, ${lead.state} was recently listed for sale, you may qualify for significant buyer benefits through the Veteran Transition Opportunity Network.

WHAT THIS MEANS FOR YOU:
As a veteran selling a home that was VA-financed, you may qualify for substantial buyer benefits—estimated at up to $${estimatedBenefit.toLocaleString()} toward your next home purchase.

WHY NOW:
The timing of your current home sale creates a unique qualification window. These benefits are specifically designed for veterans in your exact situation.

NEXT STEP:
Book a personalized Benefit Review with one of our veteran transition specialists. It takes 15 minutes and is completely free.

BOOK YOUR BENEFIT REVIEW:
https://myrebate.house/vton-benefit?lead=${leadId}

This is not a government program. It's a private veteran benefit program designed to help veterans like you make informed next-home decisions.

Questions? Reply to this email or call us.

Regards,
The Veteran Transition Opportunity Network
`;

      base44.integrations.Core.SendEmail({
        to: lead.email,
        from_name: 'Veteran Transition Opportunity Network',
        subject: emailSubject,
        body: emailBody
      }).catch(err => console.error('Email send failed:', err));

      // Mark email as sent
      await base44.asServiceRole.entities.VTONLead.update(leadId, {
        email_status: 'sent'
      });
    }

    // === TRIGGER DIRECT MAIL QUEUE ===
    // (In production, this would integrate with Lob or similar)
    if (!lead.direct_mail_sent) {
      base44.functions.invoke('vtonDirectMailQueue', {
        lead_id: leadId,
        first_name: lead.first_name,
        property_address: lead.property_address,
        city: lead.city,
        state: lead.state,
        zip_code: lead.zip_code,
        estimated_benefit: estimatedBenefit
      }).catch(err => console.error('Direct mail queue failed:', err));
    }

    // === SYNC META CUSTOM AUDIENCE ===
    // (In production, this would call Meta's Conversions API)
    base44.functions.invoke('vtonMetaAudienceSync', {
      lead_id: leadId,
      first_name: lead.first_name,
      email: lead.email,
      phone: lead.phone,
      zip_code: lead.zip_code
    }).catch(err => console.error('Meta sync failed:', err));

    // === SCHEDULE FOLLOW-UP CAMPAIGN ===
    // If lead doesn't engage in 2 days, send follow-up
    // (This would be handled by a scheduled automation checking engagement)

    return Response.json({
      success: true,
      message: 'VTON rapid response campaign launched',
      lead_id: leadId,
      estimated_benefit: estimatedBenefit
    });
  } catch (error) {
    console.error('VTON Rapid Response Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});