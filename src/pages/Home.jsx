import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { createPageUrl } from "@/utils";
import { usePageTitle } from "@/lib/usePageTitle";
import { CheckCircle, ArrowRight, Phone } from "lucide-react";

const reasons = [
  {
    title: "Lower Monthly Payment",
    text: "A refinance may reduce your monthly payment depending on your rate, balance, loan type, and long-term goals.",
  },
  {
    title: "Access Equity",
    text: "A cash-out refinance can allow you to use home equity for debt consolidation, home improvements, or other financial needs.",
  },
  {
    title: "Remove Mortgage Insurance",
    text: "In some cases, refinancing into a conventional loan can eliminate monthly mortgage insurance and improve overall payment structure.",
  },
  {
    title: "Review FHA or VA Streamline Options",
    text: "If you have an FHA or VA loan, a streamline refinance may offer a simpler path to better terms.",
  },
];

const pillars = [
  {
    title: "Real mortgage review",
    text: "We look at payment, costs, structure, and long-term impact — not just rate.",
  },
  {
    title: "Direct access",
    text: "You work directly with a licensed California mortgage professional.",
  },
  {
    title: "No obligation",
    text: "A review does not commit you to anything.",
  },
];

const bulletPoints = [
  "lower your payment",
  "access cash from equity",
  "remove mortgage insurance",
  "simplify higher-interest debt",
  "review an FHA or VA streamline option",
  "improve the structure of your current mortgage",
];

const steps = [
  {
    num: "1",
    title: "Request a Review",
    text: "Send basic information about your current loan and property.",
  },
  {
    num: "2",
    title: "We Review the Numbers",
    text: "We evaluate refinance options based on your goals, loan type, and available programs.",
  },
  {
    num: "3",
    title: "You Get a Clear Answer",
    text: "We show you whether refinancing appears worthwhile and what the options look like.",
  },
];

const clarityItems = [
  "monthly payment",
  "closing costs",
  "break-even timeline",
  "mortgage insurance",
  "equity access",
  "long-term savings",
  "loan structure",
];

const loanTypes = [
  "Rate-and-term refinance",
  "Cash-out refinance",
  "FHA Streamline",
  "VA Streamline",
];

export default function Home() {
  usePageTitle("BuyWiser Home Loans | Refinance Review for California Homeowners");

  return (
    <div className="bg-white">

      {/* ── SECTION 1: HERO ── */}
      <section className="relative overflow-hidden text-white bg-blue-900">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #93c5fd, transparent)', transform: 'translate(30%, -30%)'}} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #bfdbfe, transparent)', transform: 'translate(-30%, 30%)'}} />
        {/* Couple image */}
        <div className="absolute right-0 bottom-0 hidden lg:block h-full w-1/2 overflow-hidden">
          <img
            src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/cae92ce2f_generated_image.png"
            alt="Happy couple signing loan documents"
            className="object-cover object-left h-full w-full opacity-30"
          />
          <div className="absolute inset-0" style={{background: 'linear-gradient(to right, #1e3a8a 20%, transparent 80%)'}} />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-sky-100 bg-white/15 px-4 py-2 rounded-full mb-6">
              🏠 Serving California Since 1991 · NMLS #1887767
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 text-white">
              Your Personal Mortgage Expert.<br />California's Refinance Specialists.
            </h1>
            <p className="text-lg md:text-xl text-blue-200 leading-relaxed mb-10 max-w-2xl">
              At BuyWiser, you get a dedicated mortgage expert — not a call center. We've been serving California homeowners since 1991, and we shop your loan against 40+ banks and lenders to secure the lowest rate available.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-12">
              <Link
                to={createPageUrl("Contact")}
                className="inline-flex items-center justify-center px-8 py-4 bg-amber-400 text-blue-900 rounded-xl font-bold hover:bg-amber-300 transition text-base shadow-lg"
              >
                Request My Review <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="tel:+18183002642"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/40 text-white rounded-xl font-semibold hover:bg-white/10 transition text-base gap-2"
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {loanTypes.map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm text-blue-200">
                <CheckCircle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                {item}
              </span>
            ))}
            </div>
            <div className="mt-10 border-l-4 border-white/40 pl-5 bg-white/10 rounded-r-xl py-4">
              <p className="text-blue-100 text-sm leading-relaxed italic">
                "Thank goodness BuyWiser locked us in right before the war started — frankly I could point to 10 amazing experiences but getting locked in on time tops everything."
              </p>
              <p className="text-amber-300 text-xs font-semibold mt-2">— Nithesh & Payal · Cerritos, CA</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VA LOAN BANNER ── */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-full bg-red-600/20 border-2 border-red-500/40">
              <Shield className="h-10 w-10 text-red-400" />
            </div>
            <div className="flex-grow text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 text-red-300 text-xs font-bold px-3 py-1 rounded-full mb-2 uppercase tracking-widest">
                🎖️ Veterans &amp; Active Duty
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                VA Streamline Refinance — Lower Your Rate With Zero Hassle
              </h2>
              <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
                If you have an existing VA loan, the VA IRRRL (Interest Rate Reduction Refinance Loan) may let you refinance to a lower rate with no appraisal, no income verification, and minimal paperwork. A benefit you've earned — let's see if it applies to you.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col gap-3 w-full md:w-auto">
              <Link
                to="/VAStreamline"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition text-sm whitespace-nowrap shadow-lg"
              >
                See VA Streamline Details →
              </Link>
              <Link
                to="/Contact"
                className="inline-flex items-center justify-center px-6 py-3.5 border-2 border-slate-500 hover:border-slate-400 text-slate-200 rounded-xl font-semibold transition text-sm whitespace-nowrap"
              >
                Request a VA Review
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: COMMON REASONS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
            Common Reasons Homeowners Refinance
          </h2>
          <p className="text-slate-500 mb-10 text-base">
            A refinance is not the right move for everyone. These are the situations where it often makes sense to take a closer look.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reasons.map((item) => (
            <div key={item.title} className="bg-slate-50 border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-slate-900 mb-2 text-base">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 3: WHY BUYWISER ── */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-5">
              Private Banking Access. Street-Level Expertise.
            </h2>
            <p className="text-blue-200 leading-relaxed text-base mb-4">
              Since 1991, we've operated as a boutique mortgage firm — meaning you work directly with your advisor, not a processing queue. When you come to BuyWiser, a dedicated expert is assigned to your file personally.
            </p>
            <p className="text-blue-200 leading-relaxed text-base mb-4">
              We then go to work on your behalf — shopping your loan against over 40 competing banks and lenders to find the lowest rate and best structure for your specific situation. Large banks give you their rate. We give you the market's best rate.
            </p>
            <p className="text-white font-medium text-base">
              If refinancing helps, we will show you exactly why and by how much.<br />
              If it doesn't, we will tell you that too.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p) => (
              <div key={p.title} className="border border-white/20 rounded-xl p-6 bg-white/10 backdrop-blur">
                <h3 className="font-semibold text-white mb-2">{p.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: WHO THIS IS FOR ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                A Refinance Review May Be Worth It If You Are Trying To:
              </h2>
              <ul className="space-y-3">
                {bulletPoints.map((item) => (
            <li key={item} className="flex items-center gap-3 text-slate-700 text-base">
              <CheckCircle className="h-4 w-4 text-blue-700 flex-shrink-0" />
              {item}
            </li>
          ))}
              </ul>
              <div className="mt-8">
                <Link
                  to={createPageUrl("Contact")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition text-sm"
                >
                  Request My Review <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="bg-slate-50 border border-gray-200 rounded-xl p-7">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Licensed in California</p>
              <div className="space-y-1.5 text-sm text-slate-600">
                <p>Company NMLS: 1887767</p>
                <p>Personal NMLS: 1524446</p>
                <p>Licensed by the DFPI under the CRMLA</p>
              </div>
              <div className="mt-5 pt-5 border-t border-gray-200">
                <p className="text-sm font-medium text-slate-800 mb-3">Get in touch</p>
                <a href="tel:+18183002642" className="flex items-center gap-2 text-blue-700 font-semibold text-sm hover:text-blue-800 transition mb-1">
                  <Phone className="h-4 w-4" />(818) 300-2642
                </a>
                <a href="mailto:bennett@buywiser.com" className="text-xs text-slate-500 hover:text-slate-700 transition">
                  bennett@buywiser.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: HOW IT WORKS ── */}
      <section className="py-20 bg-slate-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: TRUST / CLARITY ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-5">
                Mortgage Guidance Built Around Clarity
              </h2>
              <p className="text-slate-600 leading-relaxed mb-5 text-base">
                Refinancing is not just about getting a lower rate. It is about understanding the total picture:
              </p>
              <ul className="space-y-2 mb-6">
                {clarityItems.map((item) => (
                <li key={item} className="flex items-center gap-2 text-slate-700 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-700 flex-shrink-0" />
                  {item}
                </li>
              ))}
              </ul>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                Our job is to help you evaluate the tradeoffs clearly so you can make an informed decision.
              </p>
            </div>
            <div className="bg-slate-950 text-white rounded-xl p-8">
              <p className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-4">No Obligation</p>
              <p className="text-slate-200 leading-relaxed text-base mb-6">
                A mortgage review gives you information. It does not commit you to anything. There is no cost and no pressure to proceed.
              </p>
              <div className="space-y-3">
                <Link
                  to={createPageUrl("Contact")}
                  className="block w-full text-center px-6 py-3.5 bg-amber-500 text-blue-900 rounded-lg font-bold hover:bg-amber-400 transition text-sm"
                >
                  Request My Review
                </Link>
                <a
                  href="tel:+18183002642"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3.5 border border-slate-700 text-slate-200 rounded-lg font-semibold hover:bg-white/5 transition text-sm"
                >
                  <Phone className="h-4 w-4" /> Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FINAL CTA ── */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-4">🏡</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Request Your Mortgage Review</h2>
          <p className="text-blue-200 text-base leading-relaxed mb-10 max-w-xl mx-auto">
            If you want to know whether refinancing could help, start with a straightforward review of your current loan and options.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={createPageUrl("Contact")}
              className="inline-flex items-center justify-center px-8 py-4 bg-amber-400 text-blue-900 rounded-xl font-bold hover:bg-amber-300 transition text-base shadow-lg"
            >
              Request My Review <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="tel:+18183002642"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition text-base gap-2"
            >
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </div>
          <div className="mt-10 pt-8 border-t border-white/20 text-xs text-blue-300 space-y-1">
            <p>BuyWiser Technology, Inc. DBA BuyWiser Home Loans · NMLS #1887767 · Personal NMLS #1524446</p>
            <p>Licensed by the California DFPI under the CRMLA · Equal Housing Opportunity</p>
          </div>
        </div>
      </section>

    </div>
  );
}