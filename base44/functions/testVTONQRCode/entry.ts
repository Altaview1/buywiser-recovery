import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lead_id } = await req.json();

    if (!lead_id) {
      return Response.json({ error: 'lead_id required' }, { status: 400 });
    }

    // Fetch the specific lead
    const lead = await base44.entities.VTONLead.get(lead_id);

    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Generate the personalized landing page URL (relative path works in all environments)
    const landingPageUrl = `/vton-personalized/${lead_id}`;

    // Generate QR code with the relative URL encoded
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(landingPageUrl)}`;

    return Response.json({
      success: true,
      lead: {
        id: lead.id,
        name: `${lead.first_name} ${lead.last_name}`,
        email: lead.email,
        property: `${lead.property_address}, ${lead.city}, ${lead.state} ${lead.zip_code}`,
        estimated_benefit: lead.estimated_benefit,
        priority_score: lead.contact_priority_score || 0
      },
      urls: {
        landing_page: landingPageUrl,
        qr_code_image: qrCodeUrl
      },
      testing_instructions: {
        step_1: "Copy the 'landing_page' URL and open it in your browser",
        step_2: "Or scan the 'qr_code_image' with your phone camera",
        step_3: "You should see the personalized landing page with the lead's home details and benefit estimate"
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});