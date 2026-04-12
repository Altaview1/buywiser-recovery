import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { usePageTitle } from "@/lib/usePageTitle";
import { CheckCircle, Shield, Info, Phone, Award } from "lucide-react";

const benefits = [
  "No appraisal required in most cases",
  "No income verification required in most cases",
  "Lower VA funding fee compared to a standard VA refinance",
  "Can roll closing costs into the loan in many situations",
  "Simplified documentation and processing",
  "Available even if you've experienced some equity loss",
];

const requirements = [
  "You must currently have a VA-guaranteed home loan",
  "You must certify that you previously occupied the home as your primary residence",
  "You must be current on your mortgage payments",
  "The new loan must result in a lower monthly payment, a lower interest rate, or a move from an adjustable to fixed rate",
  "A waiting period applies — typically you must have made at least 6 payments on your current VA loan",
];

export default function VAStreamline() {
  usePageTitle('VA Streamline Review | BuyWiser Home Loans');
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-amber-500/20 border border-amber-400/30 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">VA IRRRL / Streamline</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">VA Streamline / IRRRL Review</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
            Eligible VA borrowers may be able to reduce their payment with a simpler refinance path — without the documentation burden of a standard loan.
          </p>
        </div>
      </section>

      {/* Respect section */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Award className="h-10 w-10 text-amber-400 flex-shrink-0" />
            <p className="text-slate-300 leading-relaxed">
              VA benefits exist because of the service our veterans and their families have provided. We take that seriously. Our job is to help you understand whether the IRRRL is the right move for your specific situation — clearly and without pressure.
            </p>
          </div>
        </div>
      </section>

      {/* What It Is */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What Is the VA IRRRL?</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            The Interest Rate Reduction Refinance Loan — commonly called the VA Streamline or IRRRL — is a refinance option available to homeowners with an existing VA-guaranteed mortgage. It's one of the most borrower-friendly refinance programs available.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Because the VA already guaranteed your original loan, the IRRRL requires significantly less documentation than a new mortgage or conventional refinance. In most cases, there's no appraisal and no income verification required, which means the process is faster and less intrusive.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-700" /> Potential Benefits
              </h2>
              <ul className="space-y-3">
                {benefits.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-blue-700 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info className="h-5 w-5 text-amber-500" /> Eligibility Basics
              </h2>
              <ul className="space-y-3">
                {requirements.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* No Hype Note */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 border border-gray-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 mb-2">A Straightforward Note</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              The IRRRL is a genuinely useful program — but it's not the right move for every VA borrower every time. Like any refinance, it has closing costs, a new funding fee (which can often be financed), and a break-even timeline. We'll look at your actual numbers and tell you whether it makes financial sense before moving forward.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-3">Request a VA Streamline Review</h2>
          <p className="text-blue-200 mb-6">We'll review your current VA loan, run the numbers, and let you know clearly whether the IRRRL makes sense for your situation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Contact')} className="px-8 py-3.5 bg-amber-400 text-blue-900 rounded-lg font-bold hover:bg-amber-300 transition">
              Request a Mortgage Review
            </Link>
            <a href="tel:+18183002642" className="px-8 py-3.5 border-2 border-white/30 text-white rounded-lg font-bold hover:bg-white/10 transition flex items-center justify-center gap-2">
              <Phone className="h-4 w-4" />(818) 300-2642
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}