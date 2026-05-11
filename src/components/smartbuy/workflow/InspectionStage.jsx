import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const INSPECTIONS = [
  { id: 'general', label: 'General Home Inspection', cost: 400, mandatory: true },
  { id: 'roof', label: 'Roof Inspection', cost: 250, mandatory: false },
  { id: 'foundation', label: 'Foundation Inspection', cost: 350, mandatory: false },
  { id: 'sewer', label: 'Sewer Scope', cost: 250, mandatory: false },
  { id: 'pool', label: 'Pool Inspection', cost: 250, mandatory: false },
];

export default function InspectionStage({ onNext }) {
  const [selected, setSelected] = useState(['general']);
  const totalCost = selected.reduce((sum, id) => sum + (INSPECTIONS.find(i => i.id === id)?.cost || 0), 0);

  const toggleSelect = (id) => {
    if (id === 'general') return; // Can't uncheck general
    setSelected(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  };

  return (
    <div className="min-h-screen bg-white p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 text-xs">
          <span className="font-black text-slate-400">1-6 ✓</span>
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">7</div>
          <span className="font-black text-slate-600">Inspections</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Order Inspections</h1>
          <p className="text-slate-600">Choose which inspections you need. General is mandatory; others are optional.</p>
        </div>

        {/* Inspections */}
        <div className="space-y-3 mb-10">
          {INSPECTIONS.map(insp => (
            <button
              key={insp.id}
              onClick={() => toggleSelect(insp.id)}
              disabled={insp.mandatory}
              className={`w-full text-left p-4 rounded-lg border-2 transition flex items-center justify-between ${
                selected.includes(insp.id) ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
              } ${insp.mandatory ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div>
                <p className="font-black text-slate-900">{insp.label}</p>
                {insp.mandatory && <p className="text-xs text-amber-600 mt-1">Required</p>}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-slate-600">{insp.cost} tokens</span>
                {selected.includes(insp.id) && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              </div>
            </button>
          ))}
        </div>

        {/* Cost Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-10">
          <div className="flex items-center justify-between">
            <span className="font-black text-slate-900">Total Inspection Cost</span>
            <span className="text-2xl font-black text-slate-900">{totalCost} tokens</span>
          </div>
        </div>

        {/* Advisory */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
          <p className="text-sm text-blue-900">
            <span className="font-black">📋 Smart Inspecting:</span> Start with general. Specialty inspections depend on general findings.
          </p>
        </div>

        <button
          onClick={() => onNext({ inspections: selected, inspectionCost: totalCost })}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700"
        >
          Order Inspections <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}