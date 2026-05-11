import { useState } from "react";
import { DollarSign, ArrowRight, Zap } from "lucide-react";

export default function PrequalificationStage({ onNext }) {
  const [income, setIncome] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");

  const maxPrice = downPayment ? Math.round(parseFloat(downPayment) / 0.2) : 0;
  const monthlyPayment = purchasePrice ? Math.round((parseFloat(purchasePrice) * 0.008)) : 0;
  const savingsPool = purchasePrice ? Math.round(parseFloat(purchasePrice) * 0.025) : 0;

  const handleNext = () => {
    if (income && downPayment && purchasePrice) {
      onNext({ income, downPayment, purchasePrice, savingsPool });
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black">1</div>
            <span className="text-xs font-black uppercase text-slate-600">Prequalification</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">What's Your Buying Power?</h1>
          <p className="text-base text-slate-600">Let's determine your home purchase budget and SmartBuy™ savings potential.</p>
        </div>

        {/* Form */}
        <div className="space-y-6 mb-10">
          <div>
            <label className="block text-sm font-black text-slate-800 mb-2">Annual Income</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                value={income}
                onChange={e => setIncome(e.target.value)}
                placeholder="150000"
                className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-800 mb-2">Down Payment Available</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                value={downPayment}
                onChange={e => setDownPayment(e.target.value)}
                placeholder="150000"
                className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-800 mb-2">Target Purchase Price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                value={purchasePrice}
                onChange={e => setPurchasePrice(e.target.value)}
                placeholder="750000"
                className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {purchasePrice && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Estimated Monthly Payment</p>
              <p className="text-2xl font-black text-slate-900">${monthlyPayment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">SmartBuy™ Savings Pool</p>
              <p className="text-2xl font-black text-emerald-600">${savingsPool.toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* AI Guidance */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10">
          <p className="text-sm text-blue-900 leading-relaxed">
            <span className="font-black">💡 Pro Tip:</span> You can get significant mortgage guidance from our AI broker before spending any tokens. Ask about loan programs, rate scenarios, or down payment strategies.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={handleNext}
          disabled={!income || !downPayment || !purchasePrice}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Continue to Property Search <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}