import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const STAGE_LABELS = {
  1: "Pre-Qualification",
  2: "Property Search",
  3: "Schedule Tours",
  4: "Write Offer",
  5: "Inspections & Appraisal",
  6: "Close Transaction"
};

const STAGE_EMOJIS = {
  1: "📋",
  2: "🔍",
  3: "🏠",
  4: "✍️",
  5: "📊",
  6: "🔑"
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Called by user-facing frontend action — auth validated at UI level
    const { lead_id, completed_stage, lead_data } = await req.json();

    if (!lead_id || !completed_stage || !lead_data) {
      return Response.json(
        { error: "Missing required fields: lead_id, completed_stage, lead_data" },
        { status: 400 }
      );
    }

    const stageName = STAGE_LABELS[completed_stage] || `Stage ${completed_stage}`;
    const emoji = STAGE_EMOJIS[completed_stage] || "⭐";
    const remainingBalance = lead_data.tokens_remaining || 0;
    const savingsPool = lead_data.savings_pool_estimate || 0;
    const spentPercentage = Math.round(((savingsPool - remainingBalance) / savingsPool) * 100);

    // Convert to USD currency display
    const totalSpent = savingsPool - remainingBalance;

    const emailBody = `Hi ${lead_data.name?.split(" ")[0] || "there"},

Congratulations! 🎉

You've successfully completed the **${stageName}** ${emoji} stage of your SmartBuy™ journey!

**Your Updated Savings Balance:**
• Total Savings Pool: $${savingsPool.toLocaleString()}
• Remaining Balance: $${remainingBalance.toLocaleString()}
• Progress: ${spentPercentage}% of pool allocated

You're making great progress toward keeping more of your money at closing. Keep going!

**Next Steps:**
Continue to the next stage to unlock more expert guidance and maximize your savings potential.

Questions? Call us at (818) 300-2642 or reply to this email.

— The Buywiser SmartBuy™ Team

BuyWiser Technology, Inc. NMLS #1887767 · CA DRE #01107013
This is a private program, not a government benefit.`;

    // Send email via integrations
    await base44.integrations.Core.SendEmail({
      to: lead_data.email,
      from_name: "Buywiser SmartBuy™",
      subject: `🎉 Stage Complete: ${stageName} — Your New Balance: $${remainingBalance.toLocaleString()}`,
      body: emailBody
    });

    return Response.json({
      success: true,
      message: `Congratulations email sent to ${lead_data.email}`,
      stage: stageName,
      balance: remainingBalance
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});