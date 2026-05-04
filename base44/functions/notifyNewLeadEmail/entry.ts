import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event, data } = await req.json();

    if (!data || event.type !== 'create') {
      return Response.json({ status: 'skipped' });
    }

    const lead = data;
    const adminEmail = 'bennett@buywiser.com';
    const partnerEmail = lead.assigned_agent ? null : null;

    // Get partner email if assigned
    let partner = null;
    if (lead.assigned_agent) {
      const partners = await base44.asServiceRole.entities.PartnerApplication.filter({
        name: lead.assigned_agent,
        status: 'approved'
      }, 'name', 1);
      if (partners.length > 0) {
        partner = partners[0];
      }
    }

    // Format lead details
    const leadDetails = `
Name: ${lead.name || 'Not provided'}
Email: ${lead.email || 'Not provided'}
Phone: ${lead.phone || 'Not provided'}
Property: ${lead.address_or_link || 'Not provided'}
Code: ${lead.code || 'None'}
Assigned Agent: ${lead.assigned_agent || 'Not assigned'}
Status: ${lead.status || 'New'}
UTM Source: ${lead.utm_source || 'Direct'}
Internal Notes: ${lead.internal_notes || 'None'}
`;

    // Email to admin
    await base44.integrations.Core.SendEmail({
      to: adminEmail,
      from_name: 'BuyWiser',
      subject: `New Lead Submitted: ${lead.name || 'Unknown'}`,
      body: `A new lead has been submitted.\n\n${leadDetails}\n\nLog in to the dashboard to view and manage this lead.`,
    });

    // Email to assigned partner if applicable
    if (partner && partner.email) {
      await base44.integrations.Core.SendEmail({
        to: partner.email,
        from_name: 'BuyWiser',
        subject: `New Lead Assigned: ${lead.name || 'Unknown'}`,
        body: `A new lead has been assigned to you.\n\n${leadDetails}\n\nLog in to your partner dashboard to view details and follow up.`,
      });
    }

    return Response.json({ 
      status: 'success', 
      adminNotified: true,
      partnerNotified: !!partner
    });
  } catch (error) {
    console.error('Email notification error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});