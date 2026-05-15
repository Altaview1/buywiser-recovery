import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Approve and send a VTON lead's direct mail to Lob
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const payload = await req.json();
    const { lead_id, action } = payload; // action: 'approve' or 'reject'

    if (!lead_id || !action) {
      return Response.json({ error: 'Missing lead_id or action' }, { status: 400 });
    }

    // Get the lead
    const lead = await base44.asServiceRole.entities.VTONLead.get(lead_id);
    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    if (action === 'approve') {
      // Check if already sent
      if (lead.direct_mail_sent) {
        return Response.json({ error: 'Mail already sent for this lead' }, { status: 400 });
      }

      // Send to Lob
      const mailResult = await base44.functions.invoke('vtonDirectMailQueue', {
        lead_id: lead.id,
        first_name: lead.first_name,
        last_name: lead.last_name,
        property_address: lead.property_address,
        city: lead.city,
        state: lead.state,
        zip_code: lead.zip_code,
        estimated_benefit: lead.estimated_benefit
      });

      if (mailResult.error) {
        await base44.asServiceRole.entities.VTONLead.update(lead_id, {
          mail_approval_status: 'rejected',
          notes: (lead.notes || '') + `\n[Approval] Rejected - Lob error: ${mailResult.error}`
        });
        return Response.json({ error: mailResult.error }, { status: 500 });
      }

      // Update lead status
      await base44.asServiceRole.entities.VTONLead.update(lead_id, {
        mail_approval_status: 'sent',
        direct_mail_sent: true,
        lob_letter_id: mailResult.letterId,
        lob_delivery_status: 'processing',
        lob_last_updated: new Date().toISOString(),
        lob_estimated_cost: mailResult.estimatedCost
      });

      return Response.json({ 
        success: true, 
        message: 'Mail approved and sent to Lob',
        letterId: mailResult.letterId
      });

    } else if (action === 'reject') {
      // Mark as rejected
      await base44.asServiceRole.entities.VTONLead.update(lead_id, {
        mail_approval_status: 'rejected',
        notes: (lead.notes || '') + `\n[Approval] Rejected by ${user.email} on ${new Date().toISOString()}`
      });

      return Response.json({ 
        success: true, 
        message: 'Mail request rejected'
      });

    } else {
      return Response.json({ error: 'Invalid action. Use "approve" or "reject"' }, { status: 400 });
    }

  } catch (error) {
    console.error('Mail approval error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});