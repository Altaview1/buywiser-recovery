import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const email = body.email?.toLowerCase().trim();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Use service role to bypass RLS and find approved partner
    const allPartners = await base44.asServiceRole.entities.PartnerApplication.list();
    const match = allPartners.find(p => p.status === 'approved' && p.email?.toLowerCase() === email);

    if (match) {
      return Response.json({ partner: match });
    } else {
      return Response.json({ error: 'No approved partner account found for this email.' }, { status: 404 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});