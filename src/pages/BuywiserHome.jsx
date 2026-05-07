import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, ArrowRight, ChevronDown, ChevronUp, Tag, Shield, Home, Search, FileText, DollarSign, Users, Briefcase, Menu, X, Phone } from "lucide-react";
import LeadCaptureForm from "../components/LeadCaptureForm";
import VeteranTestimonials from "../components/VeteranTestimonials";
import VideoTestimonial from "../components/VideoTestimonial";
import QualificationCriteria from "../components/QualificationCriteria";
import VeteransNextHomeFAQ from "@/components/VeteransNextHomeFAQ";

// ── Colors ─────────────────────────────────────────────────────────────────────
const NAVY = "#0B1F3B";
const RED = "#C62828";

// ── RWB Stripe ─────────────────────────────────────────────────────────────────
function RWBStripe() {
  return (
    <div className="flex" style={{ height: 5 }}>
      <div style={{ flex: 1, background: RED }} />
      <div style={{ flex: 1, background: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }} />
      <div style={{ flex: 1, background: NAVY }} />
    </div>
  );
}

// ── FAQ ────────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Is this a government VA program?",
    a: "No. Veteran's Next Home™ and the Buywiser 1.5 GAP Benefit™ are private Buywiser programs. They are not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency."
  },
  {
    q: "How do I receive the full 1.5% benefit?",
    a: "The full benefit is typically available when Buywiser coordinates both the purchase-side real estate process and financing for your next home."
  },
  {
    q: "Can I still find homes myself?",
    a: "Yes. Many buyers find homes online. Buywiser can help you tour, evaluate, structure offers, finance, and close — while still giving you the benefit."
  },
  {
    q: "How does Buywiser handle showings?",
    a: "Buywiser coordinates touring access as part of the next-home process. The buyer does not need to manage the process alone."
  },
  {
    q: "What if I only use Buywiser for financing?",
    a: "A partial benefit may be available. The financing-only benefit is generally up to 0.5%, depending on transaction details."
  },
  {
    q: "What if I only use Buywiser for the real estate side?",
    a: "A partial benefit may be available. The real-estate-only benefit is generally up to 1.0%, depending on transaction details."
  },
  {
    q: "Do I need a Personal Benefit Code?",
    a: "No. The code helps personalize your review if you received a mailer, but you can start your Veteran's Next Home™ Review without one."
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-2">
      {FAQS.map((item, i) => (
        <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition"
          >
            <span className="text-sm font-semibold text-slate-800">{item.q}</span>
            {open === i
              ? <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
              : <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />}
          </button>
          {open === i && (
            <div className="px-5 pb-4 bg-white">
              <p className="text-sm text-slate-600 leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Benefit Estimator ──────────────────────────────────────────────────────────
function formatCurrency(val) {
  if (!val) return "$0";
  return Number(val).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function formatWritten(val) {
  // Simple written-out dollar amount for the check
  const n = Math.round(val);
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)} Million Dollars`;
  if (n >= 1000) return `${Math.floor(n / 1000)},${String(n % 1000).padStart(3, "0")} Dollars`;
  return `${n} Dollars`;
}

function CheckEstimator() {
  const [price, setPrice] = useState(700000);
  const [name, setName] = useState("");
  const benefit = price * 0.015;
  const nameParts = name.trim().split(" ");
  const firstName = nameParts.slice(0, -1).join(" ");
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
  const payeeName = name.trim() || "The Veteran Homebuyer";

  return (
    <div>
      {/* Name input */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your Name <span className="font-normal text-slate-400 normal-case">(personalizes the check)</span></label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. John & Sarah Smith"
          className="w-full px-4 py-2.5 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition bg-white"
        />
      </div>

      {/* Slider label */}
      <div className="mb-3 text-center">
        <p className="text-sm font-bold text-slate-700">Enter the approximate price of your next home</p>
        <p className="text-lg font-black text-slate-900 mt-0.5">{formatCurrency(price)}</p>
      </div>

      {/* Slider above check */}
      <div className="flex items-center gap-3 mb-5 px-1">
        <span className="text-xs font-semibold text-slate-400 w-12 text-right">$100K</span>
        <input
          type="range" min={100000} max={2000000} step={25000}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="flex-1"
          style={{ accentColor: "#16a34a" }}
        />
        <span className="text-xs font-semibold text-slate-400 w-8">$2M</span>
      </div>

      {/* The Check */}
      <div className="rounded-xl overflow-hidden shadow-2xl" style={{
        background: "#f7f2e4",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(100,120,80,0.07) 28px, rgba(100,120,80,0.07) 29px), repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(100,120,80,0.04) 28px, rgba(100,120,80,0.04) 29px)",
        fontFamily: "'Georgia', serif",
        border: "1px solid #c9bfa0",
        boxShadow: "0 4px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.6)"
      }}>
        {/* Check header band */}
        <div className="flex items-center justify-between px-5 py-2.5" style={{ background: NAVY, borderBottom: "3px solid #C62828" }}>
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-6 w-auto brightness-0 invert opacity-90" />
          <div className="text-right">
            <div className="text-white/40 text-[9px] uppercase tracking-widest">Check No.</div>
            <div className="text-white text-sm font-bold tracking-widest">0001</div>
          </div>
        </div>

        <div className="px-6 pt-4 pb-3">
          {/* Date row */}
          <div className="flex justify-end mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date</span>
              <div className="border-b border-slate-400 pb-0.5 min-w-[120px] text-center">
                <span className="text-xs font-semibold text-slate-600">Upon Closing</span>
              </div>
            </div>
          </div>

          {/* Pay to line */}
          <div className="flex items-end gap-3 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap pb-1">Pay to the<br/>Order of</span>
            <div className="flex-1 relative">
              <div className="border-b-2 border-slate-500 pb-1 min-h-[28px] flex items-end">
                {name.trim() ? (
                  <span className="text-lg leading-tight font-bold text-slate-900" style={{ fontFamily: "Georgia, serif" }}>
                    {firstName}{lastName && (
                      <span className="text-slate-300 blur-[2px] select-none"> {lastName}</span>
                    )}
                  </span>
                ) : (
                  <span className="text-lg leading-tight italic text-slate-400" style={{ fontFamily: "Georgia, serif" }}>
                    {payeeName}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-[1px] left-0 right-0 border-b border-slate-300" />
            </div>
            {/* Amount box */}
            <div className="flex-shrink-0 ml-2" style={{
              border: "2px solid #1a3a6b",
              borderRadius: "4px",
              background: "linear-gradient(135deg, #eef6ff 0%, #dbeafe 100%)",
              minWidth: "140px",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(255,255,255,0.8)"
            }}>
              <div className="px-1 pt-0.5 text-center" style={{ borderBottom: "1px solid #93c5fd" }}>
                <span className="text-[8px] font-bold uppercase tracking-widest text-blue-400">$ Amount</span>
              </div>
              <div className="px-3 py-2 text-center">
                <span className="text-2xl font-black tabular-nums" style={{ color: "#15803d", fontFamily: "Georgia, serif", textShadow: "0 1px 0 rgba(255,255,255,0.8)" }}>
                  {formatCurrency(benefit)}
                </span>
              </div>
            </div>
          </div>

          {/* Written amount line */}
          <div className="flex items-end gap-2 mb-3">
            <div className="flex-1 border-b border-slate-400 pb-1">
              <span className="text-xs text-slate-500 italic">{formatWritten(benefit)}&nbsp;&nbsp;and&nbsp;&nbsp;00/100&nbsp;–––––––––––––––––––</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap pb-1 ml-2">Dollars</span>
          </div>

          {/* Bank + Memo row */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Memo</div>
              <div className="border-b border-slate-400 pb-1">
                <span className="text-xs text-slate-600">Qualifying Property: {formatCurrency(price)} home</span>
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Authorized Signature</div>
              <div className="border-b border-slate-400 min-w-[130px] pb-1">
                <span className="text-sm text-slate-400 italic" style={{ fontFamily: "Dancing Script, cursive, Georgia, serif" }}>BuyWiser Home Loans</span>
              </div>
            </div>
          </div>

          {/* MICR routing strip */}
          <div className="flex items-center justify-between pt-2.5" style={{ borderTop: "1px dashed #c9bfa0" }}>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-slate-300 font-mono tracking-widest">⑆ 1221 05045 ⑆</span>
              <span className="text-[11px] text-slate-300 font-mono tracking-widest">0001887767 ⑈</span>
              <span className="text-[11px] text-slate-300 font-mono">0001</span>
            </div>
            <div className="text-[9px] text-slate-300 font-mono">MP · CRMLA · NMLS 1887767</div>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 text-center mt-3">Estimate only. Final benefit depends on transaction structure and qualifying details.</p>
    </div>
  );
}

// ── Page Footer ────────────────────────────────────────────────────────────────
function PageFooter() {
  return (
    <footer className="py-10 px-4 text-center border-t border-slate-100 bg-white">
      <img
        src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
        alt="BuyWiser"
        className="h-9 w-auto mx-auto mb-4 opacity-50"
      />
      <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed mb-2">
        Veteran's Next Home™ and the Buywiser 1.5 GAP Benefit™ are private programs offered through Buywiser. They are not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency. Benefit amounts depend on transaction structure and qualifying details.{" "}
        <a href="/Disclosures" className="underline hover:text-slate-600 transition">Licensing &amp; Disclosures</a>
      </p>
      <p className="text-xs text-slate-300">
        BuyWiser Technology, Inc. NMLS #1887767 · CA DRE #01107013
      </p>
    </footer>
  );
}

// ── Main Landing View ──────────────────────────────────────────────────────────
function LandingView() {
  const [code, setCode] = useState("");
  const [oppAddress, setOppAddress] = useState(null);
  const [vaLoanConfirmed, setVaLoanConfirmed] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(setAuthUser).catch(() => setAuthUser(null));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("code")) setCode(params.get("code").toUpperCase());
    const oppId = params.get("opp");
    if (oppId) {
      base44.entities.VTONOpportunity.filter({ id: oppId }).then(results => {
        if (results.length) {
          const o = results[0];
          const parts = [o.property_address, o.city, o.state].filter(Boolean);
          if (parts.length) setOppAddress(parts.join(", "));
          setVaLoanConfirmed(o.va_loan_confirmed ?? null);
        }
      });
    }
  }, []);

  const scrollToCTA = () => ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const COORDINATES = [
    { icon: Search, label: "Next-home strategy review" },
    { icon: Home, label: "Touring access coordination" },
    { icon: FileText, label: "Offer preparation" },
    { icon: Users, label: "Negotiation support" },
    { icon: DollarSign, label: "Financing review" },
    { icon: Briefcase, label: "Transaction coordination" },
    { icon: Shield, label: "Closing benefit structure" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">

      {/* ── Nav ── */}
      <header className="px-4 sm:px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-8 w-auto opacity-80" />
          <div className="flex items-center gap-3">
            <a href="tel:+18183002642" className="flex items-center gap-1 text-sm font-semibold text-blue-700">
              <Phone className="h-4 w-4" /><span className="hidden sm:inline">(818) 300-2642</span><span className="sm:hidden">Call</span>
            </a>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-slate-700 rounded-md border border-slate-200">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="mt-3 border-t border-slate-100 pt-3 space-y-0.5 max-h-[75vh] overflow-y-auto">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 pb-1">Main</p>
            {[
              { label: 'Home', path: '/' },
              { label: 'About', path: '/About' },
              { label: 'Calculators', path: '/Calculators' },
              { label: 'Reviews', path: '/Reviews' },
              { label: 'Contact / Refinance Review', path: '/Contact' },
              { label: 'FAQ', path: '/FAQ' },
              { label: 'Mortgage FAQ', path: '/MortgageFAQ' },
            ].map(l => (
              <a key={l.path} href={l.path} className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg" onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 pt-3 pb-1">Mortgage Programs</p>
            {[
              { label: 'Cash-Out Refinance', path: '/CashOut' },
              { label: 'FHA Streamline', path: '/FHAStreamline' },
              { label: 'VA Streamline', path: '/VAStreamline' },
              { label: 'Home Purchase', path: '/Purchase' },
              { label: 'Apply Now', path: '/Apply' },
            ].map(l => (
              <a key={l.path} href={l.path} className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg" onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 pt-3 pb-1">VTON & Portals</p>
            {[
              { label: '🎖️ Veteran Benefit Scan', path: '/vton-scan' },
              { label: '🤝 VTON Partner Apply', path: '/vton' },
              { label: '🤝 Partner Sign In', path: '/partner' },
              { label: '📍 Field Activator Portal', path: '/field-activator' },
              { label: '🎯 Veteran Benefit Page', path: '/b' },
            ].map(l => (
              <a key={l.path} href={l.path} className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg" onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
            {authUser?.role === 'admin' && (
              <>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 pt-3 pb-1">Admin</p>
                {[
                  { label: '⚙️ Admin Dashboard', path: '/activator-admin' },
                  { label: '📲 QR Scan Dashboard', path: '/qr-scans' },
                  { label: '🗂 Management', path: '/management-dashboard' },
                  { label: '👥 Field Rep Dashboard', path: '/field-rep-dashboard' },
                  { label: '⚙️ Admin Settings', path: '/admin-settings' },
                ].map(l => (
                  <a key={l.path} href={l.path} className="block px-3 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-lg" onClick={() => setMenuOpen(false)}>{l.label}</a>
                ))}
              </>
            )}
            {authUser && (
              <button onClick={() => { base44.auth.logout('/'); setMenuOpen(false); }}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg mt-1">
                Sign Out
              </button>
            )}
            <div className="pt-2">
              <a href="/Contact" className="block px-3 py-3 text-sm font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-lg text-center" onClick={() => setMenuOpen(false)}>
                Request My Review
              </a>
            </div>
          </div>
        )}
      </header>

      <RWBStripe />

      {/* ── Hero ── */}
      <section style={{ background: NAVY }} className="px-4 py-14 sm:py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* Top label */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/10">
            <span className="text-xs font-black uppercase tracking-widest text-white/80">Veteran's Next Home™ by Buywiser</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            Veteran's Next Home™ Program —{" "}
            <span style={{ color: "#ef9a9a" }} className="whitespace-nowrap">Buywiser 1.5 GAP Benefit™</span>
          </h1>

          {/* Subheadline — personalized based on opp QR data */}
          {oppAddress ? (
            <div className="mb-6 max-w-xl mx-auto">
              <p className="text-white font-black text-base sm:text-lg leading-snug mb-2">
                Congratulations on listing{" "}
                <span style={{ color: "#fbbf24" }}>{oppAddress}</span>.{" "}
                Verification has proceeded and you are entitled to the Buywiser 1.5 GAP Benefit™ through the Veteran's Next Home™ Program.
              </p>
              <p className="text-blue-300 text-xs italic">
                Only available through Buywiser's Veteran's Next Home™ Program.
              </p>
            </div>
          ) : (
            <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-6 max-w-xl mx-auto">
              <span className="text-white font-bold">You are selling a VA-financed home — you qualify for the Veteran's Next Home™ Program.</span> Buywiser's 1.5 GAP Benefit™ helps qualifying veteran homeowners bridge the gap costs associated with purchasing their next home.
            </p>
          )}

          {/* Cody & Frank callout */}
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-5 py-3 mb-6 mx-auto max-w-xl">
            <span className="text-2xl">🎖️</span>
            <p className="text-sm text-left leading-snug">
              <span className="text-white font-black">See how Navy Veterans Cody &amp; Frank</span>
              <span className="text-blue-200"> put </span>
              <span className="font-black" style={{ color: "#fbbf24" }}>$9,500 back in their pocket</span>
              <span className="text-blue-200"> on their next home purchase using the Buywiser 1.5 GAP Benefit™.</span>
              <span className="block text-xs text-blue-400 mt-1 italic">Watch their story below ↓</span>
            </p>
          </div>

          {/* Support line */}
          <p className="text-blue-300 text-sm italic mb-8">
            Secure your Veteran's Next Home™ Benefits before your next purchase is finalized.
          </p>

          {/* CTAs */}
          <div className="flex justify-center">
            <button
              onClick={scrollToCTA}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition"
              style={{ background: RED, color: "#fff" }}
            >
              Secure My Next Home™ Benefits <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Video Testimonial */}
          <div className="mt-12 max-w-2xl mx-auto w-full">
            <VideoTestimonial />
            <p className="text-center text-sm font-bold text-slate-700 mt-3 uppercase tracking-wide">Veterans Cody and Frank Receive Their GAP Benefits</p>
          </div>
        </div>
      </section>

      <RWBStripe />

      {/* ── Qualification Criteria ── */}
      <QualificationCriteria onScrollToCTA={scrollToCTA} />

      <RWBStripe />

      {/* ── Benefit Estimator ── */}
      <section className="px-4 py-12 bg-slate-100">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">🇺🇸</span>
              <span className="text-xl">⭐</span>
              <span className="text-xl">🇺🇸</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wide leading-tight" style={{ color: NAVY }}>
              Estimate Your
            </h2>
            <h2 className="text-2xl font-black tracking-wide leading-tight" style={{ color: NAVY }}>
              Buywiser 1.5 GAP Benefit™
            </h2>
            <div className="mt-2 h-1 w-32 mx-auto rounded-full" style={{ background: `linear-gradient(to right, ${RED}, #ffffff, ${NAVY})` }} />
          </div>
          <CheckEstimator />
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-4 py-14 bg-white">
        <div className="max-w-xl mx-auto">
          <p className="text-center text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Process</p>
          <h2 className="text-2xl font-extrabold text-center mb-8" style={{ color: NAVY }}>How Veteran's Next Home™ Works</h2>
          <div className="space-y-4">
            {[
              {
                n: "1",
                title: "Review your transition timing",
                desc: "We look at where you are in the sale process and when you expect to buy again."
              },
              {
                n: "2",
                title: "Structure your next purchase through Buywiser",
                desc: "Buywiser coordinates Next Home™ search support, touring access, offer strategy, financing, and transaction support."
              },
              {
                n: "3",
                title: "Maximize your Buywiser 1.5 GAP Benefit™",
                desc: "When properly structured through Buywiser, the Buywiser 1.5 GAP Benefit™ can provide up to 1.5% back toward your Next Home™."
              },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">
                <div
                  className="w-9 h-9 rounded-full text-white text-sm font-black flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: NAVY }}
                >
                  {n}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 mb-0.5">{title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Benefit ── */}
      <section className="px-4 py-14" style={{ background: "#F5F7FA" }}>
        <div className="max-w-xl mx-auto">
          <p className="text-center text-xs font-black uppercase tracking-widest text-slate-400 mb-2">The Benefit</p>
          <h2 className="text-2xl font-extrabold text-center mb-4" style={{ color: NAVY }}>Buywiser 1.5 GAP Benefit™</h2>
          <p className="text-sm text-slate-600 leading-relaxed text-center mb-8 max-w-md mx-auto">
            The Buywiser 1.5 GAP Benefit™ is part of the Veteran's Next Home™ Program and is designed to help qualifying veteran homeowners bridge common next-home transition expenses. Not a government program.
          </p>

          <div className="bg-white border-2 rounded-2xl px-6 py-5 flex items-center justify-between" style={{ borderColor: RED }}>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color: RED }}>Maximum GAP Benefit</p>
              <p className="text-sm text-slate-700 font-medium">When the purchase is properly structured through Buywiser</p>
            </div>
            <p className="text-3xl font-black ml-4" style={{ color: RED }}>1.5%</p>
          </div>
          <p className="text-xs text-slate-400 text-center mt-4">Final benefit depends on transaction details and how the purchase is structured.</p>
        </div>
      </section>

      {/* ── What Buywiser Coordinates ── */}
      <section className="px-4 py-14 bg-white">
        <div className="max-w-xl mx-auto">
          <p className="text-center text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Full Service</p>
          <h2 className="text-2xl font-extrabold text-center mb-3" style={{ color: NAVY }}>What Buywiser Coordinates</h2>
          <p className="text-sm text-slate-500 text-center leading-relaxed mb-8 max-w-md mx-auto">
            Buywiser modernizes the Next Home™ process for veteran homeowners — coordinating the professional pieces that still matter.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {COORDINATES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <Icon className="h-4 w-4 flex-shrink-0" style={{ color: NAVY }} />
                <span className="text-xs font-semibold text-slate-700">{label}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <p className="text-sm text-slate-600 leading-relaxed">
              Many buyers already find homes online. Buywiser supports that modern behavior while coordinating the professional pieces that still matter: touring access, offer preparation, negotiation strategy, financing, transaction support, and the benefit structure.
            </p>
          </div>
        </div>
      </section>

      {/* ── Built for Veterans ── */}
      <section className="px-4 py-14" style={{ background: "#F5F7FA" }}>
        <div className="max-w-xl mx-auto">
          <p className="text-center text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Who This Is For</p>
          <h2 className="text-2xl font-extrabold text-center mb-2" style={{ color: NAVY }}>Built for Veterans — and Their Spouses — Making Their Next Move</h2>
          <p className="text-sm text-slate-500 text-center leading-relaxed mb-6 max-w-md mx-auto">Both the veteran and their spouse or significant other may qualify for this benefit.</p>
          <div className="space-y-2.5">
            {[
              "Selling a home that had a VA loan (within the last 7 years)",
              "Planning to buy another home",
              "Comparing VA and conventional financing options",
              "Interested in receiving the Buywiser 1.5 GAP Benefit™",
              "Open to a modern, efficient Next Home™ process",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5">
                <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: RED }} />
                <p className="text-sm text-slate-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="px-4 py-12 bg-white">
        <div className="max-w-xl mx-auto">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Veterans &amp; California Buyers Who Saved With Buywiser</p>
          <VeteranTestimonials />
        </div>
      </section>

      {/* ── Video ── */}
      <section className="px-4 pb-14 bg-white">
        <div className="max-w-xl mx-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 text-center">Hear From Bennett Directly</p>
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm" style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
            <iframe
              src="https://app.heygen.com/embeds/f235762557ed4a008bfc3951c186107b"
              title="Bennett Liss — BuyWiser"
              frameBorder="0"
              allow="encrypted-media; fullscreen;"
              allowFullScreen
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            />
          </div>
          <div className="mt-2.5 text-center">
            <p className="text-sm font-semibold text-slate-700">Watch a 1-minute explanation</p>
            <p className="text-xs text-slate-400">Bennett Liss — Buywiser</p>
          </div>
        </div>
      </section>

      {/* ── Start My Review (CTA Form) ── */}
      <section ref={ctaRef} style={{ background: "#F5F7FA" }} className="sticky top-0 z-40 px-4 py-14">
        <div className="max-w-xl mx-auto">
          <div className="rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm">
            <div className="px-6 py-5 text-center" style={{ background: NAVY }}>
              <p className="text-white font-black text-base uppercase tracking-widest">Start Your Veteran's Next Home™ Benefit Review</p>
              <p className="text-blue-300 text-xs mt-1">No cost · No obligation · Response within 1 business day</p>
            </div>
            <div className="p-6 bg-white space-y-4">
              {/* Optional code field */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-slate-400" />
                  Have a Personal Benefit Code? <span className="font-normal text-slate-400 normal-case ml-1">(optional)</span>
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter the code from your mailer"
                  className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 transition bg-white uppercase tracking-widest"
                />
                <p className="mt-1.5 text-xs text-slate-400">No code? No problem. You can still start your Veteran's Next Home™ Benefit Review.</p>
              </div>
              <LeadCaptureForm prefillCode={code} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Veterans Next Home FAQ ── */}
      <VeteransNextHomeFAQ />

      {/* ── Footer CTA Banner ── */}
      <section className="px-4 py-12" style={{ background: NAVY }}>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-white text-sm leading-relaxed mb-5 max-w-md mx-auto">
            Before major Next Home™ decisions are finalized, review how Buywiser can structure your 1.5 GAP Benefit™ through the Veteran's Next Home™ Program.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={scrollToCTA}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold rounded-xl text-sm transition"
              style={{ background: RED, color: "#fff" }}
            >
              Secure My Next Home™ Benefits <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="tel:+18183002642"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold rounded-xl text-sm border-2 border-white/30 text-white hover:bg-white/10 transition"
            >
              Talk to Buywiser
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-14 bg-white">
        <div className="max-w-xl mx-auto">
          <h2 className="text-xl font-extrabold text-center mb-6" style={{ color: NAVY }}>Frequently Asked Questions</h2>
          <FAQ />
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="px-4 pb-8 bg-white">
        <div className="max-w-xl mx-auto">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-xs text-slate-500 leading-relaxed text-center">
              Veteran's Next Home™ and the Buywiser 1.5 GAP Benefit™ are private programs offered through Buywiser. They are not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency.
            </p>
          </div>
        </div>
      </section>

      <PageFooter />
    </div>
  );
}

export default function BuywiserHome() {
  return <LandingView />;
}