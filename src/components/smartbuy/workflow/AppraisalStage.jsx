import { useState } from "react";
import { ArrowRight, AlertCircle } from "lucide-react";

export default function AppraisalStage({ onNext }) {
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <div className="min-h-screen bg-white p-6 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-black text-blue-900 mb-2">Appraisal Ordered</p>
                <p className="text-sm text-blue-800">The lender has ordered the property appraisal. This typically takes 7-10 business days.</p>
              </div>
            </div>
          </div>

          {/* Optional Services */}
          <div className="mb-10">
            <p className="text-xs font-black uppercase text-slate-600 mb-4">Optional Services</p>
            <div className="space-y-3">
              <div className="p-4 border border-slate-200 rounded-lg">
                <p className="font-black text-slate-900">Rush Appraisal Coordination</p>
                <p className="text-xs text-slate-500 mt-1">Expedite the appraisal if closing timeline is tight</p>
                <p className="text-sm font-black text-amber-600 mt-2">750 tokens</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNext({ appraised: true })}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700"
          >
            Continue to Closing <ArrowRight className="h-4 w-4" />
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
          <span className="font-black text-slate-400">1-8 ✓</span>
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">9</div>
          <span className="font-black text-slate-600">Appraisal</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Appraisal Phase</h1>
          <p className="text-slate-600">The lender will order an appraisal to confirm the property value supports your loan amount.</p>
        </div>

        {/* Timeline */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-10">
          <p className="text-xs font-black uppercase text-slate-600 mb-4">Typical Timeline</p>
          <div className="space-y-3">
            <div className="flex gap-4">
              <span className="font-black text-emerald-600 flex-shrink-0">7-10 days</span>
              <span className="text-slate-600">Appraisal completion</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <p className="text-sm text-blue-900">
            <span className="font-black">💡 Note:</span> Appraisal fees are handled separately in closing costs and don't deduct from your SmartBuy™ savings pool.
          </p>
        </div>

        <button
          onClick={() => setConfirmed(true)}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700"
        >
          Understand & Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}