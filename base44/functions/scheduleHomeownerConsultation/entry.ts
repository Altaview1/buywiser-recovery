import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@3.2.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();
    const { lead_id } = payload;

    if (!lead_id) {
      return Response.json({ error: 'Missing lead_id' }, { status: 400 });
    }

    // Fetch lead data
    const leads = await base44.asServiceRole.entities.ActivatorLead.filter({ id: lead_id });
    if (leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];
    const firstName = lead.first_name || 'Homeowner';
    const email = lead.email;

    // Get partner details if assigned
    let partnerInfo = null;
    if (lead.activator_id) {
      const activators = await base44.asServiceRole.entities.FieldActivator.filter({ id: lead.activator_id });
      if (activators.length > 0) {
        const activator = activators[0];
        // Get partner application for agent details
        const partners = await base44.asServiceRole.entities.PartnerApplication.filter({ email: activator.email || '' });
        if (partners.length > 0) {
          partnerInfo = partners[0];
        }
      }
    }

    // Generate a consultation confirmation token/ref
    const consultationRef = `VTON-${lead_id.substring(0, 8).toUpperCase()}-${Date.now()}`;

    // Update lead with appointment details
    await base44.asServiceRole.entities.ActivatorLead.update(lead_id, {
      appointment_scheduled: true,
      appointment_date: new Date().toISOString(),
      benefit_review_status: 'SCHEDULED',
    });

    // Send confirmation email to homeowner
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <div style="background: #0B1F3B; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height: 28px;" />
          <p style="margin: 8px 0 0; font-size: 11px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.5);">Consultation Booked</p>
        </div>
        <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
          <h2 style="font-size: 20px; font-weight: 800; margin: 0 0 6px; color: #0B1F3B;">Consultation Confirmed! 🎖️</h2>
          <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
            Hi ${firstName},<br/><br/>
            Your 15-minute Veteran's Next Home™ Benefit Review consultation is confirmed.
          </p>

          <div style="background: #f1f5f9; border-left: 4px solid #10b981; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
            <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #10b981;">What to Expect</p>
            <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 13px; line-height: 1.8;">
              <li>15-minute personalized benefit review</li>
              <li>Your exact benefit estimate based on your home sale</li>
              <li>Next steps for your next home purchase</li>
              <li>No obligation — just clarity on your options</li>
            </ul>
          </div>

          ${partnerInfo ? `
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
              <p style="margin: 0 0 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #3b82f6;">Your BuyWiser Specialist</p>
              <div style="display: flex; gap: 12px;">
                <div>
                  <p style="margin: 0 0 4px; font-weight: 600; color: #0f172a;">${partnerInfo.name || 'Your BuyWiser Team'}</p>
                  ${partnerInfo.phone ? `<p style="margin: 0 0 2px; font-size: 13px; color: #1e40af;"><a href="tel:${partnerInfo.phone}" style="color: #1e40af; text-decoration: none;">${partnerInfo.phone}</a></p>` : ''}
                  ${partnerInfo.email ? `<p style="margin: 0; font-size: 13px; color: #1e40af;"><a href="mailto:${partnerInfo.email}" style="color: #1e40af; text-decoration: none;">${partnerInfo.email}</a></p>` : ''}
                </div>
              </div>
            </div>
          ` : ''}

          <div style="background: #fef9c3; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 14px; margin-bottom: 20px;">
            <p style="margin: 0; font-size: 12px; color: #78350f;">
              <strong>Remember:</strong> Your \$50 charity donation will be processed upon completion of your consultation.
            </p>
          </div>

          <p style="font-size: 12px; color: #94a3b8; margin: 0;">
            Ref: ${consultationRef}<br/>
            BuyWiser Technology, Inc. · NMLS #1887767
          </p>
        </div>
      </div>
    `;

    if (email) {
      await resend.emails.send({
        from: 'BuyWiser VTON <notifications@buywiser.com>',
        to: email,
        subject: '✓ Your Benefit Review Consultation is Confirmed',
        html: emailHtml,
      }).catch(err => console.error('Email send error:', err));
    }

    console.log(`Consultation scheduled for lead ${lead_id}, ref: ${consultationRef}`);
    return Response.json({
      success: true,
      consultation_ref: consultationRef,
      scheduled_for: new Date().toISOString(),
    });
  } catch (error) {
    console.error('scheduleHomeownerConsultation error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});