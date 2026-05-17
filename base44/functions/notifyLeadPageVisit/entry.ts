import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Public page visit tracking — no auth required
    const { lead_id } = await req.json();

    if (!lead_id) {
      return Response.json({ error: 'Missing lead_id' }, { status: 400 });
    }

    // Fetch the lead
    const lead = await base44.entities.VTONLead.get(lead_id);
    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Increment site_visits
    const updatedLead = await base44.entities.VTONLead.update(lead_id, {
      site_visits: (lead.site_visits || 0) + 1,
      last_engagement: new Date().toISOString()
    });

    // Send email notification to admin/user
    const adminEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL');
    if (!adminEmail) {
      return Response.json({ error: 'ADMIN_NOTIFICATION_EMAIL not configured' }, { status: 500 });
    }
    await base44.integrations.Core.SendEmail({
      to: adminEmail,
      subject: `🔗 Veteran Clicked Their Personalized Link - ${lead.first_name} ${lead.last_name}`,
      body: `
        <h2>Lead Engagement Alert</h2>
        <p><strong>${lead.first_name} ${lead.last_name}</strong> just viewed their personalized benefit page!</p>
        
        <h3>Veteran Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${lead.first_name} ${lead.last_name}${lead.spouse_name ? ' & ' + lead.spouse_name : ''}</li>
          <li><strong>Phone:</strong> ${lead.phone}</li>
          <li><strong>Email:</strong> ${lead.email}</li>
          <li><strong>Property:</strong> ${lead.property_address}, ${lead.city}, ${lead.state} ${lead.zip_code}</li>
          <li><strong>Total Page Visits:</strong> ${updatedLead.site_visits}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        
        <p>
          <a href="https://buywiser.com/vton-mail-dashboard" style="background-color: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View in Dashboard
          </a>
        </p>
      `
    });

    return Response.json({
      success: true,
      site_visits: updatedLead.site_visits,
      message: `Lead visit tracked. Total visits: ${updatedLead.site_visits}`
    });
  } catch (error) {
    console.error('Error tracking lead visit:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});