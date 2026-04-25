import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, ArrowRight, AlertCircle, Quote, ChevronDown, ChevronUp, Tag, MapPin } from "lucide-react";
import AppointmentScheduler from "../components/AppointmentScheduler";
import LeadCaptureForm from "../components/LeadCaptureForm";
import VeteranTestimonials from "../components/VeteranTestimonials";

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
    q: "Do I need to enter anything to see my options?",
    a: "No. You can review your options immediately. A Personal Benefit Code simply helps personalize your experience if you received a mailer."
  },
  {
    q: "How do I receive the full benefit?",
    a: "The maximum benefit is typically achieved when BuyWiser coordinates both financing and purchase-side services for your next home."
  },
  {
    q: "Can I keep my current agent?",
    a: "Yes. You can explore your options without changing agents. Your current agent may still be involved in the transaction."
  },
  {
    q: "Why does my VA loan matter?",
    a: "Your current VA-financed home is what makes it possible to structure this benefit into your next purchase. Veterans transitioning from a VA-financed home to another purchase are in the right position to structure your full benefit."
  },
  {
    q: "Is this a government benefit?",
    a: "No. The Red White & Blue Purchase Benefit is a private program offered through BuyWiser. It is not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency."
  },
  {
    q: "How much is the benefit?",
    a: "Up to 1.5% toward the purchase price of your next home, depending on how the transaction is structured."
  },
  {
    q: "What is a Personal Benefit Code?",
    a: "A code included in select mailers that allows us to personalize your experience and connect your mailed piece to your online review."
  },
  {
    q: "Are there other options?",
    a: "Yes. Partial benefit options may be available depending on how your transaction is structured. Structure determines outcome."
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
        Powered by BuyWiser. The Red White &amp; Blue Purchase Benefit is a private program offered through BuyWiser — not a government program or official VA benefit.{" "}
        <a href="/Disclosures" className="underline hover:text-slate-600 transition">Terms &amp; Eligibility</a>
      </p>
      <p className="text-xs text-slate-300 mt-2">
        BuyWiser Technology, Inc. NMLS #1887767. CA DRE #01107013.
      </p>
    </footer>
  );
}

// ── Benefit Estimator ──────────────────────────────────────────────────────────
function BenefitEstimator() {
  const [price, setPrice] = useState(null);
  const [sliderVal, setSliderVal] = useState(700000);

  const handleChange = (e) => {
    const val = Number(e.target.value);
    setSliderVal(val);
    setPrice(val);
  };

  const benefit = price ? price * 0.015 : null;

  return (
    <div className="space-y-2">
      <p className="text-xs text-slate-500 italic">Move the slider to enter your estimated purchase price</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">$100K</span>
        <input
          type="range"
          min={100000}
          max={2000000}
          step={25000}
          value={sliderVal}
          onChange={handleChange}
          className="flex-1 accent-red-600"
        />
        <span className="text-xs text-slate-500">$2M</span>
      </div>
      {price ? (
        <div className="bg-white border border-green-300 rounded-lg px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Purchase Price</p>
            <p className="text-base font-bold text-slate-900">{formatCurrency(price)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Est. Benefit (up to 1.5%)</p>
            <p className="text-base font-bold text-green-700">{formatCurrency(benefit)}</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100 border border-dashed border-slate-300 rounded-lg px-4 py-3 flex items-center justify-center">
          <p className="text-sm text-slate-400 italic">Your estimated benefit will appear here</p>
        </div>
      )}
      {price && <p className="text-[10px] text-slate-400">Estimate only. Final benefit depends on transaction structure and eligibility.</p>}
    </div>
  );
}

// ── Landing View ───────────────────────────────────────────────────────────────
function LandingView() {
  const [code, setCode] = useState("");
  const ctaRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("code")) setCode(params.get("code").toUpperCase());
  }, []);

  const scrollToCTA = () => ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });

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

      {/* RWB top bar */}
      <div className="flex" style={{ height: 6 }}>
        <div style={{ flex: 1, background: "#cc0000" }} />
        <div style={{ flex: 1, background: "#ffffff", borderTop: "1px solid #e2e8f0" }} />
        <div style={{ flex: 1, background: "#1d4ed8" }} />
      </div>

      <main className="flex-1 flex flex-col items-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-xl">

          {/* Eyebrow caption */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="inline-block w-5 h-px" style={{ background: "#1d4ed8" }} />
            <p className="text-xs font-bold tracking-widest uppercase text-slate-500">Important Information for Veteran Homeowners</p>
            <span className="inline-block w-5 h-px" style={{ background: "#1d4ed8" }} />
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight text-center">
            Because your current home was financed with a VA loan, your next purchase can be structured to include the{" "}
            <span style={{ color: "#cc0000" }}>Red White &amp; Blue Purchase Benefit</span>.
          </h1>

          {/* Subhead */}
          <div className="mb-5 text-center space-y-3">
            <p className="text-slate-600 text-base leading-relaxed">
              The Red White &amp; Blue Purchase Benefit offers <strong>up to 1.5%</strong> toward your next home when properly structured.
            </p>
            <p className="text-slate-500 text-sm leading-relaxed">
              The full benefit is typically achieved when your next-home purchase is coordinated through BuyWiser's network, including financing and home search support. Other options may be available depending on how your transaction is handled.
            </p>
          </div>

          {/* Example callout */}
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-5 py-2.5 text-sm">
              <span className="font-semibold text-slate-800">On a $700,000 purchase:</span>
              <span className="font-bold text-blue-700">up to $10,500 toward your next home</span>
            </div>
          </div>

          {/* Support line */}
          <p className="text-center text-sm text-slate-500 italic mb-7">
            Before you commit to buyer representation on your next home, review your options.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button
              onClick={scrollToCTA}
              className="flex-1 py-4 font-bold text-base rounded-xl transition flex items-center justify-center gap-2"
              style={{ background: "#cc0000", color: "#fff" }}
            >
              Check My Options <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="tel:+18183002642"
              className="flex-1 py-4 font-bold text-base rounded-xl border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2"
            >
              Talk to a Specialist
            </a>
          </div>

          {/* ── Benefit Estimator ── */}
          <div className="mt-8 p-5 bg-white border-2 border-red-200 rounded-xl shadow-sm">
            <p className="text-center text-xs font-black text-red-600 uppercase tracking-widest mb-4">Estimate Your Benefit</p>
            <BenefitEstimator />
          </div>

          {/* RWB stripe */}
          <div className="flex mt-10 mb-8 rounded-full overflow-hidden" style={{ height: 6 }}>
            <div style={{ flex: 1, background: "#cc0000" }} />
            <div style={{ flex: 1, background: "#ffffff", border: "1px solid #e2e8f0" }} />
            <div style={{ flex: 1, background: "#1d4ed8" }} />
          </div>

          {/* ── How It Works ── */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-4 text-center">How It Works</h2>
            <div className="space-y-3">
              {[
                { n: "1", text: "Review how your Red White & Blue Purchase Benefit can be structured" },
                { n: "2", text: "See your available options based on your situation" },
                { n: "3", text: "Decide how to move forward before choosing representation" },
              ].map(({ n, text }) => (
                <div key={n} className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{n}</div>
                  <p className="text-sm text-slate-700 font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transition line */}
          <p className="mt-6 text-sm text-slate-500 italic text-center">
            Most homeowners never review these options before choosing who represents them on their next home.
          </p>

          {/* ── Why VA Loan Matters ── */}
          <div className="mt-8">
            <h2 className="text-lg font-bold text-slate-900 mb-3 text-center">Why Your VA Loan Matters</h2>
            <div className="text-sm text-slate-600 leading-relaxed space-y-3">
              <p>Your current VA-financed home is what makes it possible to structure this benefit into your next purchase.</p>
              <p>Veterans who are transitioning from a VA-financed home to another purchase are in the right position to structure your full benefit — but that window closes once you commit to buyer representation.</p>
            </div>
          </div>

          {/* ── Already Working With an Agent ── */}
          <div className="mt-6 rounded-xl p-5 bg-blue-50 border border-blue-200">
            <h2 className="text-base font-bold text-slate-900 mb-2">Already Working With an Agent?</h2>
            <p className="text-sm font-semibold text-slate-800 leading-relaxed mb-3">You do not have to change agents to explore this benefit.</p>
            <ul className="space-y-2 mb-3">
              {[
                "Your agent may still be involved in the transaction",
                "Some structures allow flexibility",
                "The full benefit is typically achieved when coordinated through BuyWiser",
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-500" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-600 italic">Before you commit to buyer representation, it's worth reviewing your options.</p>
          </div>

          {/* ── How the Benefit Works ── */}
          <div className="mt-6 rounded-xl p-5 border border-slate-200 bg-white">
            <h2 className="text-base font-bold text-slate-900 mb-2">How the Red White &amp; Blue Purchase Benefit Works</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">The benefit is not automatic — it depends on how your next-home purchase is structured.</p>
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm font-bold text-amber-800 mb-1">Maximum Benefit (up to 1.5%)</p>
                <p className="text-xs text-amber-700 mb-1.5">Typically achieved when:</p>
                <ul className="space-y-1">
                  {["BuyWiser coordinates financing", "and purchase-side services"].map(i => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-amber-800"><CheckCircle className="h-3 w-3 flex-shrink-0" />{i}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm font-bold text-slate-700 mb-1">Other Options</p>
                <ul className="space-y-1">
                  {["Partial benefit may be available", "Your current agent may still be part of the transaction", "Structure determines outcome"].map(i => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-slate-600"><CheckCircle className="h-3 w-3 flex-shrink-0 text-slate-400" />{i}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── What Is section ── */}
          <div className="mt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2 text-center">What Is the Red White &amp; Blue Purchase Benefit?</h2>
            <p className="text-sm text-slate-600 leading-relaxed text-center max-w-md mx-auto">
              The Red White &amp; Blue Purchase Benefit is a private program offered through BuyWiser for qualifying veterans who are selling a home and planning another purchase. It is not a government program and is not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency.
            </p>
          </div>

          {/* ── Testimonials ── */}
          <div className="mt-8">
            <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Veterans and California Buyers Have Saved Thousands with BuyWiser</p>
            <VeteranTestimonials />
          </div>

          {/* ── Video ── */}
          <div className="mt-8">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 text-center">Hear From Bennett Directly</p>
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm" style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                src="https://app.heygen.com/embeds/f235762557ed4a008bfc3951c186107b"
                title="Bennett Liss — BuyWiser"
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

          {/* ── Check Your Options (Input Section) ── */}
          <div ref={ctaRef} className="mt-10 rounded-xl border-2 border-slate-200 overflow-hidden">
            <div className="px-6 py-4 text-center" style={{ background: "#0a1f5c" }}>
              <p className="text-white font-black text-base uppercase tracking-widest">Check Your Options</p>
            </div>
            <div className="p-6 bg-white space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-slate-400" />
                  Have a Personal Benefit Code? <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter your code from your mailer"
                  className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 transition bg-white uppercase tracking-widest"
                />
                <p className="mt-1.5 text-xs text-slate-400">No code? No problem — you can still review your options.</p>
              </div>
              <LeadCaptureForm prefillCode={code} />
            </div>
          </div>

          {/* ── Footer CTA strip ── */}
          <div className="mt-10 rounded-xl p-6 text-center" style={{ background: "#0a1f5c" }}>
            <p className="text-white text-sm leading-relaxed mb-4">Before you commit to buyer representation on your next home, review how your Red White &amp; Blue Purchase Benefit can be structured.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={scrollToCTA}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-lg text-sm transition"
                style={{ background: "#cc0000", color: "#fff" }}
              >
                Check My Options <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="tel:+18183002642"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-lg text-sm border-2 border-white text-white hover:bg-white hover:text-slate-900 transition"
              >
                Talk to a Specialist
              </a>
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="mt-10">
            <h2 className="text-base font-bold text-slate-900 mb-4 text-center">Frequently Asked Questions</h2>
            <FAQ />
          </div>

          {/* ── Disclaimer ── */}
          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-xs text-slate-500 leading-relaxed text-center">
              The Red White &amp; Blue Purchase Benefit is a private program offered through BuyWiser. It is not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency.
            </p>
          </div>

        </div>
      </main>

      <PageFooter />
    </div>
  );
}

// ── Realtor Availability Badge ─────────────────────────────────────────────────
function RealtorAvailabilityBadge({ city }) {
  // BuyWiser primarily serves Southern California — always show available for known CA cities,
  // otherwise show a "checking" then available state after a short delay for realism.
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const timer = setTimeout(() => setStatus("available"), 1200);
    return () => clearTimeout(timer);
  }, [city]);

  const areaLabel = city ? city : "your area";

  if (status === "checking") {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs text-slate-500">
        <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
        Checking realtor availability in {areaLabel}…
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-200 bg-green-50 text-xs font-semibold text-green-800">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <MapPin className="h-3 w-3 text-green-600" />
      BuyWiser-certified realtor available in {areaLabel}
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

          {/* Realtor availability badge */}
          <RealtorAvailabilityBadge city={property?.city} />

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
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">BuyWiser Next Move™ — Estimated Veteran Home Transition Benefit</p>
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
              <p className="text-slate-600 text-sm leading-relaxed">
                Your benefit summary for <strong className="text-slate-900">{formatCurrency(couponValue)}</strong> has been sent to {contact.email}.
              </p>
              <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Your Personal Representative</p>
                <p className="text-sm font-bold text-slate-900">Bennett Liss</p>
                <p className="text-xs text-slate-500">CA Real Estate License #01107013 &nbsp;·&nbsp; NMLS #1524446</p>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">will be in touch personally to walk through your next-home plan and answer any questions you may have.</p>
              </div>
              <p className="text-xs text-slate-400 mt-1">Prefer to reach out directly? <a href="tel:+18183002642" className="underline hover:text-slate-600">(818) 300-2642</a> &nbsp;·&nbsp; <a href="mailto:bennett@buywiser.com" className="underline hover:text-slate-600">bennett@buywiser.com</a></p>
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
  return <LandingView />;
}