import { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";

const STAGES = [
  { icon: "📋", label: "Pre-Qualification", short: "Pre-Qual" },
  { icon: "🔍", label: "Search Properties", short: "Search" },
  { icon: "🏠", label: "Schedule Tours", short: "Tours" },
  { icon: "✍️", label: "Write Offer", short: "Offer" },
  { icon: "📊", label: "Inspections", short: "Inspect" },
  { icon: "🔑", label: "Close Deal", short: "Closing" },
];

export default function JourneyProgressBar({ savingsPool = 18750, cashSpent = 0 }) {
  const [activeStage, setActiveStage] = useState(0);
  const remainingBalance = savingsPool - cashSpent;

  return (
    <section className="px-4 sm:px-6 py-12 border-t border-slate-800/60 bg-slate-900/60">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Your Journey</p>
          <h2 className="text-xl font-black text-white">The SmartBuy™ Homebuying Journey</h2>
          <p className="text-xs text-slate-500 mt-1">Tap any stage to see what happens — and what it saves you</p>
        </div>

        {/* Progress bar */}
        <div className="relative mb-6">
          {/* Connecting line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-800 mx-8 sm:mx-12" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-emerald-500 mx-8 sm:mx-12 transition-all duration-500"
            style={{ width: `${(activeStage / (STAGES.length - 1)) * 100}%` }}
          />

          {/* Stage dots */}
          <div className="relative flex justify-between">
            {STAGES.map((stage, i) => {
              const isComplete = i < activeStage;
              const isActive = i === activeStage;
              return (
                <button
                  key={i}
                  onClick={() => setActiveStage(i)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 text-sm
                    ${isComplete ? "bg-emerald-500 border-emerald-500 text-white" : ""}
                    ${isActive ? "bg-slate-900 border-emerald-400 scale-110 shadow-lg shadow-emerald-400/20" : ""}
                    ${!isComplete && !isActive ? "bg-slate-900 border-slate-700 group-hover:border-slate-500" : ""}
                  `}>
                    {isComplete ? <CheckCircle className="h-4 w-4" /> : <span>{stage.icon}</span>}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors hidden sm:block
                    ${isActive ? "text-emerald-400" : isComplete ? "text-emerald-600" : "text-slate-600 group-hover:text-slate-400"}
                  `}>
                    {stage.short}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active stage detail card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-5 py-5 transition-all">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl flex-shrink-0">
              {STAGES[activeStage].icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Stage {activeStage + 1} of {STAGES.length}</span>
              </div>
              <h3 className="text-base font-black text-white mb-1">{STAGES[activeStage].label}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{STAGE_DETAILS[activeStage].desc}</p>
            </div>
            <div className="flex-shrink-0 text-right hidden sm:block">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-0.5">Your Balance</p>
              <p className="text-lg font-black text-emerald-400">${remainingBalance.toLocaleString()}</p>
              <p className="text-[10px] text-slate-600">available to spend</p>
            </div>
          </div>



          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveStage(s => Math.max(0, s - 1))}
              disabled={activeStage === 0}
              className="text-xs text-slate-500 hover:text-slate-300 transition disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg hover:bg-slate-800"
            >
              ← Previous
            </button>
            <div className="flex gap-1.5">
              {STAGES.map((_, i) => (
                <button key={i} onClick={() => setActiveStage(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeStage ? "bg-emerald-400 w-4" : i < activeStage ? "bg-emerald-700" : "bg-slate-700"}`}
                />
              ))}
            </div>
            <button
              onClick={() => setActiveStage(s => Math.min(STAGES.length - 1, s + 1))}
              disabled={activeStage === STAGES.length - 1}
              className="text-xs text-slate-500 hover:text-slate-300 transition disabled:opacity-30 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg hover:bg-slate-800"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const STAGE_DETAILS = [
  {
    desc: "Our AI underwriter analyzes your financial profile (income, assets, debts) to determine DTI and confirm your buying power. Completely free — no charge.",
    pct: "FREE",
  },
  {
    desc: "Browse listings and select properties that fit your budget. Use AI-powered property intelligence to evaluate each listing before scheduling tours.",
    pct: "12%",
  },
  {
    desc: "Schedule your own property showings. No agent coordination fees — you control your tour schedule and visit properties at your pace.",
    pct: "8%",
  },
  {
    desc: "Write and submit your offer with AI guidance on pricing, contingencies, and terms. Unlock expert negotiation only if you need it.",
    pct: "21%",
  },
  {
    desc: "After offer acceptance, coordinate inspections, appraisals, and transaction documents. The Machine™ keeps everything on track.",
    pct: "31%",
  },
  {
    desc: "Final walkthrough, title review, closing coordination, and document signing. Your SmartBuy Savings Pool™ is distributed at closing.",
    pct: "28%",
  },
];