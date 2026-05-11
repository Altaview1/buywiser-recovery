import { AlertCircle, CheckCircle, Lock, Zap, ArrowRight } from "lucide-react";

export default function OfferStage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-rose-900 mb-4">
            Ready to Make an Offer?
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            California law requires licensed Realtor supervision for contract preparation and negotiation. SmartBuy™ provides this transparently.
          </p>
        </div>

        {/* Mandatory Realtor Package */}
        <div className="bg-white rounded-2xl border-3 border-rose-400 p-8 mb-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="h-6 w-6 text-rose-600" />
            <h2 className="text-2xl font-black text-rose-900">Offer Preparation & Negotiation Package</h2>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-black text-rose-700">1500</span>
            <Zap className="h-5 w-5 text-amber-500" />
            <span className="text-base font-black text-slate-600">MANDATORY</span>
          </div>

          <p className="text-sm text-slate-700 mb-6 leading-relaxed">
            This is required by California law and includes everything needed to submit a compliant, competitive offer:
          </p>

          <div className="space-y-3 mb-8">
            {[
              "AI-generated offer draft (customized to market conditions)",
              "California Realtor legal review (contract compliance)",
              "Realtor approval & strategy optimization",
              "Professional offer submission to seller's agent",
              "Counteroffer handling and response strategy",
              "Up to 3 hours of Realtor negotiation time",
              "Contract review and terms optimization"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-1" />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>

          <button className="w-full py-4 bg-rose-600 text-white font-black rounded-xl hover:bg-rose-700 transition text-base mb-3">
            Prepare & Submit Offer
          </button>

          <p className="text-xs text-slate-600 text-center">
            By clicking above, you confirm you understand and accept that the offer package cost (1500 tokens) is mandatory for California-compliant contract preparation.
          </p>
        </div>

        {/* Additional Services */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 mb-8">
          <h3 className="font-black text-slate-900 mb-4">If Negotiations Get Complex...</h3>
          
          <div className="space-y-3">
            <div className="flex items-start justify-between p-4 bg-white rounded-lg border border-slate-200">
              <div>
                <p className="font-bold text-slate-900">Extended Realtor Negotiation Time</p>
                <p className="text-xs text-slate-600 mt-1">Difficult sellers · Multiple bidding rounds · Complex strategy discussions</p>
              </div>
              <div className="flex items-center gap-1 font-black text-amber-600 flex-shrink-0">
                <Zap className="h-4 w-4" />
                80/hr
              </div>
            </div>

            <p className="text-xs text-slate-600">
              The 1500-token package includes 3 hours. Additional negotiation is billed hourly if needed.
            </p>
          </div>
        </div>

        {/* Education Box */}
        <div className="bg-rose-50 rounded-2xl border-l-4 border-rose-500 p-6">
          <p className="font-black text-rose-900 mb-3">📚 Why This Matters</p>
          <p className="text-sm text-rose-800 leading-relaxed mb-3">
            California law requires licensed Realtor supervision for contract preparation and negotiation. This isn't optional—it's mandatory for legal compliance.
          </p>
          <p className="text-sm text-rose-800 leading-relaxed">
            <strong>The SmartBuy™ advantage:</strong> You're not locked into a traditional agent relationship that consumes commission upfront. You've explored affordably with AI, consulted on-demand, and now you're paying transparently for essential legal services only at the moment you need them.
          </p>
        </div>
      </div>
    </div>
  );
}