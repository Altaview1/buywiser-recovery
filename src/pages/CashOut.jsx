import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { usePageTitle } from "@/lib/usePageTitle";
import { CheckCircle, DollarSign, TrendingUp, ArrowRight, AlertCircle, Phone } from "lucide-react";

const cashOutUses = [
  { title: "Home Improvements", desc: "Upgrade your kitchen, add a bathroom, replace a roof. Using equity for improvements that add value is often a sound use of leverage." },
  { title: "Debt Consolidation", desc: "Roll higher-interest debt (credit cards, personal loans) into your mortgage. This can lower your overall monthly obligations — but it converts unsecured debt to secured." },
  { title: "Financial Reserves", desc: "Building or restoring emergency savings, funding a business, or covering major life expenses." },
  { title: "Educational Costs", desc: "Funding education for you or a dependent at a rate likely better than student loan alternatives." },
];

const cashOutVsHELOC = [
  { label: "Cash-Out Refinance", pros: ["Single loan, one payment", "Fixed rate on full balance", "Larger amounts available"], cons: ["Replaces your existing loan", "New closing costs on full balance", "Rate depends on current market"] },
  { label: "HELOC / Home Equity Loan", pros: ["Keeps existing first mortgage", "Access only what you need", "Lower upfront costs"], cons: ["Often variable rate", "Second lien on the property", "Can be frozen by lender"] },
];

const thingsToConsider = [
  "You're increasing your total debt and extending your payoff timeline",
  "Your home secures the loan — missed payments carry serious consequences",
  "Interest may not be tax-deductible unless funds are used for home improvements",
  "Pulling equity reduces your ownership stake",
];

export default function CashOut() {
  usePageTitle('Cash-Out Options | BuyWiser Home Loans');
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-green-600/20 border border-green-500/30 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">Cash-Out & Equity Options</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Use Your Equity Strategically</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
            Your home equity may help with remodeling, debt consolidation, reserves, or major financial goals — when the timing and structure are right.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Equity Is an Asset. It Should Be Treated Like One.</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Many California homeowners have accumulated significant equity over the past several years. Whether to use that equity — and how — is a real financial decision that deserves careful analysis, not a sales pitch.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We help you compare your options, understand the trade-offs, and decide whether accessing equity makes sense for your goals and your overall financial picture.
          </p>
        </div>
      </section>

      {/* Uses */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Common Uses of Home Equity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cashOutUses.map((use) => (
              <div key={use.title} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <DollarSign className="h-5 w-5 text-green-700" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5">{use.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{use.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare Options */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Cash-Out Refinance vs. HELOC</h2>
          <p className="text-slate-600 mb-8">Two common ways to access equity — each with different structures and trade-offs.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cashOutVsHELOC.map((option) => (
              <div key={option.label} className="bg-slate-50 rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-4">{option.label}</h3>
                <div className="mb-4">
                  <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-2">Advantages</p>
                  <ul className="space-y-1.5">
                    {option.pros.map((p) => <li key={p} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />{p}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Considerations</p>
                  <ul className="space-y-1.5">
                    {option.cons.map((c) => <li key={c} className="flex items-center gap-2 text-sm text-slate-700"><AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />{c}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to Consider */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" /> What to Consider Before Tapping Equity
          </h2>
          <div className="space-y-3">
            {thingsToConsider.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-slate-600 text-sm leading-relaxed">
            We'll walk through all of this with you. Our job isn't to close a loan — it's to help you make the right decision for your financial situation.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-3">Review My Equity Options</h2>
          <p className="text-green-100 mb-6">Let's look at what you've built up and whether accessing it makes sense for your goals right now.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('ContactUs')} className="px-8 py-3.5 bg-white text-green-700 rounded-lg font-bold hover:bg-green-50 transition">
              Request a Mortgage Review
            </Link>
            <a href="tel:+18183002642" className="px-8 py-3.5 border-2 border-green-400 text-white rounded-lg font-bold hover:bg-green-500 transition flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" />(818) 300-2642
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}