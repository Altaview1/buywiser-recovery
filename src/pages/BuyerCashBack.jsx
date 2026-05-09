import { useState, useRef } from "react";
import { ArrowRight, CheckCircle, Home, Search, DollarSign, Shield, Star, Phone } from "lucide-react";
import RebateLeadForm from "../components/buyerrebate/RebateLeadForm";
import RebateFAQ from "../components/buyerrebate/RebateFAQ";

const HOW_IT_WORKS = [
  {
    icon: Search,
    title: "Find A Home",
    desc: "Browse any property normally on Zillow, Redfin, Realtor.com, or elsewhere.",
    n: "01",
  },
  {
    icon: CheckCircle,
    title: "Check Eligibility",
    desc: "Submit the property to determine potential rebate and GAP Benefit eligibility.",
    n: "02",
  },
  {
    icon: DollarSign,
    title: "Receive Your Savings",
    desc: "Eligible buyers may receive substantial cash back or purchase credits at closing.",
    n: "03",
  },
];

const WHY_BUYWISER = [
  {
    title: "Up To $15,000 Cash Back",
    desc: "Eligible buyers may qualify for significant savings at closing.",
    icon: "💰",
  },
  {
    title: "Smart Purchase Strategy",
    desc: "Buywiser helps structure the purchase to maximize available buyer benefits.",
    icon: "🎯",
  },
  {
    title: "Mortgage + Real Estate Coordination",
    desc: "Integrated guidance can help buyers reduce friction and improve outcomes.",
    icon: "🤝",
  },
  {
    title: "California Market Expertise",
    desc: "Buywiser understands California buyer costs, affordability pressure, and negotiation opportunities.",
    icon: "📍",
  },
];

const TRUST_BADGES = [
  "No-Obligation Eligibility Check",
  "Licensed California Mortgage & Real Estate",
  "Your Information Is Never Sold",
  "NMLS #1887767 · CA DRE #01107013",
];

function SuccessScreen({ onCheckAnother }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Your Property Check Has Been Submitted</h1>
        <p className="text-slate-500 leading-relaxed mb-8">
          Buywiser will review your property and buyer situation to determine whether you may qualify for cash back, rebate, or GAP Benefit savings. We'll be in touch within one business day.
        </p>
        <a
          href="tel:+18183002642"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl text-base mb-4 w-full sm:w-auto"
        >
          <Phone className="h-4 w-4" /> Schedule A Buyer Benefit Call
        </a>
        <p className="text-xs text-slate-400 mt-4">
          (818) 300-2642 · bennett@buywiser.com
        </p>
        <button onClick={onCheckAnother} className="mt-4 text-sm text-slate-500 underline hover:text-slate-700 transition">
          Check another property
        </button>
      </div>
    </div>
  );
}

export default function BuyerCashBack() {
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (submitted) return <SuccessScreen onCheckAnother={() => setSubmitted(false)} />;

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Nav ── */}
      <header className="px-4 sm:px-6 py-4 bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/">
            <img
              src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
              alt="BuyWiser"
              className="h-8 w-auto opacity-90"
            />
          </a>
          <div className="flex items-center gap-3">
            <a href="tel:+18183002642" className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 font-medium transition">
              <Phone className="h-4 w-4" /> (818) 300-2642
            </a>
            <button
              onClick={scrollToForm}
              className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition"
            >
              Check My Property
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1400&q=80&auto=format&fit=crop"
            alt="California home"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-slate-900/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold text-white/80 uppercase tracking-widest">Buywiser Cash Back Program</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
              Get Up To{" "}
              <span className="text-amber-400">$15,000 Cash Back</span>{" "}
              When You Buy A Home
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-3 max-w-xl">
              Eligible California buyers may qualify for substantial buyer rebates and GAP Benefits through Buywiser.
            </p>
            <p className="text-sm text-slate-400 mb-8">Most buyers have no idea these programs exist.</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-base transition shadow-lg"
              >
                Check My Property <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="tel:+18183002642"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl text-base hover:bg-white/10 transition"
              >
                <Phone className="h-4 w-4" /> Talk to Buywiser
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lead Capture Form ── */}
      <section ref={formRef} className="py-16 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">See If A Property Qualifies</h2>
            <p className="text-slate-500 text-sm">Paste a property link or enter a city and price range — we'll review eligibility and get back to you.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <RebateLeadForm onSuccess={() => setSubmitted(true)} />
          </div>
        </div>
      </section>

      {/* ── Testimonial Video ── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Real California Buyers</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            See how Buywiser buyers reduced the cost of buying a home.
          </h2>
          <p className="text-slate-500 text-sm mb-8">Real buyers. Real savings. Real closing results.</p>

          {/* Video placeholder */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 aspect-video flex items-center justify-center mb-8 relative">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-500">Buyer Testimonial Video</p>
              <p className="text-xs text-slate-400 mt-1">Coming soon</p>
            </div>
          </div>

          <button
            onClick={scrollToForm}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-base transition"
          >
            Check My Property <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Process</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How The Buywiser Cash Back Program Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map(({ icon: Icon, title, desc, n }) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-6 relative">
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">{n}</div>
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Buywiser ── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Benefits</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Why Buyers Use Buywiser</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY_BUYWISER.map(({ title, desc, icon }) => (
              <div key={title} className="flex gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <div className="text-2xl flex-shrink-0 mt-0.5">{icon}</div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Section ── */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Why Buywiser</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-5">Built For Smart California Buyers</h2>
          <p className="text-slate-300 leading-relaxed text-base mb-10 max-w-2xl mx-auto">
            California buyers are facing some of the highest homebuying costs in the country. Buywiser helps eligible buyers explore rebate and GAP Benefit structures that may reduce out-of-pocket expenses and improve the economics of purchasing a home.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
            {TRUST_BADGES.map(badge => (
              <div key={badge} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <Shield className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="text-sm text-slate-300">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Strategic CTA ── */}
      <section className="py-16 bg-amber-50 border-y border-amber-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 leading-tight">
            Before You Tour A Property, Check If The Property Qualifies.
          </h2>
          <p className="text-slate-500 text-sm mb-7 max-w-md mx-auto">
            Some buyer benefits may depend on when and how you engage representation.
          </p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-base transition shadow-md"
          >
            Check My Property <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Questions</p>
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <RebateFAQ />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-4 text-center border-t border-slate-100 bg-white">
        <img
          src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
          alt="BuyWiser"
          className="h-8 w-auto mx-auto mb-4 opacity-40"
        />
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed mb-2">
          This is a private Buywiser program. Not a government benefit. Buyer savings are subject to transaction structure, eligibility, and applicable rules. "Up to" amounts are estimates only. No obligation to proceed.{" "}
          <a href="/Disclosures" className="underline hover:text-slate-600">Licensing &amp; Disclosures</a>
        </p>
        <p className="text-xs text-slate-300">BuyWiser Technology, Inc. NMLS #1887767 · CA DRE #01107013 · © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}