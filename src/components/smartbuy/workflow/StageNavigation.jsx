import { CheckCircle, Circle } from "lucide-react";

const STAGES = [
  { num: 1, label: "Prequalification", icon: "🔍" },
  { num: 2, label: "Property Search", icon: "🏠" },
  { num: 3, label: "Touring", icon: "👁️" },
  { num: 4, label: "Consultation", icon: "💬" },
  { num: 5, label: "Offer", icon: "✍️" },
  { num: 6, label: "Escrow & Coordinator", icon: "📁" },
  { num: 7, label: "Inspection", icon: "🔬" },
  { num: 8, label: "Financing", icon: "🏦" },
  { num: 9, label: "Appraisal", icon: "📊" },
  { num: 10, label: "Closing", icon: "🔑" },
];

export default function StageNavigation({ currentStage, completedStages = [] }) {
  const progressPercent = Math.round((completedStages.length / STAGES.length) * 100);

  return (
    <div className="w-full sm:w-72 bg-slate-900 border-r border-slate-800 p-4 flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">SmartBuy™ Journey</p>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-black text-emerald-400">Stage {currentStage}</span>
          <span className="text-xs text-slate-600">of 10</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-black text-slate-500 uppercase">Progress</span>
          <span className="text-xs font-black text-emerald-400">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stage List */}
      <div className="space-y-1 flex-1">
        {STAGES.map((stage) => {
          const isCompleted = completedStages.includes(stage.num);
          const isActive = currentStage === stage.num;

          return (
            <div
              key={stage.num}
              className={`p-3 rounded-lg transition ${
                isActive
                  ? "bg-emerald-500/20 border border-emerald-500/50"
                  : isCompleted
                  ? "bg-slate-800/60 border border-slate-700"
                  : "bg-slate-800/30 border border-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                  ) : isActive ? (
                    <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-black leading-tight ${
                    isActive ? "text-emerald-300" : isCompleted ? "text-slate-300" : "text-slate-500"
                  }`}>
                    Stage {stage.num}
                  </p>
                  <p className={`text-[10px] leading-tight mt-0.5 ${
                    isActive ? "text-emerald-200" : isCompleted ? "text-slate-400" : "text-slate-600"
                  }`}>
                    {stage.label}
                  </p>
                </div>

                <span className="text-sm flex-shrink-0">{stage.icon}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="pt-4 border-t border-slate-800 mt-4">
        <div className="text-[10px] text-slate-600 text-center leading-relaxed">
          <p className="font-black uppercase tracking-widest mb-2 text-slate-500">Next Up</p>
          {currentStage <= 10 ? (
            <>
              <p className="text-emerald-400 font-bold">{STAGES[currentStage - 1]?.label}</p>
              {currentStage < 10 && (
                <p className="text-slate-600 mt-1">→ Then {STAGES[currentStage]?.label}</p>
              )}
            </>
          ) : (
            <p className="text-emerald-400 font-bold">Transaction Complete! 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}