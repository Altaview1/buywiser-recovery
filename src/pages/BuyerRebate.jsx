import { useState, useRef } from "react";
import { ArrowRight, ChevronDown, ChevronUp, CheckCircle, Shield, Star, DollarSign, Home, Search, Zap, Phone } from "lucide-react";
import BuyerRebateForm from "../components/buyer-rebate/BuyerRebateForm";

// ── FAQs ─────────────────────────────────────────────────────────────────────
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
    a: "You may still request a review, but available options may be limited if you have already committed to representation or toured the property with another agent.",
  },
  {
    q: "Is this a government program?",
    a: "No. This is a private Buywiser program and is not a government program.",
  },
];

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition"
      >
        <span className="text-sm font-semibold text-slate-800">{item.q}</span>
        {open ? <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 bg-white border-t border-slate-100">
          <p className="text-sm text-slate-600 leading-relaxed pt-3">{item.a}</p>
        </div>
      )}
    </div>
  );
}

// ── Video Placeholder ─────────────────────────────────────────────────────────
function TestimonialVideo() {
  return (
    <div className="rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
      <div className="relative z-10 text-center px-6">
        <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        </div>
        <p className="text-white font-semibold text-sm">Buyer Testimonial Video</p>
        <p className="text-slate-400 text-xs mt-1">Coming soon</p>
      </div>
    </div>
  );
}

// ── How It Works Cards ────────────────────────────────────────────────────────
const HOW_IT_WORKS = [
  {
    icon: Search,
    step: "01",
    title: "Find A Home",
    desc: "Browse any property normally on Zillow, Redfin, Realtor.com, or elsewhere.",
  },
  {
    icon: Zap,
    step: "02",
    title: "Check Eligibility",
    desc: "Submit the property to determine potential rebate and GAP Benefit eligibility.",
  },
  {
    icon: DollarSign,
    step: "03",
    title: "Receive Your Savings",
    desc: "Eligible buyers may receive substantial cash back or purchase credits at closing.",
  },
];

// ── Why Buywiser Cards ────────────────────────────────────────────────────────
const WHY_CARDS = [
  {
    title: "Up To $15,000 Cash Back",
    desc: "Eligible buyers may qualify for significant savings at closing.",
    icon: DollarSign,
  },
  {
    title: "Smart Purchase Strategy",
    desc: "Buywiser helps structure the purchase to maximize available buyer benefits.",
    icon: Zap,
  },
  {
    title: "Mortgage + Real Estate Coordination",
    desc: "Integrated guidance can help buyers reduce friction and improve outcomes.",
    icon: Home,
  },
  {
    title: "California Market Expertise",
    desc: "Buywiser understands California buyer costs, affordability pressure, and negotiation opportunities.",
    icon: Star,
  },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BuyerRebate() {
  const formRef = useRef(null);
  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Minimal Nav ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <a href="/">
            <img
              src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
              alt="BuyWiser"
              className="h-9 w-auto"
            />
          </a>
          <div className="flex items-center gap-3">
            <a href="tel:+18183002642" className="hidden sm:flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition font-medium">
              <Phone className="h-4 w-4" /> (818) 300-2642
            </a>
            <button
              onClick={scrollToForm}
              className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition"
            >
              Check My Property
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            Buywiser Cash Back Program
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-5">
            Get Up To{" "}
            <span className="text-amber-400">$15,000 Cash Back</span>{" "}
            When You Buy A Home
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-3 max-w-xl mx-auto">
            Eligible California buyers may qualify for substantial buyer rebates and GAP Benefits through Buywiser.
          </p>
          <p className="text-sm text-slate-400 mb-8">
            Most buyers have no idea these programs exist.
          </p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-base rounded-xl transition shadow-xl"
          >
            Check My Property <ArrowRight className="h-4 w-4" />
          </button>
          <p className="text-xs text-slate-500 mt-4">No cost · No obligation · Eligible buyers only</p>
        </div>
      </section>

      {/* ── Lead Capture Form ── */}
      <section ref={formRef} className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">See If A Property Qualifies</h2>
            <p className="text-slate-500 text-sm">Submit a property link or address — we'll review your eligibility for rebates and savings.</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 px-6 py-4">
              <p className="text-white font-bold text-sm">Buyer Eligibility Check</p>
              <p className="text-slate-400 text-xs mt-0.5">No cost · No obligation · Response within 1 business day</p>
            </div>
            <div className="p-6 sm:p-8">
              <BuyerRebateForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonial Video ── */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Real California Buyers</p>
            <h2 className="text-2xl font-black text-slate-900 mb-2">See How Buyers Saved</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              See how Buywiser buyers used rebate and GAP Benefit strategies to reduce the cost of buying a home.
            </p>
          </div>
          <TestimonialVideo />
          <p className="text-center text-sm text-slate-500 mt-4 italic">Real buyers. Real savings. Real closing results.</p>
          <div className="text-center mt-6">
            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition"
            >
              Check My Property <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Simple Process</p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">How The Buywiser Cash Back Program Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-amber-400" />
                  </div>
                  <span className="text-xs font-black text-slate-300 tracking-widest">{step}</span>
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">The Advantage</p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Why Buyers Use Buywiser</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_CARDS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Section ── */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">For Smart California Buyers</p>
          <h2 className="text-2xl font-black text-white mb-5">Built For Smart California Buyers</h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            California buyers are facing some of the highest homebuying costs in the country. Buywiser helps eligible buyers explore rebate and GAP Benefit structures that may reduce out-of-pocket expenses and improve the economics of purchasing a home.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Shield, label: "Licensed Professional", sub: "NMLS #1887767 · CA DRE #01107013" },
              { icon: CheckCircle, label: "No Obligation Review", sub: "Free eligibility check, zero pressure" },
              { icon: Shield, label: "Privacy Protected", sub: "Your info is never sold or shared" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-center">
                <Icon className="h-5 w-5 text-amber-400 mx-auto mb-2" />
                <p className="text-white text-xs font-bold">{label}</p>
                <p className="text-slate-400 text-[10px] mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Secondary CTA ── */}
      <section className="py-16 bg-amber-400">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 leading-tight">
            Before You Contact The Listing Agent, Check If The Property Qualifies.
          </h2>
          <p className="text-slate-700 text-sm mb-7 max-w-md mx-auto">
            Some buyer benefits may depend on when and how you engage representation.
          </p>
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-black text-base rounded-xl hover:bg-slate-800 transition shadow-lg"
          >
            Check My Property <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Questions</p>
            <h2 className="text-2xl font-black text-slate-900">Common Questions</h2>
          </div>
          <div className="space-y-2">
            {FAQS.map((item, i) => <FAQItem key={i} item={item} />)}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 border-t border-slate-100 bg-white px-4 text-center">
        <img
          src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
          alt="BuyWiser"
          className="h-8 w-auto mx-auto mb-4 opacity-50"
        />
        <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed mb-2">
          Buyer rebate and cash back availability depends on transaction structure, property type, lender approval, and other qualifying details. "Up to $15,000" refers to the maximum potential benefit for eligible transactions — individual results vary. This is not a guarantee of savings. Buywiser is a licensed California mortgage and real estate professional.{" "}
          <a href="/Disclosures" className="underline hover:text-slate-600 transition">Licensing &amp; Disclosures</a>
        </p>
        <p className="text-xs text-slate-300">
          BuyWiser Technology, Inc. NMLS #1887767 · CA DRE #01107013 · © {new Date().getFullYear()}
        </p>
      </footer>

      {/* ── Mobile Sticky CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-slate-200 shadow-lg px-4 py-3 flex gap-3">
        <a
          href="tel:+18183002642"
          className="flex-1 flex items-center justify-center gap-1.5 py-3 border-2 border-slate-900 text-slate-900 rounded-xl font-bold text-sm"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <button
          onClick={scrollToForm}
          className="flex-1 flex items-center justify-center gap-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm"
        >
          Check My Property <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}