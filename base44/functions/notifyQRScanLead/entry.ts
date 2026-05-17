import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import twilio from 'npm:twilio@4.19.3';

const ADMIN_EMAIL = Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || 'admin@buywiser.com';
const ADMIN_PHONE = Deno.env.get("BENNETT_PHONE");
const TWILIO_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_FROM = Deno.env.get("TWILIO_FROM_NUMBER");

async function sendSMS(to, body) {
  if (!to || !TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) return;
  try {
    const client = twilio(TWILIO_SID, TWILIO_TOKEN);
    await client.messages.create({ from: TWILIO_FROM, to, body });
  } catch (err) {
    console.error("SMS error:", err.message);
  }
}

async function sendEmail(base44, to, subject, body) {
  try {
    await base44.asServiceRole.integrations.Core.SendEmail({ to, subject, body, from_name: "BuyWiser VTON" });
  } catch (err) {
    console.error("Email error:", err.message);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Entity automation — no user auth needed
    const payload = await req.json();
    const submission = payload.data;

    if (!submission || submission.how_heard !== "vton_qr") {
      return Response.json({ skipped: true });
    }

    // Extract opportunity ID
    const oppIdMatch = submission.comments?.match(/opportunity ([a-z0-9]+)/i);
    const oppId = oppIdMatch?.[1];

    let agentEmail = null;
    let agentPhone = null;
    let agentName = null;
    let propertyAddress = null;
    let homeownerName = submission.first_name || "Homeowner";

    if (oppId) {
      const opps = await base44.asServiceRole.entities.VTONOpportunity.filter({ id: oppId });
      if (opps.length > 0) {
        const opp = opps[0];
        propertyAddress = [opp.property_address, opp.city, opp.state].filter(Boolean).join(", ");
        homeownerName = opp.homeowner_name || homeownerName;

        if (opp.partner_email) {
          const agents = await base44.asServiceRole.entities.PartnerApplication.filter({ email: opp.partner_email.toLowerCase(), status: "approved" });
          if (agents.length > 0) {
            agentEmail = agents[0].email;
            agentName = agents[0].name;
            agentPhone = agents[0].phone || null;
          }
        }
      }
    }

    const prospectEmail = submission.email || "Not provided";
    const prospectPhone = submission.phone || "Not provided";

    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0B1F3B; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" height="32" style="opacity:0.8;" alt="BuyWiser" />
        </div>
        <div style="background: #fff; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; padding: 24px;">
          <div style="display:inline-block; background:#fef9c3; border:1px solid #fde68a; border-radius:6px; padding:6px 14px; font-size:12px; font-weight:700; color:#92400e; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:16px;">
            🔔 QR Scan — Prospect Follow-Up
          </div>
          <h2 style="color:#0B1F3B; margin:0 0 6px;">A Prospect Just Scanned Your QR Code</h2>
          <p style="color:#64748b; font-size:14px; margin:0 0 20px;">They viewed the benefit calculator and left contact info. Reach out within the hour for best results.</p>

          <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom:20px;">
            <tr style="background:#f8fafc;">
              <td style="padding:10px 12px; font-weight:700; color:#475569; width:40%; border-bottom:1px solid #e2e8f0;">Prospect Name</td>
              <td style="padding:10px 12px; color:#1e293b; border-bottom:1px solid #e2e8f0;">${homeownerName}</td>
            </tr>
            <tr>
              <td style="padding:10px 12px; font-weight:700; color:#475569; border-bottom:1px solid #e2e8f0;">Email</td>
              <td style="padding:10px 12px; color:#1e293b; border-bottom:1px solid #e2e8f0;"><a href="mailto:${prospectEmail}" style="color:#2563eb;">${prospectEmail}</a></td>
            </tr>
            <tr style="background:#f8fafc;">
              <td style="padding:10px 12px; font-weight:700; color:#475569; border-bottom:1px solid #e2e8f0;">Phone</td>
              <td style="padding:10px 12px; color:#1e293b; border-bottom:1px solid #e2e8f0;"><a href="tel:${prospectPhone}" style="color:#2563eb;">${prospectPhone}</a></td>
            </tr>
            ${propertyAddress ? `<tr><td style="padding:10px 12px; font-weight:700; color:#475569; border-bottom:1px solid #e2e8f0;">Property</td><td style="padding:10px 12px; color:#1e293b; border-bottom:1px solid #e2e8f0;">${propertyAddress}</td></tr>` : ""}
          </table>

          <div style="background:#ecfdf5; border:1px solid #6ee7b7; border-radius:8px; padding:14px 16px; font-size:13px; color:#065f46;">
            <strong>Action:</strong> This prospect just viewed their personalized benefit. Call or text within the hour while they're warm.
          </div>
        </div>
        <p style="text-align:center; font-size:11px; color:#94a3b8; margin-top:12px;">BuyWiser Technology, Inc. · NMLS #1887767</p>
      </div>
    `;

    const smsBody = `🔔 QR Alert: ${homeownerName} scanned your QR code & viewed benefits.\n📞 ${prospectPhone}\n📧 ${prospectEmail}\nFollow up now!`;
    const adminSmsBody = `[ADMIN] ${homeownerName} scanned QR for ${agentName || "Unknown Agent"}.\n📞 ${prospectPhone}\n📧 ${prospectEmail}${propertyAddress ? `\nProperty: ${propertyAddress}` : ""}\nAgent: ${agentEmail || "Unknown"}`;

    // Send in parallel
    await Promise.all([
      // Email to agent
      agentEmail ? sendEmail(base44, agentEmail, `🔔 QR Scan Alert — ${homeownerName} just viewed your benefit`, emailBody) : Promise.resolve(),
      // Email to admin
      sendEmail(base44, ADMIN_EMAIL, `🔔 QR Scan Alert — ${homeownerName} (Agent: ${agentName || "Unknown"})`, emailBody),
      // SMS to agent
      agentPhone ? sendSMS(agentPhone, smsBody) : Promise.resolve(),
      // SMS to admin
      ADMIN_PHONE ? sendSMS(ADMIN_PHONE, adminSmsBody) : Promise.resolve(),
    ]);

    return Response.json({ success: true, agent: agentEmail, admin: ADMIN_EMAIL });
  } catch (error) {
    console.error("notifyQRScanLead error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});