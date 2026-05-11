import { Brain, Users, MessageSquare, Zap, Lock, Unlock, ArrowRight, DollarSign } from "lucide-react";
import { useState } from "react";
import { WORKFLOW_COSTS, formatPrice } from "../pricing/servicePricing";

export default function ConsultationStage({ onContinue }) {
  const [completed, setCompleted] = useState({
    aiConsulted: false,
    expertConsulted: false,
    decidedOnOffer: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-purple-900 mb-4">
            Your Property Questions Answered
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get expert guidance on your property without expensive consultant fees. Start free with AI, escalate to licensed professionals only if needed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* AI Consultation - FREE */}
          <div className="bg-white rounded-2xl border-2 border-emerald-300 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="h-6 w-6 text-emerald-600" />
              <h2 className="text-2xl font-black text-emerald-900">SmartBuy AI™</h2>
            </div>
            <div className="inline-block px-3 py-1 bg-emerald-100 border border-emerald-400 rounded-full mb-4">
              <span className="text-[10px] font-black text-emerald-700 uppercase">Free • Always Available</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xs flex-shrink-0">✓</div>
                <div>
                  <p className="font-semibold text-slate-900">AI Mortgage Broker</p>
                  <p className="text-xs text-slate-600">Affordability estimates, payment scenarios, down payment analysis, loan comparisons</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xs flex-shrink-0">✓</div>
                <div>
                  <p className="font-semibold text-slate-900">AI Realtor</p>
                  <p className="text-xs text-slate-600">Offer guidance, neighborhood analysis, market competitiveness, pricing analysis</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-xs flex-shrink-0">✓</div>
                <div>
                  <p className="font-semibold text-slate-900">AI Market Analyst</p>
                  <p className="text-xs text-slate-600">Neighborhood trends, investment metrics, risk assessment</p>
                </div>
              </div>
            </div>

            <button className="w-full py-3 bg-emerald-500 text-white font-black rounded-xl hover:bg-emerald-600 transition text-sm">
              Start AI Consultation
            </button>

            <p className="text-[10px] text-slate-500 text-center mt-3">
              Use AI first to reduce token spending and preserve savings
            </p>
          </div>

          {/* Professional Escalation - TOKEN COST */}
          <div className="bg-white rounded-2xl border-2 border-amber-300 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-6 w-6 text-amber-600" />
              <h2 className="text-2xl font-black text-amber-900">Licensed Professionals</h2>
            </div>
            <div className="inline-block px-3 py-1 bg-amber-100 border border-amber-400 rounded-full mb-4">
              <span className="text-[10px] font-black text-amber-700 uppercase">Optional • On-Demand</span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-slate-900 text-sm">Speak to Mortgage Broker</p>
                  <div className="flex items-center gap-1 font-black text-blue-600">
                    <DollarSign className="h-3.5 w-3.5" /> {formatPrice(WORKFLOW_COSTS.consultation_broker)}
                  </div>
                </div>
                <p className="text-xs text-slate-600">Direct call with licensed broker · Rate guidance · Program review</p>
              </div>

              <div className="p-4 rounded-lg border border-purple-200 bg-purple-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-slate-900 text-sm">Speak to 5-Star Realtor</p>
                  <div className="flex items-center gap-1 font-black text-purple-600">
                    <DollarSign className="h-3.5 w-3.5" /> {formatPrice(WORKFLOW_COSTS.consultation_realtor)}
                  </div>
                </div>
                <p className="text-xs text-slate-600">Direct call with top agent · Offer strategy · Negotiation coaching</p>
              </div>

              <div className="p-4 rounded-lg border border-rose-200 bg-rose-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-slate-900 text-sm">Senior Transaction Strategist</p>
                  <div className="flex items-center gap-1 font-black text-rose-600">
                    <DollarSign className="h-3.5 w-3.5" /> {formatPrice(WORKFLOW_COSTS.consultation_strategist)}
                  </div>
                </div>
                <p className="text-xs text-slate-600">Premium consultation · Complex situations · Full transaction strategy</p>
              </div>
            </div>

            <button className="w-full py-3 border-2 border-amber-600 text-amber-900 font-black rounded-xl hover:bg-amber-50 transition text-sm">
              Unlock Professional Access
            </button>

            <p className="text-[10px] text-slate-500 text-center mt-3">
              Not tied to one professional—access modular expertise as needed
            </p>
          </div>
        </div>

        {/* Psychology of Approach */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 mb-8">
          <p className="font-black text-slate-900 mb-3">💡 The SmartBuy™ Advantage</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            You're not locked into one Realtor or lender. You're selectively accessing expertise only when needed. This preserves your negotiating power and keeps you in control of every decision. Traditional agent relationships consume commission before you even start—SmartBuy™ lets you explore affordably with AI first.
          </p>
        </div>

        {/* Progress Tracking */}
        <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 mb-8">
          <p className="font-black text-purple-900 mb-4 flex items-center gap-2">
            <span>📋</span> Consultation Progress
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-purple-50 transition">
              <input
                type="checkbox"
                checked={completed.aiConsulted}
                onChange={(e) => setCompleted({ ...completed, aiConsulted: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-purple-400 accent-purple-500 cursor-pointer"
              />
              <span className={`text-sm font-semibold ${completed.aiConsulted ? "text-emerald-700 line-through text-slate-500" : "text-slate-900"}`}>
                ✓ Used AI SmartBuy™ consultation
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-purple-50 transition">
              <input
                type="checkbox"
                checked={completed.expertConsulted}
                onChange={(e) => setCompleted({ ...completed, expertConsulted: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-purple-400 accent-purple-500 cursor-pointer"
              />
              <span className={`text-sm font-semibold ${completed.expertConsulted ? "text-emerald-700 line-through text-slate-500" : "text-slate-900"}`}>
                ✓ Spoke with licensed professional (optional)
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-purple-50 transition">
              <input
                type="checkbox"
                checked={completed.decidedOnOffer}
                onChange={(e) => setCompleted({ ...completed, decidedOnOffer: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-purple-400 accent-purple-500 cursor-pointer"
              />
              <span className={`text-sm font-semibold ${completed.decidedOnOffer ? "text-emerald-700 line-through text-slate-500" : "text-slate-900"}`}>
                ✓ Ready to make an offer on this property
              </span>
            </label>
          </div>
        </div>

        {/* Loan Submission Section */}
        <div className="bg-white rounded-2xl border-2 border-blue-200 p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-lg">
              📋
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Ready to Apply?</h3>
              <p className="text-slate-600 leading-relaxed">
                Start your formal loan application with Blink Mortgage. It takes 10-15 minutes, and AI will answer any questions along the way.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Self-guided option */}
            <a
              href="https://www.blink.mortgage/app/signup/p/Buywiser/bennettliss?campaign=BennettLiss"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col gap-3 p-5 border-2 border-emerald-300 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <p className="font-black text-emerald-900">AI-Guided (Free)</p>
              </div>
              <p className="text-sm text-emerald-800">
                Complete the application yourself. AI chatbot answers any questions instantly.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mt-auto">
                <span>→ Start Application</span>
              </div>
            </a>

            {/* Hand-held option */}
            <button
              onClick={() => alert('Hand-held guidance: A licensed loan officer will walk you through the application process step-by-step. Cost: $25 (deducted from your token pool).\n\nThis option is available by calling (818) 300-2642 or through your SmartBuy dashboard.')}
              className="flex flex-col gap-3 p-5 border-2 border-amber-300 bg-amber-50 rounded-xl hover:bg-amber-100 transition text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="font-black text-amber-900">Hand-Held Guidance</p>
                    <p className="text-xs text-amber-700 font-bold">-$25 from savings pool</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-amber-800">
                Licensed loan officer walks you through every step. One-on-one support for complex situations.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold mt-auto">
                <span>→ Request Assistance</span>
              </div>
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center mt-6 leading-relaxed">
            Both options are secure and encrypted. Your data is protected by Blink Mortgage's security standards and our compliance team. Questions? Call <span className="font-bold text-slate-700">(818) 300-2642</span>
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={onContinue}
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white font-black rounded-xl hover:bg-purple-700 transition text-base"
          >
            Serious About This Property? Make Offer <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}