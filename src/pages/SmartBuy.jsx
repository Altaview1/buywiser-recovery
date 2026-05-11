import { useState, useRef } from "react";
import { ArrowRight, Zap, Shield, Brain, TrendingDown, CheckCircle, ChevronDown } from "lucide-react";
import SavingsMeter from "../components/smartbuy/SavingsMeter";
import SmartBuyIntakeForm from "../components/smartbuy/SmartBuyIntakeForm";

const DEFAULT_PRICE = 750000;

function formatCurrency(n) {
  return Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

const HOW_IT_WORKS = [
  { icon: "🔍", step: "01", title: "Submit Your Property", desc: "Paste a listing link or enter your target city and budget. The Machine™ initializes your Savings Pool instantly." },
  { icon: "🤖", step: "02", title: "AI Guides Every Step", desc: "Property intelligence, offer prep, document management — AI handles the work. You stay in control." },
  { icon: "💰", step: "03", title: "Keep What You Earn", desc: "Complete each stage yourself and the savings stay in your pocket. Human help is available, but it costs tokens." },
  { icon: "🔑", step: "04", title: "Close With Confidence", desc: "Licensed professionals handle the legal and compliance pieces. You close smarter, faster, and wealthier." },
];

const VS_TRADITIONAL = [
  { traditional: "3% buyer agent commission", smartbuy: "Up to 2.5% back in your pocket" },
  { traditional: "Fragmented, opaque process", smartbuy: "Centralized AI-guided dashboard" },
  { traditional: "You depend on your agent for everything", smartbuy: "You self-direct with AI backup" },
  { traditional: "No visibility into costs until closing", smartbuy: "Live savings meter from Day 1" },
  { traditional: "Human intervention at every step", smartbuy: "AI first, humans only when needed" },
];

const WORKFLOW_STAGES = [
  { icon: "🔍", label: "Property Intelligence", value: 0.12 },
  { icon: "📋", label: "Mortgage Pre-Qualification", value: 0.15 },
  { icon: "✍️", label: "Offer Preparation", value: 0.20 },
  { icon: "📁", label: "Transaction Management", value: 0.25 },
  { icon: "🔑", label: "Closing Coordination", value: 0.18 },
  { icon: "💰", label: "Post-Close Distribution", value: 0.10 },
];

function SuccessScreen({ lead }) {
  const savings = lead.savings_pool_estimate;
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🤖</span>
        </div>
        <h1 className="text-3xl font-black text-white mb-3">You're In The Machine™</h1>
        {savings && (
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl px-6 py-5 mb-6">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Your SmartBuy Savings Pool™</p>
            <p className="text-5xl font-black text-white mb-1">{formatCurrency(savings)}</p>
            <p className="text-sm text-slate-400">estimated · complete each stage yourself to keep it all</p>
          </div>
        )}
        <p className="text-slate-400 leading-relaxed mb-6">
          {lead.name?.split(" ")[0] || "Welcome"} — your SmartBuy™ profile is active. A Buywiser specialist will reach out within 1 business day to activate your workflow and confirm your savings pool.
        </p>
        <a href="tel:+18183002642"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-400 text-slate-900 font-black rounded-xl text-base hover:bg-emerald-300 transition w-full sm:w-auto">
          Call Buywiser — (818) 300-2642
        </a>
        <p className="text-xs text-slate-600 mt-4">Check your email for your savings summary and next steps.</p>
      </div>
    </div>
  );
}

export default function SmartBuy() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);
  const [price, setPrice] = useState(DEFAULT_PRICE);
  const formRef = useRef(null);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (submitted) return <SuccessScreen lead={submittedLead} />;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">

      {/* Nav */}
      <header className="px-4 sm:px-6 py-4 border-b border-slate-800/60 sticky top-0 z-50 bg-slate-950/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto brightness-0 invert opacity-80" />
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">SmartBuy™</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+18183002642" className="hidden sm:block text-sm text-slate-400 hover:text-white transition font-medium">(818) 300-2642</a>
            <button onClick={scrollToForm} className="px-5 py-2 bg-emerald-400 text-slate-900 text-sm font-black rounded-xl hover:bg-emerald-300 transition">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-6 py-20 sm:py-28">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 mb-6">
                <Brain className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs font-black text-slate-300 uppercase tracking-widest">AI-Guided Homebuying</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-5">
                Buy Your Home.<br />
                <span className="text-emerald-400">Keep The Commission.</span>
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed mb-4 max-w-lg">
                Buywiser SmartBuy™ is an AI-guided platform that walks you through your home purchase step by step — and shares the savings back with you.
              </p>

              <p className="text-sm text-slate-500 mb-8 max-w-md">
                The more you self-direct, the more you keep. Licensed professionals are available when you need them — and only when you need them.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button onClick={scrollToForm}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-400 text-slate-900 font-black rounded-xl text-base hover:bg-emerald-300 transition shadow-lg shadow-emerald-400/20">
                  Calculate My Savings Pool <ArrowRight className="h-4 w-4" />
                </button>
                <a href="tel:+18183002642"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-slate-700 text-slate-300 font-bold rounded-xl text-base hover:bg-slate-800 transition">
                  Talk to Buywiser
                </a>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-4">
                {["NMLS #1887767", "CA DRE #01107013", "Licensed in California", "No Obligation"].map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Shield className="h-3 w-3 text-slate-600" /> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Savings Meter */}
            <div>
              <SavingsMeter price={price} animated={true} />
              {/* Slider */}
              <div className="mt-4 bg-slate-900 rounded-xl border border-slate-800 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-semibold">Adjust Purchase Price</span>
                  <span className="text-sm font-black text-white">{formatCurrency(price)}</span>
                </div>
                <input type="range" min={300000} max={3000000} step={25000} value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full" style={{ accentColor: "#34d399" }} />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                  <span>$300K</span><span>$3M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 py-20 border-t border-slate-800/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">How It Works</p>
            <h2 className="text-3xl font-black text-white">The Machine™ Workflow</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map(({ icon, step, title, desc }) => (
              <div key={step} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-3 right-4 text-[10px] font-black text-slate-700">{step}</div>
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="text-sm font-black text-white mb-2">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Stages with values */}
      <section className="px-4 sm:px-6 py-16 bg-slate-900/50 border-y border-slate-800/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Savings Breakdown</p>
            <h2 className="text-2xl font-black text-white">What Each Stage Is Worth</h2>
            <p className="text-sm text-slate-400 mt-2">Based on a {formatCurrency(price)} home</p>
          </div>
          <div className="space-y-3">
            {WORKFLOW_STAGES.map((s, i) => {
              const val = Math.round(price * 0.025 * s.value);
              return (
                <div key={i} className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl px-5 py-3.5">
                  <span className="text-lg flex-shrink-0">{s.icon}</span>
                  <span className="flex-1 text-sm text-slate-300 font-medium">{s.label}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.value * 100 / 0.25 * 100}%` }} />
                    </div>
                    <span className="text-base font-black text-emerald-400 w-20 text-right">{formatCurrency(val)}</span>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-3.5 mt-2">
              <span className="text-sm font-black text-white">Total SmartBuy Savings Pool™</span>
              <span className="text-xl font-black text-emerald-400">{formatCurrency(Math.round(price * 0.025))}</span>
            </div>
          </div>
        </div>
      </section>

      {/* vs Traditional */}
      <section className="px-4 sm:px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Why SmartBuy™</p>
            <h2 className="text-2xl font-black text-white">SmartBuy™ vs. Traditional</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-3 flex items-center gap-1.5"><TrendingDown className="h-3 w-3" /> Traditional</p>
              <div className="space-y-3">
                {VS_TRADITIONAL.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-400 leading-relaxed">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>{r.traditional}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-1.5"><Zap className="h-3 w-3" /> SmartBuy™</p>
              <div className="space-y-3">
                {VS_TRADITIONAL.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />{r.smartbuy}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intake Form */}
      <section ref={formRef} className="px-4 sm:px-6 py-20 border-t border-slate-800/60 bg-slate-900/30">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Start Here</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Activate Your SmartBuy™ Account</h2>
            <p className="text-slate-400 text-sm">Enter your property details to initialize your Savings Pool and start the workflow.</p>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8">
            <SmartBuyIntakeForm
              onSuccess={(lead) => { setSubmittedLead(lead); setSubmitted(true); }}
              onPriceChange={setPrice}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-10 border-t border-slate-800/60 text-center">
        <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto mx-auto mb-4 brightness-0 invert opacity-30" />
        <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed mb-2">
          Buywiser SmartBuy™ is a private program offered by BuyWiser Technology, Inc. Not a government program. Savings estimates are based on typical buyer-side commission structures and are not guaranteed. Final savings depend on transaction structure, eligibility, and applicable rules.{" "}
          <a href="/Disclosures" className="underline hover:text-slate-400 transition">Licensing &amp; Disclosures</a>
        </p>
        <p className="text-[10px] text-slate-700">BuyWiser Technology, Inc. DBA BuyWiser Home Loans · NMLS #1887767 · CA DRE #01107013 · © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}