import { Zap, Search, DollarSign, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import SavingsMeter from "../SavingsMeter";
import { formatPrice } from "../pricing/servicePricing";

export default function HomeSearchStage({ onPropertySubmit }) {
  const [completed, setCompleted] = useState({
    search: false,
    understand: false,
  });

  const handlePasteLink = (e) => {
    const url = prompt("Paste your Zillow, Redfin, or property link:");
    if (url) {
      // For now, just transition to next stage
      // In production, would fetch property data and calculate savings
      onPropertySubmit({ url, price: 750000 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-amber-900 mb-4 leading-tight">
            Smart Home Search,<br />
            <span className="text-emerald-600">Smarter Savings</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Paste any property link—we'll show you your SmartBuy™ savings potential before you commit to anything.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left: Input */}
          <div>
            <div className="bg-white rounded-2xl border-2 border-yellow-300 p-8 shadow-sm">
              <h2 className="text-lg font-black text-amber-900 mb-4">Find Your Home</h2>
              <p className="text-sm text-slate-600 mb-6">Paste a link from any listing site—Zillow, Redfin, Realtor.com, or anywhere.</p>

              <button
                onClick={handlePasteLink}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-yellow-400 text-amber-900 font-black rounded-xl hover:bg-yellow-300 transition text-base mb-4"
              >
                <Search className="h-5 w-5" /> Paste Property Link
              </button>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-slate-500 font-semibold">OR</span>
                </div>
              </div>

              <input
                type="number"
                placeholder="Enter target purchase price..."
                defaultValue={750000}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />

              <button className="w-full px-6 py-3 border-2 border-amber-600 text-amber-900 font-black rounded-xl hover:bg-amber-50 transition text-sm">
                Calculate Savings
              </button>

              {/* Tips */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900 font-semibold mb-2">💡 Tip: Search First, Consult Later</p>
                <p className="text-[10px] text-blue-800 leading-relaxed">
                  Browse homes affordably with AI. Only use professional consultants when you find something serious.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Savings Preview */}
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-black text-amber-900 mb-4">Your SmartBuy™ Potential</h2>
              <SavingsMeter price={750000} animated={false} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  <span className="text-[10px] font-black text-emerald-700 uppercase">Commission Savings</span>
                </div>
                <p className="text-xl font-black text-emerald-700">{formatPrice(750000 * 0.025)}</p>
                <p className="text-[10px] text-emerald-600">2.5% buyer rebate</p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-[10px] font-black text-blue-700 uppercase">Service Flexibility</span>
                </div>
                <p className="text-xl font-black text-blue-700">Pay-as-You-Go</p>
                <p className="text-[10px] text-blue-600">Only for services used</p>
              </div>
            </div>

            {/* Education Box */}
            <div className="mt-6 p-5 rounded-xl border-l-4 border-amber-500 bg-amber-50">
              <p className="text-sm font-bold text-amber-900 mb-2">📚 How SmartBuy™ Works</p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Traditional agents consume commission through showing coordination, tours, and consultations early on. SmartBuy™ lets you explore affordably with AI first, then pay transparently for expertise only when you need it.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Tracking */}
        <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 mb-8">
          <p className="font-black text-amber-900 mb-4 flex items-center gap-2">
            <span>📋</span> Track Your Progress
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-amber-50 transition">
              <input
                type="checkbox"
                checked={completed.search}
                onChange={(e) => setCompleted({ ...completed, search: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-amber-400 accent-amber-500 cursor-pointer"
              />
              <span className={`text-sm font-semibold ${completed.search ? "text-emerald-700 line-through text-slate-500" : "text-slate-900"}`}>
                ✓ Searched for properties and found options
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-amber-50 transition">
              <input
                type="checkbox"
                checked={completed.understand}
                onChange={(e) => setCompleted({ ...completed, understand: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-amber-400 accent-amber-500 cursor-pointer"
              />
              <span className={`text-sm font-semibold ${completed.understand ? "text-emerald-700 line-through text-slate-500" : "text-slate-900"}`}>
                ✓ Understand my SmartBuy™ savings potential
              </span>
            </label>
          </div>
        </div>

        {/* Next Step CTA */}
        <div className="text-center">
          <p className="text-slate-600 mb-4">Ready to tour a property?</p>
          <button
            onClick={() => onPropertySubmit({ price: 750000 })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-black rounded-xl hover:bg-amber-600 transition text-base"
          >
            Schedule a Tour <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}