import { useState, useRef } from "react";
import { ArrowRight, Zap, Shield, Brain, TrendingDown, CheckCircle, Phone, Award, Star, Lock, Unlock } from "lucide-react";
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
              <div className="flex flex-wrap gap-3 mb-5">
                {["NMLS #1887767", "CA DRE #01107013", "Licensed in California", "No Obligation"].map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Shield className="h-3 w-3 text-slate-600" /> {t}
                  </div>
                ))}
              </div>
              {/* Partner brand badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mr-1">Backed by:</span>
                {["Compass", "Rocket Pro", "Keller Williams", "RE Law"].map(b => (
                  <div key={b} className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-400">
                    {b}
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

      {/* Professional Backup Section */}
      <section className="px-4 sm:px-6 py-20 border-t border-slate-800/60">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
              <Unlock className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Instant Professional Access · Unlock Anytime</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-3">World-Class Professionals.<br />One Token Away.</h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto leading-relaxed">
              SmartBuy™ is self-directed by design — but you're never alone. The moment you want a licensed expert, you unlock them instantly. Our professional network is on standby throughout your entire transaction.
            </p>
          </div>

          {/* Bennett Card — Hero Expert */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-amber-500/30 rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row gap-6 items-start relative">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-slate-700 border-2 border-amber-500/50 flex items-center justify-center text-3xl overflow-hidden">
                  🏦
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">Lead Mortgage Expert</span>
                  <span className="text-xs text-slate-500 font-mono">30 Years Experience</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1">Bennett Liss</h3>
                <p className="text-sm text-slate-400 font-semibold mb-3">Founder, BuyWiser Home Loans · NMLS #1524446 · CA DRE #01107013</p>
                <p className="text-sm text-slate-300 leading-relaxed mb-4 max-w-xl">
                  With 30 years of California mortgage experience, Bennett has helped thousands of buyers navigate purchase financing — from first-time buyers to complex jumbo transactions. When you unlock mortgage guidance on SmartBuy™, Bennett's team is who you get.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-700">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> VA Loan Specialist
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-700">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> FHA · Conventional · Jumbo
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-700">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400" /> California Expert Since 1991
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <a href="tel:+18183002642" className="inline-flex items-center gap-2 px-5 py-3 bg-amber-400 text-slate-900 font-black rounded-xl text-sm hover:bg-amber-300 transition whitespace-nowrap">
                  <Phone className="h-3.5 w-3.5" /> (818) 300-2642
                </a>
              </div>
            </div>
          </div>

          {/* Partner Network Grid */}
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500 text-center mb-6">Professional Partner Network — Available On Demand</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Compass */}
              <div className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-5 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition">
                    <span className="text-slate-900 font-black text-sm tracking-tighter">✦</span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">Compass</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Real Estate Brokerage</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Top-tier buyer agent representation available when you choose to unlock agent support.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                  <Lock className="h-2.5 w-2.5" /> Unlock with token
                </div>
              </div>

              {/* Rocket Pro */}
              <div className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-5 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition">
                    <span className="text-white font-black text-xs">🚀</span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">Rocket Pro</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Mortgage Partner</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Backup mortgage origination channel for rate comparison and alternative loan programs.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                  <Lock className="h-2.5 w-2.5" /> Unlock with token
                </div>
              </div>

              {/* KW */}
              <div className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-5 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition">
                    <span className="text-white font-black text-xs">KW</span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">Keller Williams</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Realty Network</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Full-service KW agent representation across California markets when you need boots on the ground.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                  <Lock className="h-2.5 w-2.5" /> Unlock with token
                </div>
              </div>

              {/* Real Estate Law */}
              <div className="bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-2xl p-5 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 border border-blue-700 flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition">
                    <Award className="h-4 w-4 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">RE Law Firm</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Legal Counsel</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">Contract review, title issues, dispute resolution — licensed real estate attorneys on call.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                  <Lock className="h-2.5 w-2.5" /> Unlock with token
                </div>
              </div>
            </div>
          </div>

          {/* Unlock Promise Banner */}
          <div className="bg-slate-900 border border-slate-700 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                <Unlock className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-black text-white">You Are Never Stuck. Help Is One Tap Away.</p>
                <p className="text-xs text-slate-400 mt-0.5">Every SmartBuy™ user has instant access to licensed professionals at any point in the workflow — no waiting, no hold music, no appointment required.</p>
              </div>
            </div>
            <button onClick={scrollToForm} className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-emerald-400 text-slate-900 font-black rounded-xl text-sm hover:bg-emerald-300 transition whitespace-nowrap">
              Start Free <ArrowRight className="h-3.5 w-3.5" />
            </button>
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
      <footer className="border-t border-slate-800/60">

        {/* License Bar */}
        <div className="px-4 sm:px-6 py-6 border-b border-slate-800/40 bg-slate-900/40">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">

              {/* Equal Housing */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <svg className="h-8 w-8 text-slate-500 flex-shrink-0" viewBox="0 0 40 40" fill="currentColor">
                  <path d="M20 4L2 16h4v20h28V16h4L20 4zm0 3.5L34 17v1h-2V34H8V18H6L20 7.5zM16 20h8v2h-8v-2zm0 4h8v2h-8v-2z"/>
                </svg>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight">Equal Housing</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-tight">Lender</p>
                </div>
              </div>

              <div className="w-px h-8 bg-slate-700 hidden sm:block" />

              {/* License grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2 flex-1">
                {[
                  { label: "Company NMLS", value: "#1887767" },
                  { label: "Personal NMLS", value: "#1524446" },
                  { label: "CA DRE License", value: "#01107013" },
                  { label: "CA DFPI", value: "CRMLA Licensed" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">{label}</p>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              <div className="w-px h-8 bg-slate-700 hidden sm:block" />

              {/* NMLS verify link */}
              <a href="https://www.nmlsconsumeraccess.org" target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 text-[10px] text-slate-600 hover:text-slate-400 transition underline underline-offset-2 whitespace-nowrap">
                Verify at NMLS Consumer Access →
              </a>
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div className="px-4 sm:px-6 py-8 text-center">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto mx-auto mb-4 brightness-0 invert opacity-25" />
          <p className="text-xs text-slate-600 max-w-2xl mx-auto leading-relaxed mb-3">
            Buywiser SmartBuy™ is a DBA of BuyWiser Technology, Inc. DBA BuyWiser Home Loans. This is a private program — not a government benefit. Savings estimates are based on typical buyer-side commission structures and are not guaranteed. Final savings depend on transaction structure, eligibility, and applicable rules. All loan programs subject to borrower qualification. Rates and terms subject to change without notice.{" "}
            <a href="/Disclosures" className="underline hover:text-slate-400 transition">Licensing &amp; Disclosures</a>
            {" · "}
            <a href="/PrivacyPolicy" className="underline hover:text-slate-400 transition">Privacy Policy</a>
          </p>
          <p className="text-[10px] text-slate-700">© {new Date().getFullYear()} BuyWiser Technology, Inc. · All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}