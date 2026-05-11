import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function OfferStage({ home, onNext }) {
  const [action, setAction] = useState(null);
  const offerCost = 1500;

  const actions = [
    { id: 'continue', label: 'Keep Searching', desc: 'Return to property search to look at other homes.' },
    { id: 'offer', label: 'Write Offer', desc: 'Proceed with offer preparation on this home.' },
  ];

  if (action === 'continue') {
    return (
      <div className="min-h-screen bg-white p-6 sm:p-8 flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <h1 className="text-3xl font-black text-slate-900 mb-4">Back to Search</h1>
          <p className="text-slate-600 mb-8">Let's find the perfect home for you.</p>
          <button onClick={() => onNext({ action: 'continue' })} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-lg">
            Back to Properties <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (action === 'offer') {
    return (
      <div className="min-h-screen bg-white p-6 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-2">Offer Preparation</h1>
            <p className="text-base text-slate-600">{home?.address}</p>
          </div>

          {/* Mandatory Package */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 mb-10">
            <p className="text-xs font-black text-amber-700 uppercase mb-2">Mandatory in California</p>
            <h3 className="text-lg font-black text-slate-900 mb-3">Offer Writing & Negotiation Package</h3>
            <ul className="text-sm text-slate-700 space-y-2 mb-4">
              <li>✓ AI-generated offer draft</li>
              <li>✓ California Realtor legal review</li>
              <li>✓ Offer submission & counteroffer handling</li>
              <li>✓ 3 hours negotiation time</li>
            </ul>
            <div className="flex items-center justify-between pt-4 border-t border-amber-200">
              <span className="font-black text-slate-900">Total Cost</span>
              <span className="text-2xl font-black text-amber-600">{offerCost} tokens</span>
            </div>
          </div>

          <button
            onClick={() => onNext({ action: 'offer', offerCost })}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700"
          >
            Proceed with Offer <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 text-xs">
          <span className="font-black text-slate-400">1-4 ✓</span>
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">5</div>
          <span className="font-black text-slate-600">Make Offer Decision</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Ready to Make an Offer?</h1>
          <p className="text-base text-slate-600">{home?.address}</p>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-10">
          {actions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setAction(opt.id)}
              className={`w-full text-left p-5 rounded-lg border-2 transition ${action === opt.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <p className="font-black text-slate-900">{opt.label}</p>
              <p className="text-sm text-slate-600 mt-1">{opt.desc}</p>
            </button>
          ))}
        </div>

        <button
          onClick={() => action && onNext({ action })}
          disabled={!action}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700 transition disabled:opacity-40"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}