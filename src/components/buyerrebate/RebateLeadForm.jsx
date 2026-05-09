import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";

const TIMELINES = ["0-3 months", "3-6 months", "6-12 months", "Just exploring"];
const AGENT_STATUS = ["No", "Not yet", "Yes"];

export default function RebateLeadForm({ onSuccess, compact = false }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    property_link: "", property_address: "", desired_area: "",
    approximate_purchase_price: "",
    purchase_timeline: "", working_with_agent: "",
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

    const lead = await base44.entities.BuyerRebateLead.create({
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

    // Notify admin via SMS + email
    await base44.functions.invoke("sendSMS", {
      message: `🏠 New Buyer Rebate Lead!\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nArea: ${form.desired_area || "N/A"}\nTimeline: ${form.purchase_timeline || "N/A"}`,
    }).catch(() => {});

    await base44.integrations.Core.SendEmail({
      to: "bennett@buywiser.com",
      from_name: "Buywiser Buyer Leads",
      subject: `🏠 New Buyer Rebate Lead — ${form.name}`,
      body: `New General Buyer Rebate Lead\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nProperty: ${form.property_link || form.property_address || "N/A"}\nArea: ${form.desired_area || "N/A"}\nPrice: ${form.approximate_purchase_price || "N/A"}\nTimeline: ${form.purchase_timeline || "N/A"}\nAgent: ${form.working_with_agent || "N/A"}\nSource: ${params.get("utm_source") || document.referrer || "direct"}`,
    }).catch(() => {});

    setLoading(false);
    onSuccess && onSuccess(form);
  };

  const inputCls = "w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition bg-white";
  const labelCls = "block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
        <div>
          <label className={labelCls}>Full Name *</label>
          <input className={inputCls} placeholder="Jane Smith" value={form.name} onChange={e => set("name", e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Email Address *</label>
          <input type="email" className={inputCls} placeholder="jane@email.com" value={form.email} onChange={e => set("email", e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Mobile Phone *</label>
          <input type="tel" className={inputCls} placeholder="(818) 555-0100" value={form.phone} onChange={e => set("phone", e.target.value)} required />
        </div>
        <div>
          <label className={labelCls}>Desired Purchase Area</label>
          <input className={inputCls} placeholder="e.g. Pasadena, Burbank, LA" value={form.desired_area} onChange={e => set("desired_area", e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Property Link or Address <span className="font-normal normal-case text-slate-400">(Zillow, Redfin, Realtor.com, or address)</span></label>
        <input className={inputCls} placeholder="https://www.zillow.com/... or 123 Main St, Glendale CA" value={form.property_link || form.property_address} onChange={e => {
          const v = e.target.value;
          if (v.startsWith("http")) { set("property_link", v); set("property_address", ""); }
          else { set("property_address", v); set("property_link", ""); }
        }} />
      </div>

      <div className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"}`}>
        <div>
          <label className={labelCls}>Approx. Purchase Price</label>
          <input className={inputCls} placeholder="$750,000" value={form.approximate_purchase_price} onChange={e => set("approximate_purchase_price", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Purchase Timeline</label>
          <select className={inputCls} value={form.purchase_timeline} onChange={e => set("purchase_timeline", e.target.value)}>
            <option value="">Select...</option>
            {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Working With An Agent?</label>
          <select className={inputCls} value={form.working_with_agent} onChange={e => set("working_with_agent", e.target.value)}>
            <option value="">Select...</option>
            {AGENT_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
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