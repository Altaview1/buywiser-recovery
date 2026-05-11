import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    
    const { referral_code, new_user_email } = body;

    if (!referral_code || !new_user_email) {
      return Response.json({ error: 'Missing referral_code or new_user_email' }, { status: 400 });
    }

    // Find the referral record
    const referrals = await base44.asServiceRole.entities.Referral.filter({
      referral_code: referral_code,
      status: 'pending'
    });

    if (!referrals || referrals.length === 0) {
      return Response.json({ error: 'Invalid or expired referral code' }, { status: 404 });
    }

    const referral = referrals[0];
    const referrer_email = referral.referrer_email;

    // Update referral record to completed
    await base44.asServiceRole.entities.Referral.update(referral.id, {
      referred_email: new_user_email,
      status: 'completed',
      completed_date: new Date().toISOString()
    });

    // Award 50 tokens to the referrer by updating their SmartBuyLead record
    const referrer_leads = await base44.asServiceRole.entities.SmartBuyLead.filter({
      email: referrer_email
    });

    if (referrer_leads && referrer_leads.length > 0) {
      const lead = referrer_leads[0];
      const current_tokens = lead.tokens_remaining || 0;
      const new_balance = current_tokens + 50;

      await base44.asServiceRole.entities.SmartBuyLead.update(lead.id, {
        tokens_remaining: new_balance
      });
    }

    // Send confirmation to referrer
    await base44.integrations.Core.SendEmail({
      to: referrer_email,
      subject: '🎉 Referral Complete — +50 Bonus Tokens!',
      body: `Great news! Your referral for ${new_user_email} has been completed.\n\nYou've earned 50 bonus tokens, which have been added to your SmartBuy Savings Pool.\n\nTotal bonus tokens earned: 50\n\nKeep sharing and earn more tokens!\n\n— BuyWiser SmartBuy™`
    }).catch(() => {});

    return Response.json({
      success: true,
      message: 'Referral completed and tokens awarded',
      tokens_awarded: 50,
      referrer_email: referrer_email
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});