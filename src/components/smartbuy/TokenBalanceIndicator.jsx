import { Zap } from "lucide-react";

export default function TokenBalanceIndicator({ tokensRemaining, savingsPool }) {
  const percentUsed = savingsPool > 0 ? ((savingsPool - tokensRemaining) / savingsPool) * 100 : 0;
  
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
      <div className="flex items-center gap-1.5">
        <Zap className="h-4 w-4 text-amber-500" />
        <span className="text-xs font-black text-amber-700 uppercase tracking-widest">Tokens</span>
      </div>
      <div className="h-5 w-32 bg-amber-200/30 rounded-full overflow-hidden border border-amber-500/20">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
          style={{ width: `${Math.min(100, percentUsed)}%` }}
        />
      </div>
      <span className="text-xs font-black text-amber-700 whitespace-nowrap">
        {tokensRemaining} / {savingsPool}
      </span>
    </div>
  );
}