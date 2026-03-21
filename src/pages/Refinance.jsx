import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { usePageTitle } from "@/lib/usePageTitle";
import { CheckCircle, ArrowRight, TrendingDown, DollarSign, Shield, AlertCircle, Phone } from "lucide-react";

const scenarios = [
  {
    icon: TrendingDown,
    title: "Rate & Term Refinance",
    desc: "Reduce your interest rate, lower your monthly payment, or shorten your loan term. We calculate your break-even point so you know whether it's worth it given how long you plan to stay in the home.",
  },
  {
    icon: DollarSign,
    title: "Cash-Out Refinance",
    desc: "Tap into your equity for home improvements, debt consolidation, or major financial goals. We'll walk through total cost vs. benefit before you decide.",
  },
  {
    icon: Shield,
    title: "FHA & VA Streamline",
    desc: "If you have an FHA or VA loan, you may qualify for a simplified refinance path. See those dedicated pages for full details.",
  },
];

const whenItMakeSense = [
  "Your current rate is noticeably higher than market rates",
  "You plan to stay in the home long enough to recover closing costs",
  "You want to eliminate mortgage insurance by reaching sufficient equity",
  "You're on an adjustable rate and prefer fixed payment certainty",
  "You want to consolidate high-interest debt into a single, lower-rate payment",
];

const whenItMayNot = [
  "You plan to move within the next few years",
  "The closing costs outweigh the long-term savings",
  "You're nearly paid off — refinancing restarts your amortization",
  "Rates haven't moved enough to justify the transaction",
];

export default function Refinance() {
  usePageTitle('Refinance Review | BuyWiser Home Loans');
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-green-600/20 border border-green-500/30 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">California Refinance</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Refinance With Clarity</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
            We help California homeowners evaluate whether refinancing actually improves their situation — not just whether a lower rate exists.
          </p>
        </div>
      </section>

      {/* Scenarios */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Refinance Options We Work With</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scenarios.map((s) => (
              <div key={s.title} className="bg-slate-50 rounded-2xl p-6 border border-gray-200">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <s.icon className="h-5 w-5 text-green-700" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When It Makes Sense / When It May Not */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" /> When Refinancing May Make Sense
              </h2>
              <ul className="space-y-3">
                {whenItMakeSense.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" /> When It Might Not Be the Right Move
              </h2>
              <ul className="space-y-3">
                {whenItMayNot.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* What We Look At */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What We Actually Look At</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Before recommending anything, we look at your current loan balance, existing rate, remaining term, how long you plan to stay in the property, and your equity position. We then calculate the break-even point on closing costs and model the actual monthly and lifetime savings.
          </p>
          <p className="text-slate-600 leading-relaxed">
            If it makes sense, we move forward. If it doesn't, we tell you that too — and suggest when it might.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-3">Request a Refinance Review</h2>
          <p className="text-green-100 mb-6">We'll analyze your current loan and tell you honestly whether refinancing makes sense for your situation.</p>
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