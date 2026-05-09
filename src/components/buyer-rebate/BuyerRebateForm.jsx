import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";

const timelines = ["ASAP", "1-3 months", "3-6 months", "6-12 months", "Just exploring"];
const agentOptions = ["No", "Not yet", "Yes"];

export default function BuyerRebateForm({ onSuccess, compact = false }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    property_link: "", property_address: "",
    desired_area: "", approximate_purchase_price: "",
    purchase_timeline: "", working_with_agent: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // UTM / source params
    const params = new URLSearchParams(window.location.search);
    const sourceData = {
      source_platform: params.get("utm_source") || params.get("source") || "organic",
      source_campaign: params.get("utm_campaign") || "",
      source_geography: params.get("utm_geo") || "",
      referring_ad_source: params.get("utm_medium") || params.get("ad_source") || "",
      lead_category: "GENERAL_BUYER_REBATE",
    };

    await base44.entities.BuyerRebateLead.create({
      ...form,
      ...sourceData,
      approximate_purchase_price: form.approximate_purchase_price
        ? Number(String(form.approximate_purchase_price).replace(/[^0-9]/g, ""))
        : undefined,
      status: "new",
    });

    // Notify Bennett
    await base44.functions.invoke("sendSMS", {
      message: `🏡 New Buyer Rebate Lead!\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nArea: ${form.desired_area || "N/A"}\nAgent: ${form.working_with_agent || "N/A"}\nTimeline: ${form.purchase_timeline || "N/A"}`,
    }).catch(() => {});

    await base44.integrations.Core.SendEmail({
      to: "bennett@buywiser.com",
      from_name: "Buywiser Buyer Rebate",
      subject: `🏡 New Buyer Rebate Inquiry — ${form.name}`,
      body: `New buyer rebate lead submitted.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nProperty Link: ${form.property_link || "N/A"}\nProperty Address: ${form.property_address || "N/A"}\nDesired Area: ${form.desired_area || "N/A"}\nEst. Price: ${form.approximate_purchase_price || "N/A"}\nTimeline: ${form.purchase_timeline || "N/A"}\nHas Agent: ${form.working_with_agent || "N/A"}\n\nSource: ${sourceData.source_platform} / ${sourceData.source_campaign}`,
    }).catch(() => {});

    setLoading(false);
    setSubmitted(true);
    onSuccess?.();
  };

  if (submitted) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-7 w-7 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Your Property Check Has Been Submitted</h3>
        <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto mb-5">
          Buywiser will review your property and buyer situation to determine whether you may qualify for cash back, rebate, or GAP Benefit savings.
        </p>
        <a
          href="tel:+18183002642"
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition"
        >
          Schedule A Buyer Benefit Call
        </a>
        <p className="text-xs text-slate-400 mt-3">(818) 300-2642 · No obligation</p>
      </div>
    );
  }

  const inputCls = "w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition bg-white";
  const labelCls = "block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input required className={inputCls} placeholder="Jane Smith" value={form.name} onChange={set("name")} />
        </div>
        <div>
          <label className={labelCls}>Mobile Phone *</label>
          <input required type="tel" className={inputCls} placeholder="(818) 555-0100" value={form.phone} onChange={set("phone")} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Email Address *</label>
          <input required type="email" className={inputCls} placeholder="jane@email.com" value={form.email} onChange={set("email")} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Property Link <span className="normal-case font-normal text-slate-400">(Zillow, Redfin, Realtor.com, etc.)</span></label>
        <input className={inputCls} placeholder="https://www.zillow.com/..." value={form.property_link} onChange={set("property_link")} />
      </div>

      <div>
        <label className={labelCls}>Or Enter Property Address</label>
        <input className={inputCls} placeholder="123 Main St, Glendale, CA 91201" value={form.property_address} onChange={set("property_address")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Desired Purchase Area</label>
          <input className={inputCls} placeholder="e.g. Pasadena, Burbank, NELA" value={form.desired_area} onChange={set("desired_area")} />
        </div>
        <div>
          <label className={labelCls}>Approximate Purchase Price</label>
          <input className={inputCls} placeholder="e.g. $750,000" value={form.approximate_purchase_price} onChange={set("approximate_purchase_price")} />
        </div>
        <div>
          <label className={labelCls}>Purchase Timeline</label>
          <select className={inputCls} value={form.purchase_timeline} onChange={set("purchase_timeline")}>
            <option value="">Select...</option>
            {timelines.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Are You Working With An Agent?</label>
          <select className={inputCls} value={form.working_with_agent} onChange={set("working_with_agent")}>
            <option value="">Select...</option>
            {agentOptions.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-base rounded-xl transition disabled:opacity-60"
      >
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Checking...</> : <>Check Eligibility <ArrowRight className="h-4 w-4" /></>}
      </button>

      <p className="text-xs text-slate-400 text-center">No cost. No obligation. Your information is used only to review your eligibility.</p>
    </form>
  );
}