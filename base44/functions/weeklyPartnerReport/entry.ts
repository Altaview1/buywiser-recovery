import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get all approved partners
    const partners = await base44.asServiceRole.entities.PartnerApplication.filter({ status: "approved" });

    let sent = 0;

    for (const partner of partners) {
      // Get all opportunities for this partner
      const opps = await base44.asServiceRole.entities.VTONOpportunity.filter(
        { partner_email: partner.email },
        "-updated_date",
        200
      );

      if (opps.length === 0) continue;

      const inProgress = opps.filter(o =>
        ["assigned", "contacted", "conversation_verified", "consultation_scheduled"].includes(o.opportunity_status || "assigned")
      );
      const closedWon = opps.filter(o => o.opportunity_status === "closed_won");
      const closedLost = opps.filter(o => o.opportunity_status === "closed_lost");
      const verified = opps.filter(o => o.opportunity_status === "conversation_verified");

      const firstName = partner.name?.split(" ")[0] || "Partner";
      const territory = partner.territory || "your territory";
      const depositUsed = (partner.verified_conversations || 0) * 200;
      const depositRemaining = Math.max(0, (partner.deposit_balance || 2000) - depositUsed);

      const oppRow = (opp) => {
        const addr = [opp.property_address, opp.city, opp.state].filter(Boolean).join(", ");
        const statusLabel = {
          assigned: "Assigned",
          contacted: "Contacted",
          conversation_verified: "Verified ✓",
          consultation_scheduled: "Consultation Scheduled",
          closed_won: "Closed Won 🏆",
          closed_lost: "Closed Lost",
        }[opp.opportunity_status || "assigned"] || opp.opportunity_status;
        const homeowner = opp.homeowner_name || "Homeowner";
        return `
          <tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#1e293b;">${homeowner}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#475569;">${addr}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f1f5f9;font-size:13px;font-weight:600;color:#0B1F3B;">${statusLabel}</td>
          </tr>`;
      };

      const tableSection = (title, color, rows) => rows.length === 0 ? "" : `
        <p style="margin:20px 0 8px;font-size:11px;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:${color};">${title} (${rows.length})</p>
        <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Homeowner</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Property</th>
              <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.08em;">Status</th>
            </tr>
          </thead>
          <tbody>${rows.map(oppRow).join("")}</tbody>
        </table>`;

      const weekStr = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

      await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: "VTON — Veteran Transition Opportunity Network",
        to: partner.email,
        subject: `📋 Your VTON Weekly Report — ${weekStr}`,
        body: `
          <div style="font-family:sans-serif;max-width:620px;margin:0 auto;color:#1e293b;">

            <!-- Header -->
            <div style="background:#0B1F3B;padding:20px 24px;border-radius:8px 8px 0 0;">
              <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height:30px;" />
              <p style="margin:8px 0 0;font-size:10px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">
                VTON · Weekly Partner Report
              </p>
            </div>
            <div style="height:4px;background:#C62828;"></div>

            <!-- Body -->
            <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
              <p style="font-size:15px;margin:0 0 4px;">Hi ${firstName},</p>
              <p style="font-size:14px;color:#475569;margin:0 0 20px;line-height:1.6;">
                Here's your weekly summary for <strong style="color:#0B1F3B;">${territory}</strong> as of ${weekStr}.
              </p>

              <!-- KPI strip -->
              <div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap;">
                ${[
                  { label: "Total Opps", value: opps.length, color: "#0B1F3B" },
                  { label: "In Progress", value: inProgress.length, color: "#d97706" },
                  { label: "Verified", value: verified.length, color: "#7c3aed" },
                  { label: "Closed Won", value: closedWon.length, color: "#16a34a" },
                  { label: "Deposit Left", value: `$${depositRemaining.toLocaleString()}`, color: "#C62828" },
                ].map(k => `
                  <div style="flex:1;min-width:90px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:center;">
                    <p style="margin:0 0 2px;font-size:10px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;">${k.label}</p>
                    <p style="margin:0;font-size:20px;font-weight:900;color:${k.color};">${k.value}</p>
                  </div>`).join("")}
              </div>

              ${tableSection("In Progress", "#d97706", inProgress)}
              ${tableSection("Closed Won", "#16a34a", closedWon)}
              ${tableSection("Closed Lost", "#64748b", closedLost)}

              <!-- CTA -->
              <div style="text-align:center;margin-top:24px;">
                <a href="https://buywiser.base44.app/partner"
                  style="display:inline-block;padding:12px 28px;background:#C62828;color:#fff;font-weight:700;border-radius:10px;text-decoration:none;font-size:14px;">
                  Open My Dashboard →
                </a>
              </div>

              <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:16px;">
                Remember: QR scan or rep code required per verified conversation ($200 credit each).
              </p>
            </div>

            <!-- Footer -->
            <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:12px;line-height:1.6;">
              VTON, Veteran's Next Home™, and the Red White &amp; Blue Purchase Benefit are private programs<br />
              not affiliated with the U.S. Department of Veterans Affairs.<br />
              BuyWiser Technology, Inc. · NMLS #1887767
            </p>
          </div>
        `,
      });

      sent++;
    }

    console.log(`Weekly partner report sent to ${sent} partner(s).`);
    return Response.json({ success: true, sent });
  } catch (error) {
    console.error("weeklyPartnerReport error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});