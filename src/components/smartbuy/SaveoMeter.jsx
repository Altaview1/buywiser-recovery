import { TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

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

export default function SaveoMeter({ savingsPool = 18750, completedStages = [], currentStage = 1, cashSpent = 0 }) {
  // Calculate earned savings from completed stages
  let earnedSavings = 0;
  STAGE_SAVINGS.forEach(s => {
    if (completedStages.includes(s.stage)) {
      earnedSavings += savingsPool * s.pct;
    }
  });

  const remaining = Math.max(0, savingsPool - cashSpent - earnedSavings);
  const percentComplete = (completedStages.filter(s => s <= 6).length / 6) * 100;
  const balanceChange = cashSpent > 0 ? `−${formatCurrency(cashSpent)}` : "—";
  
  // Calculate remaining balance at each stage
  // Balance = Full Pool - (Earned % from stages up to this point) - (Total cash spent)
  const getBalanceAtStage = (stage) => {
    let earnedUpToStage = 0;
    STAGE_SAVINGS.forEach(s => {
      if (s.stage <= stage) {
        earnedUpToStage += savingsPool * s.pct;
      }
    });
    return Math.max(0, savingsPool - earnedUpToStage - cashSpent);
  };

  return (
    <motion.div 
      className="rounded-2xl border border-emerald-200 bg-emerald-50 overflow-hidden shadow-sm hover:shadow-md transition"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-emerald-200 bg-gradient-to-r from-emerald-500 to-emerald-600 relative overflow-hidden">
        {/* Animated background pulse */}
        <motion.div
          className="absolute inset-0 bg-white/10"
          animate={{ opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="flex items-center gap-2">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity }}>
              <TrendingUp className="h-5 w-5 text-white" />
            </motion.div>
            <span className="text-sm font-black text-white uppercase tracking-widest">SAVE-o-Meter™</span>
          </div>
          <span className="text-xs font-bold text-emerald-100">{Math.round(percentComplete)}% complete</span>
        </div>
        
        {/* Main progress bar with glow effect */}
        <div className="w-full h-2 rounded-full bg-emerald-700/30 overflow-hidden relative z-10">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-white via-emerald-100 to-white shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: `${percentComplete}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          {/* Shimmer effect */}
          {percentComplete > 0 && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-5 py-4">
        {/* Real-Time Balance - Pulse on service spend */}
        <motion.div 
          className="mb-5 p-3 bg-white rounded-lg border-2 border-emerald-500 shadow-sm"
          animate={cashSpent > 0 ? { boxShadow: ["0 0 0 0 rgba(16, 185, 129, 0.7)", "0 0 0 12px rgba(16, 185, 129, 0)"] } : {}}
          transition={{ duration: 0.6, repeat: cashSpent > 0 ? 1 : 0 }}
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">YOUR CUSTOM SAVINGS POOL</p>
          <div className="flex items-baseline justify-between mb-2">
            <motion.span 
              className="text-4xl font-black text-emerald-700"
              key={remaining}
              initial={{ scale: 1 }}
              animate={cashSpent > 0 ? { scale: [1, 1.15, 0.95, 1.08, 1] } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {formatCurrency(remaining)}
            </motion.span>
            <span className="text-xs text-slate-500 text-right">
              <p className="font-bold">Pool: {formatCurrency(savingsPool)}</p>
              <p>Spent: {balanceChange}</p>
            </span>
          </div>
          <motion.div 
            className="w-full h-2 rounded-full bg-slate-200 overflow-hidden"
            animate={cashSpent > 0 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${((savingsPool - remaining) / savingsPool) * 100}%` }}
              animate={cashSpent > 0 ? { brightness: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
          <motion.p 
            className="text-[10px] text-slate-600 mt-1.5 font-bold"
            animate={cashSpent > 0 ? { scale: [1, 1.08, 1], color: ["#475569", "#059669", "#475569"] } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {cashSpent > 0 ? `${((cashSpent / savingsPool) * 100).toFixed(1)}% of your pool allocated to services` : "No services selected yet"}
          </motion.p>
        </motion.div>

        {/* Earned Savings */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest mb-1">You've Earned</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">{formatCurrency(earnedSavings)}</span>
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

        {/* Footer Summary */}
        <div className="pt-3 border-t border-emerald-200 text-[10px] text-slate-600 font-semibold space-y-1">
          <div className="flex justify-between">
            <span>Original Pool:</span>
            <span className="text-slate-900 font-black">{formatCurrency(savingsPool)}</span>
          </div>
          <div className="flex justify-between bg-blue-50 rounded px-2 py-1">
            <span>Services Allocated:</span>
            <span className="text-blue-900 font-black">− {formatCurrency(cashSpent)}</span>
          </div>
          <div className="flex justify-between bg-emerald-100 rounded px-2 py-1">
            <span>Your Balance Now:</span>
            <span className="text-emerald-900 font-black">{formatCurrency(remaining)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}