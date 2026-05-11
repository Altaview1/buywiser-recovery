export default function CashBalanceIndicator({ cashRemaining, savingsPool }) {
  const percentUsed = savingsPool > 0 ? ((savingsPool - cashRemaining) / savingsPool) * 100 : 0;
  
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
      <div className="h-5 w-32 bg-emerald-200/30 rounded-full overflow-hidden border border-emerald-500/20">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
          style={{ width: `${Math.min(100, percentUsed)}%` }}
        />
      </div>
      <span className="text-xs font-black text-emerald-700 whitespace-nowrap">
        ${cashRemaining.toLocaleString()} / ${savingsPool.toLocaleString()}
      </span>
    </div>
  );
}