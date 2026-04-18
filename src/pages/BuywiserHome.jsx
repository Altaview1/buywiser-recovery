import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, ArrowRight, Lock, AlertCircle, Quote } from "lucide-react";
import AppointmentScheduler from "../components/AppointmentScheduler";

// ── Testimonials ───────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { quote: "We used the rebate finder and saved", highlight: "$12,000", quoteSuffix: " on our home purchase. Best thing we ever did.", name: "Hal & Marjie", location: "Oxnard, CA" },
  { quote: "We reserved rebates on 7 houses and ended up with a", highlight: "$13,000 savings", quoteSuffix: ".", name: "Chris K.", location: "Studio City, CA" },
  { quote: "It's the easiest money we ever made.", highlight: null, quoteSuffix: "", name: "Dor S.", location: "Santa Monica, CA" },
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
        Powered by BuyWiser. Private rebate lookup, not affiliated with the State of California.{" "}
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
      <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-end">
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl">
          {/* Headline */}
          <p className="text-sm font-semibold text-blue-700 mb-2 tracking-wide text-center uppercase">California Buyer Rebate</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 leading-tight tracking-tight text-center">
            Paste Any California Listing<br className="hidden sm:block" /> and See Your Buyer Rebate
          </h1>
          <p className="text-slate-500 text-base mb-4 text-center">
            Paste a Zillow, Redfin, or Realtor.com link to instantly see your estimated California buyer rebate.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Paste Listing Link
              </label>
              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(""); }}
                placeholder="Paste Zillow, Redfin, or Realtor.com property link here"
                className="w-full px-4 py-3.5 text-base border-2 border-slate-200 rounded-lg focus:outline-none focus:border-slate-800 transition bg-white"
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
                <>See My Rebate <ArrowRight className="h-5 w-5" /></>
              )}
            </button>
          </form>

          {/* Trust lines */}
          <div className="mt-2 flex flex-col sm:flex-row gap-1.5 sm:gap-5 justify-center">
            {["Fast free estimate for California buyers", "Works with Zillow, Redfin, and Realtor.com", "No signup required just to check"].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{t}
              </span>
            ))}
          </div>

          {/* Quick clarity strip */}
          <div className="mt-4 flex items-center justify-center gap-1 text-xs text-slate-500">
            {[["1", "Paste the link"], ["2", "See your estimate"], ["3", "Get exact numbers if you want"]].map(([num, label], i, arr) => (
              <>
                <span key={num} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full whitespace-nowrap">
                  <span className="w-4 h-4 rounded-full bg-slate-300 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{num}</span>
                  {label}
                </span>
                {i < arr.length - 1 && <span key={`arrow-${num}`} className="text-slate-300 text-base">→</span>}
              </>
            ))}
          </div>

          {/* Pre-tour nudge */}
          <p className="mt-4 text-center text-sm text-slate-500 italic">Before you tour a home, check the rebate.</p>



          {/* Testimonials */}
          <div className="mt-8">
            <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Real buyers have saved thousands</p>
            <Testimonials />
          </div>

          {/* Video + Steps */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">See How It Works — 1 Minute</p>
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              {/* Video */}
              <div className="lg:w-1/2 flex flex-col">
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-1" style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                  <iframe
                    src="https://app.heygen.com/embeds/6188b66e8ec94d8ab944b2b8d4b533aa"
                    title="How the Rebate Finder Works"
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

              {/* Step-by-step guide */}
              <div className="lg:w-1/2 flex flex-col justify-center gap-3">
                {/* Step 1 */}
                <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-1">Find a home on Zillow, Redfin, or Realtor.com</p>
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-blue-600 font-mono truncate shadow-sm">
                      <span className="text-slate-400 flex-shrink-0">🔗</span>
                      zillow.com/homedetails/123-main-st…
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-slate-300 text-lg">↓</div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 mb-1">Copy and paste the link into the Rebate Finder</p>
                    <div className="bg-white border-2 border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-500 font-mono shadow-sm">
                      Paste Zillow, Redfin, or Realtor.com URL…
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-slate-300 text-lg">↓</div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 bg-slate-900 border border-slate-700 rounded-xl p-4">
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">See your estimated rebate instantly</p>
                    <p className="text-xl font-bold text-amber-400">$8,500 – $20,000</p>
                    <p className="text-xs text-slate-400 mt-0.5">~1% of purchase price, credited at closing</p>
                    <p className="text-xs text-slate-500 mt-1.5 leading-snug">Estimate only. Final amount depends on commission offered, lender guidelines, and transaction details.</p>
                  </div>
                </div>
              </div>
            </div>
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

  // Contact info step
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
      <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-end">
        <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800 transition font-medium">
          ← Check another property
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-xl space-y-6">

          {/* Result headline */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Your Rebate Result</h1>
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

          {/* Rebate result box */}
          <div className="bg-slate-900 text-white rounded-lg p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Estimated Buyer Rebate</p>
            {rebateLow ? (
              <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                {rebateLow} – {rebateHigh}
              </p>
            ) : (
              <p className="text-2xl font-bold">Rebate available — amount based on purchase price</p>
            )}
            <p className="text-slate-400 text-sm mt-2">Approximately 1% of purchase price, credited at closing.</p>
          </div>

          {/* Reminder */}
          <div className="flex items-start gap-2.5 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800 font-medium">
              The rebate must be reserved <strong>before</strong> touring the home. Reserve yours now to lock it in.
            </p>
          </div>

          {/* CTA / Flow */}
          {!done && !showFlow && (
            <button
              onClick={() => setShowFlow(true)}
              className="w-full py-4 bg-slate-900 text-white font-semibold text-base rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-2"
            >
              Reserve Your Rebate &amp; Learn Next Steps <ArrowRight className="h-4 w-4" />
            </button>
          )}

          {/* Contact form */}
          {showFlow && !showScheduler && !done && (
            <div className="border-2 border-slate-900 rounded-lg overflow-hidden">
              <div className="px-5 py-3 bg-slate-900">
                <p className="text-white font-semibold text-sm">Your Contact Information</p>
                <p className="text-slate-400 text-xs mt-0.5">We'll send your rebate certificate and scheduling link.</p>
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
                  Continue to Schedule Tour →
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
              <h2 className="font-bold text-slate-900 text-lg">Your Rebate is Reserved!</h2>
              <p className="text-slate-500 text-sm">
                Your certificate for <strong>{formatCurrency(couponValue)}</strong> has been emailed to {contact.email}. Bennett will contact you to confirm your tour.
              </p>
              <p className="text-xs text-slate-400">Questions? Call (818) 300-2642 or email bennett@buywiser.com</p>
            </div>
          )}

          {/* Trust line */}
          <p className="text-xs text-slate-400 text-center">
            Powered by BuyWiser. Licensed and trusted, we'll guide you on the next steps.<br />
            Not affiliated with the State of California.
          </p>
        </div>
      </main>

      <PageFooter />
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────
export default function BuywiserHome() {
  const [view, setView] = useState("landing"); // "landing" | "result"
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