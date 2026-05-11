import { useState, useRef } from "react";
import { ArrowRight, Zap, Shield, Brain, TrendingDown, CheckCircle, Phone, Award, Star, Lock, Unlock, RotateCcw, Users, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SavingsMeter from "../components/smartbuy/SavingsMeter";
import SmartBuyIntakeForm from "../components/smartbuy/SmartBuyIntakeForm";
import UnlockModal from "../components/smartbuy/UnlockModal";
import UnlockSteps from "../components/smartbuy/UnlockSteps";
import CommonQuestions from "../components/smartbuy/CommonQuestions";
import JourneyProgressBar from "../components/smartbuy/JourneyProgressBar";
import TokenRewind from "../components/smartbuy/TokenRewind";
import PropertyServicesMarketplace from "../components/smartbuy/marketplace/PropertyServicesMarketplace";
import ServicePriceList from "../components/smartbuy/ServicePriceList";
import TokenBalanceIndicator from "../components/smartbuy/TokenBalanceIndicator";
import ReferralSection from "../components/smartbuy/ReferralSection";
import TokenTutorial from "../components/smartbuy/TokenTutorial";
import MyReports from "../components/smartbuy/MyReports";

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
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [tokensSpent, setTokensSpent] = useState(0);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const savingsPool = Math.round(price * 0.025);

  const handleAddressChange = async (e) => {
    const value = e.target.value;
    // Check if it's a URL
    if (value.includes("zillow.com") || value.includes("redfin.com") || value.includes("realtor.com")) {
      setLoading(true);
      try {
        const response = await base44.functions.invoke("fetchPropertyFromUrl", { url: value });
        if (response.data?.price) {
          setPrice(response.data.price);
        }
      } catch (err) {
        console.error("Failed to fetch property:", err);
      }
      setLoading(false);
    }
  };

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (submitted) return <SuccessScreen lead={submittedLead} />;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <UnlockModal
        isOpen={unlockOpen}
        onClose={() => setUnlockOpen(false)}
        savingsPool={savingsPool}
        tokensSpent={tokensSpent}
        onUnlock={(cost) => setTokensSpent(t => t + cost)}
      />

      {/* Nav */}
      <header className="px-4 sm:px-6 py-4 border-b border-slate-200 sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto" />
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">SmartBuy™</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <TokenBalanceIndicator tokensRemaining={savingsPool - tokensSpent} savingsPool={savingsPool} />
            <a href="/our-experts" className="hidden sm:flex items-center gap-1.5 text-xs font-black text-amber-700 hover:text-amber-800 transition">
              <Award className="h-3.5 w-3.5" /> Our Experts
            </a>
            <a href="/marketplace" className="hidden sm:flex items-center gap-1.5 text-xs font-black text-emerald-700 hover:text-emerald-800 transition">
              <Zap className="h-3.5 w-3.5" /> Marketplace
            </a>
            <a href="/token-rewind" className="hidden sm:flex items-center gap-1.5 text-xs font-black text-violet-600 hover:text-violet-700 transition">
              <RotateCcw className="h-3.5 w-3.5" /> Token Rewind™
            </a>
            <a href="tel:+18183002642" className="hidden sm:block text-sm text-slate-600 hover:text-slate-900 transition font-medium">(818) 300-2642</a>
            <button onClick={scrollToForm} className="px-5 py-2 bg-emerald-400 text-slate-900 text-sm font-black rounded-xl hover:bg-emerald-300 transition">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900">
        {/* Background accent elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
          <div className="max-w-5xl mx-auto">
            {/* Hero content - centered for better impact */}
            <div className="text-center mb-12 lg:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 mb-6">
                <Brain className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs font-black text-emerald-200 uppercase tracking-widest">Expert-Led Homebuying & Finance</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6 text-white">
                Buy Smarter.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-400">Keep the Savings.</span>
              </h1>

              <p className="text-lg sm:text-xl text-emerald-100 leading-relaxed mb-6 max-w-3xl mx-auto">
                Buywiser SmartBuy™ pairs you with licensed professionals and AI-powered insights — so every step of your home purchase is guided by real expertise, not guesswork.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <button onClick={scrollToForm}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-400 text-slate-900 font-black rounded-xl text-base hover:bg-emerald-300 transition shadow-lg shadow-emerald-400/30">
                  Calculate My Savings <ArrowRight className="h-4 w-4" />
                </button>
                <a href="tel:+18183002642"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-emerald-300/50 text-emerald-100 font-bold rounded-xl text-base hover:bg-emerald-500/10 transition">
                  <Phone className="h-4 w-4" /> (818) 300-2642
                </a>
              </div>

              {/* Trust signals */}
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {["NMLS #1887767", "CA DRE #01107013", "Licensed in California"].map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-xs text-emerald-200">
                    <Shield className="h-3 w-3 text-emerald-400" /> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Card - Full width below hero text */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Input Section */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-3xl">🔍</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Find Your Home</h2>
                  </div>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    Paste any property link or enter an address. Your savings potential updates in real-time as you explore.
                  </p>

                  {/* Address Input */}
                  <div className="mb-6">
                    <label className="block text-xs font-black text-slate-700 mb-3 uppercase tracking-wider">Property Address or Link</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g., 123 Main St, Los Angeles, CA or Zillow link..."
                        onChange={handleAddressChange}
                        className="w-full px-5 py-3.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition bg-slate-50 hover:bg-white"
                      />
                      {loading && (
                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-emerald-500 animate-spin" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                      <span>⚡</span> Updates automatically as you type or paste a Zillow link
                    </p>
                  </div>

                  {/* Price Input */}
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-3 uppercase tracking-wider">Or Enter Price Directly</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-lg">$</span>
                      <input
                        type="number"
                        placeholder="750000"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value) || 750000)}
                        className="w-full pl-10 pr-5 py-3.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition bg-slate-50 hover:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Savings Display */}
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-4">Your SmartBuy™ Savings</p>
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border-2 border-emerald-200 p-6 mb-6">
                      <p className="text-emerald-700 text-sm mb-2">Estimated Savings Pool</p>
                      <p className="text-4xl sm:text-5xl font-black text-emerald-600 mb-3">
                        {formatCurrency(Math.round(price * 0.025))}
                      </p>
                      <p className="text-sm text-emerald-600">2.5% buyer rebate · Complete each stage to keep it all</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-[10px] text-slate-600 uppercase font-bold mb-2">Commission Savings</p>
                        <p className="text-xl font-black text-slate-900">{formatCurrency(price * 0.025)}</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-[10px] text-slate-600 uppercase font-bold mb-2">Service Budget</p>
                        <p className="text-xl font-black text-slate-900">{formatCurrency(price * 0.015)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                    <p className="text-xs font-black text-blue-900 mb-2">💡 How It Works</p>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Your rebate becomes a token pool. Use AI for free. Only activate professionals when you need them—keeping your savings intact.
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Slider - Full width */}
              <div className="mt-8 pt-8 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Adjust Purchase Price</label>
                  <span className="text-2xl font-black text-slate-900">{formatCurrency(price)}</span>
                </div>
                <input
                  type="range"
                  min={300000}
                  max={3000000}
                  step={25000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-semibold">
                  <span>$300K</span>
                  <span>$1.5M</span>
                  <span>$3M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Progress Bar */}
      <JourneyProgressBar />

      {/* How It Works */}
      <section className="px-4 sm:px-6 py-20 border-t border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">How It Works</p>
            <h2 className="text-3xl font-black text-slate-900">The SmartBuy™ Process</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_IT_WORKS.map(({ icon, step, title, desc }) => (
              <div key={step} className="bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden flex flex-col shadow-sm">
                <div className="absolute top-3 right-4 text-[10px] font-black text-slate-300">{step}</div>
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="text-sm font-black text-slate-900 mb-2">{title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed flex-1">{desc}</p>
                <button
                  onClick={() => setUnlockOpen(true)}
                  className="mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-black text-amber-600 border border-amber-300 bg-amber-50 hover:bg-amber-100 transition"
                >
                  <Unlock className="h-3 w-3" /> Get Help
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-5">Stuck at any stage? Tap <span className="text-amber-600 font-bold">Get Help</span> to connect with a licensed professional.</p>
        </div>
      </section>

      {/* Workflow Stages */}
      <section className="px-4 sm:px-6 py-16 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">The Six Stages</p>
            <h2 className="text-2xl font-black text-slate-900">Your Home Purchase, Step by Step</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">These are the six stages every buyer goes through. Complete each one yourself and keep the savings. Need help at any stage? One tap connects you to a licensed professional.</p>
          </div>
          <div className="space-y-3">
            {WORKFLOW_STAGES.map((s, i) => (
              <div key={i} className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5">
                <span className="text-lg flex-shrink-0">{s.icon}</span>
                <div className="flex-1">
                  <span className="text-sm text-slate-800 font-semibold">{s.label}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:block">Stage {i + 1}</span>
              </div>
            ))}
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3.5 mt-2">
              <span className="text-sm font-black text-slate-900">Your estimated SmartBuy™ Savings Pool</span>
              <span className="text-xl font-black text-emerald-700">{formatCurrency(Math.round(price * 0.025))}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Meet Your Expert ── */}
      <section className="px-4 sm:px-6 py-20 border-t border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-black uppercase tracking-widest text-amber-600 mb-2">Your Lead Expert</p>
            <h2 className="text-3xl font-black text-slate-900">Three Decades of California Expertise</h2>
            <p className="text-slate-500 text-sm mt-3 max-w-xl mx-auto">Behind every SmartBuy™ transaction is a licensed professional with 30 years of California mortgage and real estate experience. You are always guided by someone who has seen it all.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Portrait side */}
            <div className="lg:col-span-2 flex flex-col items-center lg:items-start gap-5">
              <div className="relative">
                <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-amber-300 flex items-center justify-center text-6xl shadow-lg">
                  🏦
                </div>
                <div className="absolute -bottom-3 -right-3 bg-emerald-400 text-slate-900 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  Since 1991
                </div>
              </div>
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-black text-slate-900">Bennett Liss</h3>
                <p className="text-sm text-amber-600 font-semibold mt-0.5">Founder, BuyWiser Home Loans</p>
                <p className="text-xs text-slate-400 mt-1">NMLS #1524446 · CA DRE #01107013</p>
              </div>
              <a href="tel:+18183002642"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-slate-900 font-black rounded-xl text-sm hover:bg-amber-300 transition shadow-lg w-full sm:w-auto justify-center lg:justify-start">
                <Phone className="h-4 w-4" /> (818) 300-2642
              </a>
            </div>

            {/* Bio side */}
            <div className="lg:col-span-3 space-y-5">
              <blockquote className="border-l-4 border-amber-400 pl-5">
                <p className="text-lg text-slate-700 font-semibold leading-relaxed italic">
                  "SmartBuy™ gives buyers the tools to handle what they can handle — and makes sure a real expert is there the moment they need one. I've been doing this for 30 years. I know where buyers get stuck, and that's exactly where we step in."
                </p>
                <footer className="text-xs text-slate-500 mt-2 not-italic">— Bennett Liss, Founder</footer>
              </blockquote>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { stat: "30+", label: "Years in CA Mortgage" },
                  { stat: "1,000s", label: "Buyers Helped" },
                  { stat: "1991", label: "Licensed in California" },
                  { stat: "VA", label: "Loan Specialist" },
                  { stat: "FHA", label: "Streamline Expert" },
                  { stat: "Jumbo", label: "High-Value Purchases" },
                ].map(({ stat, label }) => (
                  <div key={label} className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-center shadow-sm">
                    <p className="text-lg font-black text-amber-600">{stat}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold leading-tight mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                When you unlock mortgage guidance on SmartBuy™, you get direct access to Bennett's team — not a call center, not a chatbot. A licensed California mortgage professional who has navigated every market cycle since the early 1990s.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Unlock Steps ── */}
      <UnlockSteps onUnlock={() => setUnlockOpen(true)} />

      {/* ── Partner Credibility Bar ── */}
      <section className="px-4 sm:px-6 py-12 border-t border-slate-100 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-black uppercase tracking-widest text-slate-400 mb-8">Our Professional Partner Network</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

            {/* Compass */}
            <div className="flex flex-col items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-6 hover:border-slate-300 hover:shadow-sm transition group">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition">
                <svg viewBox="0 0 80 80" className="w-8 h-8" fill="none">
                  <circle cx="40" cy="40" r="38" stroke="#111" strokeWidth="4"/>
                  <polygon points="40,10 52,40 40,35 28,40" fill="#111"/>
                  <polygon points="40,70 28,40 40,45 52,40" fill="#555"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-800">Compass</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Real Estate</p>
              </div>
            </div>

            {/* Rocket Pro */}
            <div className="flex flex-col items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-6 hover:border-slate-300 hover:shadow-sm transition group">
              <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-sm group-hover:shadow-md transition">
                <span className="text-white text-2xl">🚀</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-800">Rocket Pro</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Mortgage</p>
              </div>
            </div>

            {/* Keller Williams */}
            <div className="flex flex-col items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-6 hover:border-slate-300 hover:shadow-sm transition group">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition">
                <span className="text-slate-800 font-black text-xl tracking-tighter">KW</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-800">Keller Williams</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Realty</p>
              </div>
            </div>

            {/* RE Law */}
            <div className="flex flex-col items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 py-6 hover:border-slate-300 hover:shadow-sm transition group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-800">RE Law Firm</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Legal Counsel</p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6 max-w-lg mx-auto">
            Partner firms are available on-demand through the SmartBuy™ token unlock system. Buywiser coordinates access — you choose when and what to activate.
          </p>
        </div>
      </section>

      {/* Professional Backup Section */}
      <section className="px-4 sm:px-6 py-20 border-t border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
              <Unlock className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Licensed Professionals · On Demand</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3">Seasoned Professionals,<br />Always Within Reach.</h2>
            <p className="text-slate-500 text-base max-w-2xl mx-auto leading-relaxed">
              Every SmartBuy™ journey is backed by decades of California mortgage and real estate expertise. Our licensed professionals are available the moment you need them — no hold queues, no gatekeeping.
            </p>
          </div>

          {/* Bennett Card — Hero Expert */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 sm:p-8 mb-8 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row gap-6 items-start relative">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-amber-300 flex items-center justify-center text-3xl overflow-hidden shadow-sm">
                  🏦
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-amber-700 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300">Lead Mortgage Expert</span>
                  <span className="text-xs text-slate-500 font-mono">30 Years Experience</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Bennett Liss</h3>
                <p className="text-sm text-slate-600 font-semibold mb-3">Founder, BuyWiser Home Loans · NMLS #1524446 · CA DRE #01107013</p>
                <p className="text-sm text-slate-700 leading-relaxed mb-4 max-w-xl">
                  With 30 years of California mortgage experience, Bennett has helped thousands of buyers navigate purchase financing — from first-time buyers to complex jumbo transactions. When you unlock mortgage guidance on SmartBuy™, Bennett's team is who you get.
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white rounded-lg px-3 py-1.5 border border-amber-200">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> VA Loan Specialist
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white rounded-lg px-3 py-1.5 border border-amber-200">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> FHA · Conventional · Jumbo
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white rounded-lg px-3 py-1.5 border border-amber-200">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> California Expert Since 1991
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
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 text-center mb-6">Professional Partner Network — Available On Demand</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Compass */}
              <div className="bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm rounded-2xl p-5 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-slate-900 font-black text-sm tracking-tighter">✦</span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">Compass</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Real Estate Brokerage</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">Top-tier buyer agent representation available when you choose to unlock agent support.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                  <Lock className="h-2.5 w-2.5" /> Available on request
                </div>
              </div>

              {/* Rocket Pro */}
              <div className="bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm rounded-2xl p-5 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-black text-xs">🚀</span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">Rocket Pro</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Mortgage Partner</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">Backup mortgage origination channel for rate comparison and alternative loan programs.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                  <Lock className="h-2.5 w-2.5" /> Available on request
                </div>
              </div>

              {/* KW */}
              <div className="bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm rounded-2xl p-5 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-slate-700 font-black text-xs">KW</span>
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">Keller Williams</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Realty Network</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">Full-service KW agent representation across California markets when you need boots on the ground.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                  <Lock className="h-2.5 w-2.5" /> Available on request
                </div>
              </div>

              {/* Real Estate Law */}
              <div className="bg-slate-50 border border-slate-200 hover:border-slate-300 hover:shadow-sm rounded-2xl p-5 transition group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800">RE Law Firm</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Legal Counsel</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">Contract review, title issues, dispute resolution — licensed real estate attorneys on call.</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                  <Lock className="h-2.5 w-2.5" /> Available on request
                </div>
              </div>
            </div>
          </div>

          {/* Unlock Promise Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center flex-shrink-0">
                <Unlock className="h-4 w-4 text-emerald-700" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">You Are Never Stuck. Help Is One Tap Away.</p>
                <p className="text-xs text-slate-500 mt-0.5">Every SmartBuy™ user has instant access to licensed professionals at any point in the workflow — no waiting, no hold music, no appointment required.</p>
              </div>
            </div>
            <button onClick={scrollToForm} className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-xl text-sm hover:bg-emerald-700 transition whitespace-nowrap">
              Start Free <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ── Service Pricing Guide ── */}
      <section className="px-4 sm:px-6 py-20 border-t border-slate-800/40 bg-white">
        <ServicePriceList />
      </section>

      {/* ── Property Services Marketplace™ ── */}
      <PropertyServicesMarketplace savingsPool={savingsPool} />

      {/* ── Token Rewind™ Guarantee ── */}
      <TokenRewind onGetStarted={scrollToForm} />

      {/* ── Common Questions ── */}
      <CommonQuestions />

      {/* ── My Reports ── */}
      {submittedLead?.email && (
        <section className="px-4 sm:px-6 py-16 border-t border-slate-100 bg-white">
          <div className="max-w-5xl mx-auto">
            <MyReports userEmail={submittedLead.email} />
          </div>
        </section>
      )}

      {/* ── Token Tutorial ── */}
      <TokenTutorial />

      {/* ── Referral Section ── */}
      <ReferralSection userEmail={submittedLead?.email} savingsPool={savingsPool} />

      {/* vs Traditional */}
      <section className="px-4 sm:px-6 py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">Why SmartBuy™</p>
            <h2 className="text-2xl font-black text-slate-900">A Smarter Standard of Home Buying</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-black uppercase tracking-widest text-red-500 mb-3 flex items-center gap-1.5"><TrendingDown className="h-3 w-3" /> Traditional</p>
              <div className="space-y-3">
                {VS_TRADITIONAL.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-500 leading-relaxed">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>{r.traditional}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-3 flex items-center gap-1.5"><Zap className="h-3 w-3" /> SmartBuy™</p>
              <div className="space-y-3">
                {VS_TRADITIONAL.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />{r.smartbuy}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intake Form */}
      <section ref={formRef} className="px-4 sm:px-6 py-20 border-t border-slate-200 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Start Here</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Begin Your SmartBuy™ Journey</h2>
            <p className="text-slate-500 text-sm">Share your property details and we'll calculate your savings potential — and connect you with your expert team.</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <SmartBuyIntakeForm
              onSuccess={(lead) => { setSubmittedLead(lead); setSubmitted(true); }}
              onPriceChange={setPrice}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">

        {/* License Bar */}
        <div className="px-4 sm:px-6 py-6 border-b border-slate-200 bg-white">
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

              <div className="w-px h-8 bg-slate-200 hidden sm:block" />

              {/* License grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2 flex-1">
                {[
                  { label: "Company NMLS", value: "#1887767" },
                  { label: "Personal NMLS", value: "#1524446" },
                  { label: "CA DRE License", value: "#01107013" },
                  { label: "CA DFPI", value: "CRMLA Licensed" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              <div className="w-px h-8 bg-slate-200 hidden sm:block" />

              {/* NMLS verify link */}
              <a href="https://www.nmlsconsumeraccess.org" target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 text-[10px] text-slate-500 hover:text-slate-800 transition underline underline-offset-2 whitespace-nowrap">
                Verify at NMLS Consumer Access →
              </a>
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div className="px-4 sm:px-6 py-8 text-center">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto mx-auto mb-4 opacity-40" />
          <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed mb-3">
            Buywiser SmartBuy™ is a DBA of BuyWiser Technology, Inc. DBA BuyWiser Home Loans. This is a private program — not a government benefit. Savings estimates are based on typical buyer-side commission structures and are not guaranteed. Final savings depend on transaction structure, eligibility, and applicable rules. All loan programs subject to borrower qualification. Rates and terms subject to change without notice.{" "}
            <a href="/Disclosures" className="underline hover:text-slate-700 transition">Licensing &amp; Disclosures</a>
            {" · "}
            <a href="/PrivacyPolicy" className="underline hover:text-slate-700 transition">Privacy Policy</a>
          </p>
          <p className="text-[10px] text-slate-400">© {new Date().getFullYear()} BuyWiser Technology, Inc. · All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}