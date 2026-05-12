import { CheckCircle, XCircle, DollarSign } from "lucide-react";

const ROWS = [
  {
    aspect: "Buyer-Side Commission",
    traditional: { label: "2.5–3% paid to agent", bad: true },
    smartbuy:    { label: "You keep up to 2.5%", good: true },
  },
  {
    aspect: "On a $750K Home",
    traditional: { label: "$18,750–$22,500 to agent", bad: true },
    smartbuy:    { label: "$18,750 preserved in your pool", good: true },
  },
  {
    aspect: "Savings at Closing",
    traditional: { label: "$0 — commission fully consumed", bad: true },
    smartbuy:    { label: "Unused pool credited to you", good: true },
  },
  {
    aspect: "Administrative Work",
    traditional: { label: "Agent manages everything (bundled cost)", bad: true },
    smartbuy:    { label: "AI handles it — free of charge", good: true },
  },
  {
    aspect: "Licensed Realtor Access",
    traditional: { label: "Included (even for tasks AI can do)", bad: false, neutral: true },
    smartbuy:    { label: "On demand — exactly when needed", good: true },
  },
  {
    aspect: "Offer Negotiation",
    traditional: { label: "Full agent involvement", bad: false, neutral: true },
    smartbuy:    { label: "Licensed Realtor, included in pool", good: true },
  },
  {
    aspect: "Mortgage Guidance",
    traditional: { label: "Separate lender — no coordination", bad: true },
    smartbuy:    { label: "Integrated — Bennett Liss & team", good: true },
  },
  {
    aspect: "Transaction Transparency",
    traditional: { label: "Opaque — costs revealed at closing", bad: true },
    smartbuy:    { label: "Live SAVE-o-Meter from Day 1", good: true },
  },
  {
    aspect: "Cost Visibility",
    traditional: { label: "Hidden in commission structure", bad: true },
    smartbuy:    { label: "Line-item breakdown per service", good: true },
  },
  {
    aspect: "Buyer Control",
    traditional: { label: "Agent-directed process", bad: true },
    smartbuy:    { label: "You direct — AI and experts support", good: true },
  },
];

export default function ComparisonTable() {
  return (
    <div className="w-full">
      {/* Mobile: card layout */}
      <div className="block sm:hidden space-y-4">
        {ROWS.map((row, i) => (
          <div key={i} className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 px-4 py-2">
              <p className="text-xs font-black text-slate-700 uppercase tracking-widest">{row.aspect}</p>
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-200">
              <div className="px-3 py-3 bg-red-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-1">Traditional</p>
                <div className="flex items-start gap-1.5">
                  {row.traditional.bad ? (
                    <XCircle className="h-3.5 w-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <span className="h-3.5 w-3.5 flex-shrink-0" />
                  )}
                  <p className="text-xs text-slate-600 leading-snug">{row.traditional.label}</p>
                </div>
              </div>
              <div className="px-3 py-3 bg-emerald-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">SmartBuy™</p>
                <div className="flex items-start gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700 font-medium leading-snug">{row.smartbuy.label}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: full table */}
      <div className="hidden sm:block rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="bg-slate-100 text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 w-1/3">
                What You're Comparing
              </th>
              <th className="bg-red-50 text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-red-500 w-1/3">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4" /> Traditional Buying
                </div>
              </th>
              <th className="bg-emerald-600 text-left px-6 py-4 text-xs font-black uppercase tracking-widest text-white w-1/3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> SmartBuy™ Cash-Preservation
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                <td className="px-6 py-3.5 text-xs font-black text-slate-700 uppercase tracking-wide border-b border-slate-100">
                  {row.aspect}
                </td>
                <td className="px-6 py-3.5 text-xs text-slate-500 border-b border-slate-100">
                  <div className="flex items-start gap-2">
                    {row.traditional.bad ? (
                      <XCircle className="h-3.5 w-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <span className="h-3.5 w-3.5 flex-shrink-0 text-slate-300">–</span>
                    )}
                    <span className={row.traditional.bad ? "text-slate-500" : "text-slate-600"}>{row.traditional.label}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-xs border-b border-emerald-100 bg-emerald-50/40">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-800 font-semibold">{row.smartbuy.label}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary footer */}
        <div className="grid grid-cols-3 border-t-2 border-slate-200">
          <div className="bg-slate-100 px-6 py-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Net Buyer Outcome</p>
          </div>
          <div className="bg-red-100 px-6 py-4 flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <p className="text-xs font-black text-red-700">$0 preserved · Full commission consumed</p>
          </div>
          <div className="bg-emerald-600 px-6 py-4 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-white flex-shrink-0" />
            <p className="text-xs font-black text-white">Up to $22,500 preserved on a $750K home</p>
          </div>
        </div>
      </div>
    </div>
  );
}