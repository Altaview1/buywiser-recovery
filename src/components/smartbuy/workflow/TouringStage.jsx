import { useState } from "react";
import { ArrowRight, CreditCard } from "lucide-react";

export default function TouringStage({ home, onNext }) {
  const [paymentEntered, setPaymentEntered] = useState(false);
  const tourCost = 50;

  const handleScheduleTour = () => {
    setPaymentEntered(true);
    setTimeout(() => onNext({ toured: true }), 500);
  };

  if (!paymentEntered) {
    return (
      <div className="min-h-screen bg-white p-6 sm:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8 text-xs">
            <span className="font-black text-slate-400">1 ✓</span>
            <span className="font-black text-slate-400">2 ✓</span>
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">3</div>
            <span className="font-black text-slate-600">Touring</span>
          </div>

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-2">Schedule Your Tour</h1>
            <p className="text-base text-slate-600 mb-6">{home?.address}</p>
            <p className="text-slate-600 leading-relaxed">
              Each scheduled showing uses licensed showing agents and scheduling resources. SmartBuy™ transparently prices these services so you preserve more transaction value.
            </p>
          </div>

          {/* Cost */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-10">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-slate-900">Tour Cost (Licensed Showing Agent)</span>
              <span className="text-2xl font-black text-blue-600">{tourCost} tokens</span>
            </div>
          </div>

          {/* Payment Gate */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-10">
            <p className="text-sm font-black text-slate-900 mb-4">Enter Payment Method</p>
            <div className="space-y-3">
              <input type="text" placeholder="Card Number" className="w-full px-4 py-2 border border-slate-300 rounded" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="MM/YY" className="px-4 py-2 border border-slate-300 rounded" />
                <input type="text" placeholder="CVC" className="px-4 py-2 border border-slate-300 rounded" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-3">Your card is authorized for tours. You're not charged unless the tour occurs.</p>
          </div>

          <button
            onClick={handleScheduleTour}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700"
          >
            <CreditCard className="h-4 w-4" /> Authorize & Schedule Tour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 sm:p-8 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-2">Tour Scheduled!</h1>
        <p className="text-slate-600 mb-8">Your showing has been booked. A licensed agent will meet you at the property.</p>
        <button
          onClick={() => onNext({ toured: true })}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-lg hover:bg-emerald-700"
        >
          Continue to Consultation <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}