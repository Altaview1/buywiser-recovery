import { useState } from "react";
import { RotateCcw, ShieldCheck, ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from "lucide-react";

const REWINDABLE = [
  { icon: "🔍", label: "Property Intelligence Report", desc: "Not satisfied with the analysis? We replace the provider or refund your tokens." },
  { icon: "📋", label: "Mortgage Pre-Qualification Guidance", desc: "Guidance that doesn't meet the mark? Full token refund or a qualified 2nd advisor steps in." },
  { icon: "✍️", label: "Offer Strategy Review", desc: "If the strategy advice falls short before submission, we make it right." },
  { icon: "📁", label: "Transaction & Document Management", desc: "Coordination errors or missed deadlines? Provider replaced or tokens refunded." },
  { icon: "⚖️", label: "Real Estate Legal Review", desc: "Unsatisfied with the legal guidance? A second attorney reviews — at no extra token cost." },
];

const NON_REWINDABLE = [
  { icon: "🏦", label: "Consummated mortgage loan", desc: "Once a loan is funded and closed, the financing event cannot be reversed." },
  { icon: "📄", label: "Counter-offer already transmitted", desc: "A negotiated counteroffer delivered to the other party is a completed legal act." },
  { icon: "🔑", label: "Escrow disbursement at closing", desc: "Funds distributed at closing finalize the transaction — escrow cannot be recalled." },
  { icon: "📝", label: "Executed purchase agreements", desc: "A fully signed and accepted contract creates binding obligations on both sides." },
];

export default function TokenRewind({ onGetStarted }) {
  const [showNonRewindable, setShowNonRewindable] = useState(false);

  return (
    <section className="px-4 sm:px-6 py-20 border-t border-slate-800/40 bg-slate-950">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-violet-500/15 border border-violet-500/40 mb-5">
            <RotateCcw className="h-4 w-4 text-violet-400" />
            <span className="text-xs font-black text-violet-400 uppercase tracking-widest">SmartBuy™ Guarantee</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            Token Rewind™ Guarantee
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            Every provider in the SmartBuy™ network has agreed — in writing — that <strong className="text-white">you have the final word.</strong> If a service falls short, we replace the provider at no additional token cost, or we refund your tokens in full.
          </p>
        </div>

        {/* The Core Guarantee Card */}
        <div className="relative rounded-3xl overflow-hidden mb-10" style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 60%, #0c1a0f 100%)" }}>
          <div className="absolute inset-0 border border-violet-500/30 rounded-3xl pointer-events-none" />

          {/* Top accent bar */}
          <div className="h-1 w-full" style={{ background: "linear-gradient(to right, #7c3aed, #10b981, #7c3aed)" }} />

          <div className="px-6 sm:px-10 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* Big badge */}
              <div className="flex flex-col items-center lg:items-start gap-4">
                <div className="w-24 h-24 rounded-3xl bg-violet-500/20 border-2 border-violet-500/50 flex items-center justify-center shadow-xl shadow-violet-900/40">
                  <RotateCcw className="h-10 w-10 text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white leading-tight">You Have<br />the Last Word.</p>
                  <p className="text-violet-300 text-sm mt-1 font-semibold">Guaranteed under SmartBuy™ Vendor Terms</p>
                </div>
                {onGetStarted && (
                  <button
                    onClick={onGetStarted}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-400 text-white font-black rounded-xl text-sm transition"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" /> Start With Certainty
                  </button>
                )}
              </div>

              {/* How it works */}
              <div className="lg:col-span-2 space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">How Token Rewind™ Works</p>
                {[
                  {
                    step: "1",
                    color: "bg-violet-500/20 border-violet-500/40 text-violet-300",
                    title: "You Unlock a Professional Service",
                    desc: "A token cost is drawn from your Savings Pool. The provider is engaged and delivers their service.",
                  },
                  {
                    step: "2",
                    color: "bg-amber-500/20 border-amber-500/40 text-amber-300",
                    title: "If You're Not Satisfied — You Say So",
                    desc: "Rate the service. If the provider has not met the standard, you flag it. No forms, no runaround.",
                  },
                  {
                    step: "3",
                    color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
                    title: "We Replace or Refund — Your Choice",
                    desc: "Buywiser either assigns a qualified 2nd-choice provider at zero additional token cost, or refunds your tokens in full to your Savings Pool.",
                  },
                ].map(({ step, color, title, desc }) => (
                  <div key={step} className="flex items-start gap-4 bg-white/5 rounded-2xl px-5 py-4 border border-white/10">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center flex-shrink-0 font-black text-sm ${color}`}>{step}</div>
                    <div>
                      <p className="text-sm font-black text-white mb-0.5">{title}</p>
                      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why providers comply */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl px-6 py-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white mb-1">Why Every Provider Brings Their Best</p>
              <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">
                Every professional in the SmartBuy™ network has signed the <span className="text-white font-semibold">SmartBuy™ Vendor Terms & Conditions</span> — which explicitly bind them to the Token Rewind™ guarantee. They know before they start that you hold the right to an acceptable outcome. That accountability dynamic means you always get a professional operating at their highest standard.
              </p>
            </div>
          </div>
        </div>

        {/* Rewindable services grid */}
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
            <RotateCcw className="h-3 w-3" /> Services Covered by Token Rewind™
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {REWINDABLE.map((s, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-900 border border-slate-700 hover:border-emerald-500/40 rounded-xl px-4 py-3.5 transition">
                <span className="text-lg flex-shrink-0">{s.icon}</span>
                <div>
                  <p className="text-xs font-black text-white leading-snug">{s.label}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{s.desc}</p>
                </div>
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        </div>

        {/* Non-rewindable — collapsible */}
        <div className="bg-slate-900 border border-amber-500/20 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowNonRewindable(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-800/50 transition"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-black text-amber-300 uppercase tracking-wide">Important: Services That Cannot Be Rewound</span>
            </div>
            {showNonRewindable
              ? <ChevronUp className="h-4 w-4 text-slate-500" />
              : <ChevronDown className="h-4 w-4 text-slate-500" />}
          </button>

          {showNonRewindable && (
            <div className="px-5 pb-5 border-t border-amber-500/20">
              <p className="text-xs text-slate-400 leading-relaxed mt-4 mb-4">
                Once a service has been <strong className="text-slate-300">performed and yields a binding real-world result</strong>, it cannot be reversed. The Token Rewind™ guarantee applies only to advisory and preparatory services — not to completed legal or financial events.
              </p>
              <div className="space-y-2.5">
                {NON_REWINDABLE.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 bg-amber-900/10 border border-amber-500/20 rounded-xl px-4 py-3">
                    <span className="text-base flex-shrink-0">{s.icon}</span>
                    <div>
                      <p className="text-xs font-black text-amber-200 leading-snug">{s.label}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-600 mt-4 leading-relaxed">Certain restrictions apply. Full terms available in the SmartBuy™ Vendor Terms & Conditions, provided at account activation.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}