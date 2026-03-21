import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle, Key, ArrowRight, Shield, Phone, Users } from "lucide-react";

const loanTypes = [
  { title: "Conventional", desc: "For buyers with solid credit and at least 3–20% down. Typically no mortgage insurance with 20%+ down." },
  { title: "FHA", desc: "Allows lower down payment (3.5%) and more flexible qualifying. Good for first-time buyers and those rebuilding credit." },
  { title: "VA", desc: "For eligible veterans and service members. No down payment required. One of the strongest loan programs available." },
  { title: "Jumbo", desc: "For loan amounts exceeding conforming limits — common in California's higher-cost markets." },
];

const preapprovalProcess = [
  { step: "1", title: "Gather Your Documents", desc: "Recent pay stubs, W-2s, tax returns, bank statements, and ID. We'll tell you exactly what you need." },
  { step: "2", title: "Review Your Profile", desc: "We look at income, credit, assets, and debts to determine what programs you qualify for and at what terms." },
  { step: "3", title: "Understand Your Numbers", desc: "We give you a clear picture of your purchasing power — not just a maximum but what's comfortable for your budget." },
  { step: "4", title: "Get Preapproval Letter", desc: "A well-prepared preapproval letter helps your offer stand out in competitive California markets." },
];

const buyerPoints = [
  "We explain every loan option you qualify for — not just the one that's easiest for us",
  "We calculate your real monthly cost: principal, interest, taxes, insurance, and HOA if applicable",
  "We help you understand how your down payment affects your rate and insurance costs",
  "We're available to answer questions throughout the home search — not just at application",
  "We work to close on time, which matters when your offer is accepted",
];

export default function Purchase() {
  return (
    <div className="bg-white">
      <title>Home Purchase Financing | BuyWiser Home Loans</title>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-700 text-white py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-green-600/20 border border-green-500/30 text-green-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 uppercase tracking-wide">California Home Purchase</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">California Home Purchase Financing</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
            Preapproval guidance and loan strategy for buyers who want clear answers before making an offer.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Buying a Home Is a Major Decision. We Treat It That Way.</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            California's real estate market moves fast and can be unforgiving. Having the right financing in place — with a credible preapproval and a clear understanding of your options — makes a real difference in how competitive your offer is and how smooth your transaction goes.
          </p>
          <p className="text-slate-600 leading-relaxed">
            We work with first-time buyers, move-up buyers, investors, and people who've been told no elsewhere. Our job is to help you understand what you qualify for, what it actually costs, and how to make the best use of the available programs.
          </p>
        </div>
      </section>

      {/* Loan Types */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Loan Programs We Work With</h2>
          <p className="text-slate-600 mb-8">Different buyers have different profiles. We'll identify what fits yours.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {loanTypes.map((type) => (
              <div key={type.title} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                  <Key className="h-4 w-4 text-green-700" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1.5">{type.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preapproval Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">What the Preapproval Process Looks Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {preapprovalProcess.map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-slate-50 rounded-2xl border border-gray-200 p-6">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm mb-4">{item.step}</div>
                  <h3 className="font-bold text-slate-900 mb-2 text-sm">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do For Buyers */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">What We Do Differently For Buyers</h2>
          <div className="space-y-3">
            {buyerPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-200">
                <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 text-sm leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-3">Get Preapproval Guidance</h2>
          <p className="text-green-100 mb-6">Tell us about your situation and we'll walk through your options — before you start making offers.</p>
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