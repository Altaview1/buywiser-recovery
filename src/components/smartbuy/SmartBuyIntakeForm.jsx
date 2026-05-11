import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowRight } from "lucide-react";

const TIMELINES = ["0-3 months", "3-6 months", "6-12 months", "just exploring"];

export default function SmartBuyIntakeForm({ onSuccess, onPriceChange }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    property_link: "", target_city: "",
    purchase_price: "",
    pre_approved: "",
    timeline: "",
    first_time_buyer: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    if (field === "purchase_price") {
      const num = Number(val.replace(/[^0-9]/g, ""));
      if (num > 0 && onPriceChange) onPriceChange(num);
    }
  };

  const inputCls = "w-full px-4 py-3 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition";
  const labelCls = "block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide";

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!form.purchase_price && !form.property_link && !form.target_city) {
        setError("Please enter a property link, city, or purchase price."); return;
      }
      setError(""); setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill in your name, email, and phone."); return;
    }
    setError("");
    setLoading(true);

    const priceNum = form.purchase_price ? Number(form.purchase_price.replace(/[^0-9]/g, "")) : 0;
    const savingsPool = priceNum ? Math.round(priceNum * 0.025) : null;
    const params = new URLSearchParams(window.location.search);

    await base44.entities.SmartBuyLead.create({
      ...form,
      purchase_price: priceNum || undefined,
      first_time_buyer: form.first_time_buyer === "yes",
      savings_pool_estimate: savingsPool,
      tokens_remaining: savingsPool,
      tokens_spent: 0,
      workflow_stage: "intake",
      status: "waitlist",
      source: params.get("utm_source") || document.referrer || "direct",
    });

    // Notify office
    await base44.functions.invoke("sendSMS", {
      message: `🤖 New SmartBuy Lead!\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nPrice: ${form.purchase_price || "N/A"}\nTimeline: ${form.timeline || "N/A"}\nPre-approved: ${form.pre_approved || "N/A"}`,
    }).catch(() => {});

    // Welcome email to buyer
    await base44.integrations.Core.SendEmail({
      to: form.email,
      from_name: "Buywiser SmartBuy™",
      subject: savingsPool ? `Your SmartBuy Savings Pool: $${savingsPool.toLocaleString()} — Welcome` : "Welcome to Buywiser SmartBuy™",
      body: `Hi ${form.name.split(" ")[0]},\n\nWelcome to Buywiser SmartBuy™ — the AI-guided homebuying platform.\n\n${savingsPool ? `Your estimated SmartBuy Savings Pool™: $${savingsPool.toLocaleString()}\n\nThis is the estimated amount you can keep by self-directing your home purchase through our platform. The more steps you complete yourself, the more you keep.\n\n` : ""}What happens next:\n• A Buywiser specialist will review your profile within 1 business day\n• You'll receive your personalized SmartBuy workflow roadmap\n• We'll activate your savings pool and walk you through Stage 1\n\nQuestions? Call (818) 300-2642 or reply to this email.\n\n— The Buywiser SmartBuy™ Team\n\nBuyWiser Technology, Inc. NMLS #1887767 · CA DRE #01107013\nThis is a private program, not a government benefit.`,
    }).catch(() => {});

    setLoading(false);
    onSuccess && onSuccess({ ...form, savings_pool_estimate: savingsPool });
  };

  return (
    <div>
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition ${step >= s ? "bg-emerald-500 text-white" : "bg-slate-700 text-slate-500"}`}>{s}</div>
            {s < 2 && <div className={`h-0.5 w-8 transition ${step > s ? "bg-emerald-500" : "bg-slate-700"}`} />}
          </div>
        ))}
        <span className="text-xs text-slate-500 ml-1">{step === 1 ? "Property" : "Contact"}</span>
      </div>

      {step === 1 && (
        <form onSubmit={handleNext} className="space-y-4">
          <div>
            <label className={labelCls}>Copy & Paste a Property You're Interested In</label>
            <input className={inputCls} placeholder="https://www.zillow.com/homedetails/... (or any listing link)" value={form.property_link} onChange={e => set("property_link", e.target.value)} />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-600 font-semibold">OR</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>
          <div>
            <label className={labelCls}>Target City / Area</label>
            <input className={inputCls} placeholder="e.g. Glendale, Burbank, Pasadena" value={form.target_city} onChange={e => set("target_city", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Estimated Purchase Price</label>
            <input className={inputCls} placeholder="e.g. $750,000" value={form.purchase_price} onChange={e => set("purchase_price", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Purchase Timeline</label>
            <div className="grid grid-cols-2 gap-2">
              {TIMELINES.map(t => (
                <button key={t} type="button" onClick={() => set("timeline", t)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition text-left ${form.timeline === t ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Mortgage Pre-Approval Status</label>
            <div className="flex gap-2">
              {[["yes", "Yes ✓"], ["in_progress", "In Progress"], ["no", "Not Yet"]].map(([val, label]) => (
                <button key={val} type="button" onClick={() => set("pre_approved", val)}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold border transition ${form.pre_approved === val ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>First-Time Buyer?</label>
            <div className="flex gap-2">
              {[["yes", "Yes"], ["no", "No"]].map(([val, label]) => (
                <button key={val} type="button" onClick={() => set("first_time_buyer", val)}
                  className={`flex-1 px-3 py-2.5 rounded-xl text-xs font-semibold border transition ${form.first_time_buyer === val ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" className="w-full py-4 rounded-xl font-black text-base text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition flex items-center justify-center gap-2">
            Calculate My Savings Pool <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
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
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-black text-base text-slate-900 bg-emerald-400 hover:bg-emerald-300 transition flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Activating...</> : <>Activate My SmartBuy™ Account <ArrowRight className="h-4 w-4" /></>}
          </button>
          <button type="button" onClick={() => setStep(1)} className="w-full text-xs text-slate-500 hover:text-slate-300 transition py-1">← Back</button>
          <p className="text-xs text-slate-600 text-center">No cost. No obligation. Your info is never sold.</p>
        </form>
      )}
    </div>
  );
}