import { useState } from "react";
import { ArrowRight } from "lucide-react";

const LOAN_OPTIONS = [
  { id: 'conventional', label: 'Conventional (80% LTV)', rate: 6.25, payment: 3750 },
  { id: 'fha', label: 'FHA (96.5% LTV)', rate: 5.99, payment: 3520 },
  { id: 'va', label: 'VA (100% LTV)', rate: 5.75, payment: 3420 },
];

export default function FinancingStage({ purchasePrice, onNext }) {
  const [selectedLoan, setSelectedLoan] = useState('conventional');
  const [brokerConsult, setBrokerConsult] = useState(false);

  const option = LOAN_OPTIONS.find(l => l.id === selectedLoan);

  return (
    <div className="min-h-screen bg-white p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 text-xs">
          <span className="font-black text-slate-400">1-7 ✓</span>
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">8</div>
          <span className="font-black text-slate-600">Financing</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Choose Your Loan</h1>
          <p className="text-slate-600">Compare loan programs. You can shop rates yourself or speak to a broker.</p>
        </div>

        {/* Loan Options */}
        <div className="space-y-3 mb-10">
          {LOAN_OPTIONS.map(loan => (
            <button
              key={loan.id}
              onClick={() => setSelectedLoan(loan.id)}
              className={`w-full text-left p-5 rounded-lg border-2 transition ${
                selectedLoan === loan.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-black text-slate-900">{loan.label}</p>
                  <p className="text-xs text-slate-500 mt-1">Est. monthly: ${loan.payment.toLocaleString()}</p>
                </div>
                <span className="font-black text-slate-700">{loan.rate}%</span>
              </div>
            </button>
          ))}
        </div>

        {/* Optional Broker */}
        <button
          onClick={() => setBrokerConsult(!brokerConsult)}
          className={`w-full text-left p-4 rounded-lg border-2 transition ${
            brokerConsult ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-black text-slate-900">Speak to Mortgage Broker</p>
              <p className="text-xs text-slate-500 mt-1">Get expert rate shopping & loan structuring</p>
            </div>
            <span className="font-black text-amber-600">400 tokens</span>
          </div>
        </button>

        <div className="mt-10">
          <button
            onClick={() => onNext({ loan: selectedLoan, brokerConsult, financingCost: brokerConsult ? 400 : 0 })}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700"
          >
            Continue to Appraisal <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}