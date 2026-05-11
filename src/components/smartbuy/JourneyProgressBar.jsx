import { useState } from "react";
import { CheckCircle, Circle, Check } from "lucide-react";

const STAGES = [
  { icon: "🔍", label: "Property Intel", short: "Search" },
  { icon: "📋", label: "Pre-Qualification", short: "Pre-Qual" },
  { icon: "✍️", label: "Offer Prep", short: "Offer" },
  { icon: "📁", label: "Transaction Mgmt", short: "Transaction" },
  { icon: "🔑", label: "Closing", short: "Closing" },
  { icon: "💰", label: "You Get Paid", short: "Paid!" },
];

const STAGE_TASKS = [
  [
    { id: 1, label: "Enter property address or link" },
    { id: 2, label: "Review AI property analysis" },
    { id: 3, label: "Check comparable sales" },
  ],
  [
    { id: 1, label: "Submit financial documents" },
    { id: 2, label: "Get mortgage pre-approval" },
    { id: 3, label: "Confirm purchase power" },
  ],
  [
    { id: 1, label: "Review offer draft" },
    { id: 2, label: "Adjust price & contingencies" },
    { id: 3, label: "Submit offer" },
  ],
  [
    { id: 1, label: "Review inspection reports" },
    { id: 2, label: "Track escrow timeline" },
    { id: 3, label: "Approve final walkthrough" },
  ],
  [
    { id: 1, label: "Review closing disclosure" },
    { id: 2, label: "Verify loan terms" },
    { id: 3, label: "Sign closing documents" },
  ],
  [
    { id: 1, label: "Receive keys" },
    { id: 2, label: "Get funds distribution" },
    { id: 3, label: "Celebrate! 🎉" },
  ],
];

export default function JourneyProgressBar() {
  const [activeStage, setActiveStage] = useState(0);
  const [completedTasks, setCompletedTasks] = useState({});

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
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-0.5">Stage Value</p>
              <p className="text-lg font-black text-emerald-400">{STAGE_DETAILS[activeStage].pct}</p>
              <p className="text-[10px] text-slate-600">of savings pool</p>
            </div>
          </div>

          {/* Tasks for current stage */}
          <div className="mb-6 pb-6 border-b border-slate-800">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Tasks for this stage</p>
            <div className="space-y-2">
              {STAGE_TASKS[activeStage].map((task) => {
                const taskKey = `${activeStage}-${task.id}`;
                const isCompleted = completedTasks[taskKey];
                return (
                  <label key={taskKey} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={isCompleted || false}
                      onChange={() => setCompletedTasks(prev => ({
                        ...prev,
                        [taskKey]: !prev[taskKey]
                      }))}
                      className="w-4 h-4 rounded border border-slate-600 accent-emerald-500 cursor-pointer"
                    />
                    <span className={`text-xs transition ${isCompleted ? "text-slate-500 line-through" : "text-slate-300"}`}>
                      {task.label}
                    </span>
                  </label>
                );
              })}
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
    desc: "AI pulls public data on your target property — comps, price history, listing flags, neighborhood trends. You get an instant intelligence report without paying an agent for it.",
    pct: "12%",
  },
  {
    desc: "Connect with Buywiser's mortgage team to review your financing options, lock in a pre-approval, and understand your purchase power before writing an offer.",
    pct: "15%",
  },
  {
    desc: "AI drafts your offer with smart contingencies and competitive pricing guidance. You review, adjust, and submit — with the option to unlock an expert negotiator if needed.",
    pct: "20%",
  },
  {
    desc: "The Machine™ tracks every document, deadline, and disclosure across your transaction — keeping you on schedule from accepted offer to final signing.",
    pct: "25%",
  },
  {
    desc: "Licensed professionals handle the escrow, title, and legal compliance pieces. You coordinate with guidance — and stay fully informed every step of the way.",
    pct: "18%",
  },
  {
    desc: "Your SmartBuy Savings Pool™ is distributed at closing. The amount you kept by self-directing your journey — minus any token unlocks — comes back to you.",
    pct: "10%",
  },
];