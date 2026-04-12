import { useState } from "react";
import { CheckCircle, ArrowRight, Home, Users, DollarSign, Shield, Star, Zap, TrendingUp, AlertTriangle } from "lucide-react";

function formatCurrency(val) {
  if (!val) return "$0";
  return Number(val).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function RebateCalculator() {
  const [price, setPrice] = useState("");

  const numeric = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
  const rebate = numeric * 0.01;

  const handleInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setPrice(raw);
  };

  const displayPrice = price ? Number(price).toLocaleString("en-US") : "";

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-10">
      <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-2">Rebate Calculator</p>
      <h3 className="text-2xl font-black text-slate-900 mb-1">What's your 1% Buywiser Rebate?</h3>
      <p className="text-slate-500 text-sm mb-6">Enter the purchase price and see your rebate instantly.</p>

      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">Purchase Price</label>
      <div className="relative mb-5">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-2xl font-semibold">$</span>
        <input
          type="text"
          inputMode="numeric"
          value={displayPrice}
          onChange={handleInput}
          placeholder="1,000,000"
          className="w-full pl-12 pr-6 py-5 text-3xl font-black text-slate-900 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 bg-white transition"
        />
      </div>

      <div className={`rounded-2xl p-6 mb-5 text-center transition-all duration-300 ${numeric > 0 ? "bg-emerald-50 border-2 border-emerald-300" : "bg-slate-50 border-2 border-slate-200"}`}>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Estimated Rebate</p>
        <p className={`text-6xl font-black transition-all duration-300 ${numeric > 0 ? "text-emerald-600" : "text-slate-200"}`}>
          {numeric > 0 ? formatCurrency(rebate) : "$0"}
        </p>
      </div>

      <a
        href="#dashboard"
        className="block w-full py-4 bg-slate-900 text-white text-base font-bold rounded-2xl hover:bg-slate-800 transition text-center"
      >
        Start My Buywiser Path →
      </a>
      <p className="text-xs text-slate-400 text-center mt-3">Available on qualifying purchases. Terms apply.</p>
    </div>
  );
}

export default function BuywiserHome() {
  return (
    <div className="bg-white text-slate-900 font-sans">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="#" className="text-xl font-black text-slate-900 tracking-tight">
            Buy<span className="text-emerald-600">Wiser</span>
          </a>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-500">
            <a href="#how" className="hover:text-slate-900 transition">How It Works</a>
            <a href="#dashboard" className="hover:text-slate-900 transition">Buyer Dashboard</a>
            <a href="#testimonials" className="hover:text-slate-900 transition">Stories</a>
          </div>
          <a href="#dashboard" className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition">
            Start My Path
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-28 pb-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* Left: Headline */}
            <div className="pt-8 pb-16">
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-8 uppercase tracking-widest">
                Join the Club
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight mb-6">
                A wiser way to buy and finance a home
              </h1>

              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                Most buyers lose leverage the moment they click "View Property." Buywiser gives you a smarter path — the right agent, the right financing, and a coordinated buyer advantage designed to deliver real savings.
              </p>

              {/* Warning punch line */}
              <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl px-6 py-4 mb-10">
                <p className="text-amber-900 font-black text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  Don't click "View Property." <span className="text-slate-900 ml-1">BUY WISER first.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#dashboard" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition text-base shadow-lg">
                  Start My Buywiser Path <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#how" className="inline-flex items-center justify-center gap-2 px-7 py-4 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition text-base">
                  See How It Works
                </a>
              </div>
            </div>

            {/* Right: Calculator — hero-level */}
            <div className="pb-0 lg:pt-8">
              <RebateCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY NOT CLICK THE PORTAL ── */}
      <section className="py-16 bg-slate-950 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-4">The Smart Move</p>
          <h2 className="text-2xl md:text-3xl font-black mb-4">Why not just click "View Property"?</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Because the fastest path is not always the smartest one. Buywiser helps you take control <em className="text-white">before</em> the wrong showing path, the wrong agent relationship, or the wrong financing structure costs you money.
          </p>
        </div>
      </section>

      {/* ── DEFAULT vs BUYWISER PATH ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">Two Paths</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Most buyers go à la carte.<br />Smart buyers <span className="text-emerald-600">BUY WISER.</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default path */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-500 font-black text-base">✗</span>
                </div>
                <h3 className="text-xl font-black text-slate-700">The Default Path</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Click "View Property"',
                  "Routed into the portal flow",
                  "Agent chosen by convenience",
                  "Financing handled separately",
                  "Less leverage, less control",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Buywiser path */}
            <div className="bg-emerald-950 border-2 border-emerald-700/50 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-white">The Buywiser Path</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Enter the property into Buywiser first",
                  "Get the right showing path",
                  "Paired with a vetted agent",
                  "Smart financing strategy",
                  "Real rebate potential",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-emerald-100 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Three parts. One coordinated advantage.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                icon: Home,
                title: "Property Showing",
                text: "Enter the address or listing link. Buywiser coordinates the right path to get you in the door without giving up control.",
              },
              {
                num: "02",
                icon: Users,
                title: "Paired Agent",
                text: "We pair you with the right agent for the opportunity — not just the first available one.",
              },
              {
                num: "03",
                icon: TrendingUp,
                title: "Smart Financing",
                text: "Competitive financing and a mortgage strategy built around your purchase — not a generic quote.",
              },
            ].map((card) => (
              <div key={card.num} className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-4xl font-black text-slate-100">{card.num}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">{card.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BUYER DASHBOARD ── */}
      <section id="dashboard" className="py-20 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-4">Buyer Dashboard</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-5">It starts on the Buywiser Buyer Dashboard</h2>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                Instead of pushing "View Property" on a search site, enter the property into Buywiser first. In four steps you'll know your rebate, your showing path, your agent match, and your financing options.
              </p>

              {/* 4-step flow */}
              <ol className="space-y-4 mb-8">
                {[
                  "Enter purchase price",
                  "See your estimated rebate",
                  "Enter property address or listing link",
                  "Get paired with showing path, agent, and financing",
                ].map((step, i) => (
                  <li key={step} className="flex items-center gap-4">
                    <span className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                    <span className="text-slate-300 text-sm font-medium">{step}</span>
                  </li>
                ))}
              </ol>

              <div className="p-4 bg-amber-900/20 border border-amber-700/30 rounded-2xl mb-6">
                <p className="text-amber-300 font-semibold text-sm">Don't push "View Property" on any search site. <strong className="text-white">BUY WISER first.</strong></p>
              </div>

              <a href="#" className="inline-flex items-center gap-2 px-7 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition text-base shadow-lg">
                Start My Buywiser Path <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Dashboard mockup */}
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="bg-slate-900 px-5 py-3.5 flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-slate-400 text-xs font-mono">buywiser.com/dashboard</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-base">Buyer Dashboard</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full">Active</span>
                </div>

                {/* Step 1 */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">① Purchase Price</p>
                  <p className="text-slate-900 font-black text-xl">$1,250,000</p>
                </div>

                {/* Step 2 */}
                <div className="bg-emerald-50 rounded-xl p-3 border-2 border-emerald-300">
                  <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-1">② Estimated Rebate</p>
                  <p className="text-emerald-700 font-black text-2xl">$12,500</p>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">③ Property Address</p>
                  <p className="text-slate-700 text-sm font-medium">1842 Hillcrest Ave, Thousand Oaks, CA</p>
                </div>

                {/* Step 4 */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-xs text-slate-400 font-semibold mb-1">④ Agent</p>
                    <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">Pairing</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-xs text-slate-400 font-semibold mb-1">④ Financing</p>
                    <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">In Review</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2">
                  Continue My Buywiser Path <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY BUYWISER ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">Why Buywiser</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">More than a rebate.<br />A smarter transaction.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: DollarSign, title: "Real Savings", text: "Better coordination, smarter financing, and a buyer rebate built into the transaction." },
              { icon: Users, title: "Vetted Professionals", text: "Paired with the right agent — not just the first available one." },
              { icon: Shield, title: "Reduced Risk", text: "A coordinated strategy avoids costly mistakes and weak handoffs." },
              { icon: CheckCircle, title: "Buyer Control", text: "From first showing to final loan, you move with clarity and confidence." },
            ].map((card) => (
              <div key={card.title} className="bg-slate-50 border border-slate-200 rounded-3xl p-7 hover:shadow-md transition">
                <div className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5">
                  <card.icon className="h-5 w-5 text-emerald-700" />
                </div>
                <h3 className="font-black text-slate-900 mb-2 text-base">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">Client Stories</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">What Buywiser clients say</h2>
          </div>

          {/* Featured testimonial */}
          <div className="bg-slate-900 text-white rounded-3xl p-10 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="flex gap-1 mb-5">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-6 max-w-2xl relative z-10">
              "By utilizing Buywiser's coordinated services, my husband Allen and I sold our home and bought two homes. We must have saved a minimum of $100,000 between the credits we received from our inspections and our buyer rebates."
            </p>
            <div className="relative z-10">
              <p className="font-black text-white text-base">Ami and Allen K.</p>
              <p className="text-emerald-400 text-sm font-medium">Thousand Oaks, CA</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                quote: "We were paired with a strong local agent, got excellent financing guidance, and the rebate was a real benefit at closing. The whole process felt organized from day one.",
                name: "Melissa R.",
                location: "Newport Beach, CA",
              },
              {
                quote: "Instead of dealing with everything separately, Buywiser tied the whole transaction together and helped us save money at multiple points in the process.",
                name: "David and Priya S.",
                location: "Austin, TX",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-700 text-base leading-relaxed mb-5 italic">"{t.quote}"</p>
                <p className="font-black text-slate-900 text-sm">{t.name}</p>
                <p className="text-emerald-600 text-xs font-medium">{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-5">Ready to buy wiser?</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            No matter where you search, follow the Buywiser path to smarter financing, vetted professionals, and real savings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition text-base shadow-lg">
              Start My Buywiser Path <ArrowRight className="h-4 w-4" />
            </a>
            <a href="mailto:hello@buywiser.com" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-600 text-white font-bold rounded-2xl hover:border-slate-400 transition text-base">
              Talk to Buywiser
            </a>
          </div>
          <p className="mt-10 text-sm text-slate-600 font-bold italic">Search anywhere. Don't hand over control. BUY WISER.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <div className="text-2xl font-black mb-3">Buy<span className="text-emerald-500">Wiser</span></div>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                The smarter way to buy and finance a home. Coordinated showings, vetted agents, and competitive financing — together.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm text-slate-500">
              {["How It Works", "Buyer Dashboard", "Financing", "Stories", "Contact"].map((item) => (
                <a key={item} href="#" className="hover:text-white transition py-1">{item}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} BuyWiser. All rights reserved.</p>
            <p className="text-xs text-slate-600">Available on qualifying purchases. Terms and availability may vary.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}