import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, ArrowRight, Home, Users, DollarSign, Star, Ticket, X, Play, Volume2 } from "lucide-react";

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
        <p className="text-center text-amber-400/70 text-xs mt-4 tracking-widest uppercase font-semibold">Buywiser · Tap Into The CA Coupon</p>
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

// ── CA State Seal SVG (Gold) ───────────────────────────────────────────────────
function CASealGold({ size = 88 }) {
  const r = size / 2;
  const outerR = r - 2;
  const midR = r - 8;
  const innerR = r - 14;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", filter: "drop-shadow(0 2px 8px rgba(180,130,20,0.5))" }}>
      <defs>
        <radialGradient id="sealBg" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f5d87a" />
          <stop offset="60%" stopColor="#c9a84c" />
          <stop offset="100%" stopColor="#a07830" />
        </radialGradient>
        <radialGradient id="bearFill" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#7a5a10" />
          <stop offset="100%" stopColor="#4a3508" />
        </radialGradient>
      </defs>
      {/* Outer solid ring */}
      <circle cx={r} cy={r} r={outerR} fill="url(#sealBg)" stroke="#a07830" strokeWidth="1.5" />
      {/* Sunburst rays between outerR and midR */}
      {Array.from({ length: 36 }).map((_, i) => {
        const angle = (i * 360) / 36 - 90;
        const rad = (angle * Math.PI) / 180;
        const x1 = r + (midR + 1) * Math.cos(rad);
        const y1 = r + (midR + 1) * Math.sin(rad);
        const x2 = r + (outerR - 2) * Math.cos(rad);
        const y2 = r + (outerR - 2) * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7a5a10" strokeWidth={i % 3 === 0 ? "1.5" : "0.7"} opacity="0.8" />;
      })}
      {/* Inner circle background */}
      <circle cx={r} cy={r} r={innerR} fill="#e8c050" stroke="#a07830" strokeWidth="1" />
      {/* Bear body */}
      <g transform={`translate(${r}, ${r + 2})`}>
        <ellipse cx="0" cy="7" rx="9" ry="7" fill="url(#bearFill)" />
        <circle cx="0" cy="-1" r="6" fill="url(#bearFill)" />
        <circle cx="-4" cy="-6" r="2.2" fill="url(#bearFill)" />
        <circle cx="4" cy="-6" r="2.2" fill="url(#bearFill)" />
        <rect x="-7" y="12" width="3.5" height="5" rx="1.5" fill="url(#bearFill)" />
        <rect x="-2" y="13" width="3.5" height="5" rx="1.5" fill="url(#bearFill)" />
        <rect x="3" y="13" width="3.5" height="5" rx="1.5" fill="url(#bearFill)" />
        <rect x="8" y="12" width="3.5" height="5" rx="1.5" fill="url(#bearFill)" />
        <ellipse cx="0" cy="1" rx="2.8" ry="2" fill="#5a3f08" />
        <circle cx="-2.2" cy="-2.5" r="0.9" fill="#1a0f00" />
        <circle cx="2.2" cy="-2.5" r="0.9" fill="#1a0f00" />
      </g>
      {/* Arc text: STATE OF CALIFORNIA (top) */}
      <path id="topArcG" d={`M ${r - midR + 4},${r} A ${midR - 4},${midR - 4} 0 0,1 ${r + midR - 4},${r}`} fill="none" />
      <text style={{ fontSize: size * 0.1, fontFamily: "sans-serif", fontWeight: 900, letterSpacing: "0.05em" }} fill="#4a3508">
        <textPath href="#topArcG" startOffset="50%" textAnchor="middle">FOR CALIFORNIA REBATES</textPath>
      </text>
      {/* Arc text: HOMEBUYERS COUPON (bottom) */}
      <path id="botArcG" d={`M ${r - midR + 4},${r} A ${midR - 4},${midR - 4} 0 0,0 ${r + midR - 4},${r}`} fill="none" />
      <text style={{ fontSize: size * 0.088, fontFamily: "sans-serif", fontWeight: 800, letterSpacing: "0.04em" }} fill="#4a3508">
        <textPath href="#botArcG" startOffset="50%" textAnchor="middle">HOMEBUYERS COUPON</textPath>
      </text>
      {/* Dots between arcs and inner circle */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        return <circle key={deg} cx={r + (midR - 3) * Math.cos(rad)} cy={r + (midR - 3) * Math.sin(rad)} r="1.2" fill="#7a5a10" opacity="0.7" />;
      })}
    </svg>
  );
}

function getExpirationDate() {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// ── Official Coupon ────────────────────────────────────────────────────────────
function OfficialCoupon({ value, serial, compact = false }) {
  const sealSize = compact ? 60 : 80;
  const expDate = getExpirationDate();
  const issuedDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="relative select-none" style={{ fontFamily: "'Georgia', serif" }}>
      <div className="relative overflow-hidden" style={{
        background: "#ffffff",
        borderRadius: compact ? 12 : 16,
        border: "3px solid #111",
        boxShadow: "0 4px 0 #111, 4px 0 0 #111, 4px 4px 0 #111, 0 8px 32px rgba(0,0,0,0.25)",
      }}>
        {/* Top black header band */}
        <div className="px-6 py-2.5 flex items-center justify-between" style={{ background: "#111" }}>
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-5 w-auto brightness-0 invert opacity-90" />
          <p style={{ color: "#c9a84c", fontSize: 9, fontFamily: "sans-serif", letterSpacing: "0.18em" }} className="font-black uppercase">Official Certificate · for California Home Rebates</p>
        </div>

        {/* Inner border frame */}
        <div className="mx-3 my-2" style={{ border: "1.5px solid #111", borderRadius: 8 }}>
          <div className="mx-1 my-1" style={{ border: "0.5px solid #888", borderRadius: 6 }}>

            <div className={`px-5 ${compact ? "py-4" : "py-6"}`}>

              {/* Title row */}
              <div className="text-center mb-3">
                <p style={{ fontSize: 9, letterSpacing: "0.3em", color: "#555", fontFamily: "sans-serif" }} className="uppercase font-bold mb-0.5">California Homebuyers Program</p>
                <p style={{ fontSize: compact ? 18 : 22, letterSpacing: "0.15em", color: "#111" }} className="font-black uppercase tracking-widest">Rebate Coupon</p>
              </div>

              <div className="mb-3" style={{ borderTop: "1px solid #ddd" }} />

              {/* Seal + value */}
              <div className="flex items-center gap-3 mb-3 overflow-hidden">
                <div className="flex-shrink-0">
                  <CASealGold size={sealSize} />
                </div>
                <div className="flex-1 text-center">
                  <p style={{ fontSize: 8, letterSpacing: "0.2em", color: "#888", fontFamily: "sans-serif" }} className="uppercase font-bold mb-1">Estimated Savings Value</p>
                  <p style={{
                    fontSize: compact ? "clamp(1.2rem,4vw,1.8rem)" : "clamp(1.6rem,4vw,2.4rem)",
                    color: "#111",
                    fontFamily: "'Georgia', serif",
                    letterSpacing: "0.02em",
                    wordBreak: "break-all",
                  }} className="font-black leading-none">{value || "$10,000"}</p>
                  <p style={{ fontSize: 8, color: "#888", fontFamily: "sans-serif" }} className="mt-1">Approx. 1% of Purchase Price</p>
                </div>
              </div>

              <div className="mb-3" style={{ borderTop: "1px solid #ddd" }} />

              {/* Serial + dates row */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p style={{ fontSize: 7, letterSpacing: "0.15em", color: "#999", fontFamily: "sans-serif" }} className="uppercase font-bold">Issued</p>
                  <p style={{ fontSize: 8, color: "#333", fontFamily: "sans-serif" }} className="font-bold">{issuedDate}</p>
                </div>
                <div style={{ borderLeft: "1px solid #ddd", borderRight: "1px solid #ddd" }}>
                  <p style={{ fontSize: 7, letterSpacing: "0.15em", color: "#999", fontFamily: "sans-serif" }} className="uppercase font-bold">Coupon No.</p>
                  <p style={{ fontSize: 8, color: "#333", fontFamily: "monospace" }} className="font-bold">{serial || "BW-XXXX-XXXX"}</p>
                </div>
                <div>
                  <p style={{ fontSize: 7, letterSpacing: "0.15em", color: "#c00", fontFamily: "sans-serif" }} className="uppercase font-bold">Expires</p>
                  <p style={{ fontSize: 8, color: "#c00", fontFamily: "sans-serif" }} className="font-black">{expDate}</p>
                </div>
              </div>

              <div className="mt-3" style={{ borderTop: "1px solid #ddd" }} />

              {/* Footer disclaimer */}
              <p style={{ fontSize: 7, color: "#aaa", fontFamily: "sans-serif", lineHeight: 1.4 }} className="text-center mt-2">
                Valid for qualifying CA purchase transactions only. Subject to program availability and lender approval. This is not a state-administered or state-funded program.
              </p>
            </div>

          </div>
        </div>

        {/* Punch holes */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full" style={{ background: "#f0f0f0", border: "1.5px solid #ccc" }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full" style={{ background: "#f0f0f0", border: "1.5px solid #ccc" }} />
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
          <h2 className="text-3xl font-black text-slate-900">What's Your CA Coupon Worth?</h2>
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
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: spinning || revealed ? "rgba(253,230,138,0.9)" : "#94a3b8" }}>Your CA Coupon Value</p>
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
              : revealed ? "🎉 Activate Again" : "⚡ Activate My CA Coupon"}
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
          <h2 className="text-3xl font-black text-white">Paste The URL, Get Your CA Coupon</h2>
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
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: couponRevealed ? "#fde68a" : "#94a3b8" }}>CA Coupon Value</p>
                    <p className="font-black text-xl" style={{ color: couponSpinning ? "#fcd34d" : couponRevealed ? "#ffffff" : "#e2e8f0", fontVariantNumeric: "tabular-nums" }}>
                      {couponSpinning || couponRevealed ? couponDisplay : "?????"}
                    </p>
                  </div>
                </div>
                {!couponRevealed ? (
                  <button onClick={handleRevealCoupon} disabled={couponSpinning || !property.price}
                    className="w-full py-4 text-base font-black rounded-2xl transition-all duration-200"
                    style={{ background: "linear-gradient(135deg,#b45309,#d97706)", color: "#ffffff", boxShadow: "0 4px 24px rgba(180,83,9,0.45)" }}>
                    {couponSpinning ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Activating...</span> : "⚡ Activate My CA Coupon"}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <OfficialCoupon value={formatCurrency(rebate)} serial={generateSerial()} compact />
                    <a href={`mailto:hello@buywiser.com?subject=Buywiser CA Coupon&body=Property: ${property.address}%0APrice: ${formatCurrency(property.price)}%0ASavings: ${formatCurrency(rebate)}`}
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

// ── Hero with inline URL paste ─────────────────────────────────────────────────
function HeroWithPaste({ onVideoOpen }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState(null);
  const [error, setError] = useState("");
  const [couponRevealed, setCouponRevealed] = useState(false);
  const [couponSpinning, setCouponSpinning] = useState(false);
  const [couponDisplay, setCouponDisplay] = useState("");
  const spinRef = useRef(null);

  const rebate = property?.price ? property.price * 0.01 : 0;
  const isListing = url.includes("zillow.com") || url.includes("redfin.com") || url.includes("realtor.com") || url.includes("trulia.com") || url.includes("homes.com");

  const handleFetch = async () => {
    if (!url.trim() || !isListing) return;
    setLoading(true); setError(""); setProperty(null); setCouponRevealed(false);
    try {
      const res = await base44.functions.invoke("fetchPropertyFromUrl", { url: url.trim() });
      setProperty(res.data.property);
    } catch (e) {
      setError("Couldn't fetch that listing. Try pasting the full URL.");
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
        spinRef.current = setTimeout(tick, getDelay(ticks));
      } else {
        setCouponDisplay(formatCurrency(rebate)); setCouponSpinning(false); setCouponRevealed(true);
      }
    };
    spinRef.current = setTimeout(tick, 40);
  };

  useEffect(() => () => clearTimeout(spinRef.current), []);

  return (
    <section className="pt-28 pb-20" style={{ background: "linear-gradient(160deg, #0f1f5c 0%, #1e3a8a 50%, #1d4ed8 100%)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">

        <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-6">
          <Ticket className="h-3.5 w-3.5" /> CA Homebuyers Coupon Program
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-4">
          Found a Home?<br />
          <span className="text-amber-400">Get Your CA Coupon.</span>
        </h1>
        <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
          Paste any listing URL — Zillow, Redfin, Realtor.com — and get your California Homebuyers Coupon instantly.
        </p>

        {/* Big paste box */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-6 mb-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Paste your listing URL below</p>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setProperty(null); setCouponRevealed(false); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && isListing && handleFetch()}
              placeholder="https://www.zillow.com/homedetails/..."
              className="flex-1 text-sm md:text-base border-2 border-slate-200 rounded-2xl px-4 py-4 focus:outline-none focus:border-amber-400 text-slate-700 min-w-0 transition"
            />
            <button
              onClick={handleFetch}
              disabled={!isListing || loading}
              className="px-5 py-4 font-black rounded-2xl text-white text-sm transition disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
              style={{ background: isListing && !loading ? "linear-gradient(135deg,#b45309,#d97706)" : "#e2e8f0", color: isListing && !loading ? "#fff" : "#94a3b8" }}
            >
              {loading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />Loading...</span>
                : "⚡ Get Coupon"}
            </button>
          </div>
          <p className="text-xs text-slate-400">Works with Zillow · Redfin · Realtor.com · Trulia · Homes.com</p>
          {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
          {!isListing && url.length > 10 && <p className="text-amber-500 text-xs mt-2">Please paste a Zillow, Redfin, or Realtor.com URL</p>}

          {loading && (
            <div className="mt-4 space-y-3 animate-pulse">
              <div className="h-28 bg-slate-100 rounded-2xl" />
              <div className="grid grid-cols-2 gap-3"><div className="h-16 bg-slate-100 rounded-xl" /><div className="h-16 bg-slate-100 rounded-xl" /></div>
            </div>
          )}

          {property && !loading && (
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-200 text-left">
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
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-1">List Price</p>
                  <p className="text-slate-900 font-black text-lg">{property.price ? formatCurrency(property.price) : "—"}</p>
                </div>
                <div className="rounded-xl p-3 text-left transition-all duration-500" style={{
                  background: couponRevealed ? "linear-gradient(135deg,#1e3a8a,#1d4ed8)" : "#f8fafc",
                  border: couponRevealed ? "2px solid #f59e0b" : "2px solid #e2e8f0",
                  boxShadow: couponRevealed ? "0 0 20px 4px rgba(245,158,11,0.3)" : "none",
                }}>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: couponRevealed ? "#fde68a" : "#94a3b8" }}>CA Coupon Value</p>
                  <p className="font-black text-xl" style={{ color: couponSpinning ? "#fcd34d" : couponRevealed ? "#ffffff" : "#e2e8f0", fontVariantNumeric: "tabular-nums" }}>
                    {couponSpinning || couponRevealed ? couponDisplay : "?????"}
                  </p>
                </div>
              </div>
              {!couponRevealed ? (
                <button onClick={handleRevealCoupon} disabled={couponSpinning || !property.price}
                  className="w-full py-4 text-base font-black rounded-2xl transition-all duration-200"
                  style={{ background: "linear-gradient(135deg,#b45309,#d97706)", color: "#ffffff", boxShadow: "0 4px 24px rgba(180,83,9,0.45)" }}>
                  {couponSpinning ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Activating...</span> : "⚡ Activate My CA Coupon"}
                </button>
              ) : (
                <div className="space-y-3">
                  <OfficialCoupon value={formatCurrency(rebate)} serial={generateSerial()} compact />
                  <a href={`mailto:hello@buywiser.com?subject=Buywiser CA Coupon&body=Property: ${property.address}%0APrice: ${formatCurrency(property.price)}%0ASavings: ${formatCurrency(rebate)}`}
                    className="block w-full py-3.5 text-center font-black rounded-2xl text-sm text-white transition"
                    style={{ background: "linear-gradient(135deg,#b45309,#d97706)", boxShadow: "0 4px 20px rgba(180,83,9,0.4)" }}>
                    Start My BuyWiser Path →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 text-blue-300 text-sm">
          <button onClick={onVideoOpen} className="inline-flex items-center gap-2 hover:text-amber-400 transition font-medium">
            <Play className="h-4 w-4 fill-current" /> Watch how it works
          </button>
          <span className="text-blue-600">·</span>
          <a href="#how" className="hover:text-amber-400 transition font-medium">See the steps</a>
        </div>
        <p className="text-blue-400/70 text-xs mt-3">* Coupon valid unless property previously viewed with a Realtor.</p>
      </div>
    </section>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function BuywiserHome() {
  const [videoOpen, setVideoOpen] = useState(false);

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
            <a href="#calculator" className="hover:text-slate-900 transition">CA Coupon Value</a>
            <a href="#dashboard" className="hover:text-slate-900 transition">Activate</a>
          </div>
          <a href="#calculator" className="px-5 py-2.5 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-400 transition shadow-sm">
            Get My CA Coupon
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <HeroWithPaste onVideoOpen={() => setVideoOpen(true)} />

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">Simple as 1, 2, 3</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Reserve Your CA Coupon in 3 Steps</h2>
          </div>

          {/* Clean 3-step process graphic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

            {/* Step 1 */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0" style={{ background: "#006aff" }}>1</div>
                  <div>
                    <p className="font-black text-slate-900 text-sm">Find a Property You Want to See</p>
                    <p className="text-slate-400 text-xs">On Zillow, Redfin, Realtor.com — any site</p>
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
                    <p className="text-slate-400 mt-2 mb-1" style={{ fontSize: 8 }}>Copy this URL from your browser address bar:</p>
                    <div className="rounded-lg border-2 border-amber-400 bg-amber-50 px-2 py-1.5 flex items-center gap-1.5">
                      <span className="text-slate-500 font-mono truncate flex-1" style={{ fontSize: 8 }}>zillow.com/homedetails/123-maple...</span>
                      <span className="bg-amber-500 text-white font-black px-1.5 py-0.5 rounded flex-shrink-0" style={{ fontSize: 7 }}>COPY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Double-headed Copy → Paste arrow */}
            <div className="hidden md:flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <span className="text-amber-600 font-black uppercase tracking-widest" style={{ fontSize: 9 }}>COPY</span>
                <div className="flex items-center">
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="none"><path d="M9 7H1M1 7L5 3M1 7L5 11" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <div style={{ width: 44, height: 2, background: "#f59e0b" }} />
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="none"><path d="M1 7H9M9 7L5 3M9 7L5 11" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-amber-600 font-black uppercase tracking-widest" style={{ fontSize: 9 }}>PASTE</span>
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
                        <p style={{ fontSize: 8, color: "#fde68a" }} className="font-semibold uppercase">CA Coupon</p>
                        <p className="font-black text-white text-xs">$12,500</p>
                      </div>
                    </div>
                    <div className="w-full py-1.5 rounded-lg text-white font-black text-center" style={{ background: "linear-gradient(135deg,#b45309,#d97706)", fontSize: 10 }}>
                     ⚡ Activate My CA Coupon
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
                <p className="font-black text-slate-900">Get Your Official CA Coupon</p>
                <p className="text-slate-400 text-sm">Your CA Homebuyers Coupon is activated instantly</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col md:flex-row items-center gap-6">
              <div className="w-64 flex-shrink-0">
                <OfficialCoupon value="$12,500" serial="BW-DEMO-0000" compact />
              </div>
              <div className="space-y-3">
                {["CA Coupon activated before you tour", "Rebate applied at closing", "Works with any CA home"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <span className="text-slate-700 text-sm font-medium">{item}</span>
                  </div>
                ))}
                <a href="#calculator" className="inline-flex items-center gap-2 mt-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-400 transition text-sm">
                  Get My CA Coupon Now <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALCULATOR ── */}
      <CouponCalculator />



      {/* ── TESTIMONIALS GRID ── */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-amber-400 font-black uppercase tracking-widest text-sm mb-3">What Our Clients Say</p>
            <h2 className="text-3xl md:text-4xl font-black text-white">Real Savings. Real Homeowners.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Ami & Allen K.", location: "Thousand Oaks, CA", saved: "$100,000+", quote: "My husband Allen and I saved a minimum of $100,000 between the rebates and the credits we received. Thank you, BuyWiser." },
              { name: "Maria & José R.", location: "Pasadena, CA", saved: "$14,500", quote: "We had no idea this program existed. We found our home on Redfin, pasted the link into BuyWiser, and got our coupon the same day. Closing was seamless." },
              { name: "David L.", location: "Glendale, CA", saved: "$11,200", quote: "I'm a first-time buyer and was nervous about everything. BuyWiser explained the coupon in two minutes and it showed up as a credit on my closing disclosure. Simple." },
              { name: "Sandra & Tom H.", location: "Burbank, CA", saved: "$17,800", quote: "We were already under contract before someone told us about this. Luckily we hadn't closed yet. Got the coupon applied at the last minute — saved nearly $18k." },
              { name: "Priya N.", location: "Irvine, CA", saved: "$22,500", quote: "My agent didn't even know this existed. BuyWiser walked me through it step by step. The rebate came directly off my closing costs. Highly recommend." },
              { name: "Kevin & Lisa M.", location: "Sherman Oaks, CA", saved: "$13,000", quote: "We used Zillow to find our home, copied the link, and within minutes had our CA Coupon confirmed. I wish every part of buying a home was this easy." },
            ].map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div>
                    <p className="font-black text-white text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.location}</p>
                  </div>
                  <div className="bg-amber-500/20 border border-amber-500/40 rounded-xl px-3 py-1.5 text-center">
                    <p className="text-amber-400 font-black text-sm">{t.saved}</p>
                    <p className="text-amber-600 text-xs font-medium">saved</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-9 w-auto brightness-0 invert" />
          <div className="flex flex-wrap gap-6 text-sm text-slate-500 justify-center">
            {["How It Works", "CA Coupon Value", "Activate", "Contact"].map((item) => (
              <a key={item} href="#" className="hover:text-white transition">{item}</a>
            ))}
          </div>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} BuyWiser. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}