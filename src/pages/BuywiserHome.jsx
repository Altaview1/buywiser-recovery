import { useState, useRef, useEffect } from "react";
import { CheckCircle, ArrowRight, ChevronDown, ChevronUp, Tag, Shield, Home, Search, FileText, DollarSign, Users, Briefcase } from "lucide-react";
import LeadCaptureForm from "../components/LeadCaptureForm";
import VeteranTestimonials from "../components/VeteranTestimonials";
import VideoTestimonial from "../components/VideoTestimonial";

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
    a: "No. Veteran's Next Home™ and the Red White & Blue Purchase Benefit are private Buywiser programs. They are not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency."
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

function BenefitEstimator() {
  const [sliderVal, setSliderVal] = useState(700000);
  const benefit = sliderVal * 0.015;

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 italic text-center">Move the slider to estimate your benefit</p>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 w-10 text-right">$100K</span>
        <input
          type="range"
          min={100000}
          max={2000000}
          step={25000}
          value={sliderVal}
          onChange={(e) => setSliderVal(Number(e.target.value))}
          className="flex-1"
          style={{ accentColor: RED }}
        />
        <span className="text-xs text-slate-400 w-8">$2M</span>
      </div>
      <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">Purchase Price</p>
          <p className="text-lg font-bold text-slate-900">{formatCurrency(sliderVal)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 mb-0.5">Est. Benefit (up to 1.5%)</p>
          <p className="text-lg font-bold" style={{ color: RED }}>{formatCurrency(benefit)}</p>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 text-center">Estimate only. Final benefit depends on transaction structure and qualifying details.</p>
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
        Veteran's Next Home™ and the Red White &amp; Blue Purchase Benefit are private programs offered through Buywiser. They are not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency. Benefit amounts depend on transaction structure and qualifying details.{" "}
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
  const ctaRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("code")) setCode(params.get("code").toUpperCase());
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
      <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
        <img
          src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
          alt="BuyWiser"
          className="h-8 w-auto opacity-80"
        />
        <a href="tel:+18183002642" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition hidden sm:block">
          (818) 300-2642
        </a>
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
            Buywiser Veteran's Next Home™ Benefit —{" "}
            <span style={{ color: "#ef9a9a" }}>Up to 1.5% Cash Back.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-6 max-w-xl mx-auto">
            <span className="text-white font-bold">If the home you're selling has a VA loan — you may qualify for the Veteran's Next Home™ Program.</span> Up to 1.5% cash back when your next purchase is coordinated through Buywiser.
          </p>

          {/* Cody & Frank callout */}
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-5 py-3 mb-6 mx-auto max-w-xl">
            <span className="text-2xl">🎖️</span>
            <p className="text-sm text-left leading-snug">
              <span className="text-white font-black">See how Navy Veterans Cody &amp; Frank</span>
              <span className="text-blue-200"> put </span>
              <span className="font-black" style={{ color: "#fbbf24" }}>$9,500 back in their pocket</span>
              <span className="text-blue-200"> on their next home purchase using the Red White &amp; Blue Benefit.</span>
              <span className="block text-xs text-blue-400 mt-1 italic">Watch their story below ↓</span>
            </p>
          </div>

          {/* Support line */}
          <p className="text-blue-300 text-sm italic mb-8">
            Before major next-home decisions are finalized, start your Veteran's Next Home™ Review.
          </p>

          {/* CTAs */}
          <div className="flex justify-center">
            <button
              onClick={scrollToCTA}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition"
              style={{ background: RED, color: "#fff" }}
            >
              Start My Next Home Review <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Video Testimonial */}
          <div className="mt-12 max-w-2xl mx-auto w-full">
            <VideoTestimonial />
            <p className="text-center text-sm font-bold text-slate-700 mt-3 uppercase tracking-wide">Veterans Cody and Frank</p>
          </div>
        </div>
      </section>

      <RWBStripe />

      {/* ── Benefit Estimator ── */}
      <section className="px-4 py-12 bg-slate-50">
        <div className="max-w-lg mx-auto">
          <p className="text-center text-xs font-black uppercase tracking-widest mb-5" style={{ color: RED }}>
            Estimate Your Red White &amp; Blue Purchase Benefit
          </p>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <BenefitEstimator />
          </div>
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
                desc: "Buywiser coordinates home search support, touring access, offer strategy, financing, and transaction support."
              },
              {
                n: "3",
                title: "Maximize your Red White & Blue Purchase Benefit",
                desc: "When properly structured through Buywiser, the benefit can provide up to 1.5% back toward your next home."
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
          <h2 className="text-2xl font-extrabold text-center mb-4" style={{ color: NAVY }}>The Red White &amp; Blue Purchase Benefit</h2>
          <p className="text-sm text-slate-600 leading-relaxed text-center mb-8 max-w-md mx-auto">
            A private Buywiser benefit for qualifying veteran homeowners selling a VA-financed home and purchasing another. Not a government program.
          </p>

          <div className="bg-white border-2 rounded-2xl px-6 py-5 flex items-center justify-between" style={{ borderColor: RED }}>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color: RED }}>Maximum Benefit</p>
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
            Buywiser modernizes the next-home process for veteran homeowners — coordinating the professional pieces that still matter.
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
          <h2 className="text-2xl font-extrabold text-center mb-6" style={{ color: NAVY }}>Built for Veterans Making Their Next Move</h2>
          <div className="space-y-2.5">
            {[
              "Selling a home financed with a VA loan",
              "Planning to buy another home",
              "Comparing VA and conventional financing options",
              "Interested in receiving a meaningful purchase benefit",
              "Open to a modern, efficient next-home process",
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
              <p className="text-white font-black text-base uppercase tracking-widest">Start Your Veteran's Next Home™ Review</p>
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
                <p className="mt-1.5 text-xs text-slate-400">No code? No problem. You can still start your Veteran's Next Home™ Review.</p>
              </div>
              <LeadCaptureForm prefillCode={code} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer CTA Banner ── */}
      <section className="px-4 py-12" style={{ background: NAVY }}>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-white text-sm leading-relaxed mb-5 max-w-md mx-auto">
            Before major next-home decisions are finalized, review how Buywiser can structure your Red White &amp; Blue Purchase Benefit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={scrollToCTA}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 font-bold rounded-xl text-sm transition"
              style={{ background: RED, color: "#fff" }}
            >
              Start My Next Home Review <ArrowRight className="h-4 w-4" />
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
              Veteran's Next Home™ and the Red White &amp; Blue Purchase Benefit are private programs offered through Buywiser. They are not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency.
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