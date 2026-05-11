import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Zap, TrendingUp } from "lucide-react";
import { usePageTitle } from "@/lib/usePageTitle";

const FAQS = [
  {
    category: "Token-Available Service",
    questions: [
      {
        q: "What is the Token-Available service?",
        a: "Token-Available is SmartBuy's on-demand marketplace of vetted real estate and financial services. Instead of pre-paying commissions, your SmartBuy Savings Pool provides tokens that you can spend on professional help—appraisals, inspections, offer strategy, mortgage consultation, and more—only when you need it."
      },
      {
        q: "How many tokens do I get?",
        a: "Your token balance is calculated as 2.5% of your target purchase price. For example, on a $750,000 home, you'd have 18,750 tokens available. You keep whatever tokens you don't spend—they're yours to take to closing or apply toward closing costs."
      },
      {
        q: "How much does each service cost in tokens?",
        a: "Each service has a fixed token cost. For example, a general home inspection might cost 450 tokens, mortgage guidance 800 tokens, or offer strategy review 1,000 tokens. You can preview the cost and see what's available before unlocking any service."
      },
      {
        q: "Can I use tokens to pay for closing costs?",
        a: "Yes. At closing, any remaining tokens can be applied toward token-eligible closing costs like title insurance, appraisals, inspections, homeowners insurance, and HOA fees. Lender fees cannot be paid with tokens."
      },
      {
        q: "What happens to tokens I don't use?",
        a: "Unused tokens are credited to you at closing as a cash savings rebate. You keep the savings—whether you spend tokens on services or not."
      },
      {
        q: "Are all services available immediately?",
        a: "Services are unlocked based on your transaction stage. You can't order appraisal coordination before you're under contract, for example. The marketplace shows which services are available at your current stage."
      },
      {
        q: "What if I'm not satisfied with a service?",
        a: "SmartBuy guarantees your satisfaction. If you're unhappy with a professional service, you can request a replacement provider or a token refund through the Token Rewind™ guarantee. Final transactions (like completed appraisals or closed loans) cannot be reversed."
      }
    ]
  },
  {
    category: "HouseCanary Reports",
    questions: [
      {
        q: "What are HouseCanary reports?",
        a: "HouseCanary is an AI-powered real estate intelligence platform that provides independent property valuations, market analysis, risk assessments, and investment metrics. SmartBuy integrates HouseCanary reports as low-cost tokens-based add-ons to your property intelligence toolkit."
      },
      {
        q: "What types of HouseCanary reports are available?",
        a: "We offer four HouseCanary reports: Property Valuation (AI estimate of market value), Market Intelligence (neighborhood trends and comps), Risk Assessment (flood, earthquake, wildfire, and climate risks), and Investment Analysis (for rental and investment property evaluations)."
      },
      {
        q: "How much do HouseCanary reports cost?",
        a: "Each HouseCanary report costs only 30 tokens—much less than traditional appraisals or market analyses. You can combine them for comprehensive property intelligence before making an offer."
      },
      {
        q: "How is HouseCanary different from a traditional appraisal?",
        a: "HouseCanary uses AI and public data to estimate property value quickly and affordably. A traditional appraisal is ordered by your lender and required for loan approval. HouseCanary is a second opinion to help you decide whether to make an offer—it does not replace the lender's appraisal."
      },
      {
        q: "Can I use HouseCanary reports to dispute a low appraisal?",
        a: "Not directly, but you can use HouseCanary's comparable sales data and valuation as supporting evidence when requesting a Reconsideration of Value (ROV) from your lender if an appraisal comes in low."
      },
      {
        q: "When should I order HouseCanary reports?",
        a: "Best time is before making an offer—use Property Valuation and Market Intelligence (60 tokens total) to verify you're paying a fair price. After going under contract, use Risk Assessment (30 tokens) to understand environmental factors. For investment properties, use Investment Analysis (30 tokens) to model cash flow."
      },
      {
        q: "Is HouseCanary data accurate?",
        a: "HouseCanary uses public records, MLS data, and machine learning for valuations. Accuracy is generally very good for market value estimates, but AI estimates can be 3–5% off in unusual markets. Always combine with traditional market analysis and professional judgment."
      }
    ]
  }
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-3.5 flex items-start gap-3 hover:bg-slate-50 transition"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 leading-relaxed">{q}</p>
        </div>
        <div className="flex-shrink-0 text-slate-400 mt-0.5">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>
      {open && (
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-700 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

function CategorySection({ category, questions }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
        {category === "Token-Available Service" ? (
          <Zap className="h-5 w-5 text-amber-500" />
        ) : (
          <TrendingUp className="h-5 w-5 text-emerald-600" />
        )}
        {category}
      </h3>
      <div className="space-y-3">
        {questions.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} />
        ))}
      </div>
    </div>
  );
}

export default function TokenAvailableFAQ() {
  usePageTitle("Token-Available & HouseCanary Reports FAQ | BuyWiser SmartBuy™");

  return (
    <div className="bg-white py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-10">
          <div className="w-10 h-10 rounded-lg bg-blue-100 border border-blue-300 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="h-5 w-5 text-blue-700" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Frequently Asked Questions</h1>
            <p className="text-slate-600 text-base">Learn how Token-Available services and HouseCanary reports work within SmartBuy.</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12 pb-8 border-b border-slate-200">
          {FAQS.map((section, i) => (
            <a
              key={i}
              href={`#${section.category.replace(/\s+/g, "-").toLowerCase()}`}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition text-sm font-semibold text-slate-700"
            >
              {section.category === "Token-Available Service" ? (
                <Zap className="h-4 w-4 text-amber-500 inline mr-2" />
              ) : (
                <TrendingUp className="h-4 w-4 text-emerald-600 inline mr-2" />
              )}
              {section.category}
            </a>
          ))}
        </div>

        {/* FAQ Sections */}
        {FAQS.map((section, i) => (
          <div key={i} id={section.category.replace(/\s+/g, "-").toLowerCase()}>
            <CategorySection category={section.category} questions={section.questions} />
          </div>
        ))}

        {/* CTA */}
        <div className="mt-12 p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
          <p className="text-sm text-slate-700 mb-3">Still have questions?</p>
          <a href="/Contact" className="inline-block px-6 py-3 bg-blue-800 text-white font-black rounded-lg hover:bg-blue-900 transition text-sm">
            Request a Consultation
          </a>
        </div>
      </div>
    </div>
  );
}