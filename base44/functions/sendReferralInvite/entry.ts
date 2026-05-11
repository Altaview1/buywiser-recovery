import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { senderEmail, recipientEmail, referralLink } = body;

    if (!recipientEmail) {
      return Response.json({ error: 'Recipient email required' }, { status: 400 });
    }

    // Send referral invitation email
    await base44.integrations.Core.SendEmail({
      to: recipientEmail,
      subject: `${user.full_name || 'A friend'} invited you to SmartBuy™ by BuyWiser`,
      body: `
        <h2>You're invited to SmartBuy™</h2>
        <p>${user.full_name || 'A friend'} thinks you'd benefit from expert-guided home buying with token rewards.</p>
        <p><strong>What is SmartBuy™?</strong></p>
        <ul>
          <li>AI-guided home purchase process</li>
          <li>Licensed mortgage professionals on demand</li>
          <li>2.5% commission savings back to you</li>
          <li>Token-based rewards for referrals</li>
        </ul>
        <p><a href="${referralLink}">Start your SmartBuy™ journey →</a></p>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          When you complete your first transaction, you'll both earn bonus tokens!
        </p>
      `,
      from_name: 'BuyWiser SmartBuy™'
    });

    return Response.json({
      success: true,
      message: `Invitation sent to ${recipientEmail}`
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});