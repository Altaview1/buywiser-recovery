import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Notifies admin when mailers are marked as delivered by Lob
 * Triggered by entity automation when lob_delivery_status changes to "delivered"
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const payload = await req.json();
    const { event, data } = payload;

    // Only process if this is a delivery status update to "delivered"
    if (!data || data.lob_delivery_status !== 'delivered') {
      return Response.json({ message: 'Not a delivery event' }, { status: 200 });
    }

    const leadName = `${data.first_name} ${data.last_name}`;
    const deliveryDate = data.lob_delivery_date ? new Date(data.lob_delivery_date).toLocaleDateString() : 'Today';

    // Send notification email
    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: `✓ Mailer Delivered - ${leadName}`,
      body: `
Hi ${user.full_name || 'Admin'},

A VTON welcome mailer has been successfully delivered by Lob:

📬 Lead: ${leadName}
📍 Address: ${data.property_address}, ${data.city}, ${data.state} ${data.zip_code}
📅 Delivered: ${deliveryDate}
💰 Cost: $${data.lob_estimated_cost ? data.lob_estimated_cost.toFixed(2) : 'N/A'}
🆔 Lob ID: ${data.lob_letter_id}

Next Steps:
• Lead may visit personalized landing page within 24-48 hours
• Monitor site_visits count in dashboard
• Follow up if no engagement within 7 days

View in Dashboard: https://app.buywiser.com/vton-mail-dashboard

Best regards,
VTON System
      `
    });

    return Response.json({ 
      success: true, 
      message: `Delivery notification sent for ${leadName}` 
    });

  } catch (error) {
    console.error('Batch delivery notification error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});