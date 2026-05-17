import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Entity automation — no user auth needed
    const { event, data } = await req.json();

    if (!data || !data.quiz_passed) {
      return Response.json({ status: 'skipped', reason: 'quiz not passed' });
    }

    const partner = data;

    await base44.integrations.Core.SendEmail({
      from_name: 'VTON',
      to: Deno.env.get('ADMIN_NOTIFICATION_EMAIL') || 'admin@buywiser.com',
      subject: `New Partner Quiz Completed: ${partner.name}`,
      body: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family: system-ui, -apple-system, sans-serif; color: #333; line-height: 1.6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
    <h2 style="color: #0B1F3B; margin-bottom: 20px;">🎯 Partner Pre-Screening Quiz Completed</h2>
    
    <div style="background: white; padding: 20px; border-radius: 6px; border-left: 4px solid #C62828;">
      <p><strong>Partner Name:</strong> ${partner.name}</p>
      <p><strong>Email:</strong> ${partner.email}</p>
      ${partner.phone ? `<p><strong>Phone:</strong> ${partner.phone}</p>` : ''}
      ${partner.market ? `<p><strong>Target Market:</strong> ${partner.market}</p>` : ''}
      <p><strong>Quiz Status:</strong> ✅ Passed</p>
    </div>

    <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 6px;">
      <p style="margin: 0; font-size: 14px;"><strong>Next Step:</strong> Review the partner application in your dashboard and schedule an interview if qualified.</p>
    </div>

    <p style="margin-top: 30px; font-size: 12px; color: #999;">
      This partner has completed the VTON pre-screening quiz and is ready for territory assessment.
    </p>
  </div>
</body>
</html>
      `,
    });

    return Response.json({ status: 'success', partner_name: partner.name });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});