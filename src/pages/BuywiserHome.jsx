import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, ArrowRight, AlertCircle, Quote, ChevronDown, ChevronUp } from "lucide-react";
import AppointmentScheduler from "../components/AppointmentScheduler";

// ── Testimonials ───────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { quote: "We used BuyWiser's planning tool and saved", highlight: "$12,000", quoteSuffix: " on our next home purchase. Best decision we made.", name: "Hal & Marjie", location: "Oxnard, CA" },
  { quote: "We looked at 7 homes and ended up with", highlight: "$13,000 in savings", quoteSuffix: " credited at closing.", name: "Chris K.", location: "Studio City, CA" },
  { quote: "Bennett laid out a plan that made the whole move make sense financially.", highlight: null, quoteSuffix: "", name: "Dor S.", location: "Santa Monica, CA" },
];

function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const { quote, highlight, quoteSuffix, name, location } = TESTIMONIALS[index];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 relative min-h-[120px]">
      <Quote className="h-5 w-5 text-slate-300 mb-2" />
      <p className="text-slate-700 text-sm leading-relaxed italic mb-3">
        "{quote}{highlight && <span className="not-italic font-bold text-slate-900 text-base"> {highlight}</span>}{quoteSuffix}"
      </p>
      <p className="text-xs font-semibold text-slate-500">{name} &mdash; {location}</p>
      <div className="flex gap-1.5 mt-4">
        {TESTIMONIALS.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === index ? "bg-slate-800 w-4" : "bg-slate-300"}`} />
        ))}
      </div>
    </div>
  );
}

// ── FAQ ────────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Do I need to use a VA loan to qualify?",
    a: "No. This benefit is designed for veterans who are selling and planning their next purchase. In some cases the best next loan may be VA, and in others it may be conventional. We'll help you figure out which makes more sense for your situation."
  },
  {
    q: "What kind of benefit might I see?",
    a: "Depending on the property and your situation, the estimate may reflect potential BuyWiser savings, rebate opportunities, or planning advantages for your next purchase. The goal is to give you a clear picture before you commit to anything."
  },
  {
    q: "Do I need to sign up just to check?",
    a: "No. Paste your listing and see the initial estimate without a full sign-up flow. You only share your contact information if you want to take the next step."
  },
  {
    q: "Is this only for California properties?",
    a: "Yes. BuyWiser is a California-licensed mortgage brokerage and this planning advantage is specifically designed around California transactions."
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
            {open === i ? <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />}
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

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatCurrency(val) {
  if (!val) return "$0";
  return Number(val).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function isListingUrl(url) {
  return (
    url.includes("zillow.com") ||
    url.includes("redfin.com") ||
    url.includes("realtor.com") ||
    url.includes("trulia.com") ||
    url.includes("homes.com")
  );
}

// ── Shared Footer ──────────────────────────────────────────────────────────────
function PageFooter() {
  return (
    <footer className="py-8 px-4 text-center border-t border-slate-100">
      <img
        src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
        alt="BuyWiser"
        className="h-10 w-auto mx-auto mb-3 opacity-60"
      />
      <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
        Powered by BuyWiser. This is a private planning advantage — not a government program or official VA benefit.{" "}
        <a href="/Disclosures" className="underline hover:text-slate-600 transition">Terms &amp; Eligibility</a>
      </p>
      <p className="text-xs text-slate-300 mt-2">
        BuyWiser Technology, Inc. NMLS #1887767. CA DRE #01107013.
      </p>
    </footer>
  );
}

// ── Landing View ───────────────────────────────────────────────────────────────
function LandingView({ onResult }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const valid = url.trim().length > 10 && isListingUrl(url);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!valid || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await base44.functions.invoke("fetchPropertyFromUrl", { url: url.trim() });
      onResult(res.data.property, url.trim());
    } catch {
      setError("We couldn't read that listing. Please paste the full URL and try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Nav */}
      <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <img
          src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
          alt="BuyWiser"
          className="h-8 w-auto opacity-80"
        />
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-xl">

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-block w-5 h-px bg-blue-300" />
            <p className="text-xs font-bold text-blue-700 tracking-widest uppercase">Veteran Next Home Benefit</p>
            <span className="inline-block w-5 h-px bg-blue-300" />
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 leading-tight tracking-tight text-center">
            Selling Your Home as a Veteran?<br className="hidden sm:block" />
            <span className="text-blue-700"> See What Benefit You May Unlock</span> for Your Next Purchase
          </h1>

          {/* Subheadline */}
          <p className="text-slate-500 text-base mb-6 text-center leading-relaxed">
            Paste your California listing link to get a fast estimate of your possible BuyWiser savings, next-home financing options, and veteran seller-to-buyer advantages.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-blue-700 uppercase tracking-wider mb-1.5">
                Paste Your Listing Link
              </label>
              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(""); }}
                placeholder="Paste Zillow, Redfin, or Realtor.com property link here"
                className="w-full px-4 py-3.5 text-base border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 transition bg-white"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {!valid && url.length > 10 && !isListingUrl(url) && (
              <p className="text-amber-600 text-sm">Please paste a Zillow, Redfin, Realtor.com, Trulia, or Homes.com URL.</p>
            )}

            <button
              type="submit"
              disabled={!valid || loading}
              className="w-full py-4 bg-blue-700 text-white font-bold text-lg rounded-lg hover:bg-blue-800 active:bg-blue-900 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-700/30"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Checking...
                </>
              ) : (
                <>See My Veteran Benefit <ArrowRight className="h-5 w-5" /></>
              )}
            </button>
          </form>

          {/* Trust bullets */}
          <div className="mt-3 flex flex-col sm:flex-row gap-1.5 sm:gap-4 justify-center">
            {[
              "Built for veterans selling and buying again",
              "Works whether your next loan is VA or conventional",
              "No sign-up required just to check"
            ].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{t}
              </span>
            ))}
          </div>

          {/* 3-step strip */}
          <div className="mt-5 flex items-center justify-center gap-1 text-xs text-slate-500 flex-wrap">
            {[["1", "Paste your listing"], ["2", "See your benefit estimate"], ["3", "Get your next-home plan"]].map(([num, label], i, arr) => (
              <span key={num} className="flex items-center gap-1">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full whitespace-nowrap">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{num}</span>
                  {label}
                </span>
                {i < arr.length - 1 && <span className="text-slate-300 text-base px-0.5">→</span>}
              </span>
            ))}
          </div>

          {/* Supporting line */}
          <p className="mt-4 text-center text-sm text-slate-400 italic">Before you buy again, see what advantage may be available.</p>

          {/* ── What Is section ── */}
          <div className="mt-10 border-t border-slate-100 pt-8">
            <h2 className="text-lg font-bold text-slate-900 mb-2 text-center">What Is the Veteran Next Home Benefit?</h2>
            <p className="text-sm text-slate-600 leading-relaxed text-center max-w-md mx-auto">
              This is a BuyWiser planning and savings advantage for veterans who are selling a home and preparing for what comes next. Depending on your situation, your benefit may include a buyer rebate, financing strategy, payment guidance, or a smarter path for your next purchase.
            </p>
          </div>

          {/* ── Built for section ── */}
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900 mb-4">Built for Veteran Sellers Making Their Next Move</h2>
            <ul className="space-y-2.5">
              {[
                "Selling a home and wondering what you can buy next",
                "Unsure whether VA or conventional financing makes more sense",
                "Want to estimate your possible savings before you shop seriously",
                "Looking for a smarter way to plan your next purchase in California",
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Testimonials ── */}
          <div className="mt-8">
            <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Smart California Buyers Have Saved Thousands with BuyWiser</p>
            <Testimonials />
          </div>

          {/* ── Video + Step-by-step ── */}
          <div className="mt-8">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">See How It Works — 1 Minute</p>
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              {/* Video */}
              <div className="lg:w-1/2 flex flex-col">
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-1" style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                  <iframe
                    src="https://app.heygen.com/embeds/6188b66e8ec94d8ab944b2b8d4b533aa"
                    title="How the Veteran Next Home Benefit Works"
                    frameBorder="0"
                    allow="encrypted-media; fullscreen;"
                    allowFullScreen
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-semibold text-slate-700">Watch a 1-minute explanation</p>
                  <p className="text-xs text-slate-400">Bennett Liss — BuyWiser</p>
                </div>
              </div>

              {/* Step-by-step */}
              <div className="lg:w-1/2 flex flex-col justify-center gap-3">
                <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-1">Find your California listing on Zillow, Redfin, or Realtor.com</p>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-blue-600 font-mono truncate shadow-sm">
                      <span className="text-slate-400 flex-shrink-0">🔗</span>
                      zillow.com/homedetails/123-main-st…
                    </div>
                  </div>
                </div>
                <div className="flex justify-center text-slate-300 text-lg">↓</div>
                <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-1">Paste the link to see your veteran benefit estimate</p>
                    <div className="bg-white border-2 border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-500 font-mono shadow-sm">
                      Paste Zillow, Redfin, or Realtor.com URL…
                    </div>
                  </div>
                </div>
                <div className="flex justify-center text-slate-300 text-lg">↓</div>
                <div className="flex items-start gap-3 bg-slate-900 border border-slate-700 rounded-xl p-4">
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">See your estimated next-home advantage</p>
                    <p className="text-xl font-bold text-amber-400">$8,500 – $20,000</p>
                    <p className="text-xs text-slate-400 mt-0.5">~1% of purchase price, credited at closing</p>
                    <p className="text-xs text-slate-500 mt-1.5 leading-snug">Estimate only. Final amount depends on commission offered, lender guidelines, and transaction details.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Credibility section ── */}
          <div className="mt-10 border border-blue-100 bg-blue-50 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900 mb-2">A Practical Advantage, Not a Complicated Process</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              BuyWiser helps veteran homeowners quickly understand what their next-home options may look like before they commit to the next move. The goal is simple: help you see whether there is a meaningful financial or strategic advantage available to you.
            </p>
          </div>

          {/* ── FAQ ── */}
          <div className="mt-10">
            <h2 className="text-base font-bold text-slate-900 mb-4 text-center uppercase tracking-wider text-xs text-slate-500">Common Questions</h2>
            <FAQ />
          </div>

        </div>
      </main>

      <PageFooter />
    </div>
  );
}

// ── Result View ────────────────────────────────────────────────────────────────
function ResultView({ property, listingUrl, onBack }) {
  const rebate = property?.price ? property.price * 0.01 : null;
  const rebateLow = rebate ? formatCurrency(rebate * 0.9) : null;
  const rebateHigh = rebate ? formatCurrency(rebate * 1.1) : null;

  const [showFlow, setShowFlow] = useState(false);
  const [contact, setContact] = useState({ firstName: "", lastName: "", phone: "", email: "" });
  const [contactError, setContactError] = useState("");
  const [showScheduler, setShowScheduler] = useState(false);
  const [done, setDone] = useState(false);
  const [couponValue, setCouponValue] = useState(null);

  const handleContactSubmit = () => {
    if (!contact.firstName || !contact.lastName || !contact.email || !contact.phone) {
      setContactError("All fields are required."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      setContactError("Please enter a valid email address."); return;
    }
    setContactError("");
    setShowScheduler(true);
  };

  const handleAppointmentSuccess = (val) => {
    setCouponValue(val);
    setDone(true);
  };

  const inputCls = "w-full px-3 py-2.5 text-sm border-2 border-slate-200 rounded-md focus:outline-none focus:border-slate-800 transition bg-white";
  const labelCls = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Nav */}
      <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <img
          src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
          alt="BuyWiser"
          className="h-8 w-auto opacity-80"
        />
        <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800 transition font-medium">
          ← Check another property
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-xl space-y-6">

          {/* Result headline */}
          <div>
            <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">Veteran Next Home Benefit</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Your Benefit Estimate</h1>
            <p className="text-slate-500 text-sm">Based on the property listing you submitted.</p>
          </div>

          {/* Property card */}
          {property && (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              {property.image_url && (
                <img src={property.image_url} alt="Property" className="w-full h-44 object-cover" onError={(e) => { e.target.style.display = "none"; }} />
              )}
              <div className="p-4 bg-slate-50">
                <p className="font-semibold text-slate-800 text-sm">
                  {property.address}{property.city ? `, ${property.city}` : ""}{property.state ? `, ${property.state}` : ""}
                </p>
                <div className="flex gap-3 mt-1 flex-wrap">
                  {property.price && <span className="text-sm font-bold text-slate-900">{formatCurrency(property.price)}</span>}
                  {property.beds && <span className="text-xs text-slate-500">{property.beds} bd</span>}
                  {property.baths && <span className="text-xs text-slate-500">{property.baths} ba</span>}
                  {property.sqft && <span className="text-xs text-slate-500">{Number(property.sqft).toLocaleString()} sqft</span>}
                </div>
              </div>
            </div>
          )}

          {/* Benefit result box */}
          <div className="bg-slate-900 text-white rounded-lg p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Estimated Veteran Next Home Advantage</p>
            {rebateLow ? (
              <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                {rebateLow} – {rebateHigh}
              </p>
            ) : (
              <p className="text-2xl font-bold">Savings available — amount based on purchase price</p>
            )}
            <p className="text-slate-400 text-sm mt-2">Approximately 1% of purchase price, credited at closing. Estimate only.</p>
          </div>

          {/* Reminder */}
          <div className="flex items-start gap-2.5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-900 font-medium">
              This advantage should be reserved <strong>before</strong> touring the home. Reserve yours now to lock it in and get your full next-home plan.
            </p>
          </div>

          {/* CTA */}
          {!done && !showFlow && (
            <button
              onClick={() => setShowFlow(true)}
              className="w-full py-4 bg-blue-700 text-white font-semibold text-base rounded-lg hover:bg-blue-800 transition flex items-center justify-center gap-2"
            >
              Reserve My Veteran Benefit &amp; Get My Next-Home Plan <ArrowRight className="h-4 w-4" />
            </button>
          )}

          {/* Contact form */}
          {showFlow && !showScheduler && !done && (
            <div className="border-2 border-slate-900 rounded-lg overflow-hidden">
              <div className="px-5 py-3 bg-slate-900">
                <p className="text-white font-semibold text-sm">Your Contact Information</p>
                <p className="text-slate-400 text-xs mt-0.5">We'll send your benefit summary and scheduling link.</p>
              </div>
              <div className="p-5 space-y-3 bg-white">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>First Name</label>
                    <input type="text" className={inputCls} placeholder="Jane" value={contact.firstName}
                      onChange={(e) => setContact(c => ({ ...c, firstName: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Last Name</label>
                    <input type="text" className={inputCls} placeholder="Smith" value={contact.lastName}
                      onChange={(e) => setContact(c => ({ ...c, lastName: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Email Address</label>
                  <input type="email" className={inputCls} placeholder="jane@email.com" value={contact.email}
                    onChange={(e) => setContact(c => ({ ...c, email: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input type="tel" className={inputCls} placeholder="(818) 555-1234" value={contact.phone}
                    onChange={(e) => setContact(c => ({ ...c, phone: e.target.value }))} />
                </div>
                {contactError && <p className="text-red-600 text-sm font-medium">{contactError}</p>}
                <button onClick={handleContactSubmit}
                  className="w-full py-3.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition">
                  Continue to Schedule a Call →
                </button>
              </div>
            </div>
          )}

          {/* Appointment scheduler */}
          {showScheduler && !done && (
            <AppointmentScheduler
              contact={contact}
              property={property}
              onSuccess={handleAppointmentSuccess}
              onCancel={() => setShowScheduler(false)}
            />
          )}

          {/* Done state */}
          {done && (
            <div className="border border-slate-200 rounded-lg p-6 text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="font-bold text-slate-900 text-lg">Your Benefit Is Reserved</h2>
              <p className="text-slate-500 text-sm">
                Your summary for <strong>{formatCurrency(couponValue)}</strong> has been emailed to {contact.email}. Bennett will be in touch to walk through your next-home plan.
              </p>
              <p className="text-xs text-slate-400">Questions? Call (818) 300-2642 or email bennett@buywiser.com</p>
            </div>
          )}

          {/* Trust line */}
          <p className="text-xs text-slate-400 text-center">
            Powered by BuyWiser. Not a government program. Licensed California mortgage brokerage.<br />
            NMLS #1887767 · CA DRE #01107013
          </p>
        </div>
      </main>

      <PageFooter />
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────
export default function BuywiserHome() {
  const [view, setView] = useState("landing");
  const [property, setProperty] = useState(null);
  const [listingUrl, setListingUrl] = useState("");

  const handleResult = (prop, url) => {
    setProperty(prop);
    setListingUrl(url);
    setView("result");
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setView("landing");
    setProperty(null);
    setListingUrl("");
  };

  if (view === "result") {
    return <ResultView property={property} listingUrl={listingUrl} onBack={handleBack} />;
  }

  return <LandingView onResult={handleResult} />;
}