import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, ArrowRight, Home, Users, DollarSign, Star, Ticket, X, Play } from "lucide-react";

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
      <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 flex items-center gap-2 text-white/70 hover:text-white transition text-sm font-medium">
          <X className="h-5 w-5" /> Close
        </button>
        <div className="relative rounded-2xl overflow-hidden" style={{ border: "2px solid #c9a84c", boxShadow: "0 0 0 1px #0f1f5c, 0 0 0 5px #c9a84c, 0 32px 80px rgba(0,0,0,0.8)" }}>
          <div className="aspect-video bg-slate-950">
            <iframe src={HEYGEN_EMBED_URL} title="Buywiser" allow="autoplay; fullscreen" allowFullScreen className="w-full h-full" style={{ border: "none", display: "block" }} />
          </div>
        </div>
        <p className="text-center text-amber-400/70 text-xs mt-4 tracking-widest uppercase font-semibold">Buywiser · Tap Into The California Homebuyers Coupon</p>
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

// ── Official Coupon ────────────────────────────────────────────────────────────
function OfficialCoupon({ value, serial, compact = false }) {
  return (
    <div className="relative select-none" style={{ fontFamily: "serif" }}>
      <div className="relative overflow-hidden" style={{
        background: "linear-gradient(160deg, #0f1f5c 0%, #1a2f7a 40%, #0d1a4a 100%)",
        borderRadius: compact ? 16 : 20,
        border: "2px solid #c9a84c",
        boxShadow: "0 0 0 1px #0f1f5c, 0 0 0 5px #c9a84c, 0 8px 48px rgba(0,0,0,0.6)",
      }}>
        <div className="absolute inset-2 rounded-xl pointer-events-none" style={{ border: "1px solid rgba(201,168,76,0.3)" }} />
        <div className="absolute top-3 left-3 w-5 h-5 opacity-60" style={{ borderTop: "2px solid #c9a84c", borderLeft: "2px solid #c9a84c" }} />
        <div className="absolute top-3 right-3 w-5 h-5 opacity-60" style={{ borderTop: "2px solid #c9a84c", borderRight: "2px solid #c9a84c" }} />
        <div className="absolute bottom-3 left-3 w-5 h-5 opacity-60" style={{ borderBottom: "2px solid #c9a84c", borderLeft: "2px solid #c9a84c" }} />
        <div className="absolute bottom-3 right-3 w-5 h-5 opacity-60" style={{ borderBottom: "2px solid #c9a84c", borderRight: "2px solid #c9a84c" }} />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-50" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-slate-50" />
        <div className={`relative z-10 ${compact ? "px-8 py-6" : "px-10 py-9"}`}>
          <div className="flex items-center justify-between mb-4">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-6 w-auto brightness-0 invert opacity-80" />
            <div className="text-right">
              <p style={{ color: "#c9a84c", fontSize: 9 }} className="font-bold uppercase tracking-widest">OFFICIAL COUPON</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 8, fontFamily: "monospace" }}>{serial || "BW-XXXX-XXXX-XXXX"}</p>
            </div>
          </div>
          <div className="mb-4" style={{ borderTop: "1px solid rgba(201,168,76,0.3)" }} />
          <p className="text-center uppercase tracking-[0.25em] mb-2" style={{ color: "rgba(201,168,76,0.7)", fontSize: 10, fontFamily: "sans-serif" }}>California Homebuyers Coupon</p>
          <p className="text-center font-black leading-none mb-1" style={{
            fontSize: compact ? "clamp(2rem,8vw,2.8rem)" : "clamp(2.8rem,8vw,4rem)",
            color: "#ffffff",
            textShadow: "0 0 40px rgba(201,168,76,0.5)",
          }}>{value || "$10,000"}</p>
          <div className="mt-4 mb-4" style={{ borderTop: "1px solid rgba(201,168,76,0.3)" }} />
          <div className="flex items-center justify-between">
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 8, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>Est. 1% Buyer Rebate</p>
            <p style={{ color: "rgba(201,168,76,0.6)", fontSize: 8, fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>Qualifying Purchase</p>
          </div>
        </div>
      </div>
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
    setSpinning(true); setRevealed(false); setGlowing(false);
    let ticks = 0;
    const totalTicks = 28;
    const getDelay = (t) => { if (t < 10) return 40; if (t < 18) return 70; if (t < 24) return 120; return 200; };
    const tick = () => {
      ticks++;
      if (ticks < totalTicks) {
        setDisplayValue(formatCurrency(Math.round(realRebate * (0.4 + Math.random() * 1.2) / 100) * 100));
        spinRef.current = setTimeout(tick, getDelay(ticks));
      } else {
        setDisplayValue(formatCurrency(realRebate)); setSpinning(false); setRevealed(true); setGlowing(true);
        setTimeout(() => setGlowing(false), 1800);
      }
    };
    spinRef.current = setTimeout(tick, 40);
  };

  useEffect(() => () => clearTimeout(spinRef.current), []);
  useEffect(() => { setRevealed(false); setDisplayValue("$0"); clearTimeout(spinRef.current); setSpinning(false); setGlowing(false); }, [price]);

  return (
    <section id="calculator" className="py-20 bg-slate-50">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">Step 2 — See Your Savings</p>
          <h2 className="text-3xl font-black text-slate-900">What's Your Coupon Worth?</h2>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">Purchase Price</label>
          <div className="relative mb-6">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-2xl font-bold">$</span>
            <input type="text" inputMode="numeric" value={displayPrice}
              onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="1,000,000"
              className="w-full pl-12 pr-6 py-5 text-3xl font-black text-slate-900 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-amber-400 bg-white transition"
            />
          </div>
          <div className="relative rounded-2xl p-7 mb-6 text-center overflow-hidden transition-all duration-500"
            style={{
              background: spinning || revealed ? "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #1d4ed8 100%)" : "#f8fafc",
              border: glowing ? "2px solid #f59e0b" : spinning ? "2px solid #2563eb" : "2px solid #e2e8f0",
              boxShadow: glowing ? "0 0 40px 12px rgba(245,158,11,0.35)" : "none",
            }}>
            {glowing && (
              <>
                <span className="absolute top-3 left-4 text-amber-300 text-lg animate-bounce">✦</span>
                <span className="absolute top-3 right-4 text-amber-300 text-lg animate-bounce" style={{ animationDelay: "0.15s" }}>✦</span>
              </>
            )}
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: spinning || revealed ? "rgba(253,230,138,0.9)" : "#94a3b8" }}>Your Coupon Value</p>
            <p className="font-black leading-none" style={{
              fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
              color: spinning ? "#fcd34d" : revealed ? "#ffffff" : "#e2e8f0",
              textShadow: glowing ? "0 0 30px rgba(245,158,11,0.8)" : "none",
              fontVariantNumeric: "tabular-nums",
            }}>
              {spinning || revealed ? displayValue : numeric > 0 ? "?????" : "$0"}
            </p>
            {revealed && <p className="text-amber-300 text-sm font-bold mt-3">✓ Estimated 1% activated savings</p>}
          </div>
          <button onClick={handleSpin} disabled={!numeric || spinning}
            className="w-full py-5 text-base font-black rounded-2xl mb-4 transition-all duration-200"
            style={{
              background: !numeric ? "#e2e8f0" : spinning ? "linear-gradient(135deg,#1d4ed8,#1e40af)" : "linear-gradient(135deg,#b45309,#d97706)",
              color: !numeric ? "#94a3b8" : "#ffffff",
              boxShadow: numeric && !spinning ? "0 4px 24px rgba(180,83,9,0.4)" : "none",
              cursor: !numeric ? "not-allowed" : "pointer",
            }}>
            {spinning ? <span className="flex items-center justify-center gap-3"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />Activating...</span>
              : revealed ? "🎉 Activate Again" : "⚡ Activate My Coupon"}
          </button>
          {revealed && (
            <div className="mb-4">
              <OfficialCoupon value={displayValue} serial={generateSerial()} compact />
            </div>
          )}
          <a href="#dashboard" className="block w-full py-4 bg-slate-900 text-white text-base font-bold rounded-2xl hover:bg-slate-800 transition text-center">
            Step 3 — Paste Your Listing URL →
          </a>
          <p className="text-xs text-slate-400 text-center mt-4">Available on qualifying purchases. Terms apply.</p>
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
    setLoading(true); setError(""); setProperty(null); setCouponRevealed(false);
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
    setCouponSpinning(true); setCouponRevealed(false);
    let ticks = 0;
    const totalTicks = 26;
    const getDelay = (t) => t < 10 ? 40 : t < 18 ? 75 : t < 23 ? 130 : 210;
    const tick = () => {
      ticks++;
      if (ticks < totalTicks) {
        setCouponDisplay(formatCurrency(Math.round(rebate * (0.4 + Math.random() * 1.2) / 100) * 100));
        spinRef2.current = setTimeout(tick, getDelay(ticks));
      } else {
        setCouponDisplay(formatCurrency(rebate)); setCouponSpinning(false); setCouponRevealed(true);
      }
    };
    spinRef2.current = setTimeout(tick, 40);
  };

  useEffect(() => () => clearTimeout(spinRef2.current), []);

  const isListing = url.includes("zillow.com") || url.includes("redfin.com") || url.includes("realtor.com") || url.includes("trulia.com");

  return (
    <section id="dashboard" className="py-20 bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-3">Step 3 — Paste Your Listing</p>
          <h2 className="text-3xl font-black text-white">Paste The URL, Get Your Coupon</h2>
          <p className="text-slate-400 mt-2">Zillow · Redfin · Realtor.com — any listing works</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-slate-900 px-5 py-3 flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-amber-400" /><div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-3 text-slate-400 text-xs font-mono">buywiser.com/activate</span>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1.5">Paste Listing URL</p>
              <div className="flex gap-2">
                <input type="url" value={url}
                  onChange={(e) => { setUrl(e.target.value); setProperty(null); setCouponRevealed(false); setError(""); }}
                  onKeyDown={(e) => e.key === "Enter" && isListing && handleFetch()}
                  placeholder="Paste Zillow / Redfin / Realtor.com URL..."
                  className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400 text-slate-700 min-w-0"
                />
                <button onClick={handleFetch} disabled={!isListing || loading}
                  className="px-4 py-2.5 bg-amber-500 text-white text-xs font-bold rounded-xl hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition whitespace-nowrap">
                  {loading ? <span className="flex items-center gap-1.5"><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />Loading...</span> : "Fetch"}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs mt-1.5 font-medium">{error}</p>}
              {!isListing && url.length > 10 && <p className="text-amber-500 text-xs mt-1.5">Please paste a Zillow, Redfin, or Realtor.com URL</p>}
            </div>

            {loading && (
              <div className="space-y-3 animate-pulse">
                <div className="h-28 bg-slate-100 rounded-2xl" />
                <div className="grid grid-cols-2 gap-3"><div className="h-16 bg-slate-100 rounded-xl" /><div className="h-16 bg-slate-100 rounded-xl" /></div>
              </div>
            )}

            {property && !loading && (
              <>
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  {property.image_url ? (
                    <img src={property.image_url} alt="Property" className="w-full h-40 object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center"><Home className="h-10 w-10 text-slate-300" /></div>
                  )}
                  <div className="p-3 bg-slate-50">
                    <p className="font-bold text-slate-900 text-sm">{property.address}{property.city ? `, ${property.city}` : ""}{property.state ? `, ${property.state}` : ""}</p>
                    <div className="flex gap-3 mt-1 flex-wrap">
                      {property.beds && <span className="text-xs text-slate-500">{property.beds} bd</span>}
                      {property.baths && <span className="text-xs text-slate-500">{property.baths} ba</span>}
                      {property.sqft && <span className="text-xs text-slate-500">{Number(property.sqft).toLocaleString()} sqft</span>}
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
                    <p className="font-black text-xl" style={{ color: couponSpinning ? "#fcd34d" : couponRevealed ? "#ffffff" : "#e2e8f0", fontVariantNumeric: "tabular-nums" }}>
                      {couponSpinning || couponRevealed ? couponDisplay : "?????"}
                    </p>
                  </div>
                </div>
                {!couponRevealed ? (
                  <button onClick={handleRevealCoupon} disabled={couponSpinning || !property.price}
                    className="w-full py-4 text-base font-black rounded-2xl transition-all duration-200"
                    style={{ background: "linear-gradient(135deg,#b45309,#d97706)", color: "#ffffff", boxShadow: "0 4px 24px rgba(180,83,9,0.45)" }}>
                    {couponSpinning ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Activating...</span> : "⚡ Activate My Coupon"}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <OfficialCoupon value={formatCurrency(rebate)} serial={generateSerial()} compact />
                    <a href={`mailto:hello@buywiser.com?subject=Buywiser Coupon&body=Property: ${property.address}%0APrice: ${formatCurrency(property.price)}%0ASavings: ${formatCurrency(rebate)}`}
                      className="block w-full py-3.5 text-center font-black rounded-2xl text-sm text-white transition"
                      style={{ background: "linear-gradient(135deg,#b45309,#d97706)", boxShadow: "0 4px 20px rgba(180,83,9,0.4)" }}>
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
    </section>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function BuywiserHome() {
  const [videoOpen, setVideoOpen] = useState(true);

  return (
    <div className="bg-white text-slate-900 font-sans">
      {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="#">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-10 w-auto" />
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#how" className="hover:text-slate-900 transition">How It Works</a>
            <a href="#calculator" className="hover:text-slate-900 transition">Coupon Value</a>
            <a href="#dashboard" className="hover:text-slate-900 transition">Activate</a>
          </div>
          <a href="#calculator" className="px-5 py-2.5 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-400 transition shadow-sm">
            Get My Coupon
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-28 pb-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left: headline */}
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
                <Ticket className="h-3.5 w-3.5" /> California Homebuyers Coupon
              </div>

              {/* Zillow + Buywiser = Savings equation */}
              <div className="flex items-center gap-3 mb-8 flex-wrap">
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#006aff" }}>
                    <span className="text-white font-black text-xs">Z</span>
                  </div>
                  <span className="font-black text-slate-800 text-sm">Zillow</span>
                </div>
                <span className="text-2xl font-black text-slate-400">+</span>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3">
                  <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="Buywiser" className="h-5 w-auto brightness-0 invert" />
                </div>
                <span className="text-2xl font-black text-slate-400">=</span>
                <div className="flex items-center gap-2 rounded-2xl px-4 py-3" style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", border: "2px solid #c9a84c" }}>
                  <DollarSign className="h-5 w-5 text-amber-400" />
                  <span className="font-black text-white text-sm">Thousands Back</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight mb-5">
                Tap Into The<br />
                <span style={{ color: "#1e3a8a" }}>California Homebuyers</span><br />
                Coupon & Save Thousands.
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
                Find a home on Zillow. Paste the URL into Buywiser before you click. Get your coupon. It's that simple.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="#how" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-400 transition text-base shadow-lg">
                  See How It Works <ArrowRight className="h-4 w-4" />
                </a>
                <button onClick={() => setVideoOpen(true)} className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-200 text-slate-700 font-bold rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition text-base">
                  <Play className="h-4 w-4 fill-slate-600" /> Watch Video
                </button>
              </div>
            </div>

            {/* Right: Video thumbnail */}
            <div className="relative hidden lg:block">
              <div className="relative w-full group cursor-pointer" onClick={() => setVideoOpen(true)}>
                <img
                  src="https://dynamic.heygen.ai/aws_pacific/avatar_tmp/0f383ecff85b43989c86627a5acc78fb/vHxkOtNVhD4T93gOtDdfsGIgVKf5JxaF5/a9339c11582d4bacb2274163f199d778.jpeg"
                  alt="Watch the Buywiser video"
                  className="w-full h-96 object-cover rounded-3xl shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80"; }}
                />
                <div className="absolute inset-0 rounded-3xl bg-black/25 group-hover:bg-black/35 transition-colors duration-300" style={{ border: "2px solid rgba(201,168,76,0.5)" }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200 group-hover:scale-110"
                      style={{ background: "linear-gradient(135deg,#b45309,#d97706)", border: "3px solid #c9a84c", boxShadow: "0 0 40px rgba(201,168,76,0.5)" }}>
                      <Play className="h-8 w-8 text-white fill-white ml-1" />
                    </div>
                    <span className="text-white font-bold text-sm px-4 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)" }}>
                      Watch How It Works
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">Simple as 1, 2, 3</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Get Your Coupon in 3 Steps</h2>
          </div>

          {/* Clean 3-step process graphic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

            {/* Step 1 */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0" style={{ background: "#006aff" }}>1</div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">Find on Zillow</p>
                    <p className="text-slate-400 text-xs">Any listing, anywhere in CA</p>
                  </div>
                </div>
                {/* Mini browser mockup */}
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <div className="bg-slate-100 px-2.5 py-1.5 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400" /><div className="w-2 h-2 rounded-full bg-amber-400" /><div className="w-2 h-2 rounded-full bg-green-400" />
                    <div className="flex-1 bg-white rounded px-2 py-0.5 flex items-center gap-1 border border-slate-200">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#006aff" }} />
                      <span className="text-slate-400 text-xs font-mono truncate" style={{ fontSize: 9 }}>zillow.com/homedetails/...</span>
                    </div>
                  </div>
                  <div className="relative">
                    <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80" alt="House" className="w-full h-20 object-cover" />
                  </div>
                  <div className="px-3 py-2 bg-white">
                    <p className="font-black text-slate-900 text-sm">$1,250,000</p>
                    <p className="text-slate-400 text-xs">123 Maple St, Glendale, CA</p>
                    {/* Blocked Zillow buttons */}
                    <div className="relative mt-2">
                      <div className="flex gap-1.5">
                        <div className="flex-1 py-1.5 rounded-lg text-xs font-bold text-center text-white" style={{ background: "#006aff" }}>Contact Agent</div>
                        <div className="flex-1 py-1.5 rounded-lg text-xs font-bold text-center border" style={{ color: "#006aff", borderColor: "#006aff" }}>Request Tour</div>
                      </div>
                      <div className="absolute inset-0 rounded-lg flex items-center justify-center" style={{ background: "rgba(220,38,38,0.1)", border: "1.5px solid rgba(220,38,38,0.6)" }}>
                        <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                          <X className="h-2.5 w-2.5" /> Not yet
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <ArrowRight className="h-8 w-8 text-amber-400" />
                <span className="text-amber-500 font-black text-xs uppercase tracking-widest">Paste URL</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden" style={{ border: "2px solid #c9a84c" }}>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0" style={{ background: "#0f1f5c" }}>2</div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">Paste into Buywiser</p>
                    <p className="text-slate-400 text-xs">Before you click anything</p>
                  </div>
                </div>
                {/* Mini Buywiser dashboard */}
                <div className="rounded-xl overflow-hidden border border-amber-200">
                  <div className="px-2.5 py-1.5 flex items-center gap-1.5" style={{ background: "#0f1f5c" }}>
                    <div className="w-2 h-2 rounded-full bg-red-400" /><div className="w-2 h-2 rounded-full bg-amber-400" /><div className="w-2 h-2 rounded-full bg-green-400" />
                    <div className="flex-1 bg-white/10 rounded px-2 py-0.5 flex items-center gap-1 border border-white/20">
                      <Ticket className="w-2 h-2 text-amber-400 flex-shrink-0" />
                      <span className="text-white/70 font-mono truncate" style={{ fontSize: 9 }}>buywiser.com/activate</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white space-y-2">
                    <div className="rounded-lg border-2 border-amber-400 px-2.5 py-1.5 bg-amber-50 flex items-center gap-1.5">
                      <span className="text-amber-500 text-xs">⎘</span>
                      <span className="text-slate-600 font-mono truncate" style={{ fontSize: 9 }}>zillow.com/homedetails/123-maple...</span>
                      <span className="ml-auto bg-amber-500 text-white font-black rounded-full px-1.5 py-0.5" style={{ fontSize: 8 }}>✓</span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
                        <p style={{ fontSize: 8 }} className="text-slate-400 font-semibold uppercase">Price</p>
                        <p className="font-black text-slate-900 text-xs">$1,250,000</p>
                      </div>
                      <div className="rounded-lg p-2" style={{ background: "linear-gradient(135deg,#1e3a8a,#1d4ed8)", border: "1.5px solid #f59e0b" }}>
                        <p style={{ fontSize: 8, color: "#fde68a" }} className="font-semibold uppercase">Coupon</p>
                        <p className="font-black text-white text-xs">$12,500</p>
                      </div>
                    </div>
                    <div className="w-full py-1.5 rounded-lg text-white font-black text-center" style={{ background: "linear-gradient(135deg,#b45309,#d97706)", fontSize: 10 }}>
                      ⚡ Activate My Coupon
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 — Coupon Card (full width) */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row items-center gap-8">
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0" style={{ background: "#1e3a8a" }}>3</div>
              <div>
                <p className="font-black text-slate-900">Get Your Official Coupon</p>
                <p className="text-slate-400 text-sm">Your California Homebuyers Coupon is activated instantly</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col md:flex-row items-center gap-6">
              <div className="w-64 flex-shrink-0">
                <OfficialCoupon value="$12,500" serial="BW-DEMO-0000" compact />
              </div>
              <div className="space-y-3">
                {["Coupon is activated before you tour", "Rebate applied at closing", "Works with any California home"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <span className="text-slate-700 text-sm font-medium">{item}</span>
                  </div>
                ))}
                <a href="#calculator" className="inline-flex items-center gap-2 mt-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-400 transition text-sm">
                  Get My Coupon Now <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALCULATOR ── */}
      <CouponCalculator />

      {/* ── DASHBOARD ── */}
      <LiveDashboard />

      {/* ── TESTIMONIAL ── */}
      <section id="testimonials" className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex gap-1 justify-center mb-6">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
          </div>
          <p className="text-2xl md:text-3xl font-bold text-slate-900 leading-relaxed mb-6">
            "My husband Allen and I saved a minimum of $100,000 between the rebates and the credits we received. Thank you, Buywiser."
          </p>
          <p className="font-black text-slate-900">Ami and Allen K.</p>
          <p className="text-amber-600 text-sm font-medium">Thousand Oaks, CA</p>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Found a home on Zillow?<br />Get your coupon first.</h2>
          <p className="text-slate-400 text-lg mb-10">Tap into the California Homebuyers Coupon and save thousands. Simple as 1, 2, 3.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#calculator" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-400 transition text-base shadow-lg">
              Get My Coupon <ArrowRight className="h-4 w-4" />
            </a>
            <button onClick={() => setVideoOpen(true)} className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-600 text-white font-bold rounded-2xl hover:border-slate-400 transition text-base">
              <Play className="h-4 w-4 fill-white" /> Watch Video
            </button>
          </div>
          <p className="mt-8 text-xs text-slate-600">Available on qualifying purchases. Terms and availability may vary.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-9 w-auto brightness-0 invert" />
          <div className="flex flex-wrap gap-6 text-sm text-slate-500 justify-center">
            {["How It Works", "Coupon Value", "Activate", "Contact"].map((item) => (
              <a key={item} href="#" className="hover:text-white transition">{item}</a>
            ))}
          </div>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} BuyWiser. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}