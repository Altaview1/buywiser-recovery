import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import { Resend } from 'npm:resend@3.2.0';

/**
 * Daily CA VA property count — queries both:
 *   1. Total active pool (1–90 DOM)
 *   2. New listings today (0–1 DOM)
 * Uses Purchase=0 (preview mode — free, no records billed).
 * Saves a daily snapshot record and emails the admin.
 */

async function queryCount(apiKey, domRange) {
  const response = await fetch(
    'https://api.propertyradar.com/v1/properties?Purchase=0&Limit=1&Fields=RadarID',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        Criteria: [
          { name: "State", value: ["CA"] },
          { name: "FirstLoanType", value: ["V"] },
          { name: "DaysOnMarket", value: [domRange] },
          { name: "ListingStatus", value: ["Active"] }
        ]
      })
    }
  );
  const text = await response.text();
  if (!response.ok) throw new Error(`PropertyRadar API error: ${response.status} - ${text}`);
  const data = JSON.parse(text);
  return data.totalResultCount || 0;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const PROPERTY_RADAR_API_KEY = Deno.env.get('PROPERTY_RADAR_API_KEY');
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const ADMIN_EMAIL = Deno.env.get('ADMIN_NOTIFICATION_EMAIL');

    if (!PROPERTY_RADAR_API_KEY) {
      return Response.json({ error: 'PROPERTY_RADAR_API_KEY not configured' }, { status: 500 });
    }

    // Run both queries in parallel
    const [totalPool, newListings] = await Promise.all([
      queryCount(PROPERTY_RADAR_API_KEY, [1, 90]),
      queryCount(PROPERTY_RADAR_API_KEY, [0, 1])
    ]);

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Save snapshot — skip if one already exists for today
    const existing = await base44.asServiceRole.entities.PropertyRadarDailySnapshot.filter({ snapshot_date: today });
    if (existing.length === 0) {
      await base44.asServiceRole.entities.PropertyRadarDailySnapshot.create({
        snapshot_date: today,
        total_pool_count: totalPool,
        new_listings_count: newListings
      });
    } else {
      await base44.asServiceRole.entities.PropertyRadarDailySnapshot.update(existing[0].id, {
        total_pool_count: totalPool,
        new_listings_count: newListings
      });
    }

    console.log(`Snapshot saved — Total pool: ${totalPool} | New today: ${newListings}`);

    // Send email
    if (RESEND_API_KEY && ADMIN_EMAIL) {
      const resend = new Resend(RESEND_API_KEY);
      const dateLabel = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        timeZone: 'America/Los_Angeles'
      });
      await resend.emails.send({
        from: 'VTON Campaign <notifications@buywiser.com>',
        to: ADMIN_EMAIL,
        subject: `🏠 Daily VA Listings — ${newListings} new · ${totalPool.toLocaleString()} total pool`,
        html: `
          <!DOCTYPE html><html><head><meta charset="utf-8"></head>
          <body style="font-family: Arial, sans-serif; background: #f8fafc; margin: 0; padding: 30px;">
            <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <div style="background: linear-gradient(135deg, #1e3a8a, #3b82f6); padding: 28px 30px; text-align: center;">
                <div style="font-size: 40px; margin-bottom: 6px;">🏠</div>
                <h1 style="color: white; margin: 0; font-size: 20px;">Daily CA VA Listings Snapshot</h1>
                <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0 0; font-size: 13px;">${dateLabel}</p>
              </div>
              <div style="padding: 28px 30px; display: flex; gap: 16px;">
                <div style="flex: 1; text-align: center; background: #eff6ff; border-radius: 10px; padding: 20px;">
                  <div style="font-size: 52px; font-weight: bold; color: #2563eb; line-height: 1;">${newListings}</div>
                  <div style="font-size: 13px; color: #64748b; margin-top: 6px;">New listings today<br><span style="font-size: 11px;">(0–1 days on market)</span></div>
                </div>
                <div style="flex: 1; text-align: center; background: #f0fdf4; border-radius: 10px; padding: 20px;">
                  <div style="font-size: 52px; font-weight: bold; color: #16a34a; line-height: 1;">${totalPool.toLocaleString()}</div>
                  <div style="font-size: 13px; color: #64748b; margin-top: 6px;">Total active pool<br><span style="font-size: 11px;">(1–90 days on market)</span></div>
                </div>
              </div>
              <div style="padding: 0 30px 20px; font-size: 12px; color: #94a3b8; background: #f8fafc; border-top: 1px solid #f1f5f9; padding-top: 14px; text-align: center;">
                CA · VA Loan · Active Listings · Preview mode (no charge)
              </div>
            </div>
          </body></html>
        `
      });
    }

    return Response.json({
      status: 'success',
      date: today,
      new_listings_count: newListings,
      total_pool_count: totalPool,
      note: 'Preview mode — no records billed'
    });

  } catch (error) {
    console.error('dailyPropertyRadarCount error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});