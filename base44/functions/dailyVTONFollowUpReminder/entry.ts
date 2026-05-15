import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@3.2.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Admin-only function (scheduled task)
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Calculate 24 hours ago
    const twentyFourHoursAgo = new Date(Date.now() - (24 * 60 * 60 * 1000));

    // Get all VTON opportunities
    const opportunities = await base44.asServiceRole.entities.VTONOpportunity.list();
    
    // Filter for opportunities created more than 24 hours ago that haven't been contacted
    const uncontactedLeads = opportunities.filter(opp => {
      const createdDate = new Date(opp.created_date);
      const isOldEnough = createdDate < twentyFourHoursAgo;
      const notContacted = !opp.contact_date && opp.opportunity_status === 'assigned';
      return isOldEnough && notContacted;
    });

    if (uncontactedLeads.length === 0) {
      return Response.json({
        status: 'success',
        message: 'No uncontacted leads found',
        reminders_sent: 0
      });
    }

    const results = {
      total_uncontacted: uncontactedLeads.length,
      reminders_sent: 0,
      errors: []
    };

    // Group by partner email
    const partnerLeads = {};
    uncontactedLeads.forEach(opp => {
      if (!partnerLeads[opp.partner_email]) {
        partnerLeads[opp.partner_email] = [];
      }
      partnerLeads[opp.partner_email].push(opp);
    });

    // Send reminder email to each partner
    for (const [partnerEmail, leads] of Object.entries(partnerLeads)) {
      try {
        // Get partner details
        const partner = await base44.asServiceRole.entities.PartnerApplication.filter({ 
          email: partnerEmail, 
          status: 'approved' 
        }).then(results => results[0]);

        if (!partner) {
          results.errors.push({ partner_email: partnerEmail, error: 'Partner not found' });
          continue;
        }

        // Build email HTML
        const emailHtml = `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:8px;">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" height="32" style="margin-bottom:16px;" />
            <h2 style="color:#DC2626;margin:0 0 12px;">⚠️ Follow-Up Required: ${leads.length} Uncontacted VTON Lead${leads.length > 1 ? 's' : ''}</h2>
            <p style="color:#64748b;font-size:14px;margin:0 0 16px;">These veteran homeowner opportunities were assigned more than 24 hours ago and require immediate outreach.</p>
            
            <div style="background:white;border:1px solid #e2e8f0;border-radius:6px;padding:16px;margin-bottom:16px;">
              <h3 style="color:#0B1F3B;margin:0 0 12px;font-size:16px;">Leads Requiring Contact</h3>
              ${leads.map((lead, index) => `
                <div style="border-left:3px solid #DC2626;padding:12px;margin-bottom:12px;background:#fef2f2;border-radius:0 4px 4px 0;">
                  <p style="margin:0 0 8px;font-weight:600;color:#991B1B;">${index + 1}. ${lead.homeowner_name || 'Unknown'}</p>
                  <table style="width:100%;font-size:13px;border-collapse:collapse;">
                    <tr><td style="padding:4px 8px 4px 0;color:#64748b;">Property:</td><td style="color:#0f172a;">${lead.property_address}, ${lead.city}, ${lead.state}</td></tr>
                    <tr><td style="padding:4px 8px 4px 0;color:#64748b;">Phone:</td><td><a href="tel:${lead.homeowner_phone}" style="color:#2563eb;">${lead.homeowner_phone || 'N/A'}</a></td></tr>
                    <tr><td style="padding:4px 8px 4px 0;color:#64748b;">Email:</td><td><a href="mailto:${lead.homeowner_email}" style="color:#2563eb;">${lead.homeowner_email || 'N/A'}</a></td></tr>
                    <tr><td style="padding:4px 8px 4px 0;color:#64748b;">Value:</td><td style="color:#0f172a;">${lead.estimated_price ? `$${lead.estimated_price.toLocaleString()}` : 'Unknown'}</td></tr>
                    <tr><td style="padding:4px 8px 4px 0;color:#64748b;">Assigned:</td><td style="color:#0f172a;">${new Date(lead.created_date).toLocaleDateString()}</td></tr>
                  </table>
                </div>
              `).join('')}
            </div>

            <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:4px;padding:12px;margin-bottom:16px;">
              <p style="margin:0;font-size:13px;color:#92400e;"><strong>⚡ Action Required:</strong> Contact these homeowners immediately to schedule their Veterans GAP NextMove™ Benefit Review consultation. Update the opportunity status to "contacted" after outreach.</p>
            </div>

            <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:4px;padding:12px;">
              <p style="margin:0;font-size:12px;color:#0c4a6e;"><strong>VTON Program:</strong> This is a privately funded benefit program for veteran homeowners. Not affiliated with the VA or any government agency.</p>
            </div>

            <p style="margin-top:20px;font-size:11px;color:#94a3b8;text-align:center;">BuyWiser Technology, Inc. · NMLS #1887767</p>
          </div>
        `;

        // Send email
        await resend.emails.send({
          from: 'BuyWiser VTON <notifications@buywiser.com>',
          to: partnerEmail,
          subject: `⚠️ Action Required: ${leads.length} Uncontacted VTON Lead${leads.length > 1 ? 's' : ''} (24+ Hours)`,
          html: emailHtml,
        });

        results.reminders_sent++;
        console.log(`Follow-up reminder sent to ${partnerEmail} for ${leads.length} lead(s)`);

      } catch (err) {
        results.errors.push({ partner_email: partnerEmail, error: err.message });
        console.error(`Error sending reminder to ${partnerEmail}:`, err.message);
      }
    }

    return Response.json({
      status: 'success',
      message: `Sent ${results.reminders_sent} follow-up reminders`,
      details: results
    });

  } catch (error) {
    console.error('dailyVTONFollowUpReminder error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});