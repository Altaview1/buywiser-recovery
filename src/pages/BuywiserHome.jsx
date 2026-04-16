import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, ArrowRight, Home, Star, Ticket, X, Play, Shield, Lock, BadgeCheck } from "lucide-react";
import AppointmentScheduler from "../components/AppointmentScheduler";

const HEYGEN_VIDEO_ID = "a9339c11582d4bacb2274163f199d778";
const HEYGEN_EMBED_URL = `https://app.heygen.com/embeds/${HEYGEN_VIDEO_ID}`;

// ── Palette ────────────────────────────────────────────────────────────────────
const GOV = {
  navy:    "#003366",
  navyDk: "#001f3f",
  gold:    "#c9a84c",
  goldLt:  "#e8c050",
  red:     "#b22234",
  white:   "#ffffff",
  offWhite:"#f5f5f0",
  gray:    "#e8e8e4",
  textDk:  "#1a1a1a",
  textMd:  "#444444",
  textLt:  "#777777",
};

function formatCurrency(val) {
  if (!val) return "$0";
  return Number(val).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function generateSerial() {
  const seg = () => Math.random().toString(36).toUpperCase().slice(2, 6);
  return `BW-${seg()}-${seg()}-${seg()}`;
}

function getExpirationDate() {
  const d = new Date();
  d.setDate(d.getDate() + 90);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,20,0.92)", backdropFilter: "blur(6px)" }}
      onClick={onClose}>
      <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 flex items-center gap-2 text-white/70 hover:text-white transition text-sm font-medium">
          <X className="h-5 w-5" /> Close
        </button>
        <div className="relative overflow-hidden" style={{ border: `3px solid ${GOV.gold}`, borderRadius: 4, boxShadow: `0 0 0 1px ${GOV.navy}, 0 32px 80px rgba(0,0,0,0.8)` }}>
          <div className="aspect-video bg-slate-950">
            <iframe src={HEYGEN_EMBED_URL} title="Buywiser" allow="autoplay; fullscreen" allowFullScreen className="w-full h-full" style={{ border: "none", display: "block" }} />
          </div>
        </div>
        <p className="text-center text-amber-400/70 text-xs mt-3 tracking-widest uppercase font-semibold">California Homebuyers Rebate Program</p>
      </div>
    </div>
  );
}

// ── Official Seal (image-based) ────────────────────────────────────────────────
function CASealGold({ size = 88 }) {
  // Use the official US Great Seal eagle from Wikimedia (public domain)
  // Tinted gold via CSS filter
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "radial-gradient(circle at 40% 35%, #fdf0b0, #d4a030 55%, #8a5c08)",
      border: "2px solid #8a5c08",
      boxShadow: "0 2px 10px rgba(140,90,5,0.55), inset 0 1px 3px rgba(255,240,150,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Inner ring */}
      <div style={{
        position: "absolute",
        inset: 4,
        borderRadius: "50%",
        border: "1px solid rgba(255,220,80,0.5)",
        pointerEvents: "none",
      }} />
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Great_Seal_of_the_United_States_%28obverse%29.svg/240px-Great_Seal_of_the_United_States_%28obverse%29.svg.png"
        alt="Official Seal"
        style={{
          width: size * 0.82,
          height: size * 0.82,
          objectFit: "contain",
          filter: "sepia(1) saturate(2.5) hue-rotate(5deg) brightness(0.85)",
        }}
      />
    </div>
  );
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
        borderRadius: compact ? 4 : 6,
        border: `3px solid ${GOV.navy}`,
        boxShadow: `0 4px 0 ${GOV.navy}, 4px 0 0 ${GOV.navy}, 4px 4px 0 ${GOV.navy}, 0 8px 32px rgba(0,0,40,0.2)`,
      }}>
        {/* Top navy header band */}
        <div className="px-5 py-2.5 flex items-center justify-between" style={{ background: GOV.navy }}>
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-5 w-auto brightness-0 invert opacity-90" />
          <p style={{ color: GOV.gold, fontSize: 8, fontFamily: "sans-serif", letterSpacing: "0.18em" }} className="font-black uppercase">Official Certificate · California Home Rebates</p>
        </div>

        {/* Gold stripe */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${GOV.gold}, ${GOV.goldLt}, ${GOV.gold})` }} />

        {/* Inner border frame */}
        <div className="mx-3 my-2" style={{ border: `1.5px solid ${GOV.navy}`, borderRadius: 2 }}>
          <div className="mx-1 my-1" style={{ border: `0.5px solid ${GOV.gold}`, borderRadius: 2 }}>
            <div className={`px-5 ${compact ? "py-4" : "py-6"}`}>
              <div className="text-center mb-3">
                <p style={{ fontSize: 9, letterSpacing: "0.3em", color: GOV.textMd, fontFamily: "sans-serif" }} className="uppercase font-bold mb-0.5">California Homebuyers Program</p>
                <p style={{ fontSize: compact ? 18 : 22, letterSpacing: "0.15em", color: GOV.navy }} className="font-black uppercase tracking-widest">Rebate Coupon</p>
              </div>

              <div className="mb-3" style={{ borderTop: `1px solid ${GOV.gold}` }} />

              <div className="flex items-center gap-3 mb-3 overflow-hidden">
                <div className="flex-shrink-0"><CASealGold size={sealSize} /></div>
                <div className="flex-1 text-center">
                  <p style={{ fontSize: 8, letterSpacing: "0.2em", color: GOV.textLt, fontFamily: "sans-serif" }} className="uppercase font-bold mb-1">Estimated Savings Value</p>
                  <p style={{ fontSize: compact ? "clamp(1rem,3vw,1.5rem)" : "clamp(1.4rem,3.5vw,2rem)", color: GOV.navy, fontFamily: "'Georgia', serif", whiteSpace: "nowrap" }} className="font-black leading-none">{value || "$10,000"}</p>
                  <p style={{ fontSize: 8, color: GOV.textLt, fontFamily: "sans-serif" }} className="mt-1">Approx. 1% of Purchase Price</p>
                </div>
              </div>

              <div className="mb-3" style={{ borderTop: `1px solid ${GOV.gold}` }} />

              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p style={{ fontSize: 7, letterSpacing: "0.15em", color: GOV.textLt, fontFamily: "sans-serif" }} className="uppercase font-bold">Issued</p>
                  <p style={{ fontSize: 8, color: GOV.textDk, fontFamily: "sans-serif" }} className="font-bold">{issuedDate}</p>
                </div>
                <div style={{ borderLeft: `1px solid ${GOV.gold}`, borderRight: `1px solid ${GOV.gold}` }}>
                  <p style={{ fontSize: 7, letterSpacing: "0.15em", color: GOV.textLt, fontFamily: "sans-serif" }} className="uppercase font-bold">Coupon No.</p>
                  <p style={{ fontSize: 8, color: GOV.textDk, fontFamily: "monospace" }} className="font-bold">{serial || "BW-XXXX-XXXX"}</p>
                </div>
                <div>
                  <p style={{ fontSize: 7, letterSpacing: "0.15em", color: GOV.red, fontFamily: "sans-serif" }} className="uppercase font-bold">Expires</p>
                  <p style={{ fontSize: 8, color: GOV.red, fontFamily: "sans-serif" }} className="font-black">{expDate}</p>
                </div>
              </div>

              <div className="mt-3" style={{ borderTop: `1px solid ${GOV.gold}` }} />
              <p style={{ fontSize: 7, color: GOV.textLt, fontFamily: "sans-serif", lineHeight: 1.4 }} className="text-center mt-2">
                Valid for qualifying CA purchase transactions only. Subject to program availability and lender approval. This is not a state-administered or state-funded program.
              </p>
            </div>
          </div>
        </div>

        {/* Gold stripe bottom */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${GOV.gold}, ${GOV.goldLt}, ${GOV.gold})` }} />

        {/* Punch holes */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full" style={{ background: GOV.offWhite, border: "1.5px solid #ccc" }} />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full" style={{ background: GOV.offWhite, border: "1.5px solid #ccc" }} />
      </div>
    </div>
  );
}

// ── Trust Bar ──────────────────────────────────────────────────────────────────
function TrustBar() {
  return (
    <div style={{ background: GOV.navyDk, borderBottom: `3px solid ${GOV.gold}` }}>
      <div className="max-w-6xl mx-auto px-4 py-2 flex flex-wrap items-center justify-center gap-6">
        {[
          { icon: <Shield className="h-3 w-3" />, text: "Licensed CA Mortgage Broker" },
          { icon: <Lock className="h-3 w-3" />, text: "NMLS #1887767" },
          { icon: <BadgeCheck className="h-3 w-3" />, text: "CA DRE #01107013" },
          { icon: <Shield className="h-3 w-3" />, text: "CA DFPI Licensed" },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-1.5" style={{ color: GOV.gold }}>
            {item.icon}
            <span style={{ fontSize: 10, letterSpacing: "0.06em", fontFamily: "sans-serif", color: "#c9a84c" }} className="font-bold uppercase">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Hero with inline URL paste ─────────────────────────────────────────────────
function HeroWithPaste({ onVideoOpen }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState(null);
  const [error, setError] = useState("");

  // Contact info step
  const [showContact, setShowContact] = useState(false);
  const [contact, setContact] = useState({ firstName: "", lastName: "", phone: "", email: "" });
  const [contactError, setContactError] = useState("");

  // Appointment scheduling step
  const [showScheduler, setShowScheduler] = useState(false);

  // Coupon reveal
  const [couponRevealed, setCouponRevealed] = useState(false);
  const [couponSpinning, setCouponSpinning] = useState(false);
  const [couponDisplay, setCouponDisplay] = useState("");
  const spinRef = useRef(null);

  const rebate = property?.price ? property.price * 0.01 : 0;
  const isListing = url.includes("zillow.com") || url.includes("redfin.com") || url.includes("realtor.com") || url.includes("trulia.com") || url.includes("homes.com");

  const handleFetch = async () => {
    if (!url.trim() || !isListing) return;
    setLoading(true); setError(""); setProperty(null); setCouponRevealed(false); setShowContact(false); setShowScheduler(false);
    try {
      const res = await base44.functions.invoke("fetchPropertyFromUrl", { url: url.trim() });
      setProperty(res.data.property);
      setShowContact(true);
    } catch (e) {
      setError("Couldn't fetch that listing. Try pasting the full URL.");
    }
    setLoading(false);
  };

  const handleContactSubmit = async () => {
    if (!contact.firstName || !contact.lastName || !contact.email || !contact.phone) {
      setContactError("All fields are required."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      setContactError("Please enter a valid email address."); return;
    }
    setContactError("");
    setShowScheduler(true);
  };

  const handleAppointmentSuccess = (couponValue) => {
    setShowScheduler(false);
    setCouponDisplay(formatCurrency(couponValue));
    setCouponRevealed(true);
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
    <section style={{ background: `linear-gradient(180deg, ${GOV.navyDk} 0%, ${GOV.navy} 100%)` }}>
      {/* Decorative gold rule */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${GOV.navy}, ${GOV.gold} 30%, ${GOV.goldLt} 50%, ${GOV.gold} 70%, ${GOV.navy})` }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        {/* Seal + Title row */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="flex-shrink-0">
            <CASealGold size={120} />
          </div>
          <div className="text-center md:text-left">
            <p style={{ color: GOV.gold, fontSize: 11, letterSpacing: "0.3em", fontFamily: "sans-serif" }} className="font-black uppercase mb-2">
              Official California Homebuyers Rebate Coupon Program
            </p>
            <h1 style={{ fontFamily: "'Georgia', serif", color: GOV.white, lineHeight: 1.15 }} className="text-3xl md:text-5xl font-bold mb-3">
              California Homebuyers<br />
              <span style={{ color: GOV.gold }}>Rebate Coupon Program</span>
            </h1>
            <p style={{ color: "rgba(200,210,230,0.85)", fontFamily: "sans-serif" }} className="text-base md:text-lg max-w-xl">
              Searching for a home? Paste any listing URL to instantly generate your official California Homebuyers Rebate Coupon — worth approximately 1% of the purchase price.
            </p>
          </div>
        </div>

        {/* Main paste card */}
        <div className="rounded-sm overflow-hidden" style={{ border: `2px solid ${GOV.gold}`, boxShadow: `0 8px 40px rgba(0,0,0,0.5)` }}>
          {/* Card header */}
          <div className="px-5 py-3 flex items-center justify-between" style={{ background: GOV.gold }}>
            <p style={{ color: GOV.navyDk, fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.2em" }} className="font-black uppercase">
              Step 1 — Generate Your Rebate Coupon
            </p>
            <div className="flex items-center gap-1.5" style={{ color: GOV.navyDk }}>
              <Lock className="h-3 w-3" />
              <span style={{ fontSize: 10, fontFamily: "sans-serif" }} className="font-bold uppercase">Secure</span>
            </div>
          </div>

          <div className="p-5 md:p-7" style={{ background: "#ffffff" }}>
            <p style={{ fontSize: 11, color: GOV.textMd, letterSpacing: "0.1em", fontFamily: "sans-serif" }} className="uppercase font-bold mb-2">
              Paste Listing URL (Zillow · Redfin · Realtor.com · Trulia · Homes.com)
            </p>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setProperty(null); setCouponRevealed(false); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && isListing && handleFetch()}
                placeholder="https://www.zillow.com/homedetails/..."
                className="flex-1 text-sm md:text-base px-4 py-3.5 min-w-0 transition"
                style={{ border: `2px solid ${GOV.navy}`, borderRadius: 2, fontFamily: "sans-serif", outline: "none" }}
                onFocus={(e) => e.target.style.borderColor = GOV.gold}
                onBlur={(e) => e.target.style.borderColor = GOV.navy}
              />
              <button
                onClick={handleFetch}
                disabled={!isListing || loading}
                className="px-5 py-3.5 font-bold text-sm transition whitespace-nowrap"
                style={{
                  background: isListing && !loading ? GOV.navy : "#ccc",
                  color: isListing && !loading ? GOV.white : "#999",
                  border: `2px solid ${isListing && !loading ? GOV.gold : "#ccc"}`,
                  borderRadius: 2,
                  fontFamily: "sans-serif",
                  letterSpacing: "0.05em",
                  cursor: !isListing ? "not-allowed" : "pointer",
                }}
              >
                {loading
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />Loading...</span>
                  : "Generate Coupon →"}
              </button>
            </div>

            {error && <p className="text-red-600 text-xs mt-2 font-semibold">{error}</p>}
            {!isListing && url.length > 10 && (
              <p style={{ color: "#b45309", fontSize: 11, fontFamily: "sans-serif" }} className="font-semibold mt-2">
                Please paste a Zillow, Redfin, Realtor.com, Trulia, or Homes.com URL.
              </p>
            )}

            {loading && (
              <div className="mt-4 space-y-3 animate-pulse">
                <div className="h-28 rounded" style={{ background: GOV.gray }} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 rounded" style={{ background: GOV.gray }} />
                  <div className="h-16 rounded" style={{ background: GOV.gray }} />
                </div>
              </div>
            )}

            {property && !loading && (
              <div className="mt-5 space-y-4">
                {/* Property card */}
                <div className="overflow-hidden" style={{ border: `1.5px solid ${GOV.navy}`, borderRadius: 2 }}>
                  {property.image_url ? (
                    <img src={property.image_url} alt="Property" className="w-full h-40 object-cover" onError={(e) => { e.target.style.display = "none"; }} />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center" style={{ background: GOV.gray }}>
                      <Home className="h-10 w-10" style={{ color: "#999" }} />
                    </div>
                  )}
                  <div className="p-3" style={{ background: GOV.offWhite }}>
                    <p className="font-bold text-sm" style={{ color: GOV.textDk, fontFamily: "sans-serif" }}>
                      {property.address}{property.city ? `, ${property.city}` : ""}{property.state ? `, ${property.state}` : ""}
                    </p>
                    <div className="flex gap-3 mt-1 flex-wrap">
                      {property.beds && <span className="text-xs" style={{ color: GOV.textLt }}>{property.beds} bd</span>}
                      {property.baths && <span className="text-xs" style={{ color: GOV.textLt }}>{property.baths} ba</span>}
                      {property.sqft && <span className="text-xs" style={{ color: GOV.textLt }}>{Number(property.sqft).toLocaleString()} sqft</span>}
                    </div>
                  </div>
                </div>

                {/* ── STEP 2: Contact Info ── */}
                {showContact && !showScheduler && (
                  <div className="overflow-hidden" style={{ border: `2px solid ${GOV.navy}`, borderRadius: 2 }}>
                    <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: GOV.navy }}>
                      <BadgeCheck className="h-3.5 w-3.5" style={{ color: GOV.gold }} />
                      <p style={{ color: GOV.gold, fontFamily: "sans-serif", fontSize: 11, letterSpacing: "0.15em" }} className="font-black uppercase">
                        Step 2 — Your Contact Information
                      </p>
                    </div>
                    <div style={{ height: 2, background: `linear-gradient(90deg, ${GOV.gold}, ${GOV.goldLt}, ${GOV.gold})` }} />

                    <div className="p-4 space-y-3" style={{ background: GOV.offWhite }}>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "First Name", key: "firstName", type: "text", placeholder: "Jane" },
                          { label: "Last Name", key: "lastName", type: "text", placeholder: "Smith" },
                        ].map(({ label, key, type, placeholder }) => (
                          <div key={key}>
                            <label style={{ fontSize: 10, color: GOV.textMd, letterSpacing: "0.1em", fontFamily: "sans-serif" }} className="block font-bold uppercase mb-1">{label}</label>
                            <input
                              type={type}
                              value={contact[key]}
                              onChange={(e) => setContact(c => ({ ...c, [key]: e.target.value }))}
                              placeholder={placeholder}
                              className="w-full px-3 py-2.5 text-sm transition"
                              style={{ border: `2px solid ${GOV.navy}`, borderRadius: 2, fontFamily: "sans-serif", outline: "none", background: GOV.white }}
                              onFocus={(e) => e.target.style.borderColor = GOV.gold}
                              onBlur={(e) => e.target.style.borderColor = GOV.navy}
                            />
                          </div>
                        ))}
                      </div>
                      <div>
                        <label style={{ fontSize: 10, color: GOV.textMd, letterSpacing: "0.1em", fontFamily: "sans-serif" }} className="block font-bold uppercase mb-1">Email Address</label>
                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) => setContact(c => ({ ...c, email: e.target.value }))}
                          placeholder="jane.smith@email.com"
                          className="w-full px-3 py-2.5 text-sm transition"
                          style={{ border: `2px solid ${GOV.navy}`, borderRadius: 2, fontFamily: "sans-serif", outline: "none", background: GOV.white }}
                          onFocus={(e) => e.target.style.borderColor = GOV.gold}
                          onBlur={(e) => e.target.style.borderColor = GOV.navy}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, color: GOV.textMd, letterSpacing: "0.1em", fontFamily: "sans-serif" }} className="block font-bold uppercase mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={contact.phone}
                          onChange={(e) => setContact(c => ({ ...c, phone: e.target.value }))}
                          placeholder="(818) 555-1234"
                          className="w-full px-3 py-2.5 text-sm transition"
                          style={{ border: `2px solid ${GOV.navy}`, borderRadius: 2, fontFamily: "sans-serif", outline: "none", background: GOV.white }}
                          onFocus={(e) => e.target.style.borderColor = GOV.gold}
                          onBlur={(e) => e.target.style.borderColor = GOV.navy}
                        />
                      </div>
                      {contactError && <p style={{ color: "#b22234", fontSize: 12, fontFamily: "sans-serif" }} className="font-semibold">{contactError}</p>}
                      <button onClick={handleContactSubmit}
                        className="w-full py-3.5 font-bold transition"
                        style={{ background: GOV.navy, color: GOV.white, border: `2px solid ${GOV.gold}`, borderRadius: 2, fontFamily: "sans-serif", letterSpacing: "0.08em", fontSize: 13, cursor: "pointer" }}>
                        Continue to Schedule →
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: Schedule Appointment ── */}
                {showScheduler && (
                  <AppointmentScheduler 
                    contact={contact} 
                    property={property} 
                    onSuccess={handleAppointmentSuccess}
                    onCancel={() => setShowScheduler(false)}
                  />
                )}

                {/* ── Coupon Display (after scheduled) ── */}
                {couponRevealed && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3" style={{ background: GOV.offWhite, border: `1.5px solid ${GOV.navy}`, borderRadius: 2 }}>
                        <p style={{ fontSize: 10, color: GOV.textLt, fontFamily: "sans-serif", letterSpacing: "0.1em" }} className="uppercase font-bold mb-1">List Price</p>
                        <p className="font-bold text-lg" style={{ color: GOV.navy, fontFamily: "'Georgia', serif" }}>{property.price ? formatCurrency(property.price) : "—"}</p>
                      </div>
                      <div className="p-3" style={{ background: GOV.navy, border: `1.5px solid ${GOV.gold}`, borderRadius: 2 }}>
                        <p style={{ fontSize: 10, fontFamily: "sans-serif", letterSpacing: "0.1em", color: GOV.gold }} className="uppercase font-bold mb-1">Your Coupon Value</p>
                        <p className="font-bold text-xl" style={{ color: couponSpinning ? GOV.gold : GOV.white, fontFamily: "'Georgia', serif", fontVariantNumeric: "tabular-nums" }}>
                          {couponSpinning ? couponDisplay : formatCurrency(rebate)}
                        </p>
                      </div>
                    </div>
                    <OfficialCoupon value={formatCurrency(rebate)} serial={generateSerial()} compact />
                    <a href={`mailto:bennett@buywiser.com?subject=CA Rebate Coupon — ${contact.firstName} ${contact.lastName}&body=Name: ${contact.firstName} ${contact.lastName}%0AEmail: ${contact.email}%0APhone: ${contact.phone}%0AProperty: ${property.address}%0APrice: ${formatCurrency(property.price)}%0ASavings: ${formatCurrency(rebate)}`}
                      className="block w-full py-3.5 text-center font-bold transition"
                      style={{ background: GOV.navy, color: GOV.white, border: `2px solid ${GOV.gold}`, borderRadius: 2, fontFamily: "sans-serif", letterSpacing: "0.06em", fontSize: 13 }}>
                      Submit My Coupon to BuyWiser →
                    </a>
                  </div>
                )}

                {couponSpinning && !couponRevealed && (
                  <div className="p-6 text-center" style={{ background: GOV.navy, border: `2px solid ${GOV.gold}`, borderRadius: 2 }}>
                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block mb-2" />
                    <p style={{ color: GOV.gold, fontFamily: "sans-serif", fontSize: 13 }} className="font-bold">Generating your official certificate...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom links */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-5" style={{ color: "rgba(180,195,220,0.8)" }}>
            <button onClick={onVideoOpen} className="inline-flex items-center gap-2 text-sm hover:text-amber-300 transition font-medium" style={{ fontFamily: "sans-serif" }}>
              <Play className="h-3.5 w-3.5 fill-current" /> Watch how it works
            </button>
            <span style={{ color: "rgba(100,120,150,0.6)" }}>|</span>
            <a href="#how" className="text-sm hover:text-amber-300 transition font-medium" style={{ fontFamily: "sans-serif" }}>See the steps</a>
          </div>
          <p style={{ color: "rgba(160,175,200,0.6)", fontSize: 11, fontFamily: "sans-serif" }}>
            * Coupon valid unless property previously viewed with a Realtor.
          </p>
        </div>
      </div>

      {/* Bottom gold rule */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${GOV.navy}, ${GOV.gold} 30%, ${GOV.goldLt} 50%, ${GOV.gold} 70%, ${GOV.navy})` }} />
    </section>
  );
}

// ── Coupon Calculator ──────────────────────────────────────────────────────────
function CouponCalculator() {
  const [price, setPrice] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [displayValue, setDisplayValue] = useState("$0");
  const spinRef = useRef(null);

  const numeric = parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
  const realRebate = numeric * 0.01;
  const displayPrice = price ? Number(price).toLocaleString("en-US") : "";

  const handleSpin = () => {
    if (!numeric || spinning) return;
    setSpinning(true); setRevealed(false);
    let ticks = 0;
    const totalTicks = 28;
    const getDelay = (t) => { if (t < 10) return 40; if (t < 18) return 70; if (t < 24) return 120; return 200; };
    const tick = () => {
      ticks++;
      if (ticks < totalTicks) {
        setDisplayValue(formatCurrency(Math.round(realRebate * (0.4 + Math.random() * 1.2) / 100) * 100));
        spinRef.current = setTimeout(tick, getDelay(ticks));
      } else {
        setDisplayValue(formatCurrency(realRebate)); setSpinning(false); setRevealed(true);
      }
    };
    spinRef.current = setTimeout(tick, 40);
  };

  useEffect(() => () => clearTimeout(spinRef.current), []);
  useEffect(() => { setRevealed(false); setDisplayValue("$0"); clearTimeout(spinRef.current); setSpinning(false); }, [price]);

  return (
    <section id="calculator" style={{ background: GOV.offWhite, borderTop: `4px solid ${GOV.navy}`, borderBottom: `4px solid ${GOV.navy}` }}>
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
        {/* Section header */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 mb-3" style={{ background: GOV.navy, borderRadius: 2 }}>
            <p style={{ color: GOV.gold, fontSize: 10, letterSpacing: "0.3em", fontFamily: "sans-serif" }} className="font-black uppercase">Rebate Estimator</p>
          </div>
          <h2 style={{ fontFamily: "'Georgia', serif", color: GOV.navy }} className="text-3xl font-bold">Estimate Your Coupon Value</h2>
          <p style={{ color: GOV.textMd, fontFamily: "sans-serif" }} className="text-sm mt-2">Enter a purchase price to see approximately how much you could save.</p>
        </div>

        <div className="overflow-hidden" style={{ background: GOV.white, border: `2px solid ${GOV.navy}`, borderRadius: 2, boxShadow: `4px 4px 0 ${GOV.navy}` }}>
          {/* Header */}
          <div className="px-5 py-2.5" style={{ background: GOV.navy }}>
            <p style={{ color: GOV.gold, fontSize: 10, letterSpacing: "0.2em", fontFamily: "sans-serif" }} className="font-black uppercase">California Homebuyers Coupon — Value Calculator</p>
          </div>
          <div style={{ height: 3, background: `linear-gradient(90deg, ${GOV.gold}, ${GOV.goldLt}, ${GOV.gold})` }} />

          <div className="p-6 md:p-8">
            <label style={{ fontSize: 11, color: GOV.textMd, letterSpacing: "0.15em", fontFamily: "sans-serif" }} className="block font-bold uppercase mb-2">
              Estimated Purchase Price
            </label>
            <div className="relative mb-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-2xl" style={{ color: GOV.textLt }}>$</span>
              <input type="text" inputMode="numeric" value={displayPrice}
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="1,000,000"
                className="w-full pl-10 pr-5 py-4 text-2xl font-bold transition"
                style={{ border: `2px solid ${GOV.navy}`, borderRadius: 2, fontFamily: "'Georgia', serif", color: GOV.textDk, outline: "none" }}
                onFocus={(e) => e.target.style.borderColor = GOV.gold}
                onBlur={(e) => e.target.style.borderColor = GOV.navy}
              />
            </div>

            <div className="p-6 mb-5 text-center transition-all duration-500"
              style={{
                background: spinning || revealed ? GOV.navy : GOV.offWhite,
                border: `2px solid ${spinning || revealed ? GOV.gold : GOV.gray}`,
                borderRadius: 2,
              }}>
              <p style={{ fontSize: 10, letterSpacing: "0.2em", fontFamily: "sans-serif", color: spinning || revealed ? GOV.gold : GOV.textLt }} className="uppercase font-bold mb-2">Estimated Coupon Value</p>
              <p className="font-bold leading-none" style={{
                fontSize: "clamp(2.2rem, 8vw, 4rem)",
                color: spinning ? GOV.gold : revealed ? GOV.white : GOV.gray,
                fontFamily: "'Georgia', serif",
                fontVariantNumeric: "tabular-nums",
              }}>
                {spinning || revealed ? displayValue : numeric > 0 ? "——" : "$0"}
              </p>
              {revealed && <p style={{ color: GOV.gold, fontFamily: "sans-serif", fontSize: 12 }} className="font-bold mt-3">✓ Approx. 1% of Purchase Price</p>}
            </div>

            <button onClick={handleSpin} disabled={!numeric || spinning}
              className="w-full py-4 font-bold tracking-wide transition-all mb-4"
              style={{
                background: !numeric ? GOV.gray : GOV.navy,
                color: !numeric ? GOV.textLt : GOV.white,
                border: `2px solid ${!numeric ? GOV.gray : GOV.gold}`,
                borderRadius: 2,
                fontFamily: "sans-serif",
                letterSpacing: "0.08em",
                cursor: !numeric ? "not-allowed" : "pointer",
              }}>
              {spinning
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin inline-block" />Calculating...</span>
                : revealed ? "Recalculate" : "Calculate My Coupon Value →"}
            </button>

            {revealed && (
              <div className="mb-4">
                <OfficialCoupon value={displayValue} serial={generateSerial()} compact />
              </div>
            )}

            <a href="#dashboard" className="block w-full py-3.5 text-center font-bold transition"
              style={{ background: GOV.offWhite, color: GOV.navy, border: `2px solid ${GOV.navy}`, borderRadius: 2, fontFamily: "sans-serif", letterSpacing: "0.06em", fontSize: 13 }}>
              Activate With Your Listing URL →
            </a>
            <p style={{ fontSize: 10, color: GOV.textLt, fontFamily: "sans-serif" }} className="text-center mt-3">Available on qualifying CA purchases. Terms apply.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── How It Works ───────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section id="how" style={{ background: GOV.white, borderBottom: `4px solid ${GOV.navy}` }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1 mb-3" style={{ background: GOV.navy, borderRadius: 2 }}>
            <p style={{ color: GOV.gold, fontSize: 10, letterSpacing: "0.3em", fontFamily: "sans-serif" }} className="font-black uppercase">Program Instructions</p>
          </div>
          <h2 style={{ fontFamily: "'Georgia', serif", color: GOV.navy }} className="text-3xl font-bold">How to Reserve Your CA Coupon</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { num: "1", title: "Find a Property", sub: "On Zillow, Redfin, Realtor.com", desc: "Browse any major listing site for a California home you'd like to tour." },
            { num: "2", title: "Paste the URL", sub: "Into BuyWiser before touring", desc: "Copy the full listing URL from your browser address bar and paste it above." },
            { num: "3", title: "Receive Your Coupon", sub: "Instantly generated", desc: "Your official CA Homebuyers Rebate Coupon is issued and applied at closing." },
          ].map((step) => (
            <div key={step.num} className="overflow-hidden" style={{ border: `2px solid ${GOV.navy}`, borderRadius: 2, boxShadow: `3px 3px 0 ${GOV.navy}` }}>
              <div className="px-4 py-2 flex items-center gap-3" style={{ background: GOV.navy }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ background: GOV.gold, color: GOV.navyDk, fontFamily: "'Georgia', serif" }}>{step.num}</div>
                <div>
                  <p style={{ color: GOV.white, fontFamily: "sans-serif", fontSize: 12 }} className="font-bold">{step.title}</p>
                  <p style={{ color: GOV.gold, fontFamily: "sans-serif", fontSize: 10 }}>{step.sub}</p>
                </div>
              </div>
              <div className="p-4" style={{ background: GOV.offWhite }}>
                <p style={{ color: GOV.textMd, fontFamily: "sans-serif", fontSize: 13, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Step 3 coupon preview */}
        <div className="flex flex-col md:flex-row items-center gap-8 p-6" style={{ border: `2px solid ${GOV.navy}`, borderRadius: 2, background: GOV.offWhite }}>
          <div className="w-64 flex-shrink-0">
            <OfficialCoupon value="$12,500" serial="BW-DEMO-0000" compact />
          </div>
          <div className="space-y-3">
            {["Coupon activated before your first tour", "Rebate credited at closing", "Works on any qualifying CA home purchase"].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: GOV.gold }} />
                <span style={{ color: GOV.textDk, fontFamily: "sans-serif", fontSize: 14 }} className="font-medium">{item}</span>
              </div>
            ))}
            <a href="#calculator" className="inline-flex items-center gap-2 mt-3 px-5 py-3 font-bold transition"
              style={{ background: GOV.navy, color: GOV.white, border: `2px solid ${GOV.gold}`, borderRadius: 2, fontFamily: "sans-serif", letterSpacing: "0.06em", fontSize: 13 }}>
              Get My CA Coupon <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ───────────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    { name: "Ami & Allen K.", location: "Thousand Oaks, CA", saved: "$100,000+", quote: "My husband Allen and I saved a minimum of $100,000 between the rebates and the credits we received. Thank you, BuyWiser." },
    { name: "Maria & José R.", location: "Pasadena, CA", saved: "$14,500", quote: "We had no idea this program existed. We found our home on Redfin, pasted the link into BuyWiser, and got our coupon the same day. Closing was seamless." },
    { name: "David L.", location: "Glendale, CA", saved: "$11,200", quote: "I'm a first-time buyer and was nervous about everything. BuyWiser explained the coupon in two minutes and it showed up as a credit on my closing disclosure." },
    { name: "Sandra & Tom H.", location: "Burbank, CA", saved: "$17,800", quote: "We were already under contract before someone told us about this. Luckily we hadn't closed yet. Got the coupon applied at the last minute — saved nearly $18k." },
    { name: "Priya N.", location: "Irvine, CA", saved: "$22,500", quote: "My agent didn't even know this existed. BuyWiser walked me through it step by step. The rebate came directly off my closing costs. Highly recommend." },
    { name: "Kevin & Lisa M.", location: "Sherman Oaks, CA", saved: "$13,000", quote: "We used Zillow to find our home, copied the link, and within minutes had our CA Coupon confirmed. I wish every part of buying a home was this easy." },
  ];

  return (
    <section style={{ background: GOV.navyDk, borderBottom: `4px solid ${GOV.gold}` }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-block px-4 py-1 mb-3" style={{ background: GOV.gold, borderRadius: 2 }}>
            <p style={{ color: GOV.navyDk, fontSize: 10, letterSpacing: "0.3em", fontFamily: "sans-serif" }} className="font-black uppercase">Client Testimonials</p>
          </div>
          <h2 style={{ fontFamily: "'Georgia', serif", color: GOV.white }} className="text-3xl font-bold">Real Savings. Real Homeowners.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="flex flex-col gap-4 p-5" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${GOV.gold}30`, borderRadius: 2 }}>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <p style={{ color: "rgba(210,220,235,0.9)", fontFamily: "sans-serif", fontSize: 13, lineHeight: 1.6 }} className="flex-1">"{t.quote}"</p>
              <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${GOV.gold}30` }}>
                <div>
                  <p style={{ color: GOV.white, fontFamily: "sans-serif", fontSize: 13 }} className="font-bold">{t.name}</p>
                  <p style={{ color: "rgba(160,175,200,0.7)", fontFamily: "sans-serif", fontSize: 11 }}>{t.location}</p>
                </div>
                <div className="px-3 py-1.5 text-center" style={{ background: `${GOV.gold}22`, border: `1px solid ${GOV.gold}55`, borderRadius: 2 }}>
                  <p style={{ color: GOV.gold, fontFamily: "'Georgia', serif", fontSize: 14 }} className="font-bold">{t.saved}</p>
                  <p style={{ color: `${GOV.gold}99`, fontFamily: "sans-serif", fontSize: 10 }} className="font-medium uppercase tracking-wide">saved</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function BuywiserHome() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <div style={{ background: GOV.white, color: GOV.textDk, fontFamily: "sans-serif" }}>
      {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: GOV.navyDk, borderBottom: `3px solid ${GOV.gold}` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <a href="#">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-9 w-auto brightness-0 invert" />
          </a>
          <div className="hidden md:flex items-center gap-6">
            {["#how", "#calculator", "#dashboard"].map((href, i) => (
              <a key={href} href={href} style={{ color: "rgba(200,215,235,0.8)", fontFamily: "sans-serif", fontSize: 13, letterSpacing: "0.04em" }}
                className="font-medium hover:text-amber-300 transition">
                {["How It Works", "Estimate Value", "Activate"][i]}
              </a>
            ))}
          </div>
          <a href="#calculator" className="px-4 py-2 font-bold text-sm transition"
            style={{ background: GOV.gold, color: GOV.navyDk, borderRadius: 2, fontFamily: "sans-serif", letterSpacing: "0.05em" }}>
            Get My CA Coupon
          </a>
        </div>
      </nav>

      {/* ── TRUST BAR ── */}
      <div className="pt-14">
        <TrustBar />
      </div>

      {/* ── HERO ── */}
      <HeroWithPaste onVideoOpen={() => setVideoOpen(true)} />

      {/* ── HOW IT WORKS ── */}
      <HowItWorks />

      {/* ── CALCULATOR ── */}
      <CouponCalculator />

      {/* ── TESTIMONIALS ── */}
      <Testimonials />

      {/* ── FOOTER ── */}
      <footer style={{ background: GOV.navyDk, borderTop: `3px solid ${GOV.gold}` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-8 w-auto brightness-0 invert mb-3" />
              <p style={{ color: "rgba(160,175,200,0.7)", fontFamily: "sans-serif", fontSize: 12, lineHeight: 1.6, maxWidth: 280 }}>
                California's trusted boutique mortgage broker, helping homebuyers access rebate programs since 1991.
              </p>
            </div>
            <div className="flex flex-wrap gap-10">
              <div>
                <p style={{ color: GOV.gold, fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.2em" }} className="font-black uppercase mb-3">Licensing</p>
                {["NMLS #1887767", "Personal NMLS #1524446", "CA RE #01107013", "CA DFPI Licensed"].map((l) => (
                  <p key={l} style={{ color: "rgba(160,175,200,0.6)", fontFamily: "sans-serif", fontSize: 12 }} className="mb-1">{l}</p>
                ))}
              </div>
              <div>
                <p style={{ color: GOV.gold, fontFamily: "sans-serif", fontSize: 10, letterSpacing: "0.2em" }} className="font-black uppercase mb-3">Contact</p>
                <a href="tel:+18183002642" style={{ color: "rgba(200,215,235,0.8)", fontFamily: "sans-serif", fontSize: 12 }} className="block mb-1 hover:text-amber-300 transition">(818) 300-2642</a>
                <a href="mailto:bennett@buywiser.com" style={{ color: "rgba(200,215,235,0.8)", fontFamily: "sans-serif", fontSize: 12 }} className="block hover:text-amber-300 transition">bennett@buywiser.com</a>
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${GOV.gold}30` }} className="pt-6">
            <p style={{ color: "rgba(120,135,160,0.6)", fontFamily: "sans-serif", fontSize: 11, lineHeight: 1.6, maxWidth: "70ch" }}>
              BuyWiser Technology, Inc. DBA BuyWiser Home Loans. Company NMLS #1887767. Licensed by the California DFPI under the CRMLA. This is not a commitment to lend. All programs subject to borrower qualification. Rates and terms subject to change. Equal Housing Opportunity. The CA Coupon program is not state-administered or state-funded.
            </p>
            <p style={{ color: "rgba(100,115,140,0.5)", fontFamily: "sans-serif", fontSize: 11 }} className="mt-3">© {new Date().getFullYear()} BuyWiser Technology, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}