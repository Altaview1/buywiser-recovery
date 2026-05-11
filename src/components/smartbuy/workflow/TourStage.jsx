import { AlertCircle, Zap, CreditCard, Calendar, ArrowRight } from "lucide-react";

export default function TourStage({ onContinue }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Warning Banner */}
        <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-black text-blue-900 mb-2">Understanding Tour Costs</p>
              <p className="text-sm text-blue-800 leading-relaxed mb-2">
                Traditional real estate commissions are consumed early through showings, consultations, and touring coordination. SmartBuy™ makes this transparent.
              </p>
              <p className="text-sm text-blue-800 leading-relaxed">
                <strong>Each property tour through SmartBuy™ costs 50 tokens</strong> because licensed showing agents and scheduling services are involved.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Gate */}
        <div className="bg-white rounded-2xl border-2 border-slate-300 p-8 mb-8">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Payment Method Required</h2>
          
          <p className="text-slate-600 mb-6">
            Before scheduling property tours, we need a backup payment method. If you don't ultimately close through SmartBuy™, certain third-party tour and consultation costs may be billed directly to cover vendor exposure.
          </p>

          <div className="space-y-4 mb-8">
            {/* Card Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Credit Card</label>
              <input
                type="text"
                placeholder="4532 1234 5678 9010"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* CVC & Expiry */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Expiry</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">CVC</label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          <button
            onClick={onContinue}
            className="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 transition text-base"
          >
            Add Payment Method & Continue
          </button>
        </div>

        {/* Tour Pricing Explainer */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
          <h3 className="font-black text-slate-900 mb-4">Tour Pricing</h3>
          
          <div className="space-y-3">
            {[
              { label: "Single Property Tour", cost: 50, desc: "Licensed agent coordination, scheduling" },
              { label: "Multiple Tours (Same Day)", cost: 80, desc: "Full showing circuit with coordination" },
              { label: "Additional Realtor Guidance", cost: "80/hr", desc: "Extended consultation during tours" }
            ].map((item, i) => (
              <div key={i} className="flex items-start justify-between p-3 bg-white rounded-lg border border-slate-200">
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-600">{item.desc}</p>
                </div>
                <div className="flex items-center gap-1 font-black text-amber-600">
                  <Zap className="h-4 w-4" />
                  {item.cost}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-600 mt-4 leading-relaxed">
            <strong>Important:</strong> You're still preserving substantial savings because these costs are transparent and only incurred when you actually schedule tours—unlike traditional agent relationships where commission is baked in from day one.
          </p>
        </div>
      </div>
    </div>
  );
}