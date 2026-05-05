import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { visit, lead, activator } = await req.json();

    if (!visit || !lead || !activator) {
      return Response.json({ error: 'Missing required data' }, { status: 400 });
    }

    const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
    const statusLabel = visit.status.replace(/_/g, ' ').toUpperCase();
    const visitTime = new Date(visit.visit_date).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    // Status color coding for email
    const statusColor = visit.status === 'spoke_homeowner' || visit.status === 'code_scanned' ? '#10b981' :
                       visit.status === 'callback_scheduled' ? '#3b82f6' : '#f59e0b';

    // Build comprehensive email content
    let emailBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 8px;">
  <div style="background: white; border-left: 4px solid ${statusColor}; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
    <h2 style="margin: 0 0 10px 0; color: #0f172a;">Field Visit Logged</h2>
    <p style="margin: 0; color: #64748b; font-size: 14px;">${visitTime} • Rep: <strong>${activator.name}</strong></p>
  </div>

  <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
    <h3 style="margin: 0 0 15px 0; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">📍 Lead Details</h3>
    <table style="width: 100%; font-size: 14px;">
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b; width: 120px;"><strong>Name:</strong></td>
        <td style="padding: 8px 0; color: #0f172a;">${fullName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b;"><strong>Address:</strong></td>
        <td style="padding: 8px 0; color: #0f172a;">${lead.property_address}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b;"><strong>Phone:</strong></td>
        <td style="padding: 8px 0; color: #0f172a;"><a href="tel:${lead.phone}" style="color: #2563eb; text-decoration: none;">${lead.phone || 'N/A'}</a></td>
      </tr>
      ${lead.estimated_price ? `<tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px 0; color: #64748b;"><strong>Est. Value:</strong></td>
        <td style="padding: 8px 0; color: #0f172a;">$${(lead.estimated_price/1000).toFixed(0)}K</td>
      </tr>` : ''}
    </table>
  </div>

  <div style="background: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
    <h3 style="margin: 0 0 15px 0; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">✓ Visit Outcome</h3>
    <div style="background: ${statusColor}; color: white; padding: 12px; border-radius: 6px; margin-bottom: 15px; font-weight: bold; text-align: center;">
      ${statusLabel}
    </div>
    
    ${visit.homeowner_name ? `<p style="margin: 10px 0; color: #0f172a;"><strong>Homeowner Name:</strong> ${visit.homeowner_name}</p>` : ''}
    ${visit.homeowner_phone ? `<p style="margin: 10px 0; color: #0f172a;"><strong>Homeowner Phone:</strong> <a href="tel:${visit.homeowner_phone}" style="color: #2563eb; text-decoration: none;">${visit.homeowner_phone}</a></p>` : ''}
    ${visit.code_scanned ? '<p style="margin: 10px 0; color: #10b981;"><strong>✓ QR Code Scanned</strong> - Confirmed interaction</p>' : ''}
    ${visit.callback_time ? `<p style="margin: 10px 0; color: #0f172a;"><strong>📅 Callback Scheduled:</strong> ${new Date(visit.callback_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>` : ''}
  </div>

  ${visit.notes ? `<div style="background: #f1f5f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
    <h3 style="margin: 0 0 10px 0; color: #1e293b;">Notes from Rep</h3>
    <p style="margin: 0; color: #0f172a; white-space: pre-wrap; word-wrap: break-word;">${visit.notes}</p>
  </div>` : ''}

  ${visit.door_photo_url ? `<div style="background: white; padding: 20px; border-radius: 6px;">
    <h3 style="margin: 0 0 15px 0; color: #1e293b;">📸 Door Photo</h3>
    <a href="${visit.door_photo_url}" style="color: #2563eb; text-decoration: none; font-weight: bold;">View Full Photo</a>
  </div>` : ''}
</div>
    `;

    // Get admin phone from app settings (using Bennett's number for now)
    const adminPhone = process.env.BENNETT_PHONE;

    // Send SMS to admin if phone available
    if (adminPhone) {
      await base44.functions.invoke('sendSMS', {
        phone: adminPhone,
        message: `🚪 Visit logged: ${fullName} in ${lead.property_address} - Status: ${statusLabel}. Check portal for details.`,
      });
    }

    // Send email to Bennett
    await base44.integrations.Core.SendEmail({
      to: 'bennett@buywiser.com',
      subject: `Field Visit Logged: ${fullName} - ${statusLabel}`,
      body: emailBody,
      from_name: 'Field Activation Manager',
    });

    return Response.json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});