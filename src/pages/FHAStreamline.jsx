import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { usePageTitle } from "@/lib/usePageTitle";
import { CheckCircle, ArrowRight, Shield, Info, Phone } from "lucide-react";

const benefits = [
  "No appraisal required in most cases — the current value of your home isn't a barrier",
  "Reduced documentation compared to a standard refinance",
  "Potentially lower mortgage insurance premiums on newer FHA loans",
  "Streamlined credit requirements — if you've made your payments on time, that matters most",
  "May be available even if you're slightly underwater on your loan",
];

const whoItHelps = [
  "Homeowners with existing FHA loans who are current on payments",
  "Borrowers who purchased at higher rates and haven't refinanced",
  "Those who couldn't qualify for a conventional refinance",
  "California homeowners whose property value may have declined",
];

const notes = [
  "You must have had your FHA loan for at least 210 days",
  "You must be current on payments — no recent late payments",
  "The refinance must result in a tangible net benefit (typically a lower payment or rate)",
  "A new MIP (mortgage insurance premium) will be charged on the new loan",
];

export default function FHAStreamline() {
  usePageTitle('FHA Streamline Review | BuyWiser Home Loans');
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-green-600/20 border border-green-500/30 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">FHA Streamline Refinance</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">FHA Streamline Review</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
            If you already have an FHA loan, you may be able to reduce your payment with less documentation than a standard refinance requires.
          </p>
        </div>
      </section>

      {/* What It Is */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What Is an FHA Streamline Refinance?</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            An FHA Streamline refinance is a simplified refinance option available exclusively to homeowners with existing FHA-insured loans. The program is designed to reduce the time, cost, and documentation burden compared to a full refinance.
          </p>
          <p className="text-slate-600 leading-relaxed">
            In many cases, there is no appraisal requirement, which means your current loan balance and payment history carry more weight than what your home would appraise for today. For California homeowners in markets that have seen value fluctuations, this can be a meaningful advantage.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Potential Benefits</h2>
          <div className="space-y-3">
            {benefits.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It May Help */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Who It May Help</h2>
              <ul className="space-y-3">
                {whoItHelps.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info className="h-5 w-5 text-amber-500" /> What to Know First
              </h2>
              <ul className="space-y-3">
                {notes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-3">Request an FHA Streamline Review</h2>
          <p className="text-green-100 mb-6">We'll look at your current FHA loan and tell you whether a streamline refinance makes sense and what the numbers look like.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Contact')} className="px-8 py-3.5 bg-white text-green-700 rounded-lg font-bold hover:bg-green-50 transition">
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