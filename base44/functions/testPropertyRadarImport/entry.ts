import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Test Function: Simulates a high-priority VTON opportunity import
 * Use this to test the SMS and email notification flow without calling PropertyRadar API
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Admin-only function
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get approved partners
    const partners = await base44.asServiceRole.entities.PartnerApplication.filter({ status: 'approved' });
    if (partners.length === 0) {
      return Response.json({ error: 'No approved partners available' }, { status: 500 });
    }

    // Assign to first partner (or Bennett)
    const assignedPartner = partners.find(p => p.email === 'bennett@buywiser.com') || partners[0];

    // Create test high-priority opportunity
    // The automation "New VTON Opportunity Alert" will automatically trigger notifications
    const testOpportunity = await base44.entities.VTONOpportunity.create({
      partner_email: assignedPartner.email,
      homeowner_name: 'John & Jane Smith (TEST)',
      homeowner_phone: '+15551234567',
      homeowner_email: 'test.homeowner@example.com',
      property_address: '123 Test Street (DELETE ME)',
      city: 'Los Angeles',
      state: 'CA',
      property_type: 'SFR',
      estimated_price: 850000,
      estimated_equity: 320000,
      distress_score: 75,
      listing_dom: 95,
      va_loan_confirmed: true,
      listing_status: 'active',
      opportunity_status: 'assigned',
      priority: 'high',
      crm_notes: 'TEST OPPORTUNITY - Created to verify SMS/email notification system. Safe to delete.',
      qr_scanned: false,
      needs_reassignment: false
    });

    return Response.json({
      status: 'success',
      message: 'Test HIGH PRIORITY opportunity created - automation will send SMS & email to partner',
      opportunity_id: testOpportunity.id,
      assigned_partner: assignedPartner.email,
      partner_phone: assignedPartner.phone,
      priority: testOpportunity.priority,
      warning: 'This is a TEST record - notifications should be sent immediately. Delete after testing.'
    });

  } catch (error) {
    console.error('testPropertyRadarImport error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});