import { useState } from "react";
import { CheckCircle, ArrowRight, Home, Users, DollarSign, Shield, Star, TrendingUp, Ticket, Zap } from "lucide-react";

function formatCurrency(val) {
  if (!val) return "$0";
  return Number(val).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

// ── COUPON GRAPHIC ──
function CouponGraphic({ value, large }) {
  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${large ? "w-80 h-44" : "w-56 h-32"} select-none`}>
      {/* Card body */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-2xl" />
      {/* Notch left */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white z-10" />
      {/* Notch right */}
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white z-10" />
      {/* Dashed divider */}
      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-emerald-400/50 z-10" />
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center px-8">
        <p className={`font-bold text-emerald-100 uppercase tracking-widest ${large ? "text-xs mb-1" : "text-[10px] mb-0.5"}`}>Buywiser Coupon</p>
        <p className={`font-black text-white leading-none ${large ? "text-5xl" : "text-3xl"}`}>{value || "$10,000"}</p>
        <p className={`text-emerald-200 font-medium mt-1 ${large ? "text-xs" : "text-[10px]"}`}>Estimated Rebate Value</p>
      </div>
      {/* Shine */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-4" />
      </div>
    </div>
  );
}

// ── CALCULATOR ──
function CouponCalculator({ compact }) {
  const [price, setPrice] = useState("");
  const numeric = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
  const rebate = numeric * 0.01;
  const displayPrice = price ? Number(price).toLocaleString("en-US") : "";

  const handleInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setPrice(raw);
  };

  return (
    <div className={`bg-white rounded-3xl shadow-2xl border border-slate-100 ${compact ? "p-7" : "p-10"}`}>
      {!compact && (
        <>
          <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-2">Coupon Calculator</p>
          <h3 className="text-3xl font-black text-slate-900 mb-1">What's Your Buywiser Coupon Worth?</h3>
          <p className="text-slate-500 mb-8">Enter the purchase price and see your estimated 1% rebate instantly.</p>
        </>
      )}
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Purchase Price</label>
      <div className="relative mb-5">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-2xl font-black">$</span>
        <input
          type="text"
          inputMode="numeric"
          value={displayPrice}
          onChange={handleInput}
          placeholder="1,000,000"
          className="w-full pl-12 pr-6 py-5 text-3xl font-black text-slate-900 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 bg-white transition placeholder:text-slate-200"
        />
      </div>

      {/* Result */}
      <div className={`rounded-2xl p-6 mb-5 text-center transition-all duration-300 ${numeric > 0 ? "bg-emerald-50 border-2 border-emerald-300" : "bg-slate-50 border-2 border-slate-200"}`}>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Your Buywiser Coupon Value</p>
        <p className={`text-6xl font-black transition-all duration-500 ${numeric > 0 ? "text-emerald-600" : "text-slate-200"}`}>
          {numeric > 0 ? formatCurrency(rebate) : "$0"}
        </p>
        {numeric > 0 && (
          <p className="text-emerald-600 text-sm font-semibold mt-2">on a {formatCurrency(numeric)} purchase</p>
        )}
      </div>

      <a href="#dashboard" className="block w-full py-4 bg-slate-900 text-white text-base font-bold rounded-2xl hover:bg-slate-800 transition text-center mb-3">
        Start My Buywiser Path →
      </a>
      {!compact && (
        <>
          <p className="text-slate-500 text-sm text-center mb-2">Next, enter the property address or listing link to begin your Buywiser path.</p>
          <p className="text-xs text-slate-400 text-center leading-relaxed">Available on qualifying purchases. Terms, market availability, lender requirements, and state rules may apply.</p>
        </>
      )}
    </div>
  );
}

// ── MAIN PAGE ──
export default function BuywiserHome() {
  return (
    <div className="bg-white text-slate-900 font-sans overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="#" className="text-xl font-black text-slate-900 tracking-tight">
            Buy<span className="text-emerald-600">Wiser</span>
          </a>
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-500">
            <a href="#how" className="hover:text-slate-900 transition">How It Works</a>
            <a href="#calculator" className="hover:text-slate-900 transition">Coupon Calculator</a>
            <a href="#dashboard" className="hover:text-slate-900 transition">Dashboard</a>
            <a href="#testimonials" className="hover:text-slate-900 transition">Stories</a>
          </div>
          <a href="#calculator" className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-500 transition shadow-sm">
            See My Coupon
          </a>
        </div>
      </nav>

      {/* ─────────────────────────────────── */}
      {/* SECTION 1: HERO                    */}
      {/* ─────────────────────────────────── */}
      <section className="relative pt-28 pb-20 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 min-h-[90vh] flex items-center">

        {/* Giant background coupon — oversized, semi-transparent */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-[0.07] pointer-events-none select-none hidden lg:block" style={{transform: "translate(20%, -50%) rotate(-8deg) scale(2.2)"}}>
          <CouponGraphic value="$10,000" large />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-8 uppercase tracking-widest">
                <Ticket className="h-3.5 w-3.5" /> The Smarter Buyer's Coupon
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-[4.2rem] font-black text-slate-900 leading-[1.05] tracking-tight mb-6">
                Found a Home?<br />
                <span className="text-emerald-600">Use Your Buywiser<br />Coupon First</span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed mb-6 max-w-lg">
                Search anywhere. Enter the home price and instantly see your estimated 1% rebate before you request a tour.
              </p>

              {/* Punchline */}
              <div className="inline-flex items-start gap-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl px-6 py-4 mb-10">
                <p className="text-amber-900 font-black text-base leading-snug">
                  Don't click "View Property."<br />
                  <span className="text-slate-900">Use your Buywiser Coupon first.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#calculator" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition text-base shadow-lg">
                  See My Coupon <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#how" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition text-base">
                  How It Works
                </a>
              </div>
            </div>

            {/* Right: premium coupon visual + image */}
            <div className="relative flex flex-col items-center gap-6">
              {/* Floating coupon card */}
              <div className="relative z-10 drop-shadow-2xl">
                <CouponGraphic value="$10,000" large />
              </div>
              {/* Images below coupon */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80"
                  alt="Couple celebrating home purchase"
                  className="rounded-2xl h-36 w-full object-cover shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80"
                  alt="Family with keys to new home"
                  className="rounded-2xl h-36 w-full object-cover shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
            {[
              { icon: Ticket, label: "Use the Coupon" },
              { icon: Home, label: "Tour Smarter" },
              { icon: DollarSign, label: "Save Real Money" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
                <item.icon className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="font-bold text-slate-800 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────── */}
      {/* SECTION 2: CALCULATOR              */}
      {/* ─────────────────────────────────── */}
      <section id="calculator" className="py-24 bg-slate-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-3">Coupon Calculator</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">What's Your Buywiser<br />Coupon Worth?</h2>
            <p className="text-slate-400 text-lg">Enter the purchase price and see your estimated 1% rebate instantly.</p>
          </div>
          <CouponCalculator />
        </div>
      </section>

      {/* ─────────────────────────────────── */}
      {/* SECTION 3: PROBLEM / SOLUTION      */}
      {/* ─────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4">
            <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">The Smarter Move</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-5">
              Most buyers click first<br />and think later.<br />
              <span className="text-emerald-600">Smart buyers use the coupon first.</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto mb-14">
              Most homebuyers find a home they like and go straight into the default tour path — less control, less coordination, and missed savings. Buywiser gives buyers a smarter move: use the coupon first, see the estimated rebate, then move forward with the right showing path, the right agent, and the right financing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-9">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-500 font-black text-lg leading-none">✗</span>
                </div>
                <h3 className="text-xl font-black text-slate-700">What Most Buyers Do</h3>
              </div>
              <ul className="space-y-3.5">
                {[
                  "Find a home online",
                  'Click "View Property"',
                  "Enter the default tour flow",
                  "Handle agent and financing separately",
                  "Miss coordinated savings",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Buywiser */}
            <div className="bg-emerald-950 border-2 border-emerald-700/40 rounded-3xl p-9">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-9 h-9 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-xl font-black text-white">What Buywiser Buyers Do</h3>
              </div>
              <ul className="space-y-3.5">
                {[
                  "Find a home online",
                  "Use the Buywiser Coupon first",
                  "See the estimated 1% rebate",
                  "Get paired with the right path",
                  "Save more and stay in control",
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

      {/* ─────────────────────────────────── */}
      {/* SECTION 4: HOW IT WORKS            */}
      {/* ─────────────────────────────────── */}
      <section id="how" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Coupon first. Tour second.<br />Smarter all the way through.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                num: "1",
                icon: Home,
                title: "Find the Home",
                text: "Search on Zillow, Redfin, Realtor.com, or anywhere you like. Buywiser does not replace your search. It improves what happens next.",
              },
              {
                num: "2",
                icon: Ticket,
                title: "Use Your Coupon",
                text: "Enter the purchase price and property address or listing link into Buywiser to see your estimated rebate and activate your smarter path.",
              },
              {
                num: "3",
                icon: TrendingUp,
                title: "Move Forward Smarter",
                text: "Buywiser helps coordinate the showing, pairs you with the right agent, and aligns the financing strategy to help you save money and buy with confidence.",
              },
            ].map((card) => (
              <div key={card.num} className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-7">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-5xl font-black text-slate-100">{card.num}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{card.text}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-base max-w-xl mx-auto">
            The coupon is simple. The savings strategy behind it is where Buywiser does the real work.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────── */}
      {/* SECTION 5: BUYER DASHBOARD         */}
      {/* ─────────────────────────────────── */}
      <section id="dashboard" className="py-24 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest text-emerald-400 uppercase mb-4">Buyer Dashboard</p>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-5">It all starts on the Buywiser Buyer Dashboard</h2>
              <p className="text-slate-400 text-base leading-relaxed mb-8">
                Instead of clicking the property button on a search site, enter the property address or listing link into Buywiser first. We show your estimated coupon value, coordinate the next steps, and help pair you with the right showing path, agent, and financing strategy.
              </p>
              <a href="#" className="inline-flex items-center gap-2 px-7 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition text-base shadow-lg">
                See My Coupon <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* Dashboard mockup */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-slate-900 px-5 py-3.5 flex items-center gap-2.5">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-amber-400" /><div className="w-3 h-3 rounded-full bg-green-400" /></div>
                <span className="ml-2 text-slate-400 text-xs font-mono">buywiser.com/dashboard</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-slate-900 text-base">Buyer Dashboard</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-full">Active</span>
                </div>

                {/* Price */}
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Home Price</p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <p className="text-slate-900 font-black text-xl">$1,250,000</p>
                  </div>
                </div>

                {/* Coupon */}
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl px-4 py-3">
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide mb-1">Estimated Coupon Value</p>
                  <p className="text-emerald-700 font-black text-3xl">$12,500</p>
                </div>

                {/* Property */}
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-1">Property Address</p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                    <p className="text-slate-700 text-sm font-medium">1842 Hillcrest Ave, Thousand Oaks, CA</p>
                  </div>
                </div>

                {/* Status row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <p className="text-xs text-slate-400 font-bold mb-1.5">Agent Pairing</p>
                    <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">In Review</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <p className="text-xs text-slate-400 font-bold mb-1.5">Financing</p>
                    <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">Pending</span>
                  </div>
                </div>

                <button className="w-full py-3.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition flex items-center justify-center gap-2">
                  Continue My Buywiser Path <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────── */}
      {/* SECTION 6: WHY IT MATTERS          */}
      {/* ─────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">The Advantage</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Why smart buyers<br />use the coupon first</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Zap, title: "Instant Savings Signal", text: "The coupon instantly shows what buying smarter could put back in your pocket." },
              { icon: Users, title: "Better Coordination", text: "Buywiser handles the showing path, agent pairing, and financing together instead of leaving you to figure it out piece by piece." },
              { icon: Shield, title: "More Control", text: "Using the coupon first helps buyers avoid handing over control at the very start of the process." },
              { icon: TrendingUp, title: "Real Buyer Advantage", text: "Behind the simple coupon is a smarter, more strategic way to buy and finance a home." },
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

      {/* ─────────────────────────────────── */}
      {/* SECTION 7: TESTIMONIALS            */}
      {/* ─────────────────────────────────── */}
      <section id="testimonials" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">Client Stories</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">What Buywiser buyers say</h2>
          </div>

          {/* Featured */}
          <div className="bg-slate-900 text-white rounded-3xl p-10 md:p-14 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-emerald-600/10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center relative z-10">
              <div className="md:col-span-2">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-7">
                  "By utilizing Buywiser's coordinated services, my husband Allen and I sold our home and bought two homes. We must have saved a minimum of $100,000 between the rebates and the credits we received from our inspections. Thank you, Buywiser."
                </p>
                <p className="font-black text-white text-base">Ami and Allen K.</p>
                <p className="text-emerald-400 text-sm font-semibold mt-0.5">Thousand Oaks, CA</p>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&q=80"
                  alt="Ami and Allen"
                  className="rounded-2xl w-full h-56 object-cover opacity-80"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80",
                quote: "Buywiser made the process feel organized from day one. We were paired with a strong local agent, got excellent financing guidance, and the rebate was a real benefit at closing.",
                name: "Melissa R.",
                location: "Newport Beach, CA",
              },
              {
                img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&q=80",
                quote: "What stood out was the coordination. Instead of dealing with everything separately, Buywiser tied the whole transaction together and helped us save money at multiple points in the process.",
                name: "David and Priya S.",
                location: "Austin, TX",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                <img src={t.img} alt={t.name} className="w-full h-44 object-cover" />
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-slate-700 text-base leading-relaxed italic flex-1 mb-5">"{t.quote}"</p>
                  <p className="font-black text-slate-900 text-sm">{t.name}</p>
                  <p className="text-emerald-600 text-xs font-semibold mt-0.5">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────── */}
      {/* SECTION 8: POSITIONING             */}
      {/* ─────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4">The Buywiser System</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">
            A simple coupon.<br />A smarter homebuying system.
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-7">
            The Buywiser Coupon makes the idea easy to understand: use it before you tour and see your savings opportunity first. But behind that simplicity is a smarter system designed to help buyers take control before the wrong click, the wrong agent path, or the wrong financing structure costs them money.
          </p>
          <p className="text-slate-900 font-black text-base border-t border-b border-slate-200 py-5 px-8 inline-block">
            Our goal is simple: save buyers money, not add another fee to the process.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────── */}
      {/* SECTION 9: FINAL CTA               */}
      {/* ─────────────────────────────────── */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{backgroundImage: "radial-gradient(circle at 70% 50%, #10b981 0%, transparent 60%)"}} />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-5">Ready to use your<br />Buywiser Coupon?</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10">
            Find the home anywhere. Then use Buywiser before you tour.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#calculator" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-500 transition text-base shadow-lg">
              See My Coupon <ArrowRight className="h-4 w-4" />
            </a>
            <a href="mailto:hello@buywiser.com" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-700 text-white font-bold rounded-2xl hover:border-slate-500 transition text-base">
              Talk to Buywiser
            </a>
          </div>
          <p className="mt-12 text-sm text-slate-600 font-bold italic">Search anywhere. Use the coupon before you click.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
            <div>
              <div className="text-2xl font-black mb-3">Buy<span className="text-emerald-500">Wiser</span></div>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                The smarter way to buy and finance a home. Coupon first. Tour second. Save real money.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-10 gap-y-2 text-sm text-slate-500">
              {["How It Works", "Coupon Calculator", "Buyer Dashboard", "Financing", "Testimonials", "About", "Contact"].map((item) => (
                <a key={item} href="#" className="hover:text-white transition py-1">{item}</a>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-900 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-slate-700">© {new Date().getFullYear()} BuyWiser. All rights reserved.</p>
            <p className="text-xs text-slate-700">Available on qualifying purchases. Terms and availability may vary.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}