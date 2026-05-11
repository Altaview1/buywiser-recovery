import { Zap, Search, DollarSign, TrendingUp, ArrowRight, CheckCircle2, MapPin, Zap as ZapIcon } from "lucide-react";
import { useState } from "react";
import SavingsMeter from "../SavingsMeter";
import { formatPrice } from "../pricing/servicePricing";

export default function HomeSearchStage({ onPropertySubmit }) {
  const [price, setPrice] = useState(750000);
  const [address, setAddress] = useState("");
  const [completed, setCompleted] = useState({
    search: false,
    understand: false,
  });

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    // Extract price from address if it's a number
    const priceMatch = value.match(/\$?([\d,]+)/);
    if (priceMatch) {
      const extractedPrice = parseInt(priceMatch[1].replace(/,/g, ""), 10);
      if (extractedPrice > 0 && extractedPrice < 10000000) {
        setPrice(extractedPrice);
      }
    }
  };

  const handlePasteLink = (e) => {
    const url = prompt("Paste your Zillow, Redfin, or property link:");
    if (url) {
      // For now, just transition to next stage
      // In production, would fetch property data and calculate savings
      onPropertySubmit({ url, price });
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left: Live Address Input */}
          <div>
            <div className="bg-white rounded-2xl border-2 border-yellow-300 p-8 shadow-sm sticky top-32">
              <h2 className="text-lg font-black text-amber-900 mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Find Your Home
              </h2>
              <p className="text-sm text-slate-600 mb-6">Enter an address or listing link to see your savings in real-time.</p>

              {/* Live Address Input */}
              <div className="mb-6">
                <label className="block text-xs font-black text-slate-700 mb-2 uppercase">Property Address or Link</label>
                <input
                  type="text"
                  placeholder="123 Main St, Los Angeles, CA 90001 or paste a Zillow link..."
                  value={address}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-4 border-2 border-yellow-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                />
                <p className="text-[10px] text-slate-500 mt-1">Updates automatically as you type</p>
              </div>

              {/* Or enter price manually */}
              <div>
                <label className="block text-xs font-black text-slate-700 mb-2 uppercase">Or Enter Price Directly</label>
                <div className="flex gap-2">
                  <DollarSign className="h-10 w-10 text-slate-400 flex items-center justify-center flex-shrink-0 bg-slate-100 rounded-lg" />
                  <input
                    type="number"
                    placeholder="750000"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value) || 750000)}
                    className="flex-1 px-4 py-3 border-2 border-yellow-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  />
                </div>
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-900 font-semibold mb-2">💡 Tip: Search First, Consult Later</p>
                <p className="text-[10px] text-blue-800 leading-relaxed">
                  Browse homes affordably with AI. Only use professional consultants when you find something serious.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Live Savings Meter */}
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-black text-amber-900 mb-2 flex items-center gap-2">
                <ZapIcon className="h-5 w-5 text-amber-500" /> Your SmartBuy™ Savings
              </h2>
              <p className="text-xs text-slate-600 mb-4">Updates in real-time as you adjust the price</p>
              <SavingsMeter price={price} animated={true} />
            </div>

            {/* Live Savings Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 transition">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  <span className="text-[10px] font-black text-emerald-700 uppercase">Commission Savings</span>
                </div>
                <p className="text-2xl font-black text-emerald-700">{formatPrice(price * 0.025)}</p>
                <p className="text-[10px] text-emerald-600">2.5% buyer rebate</p>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-[10px] font-black text-blue-700 uppercase">Service Budget</span>
                </div>
                <p className="text-2xl font-black text-blue-700">{formatPrice(price * 0.015)}</p>
                <p className="text-[10px] text-blue-600">For AI & pro services</p>
              </div>
            </div>

            {/* Education Box */}
            <div className="p-5 rounded-xl border-l-4 border-amber-500 bg-amber-50">
              <p className="text-sm font-bold text-amber-900 mb-2">📚 How Your Savings Work</p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Your entire 2.5% rebate goes into a savings pool. Use AI for free analysis first. Only activate licensed professionals when you find a serious property and need paid guidance.
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
            onClick={() => onPropertySubmit({ price })}
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-white font-black rounded-xl hover:bg-amber-600 transition text-base"
          >
            Schedule a Tour <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}