import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST required' }, { status: 405 });
  }

  try {
    const { email } = await req.json();
    
    if (!email || typeof email !== 'string') {
      return Response.json({ error: 'Email required' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);
    const emailLower = email.toLowerCase().trim();

    // Service role query to bypass RLS and auth
    const partners = await base44.asServiceRole.entities.PartnerApplication.filter({ status: 'approved' }, '-created_date', 500);
    const partner = partners.find(p => 
      p.email?.toLowerCase() === emailLower
    );

    if (!partner) {
      return Response.json({ error: 'No approved partner found' }, { status: 404 });
    }

    return Response.json({ success: true, partner });
  } catch (error) {
    console.error('Partner verification error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});