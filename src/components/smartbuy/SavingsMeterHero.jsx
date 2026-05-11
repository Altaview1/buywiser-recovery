import { DollarSign, TrendingDown } from "lucide-react";

function formatCurrency(n) {
  return Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function SavingsMeterHero({ price = 850000 }) {
  const totalCommission = Math.round(price * 0.05); // ~5% traditional commission
  const buyerCommission = Math.round(price * 0.025); // ~2.5% buyer side
  const smartbuyPreserved = Math.round(buyerCommission * 0.75); // Roughly 75% of buyer commission
  const usedForServices = Math.round(buyerCommission * 0.25); // 25% for services

  return (
    <div className="w-full max-w-md">
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-lg">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">SmartBuy™ Savings Meter</p>
          <p className="text-3xl font-black text-slate-900">{formatCurrency(price)}</p>
          <p className="text-sm text-slate-600 mt-1">Purchase Price</p>
        </div>

        {/* Traditional vs SmartBuy */}
        <div className="space-y-4 mb-8 pb-8 border-b border-slate-200">
          {/* Traditional */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <span className="text-xs font-black text-slate-600 uppercase">Traditional</span>
              </div>
              <span className="text-sm font-black text-red-600">−{formatCurrency(totalCommission)}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">5% commission (bundled services, no choice)</p>
          </div>

          {/* SmartBuy */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-black text-slate-600 uppercase">SmartBuy™</span>
              </div>
              <span className="text-sm font-black text-emerald-600">+{formatCurrency(smartbuyPreserved)}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">Keep 75% of buyer commission, pay only for used services</p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="mb-8 pb-8 border-b border-slate-200">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Your SmartBuy™ Pool</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-700">Preserved buyer savings</span>
              <span className="text-sm font-black text-emerald-600">{formatCurrency(smartbuyPreserved)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-700">Service token budget</span>
              <span className="text-sm font-black text-amber-600">{formatCurrency(usedForServices)}</span>
            </div>
            <div className="h-px bg-slate-300 my-2" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Total available</span>
              <span className="text-lg font-black text-slate-900">{formatCurrency(buyerCommission)}</span>
            </div>
          </div>
        </div>

        {/* Use cases */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-3">Use your pool for:</p>
          <ul className="space-y-2">
            {["✓ Lower interest rate", "✓ Closing costs", "✓ Cash at closing", "✓ Reduced monthly payment"].map(
              (item, i) => (
                <li key={i} className="text-xs text-emerald-800 font-semibold">
                  {item}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Bottom note */}
        <p className="text-[10px] text-slate-500 mt-6 text-center leading-tight">
          Actual savings depend on property price, services used, and local market conditions.
        </p>
      </div>
    </div>
  );
}