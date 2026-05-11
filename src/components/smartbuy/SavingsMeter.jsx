import { useState, useEffect } from "react";

function formatCurrency(n) {
  return Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

// Savings breakdown: what each stage is worth as % of commission saved
const STAGES = [
  { label: "Property Intelligence Report", pct: 0.12, icon: "🔍" },
  { label: "Mortgage Pre-Qualification", pct: 0.15, icon: "📋" },
  { label: "Offer Preparation", pct: 0.20, icon: "✍️" },
  { label: "Transaction Management", pct: 0.25, icon: "📁" },
  { label: "Closing Coordination", pct: 0.18, icon: "🔑" },
  { label: "Post-Close Distribution", pct: 0.10, icon: "💰" },
];

export default function SavingsMeter({ price = 750000, animated = true }) {
  const totalSavings = Math.round(price * 0.025); // ~2.5% of purchase price
  const [displayed, setDisplayed] = useState(animated ? 0 : totalSavings);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (!animated) return;
    let start = 0;
    const end = totalSavings;
    const duration = 1200;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplayed(end); clearInterval(timer); }
      else setDisplayed(Math.round(start));
    }, 16);
    return () => clearInterval(timer);
  }, [totalSavings, animated]);

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-2xl">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-700/60" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">SmartBuy Savings Pool™</span>
          <span className="text-xs text-slate-500 font-medium">Buywiser SmartBuy™</span>
        </div>
        <div className="flex items-end gap-3">
          <span className="text-5xl font-black text-white tabular-nums" style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatCurrency(displayed)}
          </span>
          <span className="text-emerald-400 text-sm font-bold mb-2">estimated</span>
        </div>
        <p className="text-slate-400 text-xs mt-1">on a {formatCurrency(price)} home · complete steps yourself to keep it all</p>
      </div>

      {/* Stage Breakdown */}
      <div className="px-6 py-4 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Your Savings Breakdown</p>
        {STAGES.map((stage, i) => {
          const stageValue = Math.round(totalSavings * stage.pct);
          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition cursor-default"
              style={{ background: hovered === i ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)", border: hovered === i ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent" }}
            >
              <span className="text-base w-6 text-center flex-shrink-0">{stage.icon}</span>
              <span className="flex-1 text-xs text-slate-300 font-medium">{stage.label}</span>
              <span className="text-sm font-black text-emerald-400">{formatCurrency(stageValue)}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom bar */}
      <div className="px-6 py-3 border-t border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400">Complete each stage yourself · keep the savings</span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono">v1.0</span>
      </div>
    </div>
  );
}