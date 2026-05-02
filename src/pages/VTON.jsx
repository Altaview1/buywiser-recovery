import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight, Check, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PartnerPreScreenQuiz from "../components/vton/PartnerPreScreenQuiz";

const NAVY = "#0B1F3B";
const RED = "#C62828";
const GRAY = "#F5F7FA";

function RWBStripe() {
  return (
    <div className="flex" style={{ height: 5 }}>
      <div style={{ flex: 1, background: RED }} />
      <div style={{ flex: 1, background: "#ffffff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }} />
      <div style={{ flex: 1, background: NAVY }} />
    </div>
  );
}

function Badge({ label }) {
  return (
    <span className="inline-block px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full border"
      style={{ borderColor: "rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.8)", background: "rgba(255,255,255,0.08)" }}>
      {label}
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: RED }}>{children}</p>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  const items = [
    { q: "What is VTON?", a: "VTON stands for Veteran Transition Opportunity Network. It is a territory-based system for identifying and activating veteran homeowner transition opportunities." },
    { q: "Is this just a lead-buying program?", a: "No. VTON uses a rolling $2,000 performance deposit—not a per-lead fee. You receive $200 credits for each verified conversation. If you create 10 verified conversations, your deposit is fully credited back. No leads are charged for; performance is rewarded." },
    { q: "What is the $2,000 deposit?", a: "It is a rolling performance deposit used to activate territory access. Partners receive a $200 credit for each verified homeowner conversation." },
    { q: "What counts as a verified conversation?", a: "A verified conversation requires actual homeowner contact plus QR scan or code entry, CRM notes, and logged outcome data." },
    { q: "What happens if I work the leads?", a: "If you create verified conversations, your deposit is credited back at $200 per conversation." },
    { q: "What happens if I do not work the leads?", a: "Territory access may be paused or reassigned." },
    { q: "Does VTON guarantee closings?", a: "No. VTON provides structured opportunities, not guaranteed transactions." },
    { q: "What does VTON receive on closed deals?", a: "VTON receives 10% of commission income actually received on closed transactions arising from VTON opportunities, plus Buywiser retains mortgage opportunity where applicable." },
    { q: "Is this connected to the VA?", a: "No. VTON, Veteran's Next Home™, and the Red White & Blue Purchase Benefit are private Buywiser-related programs and are not affiliated with or endorsed by the U.S. Department of Veterans Affairs." },
  ];

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition">
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

function ApplyForm() {
  const [step, setStep] = useState("quiz"); // "quiz" or "form"
  const [form, setForm] = useState({ name: "", email: "", phone: "", market: "" });
  const [submitted, setSubmitted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  const handleQuizComplete = (answers) => {
    setQuizAnswers(answers);
    setStep("form");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await base44.entities.PartnerApplication.create({
        name: form.name,
        email: form.email,
        phone: form.phone,
        market: form.market,
        status: "pending",
        quiz_passed: true,
        quiz_answers: quizAnswers,
      });

      // Book interview slot automatically
      await base44.functions.invoke('bookInterviewSlot', {
        partner_email: form.email,
        partner_name: form.name,
        partner_phone: form.phone,
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      setSubmitted(true); // Still show success even if booking fails, they'll be contacted
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(255,255,255,0.15)" }}>
          <Check className="h-6 w-6 text-white" />
        </div>
        <p className="text-white font-bold text-lg mb-1">Application Received</p>
        <p className="text-blue-200 text-sm">We'll be in touch within one business day to discuss your territory potential.</p>
      </div>
    );
  }

  if (step === "quiz") {
    return (
      <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
        <PartnerPreScreenQuiz onComplete={handleQuizComplete} />
      </div>
    );
  }

  const inputCls = "w-full px-4 py-3 text-sm rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input required className={inputCls} placeholder="Full Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <input required type="email" className={inputCls} placeholder="Email Address *" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input required type="tel" className={inputCls} placeholder="Phone Number *" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        <input className={inputCls} placeholder="Target Market / City" value={form.market} onChange={e => setForm(f => ({ ...f, market: e.target.value }))} />
      </div>
      <button type="submit" className="w-full py-4 font-bold text-base rounded-xl transition flex items-center justify-center gap-2"
        style={{ background: RED, color: "#fff" }}>
        Apply for Territory Access <ArrowRight className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => setStep("quiz")} className="w-full py-2 text-sm text-white/60 hover:text-white/80 transition">
        ← Back to Pre-Screen
      </button>
    </form>
  );
}

export default function VTON() {
  const scrollToApply = () => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });

  const steps = [
    { n: "1", title: "You secure territory access", desc: "Approved partners place a rolling performance deposit to activate their market." },
    { n: "2", title: "VTON assigns veteran transition opportunities", desc: "You receive identified homeowner opportunities in your territory." },
    { n: "3", title: "You create verified conversations", desc: "Each verified homeowner conversation is tracked by QR code, rep code, CRM notes, and outcome data." },
    { n: "4", title: "You earn the upside", desc: "You convert qualified homeowners into buyer opportunities while VTON/Buywiser participates through mortgage opportunities and backend transaction economics." },
  ];

  const provides = [
    "Territory opportunity access",
    "Identified veteran-transition homeowner records",
    "QR-code validation system",
    "Rep-specific tracking codes",
    "Door scripts",
    "Leave-behind copy",
    "CRM outcome tracking",
    "Veteran's Next Home™ consumer messaging",
    "Red White & Blue Purchase Benefit framework",
    "Buywiser mortgage support where applicable",
  ];

  const forAgents = [
    "Comfortable knocking doors",
    "Can follow a script",
    "Want a differentiated veteran homeowner niche",
    "Understand speed matters",
    "Want protected territory upside",
    "Willing to document activity",
    "Believe they can convert real conversations into clients",
  ];

  const notFor = [
    "Passive agents",
    "Agents who only want internet leads",
    "Agents unwilling to door knock",
    "Agents who will not follow the VTON protocol",
  ];

  const pilots = ["Denver", "Colorado Springs", "San Antonio", "Jacksonville", "Hampton Roads", "Phoenix"];

  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <header className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-8 w-auto opacity-80" />
          <div className="h-5 w-px bg-slate-200" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-500">VTON</span>
        </div>
        <button onClick={scrollToApply} className="px-5 py-2.5 text-sm font-bold rounded-xl text-white transition" style={{ background: NAVY }}>
          Apply for Territory Access
        </button>
      </header>

      <RWBStripe />

      {/* Hero */}
      <section style={{ background: NAVY }} className="px-4 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-7">
            <Badge label="VTON" />
            <Badge label="Veteran Transition Opportunity Network" />
            <Badge label="Veteran's Next Home™" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            Own a Veteran Transition Territory in Your Market
          </h1>
          <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-4 max-w-2xl mx-auto">
            Get access to identified veteran homeowners who are selling VA-financed homes and may be preparing for their next purchase.
          </p>
          <p className="text-blue-300 text-sm italic mb-10 max-w-xl mx-auto">
            This is not random door knocking. These are time-triggered, property-based veteran transition opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={scrollToApply} className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition" style={{ background: RED, color: "#fff" }}>
              Apply for Territory Access <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#how-it-works" className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base border-2 border-white/30 text-white hover:bg-white/10 transition">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      <RWBStripe />

      {/* Why This Is Different */}
      <section className="px-4 py-16" style={{ background: GRAY }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Why This Is Different</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-5" style={{ color: NAVY }}>
            Not Internet Leads. Not Cold Farming. Structured Transition Opportunities.
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Most agents spend time chasing broad online leads, cold homeowners, or generic buyer inquiries. VTON focuses on a narrower, higher-intent category:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              "Homeowners with listed properties",
              "VA-financed home sale triggers",
              "Likely next-home transition timing",
              "Veteran-focused benefit messaging",
              "Field outreach supported by QR validation and Buywiser infrastructure",
            ].map(item => (
              <div key={item} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: RED }} />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border-l-4 rounded-xl px-5 py-4" style={{ borderLeftColor: NAVY }}>
            <p className="text-sm text-slate-700 font-semibold">
              You are not knocking random doors. You are working a targeted veteran-transition opportunity lane.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Process</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8" style={{ color: NAVY }}>How VTON Territory Access Works</h2>
          <div className="space-y-4">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="flex gap-4 border border-slate-200 rounded-2xl px-5 py-4 bg-white">
                <div className="w-9 h-9 rounded-full text-white text-sm font-black flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: NAVY }}>
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

      {/* Rolling Performance Deposit */}
      <section className="px-4 py-16" style={{ background: GRAY }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Performance Deposit</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-5" style={{ color: NAVY }}>A Deposit That Rewards Execution</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            VTON partners place a <strong>$2,000 rolling performance deposit</strong>. This is not a simple lead fee. It is a performance commitment.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Deposit Amount", value: "$2,000", sub: "To activate territory" },
              { label: "Credit Per Conversation", value: "$200", sub: "Per verified homeowner" },
              { label: "Conversations to Full Credit", value: "10", sub: "Fully credits deposit" },
            ].map(card => (
              <div key={card.label} className="bg-white border-2 border-slate-200 rounded-2xl px-5 py-5 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{card.label}</p>
                <p className="text-3xl font-black mb-0.5" style={{ color: NAVY }}>{card.value}</p>
                <p className="text-xs text-slate-500">{card.sub}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mb-4">Territory access continues while the partner follows the outreach protocol and maintains an active balance.</p>
          <div className="bg-white border-l-4 rounded-xl px-5 py-4" style={{ borderLeftColor: RED }}>
            <p className="text-sm font-bold" style={{ color: RED }}>Your real risk is not money. Your real requirement is execution.</p>
          </div>
        </div>
      </section>

      {/* Verified Conversations */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Verification</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-5" style={{ color: NAVY }}>Verified Conversations, Not Guesswork</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">A verified conversation requires:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              "Actual homeowner or decision-maker contact",
              "Rep-specific QR scan or code entry",
              "CRM visit note",
              "Date/time logged",
              "Basic outcome selected",
            ].map(item => (
              <div key={item} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: NAVY }} />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            This protects both sides. The partner gets credit for real work. VTON gets clean data and trackable opportunity creation.
          </p>
        </div>
      </section>

      {/* Economics */}
      <section className="px-4 py-16" style={{ background: GRAY }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Economics</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6" style={{ color: NAVY }}>Partner Economics</h2>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: NAVY }}>
                  <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-white/70">Event</th>
                  <th className="text-left px-5 py-3 text-xs font-black uppercase tracking-widest text-white/70">Partner Benefit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Verified conversation", "$200 deposit credit"],
                  ["Completed buyer consultation", "Opportunity advancement"],
                  ["Closed real estate transaction", "Partner earns commission, subject to VTON participation"],
                  ["Buywiser mortgage opportunity", "Buywiser retains mortgage opportunity where applicable"],
                ].map(([event, benefit], i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-5 py-3.5 font-medium text-slate-800 border-t border-slate-100">{event}</td>
                    <td className="px-5 py-3.5 text-slate-600 border-t border-slate-100">{benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 bg-white border border-slate-200 rounded-xl px-5 py-4">
            <p className="text-xs text-slate-500 leading-relaxed">
              On closed real estate deals created from VTON opportunities, VTON receives <strong className="text-slate-700">10% of commission income</strong> actually received by the partner side, plus Buywiser retains the opportunity to provide financing where applicable.
            </p>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Who This Is For</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8" style={{ color: NAVY }}>
            Built for Hungry Agents Who Will Actually Work the Opportunity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">This is for agents who:</p>
              <div className="space-y-2">
                {forAgents.map(item => (
                  <div key={item} className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <Check className="h-4 w-4 flex-shrink-0 mt-0.5 text-green-600" />
                    <p className="text-sm text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: RED }}>Not for:</p>
              <div className="space-y-2">
                {notFor.map(item => (
                  <div key={item} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    <X className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-400" />
                    <p className="text-sm text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 border-l-4 rounded-xl px-5 py-4 bg-slate-50" style={{ borderLeftColor: NAVY }}>
            <p className="text-sm font-bold text-slate-800 italic">
              "The agent we want thinks: Give me the qualified doors. I'll create the conversations."
            </p>
          </div>
        </div>
      </section>

      {/* Why Agents Should Care */}
      <section className="px-4 py-14" style={{ background: GRAY }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Opportunity</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-5" style={{ color: NAVY }}>A Better Side Hustle Than Random Prospecting</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            A strong VTON partner is not driving around aimlessly or knocking random doors. They are working identified opportunities where:
          </p>
          <div className="space-y-2.5 mb-6">
            {[
              "The homeowner is selling",
              "The property is connected to VA financing",
              "Timing matters",
              "The next purchase may still be undecided",
              "The Red White & Blue Purchase Benefit gives them a reason to listen",
            ].map(item => (
              <div key={item} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5">
                <Check className="h-4 w-4 flex-shrink-0" style={{ color: RED }} />
                <p className="text-sm text-slate-700 font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What VTON Provides */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>What You Get</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8" style={{ color: NAVY }}>What You Get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {provides.map(item => (
              <div key={item} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: NAVY }} />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pilot Markets */}
      <section className="px-4 py-16" style={{ background: NAVY }}>
        <div className="max-w-3xl mx-auto text-center">
          <SectionLabel>Availability</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Pilot Territories Opening Soon</h2>
          <p className="text-blue-200 text-sm mb-8 max-w-xl mx-auto">
            VTON is currently evaluating select pilot territories in veteran-heavy markets.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {pilots.map(city => (
              <span key={city} className="px-4 py-2 rounded-full text-sm font-semibold border border-white/20 text-white bg-white/10">
                {city}
              </span>
            ))}
          </div>
          <button onClick={scrollToApply} className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl text-base transition" style={{ background: RED, color: "#fff" }}>
            Apply for a Territory <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-center mb-8" style={{ color: NAVY }}>Frequently Asked Questions</h2>
          <FAQ />
        </div>
      </section>

      {/* Final CTA / Apply Form */}
      <section id="apply" className="px-4 py-16" style={{ background: NAVY }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <SectionLabel>Apply</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Ready to Own a Veteran Transition Territory?</h2>
            <p className="text-blue-200 text-sm max-w-lg mx-auto">
              If you are a disciplined agent who can create conversations from targeted opportunities, VTON may be a strong fit.
            </p>
          </div>
          <ApplyForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-slate-900 text-center">
        <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-8 w-auto mx-auto mb-4 opacity-40" />
        <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed mb-2">
          VTON, Veteran's Next Home™, and the Red White &amp; Blue Purchase Benefit are private programs and are not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency. Territory access, lead volume, and transaction outcomes are not guaranteed.
        </p>
        <p className="text-xs text-slate-500">BuyWiser Technology, Inc. NMLS #1887767 · CA DRE #01107013</p>
      </footer>
    </div>
  );
}