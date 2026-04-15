import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, ArrowRight, Home, Users, DollarSign, Shield, Star, TrendingUp, Ticket, Zap, Lock, X, Clock, Play } from "lucide-react";

const HEYGEN_VIDEO_ID = "a9339c11582d4bacb2274163f199d778";
const HEYGEN_EMBED_URL = `https://app.heygen.com/embeds/${HEYGEN_VIDEO_ID}`;

// ── Video Modal ────────────────────────────────────────────────────────────────
function VideoModal({ onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 flex items-center gap-2 text-white/70 hover:text-white transition text-sm font-medium"
        >
          <X className="h-5 w-5" /> Close
        </button>

        {/* Regal border frame */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            border: "2px solid #c9a84c",
            boxShadow: "0 0 0 1px #0f1f5c, 0 0 0 5px #c9a84c, 0 32px 80px rgba(0,0,0,0.8)",
          }}
        >
          {/* Corner ornaments */}
          <div className="absolute top-2 left-2 w-5 h-5 z-10 pointer-events-none" style={{ borderTop: "2px solid #c9a84c", borderLeft: "2px solid #c9a84c" }} />
          <div className="absolute top-2 right-2 w-5 h-5 z-10 pointer-events-none" style={{ borderTop: "2px solid #c9a84c", borderRight: "2px solid #c9a84c" }} />
          <div className="absolute bottom-2 left-2 w-5 h-5 z-10 pointer-events-none" style={{ borderBottom: "2px solid #c9a84c", borderLeft: "2px solid #c9a84c" }} />
          <div className="absolute bottom-2 right-2 w-5 h-5 z-10 pointer-events-none" style={{ borderBottom: "2px solid #c9a84c", borderRight: "2px solid #c9a84c" }} />

          <div className="aspect-video bg-slate-950">
            <iframe
              src={HEYGEN_EMBED_URL}
              title="Buywiser — Activate Your Coupon"
              allow="autoplay; fullscreen"
              allowFullScreen
              className="w-full h-full"
              style={{ border: "none", display: "block" }}
            />
          </div>
        </div>

        <p className="text-center text-amber-400/70 text-xs mt-4 tracking-widest uppercase font-semibold">
          Buywiser · Activate The Coupon First
        </p>
      </div>
    </div>
  );
}

function formatCurrency(val) {
  if (!val) return "$0";
  return Number(val).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function generateSerial() {
  const seg = () => Math.random().toString(36).toUpperCase().slice(2, 6);
  return `BW-${seg()}-${seg()}-${seg()}`;
}

// ── Official Activated Coupon ─────────────────────────────────────────────────
function OfficialCoupon({ value, serial, className = "", compact = false }) {
  return (
    <div className={`relative select-none ${className}`} style={{ fontFamily: "serif" }}>
      {/* Outer frame with double border */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0f1f5c 0%, #1a2f7a 40%, #0d1a4a 100%)",
          borderRadius: compact ? 16 : 20,
          border: "2px solid #c9a84c",
          boxShadow: "0 0 0 1px #0f1f5c, 0 0 0 5px #c9a84c, 0 8px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
          minWidth: compact ? 240 : 320,
        }}
      >
        {/* Guilloche pattern background */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 8px, rgba(201,168,76,0.6) 8px, rgba(201,168,76,0.6) 9px)",
        }} />
        {/* Inner border line */}
        <div className="absolute inset-2 rounded-xl pointer-events-none" style={{ border: "1px solid rgba(201,168,76,0.3)" }} />
        {/* Corner ornaments */}
        <div className="absolute top-3 left-3 w-5 h-5 opacity-60" style={{ borderTop: "2px solid #c9a84c", borderLeft: "2px solid #c9a84c", borderRadius: "3px 0 0 0" }} />
        <div className="absolute top-3 right-3 w-5 h-5 opacity-60" style={{ borderTop: "2px solid #c9a84c", borderRight: "2px solid #c9a84c", borderRadius: "0 3px 0 0" }} />
        <div className="absolute bottom-3 left-3 w-5 h-5 opacity-60" style={{ borderBottom: "2px solid #c9a84c", borderLeft: "2px solid #c9a84c", borderRadius: "0 0 0 3px" }} />
        <div className="absolute bottom-3 right-3 w-5 h-5 opacity-60" style={{ borderBottom: "2px solid #c9a84c", borderRight: "2px solid #c9a84c", borderRadius: "0 0 3px 0" }} />
        {/* Notches */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full" style={{ background: "#f8fafc" }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full" style={{ background: "#f8fafc" }} />
        <div className="absolute top-1/2 left-6 right-6 border-t border-dashed" style={{ borderColor: "rgba(201,168,76,0.25)" }} />

        <div className={`relative z-10 ${compact ? "px-8 py-6" : "px-10 py-9"}`}>
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-6 w-auto brightness-0 invert opacity-80" />
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#c9a84c", fontSize: 9 }}>OFFICIAL COUPON</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontSize: 8, fontFamily: "monospace" }}>{serial || "BW-XXXX-XXXX-XXXX"}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-4" style={{ borderTop: "1px solid rgba(201,168,76,0.3)" }} />

          {/* Label */}
          <p className="text-center uppercase tracking-[0.25em] mb-2" style={{ color: "rgba(201,168,76,0.7)", fontSize: 10, fontFamily: "sans-serif" }}>Activated Savings</p>

          {/* Amount */}
          <p className="text-center font-black leading-none mb-1" style={{
            fontSize: compact ? "clamp(2rem,8vw,2.8rem)" : "clamp(2.8rem,8vw,4rem)",
            color: "#ffffff",
            textShadow: "0 0 40px rgba(201,168,76,0.5), 0 2px 4px rgba(0,0,0,0.5)",
            letterSpacing: "-0.02em",
          }}>
            {value || "$10,000"}
          </p>

          {/* Divider */}
          <div className="mt-4 mb-4" style={{ borderTop: "1px solid rgba(201,168,76,0.3)" }} />

          {/* Footer row */}
          <div className="flex items-center justify-between">
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 8, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>Est. 1% Buyer Rebate</p>
            <p style={{ color: "rgba(201,168,76,0.6)", fontSize: 8, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>Qualifying Purchase</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Legacy Coupon Graphic (hero) ───────────────────────────────────────────────
function CouponGraphic({ value, className = "" }) {
  return (
    <div className={`relative select-none ${className}`}>
      <OfficialCoupon value={value} serial="BW-DEMO-0000-0000" />
    </div>
  );
}

// ── Coupon Calculator ──────────────────────────────────────────────────────────
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
    const getDelay = (t) => { if (t < 10) return 40; if (t < 18) return 70; if (t < 24) return 120; return 200; };
    const tick = () => {
      ticks++;
      if (ticks < totalTicks) {
        const jitter = realRebate * (0.4 + Math.random() * 1.2);
        setDisplayValue(formatCurrency(Math.round(jitter / 100) * 100));
        spinRef.current = setTimeout(tick, getDelay(ticks));
      } else {
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
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">What's Your Buywiser Coupon Value?</h2>
          <p className="text-slate-500 text-lg">Enter the purchase price to instantly see the estimated value of activating your coupon on time.</p>
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

          {/* Result window */}
          <div
            className="relative rounded-2xl p-7 mb-6 text-center overflow-hidden transition-all duration-500"
            style={{
              background: spinning || revealed ? "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)" : "#f8fafc",
              border: glowing ? "2px solid #f59e0b" : spinning ? "2px solid #2563eb" : "2px solid #e2e8f0",
              boxShadow: glowing ? "0 0 40px 12px rgba(245,158,11,0.35), 0 0 80px 20px rgba(251,191,36,0.15)" : spinning ? "0 0 20px 4px rgba(37,99,235,0.2)" : "none",
              transition: "all 0.3s ease",
            }}
          >
            {spinning && (
              <div className="absolute inset-0 pointer-events-none" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 4px)" }} />
            )}
            {glowing && (
              <>
                <span className="absolute top-3 left-4 text-amber-300 text-lg animate-bounce">✦</span>
                <span className="absolute top-3 right-4 text-amber-300 text-lg animate-bounce" style={{ animationDelay: "0.15s" }}>✦</span>
                <span className="absolute bottom-3 left-6 text-amber-300 text-base animate-bounce" style={{ animationDelay: "0.3s" }}>✦</span>
                <span className="absolute bottom-3 right-6 text-amber-300 text-base animate-bounce" style={{ animationDelay: "0.1s" }}>✦</span>
              </>
            )}
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: spinning || revealed ? "rgba(253,230,138,0.9)" : "#94a3b8" }}>
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
              <p className="text-amber-300 text-sm font-bold mt-3 tracking-wide">✓ Estimated 1% activated savings — yours to claim</p>
            )}
            {!spinning && !revealed && numeric > 0 && (
              <p className="text-slate-400 text-sm font-medium mt-2">Activate to see your coupon value</p>
            )}
          </div>

          <button
            onClick={handleSpin}
            disabled={!numeric || spinning}
            className="w-full py-5 text-base font-black rounded-2xl mb-4 transition-all duration-200 relative overflow-hidden"
            style={{
              background: !numeric ? "#e2e8f0" : spinning ? "linear-gradient(135deg, #1d4ed8, #1e40af)" : "linear-gradient(135deg, #b45309 0%, #d97706 100%)",
              color: !numeric ? "#94a3b8" : "#ffffff",
              boxShadow: numeric && !spinning ? "0 4px 24px rgba(180,83,9,0.4)" : "none",
              transform: spinning ? "scale(0.98)" : "scale(1)",
              cursor: !numeric ? "not-allowed" : "pointer",
            }}
          >
            {spinning ? (
              <span className="flex items-center justify-center gap-3">
                <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Activating your coupon...
              </span>
            ) : revealed ? "🎉 Activate Again" : "⚡ Activate My Coupon"}
          </button>

          {/* Official coupon reveal */}
          {revealed && (
            <div className="mb-4">
              <OfficialCoupon
                value={displayValue}
                serial={generateSerial()}
                className="w-full"
              />
              <p className="text-center text-xs text-slate-400 mt-3 leading-relaxed">This is your official Buywiser Coupon. Save it, share it, or present it when you're ready to move forward.</p>
            </div>
          )}

          <a href="#dashboard" className="block w-full py-4 bg-slate-900 text-white text-base font-bold rounded-2xl hover:bg-slate-800 transition text-center mb-3">
            Start My Buywiser Path →
          </a>
          <p className="text-slate-500 text-sm text-center mb-4">Next, enter the property address or listing link to activate your Buywiser path.</p>
          <p className="text-xs text-slate-400 text-center leading-relaxed">Available on qualifying purchases. Terms, market availability, lender requirements, and state rules may apply.</p>
        </div>
      </div>
    </section>
  );
}

// ── Live Dashboard ─────────────────────────────────────────────────────────────
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
        setCouponDisplay(formatCurrency(Math.round(rebate * (0.4 + Math.random() * 1.2) / 100) * 100));
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

          {/* Left: 3-step process */}
          <div className="lg:pt-4">
            <p className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-4">3 Steps to Secure Your Rebate</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Activate your coupon on the<br />Buywiser Buyer Dashboard</h2>
            <p className="text-slate-400 text-base leading-relaxed mb-10">
              Enter the purchase price and property address or listing link to activate The Buywiser Coupon before you click into the default path.
            </p>

            <div className="space-y-0">
              {[
                {
                  num: "1",
                  color: "#f59e0b",
                  title: "Enter the Property URL",
                  text: "Paste a listing link from Zillow, Redfin, or Realtor.com. Buywiser instantly pulls the property details and calculates your estimated 1% rebate coupon.",
                  last: false,
                },
                {
                  num: "2",
                  color: "#2563eb",
                  title: "Get Paired with a Concierge Agent",
                  text: "Buywiser matches you with the right local agent for the property — coordinated, not random. Your rebate is already locked in before you ever speak to them.",
                  last: false,
                },
                {
                  num: "3",
                  color: "#1e3a8a",
                  title: "View the Property",
                  text: "Tour the home knowing your rebate is already secured. No scrambling after the fact — your Buywiser Coupon is activated from step one.",
                  last: true,
                },
              ].map((step) => (
                <div key={step.num} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg" style={{ background: step.color }}>
                      <span className="text-white font-black text-lg">{step.num}</span>
                    </div>
                    {!step.last && <div className="w-0.5 h-10 bg-slate-700 mt-2" />}
                  </div>
                  <div className={step.last ? "" : "pb-10"}>
                    <h3 className="text-white font-black text-lg mb-1">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-slate-900 px-5 py-3.5 flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-slate-400 text-xs font-mono truncate">buywiser.com/activate</span>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900">Activation Dashboard</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${property ? "bg-blue-100 text-blue-700" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
                  {property ? "Coupon Active ✓" : "⚡ Ready to Activate"}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1.5">Property Listing URL</p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); setProperty(null); setCouponRevealed(false); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && isListing && handleFetch()}
                    placeholder="Paste Zillow / Redfin / Realtor.com URL..."
                    className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-400 text-slate-700 min-w-0"
                  />
                  <button
                    onClick={handleFetch}
                    disabled={!isListing || loading}
                    className="px-4 py-2.5 bg-blue-800 text-white text-xs font-bold rounded-xl hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed transition whitespace-nowrap"
                  >
                    {loading ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                        Loading...
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
                        {property.status && <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{property.status}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">List Price</p>
                      <p className="text-slate-900 font-black text-lg">{property.price ? formatCurrency(property.price) : "—"}</p>
                    </div>
                    <div className="rounded-xl p-3 transition-all duration-500" style={{
                      background: couponRevealed ? "linear-gradient(135deg,#1e3a8a,#1d4ed8)" : "#f8fafc",
                      border: couponRevealed ? "2px solid #f59e0b" : "2px solid #e2e8f0",
                      boxShadow: couponRevealed ? "0 0 20px 4px rgba(245,158,11,0.3)" : "none",
                    }}>
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
                          Activating your coupon...
                        </span>
                      ) : "⚡ Activate My Buywiser Coupon"}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <OfficialCoupon
                        value={formatCurrency(rebate)}
                        serial={generateSerial()}
                        compact={true}
                        className="w-full"
                      />
                      <a
                        href={`mailto:hello@buywiser.com?subject=Buywiser Coupon Activation&body=Property: ${property.address}%0AList Price: ${formatCurrency(property.price)}%0AActivated Savings: ${formatCurrency(rebate)}`}
                        className="block w-full py-3.5 text-center font-black rounded-2xl text-sm text-white transition"
                        style={{ background: "linear-gradient(135deg,#b45309 0%,#d97706 100%)", boxShadow: "0 4px 20px rgba(180,83,9,0.4)" }}
                      >
                        Start My Buywiser Path →
                      </a>
                    </div>
                  )}
                </>
              )}

              {!property && !loading && (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-3">
                    <Ticket className="h-7 w-7 text-amber-500" />
                  </div>
                  <p className="font-semibold text-slate-700 text-sm">Paste a listing URL above to activate</p>
                  <p className="text-slate-400 text-xs mt-1">Zillow · Redfin · Realtor.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function BuywiserHome() {
  const [videoOpen, setVideoOpen] = useState(true); // auto-open on load

  return (
    <div className="bg-white text-slate-900 font-sans">
      {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="#">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-10 w-auto" />
          </a>
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-500">
            <a href="#how" className="hover:text-slate-900 transition">How It Works</a>
            <a href="#calculator" className="hover:text-slate-900 transition">Coupon Value</a>
            <a href="#dashboard" className="hover:text-slate-900 transition">Activate</a>
            <a href="#testimonials" className="hover:text-slate-900 transition">Stories</a>
          </div>
          <a href="#calculator" className="px-5 py-2.5 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-400 transition shadow-sm">
            Activate My Coupon
          </a>
        </div>
      </nav>

      {/* ── SECTION 1: HERO ── */}
      <section className="relative pt-24 min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
        {/* Oversized coupon watermark */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-[0.06] pointer-events-none hidden lg:block" style={{ width: 700, height: 700 }}>
          <div className="w-full h-full rounded-[80px] flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1e3a8a, #d97706)" }}>
            <p className="text-white font-black text-center leading-none" style={{ fontSize: 160 }}>$10,000</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full mb-8 uppercase tracking-widest">
                <Ticket className="h-3.5 w-3.5" /> The First Universal Homebuyer's Coupon
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black text-slate-900 leading-[1.0] tracking-tight mb-6">
                Activate The<br />
                <span className="text-blue-700">Buywiser Coupon</span><br />
                First.
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed mb-6 max-w-lg">
                The first universal homebuyer's coupon of its kind. No matter where you find the home, activating it before you click can put real money back in your pocket. Miss the timing, and you may miss the savings.
              </p>

              {/* Punch line */}
              <div className="inline-flex items-start gap-3 bg-amber-50 border-l-4 border-amber-500 rounded-r-2xl px-5 py-4 mb-10">
                <p className="text-amber-900 font-black text-base">
                  Don't click "View Property."<br />
                  <span className="text-slate-900">Activate The Buywiser Coupon first.</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#calculator" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-400 transition text-base shadow-lg">
                  Activate My Coupon <ArrowRight className="h-4 w-4" />
                </a>
                <a href="#how" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition text-base">
                  How It Works
                </a>
              </div>
            </div>

            {/* Right: Video + Coupon */}
            <div className="relative hidden lg:flex flex-col gap-5 items-end">
              {/* Video thumbnail card */}
              <div className="relative w-full max-w-md group cursor-pointer" onClick={() => setVideoOpen(true)}>
                <img
                  src={`https://dynamic.heygen.ai/aws_pacific/avatar_tmp/0f383ecff85b43989c86627a5acc78fb/vHxkOtNVhD4T93gOtDdfsGIgVKf5JxaF5/a9339c11582d4bacb2274163f199d778.jpeg`}
                  alt="Watch the Buywiser video"
                  className="w-full h-80 object-cover rounded-3xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80"; }}
                />
                {/* Gold frame overlay */}
                <div className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
                  style={{ border: "2px solid rgba(201,168,76,0.5)", boxShadow: "inset 0 0 0 1px rgba(201,168,76,0.2)" }}
                />
                {/* Dark overlay on hover */}
                <div className="absolute inset-0 rounded-3xl bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 group-hover:scale-110"
                      style={{ background: "linear-gradient(135deg, #b45309, #d97706)", border: "3px solid #c9a84c", boxShadow: "0 0 40px rgba(201,168,76,0.5)" }}
                    >
                      <Play className="h-8 w-8 text-white fill-white ml-1" />
                    </div>
                    <span className="text-white font-bold text-sm tracking-wide px-4 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)" }}>
                      Watch How It Works
                    </span>
                  </div>
                </div>
                {/* Coupon overlaid */}
                <div className="absolute -bottom-6 -left-8">
                  <CouponGraphic value="$12,500" />
                </div>
              </div>
              <div className="mt-10 w-full max-w-md flex justify-end">
                <button
                  onClick={() => setVideoOpen(true)}
                  className="flex items-center gap-2.5 text-slate-500 hover:text-slate-800 transition text-sm font-semibold"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Play className="h-3.5 w-3.5 text-amber-700 fill-amber-700 ml-0.5" />
                  </div>
                  See the full Buywiser explanation
                </button>
              </div>
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: Ticket, label: "Activate the Coupon" },
              { icon: Home, label: "Tour Smarter" },
              { icon: DollarSign, label: "Save Real Money" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-2xl px-5 py-4 shadow-sm">
                <item.icon className="h-5 w-5 text-blue-700" />
                <span className="font-bold text-slate-800 text-sm">{item.label}</span>
              </div>
            ))}
          </div>

          {/* ── Process Visual ── */}
          <div className="mt-16 max-w-4xl mx-auto">
            <p className="text-center text-xs font-bold tracking-widest text-slate-400 uppercase mb-8">How it works in 3 steps</p>
            <div className="flex flex-col md:flex-row items-stretch gap-3">

              {/* Step 1: Zillow listing */}
              <div className="flex-1 rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                {/* Browser chrome */}
                <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 bg-white rounded-md px-2.5 py-1 flex items-center gap-1.5 border border-slate-200">
                    <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="text-slate-500 text-xs font-mono truncate">zillow.com/homedetails/123-maple-st</span>
                  </div>
                </div>
                {/* Zillow listing mockup */}
                <div className="p-3">
                  <div className="w-full h-28 rounded-xl overflow-hidden mb-2 bg-slate-100">
                    <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80" alt="House" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-black text-slate-900 text-sm">$1,250,000</p>
                      <p className="text-slate-500 text-xs">123 Maple St, Glendale, CA</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">4 bd · 3 ba</p>
                      <p className="text-xs text-slate-500">2,400 sqft</p>
                    </div>
                  </div>
                  {/* Zillow CTA buttons — with red X */}
                  <div className="flex gap-2 mt-2 relative">
                    <button className="flex-1 py-1.5 text-xs font-bold rounded-lg text-white" style={{ background: "#006aff" }}>Contact Agent</button>
                    <button className="flex-1 py-1.5 text-xs font-bold rounded-lg border border-blue-600 text-blue-600">Request Tour</button>
                    {/* Red X over the buttons */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg" style={{ background: "rgba(220,38,38,0.12)", border: "2px solid rgba(220,38,38,0.5)" }}>
                      <div className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-lg">
                        <X className="h-3 w-3" /> Don't click yet
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex md:flex-col items-center justify-center gap-1 py-2 md:py-0 px-1">
                <div className="hidden md:block w-px h-6 bg-amber-300" />
                <div className="flex items-center gap-2 md:flex-col md:gap-1">
                  <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center shadow-md flex-shrink-0">
                    <ArrowRight className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-amber-600 font-black text-xs uppercase tracking-wide whitespace-nowrap">Activate first</span>
                </div>
                <div className="hidden md:block w-px h-6 bg-amber-300" />
              </div>

              {/* Step 2: Paste into Buywiser */}
              <div className="flex-1 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-400/60 bg-white" style={{ boxShadow: "0 0 0 2px rgba(251,191,36,0.3), 0 8px 24px rgba(0,0,0,0.1)" }}>
                {/* Browser chrome */}
                <div className="border-b border-slate-200 px-3 py-2 flex items-center gap-2" style={{ background: "#0f1f5c" }}>
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 bg-white/10 rounded-md px-2.5 py-1 flex items-center gap-1.5 border border-white/20">
                    <Ticket className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    <span className="text-white/80 text-xs font-mono truncate">buywiser.com/activate</span>
                  </div>
                </div>
                {/* Buywiser input UI */}
                <div className="p-3 space-y-2">
                  <p className="text-xs font-black text-slate-700 uppercase tracking-wide">Activation Dashboard</p>
                  {/* URL input with pasted value */}
                  <div className="relative">
                    <div className="w-full rounded-xl border-2 border-amber-400 px-3 py-2 text-xs font-mono text-slate-600 bg-amber-50 flex items-center gap-1.5 shadow-sm">
                      <span className="text-amber-500 flex-shrink-0">⎘</span>
                      <span className="truncate text-slate-700">zillow.com/homedetails/123-maple-st</span>
                    </div>
                    <span className="absolute -top-2 -right-1 bg-amber-500 text-white text-xs font-black px-1.5 py-0.5 rounded-full shadow">Pasted ✓</span>
                  </div>
                  {/* Price + instant calc */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2">
                      <p className="text-xs text-slate-400 font-semibold mb-0.5">List Price</p>
                      <p className="font-black text-slate-900 text-sm">$1,250,000</p>
                    </div>
                    <div className="rounded-xl p-2" style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", border: "2px solid #f59e0b" }}>
                      <p className="text-xs font-semibold mb-0.5" style={{ color: "#fde68a" }}>Coupon Value</p>
                      <p className="font-black text-white text-sm">$12,500</p>
                    </div>
                  </div>
                  <button className="w-full py-2 text-xs font-black rounded-xl text-white" style={{ background: "linear-gradient(135deg,#b45309,#d97706)" }}>
                    ⚡ Activate My Coupon
                  </button>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex md:flex-col items-center justify-center gap-1 py-2 md:py-0 px-1">
                <div className="hidden md:block w-px h-6 bg-amber-300" />
                <div className="flex items-center gap-2 md:flex-col md:gap-1">
                  <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center shadow-md flex-shrink-0">
                    <ArrowRight className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-amber-600 font-black text-xs uppercase tracking-wide whitespace-nowrap">Get the rebate</span>
                </div>
                <div className="hidden md:block w-px h-6 bg-amber-300" />
              </div>

              {/* Step 3: Activated coupon */}
              <div className="flex-1 rounded-2xl overflow-hidden shadow-lg flex flex-col" style={{ background: "linear-gradient(160deg, #0f1f5c 0%, #1a2f7a 40%, #0d1a4a 100%)", border: "2px solid #c9a84c", boxShadow: "0 0 0 1px #0f1f5c, 0 0 0 4px #c9a84c, 0 8px 32px rgba(0,0,0,0.5)" }}>
                {/* Inner border */}
                <div className="absolute inset-1 rounded-xl pointer-events-none" style={{ border: "1px solid rgba(201,168,76,0.25)" }} />
                {/* Corner ornaments */}
                <div className="relative flex-1 p-5 flex flex-col justify-between">
                  <div className="absolute top-2 left-2 w-4 h-4" style={{ borderTop: "1.5px solid #c9a84c", borderLeft: "1.5px solid #c9a84c" }} />
                  <div className="absolute top-2 right-2 w-4 h-4" style={{ borderTop: "1.5px solid #c9a84c", borderRight: "1.5px solid #c9a84c" }} />
                  <div className="absolute bottom-2 left-2 w-4 h-4" style={{ borderBottom: "1.5px solid #c9a84c", borderLeft: "1.5px solid #c9a84c" }} />
                  <div className="absolute bottom-2 right-2 w-4 h-4" style={{ borderBottom: "1.5px solid #c9a84c", borderRight: "1.5px solid #c9a84c" }} />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-5 w-auto brightness-0 invert opacity-80" />
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#c9a84c", fontSize: 9 }}>OFFICIAL COUPON</span>
                    </div>
                    <div style={{ borderTop: "1px solid rgba(201,168,76,0.3)" }} className="mb-3" />
                    <p className="text-center uppercase tracking-widest mb-1" style={{ color: "rgba(201,168,76,0.7)", fontSize: 9, letterSpacing: "0.2em" }}>Activated Savings</p>
                    <p className="text-center font-black text-white leading-none mb-1" style={{ fontSize: "clamp(1.8rem,5vw,2.5rem)", textShadow: "0 0 30px rgba(201,168,76,0.6)" }}>$12,500</p>
                    <p className="text-center" style={{ color: "rgba(201,168,76,0.5)", fontSize: 9 }}>On qualifying home purchase</p>
                  </div>

                  <div>
                    <div style={{ borderTop: "1px solid rgba(201,168,76,0.3)" }} className="mt-3 mb-2" />
                    <div className="flex items-center justify-between">
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 8, fontFamily: "monospace" }}>BW-8K2X-9PYZ-4MNQ</span>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-amber-400" />
                        <span style={{ color: "#c9a84c", fontSize: 8 }} className="font-bold uppercase tracking-wide">Activated</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <p className="text-center text-slate-400 text-xs mt-5">Copy the Zillow URL → Paste into Buywiser before clicking → Your coupon activates instantly</p>
          </div>
        </div>
      </section>

      {/* ── TIMING SECTION ── */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            <Clock className="h-3.5 w-3.5" /> Timing Matters
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-5">
            The window to activate closes<br />when you click first.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            The Buywiser Coupon works when it is activated <strong className="text-white">before</strong> you enter the default tour path. If you click "Contact Agent" or "Request a Tour" first, you may lose the chance to capture the savings.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <div className="bg-red-950/40 border border-red-800/30 rounded-2xl px-5 py-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <X className="h-4 w-4 text-red-400" />
                <span className="text-red-300 font-bold text-sm">Click First</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">Enter the default portal path → Lose leverage → Miss the savings window</p>
            </div>
            <div className="bg-blue-950/40 border border-amber-500/30 rounded-2xl px-5 py-4 text-left">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-amber-400" />
                <span className="text-amber-300 font-bold text-sm">Activate First</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">Activate the coupon → See your savings → Move through a vetted path</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALCULATOR ── */}
      <CouponCalculator />

      {/* ── PROBLEM / SOLUTION ── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">The Smarter Move</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-5">
              Most buyers fall into the default path.<br />Buywiser helps you activate a better one.
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
              Most homebuyers find a home they like and go straight into the default tour path. That means less control, less coordination, and missed savings. Buywiser gives buyers a smarter move: activate the coupon first.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <X className="h-4 w-4 text-red-500" />
                </div>
                <h3 className="text-xl font-black text-slate-600">The Default Path</h3>
              </div>
              <ul className="space-y-3">
                {["Find a home", "Click the portal button", "Get pulled into a random process", "Lose leverage early", "Miss hidden savings"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-500 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-950 to-blue-900 border-2 border-amber-500/40 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-amber-400" />
                </div>
                <h3 className="text-xl font-black text-white">The Activated Buywiser Path</h3>
              </div>
              <ul className="space-y-3">
                {["Find a home anywhere", "Activate The Buywiser Coupon first", "See your savings opportunity upfront", "Move through a vetted process", "Keep more money in your pocket"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-blue-100 text-sm">
                    <CheckCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Coupon first. Tour second.<br />Smarter all the way through.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                num: "1", title: "Find the Home", icon: Home,
                text: "Search on Zillow, Redfin, Realtor.com, new construction sites, local broker sites, or anywhere else. Buywiser does not replace your search. It improves what happens next.",
              },
              {
                num: "2", title: "Activate The Coupon", icon: Ticket,
                text: "Enter the purchase price and property address or listing link into Buywiser to see your estimated savings and activate your smarter path before you click into the default process.",
              },
              {
                num: "3", title: "Move Forward Smarter", icon: TrendingUp,
                text: "Buywiser helps coordinate the showing, pairs you with the right agent, and aligns the financing strategy so you move through a more reliable, vetted process.",
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
              The Buywiser Coupon is simple to activate. The smarter system behind it is where the real savings work begins.
            </p>
          </div>
        </div>
      </section>

      {/* ── UNIVERSAL COUPON SECTION ── */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            <Zap className="h-3.5 w-3.5 text-amber-300" /> Universal
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-5">One coupon. Any home search site.</h2>
          <p className="text-blue-200 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            The Buywiser Coupon is designed to work no matter where you find the home — Zillow, Redfin, Realtor.com, new construction sites, local broker sites, or anywhere else. Buywiser does not replace the way you search. It upgrades what happens next.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
            {["Zillow", "Redfin", "Realtor.com", "New Construction", "Local Broker Sites", "Any Listing"].map((site) => (
              <span key={site} className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-blue-100">{site}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD ── */}
      <LiveDashboard />

      {/* ── BENEFIT CARDS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">The Advantage</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Why smart buyers activate first</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Zap, title: "Activate Before You Click", text: "Timing matters. Activating first can preserve your savings opportunity before the default path closes it off." },
              { icon: DollarSign, title: "See the Money Upfront", text: "Know the estimated value of your coupon before you move forward — not after the fact." },
              { icon: Shield, title: "Skip the Random Path", text: "Move through a more reliable, vetted process instead of the default route that hands over control from the start." },
              { icon: TrendingUp, title: "Keep More of Your Money", text: "The same home, but with a smarter path that can put meaningful money back in your pocket." },
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

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">Client Stories</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">What Buywiser buyers say</h2>
          </div>

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
                <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80" alt="Happy couple" className="w-full h-56 object-cover rounded-2xl opacity-80" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                quote: "Buywiser made the process feel organized from day one. We were paired with a strong local agent, got excellent financing guidance, and the rebate was a real benefit at closing.",
                name: "Melissa R.", location: "Newport Beach, CA",
                img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80",
              },
              {
                quote: "What stood out was the coordination. Instead of dealing with everything separately, Buywiser tied the whole transaction together and helped us save money at multiple points in the process.",
                name: "David and Priya S.", location: "Austin, TX",
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

      {/* ── POSITIONING ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-4">The Buywiser Difference</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">A simple coupon.<br />A smarter homebuying system.</h2>
          <p className="text-slate-500 text-lg leading-relaxed mb-8">
            The Buywiser Coupon makes the idea easy to understand: activate it before you tour and see your savings opportunity first. But behind that simplicity is a smarter system designed to help buyers take control before the wrong click, the wrong agent path, or the wrong financing structure costs them money.
          </p>
          <p className="text-slate-900 font-bold text-base border-t border-b border-slate-200 py-5 inline-block px-8">
            Our goal is simple: save buyers money, not add another fee to the process.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 opacity-[0.05] pointer-events-none">
          <div className="w-96 h-96 bg-amber-400 rounded-[60px] flex items-center justify-center">
            <p className="text-white font-black text-8xl">$10K</p>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-4">Ready?</p>
          <h2 className="text-4xl md:text-5xl font-black mb-5">Found the home?<br />Activate The Buywiser Coupon first.</h2>
          <p className="text-slate-400 text-lg mb-10">The first universal homebuyer's coupon of its kind. Activate it before you click and see what could come back to you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#calculator" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-400 transition text-base shadow-lg">
              Activate My Coupon <ArrowRight className="h-4 w-4" />
            </a>
            <a href="mailto:hello@buywiser.com" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-600 text-white font-bold rounded-2xl hover:border-slate-400 transition text-base">
              Talk to Buywiser
            </a>
          </div>
          <p className="mt-10 text-sm text-slate-600 font-semibold italic">Find the home anywhere. Activate the savings first.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
            <div>
              <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-10 w-auto brightness-0 invert mb-3" />
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                The smarter way to buy and finance a home. Activate the coupon first.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-10 gap-y-2 text-sm text-slate-500">
              {["How It Works", "Coupon Value", "Activate", "Financing", "Testimonials", "About", "Contact"].map((item) => (
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