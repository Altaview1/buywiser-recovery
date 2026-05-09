import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowRight } from "lucide-react";

export default function RebateLeadForm({ onSuccess, compact = false }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    property_link: "", property_address: "", desired_area: "",
    approximate_purchase_price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill in your name, email, and phone.");
      return;
    }
    setError("");
    setLoading(true);

    const params = new URLSearchParams(window.location.search);

    await base44.entities.BuyerRebateLead.create({
      ...form,
      approximate_purchase_price: form.approximate_purchase_price
        ? Number(form.approximate_purchase_price.replace(/[^0-9]/g, ""))
        : undefined,
      lead_category: "GENERAL_BUYER_REBATE",
      status: "new",
      source_campaign: params.get("utm_campaign") || "",
      source_platform: params.get("utm_source") || params.get("utm_medium") || "",
      source_geography: params.get("utm_geo") || "",
      referring_ad_source: params.get("ref") || document.referrer || "",
    });

    const priceNum = form.approximate_purchase_price
      ? Number(form.approximate_purchase_price.replace(/[^0-9]/g, ""))
      : null;
    const estimatedRebate = priceNum ? Math.round(priceNum * 0.015).toLocaleString("en-US") : null;
    const property = form.property_link || form.property_address || form.desired_area || "the property you submitted";

    // Prospect follow-up email
    await base44.integrations.Core.SendEmail({
      to: form.email,
      from_name: "BuyWiser Rebate",
      subject: estimatedRebate ? `Your CA Homebuyers Rebate — Up to $${estimatedRebate} | Next Steps` : `Your CA Homebuyers Rebate Check — Next Steps`,
      body: `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:30px 0;"><tr><td align="center"><table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;"><tr><td style="background:#0B1F3B;padding:16px 32px;"><p style="margin:0;color:#ffffff;font-size:10px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;">California Homebuyers Rebate Program</p></td></tr><tr><td style="padding:36px 32px 24px;"><h1 style="margin:0 0 8px;font-size:28px;font-weight:900;color:#0B1F3B;">Congratulations, ${form.name.split(" ")[0]}!</h1><p style="margin:0 0 24px;color:#555;font-size:15px;">Your CA Homebuyers Rebate inquiry has been received.</p>${estimatedRebate ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;"><tr><td style="background:#0B1F3B;border:3px solid #c9a84c;border-radius:8px;padding:28px;text-align:center;"><p style="margin:0 0 6px;color:#c9a84c;font-size:10px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;">Your Estimated Rebate Value</p><p style="margin:0 0 4px;color:#ffffff;font-size:52px;font-weight:900;line-height:1;">$${estimatedRebate}</p><p style="margin:0;color:#8899bb;font-size:13px;">on ${property}</p></td></tr></table>` : `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;"><tr><td style="background:#0B1F3B;border:3px solid #c9a84c;border-radius:8px;padding:28px;text-align:center;"><p style="margin:0 0 6px;color:#c9a84c;font-size:10px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;">Your CA Homebuyers Rebate</p><p style="margin:0 0 4px;color:#ffffff;font-size:36px;font-weight:900;line-height:1;">Up To $15,000</p><p style="margin:0;color:#8899bb;font-size:13px;">on ${property}</p></td></tr></table>`}<h2 style="margin:0 0 12px;font-size:16px;font-weight:bold;color:#0B1F3B;border-bottom:2px solid #f0f0f0;padding-bottom:8px;">What Happens Next</h2><table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td style="padding:10px 0;border-bottom:1px solid #f5f5f5;vertical-align:top;width:28px;"><span style="display:inline-block;width:22px;height:22px;background:#0B1F3B;border-radius:50%;color:#fff;font-size:11px;font-weight:bold;text-align:center;line-height:22px;">1</span></td><td style="padding:10px 0 10px 10px;border-bottom:1px solid #f5f5f5;color:#444;font-size:14px;"><strong>Bennett will review your property</strong> and confirm rebate eligibility — usually within one business day.</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #f5f5f5;vertical-align:top;width:28px;"><span style="display:inline-block;width:22px;height:22px;background:#0B1F3B;border-radius:50%;color:#fff;font-size:11px;font-weight:bold;text-align:center;line-height:22px;">2</span></td><td style="padding:10px 0 10px 10px;border-bottom:1px solid #f5f5f5;color:#444;font-size:14px;"><strong>You'll receive a call or text</strong> at ${form.phone} to go over your exact rebate amount and how it's applied at closing.</td></tr><tr><td style="padding:10px 0;vertical-align:top;width:28px;"><span style="display:inline-block;width:22px;height:22px;background:#0B1F3B;border-radius:50%;color:#fff;font-size:11px;font-weight:bold;text-align:center;line-height:22px;">3</span></td><td style="padding:10px 0 10px 10px;color:#444;font-size:14px;"><strong>We coordinate everything</strong> — touring access, offer strategy, financing, and your rebate at closing.</td></tr></table><table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;"><tr><td align="center"><a href="tel:+18183002642" style="display:inline-block;background:#0B1F3B;color:#ffffff;font-size:15px;font-weight:bold;padding:14px 36px;border-radius:8px;text-decoration:none;">Call Bennett Now — (818) 300-2642</a></td></tr></table><p style="margin:0;color:#888;font-size:12px;text-align:center;">Questions? Reply to this email or call <a href="tel:+18183002642" style="color:#0B1F3B;">(818) 300-2642</a></p></td></tr><tr><td style="background:#f8f8f8;border-top:1px solid #eee;padding:16px 32px;text-align:center;"><p style="margin:0 0 4px;color:#aaa;font-size:11px;">BuyWiser Technology, Inc. DBA BuyWiser Home Loans</p><p style="margin:0;color:#aaa;font-size:11px;">NMLS #1887767 · CA DRE #01107013 · Private program, not a government benefit. Rebate subject to eligibility.</p></td></tr></table></td></tr></table></body></html>`,
    }).catch(() => {});

    // Admin notifications
    await base44.functions.invoke("sendSMS", {
      message: `🏠 New Buyer Rebate Lead!\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nProperty: ${form.property_link || form.property_address || form.desired_area || "N/A"}\nPrice: ${form.approximate_purchase_price || "N/A"}`,
    }).catch(() => {});

    await base44.integrations.Core.SendEmail({
      to: "bennett@buywiser.com",
      from_name: "Buywiser Buyer Leads",
      subject: `🏠 New Buyer Rebate Lead — ${form.name}`,
      body: `New General Buyer Rebate Lead\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nProperty: ${form.property_link || form.property_address || "N/A"}\nArea: ${form.desired_area || "N/A"}\nPrice: ${form.approximate_purchase_price || "N/A"}\nSource: ${params.get("utm_source") || document.referrer || "direct"}`,
    }).catch(() => {});

    setLoading(false);
    onSuccess && onSuccess(form);
  };

  const inputCls = "w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition bg-white";
  const labelCls = "block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Property */}
      <div>
        <label className={labelCls}>Property Link or Address</label>
        <input
          className={inputCls}
          placeholder="Paste a Zillow/Redfin link, or enter a city and price range"
          value={form.property_link || form.property_address || form.desired_area}
          onChange={e => {
            const v = e.target.value;
            if (v.startsWith("http")) { set("property_link", v); set("property_address", ""); set("desired_area", ""); }
            else { set("property_address", v); set("desired_area", v); set("property_link", ""); }
          }}
        />
      </div>

      <div>
        <label className={labelCls}>Approx. Purchase Price <span className="font-normal normal-case text-slate-400">(optional)</span></label>
        <input className={inputCls} placeholder="e.g. $750,000" value={form.approximate_purchase_price} onChange={e => set("approximate_purchase_price", e.target.value)} />
      </div>

      <hr className="border-slate-100" />

      {/* Contact */}
      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"}`}>
        <div>
          <label className={labelCls}>Full Name *</label>
          <input className={inputCls} placeholder="Jane Smith" value={form.name} onChange={e => set("name", e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input type="email" className={inputCls} placeholder="jane@email.com" value={form.email} onChange={e => set("email", e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Phone *</label>
          <input type="tel" className={inputCls} placeholder="(818) 555-0100" value={form.phone} onChange={e => set("phone", e.target.value)} required />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl font-bold text-base text-white transition flex items-center justify-center gap-2 disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}
      >
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <>Check Eligibility <ArrowRight className="h-4 w-4" /></>}
      </button>

      <p className="text-xs text-slate-400 text-center">No cost. No obligation. Your information is never sold.</p>
    </form>
  );
}