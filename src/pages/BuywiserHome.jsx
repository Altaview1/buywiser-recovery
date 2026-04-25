import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, ArrowRight, AlertCircle, Quote, ChevronDown, ChevronUp, Tag } from "lucide-react";
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
    q: "Can I keep my current agent?",
    a: "Yes. You do not have to change agents to explore your options."
  },
  {
    q: "How do I receive the full 1.5%?",
    a: "The maximum benefit is typically achieved when BuyWiser coordinates both financing and purchase-side services."
  },
  {
    q: "Are there other options?",
    a: "Yes. Depending on how your transaction is structured, partial benefit options may be available."
  },
  {
    q: "Is this a government benefit?",
    a: "No. This is a private program offered through BuyWiser and participating professionals. It is not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency."
  },
  {
    q: "How much is the benefit?",
    a: "Up to 1.5% toward the purchase price of your next home, depending on how the transaction is structured."
  },
  {
    q: "What is a Personal Benefit Code?",
    a: "A code included in select mailers that allows us to personalize your experience and track your request. It helps us connect your mailed piece to your online review."
  },
  {
    q: "Do I need a code to check my options?",
    a: "No. You can review your options with or without a code. The code simply helps us personalize your results if you received a mailer."
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
        Powered by BuyWiser. The Veteran Home Transition Benefit is a private program benefit — not a government program or official VA benefit.{" "}
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
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    // Pre-fill code from URL param if present
    const params = new URLSearchParams(window.location.search);
    if (params.get("code")) setCode(params.get("code"));
  }, []);

  const valid = url.trim().length > 10 && isListingUrl(url);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!valid || loading) return;
    setLoading(true);
    setError("");
    try {
      // Lookup mailer code if provided
      let matchedCode = null;
      let codeMatched = false;
      if (code.trim()) {
        const codes = await base44.entities.MailerCode.filter({ code: code.trim().toUpperCase() });
        if (codes && codes.length > 0) {
          matchedCode = codes[0];
          codeMatched = true;
        }
      }

      // Create lead record
      const leadData = {
        address_or_link: url.trim(),
        utm_source: code.trim() ? "mailer" : "web",
        ...(code.trim() && { code: code.trim().toUpperCase() }),
        code_matched: codeMatched,
        ...(matchedCode && {
          campaign_id: matchedCode.campaign_id,
          assigned_agent: matchedCode.assigned_agent,
          mailer_code_id: matchedCode.id,
        }),
      };
      await base44.entities.Lead.create(leadData);

      const res = await base44.functions.invoke("fetchPropertyFromUrl", { url: url.trim() });

      // If code matched and has an address but user entered a listing URL, we can augment
      const property = res.data.property;
      if (matchedCode && matchedCode.address && !property?.address) {
        property.address = matchedCode.address;
        property.city = matchedCode.city;
        property.state = matchedCode.state;
      }

      onResult(property, url.trim(), matchedCode);
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

      {/* Red top bar */}
      <div style={{ background: "#cc0000", height: 6, width: "100%" }} />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-xl">

          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-block w-5 h-px" style={{ background: "#cc0000" }} />
            <p className="text-xs font-black tracking-widest uppercase" style={{ color: "#cc0000" }}>How Your Veteran Home Transition Benefit Is Structured</p>
            <span className="inline-block w-5 h-px" style={{ background: "#cc0000" }} />
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 leading-tight tracking-tight text-center">
            Your home is for sale. Before you choose who will represent you on the purchase of your next home, check how the{" "}
            <span style={{ color: "#cc0000" }}>Veteran Home Transition Benefit</span> is structured.
          </h1>

          {/* Subheadline */}
          <div className="mb-4 text-center space-y-3">
            <p className="text-slate-500 text-base leading-relaxed">
              The Veteran Home Transition Benefit can be structured into your next-home purchase — offering up to 1.5% toward your next home.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              The full benefit is typically achieved when your next-home purchase is coordinated through BuyWiser's network, including financing and home search support. Other options may be available depending on how the transaction is structured.
            </p>
          </div>

          {/* Example callout */}
          <div className="mb-3 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-sm text-slate-600">
              <span className="font-semibold text-slate-800">On a $700,000 purchase:</span>
              <span className="font-bold text-blue-700">up to $10,500 toward your next home</span>
            </div>
          </div>

          {/* Supporting line */}
          <p className="text-center text-sm text-slate-500 italic mb-5">Before you commit to buyer representation on your next home, review your options.</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-blue-700 uppercase tracking-wider mb-1.5">
                Check Your Options
              </label>
              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(""); }}
                placeholder="Enter your home address or listing (Zillow, Redfin, etc.)"
                className="w-full px-4 py-3.5 text-base border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 transition bg-white"
              />
              <p className="mt-1.5 text-xs text-slate-400">Already working with an agent? You can request that your agent be reviewed as part of your options.</p>
            </div>

            {/* Optional code field */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-slate-400" />
                Have a Personal Benefit Code? <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your code (e.g., ABX-4729)"
                className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 transition bg-white uppercase tracking-widest"
              />
              <p className="mt-1 text-xs text-slate-400">Found on your mailer — used to personalize your options</p>
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
              className="w-full py-4 font-bold text-lg rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: valid ? "#cc0000" : "#94a3b8", color: "#fff", boxShadow: valid ? "0 8px 24px rgba(204,0,0,0.35)" : "none" }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Checking...
                </>
              ) : (
                <>Check My Options <ArrowRight className="h-5 w-5" /></>
              )}
            </button>
          </form>

          {/* Trust bullets */}
          <div className="mt-3 flex flex-col sm:flex-row gap-1.5 sm:gap-4 justify-center">
            {[
              "Up to 1.5% toward your next home purchase",
              "Works whether your next loan is VA or conventional",
              "Review your options before committing to buyer representation"
            ].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#cc0000" }} />{t}
              </span>
            ))}
          </div>

          {/* 3-step strip */}
          <div className="mt-5 flex items-center justify-center gap-1 text-xs text-slate-500 flex-wrap">
            {[["1", "Enter your home address or listing to review your options"], ["2", "Optionally enter your Personal Benefit Code to personalize your results"], ["3", "See how the benefit is structured"], ["4", "Decide how to move forward based on your priorities"]].map(([num, label], i, arr) => (
              <span key={num} className="flex items-center gap-1">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full whitespace-nowrap">
                  <span className="w-4 h-4 rounded-full bg-slate-700 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">{num}</span>
                  {label}
                </span>
                {i < arr.length - 1 && <span className="text-slate-300 text-base px-0.5">→</span>}
              </span>
            ))}
          </div>

          {/* Supporting line under steps */}
          <p className="mt-4 text-center text-sm text-slate-400 italic">Before you commit to buyer representation on your next home, review your options.</p>

          {/* RWB stripe */}
          <div className="flex mt-10 mb-8 rounded-full overflow-hidden" style={{ height: 6 }}>
            <div style={{ flex: 1, background: "#cc0000" }} />
            <div style={{ flex: 1, background: "#ffffff", border: "1px solid #e2e8f0" }} />
            <div style={{ flex: 1, background: "#1d4ed8" }} />
          </div>

          {/* ── Transition line ── */}
          <p className="text-sm text-slate-500 italic text-center mb-6">Most homeowners never review these options before choosing who represents them on their next home.</p>

          {/* ── Why This Matters ── */}
          <div className="pt-0">
            <h2 className="text-lg font-bold text-slate-900 mb-3 text-center">Why This Matters</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>Selling your current home and buying your next one are two separate transactions.</p>
              <p>Many homeowners assume the same agent relationship will carry forward automatically.</p>
              <p>But how your next-home purchase is structured — including who you work with and how services are coordinated — can affect whether and how the Veteran Home Transition Benefit is included.</p>
            </div>
          </div>

          {/* ── Already Working With an Agent ── */}
          <div className="mt-6 rounded-xl p-5 bg-blue-50 border border-blue-200">
            <h2 className="text-base font-bold text-slate-900 mb-2">Already Working With an Agent?</h2>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed mb-3">You do not have to change agents to explore this benefit.</p>
            <ul className="space-y-2 mb-3">
              {[
                "Your current agent may still be part of your next purchase",
                "Some structures allow flexibility depending on how services are coordinated",
                "The full benefit is typically achieved when your next purchase is coordinated through BuyWiser",
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-500" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-600 italic">Before you commit to buyer representation, it's worth reviewing your options.</p>
          </div>

          {/* ── How the Benefit Is Structured ── */}
          <div className="mt-6 rounded-xl p-5 border border-slate-200 bg-white">
            <h2 className="text-base font-bold text-slate-900 mb-3">How the Benefit Is Structured</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">The Veteran Home Transition Benefit is flexible and depends on how your next-home purchase is structured.</p>
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm font-bold text-amber-800 mb-1">Maximum benefit (up to 1.5%)</p>
                <p className="text-xs text-amber-700">Typically achieved when BuyWiser coordinates both:</p>
                <ul className="mt-1.5 space-y-1">
                  {["Financing", "Purchase-side services"].map(i => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-amber-800"><CheckCircle className="h-3 w-3 flex-shrink-0" />{i}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm font-bold text-slate-700 mb-1">Other options</p>
                <p className="text-xs text-slate-600">Different structures may offer partial benefit depending on participation, services used, and transaction details.</p>
              </div>
            </div>
          </div>

          {/* ── What Is section ── */}
          <div className="mt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2 text-center">What Is the Veteran Home Transition Benefit?</h2>
            <p className="text-sm text-slate-600 leading-relaxed text-center max-w-md mx-auto mb-2">
              The Veteran Home Transition Benefit is a private program benefit offered through BuyWiser for qualifying veterans who are selling their current home and planning another purchase.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed text-center max-w-md mx-auto">
              It is designed to help structure your next-home purchase in a way that provides meaningful financial benefit.
            </p>
          </div>

          {/* ── Built for section ── */}
          <div className="mt-6 rounded-xl p-6" style={{ background: "#fff5f5", border: "1.5px solid #fca5a5" }}>
            <h2 className="text-base font-bold mb-4" style={{ color: "#9b0000" }}>Built for Veteran Homeowners Who Are:</h2>
            <ul className="space-y-2.5">
              {[
                "Selling a home and planning another purchase",
                "Evaluating whether VA or conventional financing makes more sense",
                "Interested in how much benefit may be available",
                "Wanting to make a more informed decision before choosing buyer representation",
              ].map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#cc0000" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Testimonials ── */}
          <div className="mt-8">
            <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Veterans and California Buyers Have Saved Thousands with BuyWiser</p>

            <Testimonials />
          </div>

          {/* ── Video + Step-by-step ── */}
          <div className="mt-8">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">How It Works</p>
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              {/* Video */}
              <div className="lg:w-1/2 flex flex-col">
                <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-1" style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                  <iframe
                    src="https://app.heygen.com/embeds/f235762557ed4a008bfc3951c186107b"
                    title="no caption but best yet circle"
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
                    <p className="text-sm font-semibold text-slate-800 mb-1">Enter your home address or listing to review your options</p>
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
                    <p className="text-sm font-semibold text-slate-800 mb-1">See how the Veteran Home Transition Benefit can be structured</p>
                    <p className="text-xs text-slate-500">Based on your transaction and how services are coordinated</p>
                  </div>
                </div>
                <div className="flex justify-center text-slate-300 text-lg">↓</div>
                <div className="flex items-start gap-3 bg-slate-900 border border-slate-700 rounded-xl p-4">
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <p className="text-sm font-semibold text-white mb-0.5">Decide how to move forward based on your priorities</p>
                    <p className="text-xl font-bold text-amber-400">Up to 1.5% toward your next home</p>
                    <p className="text-xs text-slate-400 mt-0.5">Depending on how the transaction is structured</p>
                    <p className="text-xs text-slate-500 mt-1.5 leading-snug">Final amount depends on eligibility and transaction details.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer CTA strip ── */}
          <div className="mt-10 rounded-xl p-6 text-center" style={{ background: "#0a1f5c" }}>
            <p className="text-white text-sm leading-relaxed mb-4">Before you commit to buyer representation on your next home, review your options.</p>
            <button
              onClick={() => inputRef.current?.focus()}
              className="inline-flex items-center gap-2 px-6 py-3 font-bold rounded-lg text-sm transition"
              style={{ background: "#cc0000", color: "#fff" }}
            >
              Check My Options <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* ── FAQ ── */}
          <div className="mt-10">
            <h2 className="text-base font-bold text-slate-900 mb-4 text-center">Frequently Asked Questions</h2>
            <FAQ />
          </div>

        </div>
      </main>

      <PageFooter />
    </div>
  );
}

// ── Result View ────────────────────────────────────────────────────────────────
function ResultView({ property, listingUrl, matchedCode, onBack }) {
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
            <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">Veteran Home Transition Benefit</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              {matchedCode ? "We've prepared options based on your home." : "Your Benefit Estimate"}
            </h1>
            <p className="text-slate-500 text-sm">
              {matchedCode ? "Your Personal Benefit Code was recognized. Options below have been personalized for your situation." : "Based on the property listing you submitted."}
            </p>
            {matchedCode?.assigned_agent && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                You may continue working with your current agent while reviewing your options.
              </div>
            )}
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
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Estimated Veteran Home Transition Benefit</p>
            <p className="text-xs text-slate-500 mb-3">Up to 1.5% toward your next home, depending on the transaction and participation structure</p>
            {rebateLow ? (
              <p className="text-3xl sm:text-4xl font-bold tracking-tight">
                {rebateLow} – {rebateHigh}
              </p>
            ) : (
              <p className="text-2xl font-bold">Benefit available — amount based on purchase price</p>
            )}
            <p className="text-slate-400 text-sm mt-2">Estimate only. Final amount depends on transaction details, eligibility, and lender guidelines.</p>
          </div>

          {/* Reminder */}
          <div className="flex items-start gap-2.5 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-900 font-medium">
              This benefit should be reserved <strong>before</strong> making an offer. Reserve yours now to lock in your advantage and get your full next-home plan.
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
  const [matchedCode, setMatchedCode] = useState(null);

  const handleResult = (prop, url, codeRecord) => {
    setProperty(prop);
    setListingUrl(url);
    setMatchedCode(codeRecord || null);
    setView("result");
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setView("landing");
    setProperty(null);
    setListingUrl("");
    setMatchedCode(null);
  };

  if (view === "result") {
    return <ResultView property={property} listingUrl={listingUrl} matchedCode={matchedCode} onBack={handleBack} />;
  }

  return <LandingView onResult={handleResult} />;
}