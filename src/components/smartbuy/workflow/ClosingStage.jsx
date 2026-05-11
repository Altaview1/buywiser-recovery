import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function ClosingStage({ savingsPool, tokensSpent }) {
  const [showFinal, setShowFinal] = useState(false);
  const remaining = savingsPool - tokensSpent;

  if (showFinal) {
    return (
      <div className="min-h-screen bg-emerald-50 p-6 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">Congratulations!</h1>
            <p className="text-lg text-slate-700">You've closed on your home. Here's what you kept.</p>
          </div>

          {/* Final Summary */}
          <div className="bg-white border-2 border-emerald-300 rounded-lg p-8 space-y-6 mb-10">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200">
              <span className="text-sm font-black text-slate-900 uppercase">Original SmartBuy™ Pool</span>
              <span className="text-2xl font-black text-slate-900">${savingsPool.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between pb-6 border-b border-slate-200">
              <span className="text-sm font-black text-slate-900 uppercase">Tokens Spent on Services</span>
              <span className="text-2xl font-black text-red-600">−${tokensSpent.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between pt-2 bg-emerald-50 p-4 rounded">
              <span className="text-sm font-black text-emerald-900 uppercase">Your Preserved Savings</span>
              <span className="text-3xl font-black text-emerald-700">${remaining.toLocaleString()}</span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
              <p className="text-xs font-black text-slate-600 uppercase mb-2">Commission Saved</p>
              <p className="text-2xl font-black text-emerald-600">{Math.round((remaining / savingsPool) * 100)}%</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
              <p className="text-xs font-black text-slate-600 uppercase mb-2">Monthly Benefit</p>
              <p className="text-2xl font-black text-emerald-600">Lower P&I</p>
            </div>
          </div>

          {/* Message */}
          <div className="bg-emerald-100 border-2 border-emerald-600 rounded-lg p-6 text-center">
            <p className="text-lg font-black text-emerald-900 mb-2">You Just Disrupted the Market</p>
            <p className="text-sm text-emerald-800">You intelligently controlled your transaction, selectively used experts where necessary, and preserved a meaningful amount of transaction economics.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 text-xs">
          <span className="font-black text-slate-400">1-9 ✓</span>
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">10</div>
          <span className="font-black text-slate-600">Closing & Disbursement</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Clear to Close</h1>
          <p className="text-slate-600">All conditions have been met. Final signatures and funding are underway.</p>
        </div>

        {/* Closing Checklist */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-10">
          <p className="text-xs font-black uppercase text-slate-600 mb-4">Final Steps</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm text-slate-700">Underwriting conditions satisfied</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm text-slate-700">Final walkthrough completed</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm text-slate-700">Closing disclosures reviewed</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              <span className="text-sm text-slate-700">Funds wired & recording ready</span>
            </div>
          </div>
        </div>

        {/* Savings Summary Preview */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-10">
          <p className="text-xs font-black uppercase text-emerald-700 mb-3">Your SmartBuy™ Outcome</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700">Original Pool</span>
              <span className="font-black text-slate-900">${savingsPool.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700">Tokens Spent</span>
              <span className="font-black text-slate-900">−${tokensSpent.toLocaleString()}</span>
            </div>
            <div className="border-t border-emerald-300 pt-2 flex items-center justify-between text-sm">
              <span className="font-black text-emerald-900">You Keep</span>
              <span className="text-xl font-black text-emerald-700">${remaining.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowFinal(true)}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700"
        >
          See Final Summary <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}