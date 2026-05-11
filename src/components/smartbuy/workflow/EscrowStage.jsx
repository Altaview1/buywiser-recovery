import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";

export default function EscrowStage({ onNext }) {
  const coordinatorCost = 550;
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <div className="min-h-screen bg-white p-6 sm:p-8 flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Offer Accepted!</h1>
          <p className="text-slate-600 mb-8">Escrow has opened. Your transaction coordinator is now managing the timeline and coordinating all parties.</p>
          <button
            onClick={() => onNext({ escrowOpened: true })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-lg"
          >
            Move to Inspections <ArrowRight className="h-4 w-4" />
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
          <span className="font-black text-slate-400">1-5 ✓</span>
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">6</div>
          <span className="font-black text-slate-600">Escrow Opened</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Your Offer Was Accepted!</h1>
          <p className="text-slate-600">Escrow is now open. We need to assign a transaction coordinator to manage the complexity ahead.</p>
        </div>

        {/* Mandatory Service */}
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-lg p-6 mb-10">
          <p className="text-xs font-black text-emerald-700 uppercase mb-2">Essential Service</p>
          <h3 className="text-lg font-black text-slate-900 mb-3">Personal Transaction Coordinator</h3>
          <ul className="text-sm text-slate-700 space-y-2 mb-6">
            <li>✓ Escrow & timeline coordination</li>
            <li>✓ Contingency tracking</li>
            <li>✓ Disclosure management</li>
            <li>✓ Signature follow-up</li>
            <li>✓ Milestone notifications</li>
          </ul>
          <div className="flex items-center justify-between pt-4 border-t border-emerald-200">
            <span className="font-black text-slate-900">Cost</span>
            <span className="text-2xl font-black text-emerald-600">{coordinatorCost} tokens</span>
          </div>
        </div>

        {/* Advisory */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <p className="text-sm text-blue-900">
            <span className="font-black">📋 What's Ahead:</span> Inspections, appraisal, underwriting, and final walkthrough. Your coordinator keeps everything on track.
          </p>
        </div>

        <button
          onClick={() => setConfirmed(true)}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700"
        >
          Assign Coordinator <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}