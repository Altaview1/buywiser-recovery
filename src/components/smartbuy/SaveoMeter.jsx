import { TrendingUp, Zap } from "lucide-react";

const STAGE_SAVINGS = [
  { stage: 1, label: "Get Pre-Qualified", pct: 0.05, icon: "📋" },
  { stage: 2, label: "Search Properties", pct: 0.12, icon: "🔍" },
  { stage: 3, label: "Schedule Tours", pct: 0.08, icon: "🏠" },
  { stage: 4, label: "Write Offer", pct: 0.20, icon: "✍️" },
  { stage: 5, label: "Inspections & Appraisal", pct: 0.30, icon: "📊" },
  { stage: 6, label: "Close Transaction", pct: 0.25, icon: "🔑" },
];

function formatCurrency(n) {
  return Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function SaveoMeter({ savingsPool = 18750, completedStages = [], currentStage = 1, tokensSpent = 0 }) {
  // Calculate earned savings from completed stages
  let earnedSavings = 0;
  STAGE_SAVINGS.forEach(s => {
    if (completedStages.includes(s.stage)) {
      earnedSavings += savingsPool * s.pct;
    }
  });

  const remaining = savingsPool - tokensSpent - earnedSavings;
  const percentComplete = (completedStages.filter(s => s <= 6).length / 6) * 100;
  
  // Calculate running balance at each stage
  const getBalanceAtStage = (stage) => {
    let balance = savingsPool;
    // Subtract earned savings up to this stage
    STAGE_SAVINGS.forEach(s => {
      if (s.stage <= stage) {
        balance -= savingsPool * s.pct;
      }
    });
    // Subtract tokens spent (approximate per stage)
    if (stage <= currentStage) {
      balance -= Math.round((tokensSpent / currentStage) * stage);
    }
    return Math.max(0, balance);
  };

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 overflow-hidden shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="px-5 py-4 border-b border-emerald-200 bg-gradient-to-r from-emerald-500 to-emerald-600">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-white" />
            <span className="text-sm font-black text-white uppercase tracking-widest">SAVE-o-Meter™</span>
          </div>
          <span className="text-xs font-bold text-emerald-100">{Math.round(percentComplete)}% complete</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-emerald-700/30">
          <div 
            className="h-full rounded-full bg-white transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 py-4">
        {/* Earned Savings */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-1">You've Earned</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700">{formatCurrency(earnedSavings)}</span>
            <span className="text-xs text-emerald-600">of {formatCurrency(savingsPool)}</span>
          </div>
        </div>

        {/* Breakdown - Show remaining balance at each stage */}
        <div className="space-y-1.5 mb-4 p-3 bg-white rounded-lg border border-emerald-100">
          {STAGE_SAVINGS.map(s => {
            const isCompleted = completedStages.includes(s.stage);
            const balanceAfterStage = getBalanceAtStage(s.stage);
            return (
              <div key={s.stage} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isCompleted ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-600"
                  }`}>
                    {isCompleted ? "✓" : s.stage}
                  </span>
                  <span className={`${isCompleted ? "text-emerald-700 font-semibold" : "text-slate-500"}`}>
                    {s.label}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`font-bold ${isCompleted ? "text-emerald-700" : "text-slate-500"}`}>
                    {formatCurrency(balanceAfterStage)}
                  </span>
                  <span className="text-[9px] text-slate-400">remaining</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="pt-3 border-t border-emerald-200 text-[10px] text-emerald-700 font-semibold space-y-1">
          <div className="flex justify-between">
            <span>Tokens Spent:</span>
            <span>− {formatCurrency(tokensSpent)}</span>
          </div>
          <div className="flex justify-between bg-emerald-100 rounded px-2 py-1">
            <span>Final Pool at Closing:</span>
            <span className="text-emerald-900 font-black">{formatCurrency(remaining)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}