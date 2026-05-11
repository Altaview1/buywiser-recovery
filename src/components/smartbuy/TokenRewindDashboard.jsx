import { useState } from "react";
import { RotateCcw, ShieldCheck, AlertTriangle, CheckCircle, ArrowRight, ChevronDown, ChevronUp, Phone, Loader2, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

const REWINDABLE_SERVICES = [
  { icon: "🔍", label: "Property Intelligence Report", eligibility: "Before any offer is submitted" },
  { icon: "📋", label: "Mortgage Pre-Qualification Guidance", eligibility: "Before loan application is submitted" },
  { icon: "✍️", label: "Offer Strategy Review", eligibility: "Before counteroffer is transmitted" },
  { icon: "📁", label: "Transaction & Document Management", eligibility: "Before escrow closes" },
  { icon: "⚖️", label: "Real Estate Legal Review", eligibility: "Before execution of reviewed document" },
];

const NON_REWINDABLE = [
  { icon: "🏦", label: "Consummated mortgage loan", reason: "Loan is funded — financing event is complete" },
  { icon: "📄", label: "Transmitted counter-offer", reason: "Delivered to other party — legally binding act" },
  { icon: "🔑", label: "Escrow disbursement at closing", reason: "Funds distributed — transaction finalized" },
  { icon: "📝", label: "Executed purchase agreement", reason: "Fully signed contract — binding on both sides" },
];

const POLICY_STEPS = [
  {
    n: "01", color: "bg-violet-500/20 border-violet-500/40 text-violet-300",
    title: "Flag the Issue",
    desc: "Rate the service as unsatisfactory and describe what fell short. No forms, no hold queues — just tell us."
  },
  {
    n: "02", color: "bg-amber-500/20 border-amber-500/40 text-amber-300",
    title: "Buywiser Reviews Within 24 Hours",
    desc: "A Buywiser specialist reviews your request against the SmartBuy™ Vendor Terms & Conditions."
  },
  {
    n: "03", color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
    title: "Replace or Refund — You Choose",
    desc: "We assign a qualified 2nd-choice provider at zero additional token cost, or return your full token amount to your Savings Pool."
  },
];

function RequestModal({ onClose }) {
  const [service, setService] = useState("");
  const [issue, setIssue] = useState("");
  const [preference, setPreference] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service || !issue || !name || !phone) return;
    setLoading(true);
    await base44.functions.invoke("notifySmartBuyUnlock", {
      buyerName: name,
      buyerPhone: phone,
      serviceName: `[TOKEN REWIND REQUEST] ${service}`,
      expert: "Buywiser SmartBuy™ Team",
      note: `Issue: ${issue} | Preference: ${preference || "No preference"}`,
      tokenCost: 0,
      poolRemaining: 0,
    }).catch(() => {});
    setLoading(false);
    setSubmitted(true);
  };

  const inputCls = "w-full px-4 py-3 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition";
  const labelCls = "block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-slate-900 border border-violet-500/40 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
              <RotateCcw className="h-4 w-4 text-violet-400" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Request a Token Rewind™</p>
              <p className="text-[10px] text-slate-500">Provider replacement or full token refund</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 transition text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 border-2 border-violet-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-7 w-7 text-violet-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">Rewind Request Submitted</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-1">
                A Buywiser specialist will review your request and contact <span className="text-white font-semibold">{phone}</span> within 24 hours.
              </p>
              <p className="text-xs text-slate-600 mt-3">SmartBuy™ Vendor Terms & Conditions guarantee your right to a replacement or refund.</p>
              <button onClick={onClose} className="mt-5 text-xs text-slate-500 hover:text-slate-300 transition">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelCls}>Service You're Disputing *</label>
                <select value={service} onChange={e => setService(e.target.value)}
                  className={inputCls} required>
                  <option value="">Select a service...</option>
                  {REWINDABLE_SERVICES.map(s => (
                    <option key={s.label} value={s.label}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>What Fell Short? *</label>
                <textarea
                  value={issue} onChange={e => setIssue(e.target.value)}
                  placeholder="Describe the issue with the service provided..."
                  rows={3}
                  className={`${inputCls} resize-none`}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Your Preference</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Replace the provider", "Refund my tokens"].map(p => (
                    <button key={p} type="button" onClick={() => setPreference(p)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition text-left ${preference === p ? "bg-violet-500/20 border-violet-500 text-violet-300" : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Your Name *</label>
                  <input className={inputCls} placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls}>Your Phone *</label>
                  <input type="tel" className={inputCls} placeholder="(818) 555-0100" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
              </div>
              <button type="submit" disabled={loading || !service || !issue || !name || !phone}
                className="w-full py-3.5 rounded-xl font-black text-sm text-white bg-violet-600 hover:bg-violet-500 transition flex items-center justify-center gap-2 disabled:opacity-40">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><RotateCcw className="h-4 w-4" /> Submit Rewind Request</>}
              </button>
              <p className="text-[10px] text-slate-600 text-center">Response within 24 hours. Certain restrictions apply — see SmartBuy™ Vendor Terms.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TokenRewindDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showNonRewindable, setShowNonRewindable] = useState(false);

  return (
    <div className="bg-slate-950 min-h-screen px-4 sm:px-6 py-12">
      {modalOpen && <RequestModal onClose={() => setModalOpen(false)} />}

      <div className="max-w-4xl mx-auto">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
                <RotateCcw className="h-4.5 w-4.5 text-violet-400 h-5 w-5" />
              </div>
              <h1 className="text-2xl font-black text-white">Token Rewind™</h1>
            </div>
            <p className="text-slate-400 text-sm max-w-xl">
              Your guarantee that every provider performs at their best — or you get a replacement or full token refund.
            </p>
          </div>
          <button onClick={() => setModalOpen(true)}
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl text-sm transition whitespace-nowrap shadow-lg shadow-violet-900/40">
            <RotateCcw className="h-4 w-4" /> Request a Rewind
          </button>
        </div>

        {/* Guarantee banner */}
        <div className="relative rounded-2xl overflow-hidden mb-8" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 70%)" }}>
          <div className="absolute inset-0 border border-violet-500/30 rounded-2xl pointer-events-none" />
          <div className="h-1" style={{ background: "linear-gradient(to right, #7c3aed, #10b981, #7c3aed)" }} />
          <div className="px-6 sm:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-7 w-7 text-violet-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest text-violet-400 mb-1">SmartBuy™ Guarantee</p>
              <h2 className="text-xl font-black text-white mb-2">You Have the Final Word — Guaranteed.</h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                Every provider in the SmartBuy™ network has signed the <span className="text-white font-semibold">SmartBuy™ Vendor Terms & Conditions</span> — binding them to deliver quality service or face replacement. If we can't match you with an acceptable 2nd-choice provider, your tokens are refunded in full to your Savings Pool.
              </p>
            </div>
          </div>
        </div>

        {/* How to request — 3 steps */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">How to Request a Token Rewind™</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {POLICY_STEPS.map(({ n, color, title, desc }) => (
              <div key={n} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-sm mb-3 ${color}`}>{n}</div>
                <h3 className="text-sm font-black text-white mb-1.5">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 text-center">
            <button onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-7 py-3 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl text-sm transition">
              <RotateCcw className="h-4 w-4" /> Start My Rewind Request <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Covered services */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle className="h-3 w-3" /> Services Covered by Token Rewind™
          </p>
          <div className="space-y-2">
            {REWINDABLE_SERVICES.map((s, i) => (
              <div key={i} className="flex items-center gap-4 bg-slate-900 border border-slate-800 hover:border-emerald-500/30 rounded-xl px-5 py-3.5 transition">
                <span className="text-xl flex-shrink-0">{s.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{s.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Eligible: {s.eligibility}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-black bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
                  <RotateCcw className="h-2.5 w-2.5" /> Rewindable
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Non-rewindable — collapsible */}
        <div className="bg-slate-900 border border-amber-500/20 rounded-2xl overflow-hidden mb-8">
          <button onClick={() => setShowNonRewindable(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/50 transition">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-black text-amber-300">Services That Cannot Be Rewound</span>
            </div>
            {showNonRewindable ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
          </button>
          {showNonRewindable && (
            <div className="px-5 pb-5 border-t border-amber-500/20">
              <p className="text-xs text-slate-400 leading-relaxed mt-4 mb-4">
                Once a service has been <strong className="text-slate-300">performed and yields a binding real-world result</strong>, it cannot be reversed. Token Rewind™ covers advisory and preparatory services only — not completed legal or financial events.
              </p>
              <div className="space-y-2.5">
                {NON_REWINDABLE.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 bg-amber-900/10 border border-amber-500/20 rounded-xl px-4 py-3">
                    <span className="text-base flex-shrink-0 mt-0.5">{s.icon}</span>
                    <div>
                      <p className="text-xs font-black text-amber-200">{s.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{s.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-600 mt-4">Certain restrictions apply. Full terms provided at SmartBuy™ account activation.</p>
            </div>
          )}
        </div>

        {/* Still need help */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-600 flex items-center justify-center flex-shrink-0">
            <Phone className="h-4 w-4 text-slate-300" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-black text-white mb-0.5">Need Help Right Now?</p>
            <p className="text-xs text-slate-400">Call Bennett's team directly — no hold music, no chatbot.</p>
          </div>
          <a href="tel:+18183002642"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-slate-900 font-black rounded-xl text-sm hover:bg-amber-300 transition whitespace-nowrap">
            <Phone className="h-3.5 w-3.5" /> (818) 300-2642
          </a>
        </div>

      </div>
    </div>
  );
}