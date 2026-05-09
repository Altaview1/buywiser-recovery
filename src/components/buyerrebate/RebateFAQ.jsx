import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "Is this guaranteed?",
    a: "No. Buyer benefits depend on the property, purchase structure, representation status, lender requirements, and other transaction details. Buywiser will review eligibility before confirming any potential savings.",
  },
  {
    q: "How can buyers receive cash back?",
    a: "In eligible transactions, savings may be structured through buyer rebates, credits, or other lawful purchase-side benefit structures depending on the transaction and applicable rules.",
  },
  {
    q: "Can I use this if I already found a home?",
    a: "Yes. Submit the property link and Buywiser will review whether the home and your situation may qualify.",
  },
  {
    q: "What if I already have an agent?",
    a: "It is common to switch representation when substantial money is saved. You will make the final decision on that. We will help you look at your options.",
  },
  {
    q: "Is this a government program?",
    a: "No. This is a private Buywiser program and is not a government program.",
  },
];

export default function RebateFAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-2">
      {FAQS.map((item, i) => (
        <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition"
          >
            <span className="text-sm font-semibold text-slate-800">{item.q}</span>
            {open === i ? <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />}
          </button>
          {open === i && (
            <div className="px-5 pb-4 bg-slate-50 border-t border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}