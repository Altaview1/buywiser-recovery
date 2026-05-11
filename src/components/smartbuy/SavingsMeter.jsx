import { useState, useEffect } from "react";

function formatCurrency(n) {
  return Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

// Savings breakdown: portion of the 2.5% buyer-side commission attributable to each professional service stage
const STAGES = [
  { label: "Property Intelligence & Market Analysis", sublabel: "Search & advisory — typically billed at 0.3% of purchase price", pct: 0.12, icon: "🔍" },
  { label: "Mortgage Pre-Qualification Guidance", sublabel: "Financing advisory — typically billed at 0.375% of purchase price", pct: 0.15, icon: "📋" },
  { label: "Offer Strategy & Preparation", sublabel: "Negotiation & drafting — typically billed at 0.5% of purchase price", pct: 0.20, icon: "✍️" },
  { label: "Transaction & Document Management", sublabel: "Coordination fees — typically billed at 0.625% of purchase price", pct: 0.25, icon: "📁" },
  { label: "Closing Coordination & Compliance", sublabel: "Legal & escrow oversight — typically billed at 0.45% of purchase price", pct: 0.18, icon: "🔑" },
  { label: "Post-Close Savings Distribution", sublabel: "Final disbursement — your remaining pool returned at closing", pct: 0.10, icon: "💰" },
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
        <p className="text-slate-400 text-xs mt-1">on a {formatCurrency(price)} home · based on standard 2.5% buyer-side commission</p>
      </div>

      {/* Stage Breakdown */}
      <div className="px-6 py-4 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Professional Service Fee Breakdown</p>
        {STAGES.map((stage, i) => {
          const stageValue = Math.round(totalSavings * stage.pct);
          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition cursor-default"
              style={{ background: hovered === i ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)", border: hovered === i ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent" }}
            >
              <span className="text-base w-6 text-center flex-shrink-0 mt-0.5">{stage.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-300 font-semibold leading-tight">{stage.label}</p>
                {hovered === i && (
                  <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{stage.sublabel}</p>
                )}
              </div>
              <span className="text-sm font-black text-emerald-400 flex-shrink-0">{formatCurrency(stageValue)}</span>
            </div>
          );
        })}
      </div>

      {/* Bottom bar */}
      <div className="px-6 py-3 border-t border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400">Self-direct each stage · retain the professional fee</span>
        </div>
        <span className="text-[10px] text-slate-600 font-mono">v1.0</span>
      </div>
    </div>
  );
}