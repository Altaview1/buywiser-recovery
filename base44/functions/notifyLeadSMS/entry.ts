import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import twilio from 'npm:twilio@4.19.3';

const ADMIN_PHONE = Deno.env.get("BENNETT_PHONE");
const TWILIO_SID = Deno.env.get("TWILIO_ACCOUNT_SID");
const TWILIO_TOKEN = Deno.env.get("TWILIO_AUTH_TOKEN");
const TWILIO_FROM = Deno.env.get("TWILIO_FROM_NUMBER");

function formatPhoneNumber(phone) {
  if (!phone) return null;
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) return `+1${cleaned}`;
  if (cleaned.length === 11) return `+${cleaned}`;
  return `+${cleaned}`;
}

async function sendSMS(to, body) {
  if (!to || !TWILIO_SID || !TWILIO_TOKEN || !TWILIO_FROM) return;
  try {
    const formattedTo = formatPhoneNumber(to);
    const client = twilio(TWILIO_SID, TWILIO_TOKEN);
    await client.messages.create({ from: TWILIO_FROM, to: formattedTo, body });
  } catch (err) {
    console.error("SMS error:", err.message);
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    // Called by entity automation — no user auth required
    const payload = await req.json();
    const { event, data: lead } = payload;

    // Handle both create and update events
    if (!lead || (event && event.type !== 'create' && event.type !== 'update')) {
      return Response.json({ skipped: true });
    }

    const leadName = lead.name || "New Lead";
    const leadEmail = lead.email || "No email";
    const leadPhone = lead.phone || "No phone";
    const assignedAgent = lead.assigned_agent || null;

    let agentPhone = null;

    // Look up agent phone if assigned
    if (assignedAgent) {
      const agents = await base44.asServiceRole.entities.PartnerApplication.filter({ 
        name: assignedAgent,
        status: "approved" 
      });
      if (agents.length > 0) {
        agentPhone = agents[0].phone || null;
      }
    }

    const smsBody = `🔔 New Lead: ${leadName}\n📧 ${leadEmail}\n📞 ${leadPhone}`;

    // Send to admin
    if (ADMIN_PHONE) {
      await sendSMS(ADMIN_PHONE, smsBody);
    }

    // Send to assigned agent if available
    if (agentPhone) {
      await sendSMS(agentPhone, `New Lead Assigned: ${leadName}\n📧 ${leadEmail}\n📞 ${leadPhone}`);
    }

    return Response.json({ success: true, admin: ADMIN_PHONE, agent: agentPhone });
  } catch (error) {
    console.error("notifyLeadSMS error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});