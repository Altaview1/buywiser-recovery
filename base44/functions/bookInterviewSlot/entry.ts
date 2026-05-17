import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }
    const payload = await req.json();
    const { partner_email, partner_name, partner_phone } = payload;

    if (!partner_email || !partner_name) {
      return Response.json({ error: 'Missing partner details' }, { status: 400 });
    }

    // Get Google Calendar access token
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlecalendar');

    // Find next available 30-min slot (starting tomorrow, 10am-4pm, avoiding weekends)
    const now = new Date();
    let slotDate = new Date(now);
    slotDate.setDate(slotDate.getDate() + 1);
    slotDate.setHours(10, 0, 0, 0);

    // Skip weekends
    while (slotDate.getDay() === 0 || slotDate.getDay() === 6) {
      slotDate.setDate(slotDate.getDate() + 1);
    }

    // Fetch calendar events for the week to find available slots
    const timeMin = slotDate.toISOString();
    const timeMax = new Date(slotDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const eventsRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&maxResults=100`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!eventsRes.ok) {
      return Response.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
    }

    const { items: existingEvents } = await eventsRes.json();
    const bookedTimes = new Set();
    existingEvents?.forEach(event => {
      if (event.start?.dateTime) {
        bookedTimes.add(new Date(event.start.dateTime).getTime());
      }
    });

    // Find first available 30-min slot between 10am-4pm on weekdays
    let slotStart = new Date(slotDate);
    let found = false;

    for (let d = 0; d < 7; d++) {
      if (slotStart.getDay() === 0 || slotStart.getDay() === 6) {
        slotStart.setDate(slotStart.getDate() + 1);
        slotStart.setHours(10, 0, 0, 0);
        continue;
      }

      for (let h = 10; h < 16; h++) {
        slotStart.setHours(h, 0, 0, 0);
        const slotTime = slotStart.getTime();

        if (!bookedTimes.has(slotTime)) {
          found = true;
          break;
        }
      }

      if (found) break;
      slotStart.setDate(slotStart.getDate() + 1);
      slotStart.setHours(10, 0, 0, 0);
    }

    if (!found) {
      return Response.json({ error: 'No available slots found' }, { status: 400 });
    }

    const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);

    // Create calendar event
    const event = {
      summary: `VTON Partner Interview - ${partner_name}`,
      description: `Pre-screening interview for VTON partner.\n\nAgent: ${partner_name}\nEmail: ${partner_email}${partner_phone ? `\nPhone: ${partner_phone}` : ''}`,
      start: {
        dateTime: slotStart.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: slotEnd.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      attendees: [
        { email: partner_email, displayName: partner_name, responseStatus: 'needsAction' }
      ],
      conferenceData: {
        createRequest: {
          requestId: `vton-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        }
      },
    };

    const createRes = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    );

    if (!createRes.ok) {
      const error = await createRes.text();
      console.error('Calendar API error:', error);
      return Response.json({ error: 'Failed to create calendar event' }, { status: 500 });
    }

    const createdEvent = await createRes.json();

    // Update partner record with interview scheduled
    const partners = await base44.asServiceRole.entities.PartnerApplication.filter({ email: partner_email });
    if (partners.length > 0) {
      await base44.asServiceRole.entities.PartnerApplication.update(partners[0].id, {
        interview_scheduled: true,
        interview_date: slotStart.toISOString(),
      });
    }

    // Send confirmation email to partner
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'VTON Partnership — Interview Scheduled',
      to: partner_email,
      subject: `Your VTON Partner Interview is Scheduled`,
      body: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1e293b;">
          <div style="background:#0B1F3B;padding:20px 24px;border-radius:8px 8px 0 0;">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" style="height:30px;" />
            <p style="margin:8px 0 0;font-size:10px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.5);">VTON Partnership Interview Confirmation</p>
          </div>
          <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
            <p style="font-size:16px;font-weight:700;color:#0B1F3B;margin:0 0 4px;">Interview Scheduled ✓</p>
            <p style="font-size:13px;color:#64748b;margin:0 0 20px;">Congratulations on passing the VTON pre-screening quiz! Your partnership interview has been confirmed.</p>

            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #0B1F3B;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
              <table style="width:100%;border-collapse:collapse;font-size:14px;">
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;">Date & Time</td>
                  <td style="padding:5px 0;font-weight:600;color:#0f172a;">${slotStart.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'America/Los_Angeles' })} PT</td>
                </tr>
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;">Duration</td>
                  <td style="padding:5px 0;color:#0f172a;">30 minutes</td>
                </tr>
                <tr>
                  <td style="padding:5px 12px 5px 0;color:#64748b;">Format</td>
                  <td style="padding:5px 0;color:#0f172a;">Google Meet video interview</td>
                </tr>
              </table>
            </div>

            <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:14px 18px;margin-bottom:20px;">
              <p style="margin:0 0 8px;font-size:11px;font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#3b82f6;">Next Steps</p>
              <ul style="margin:0;padding-left:20px;color:#1e40af;font-size:13px;line-height:1.6;">
                <li>Check your email for a Google Calendar invitation</li>
                <li>Click the Google Meet link 5 minutes before your interview time</li>
                <li>Have your territory preferences and questions ready</li>
                <li>Interview will cover territory fit, experience, and VTON expectations</li>
              </ul>
            </div>

            <p style="font-size:13px;color:#475569;line-height:1.6;">If you need to reschedule, reply to this email or contact <strong>bennett@buywiser.com</strong> as soon as possible.</p>
          </div>
          <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:12px;">BuyWiser Technology, Inc. · NMLS #1887767</p>
        </div>
      `,
    });

    console.log(`Interview scheduled for ${partner_name} (${partner_email}) at ${slotStart.toISOString()}`);
    return Response.json({
      success: true,
      interview_time: slotStart.toISOString(),
      meet_link: createdEvent.conferenceData?.entryPoints?.[0]?.uri || null,
    });
  } catch (error) {
    console.error('bookInterviewSlot error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});