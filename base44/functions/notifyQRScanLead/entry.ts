import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ADMIN_EMAIL = "bennett@buywiser.com";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const submission = payload.data;
    if (!submission) return Response.json({ skipped: true });

    // Only fire for QR-originated submissions
    if (submission.how_heard !== "vton_qr") {
      return Response.json({ skipped: "not a QR scan lead" });
    }

    // Extract opportunity ID from comments field
    const oppIdMatch = submission.comments?.match(/opportunity ([a-z0-9]+)/i);
    const oppId = oppIdMatch?.[1];

    // Look up the opportunity and agent
    let agentEmail = null;
    let agentName = null;
    let propertyAddress = null;
    let homeownerName = submission.first_name || "Veteran";

    if (oppId) {
      const opps = await base44.asServiceRole.entities.VTONOpportunity.filter({ id: oppId });
      if (opps.length) {
        const opp = opps[0];
        propertyAddress = [opp.property_address, opp.city, opp.state].filter(Boolean).join(", ");
        homeownerName = opp.homeowner_name || homeownerName;

        if (opp.partner_email) {
          const agents = await base44.asServiceRole.entities.PartnerApplication.filter({
            email: opp.partner_email,
            status: "approved"
          });
          if (agents.length) {
            agentEmail = agents[0].email;
            agentName = agents[0].name;
          }
        }
      }
    }

    const prospectEmail = submission.email || "Not provided";
    const prospectPhone = submission.phone || "Not provided";
    const prospectName = homeownerName;

    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0B1F3B; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" height="32" style="opacity:0.8;" alt="BuyWiser" />
        </div>
        <div style="background: #fff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
          <div style="display:inline-block; background:#fef9c3; border:1px solid #fde68a; border-radius:6px; padding:6px 14px; font-size:12px; font-weight:700; color:#92400e; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:16px;">
            🔔 QR Scan — Follow Up Now
          </div>
          <h2 style="color:#0B1F3B; margin:0 0 6px;">A Prospect Just Scanned Your QR Code</h2>
          <p style="color:#64748b; font-size:14px; margin:0 0 20px;">They filled out the benefit calculator and requested a follow-up. Reach out within the hour for the best results.</p>

          <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom:20px;">
            <tr style="background:#f8fafc;">
              <td style="padding:10px 12px; font-weight:700; color:#475569; width:40%; border-bottom:1px solid #e2e8f0;">Prospect Name</td>
              <td style="padding:10px 12px; color:#1e293b; border-bottom:1px solid #e2e8f0;">${prospectName}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px; font-weight:700; color:#475569; border-bottom:1px solid #e2e8f0;">Email</td>
              <td style="padding:10px 12px; color:#1e293b; border-bottom:1px solid #e2e8f0;"><a href="mailto:${prospectEmail}" style="color:#2563eb;">${prospectEmail}</a></td>
            </tr>
            <tr style="background:#f8fafc;">
              <td style="padding:10px 12px; font-weight:700; color:#475569; border-bottom:1px solid #e2e8f0;">Phone</td>
              <td style="padding:10px 12px; color:#1e293b; border-bottom:1px solid #e2e8f0;"><a href="tel:${prospectPhone}" style="color:#2563eb;">${prospectPhone}</a></td>
            </tr>
            ${propertyAddress ? `
            <tr>
              <td style="padding:10px 12px; font-weight:700; color:#475569; border-bottom:1px solid #e2e8f0;">Property</td>
              <td style="padding:10px 12px; color:#1e293b; border-bottom:1px solid #e2e8f0;">${propertyAddress}</td>
            </tr>` : ""}
            <tr style="background:#f8fafc;">
              <td style="padding:10px 12px; font-weight:700; color:#475569;">Source</td>
              <td style="padding:10px 12px; color:#1e293b;">QR Code Scan → Benefit Calculator</td>
            </tr>
          </table>

          <div style="background:#ecfdf5; border:1px solid #6ee7b7; border-radius:8px; padding:14px 16px; font-size:13px; color:#065f46;">
            <strong>Tip:</strong> This prospect just saw their personalized benefit estimate. They're warm — call or text within the hour.
          </div>
        </div>
        <p style="text-align:center; font-size:11px; color:#94a3b8; margin-top:12px;">BuyWiser Technology, Inc. · NMLS #1887767</p>
      </div>
    `;

    const recipients = [];
    if (agentEmail) recipients.push({ email: agentEmail, name: agentName });
    // Always CC admin (deduped)
    if (!recipients.find(r => r.email === ADMIN_EMAIL)) {
      recipients.push({ email: ADMIN_EMAIL, name: "Bennett (Admin)" });
    }

    // Send to all recipients
    await Promise.all(recipients.map(r =>
      base44.asServiceRole.integrations.Core.SendEmail({
        to: r.email,
        from_name: "BuyWiser VTON",
        subject: `🔔 QR Scan Alert — ${prospectName} just filled out the benefit calculator`,
        body: emailBody,
      })
    ));

    return Response.json({ sent: true, recipients: recipients.map(r => r.email) });
  } catch (error) {
    console.error("notifyQRScanLead error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});