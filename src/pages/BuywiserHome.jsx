import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Home, Users, DollarSign, Shield, Star, ChevronRight, Zap, TrendingUp } from "lucide-react";

function formatCurrency(val) {
  if (!val) return "";
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
    <section id="calculator" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4">Rebate Calculator</span>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">What's your 1% Buywiser Rebate?</h2>
        <p className="text-slate-500 text-lg mb-10">Enter the purchase price and see your rebate instantly.</p>

        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
          <label className="block text-sm font-semibold text-slate-700 mb-2 text-left">Purchase Price</label>
          <div className="relative mb-6">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl font-semibold">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={displayPrice}
              onChange={handleInput}
              placeholder="1,000,000"
              className="w-full pl-10 pr-6 py-5 text-2xl font-bold text-slate-900 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 bg-white transition"
            />
          </div>

          <div className={`rounded-2xl p-6 mb-6 transition-all duration-300 ${numeric > 0 ? "bg-emerald-50 border-2 border-emerald-200" : "bg-slate-100 border-2 border-slate-200"}`}>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Estimated Rebate</p>
            <p className={`text-5xl font-black transition-all duration-300 ${numeric > 0 ? "text-emerald-600" : "text-slate-300"}`}>
              {numeric > 0 ? formatCurrency(rebate) : "$0"}
            </p>
          </div>

          <a
            href="#dashboard"
            className="block w-full py-4 bg-slate-900 text-white text-base font-bold rounded-2xl hover:bg-slate-800 transition text-center mb-4"
          >
            Start My Buywiser Path
          </a>
          <p className="text-slate-500 text-sm mb-4">Next, enter the property address or listing link to begin your Buywiser path.</p>
          <p className="text-xs text-slate-400 leading-relaxed">Available on qualifying purchases. Terms, market availability, lender requirements, and state rules may apply.</p>
        </div>
      </div>
    </section>
  );
}

function DashboardMockup() {
  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
      {/* Top bar */}
      <div className="bg-slate-900 px-6 py-4 flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-4 text-slate-400 text-xs font-mono">buywiser.com/dashboard</span>
      </div>
      {/* Dashboard body */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-slate-900 text-base">Buyer Dashboard</span>
          <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-1 rounded-full">Active</span>
        </div>
        {/* Address field */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Property Address / Listing Link</p>
          <p className="text-slate-700 text-sm font-medium">1842 Hillcrest Ave, Thousand Oaks, CA 91360</p>
        </div>
        {/* Price + Rebate row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">Home Price</p>
            <p className="text-slate-900 font-bold text-lg">$1,250,000</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
            <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-1">Est. Rebate</p>
            <p className="text-emerald-700 font-black text-lg">$12,500</p>
          </div>
        </div>
        {/* Status rows */}
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-700 font-medium">Agent Pairing</span>
            </div>
            <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">In Review</span>
          </div>
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-700 font-medium">Financing Review</span>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">Pending</span>
          </div>
        </div>
        {/* CTA */}
        <button className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2">
          Continue My Buywiser Path <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function BuywiserHome() {
  return (
    <div className="bg-white text-slate-900 font-sans">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="#" className="text-xl font-black text-slate-900 tracking-tight">
            Buy<span className="text-emerald-600">Wiser</span>
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#how" className="hover:text-slate-900 transition">How It Works</a>
            <a href="#calculator" className="hover:text-slate-900 transition">Rebate Calculator</a>
            <a href="#dashboard" className="hover:text-slate-900 transition">Buyer Dashboard</a>
            <a href="#testimonials" className="hover:text-slate-900 transition">Testimonials</a>
          </div>
          <a href="#dashboard" className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition">
            Start My Path
          </a>
        </div>
      </nav>

      {/* ── SECTION 1: HERO ── */}
      <section className="pt-28 pb-20 bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
                The Smarter Buyer's Advantage
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
                A wiser way to buy and finance a home
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                Most buyers lose leverage the moment they click the "View Property" or "Request a Tour" button on a home search site. Buywiser gives you a smarter path by pairing you with the right agent, the right financing, and a coordinated buyer advantage designed to deliver real savings.
              </p>

              {/* Warning punch line */}
              <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl px-5 py-4 mb-8">
                <p className="text-amber-900 font-bold text-base">
                  Don't click "View Property." <span className="text-slate-900">BUY WISER first.</span>
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

            {/* Image collage */}
            <div className="relative h-[480px] hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80"
                alt="Couple celebrating home purchase"
                className="absolute top-0 right-0 w-72 h-64 object-cover rounded-3xl shadow-xl"
              />
              <img
                src="https://images.unsplash.com/photo-1591397978579-2de6edfb5f5c?w=800&q=80"
                alt="Family in front of new home"
                className="absolute bottom-0 left-0 w-64 h-56 object-cover rounded-3xl shadow-xl"
              />
              <img
                src="https://images.unsplash.com/photo-1484981138541-3d074aa97716?w=600&q=80"
                alt="Couple reviewing finances and smiling"
                className="absolute bottom-8 right-8 w-52 h-44 object-cover rounded-2xl shadow-lg border-4 border-white"
              />
              {/* Floating rebate badge */}
              <div className="absolute top-52 left-12 bg-white border border-emerald-200 rounded-2xl px-4 py-3 shadow-xl">
                <p className="text-xs text-slate-500 font-semibold">Buyer Rebate</p>
                <p className="text-2xl font-black text-emerald-600">$12,500</p>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Users, label: "Vetted Professionals" },
              { icon: Zap, label: "Smarter Financing" },
              { icon: DollarSign, label: "Real Savings" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-center gap-2.5 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
                <item.icon className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-slate-800 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: REBATE CALCULATOR ── */}
      <RebateCalculator />

      {/* ── SECTION 3: PROBLEM STATEMENT ── */}
      <section className="py-24 bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-emerald-400 uppercase mb-4">The Smarter Path</span>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Most buyers go à la carte.<br />Smart buyers <span className="text-emerald-400">BUY WISER.</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Most homebuyers piece the transaction together one step at a time and pay for it in the end. They click the property button, get routed into the default path, handle financing separately, and miss the coordinated savings that come from doing it intelligently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default path */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                  <span className="text-red-400 text-lg font-black">✗</span>
                </div>
                <h3 className="text-xl font-bold text-white">The Default Path</h3>
              </div>
              <ul className="space-y-3">
                {[
                  'Click "View Property"',
                  "Get pushed into the portal flow",
                  "Agent path chosen by convenience",
                  "Financing handled separately",
                  "Less leverage",
                  "Fewer coordinated savings",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Buywiser path */}
            <div className="bg-emerald-950/60 border border-emerald-700/40 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">The Buywiser Path</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Enter the property into Buywiser first",
                  "Get the right showing path",
                  "Paired with a vetted agent",
                  "Smart financing strategy",
                  "More control",
                  "Real rebate potential",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-emerald-100">
                    <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: HOW IT WORKS ── */}
      <section id="how" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4">How It Works</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Three parts of the transaction.<br />One coordinated buyer advantage.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                num: "01",
                icon: Home,
                title: "Property Showing",
                text: "Enter the address or listing link for the home you want to see. Buywiser helps coordinate the right path to get you in the door without giving up control at the start.",
              },
              {
                num: "02",
                icon: Users,
                title: "Paired Agent",
                text: "Buywiser pairs you with the right agent for the opportunity, not just the first available agent.",
              },
              {
                num: "03",
                icon: TrendingUp,
                title: "Loan Qualification",
                text: "Buywiser helps pair you with highly competitive financing and a smarter mortgage strategy tailored to your purchase.",
              },
            ].map((card) => (
              <div key={card.num} className="bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-4xl font-black text-slate-100">{card.num}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{card.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-8 py-6 text-center max-w-3xl mx-auto">
            <p className="text-slate-700 leading-relaxed">
              By coordinating these three core parts of the purchase together instead of separately, Buywiser helps unlock buyer rebates, stronger pricing, and meaningful savings opportunities throughout the transaction.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: BUYER DASHBOARD ── */}
      <section id="dashboard" className="py-24 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block text-xs font-bold tracking-widest text-emerald-400 uppercase mb-4">Buyer Dashboard</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-5">It all starts on the Buywiser Buyer Dashboard</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Instead of pushing the "View Property" button on a search site, enter the property address or listing link into Buywiser first. We coordinate the showing path, pair you with the right agent, and show you your estimated rebate advantage before you move forward.
              </p>
              <div className="p-5 bg-amber-900/20 border border-amber-700/30 rounded-2xl mb-6">
                <p className="text-amber-300 font-semibold">Don't push the "View Property" button on any search site. Make sure you <strong className="text-white">BUY WISER</strong> first.</p>
              </div>
              <a href="#" className="inline-flex items-center gap-2 px-7 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition text-base shadow-lg">
                Start My Buywiser Path <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ── SECTION 6: BENEFITS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4">Why Buywiser</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Why buyers choose Buywiser</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: DollarSign, title: "Save Money", text: "The right structure can create meaningful savings through better coordination, smarter financing, and buyer rebate opportunities." },
              { icon: Users, title: "Choose Better Professionals", text: "Buywiser pairs buyers with vetted professionals instead of leaving the transaction to chance." },
              { icon: Shield, title: "Reduce Risk", text: "A coordinated strategy helps avoid costly mistakes and weak handoffs during one of life's biggest purchases." },
              { icon: CheckCircle, title: "Buy With Confidence", text: "From the first showing to the final loan structure, Buywiser helps buyers move forward with more clarity and control." },
            ].map((card) => (
              <div key={card.title} className="bg-slate-50 border border-slate-200 rounded-3xl p-7 hover:shadow-md transition">
                <div className="w-11 h-11 bg-emerald-100 rounded-2xl flex items-center justify-center mb-5">
                  <card.icon className="h-5 w-5 text-emerald-700" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-base">{card.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4">Client Stories</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">What Buywiser clients say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
                quote: "By utilizing Buywiser's coordinated services, my husband Allen and I sold our home and bought two homes. We must have saved a minimum of $100,000 between the rebates and the credits we received from our inspections. Thank you, Buywiser.",
                name: "Ami and Allen K.",
                location: "Thousand Oaks, CA",
              },
              {
                img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
                quote: "Buywiser made the process feel organized from day one. We were paired with a strong local agent, got excellent financing guidance, and the rebate was a real benefit at closing.",
                name: "Melissa R.",
                location: "Newport Beach, CA",
              },
              {
                img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80",
                quote: "What stood out was the coordination. Instead of dealing with everything separately, Buywiser tied the whole transaction together and helped us save money at multiple points in the process.",
                name: "David and Priya S.",
                location: "Austin, TX",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                <div className="h-48 overflow-hidden">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed flex-1 mb-5 italic">"{t.quote}"</p>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-emerald-600 text-xs font-medium">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: POSITIONING ── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4">The Buywiser Advantage</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">More than a transaction.<br />A smarter way to take control.</h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
            Most buyers give up leverage before they even know they had it. Buywiser is built to stop that. We help buyers take control of the process before the wrong button, the wrong agent path, or the wrong financing structure costs them money.
          </p>
          <p className="text-slate-900 font-bold text-base border-t border-b border-slate-200 py-5 inline-block px-8">
            Our goal is simple: save buyers money, not add another fee to the process.
          </p>
        </div>
      </section>

      {/* ── SECTION 9: FINAL CTA ── */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
            <div>
              <div className="text-2xl font-black mb-3">Buy<span className="text-emerald-500">Wiser</span></div>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                The smarter way to buy and finance a home. Coordinated showings, vetted agents, and competitive financing — together.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-2 text-sm text-slate-400">
              {["How It Works", "Rebate Calculator", "Buyer Dashboard", "Financing", "Testimonials", "About", "Contact"].map((item) => (
                <a key={item} href="#" className="hover:text-white transition py-1">{item}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-600">© {new Date().getFullYear()} BuyWiser. All rights reserved.</p>
            <p className="text-xs text-slate-600">Available on qualifying purchases. Terms and availability may vary.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}