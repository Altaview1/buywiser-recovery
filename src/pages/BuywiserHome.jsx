import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, ArrowRight, Home, Users, DollarSign, Shield, Star, TrendingUp, Ticket, Zap, Lock } from "lucide-react";

function formatCurrency(val) {
  if (!val) return "$0";
  return Number(val).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

// ── Coupon Graphic ─────────────────────────────────────────────────────────────
function CouponGraphic({ value, className = "" }) {
  return (
    <div className={`relative select-none ${className}`}>
      {/* Outer card */}
      <div className="relative bg-gradient-to-br from-blue-800 via-blue-700 to-amber-600 rounded-3xl shadow-2xl overflow-hidden" style={{ minWidth: 280 }}>
        {/* Dashed left edge notch */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 bg-white rounded-full" />
        {/* Dashed center line */}
        <div className="absolute top-1/2 left-8 right-8 border-t-2 border-dashed border-white/30" />
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="px-10 py-8 relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
              <Ticket className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-white/80 text-xs font-bold uppercase tracking-widest">Buywiser Coupon</span>
          </div>
          <p className="text-white/70 text-sm font-medium mb-1">Estimated Buyer Rebate</p>
          <p className="text-white font-black leading-none" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}>
            {value || "$10,000"}
          </p>
          <p className="text-white/60 text-xs mt-3 font-medium">On qualifying home purchase</p>
        </div>
      </div>
    </div>
  );
}

// ── Calculator ─────────────────────────────────────────────────────────────────
function CouponCalculator() {
  const [price, setPrice] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [displayValue, setDisplayValue] = useState("$0");
  const [glowing, setGlowing] = useState(false);
  const spinRef = useRef(null);

  const numeric = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
  const realRebate = numeric * 0.01;
  const displayPrice = price ? Number(price).toLocaleString("en-US") : "";

  const handleSpin = () => {
    if (!numeric || spinning) return;
    setSpinning(true);
    setRevealed(false);
    setGlowing(false);

    let ticks = 0;
    const totalTicks = 28;
    // Speed schedule: fast → slow
    const getDelay = (t) => {
      if (t < 10) return 40;
      if (t < 18) return 70;
      if (t < 24) return 120;
      return 200;
    };

    const tick = () => {
      ticks++;
      if (ticks < totalTicks) {
        // Random value near the real rebate for drama
        const jitter = realRebate * (0.4 + Math.random() * 1.2);
        const rounded = Math.round(jitter / 100) * 100;
        setDisplayValue(formatCurrency(rounded));
        spinRef.current = setTimeout(tick, getDelay(ticks));
      } else {
        // Land on real value
        setDisplayValue(formatCurrency(realRebate));
        setSpinning(false);
        setRevealed(true);
        setGlowing(true);
        setTimeout(() => setGlowing(false), 1800);
      }
    };
    spinRef.current = setTimeout(tick, 40);
  };

  useEffect(() => () => clearTimeout(spinRef.current), []);

  // Reset when price changes
  useEffect(() => {
    setRevealed(false);
    setDisplayValue("$0");
    clearTimeout(spinRef.current);
    setSpinning(false);
    setGlowing(false);
  }, [price]);

  return (
    <section id="calculator" className="py-24 bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">Coupon Calculator</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">What's Your Buywiser Coupon Worth?</h2>
          <p className="text-slate-500 text-lg">Enter the purchase price, then reveal your estimated 1% rebate.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-10">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Purchase Price</label>
          <div className="relative mb-6">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-2xl font-bold">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={displayPrice}
              onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="1,000,000"
              className="w-full pl-12 pr-6 py-5 text-3xl font-black text-slate-900 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 bg-white transition"
            />
          </div>

          {/* Slot machine result window */}
          <div
            className="relative rounded-2xl p-7 mb-6 text-center overflow-hidden transition-all duration-500"
            style={{
              background: spinning || revealed
                ? "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)"
                : "#f8fafc",
              border: glowing ? "2px solid #f59e0b" : spinning ? "2px solid #2563eb" : "2px solid #e2e8f0",
              boxShadow: glowing
                ? "0 0 40px 12px rgba(245,158,11,0.35), 0 0 80px 20px rgba(251,191,36,0.15)"
                : spinning
                ? "0 0 20px 4px rgba(37,99,235,0.2)"
                : "none",
              transition: "all 0.3s ease",
            }}
          >
            {/* Scanline overlay when spinning */}
            {spinning && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 4px)",
                }}
              />
            )}

            {/* Corner stars when revealed */}
            {glowing && (
              <>
                <span className="absolute top-3 left-4 text-amber-300 text-lg animate-bounce">✦</span>
                <span className="absolute top-3 right-4 text-amber-300 text-lg animate-bounce" style={{animationDelay:"0.15s"}}>✦</span>
                <span className="absolute bottom-3 left-6 text-amber-300 text-base animate-bounce" style={{animationDelay:"0.3s"}}>✦</span>
                <span className="absolute bottom-3 right-6 text-amber-300 text-base animate-bounce" style={{animationDelay:"0.1s"}}>✦</span>
              </>
            )}

            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: spinning || revealed ? "rgba(253,230,138,0.9)" : "#94a3b8" }}
            >
              Your Buywiser Coupon Value
            </p>

            <p
              className="font-black leading-none transition-none"
              style={{
                fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
                color: spinning ? "#fcd34d" : revealed ? "#ffffff" : "#e2e8f0",
                letterSpacing: spinning ? "0.05em" : "0",
                textShadow: glowing ? "0 0 30px rgba(245,158,11,0.8), 0 0 60px rgba(245,158,11,0.4)" : spinning ? "0 0 15px rgba(252,211,77,0.5)" : "none",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {spinning || revealed ? displayValue : numeric > 0 ? "?????" : "$0"}
            </p>

            {revealed && (
              <p className="text-amber-300 text-sm font-bold mt-3 tracking-wide">✓ Estimated 1% buyer rebate — yours to use</p>
            )}
            {!spinning && !revealed && numeric > 0 && (
              <p className="text-slate-400 text-sm font-medium mt-2">Hit reveal to see your coupon value</p>
            )}
          </div>

          {/* Reveal button */}
          <button
            onClick={handleSpin}
            disabled={!numeric || spinning}
            className="w-full py-5 text-base font-black rounded-2xl mb-4 transition-all duration-200 relative overflow-hidden"
            style={{
              background: !numeric
                ? "#e2e8f0"
                : spinning
                ? "linear-gradient(135deg, #1d4ed8, #1e40af)"
                : "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
              color: !numeric ? "#94a3b8" : "#ffffff",
              boxShadow: numeric && !spinning ? "0 4px 24px rgba(180,83,9,0.4)" : "none",
              transform: spinning ? "scale(0.98)" : "scale(1)",
              cursor: !numeric ? "not-allowed" : "pointer",
            }}
          >
            {spinning ? (
              <span className="flex items-center justify-center gap-3">
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Calculating your rebate...
              </span>
            ) : revealed ? (
              "🎉 Reveal Again"
            ) : (
              "🎰 Reveal My Coupon Value"
            )}
          </button>

          <a
            href="#dashboard"
            className="block w-full py-4 bg-slate-900 text-white text-base font-bold rounded-2xl hover:bg-slate-800 transition text-center mb-3"
          >
            Start My Buywiser Path →
          </a>
          <p className="text-slate-500 text-sm text-center mb-4">Next, enter the property address or listing link to begin your Buywiser path.</p>
          <p className="text-xs text-slate-400 text-center leading-relaxed">Available on qualifying purchases. Terms, market availability, lender requirements, and state rules may apply.</p>
        </div>
      </div>
    </section>
  );
}

// ── Live Dashboard ───────────────────────────────────────────────────────────
function LiveDashboard() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState(null);
  const [error, setError] = useState("");
  const [couponRevealed, setCouponRevealed] = useState(false);
  const [couponSpinning, setCouponSpinning] = useState(false);
  const [couponDisplay, setCouponDisplay] = useState("");
  const spinRef2 = useRef(null);

  const rebate = property?.price ? property.price * 0.01 : 0;

  const handleFetch = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setProperty(null);
    setCouponRevealed(false);
    try {
      const res = await base44.functions.invoke("fetchPropertyFromUrl", { url: url.trim() });
      setProperty(res.data.property);
    } catch (e) {
      setError(e?.response?.data?.error || "Couldn't fetch that listing. Try pasting the full URL.");
    }
    setLoading(false);
  };

  const handleRevealCoupon = () => {
    if (!rebate || couponSpinning) return;
    setCouponSpinning(true);
    setCouponRevealed(false);
    let ticks = 0;
    const totalTicks = 26;
    const getDelay = (t) => t < 10 ? 40 : t < 18 ? 75 : t < 23 ? 130 : 210;
    const tick = () => {
      ticks++;
      if (ticks < totalTicks) {
        const jitter = rebate * (0.4 + Math.random() * 1.2);
        setCouponDisplay(formatCurrency(Math.round(jitter / 100) * 100));
        spinRef2.current = setTimeout(tick, getDelay(ticks));
      } else {
        setCouponDisplay(formatCurrency(rebate));
        setCouponSpinning(false);
        setCouponRevealed(true);
      }
    };
    spinRef2.current = setTimeout(tick, 40);
  };

  useEffect(() => () => clearTimeout(spinRef2.current), []);

  const isListing = url.includes("zillow.com") || url.includes("redfin.com") || url.includes("realtor.com") || url.includes("trulia.com");

  return (
    <section id="dashboard" className="py-24 bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
          <div className="lg:pt-4">
            <p className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-4">Buyer Dashboard</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-5">It all starts on the Buywiser Buyer Dashboard</h2>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              Found a home on Zillow or Redfin? Paste the listing URL below. Buywiser instantly pulls the property details, calculates your estimated coupon, and activates your smarter buying path.
            </p>
            <ol className="space-y-4">
              {["Paste your Zillow or Redfin listing link", "Buywiser fetches property details automatically", "Reveal your estimated 1% coupon value", "Move forward with showing, agent pairing, and financing"].map((step, i) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="w-7 h-7 rounded-full bg-blue-700 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-slate-300 text-sm leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-slate-900 px-5 py-3.5 flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-slate-400 text-xs font-mono truncate">buywiser.com/dashboard</span>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900">Buyer Dashboard</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${property ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                  {property ? "Property Loaded ✓" : "Ready"}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1.5">Zillow / Redfin / Realtor.com Listing URL</p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); setProperty(null); setCouponRevealed(false); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && isListing && handleFetch()}
                    placeholder="Paste listing URL here..."
                    className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-400 text-slate-700 min-w-0"
                  />
                  <button
                    onClick={handleFetch}
                    disabled={!isListing || loading}
                    className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition whitespace-nowrap"
                  >
                    {loading ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                        Fetching...
                      </span>
                    ) : "Fetch"}
                  </button>
                </div>
                {error && <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>}
                {!isListing && url.length > 10 && <p className="text-amber-500 text-xs mt-1.5">Please paste a Zillow, Redfin, or Realtor.com URL</p>}
              </div>

              {loading && (
                <div className="space-y-3 animate-pulse">
                  <div className="h-28 bg-slate-100 rounded-2xl" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-16 bg-slate-100 rounded-xl" />
                    <div className="h-16 bg-slate-100 rounded-xl" />
                  </div>
                </div>
              )}

              {property && !loading && (
                <>
                  <div className="rounded-2xl overflow-hidden border border-slate-200">
                    {property.image_url ? (
                      <img src={property.image_url} alt="Property" className="w-full h-40 object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                    ) : (
                      <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <Home className="h-10 w-10 text-slate-300" />
                      </div>
                    )}
                    <div className="p-3 bg-slate-50">
                      <p className="font-bold text-slate-900 text-sm leading-tight">
                        {property.address}{property.city ? `, ${property.city}` : ""}{property.state ? `, ${property.state}` : ""}
                      </p>
                      <div className="flex gap-3 mt-1.5 flex-wrap">
                        {property.beds && <span className="text-xs text-slate-500">{property.beds} bd</span>}
                        {property.baths && <span className="text-xs text-slate-500">{property.baths} ba</span>}
                        {property.sqft && <span className="text-xs text-slate-500">{Number(property.sqft).toLocaleString()} sqft</span>}
                        {property.year_built && <span className="text-xs text-slate-500">Built {property.year_built}</span>}
                        {property.status && <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{property.status}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">List Price</p>
                      <p className="text-slate-900 font-black text-lg">{property.price ? formatCurrency(property.price) : "—"}</p>
                    </div>
                    <div
                      className="rounded-xl p-3 transition-all duration-500"
                      style={{
                        background: couponRevealed ? "linear-gradient(135deg,#1e3a8a,#1d4ed8)" : "#f8fafc",
                        border: couponRevealed ? "2px solid #f59e0b" : "2px solid #e2e8f0",
                        boxShadow: couponRevealed ? "0 0 20px 4px rgba(245,158,11,0.3)" : "none",
                      }}
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: couponRevealed ? "#fde68a" : "#94a3b8" }}>Coupon Value</p>
                      <p className="font-black text-xl" style={{
                        color: couponSpinning ? "#fcd34d" : couponRevealed ? "#ffffff" : "#e2e8f0",
                        textShadow: couponRevealed ? "0 0 20px rgba(245,158,11,0.6)" : "none",
                        fontVariantNumeric: "tabular-nums",
                      }}>
                        {couponSpinning || couponRevealed ? couponDisplay : "?????"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-400" /><span className="text-xs text-slate-700 font-semibold">Agent</span></div>
                      <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">Pairing</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-slate-400" /><span className="text-xs text-slate-700 font-semibold">Financing</span></div>
                      <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">In Review</span>
                    </div>
                  </div>

                  {!couponRevealed ? (
                    <button
                      onClick={handleRevealCoupon}
                      disabled={couponSpinning || !property.price}
                      className="w-full py-4 text-base font-black rounded-2xl transition-all duration-200"
                      style={{
                        background: "linear-gradient(135deg,#b45309 0%,#d97706 100%)",
                        color: "#ffffff",
                        boxShadow: "0 4px 24px rgba(180,83,9,0.45)",
                        opacity: couponSpinning ? 0.85 : 1,
                      }}
                    >
                      {couponSpinning ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Calculating your coupon...
                        </span>
                      ) : (
                        "🎰 Get My Buywiser Coupon"
                      )}
                    </button>
                  ) : (
                    <div className="rounded-2xl p-5 text-center" style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", border: "2px solid #f59e0b", boxShadow: "0 0 30px 8px rgba(245,158,11,0.2)" }}>
                      <p className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-1">✨ Your Buywiser Coupon Is Ready</p>
                      <p className="text-white font-black text-3xl mb-1">{formatCurrency(rebate)}</p>
                      <p className="text-amber-200/80 text-xs mb-4">Estimated 1% rebate • {property.address}</p>
                      <a
                        href={`mailto:hello@buywiser.com?subject=Buywiser Coupon Request&body=Property: ${property.address}%0AList Price: ${formatCurrency(property.price)}%0AEstimated Rebate: ${formatCurrency(rebate)}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-900 font-black rounded-xl text-sm hover:bg-blue-50 transition"
                      >
                        Activate My Coupon →
                      </a>
                    </div>
                  )}
                </>
              )}

              {!property && !loading && (
                <div className="text-center py-6">
                  <Ticket className="h-10 w-10 mx-auto mb-3 text-slate-700" />
                  <p className="font-semibold text-slate-400 text-sm">Paste a Zillow or Redfin URL above</p>
                  <p className="text-slate-500 text-xs mt-1">We'll pull the property details and calculate your coupon instantly</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function BuywiserHome() {
  return (
    <div className="bg-white text-slate-900 font-sans">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="#" className="text-xl font-black text-slate-900 tracking-tight">
            Buy<span className="text-blue-700">Wiser</span>
          </a>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-500">
            <a href="#how" className="hover:text-slate-900 transition">How It Works</a>
            <a href="#calculator" className="hover:text-slate-900 transition">Coupon Calculator</a>
            <a href="#dashboard" className="hover:text-slate-900 transition">Buyer Dashboard</a>
            <a href="#testimonials" className="hover:text-slate-900 transition">Stories</a>
          </div>
          <a href="#calculator" className="px-5 py-2.5 bg-blue-800 text-white text-sm font-bold rounded-xl hover:bg-blue-900 transition shadow-sm">
            See My Coupon
          </a>
        </div>
      </nav>

      {/* ── SECTION 1: HERO ── */}
      <section className="relative pt-24 min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
        {/* Background coupon watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-[0.07] pointer-events-none hidden lg:block" style={{ width: 700, height: 700 }}>
          <div className="w-full h-full bg-gradient-to-br from-blue-700 to-amber-500 rounded-[80px] flex items-center justify-center">
            <p className="text-white font-black text-center leading-none" style={{ fontSize: 160 }}>$10,000</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-8 uppercase tracking-widest">
                <Ticket className="h-3.5 w-3.5" /> The Smart Buyer's Move
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black text-slate-900 leading-[1.0] tracking-tight mb-6">
                Found a Home?<br />
                <span className="text-blue-700">Use Your Buywiser<br />Coupon First</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed mb-8 max-w-lg">
                Search anywhere. Enter the home price and instantly see your estimated 1% rebate before you request a tour.
              </p>

              {/* Punch line */}
              <div className="inline-flex items-start gap-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl px-5 py-4 mb-10">
                <p className="text-amber-900 font-black text-base">
                  Don't click "View Property."<br />
                  <span className="text-slate-900">Use your Buywiser Coupon first.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#calculator" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-400 transition text-base shadow-lg">
                  See My Coupon <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#how" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition text-base">
                  How It Works
                </a>
              </div>
            </div>

            {/* Right: Coupon + photos */}
            <div className="relative hidden lg:flex flex-col gap-5 items-end">
              {/* Main image */}
              <div className="relative w-full max-w-md">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80"
                  alt="Couple celebrating home purchase"
                  className="w-full h-80 object-cover rounded-3xl shadow-2xl"
                />
                {/* Floating coupon badge */}
                <div className="absolute -bottom-6 -left-8">
                  <CouponGraphic value="$12,500" />
                </div>
              </div>

              {/* Secondary image */}
              <div className="w-48 h-36 ml-auto mt-10">
                <img
                  src="https://images.unsplash.com/photo-1484981138541-3d074aa97716?w=500&q=80"
                  alt="Couple reviewing rebate on laptop"
                  className="w-full h-full object-cover rounded-2xl shadow-lg border-4 border-white"
                />
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Ticket, label: "Use the Coupon" },
              { icon: Home, label: "Tour Smarter" },
              { icon: DollarSign, label: "Save Real Money" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
                <item.icon className="h-5 w-5 text-blue-700" />
                <span className="font-bold text-slate-800 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: CALCULATOR ── */}
      <CouponCalculator />

      {/* ── SECTION 3: PROBLEM / SOLUTION ── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">The Smarter Move</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-5">
              Most buyers click first and think later.<br />Smart buyers use the coupon first.
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
              Most homebuyers find a home they like and go straight into the default tour path. That means less control, less coordination, and missed savings. Buywiser gives buyers a smarter move: use the coupon first, see the estimated rebate, and then move forward with the right showing path, the right agent, and the right financing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-500 font-black">✗</span>
                </div>
                <h3 className="text-xl font-black text-slate-600">What Most Buyers Do</h3>
              </div>
              <ul className="space-y-3">
                {["Find a home online", 'Click "View Property"', "Enter the default tour flow", "Handle agent and financing separately", "Miss coordinated savings"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Buywiser */}
            <div className="bg-gradient-to-br from-blue-950 to-blue-900 border-2 border-amber-500/40 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-amber-400" />
                </div>
                <h3 className="text-xl font-black text-white">What Buywiser Buyers Do</h3>
              </div>
              <ul className="space-y-3">
                {["Find a home online", "Use the Buywiser Coupon first", "See the estimated 1% rebate", "Get paired with the right path", "Save more and stay in control"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-blue-100 text-sm">
                    <CheckCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: HOW IT WORKS ── */}
      <section id="how" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Coupon first. Tour second.<br />Smarter all the way through.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                num: "1",
                title: "Find the Home",
                text: "Search on Zillow, Redfin, Realtor.com, or anywhere you like. Buywiser does not replace your search. It improves what happens next.",
                icon: Home,
              },
              {
                num: "2",
                title: "Use Your Coupon",
                text: "Enter the purchase price and property address or listing link into Buywiser to see your estimated rebate and activate your smarter path.",
                icon: Ticket,
              },
              {
                num: "3",
                title: "Move Forward Smarter",
                text: "Buywiser helps coordinate the showing, pairs you with the right agent, and aligns the financing strategy to help you save money and buy with confidence.",
                icon: TrendingUp,
              },
            ].map((card) => (
              <div key={card.num} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-5xl font-black text-slate-100">{card.num}</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{card.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl px-8 py-6 text-center max-w-2xl mx-auto">
            <p className="text-slate-700 font-semibold leading-relaxed">
              The coupon is simple. The savings strategy behind it is where Buywiser does the real work.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: BUYER DASHBOARD ── */}
      <LiveDashboard />

      {/* ── SECTION 6: WHY THE COUPON MATTERS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">The Advantage</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Why smart buyers use the coupon first</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Zap, title: "Instant Savings Signal", text: "The coupon instantly shows what buying smarter could put back in your pocket." },
              { icon: Users, title: "Better Coordination", text: "Buywiser handles the showing path, agent pairing, and financing together instead of leaving you to figure it out piece by piece." },
              { icon: Lock, title: "More Control", text: "Using the coupon first helps buyers avoid handing over control at the very start of the process." },
              { icon: TrendingUp, title: "Real Buyer Advantage", text: "Behind the simple coupon is a smarter, more strategic way to buy and finance a home." },
            ].map((card) => (
              <div key={card.title} className="bg-slate-50 border border-slate-200 rounded-3xl p-7 hover:shadow-md transition">
                <div className="w-11 h-11 bg-amber-100 rounded-2xl flex items-center justify-center mb-5">
                  <card.icon className="h-5 w-5 text-amber-700" />
                </div>
                <h3 className="font-black text-slate-900 mb-2">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">Client Stories</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">What Buywiser buyers say</h2>
          </div>

          {/* Featured testimonial */}
          <div className="bg-slate-900 text-white rounded-3xl p-10 md:p-14 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-6">
                  "By utilizing Buywiser's coordinated services, my husband Allen and I sold our home and bought two homes. We must have saved a minimum of $100,000 between the rebates and the credits we received from our inspections. Thank you, Buywiser."
                </p>
                <div>
                  <p className="font-black text-white text-base">Ami and Allen K.</p>
                  <p className="text-amber-400 text-sm font-medium">Thousand Oaks, CA</p>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80"
                  alt="Happy couple"
                  className="w-full h-56 object-cover rounded-2xl opacity-80"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                quote: "Buywiser made the process feel organized from day one. We were paired with a strong local agent, got excellent financing guidance, and the rebate was a real benefit at closing.",
                name: "Melissa R.",
                location: "Newport Beach, CA",
                img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80",
              },
              {
                quote: "What stood out was the coordination. Instead of dealing with everything separately, Buywiser tied the whole transaction together and helped us save money at multiple points in the process.",
                name: "David and Priya S.",
                location: "Austin, TX",
                img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&q=80",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                <div className="h-44 overflow-hidden">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-slate-700 text-base leading-relaxed flex-1 mb-5 italic">"{t.quote}"</p>
                  <div>
                    <p className="font-black text-slate-900 text-sm">{t.name}</p>
                    <p className="text-blue-600 text-xs font-medium">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: POSITIONING ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-4">The Buywiser Difference</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">A simple coupon.<br />A smarter homebuying system.</h2>
          <p className="text-slate-500 text-lg leading-relaxed mb-8">
            The Buywiser Coupon makes the idea easy to understand: use it before you tour and see your savings opportunity first. But behind that simplicity is a smarter system designed to help buyers take control before the wrong click, the wrong agent path, or the wrong financing structure costs them money.
          </p>
          <p className="text-slate-900 font-bold text-base border-t border-b border-slate-200 py-5 inline-block px-8">
            Our goal is simple: save buyers money, not add another fee to the process.
          </p>
        </div>
      </section>

      {/* ── SECTION 9: FINAL CTA ── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-950 text-white relative overflow-hidden">
        {/* Background coupon watermark */}
        <div className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 opacity-[0.05] pointer-events-none">
          <div className="w-96 h-96 bg-amber-400 rounded-[60px] flex items-center justify-center">
            <p className="text-white font-black text-8xl">$10K</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-4">Ready?</p>
          <h2 className="text-4xl md:text-5xl font-black mb-5">Ready to use your<br />Buywiser Coupon?</h2>
          <p className="text-slate-400 text-lg mb-10">Find the home anywhere. Then use Buywiser before you tour.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#calculator" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-400 transition text-base shadow-lg">
              See My Coupon <ArrowRight className="h-4 w-4" />
            </a>
            <a href="mailto:hello@buywiser.com" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-600 text-white font-bold rounded-2xl hover:border-slate-400 transition text-base">
              Talk to Buywiser
            </a>
          </div>
          <p className="mt-10 text-sm text-slate-600 font-semibold italic">Search anywhere. Use the coupon before you click.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
            <div>
              <div className="text-2xl font-black mb-3">Buy<span className="text-amber-400">Wiser</span></div>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                The smarter way to buy and finance a home. Use the coupon first.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-10 gap-y-2 text-sm text-slate-500">
              {["How It Works", "Coupon Calculator", "Buyer Dashboard", "Financing", "Testimonials", "About", "Contact"].map((item) => (
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