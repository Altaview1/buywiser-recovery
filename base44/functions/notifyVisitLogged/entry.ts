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

    // Build email content
    let emailBody = `
<h2>Field Visit Logged</h2>
<p><strong>${activator.name}</strong> logged a visit on ${visitTime}</p>

<h3>Lead Details</h3>
<ul>
  <li><strong>Name:</strong> ${fullName}</li>
  <li><strong>Address:</strong> ${lead.property_address}</li>
  <li><strong>Phone:</strong> ${lead.phone || 'N/A'}</li>
</ul>

<h3>Visit Outcome</h3>
<p><strong>Status:</strong> ${statusLabel}</p>
${visit.homeowner_name ? `<p><strong>Homeowner Name:</strong> ${visit.homeowner_name}</p>` : ''}
${visit.homeowner_phone ? `<p><strong>Homeowner Phone:</strong> ${visit.homeowner_phone}</p>` : ''}
${visit.code_scanned ? '<p><strong>✓ QR Code was scanned</strong></p>' : ''}
${visit.door_photo_url ? `<p><strong>Door Photo:</strong> <a href="${visit.door_photo_url}">View</a></p>` : ''}

<h3>Notes</h3>
<p>${visit.notes || '(No notes)'}</p>

${visit.callback_time ? `<p><strong>Callback Scheduled:</strong> ${new Date(visit.callback_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>` : ''}
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