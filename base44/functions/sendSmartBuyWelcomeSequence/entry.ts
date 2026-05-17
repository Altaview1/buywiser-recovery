import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Triggered by entity automation on SmartBuyLead create
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const payload = await req.json();

    // Support both direct invocation and entity automation payload
    const lead = payload.data || payload;

    if (!lead || !lead.email) {
      return Response.json({ status: 'skipped - no email' });
    }

    const firstName = (lead.name || 'there').split(' ')[0];
    const savings = lead.savings_pool_estimate;
    const savingsFormatted = savings ? `$${Number(savings).toLocaleString('en-US')}` : '$10,000–$30,000+';
    const price = lead.purchase_price ? `$${Number(lead.purchase_price).toLocaleString('en-US')}` : null;

    // ── Email 1: Immediate Welcome + Program Overview ──────────────────────────
    const email1 = {
      to: lead.email,
      from_name: 'Buywiser SmartBuy™',
      subject: `${firstName}, your SmartBuy™ Savings Pool is ${savingsFormatted} — here's how it works`,
      body: `Hi ${firstName},

Welcome to Buywiser SmartBuy™ — California's first AI-guided, cash-preservation homebuying platform.

${savings ? `Your estimated Savings Pool: ${savingsFormatted}${price ? ` (on a ${price} purchase)` : ''}` : 'Your Savings Pool estimate is being calculated.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS SMARTBUY™?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Traditional home buying funnels 2.5–3% of your purchase price into a single buyer-agent commission. On a $750,000 home, that's $18,750 that disappears at closing — whether or not your agent added that value.

SmartBuy™ replaces that model with something better:

  ✅ AI handles property research, offer prep, and document management — free
  ✅ You pay only for the licensed professional services you actually use
  ✅ Everything not spent stays in your Savings Pool — applied to your rate, closing costs, or cash back

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE SIX STAGES OF YOUR TRANSACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 🔍 Property Intelligence — AI evaluates the listing, comps, and market trends. Free.
2. 📋 Mortgage Pre-Qualification — Licensed broker review to lock in your best rate.
3. ✍️ Offer Preparation — California requires a licensed Realtor for this step.
4. 📁 Transaction Management — Document coordination, disclosures, and deadlines.
5. 🔑 Closing Coordination — Final walkthrough and closing appointment logistics.
6. 💰 Post-Close Distribution — Unused savings returned to you at closing.

The less professional help you need, the more you keep. The SAVE-o-Meter tracks every dollar.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT HAPPENS NEXT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A Buywiser specialist will reach out within 1 business day to:
  → Confirm your Savings Pool
  → Walk you through Stage 1: Property Intelligence
  → Answer any questions about the program

You'll receive two more emails from us over the next 48 hours with deeper dives into pricing, your expert team, and the savings guarantee.

Questions right now? Call (818) 300-2642 or reply to this email.

— Bennett Liss & The Buywiser SmartBuy™ Team
Founder · NMLS #1524446 · CA DRE #01107013
BuyWiser Technology, Inc. NMLS #1887767

This is a private program, not a government benefit. Savings estimates based on typical buyer-side commission structures and are not guaranteed.`,
    };

    await base44.asServiceRole.integrations.Core.SendEmail(email1);

    return Response.json({
      status: 'success',
      emails_sent: 1,
      recipient: lead.email,
    });

  } catch (error) {
    console.error('SmartBuy welcome sequence error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});