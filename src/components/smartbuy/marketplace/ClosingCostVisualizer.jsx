import { useState } from "react";
import { Upload, DollarSign, CheckCircle, XCircle, Loader2, Info } from "lucide-react";
import { CLOSING_COST_ITEMS } from "./marketplaceData.js";
import { base44 } from "@/api/base44Client";

function fmt(n) {
  return Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function CostRow({ item, customAmount, onAmountChange }) {
  const [editing, setEditing] = useState(false);
  const midpoint = Math.round((item.typical[0] + item.typical[1]) / 2);
  const amount = customAmount ?? midpoint;

  return (
    <div className={`flex items-center gap-3 py-2.5 px-3 rounded-lg ${item.token_eligible ? "bg-emerald-500/5 border border-emerald-500/15" : "bg-slate-900/40 border border-slate-800"}`}>
      <div className="flex-shrink-0">
        {item.token_eligible
          ? <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          : <XCircle className="h-3.5 w-3.5 text-slate-600" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-white leading-tight">{item.label}</p>
        <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{item.note}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        {editing ? (
          <input
            type="number"
            value={amount}
            onChange={e => onAmountChange(item.id, Number(e.target.value))}
            onBlur={() => setEditing(false)}
            autoFocus
            className="w-20 px-2 py-1 text-xs rounded border border-emerald-500 bg-slate-800 text-white text-right focus:outline-none"
          />
        ) : (
          <button onClick={() => setEditing(true)} className="text-xs font-black text-white hover:text-emerald-300 transition tabular-nums">
            {fmt(amount)}
          </button>
        )}
        {item.token_eligible && (
          <p className="text-[9px] text-emerald-500 font-bold mt-0.5">✓ Token eligible</p>
        )}
      </div>
    </div>
  );
}

export default function ClosingCostVisualizer({ savingsPool = 18750 }) {
  const [amounts, setAmounts] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [aiParsed, setAiParsed] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const getAmount = (item) => amounts[item.id] ?? Math.round((item.typical[0] + item.typical[1]) / 2);

  const eligibleItems = CLOSING_COST_ITEMS.filter(i => i.token_eligible);
  const nonEligibleItems = CLOSING_COST_ITEMS.filter(i => !i.token_eligible);

  const totalEligible = eligibleItems.reduce((s, i) => s + getAmount(i), 0);
  const totalNonEligible = nonEligibleItems.reduce((s, i) => s + getAmount(i), 0);
  const totalClosing = totalEligible + totalNonEligible;
  const tokenCoverage = Math.min(savingsPool, totalEligible);
  const netOutOfPocket = totalEligible - tokenCoverage + totalNonEligible;

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            line_items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  label: { type: "string" },
                  amount: { type: "number" },
                },
              },
            },
          },
        },
      });
      if (result?.output?.line_items) {
        // Match extracted items to our known items and update amounts
        const newAmounts = { ...amounts };
        result.output.line_items.forEach(extracted => {
          const match = CLOSING_COST_ITEMS.find(known =>
            known.label.toLowerCase().includes(extracted.label?.toLowerCase?.()?.slice(0, 8) ?? "") ||
            extracted.label?.toLowerCase?.().includes(known.label.toLowerCase().slice(0, 8))
          );
          if (match && extracted.amount > 0) {
            newAmounts[match.id] = Math.round(extracted.amount);
          }
        });
        setAmounts(newAmounts);
        setAiParsed(true);
      }
      setUploadedFile(file.name);
    } catch {
      setUploadedFile(file.name);
    }
    setUploading(false);
  };

  const visibleEligible = showAll ? eligibleItems : eligibleItems.slice(0, 4);

  return (
    <div className="rounded-2xl border border-rose-500/20 bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-800">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
            <DollarSign className="h-4 w-4 text-rose-400" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Closing Cost Token Visualizer</p>
            <p className="text-xs text-slate-400 mt-0.5">
              See which closing costs your SmartBuy™ Savings Pool can offset at settlement.
              <span className="text-amber-400 font-semibold"> Token credits are applied at closing — not before.</span>
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        {/* Upload your own closing disclosure */}
        <div className="mb-5 rounded-xl border border-dashed border-slate-700 hover:border-slate-500 transition bg-slate-900/60 p-4">
          <label className="cursor-pointer flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
              {uploading ? <Loader2 className="h-4 w-4 text-slate-400 animate-spin" /> : <Upload className="h-4 w-4 text-slate-400" />}
            </div>
            <div className="flex-1">
              {uploadedFile ? (
                <>
                  <p className="text-xs font-bold text-white">{uploadedFile}</p>
                  <p className="text-[10px] text-emerald-400">{aiParsed ? "✓ AI extracted line items — amounts updated below" : "Uploaded — using estimates"}</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-slate-300">Upload your Closing Disclosure or Loan Estimate</p>
                  <p className="text-[10px] text-slate-500">PDF or image · AI reads your actual line items automatically</p>
                </>
              )}
            </div>
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-slate-800 rounded-xl p-3 text-center">
            <p className="text-[10px] text-slate-400 mb-1">Your Savings Pool</p>
            <p className="text-base font-black text-emerald-400">{fmt(savingsPool)}</p>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
            <p className="text-[10px] text-slate-400 mb-1">Token-Eligible Costs</p>
            <p className="text-base font-black text-emerald-300">{fmt(totalEligible)}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-3 text-center">
            <p className="text-[10px] text-slate-400 mb-1">Est. Net Out-of-Pocket</p>
            <p className="text-base font-black text-white">{fmt(Math.max(0, netOutOfPocket))}</p>
          </div>
        </div>

        {/* Coverage bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-slate-400 font-semibold">Savings Pool Coverage</span>
            <span className="text-[10px] text-emerald-400 font-bold">{fmt(tokenCoverage)} of {fmt(totalEligible)} covered</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (tokenCoverage / Math.max(totalEligible, 1)) * 100)}%` }}
            />
          </div>
          <p className="text-[9px] text-slate-600 mt-1">
            {savingsPool >= totalEligible
              ? "✓ Your savings pool covers all token-eligible closing costs"
              : `Pool covers ${Math.round((tokenCoverage / totalEligible) * 100)}% of eligible costs — remainder paid at close`}
          </p>
        </div>

        {/* Token-eligible items */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Payable with Token Credits at Closing</p>
          </div>
          <div className="space-y-1.5">
            {visibleEligible.map(item => (
              <CostRow key={item.id} item={item} customAmount={amounts[item.id]} onAmountChange={(id, val) => setAmounts(a => ({ ...a, [id]: val }))} />
            ))}
          </div>
          {eligibleItems.length > 4 && (
            <button onClick={() => setShowAll(v => !v)} className="mt-2 text-[10px] text-emerald-400 hover:text-emerald-300 transition font-bold">
              {showAll ? "Show less ↑" : `Show all ${eligibleItems.length} eligible items ↓`}
            </button>
          )}
        </div>

        {/* Non-eligible items (collapsed) */}
        <details className="group">
          <summary className="cursor-pointer flex items-center gap-2 mb-2 list-none">
            <XCircle className="h-3.5 w-3.5 text-slate-600" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Lender Fees — Not Covered by Token Credits</p>
            <Info className="h-3 w-3 text-slate-600 ml-auto" />
          </summary>
          <div className="space-y-1.5 mt-2">
            {nonEligibleItems.map(item => (
              <CostRow key={item.id} item={item} customAmount={amounts[item.id]} onAmountChange={(id, val) => setAmounts(a => ({ ...a, [id]: val }))} />
            ))}
          </div>
          <p className="text-[10px] text-slate-600 mt-3 leading-relaxed">
            Lender fees are separate from the buyer commission rebate and cannot be paid with SmartBuy™ token credits. These are negotiated directly with your lender.
          </p>
        </details>

        <p className="text-[10px] text-slate-600 mt-4 text-center leading-relaxed">
          Amounts are estimates based on typical CA closing costs. Click any amount to customize. Upload your actual Closing Disclosure for precise figures.
          Final token application subject to lender and escrow approval at closing.
        </p>
      </div>
    </div>
  );
}