import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowRight, Search } from "lucide-react";

const TIMELINES = ["0-3 months", "3-6 months", "6-12 months", "Just exploring"];
const AGENT_STATUS = ["No", "Not yet", "Yes"];

export default function RebateLeadForm({ onSuccess, compact = false }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    property_link: "", property_address: "", desired_area: "",
    approximate_purchase_price: "",
    purchase_timeline: "", working_with_agent: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleStep1 = (e) => {
    e.preventDefault();
    setStep(2);
  };

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

    await base44.functions.invoke("sendSMS", {
      message: `🏠 New Buyer Rebate Lead!\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nProperty: ${form.property_link || form.property_address || "N/A"}\nArea: ${form.desired_area || "N/A"}\nTimeline: ${form.purchase_timeline || "N/A"}`,
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
    <div>
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-6">
        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${step === 1 ? "bg-slate-900 text-white" : "bg-green-500 text-white"}`}>
          {step > 1 ? "✓" : "1"}
        </div>
        <span className={`text-xs font-semibold ${step === 1 ? "text-slate-900" : "text-slate-400"}`}>Property</span>
        <div className="flex-1 h-px bg-slate-200" />
        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${step === 2 ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-400"}`}>
          2
        </div>
        <span className={`text-xs font-semibold ${step === 2 ? "text-slate-900" : "text-slate-400"}`}>Your Info</span>
      </div>

      {/* Step 1 — Property */}
      {step === 1 && (
        <form onSubmit={handleStep1} className="space-y-4">
          <div>
            <label className={labelCls}>
              <Search className="inline h-3.5 w-3.5 mr-1 mb-0.5" />
              Property Link or Address
              <span className="font-normal normal-case text-slate-400 ml-1">(Zillow, Redfin, Realtor.com, or address)</span>
            </label>
            <input
              className={inputCls}
              placeholder="https://www.zillow.com/... or 123 Main St, Glendale CA"
              value={form.property_link || form.property_address}
              onChange={e => {
                const v = e.target.value;
                if (v.startsWith("http")) { set("property_link", v); set("property_address", ""); }
                else { set("property_address", v); set("property_link", ""); }
              }}
            />
          </div>

          <div className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
            <div>
              <label className={labelCls}>Desired Purchase Area</label>
              <input className={inputCls} placeholder="e.g. Pasadena, Burbank, LA" value={form.desired_area} onChange={e => set("desired_area", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Approx. Purchase Price</label>
              <input className={inputCls} placeholder="$750,000" value={form.approximate_purchase_price} onChange={e => set("approximate_purchase_price", e.target.value)} />
            </div>
          </div>

          <div className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
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

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-bold text-base text-white transition flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}
          >
            Check Eligibility <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-xs text-slate-400 text-center">No cost. No obligation.</p>
        </form>
      )}

      {/* Step 2 — Contact Info */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-2">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-0.5">Property</p>
            <p className="text-sm text-slate-700 truncate">{form.property_link || form.property_address || form.desired_area || "Not specified"}</p>
            <button type="button" onClick={() => setStep(1)} className="text-xs text-blue-600 hover:underline mt-0.5">Edit</button>
          </div>

          <p className="text-sm font-semibold text-slate-700">Where should we send your eligibility results?</p>

          <div className={`grid gap-4 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
            <div className="sm:col-span-2">
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
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-base text-white transition flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <>Send My Results <ArrowRight className="h-4 w-4" /></>}
          </button>
          <p className="text-xs text-slate-400 text-center">No cost. No obligation. Your information is never sold.</p>
        </form>
      )}
    </div>
  );
}