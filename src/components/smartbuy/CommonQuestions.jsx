import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  {
    q: "Do I need any real estate experience to use SmartBuy™?",
    a: "No. The Machine™ walks you through every step with plain-language guidance and checklists. At any point you feel uncertain, you can unlock a licensed professional for direct help — no experience required.",
  },
  {
    q: "What exactly is a 'token' and how does it work?",
    a: "A token represents a portion of your SmartBuy Savings Pool™ — the estimated commission savings tied to your purchase. When you unlock professional help, a token cost is deducted from that pool. Tokens are never charged to your bank account; they're settled at closing from your savings pool.",
  },
  {
    q: "What if I unlock help and then don't end up buying the home?",
    a: "If the transaction doesn't close, no token costs are collected — since the savings pool only materializes at a successful closing. Speak with a Buywiser specialist to understand your specific situation.",
  },
  {
    q: "How fast will Bennett or another expert respond after I unlock?",
    a: "Mortgage guidance from Bennett's team typically responds within 2 hours by call or text. Buyer agent assignments are made within 4 hours. Legal counsel responds within 1 business day. All delivery windows are shown clearly before you confirm the unlock.",
  },
  {
    q: "Can I still use a buyer's agent I already know?",
    a: "Yes — you can remain self-directed without unlocking agent support. If you already have an agent relationship you trust, SmartBuy™ still helps you with the mortgage, property intelligence, offer prep, and closing stages.",
  },
  {
    q: "Is SmartBuy™ available outside California?",
    a: "SmartBuy™ is currently focused on California markets. BuyWiser is a California-licensed lender and brokerage — NMLS #1887767, CA DRE #01107013.",
  },
  {
    q: "What's the difference between SmartBuy™ and a traditional buyer's agent?",
    a: "A traditional buyer's agent is involved in every step whether you need them or not — and their commission comes from your purchase price. SmartBuy™ lets you self-direct using AI tools and only brings in a licensed professional when you choose to. The savings from reducing that professional involvement go back into your pocket.",
  },
  {
    q: "How do I know the savings estimate is real?",
    a: "The Savings Pool estimate is based on a typical 2.5% buyer-side commission on your purchase price. It's a conservative estimate of what you could retain by self-directing the transaction. Final amounts depend on your specific deal structure and are not guaranteed, but they are based on real commission economics.",
  },
];

function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-slate-900 hover:bg-slate-800/80 transition"
      >
        <span className="text-sm font-semibold text-slate-200 pr-4">{q}</span>
        {isOpen
          ? <ChevronUp className="h-4 w-4 text-slate-500 flex-shrink-0" />
          : <ChevronDown className="h-4 w-4 text-slate-500 flex-shrink-0" />}
      </button>
      {isOpen && (
        <div className="px-5 pb-4 pt-3 bg-slate-900/60 border-t border-slate-800">
          <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function CommonQuestions() {
  const [open, setOpen] = useState(null);

  return (
    <section className="px-4 sm:px-6 py-16 border-t border-slate-800/60">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Common Questions</p>
          <h2 className="text-2xl font-black text-white">Everything You're Wondering About</h2>
          <p className="text-slate-400 text-sm mt-2">About SmartBuy™, tokens, the self-directed process, and getting expert help.</p>
        </div>

        <div className="space-y-2">
          {FAQS.map((item, i) => (
            <FAQItem
              key={i}
              q={item.q}
              a={item.a}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>

        <div className="mt-8 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-5 text-center">
          <p className="text-sm text-slate-300 font-semibold mb-1">Still have a question?</p>
          <p className="text-xs text-slate-500 mb-4">Call Bennett directly — no bots, no hold music.</p>
          <a
            href="tel:+18183002642"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-400 text-slate-900 font-black rounded-xl text-sm hover:bg-emerald-300 transition"
          >
            📞 (818) 300-2642
          </a>
        </div>
      </div>
    </section>
  );
}