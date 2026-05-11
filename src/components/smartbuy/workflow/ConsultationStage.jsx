import { useState } from "react";
import { ArrowRight, Brain, Users } from "lucide-react";

export default function ConsultationStage({ home, savingsPool, onNext }) {
  const [choice, setChoice] = useState(null);

  const options = [
    { id: 'ai', label: 'AI Mortgage & Realtor Guidance', cost: 0, desc: 'Get AI analysis on price fairness, payments, and strategy.' },
    { id: 'realtor', label: 'Licensed Realtor Consultation', cost: 300, desc: 'Speak directly to an expert negotiator about this property.' },
    { id: 'broker', label: 'Mortgage Broker Consultation', cost: 250, desc: 'Discuss loan programs, rates, and financing strategy.' },
  ];

  return (
    <div className="min-h-screen bg-white p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 text-xs">
          <span className="font-black text-slate-400">1-3 ✓</span>
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">4</div>
          <span className="font-black text-slate-600">Consultation</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Is This Home Right?</h1>
          <p className="text-base text-slate-600 mb-4">{home?.address}</p>
          <p className="text-slate-600">Get guidance on price, negotiation strategy, and financing before committing to an offer.</p>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-10">
          {options.map(opt => (
            <button
              key={opt.id}
              onClick={() => setChoice(opt.id)}
              className={`w-full text-left p-5 rounded-lg border-2 transition ${choice === opt.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-black text-slate-900">{opt.label}</p>
                  <p className="text-sm text-slate-600 mt-1">{opt.desc}</p>
                </div>
                <span className={`font-black whitespace-nowrap ml-4 ${opt.cost > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {opt.cost > 0 ? `${opt.cost} tokens` : 'Free'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Advisory */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <p className="text-sm text-blue-900">
            <span className="font-black">💡 Smart Move:</span> Start with free AI guidance. Only spend tokens if you need direct expert advice.
          </p>
        </div>

        <button
          onClick={() => choice && onNext({ consulted: true })}
          disabled={!choice}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700 transition disabled:opacity-40"
        >
          Get Guidance <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}