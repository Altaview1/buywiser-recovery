import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@3.2.0';

/**
 * Daily count of CA VA-loan properties matching your import criteria.
 * Uses Purchase=0 (preview mode — free, no records billed).
 * Sends a concise email to the admin with the total count and trend.
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const PROPERTY_RADAR_API_KEY = Deno.env.get('PROPERTY_RADAR_API_KEY');
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const ADMIN_EMAIL = Deno.env.get('ADMIN_NOTIFICATION_EMAIL');

    if (!PROPERTY_RADAR_API_KEY) {
      return Response.json({ error: 'PROPERTY_RADAR_API_KEY not configured' }, { status: 500 });
    }

    // Use Purchase=0 (preview) and Limit=1 — we only need totalResultCount
    const response = await fetch(
      'https://api.propertyradar.com/v1/properties?Purchase=0&Limit=1&Fields=RadarID',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PROPERTY_RADAR_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Criteria: [
            { name: "State", value: ["CA"] },
            { name: "FirstLoanType", value: ["V"] },
            { name: "DaysOnMarket", value: [[1, 90]] },
            { name: "ListingStatus", value: ["Active"] }
          ]
        })
      }
    );

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`PropertyRadar API error: ${response.status} - ${responseText}`);
    }

    const data = JSON.parse(responseText);
    const totalCount = data.totalResultCount || 0;
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      timeZone: 'America/Los_Angeles'
    });

    console.log(`Daily CA VA property count: ${totalCount}`);

    // Send email if Resend and admin email are configured
    if (RESEND_API_KEY && ADMIN_EMAIL) {
      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: 'VTON Campaign <notifications@buywiser.com>',
        to: ADMIN_EMAIL,
        subject: `🏠 ${totalCount.toLocaleString()} CA VA Properties Available Today`,
        html: `
          <!DOCTYPE html>
          <html>
            <head><meta charset="utf-8"></head>
            <body style="font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 30px;">
              <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 30px; text-align: center;">
                  <div style="font-size: 48px; margin-bottom: 8px;">🏠</div>
                  <h1 style="color: white; margin: 0; font-size: 20px;">Daily VA Listings Count</h1>
                  <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0 0; font-size: 14px;">${today}</p>
                </div>
                <div style="padding: 30px; text-align: center;">
                  <div style="font-size: 72px; font-weight: bold; color: #1e40af; line-height: 1;">${totalCount.toLocaleString()}</div>
                  <div style="font-size: 16px; color: #64748b; margin-top: 8px;">Active CA properties with VA loans<br>listed 1–90 days on market</div>
                  <div style="margin-top: 24px; padding: 16px; background: #f1f5f9; border-radius: 8px; text-align: left; font-size: 14px; color: #475569;">
                    <strong>Filters applied:</strong><br>
                    State: California (CA)<br>
                    Loan Type: VA<br>
                    Listing Status: Active<br>
                    Days on Market: 1–90
                  </div>
                </div>
                <div style="padding: 16px 30px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9;">
                  Automated daily snapshot · Preview mode (no charge) · VTON Campaign
                </div>
              </div>
            </body>
          </html>
        `
      });
    }

    return Response.json({
      status: 'success',
      date: today,
      totalCount,
      filters: {
        state: 'CA',
        loanType: 'VA',
        listingStatus: 'Active',
        daysOnMarket: '1-90'
      },
      note: 'Preview mode — no records billed'
    });

  } catch (error) {
    console.error('dailyPropertyRadarCount error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});