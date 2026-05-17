import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const bodyData = await req.json();

    const { created, duplicates, total, errors } = bodyData;
    const adminEmail = Deno.env.get('ADMIN_NOTIFICATION_EMAIL');

    if (!adminEmail) {
      console.warn('ADMIN_NOTIFICATION_EMAIL not configured');
      return Response.json({ status: 'skipped', reason: 'No admin email configured' });
    }

    const errorDetails = errors.length > 0
      ? `\n\nErrors encountered:\n${errors.map(e => `- ${e.property}: ${e.error}`).join('\n')}`
      : '';

    const emailBody = `
PropertyRadar Import Summary
============================

Opportunities Created: ${created}
Duplicates Skipped: ${duplicates}
Total Properties Processed: ${total}

Import Status: ${created > 0 ? '✅ Success - Opportunities assigned to partners' : '⚠️ No new opportunities created'}
${errorDetails}

Timestamp: ${new Date().toISOString()}
    `;

    await base44.integrations.Core.SendEmail({
      to: adminEmail,
      subject: `PropertyRadar Import: ${created} new opportunity(ies) created`,
      body: emailBody
    });

    return Response.json({ status: 'success', notified: adminEmail });
  } catch (error) {
    console.error('Notification error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});