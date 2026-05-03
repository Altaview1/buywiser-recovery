import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight, Check, X, Award, Target, TrendingUp, Shield, Clock, Star } from "lucide-react";
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

const SCORE_TIERS = [
  { range: "90–100", tier: "Priority Partner", color: "#10b981", bg: "#ecfdf5", border: "#6ee7b7", desc: "Eligible for expanded territories and priority assignments" },
  { range: "75–89", tier: "Qualified Partner", color: "#3b82f6", bg: "#eff6ff", border: "#93c5fd", desc: "Eligible for continued participation" },
  { range: "60–74", tier: "Conditional Partner", color: "#f59e0b", bg: "#fffbeb", border: "#fcd34d", desc: "May require retraining or limited assignment" },
  { range: "Below 60", tier: "Program Review", color: "#ef4444", bg: "#fef2f2", border: "#fca5a5", desc: "Participation may be paused or discontinued" },
];

function ScoreTiers() {
  return (
    <div className="space-y-3">
      {SCORE_TIERS.map(t => (
        <div key={t.tier} className="flex items-start gap-4 p-4 rounded-xl border" style={{ background: t.bg, borderColor: t.border }}>
          <div className="text-center flex-shrink-0">
            <p className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color: t.color }}>Score</p>
            <p className="text-lg font-black" style={{ color: t.color }}>{t.range}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">{t.tier}</p>
            <p className="text-xs text-slate-600 mt-0.5">{t.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  const items = [
    { q: "What is the VTON deposit?", a: "A professional accountability commitment that is earned back through verified prescribed actions — not a payment for leads, and not tied to sales outcomes." },
    { q: "Can I decline assigned opportunities?", a: "Yes. You may decline or forfeit any assigned opportunity within 48 hours of assignment for any reason — geography, timing, schedule, lead fit, or personal discretion. No penalty." },
    { q: "What happens after the 48-hour window?", a: "After 48 hours, you are considered to have accepted the opportunity and agreed to complete the VTON prescribed action protocols for that assignment." },
    { q: "Is deposit return tied to sales?", a: "No. Deposit earn-back is based entirely on your verified actions and protocol completion — not on final consumer outcomes or whether the homeowner decides to buy." },
    { q: "What if the homeowner never buys?", a: "If you completed the required prescribed actions, your deposit earn-back still applies. Closing is upside. Execution is deposit control." },
    { q: "Can I fully earn back my deposit without closing any deals?", a: "Yes. The deposit earn-back system is tied entirely to verified protocol completion, not to transaction closings." },
    { q: "What if I fail to follow through on an accepted opportunity?", a: "Deposit earn-back may be delayed, reduced, or paused when accepted opportunities are not properly followed-up or followed-through according to VTON prescribed action protocols." },
    { q: "Does VTON guarantee transactions?", a: "No. VTON provides structured opportunity assignments, a historical operating framework, and an accountability system. Transaction outcomes are never guaranteed." },
    { q: "What is the 1-in-10 benchmark?", a: "Historical operating assumptions suggest that for approximately every 10 qualified veteran homeowners meaningfully engaged and clearly educated about the Veteran's Next Move Benefits, one may ultimately become a closed opportunity. This is not a guarantee or income claim — it is a historical benchmark and operating philosophy." },
    { q: "Is this a pay-per-lead program?", a: "No. VTON is a structured accountability and opportunity network. You are not purchasing contact information. Your deposit is a professional commitment that is earned back through disciplined execution." },
    { q: "Does participating in Veteran's Next Home™ cost me anything upfront as an agent?", a: "No. You pay nothing to participate in the field program. Your deposit is fully earnable back through protocol completion. At closing, you contribute 1% of your commission back to the buyer as their Red White & Blue Purchase Benefit. The buyer receives a real, meaningful benefit at closing — funded from your commission, not from their pocket or yours upfront." },
    { q: "Where does the other 0.5% of the buyer's benefit come from?", a: "If the buyer chooses Buywiser for their financing, Buywiser contributes an additional 0.5% — bringing the total benefit to the buyer up to 1.5% of the purchase price. The agent's contribution is always 1%. The extra 0.5% is Buywiser's share, applicable only when the buyer uses Buywiser for their mortgage." },
    { q: "Is VTON connected to the VA or a government program?", a: "No. VTON, Veteran's Next Home™, and the Red White & Blue Purchase Benefit are private Buywiser-related programs and are not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency." },
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

const COMMITMENT_POINTS = [
  { heading: "48-Hour Flexibility Window.", body: "You may freely decline any assigned opportunity within 48 hours for any reason. No penalty. No pressure. Your judgment is respected before acceptance." },
  { heading: "Accountability After Acceptance.", body: "Once retained beyond 48 hours, you agree to complete the VTON prescribed action protocols for that opportunity. Accountability begins at the moment of acceptance." },
  { heading: "Deposit Earned Back Through Action — Not Sales.", body: "Your deposit is fully earnable back through verified protocol completion. Closing is upside. Execution is deposit control. You do not need to close deals to earn your deposit back." },
  { heading: "Historical Opportunity Model.", body: "Historical assumptions suggest approximately 1 in 10 qualified veteran homeowners meaningfully engaged and clearly educated about the Veteran's Next Move Benefits may become a closed opportunity. Not a guarantee — a structured operating philosophy." },
];

function ApplyForm() {
  const [step, setStep] = useState("quiz");
  const [form, setForm] = useState({ name: "", email: "", phone: "", market: "" });
  const [submitted, setSubmitted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});

  const handleQuizComplete = (answers) => {
    setQuizAnswers(answers);
    setStep("commitment");
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
      await base44.functions.invoke('bookInterviewSlot', {
        partner_email: form.email,
        partner_name: form.name,
        partner_phone: form.phone,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(255,255,255,0.15)" }}>
          <Award className="h-7 w-7 text-white" />
        </div>
        <p className="text-white font-black text-lg mb-1 uppercase tracking-wide">Application Received</p>
        <p className="text-blue-200 text-sm max-w-sm mx-auto leading-relaxed">Your application has been received. VTON is evaluating your profile. We'll be in touch within one business day.</p>
        <p className="text-blue-300 text-xs mt-3 italic">Freedom to choose. Clarity to commit. Accountability to perform.</p>
      </div>
    );
  }

  const steps = ["quiz", "commitment", "form"];
  const stepIdx = steps.indexOf(step);

  if (step === "quiz") {
    return (
      <div className="bg-white/10 border border-white/20 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1.5">
            {steps.map((s, i) => (
              <div key={s} className={`rounded-full transition-all ${s === step ? "w-5 h-2 bg-white" : i < stepIdx ? "w-2 h-2 bg-white/60" : "w-2 h-2 bg-white/20"}`} />
            ))}
          </div>
          <span className="text-xs text-white/50 ml-1">Step 1 of 3 — Pre-Screen</span>
        </div>
        <PartnerPreScreenQuiz onComplete={handleQuizComplete} />
      </div>
    );
  }

  if (step === "commitment") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-1.5">
            {steps.map((s, i) => (
              <div key={s} className={`rounded-full transition-all ${s === step ? "w-5 h-2 bg-white" : i < stepIdx ? "w-2 h-2 bg-white/60" : "w-2 h-2 bg-white/20"}`} />
            ))}
          </div>
          <span className="text-xs text-white/50 ml-1">Step 2 of 3 — Understand the Program</span>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-2xl p-5 space-y-3">
          <p className="text-white font-black text-sm uppercase tracking-widest mb-1">Before You Apply — Understand the VTON Model</p>
          <p className="text-blue-200 text-xs mb-3 leading-relaxed">VTON is built on flexibility before commitment, and accountability after acceptance. Please read carefully.</p>
          <div className="space-y-3">
            {COMMITMENT_POINTS.map((pt, i) => (
              <div key={i} className="flex gap-3 bg-white/8 border border-white/10 rounded-xl px-4 py-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-black" style={{ background: RED, color: "#fff" }}>{i + 1}</div>
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">{pt.heading}</p>
                  <p className="text-xs text-blue-200 leading-relaxed">{pt.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 flex items-start gap-2">
          <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-200 leading-relaxed">
            <strong className="text-white">The deposit ($2,000) is discussed and collected only after your accountability review interview</strong> — not during this application. You are applying for the interview today.
          </p>
        </div>

        <button onClick={() => setStep("form")} className="w-full py-4 font-bold text-base rounded-xl transition flex items-center justify-center gap-2" style={{ background: RED, color: "#fff" }}>
          I Understand — Continue to Apply <ArrowRight className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => setStep("quiz")} className="w-full py-2 text-sm text-white/50 hover:text-white/70 transition">
          ← Back to Pre-Screen
        </button>
      </div>
    );
  }

  const inputCls = "w-full px-4 py-3 text-sm rounded-xl border-2 border-white/20 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:border-white/50 transition";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="flex gap-1.5">
          {steps.map((s, i) => (
            <div key={s} className={`rounded-full transition-all ${s === step ? "w-5 h-2 bg-white" : i < stepIdx ? "w-2 h-2 bg-white/60" : "w-2 h-2 bg-white/20"}`} />
          ))}
        </div>
        <span className="text-xs text-white/50 ml-1">Step 3 of 3 — Your Information</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input required className={inputCls} placeholder="Full Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input required type="email" className={inputCls} placeholder="Email Address *" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input required type="tel" className={inputCls} placeholder="Phone Number *" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <input className={inputCls} placeholder="Target Market / City" value={form.market} onChange={e => setForm(f => ({ ...f, market: e.target.value }))} />
        </div>
        <button type="submit" className="w-full py-4 font-bold text-base rounded-xl transition flex items-center justify-center gap-2" style={{ background: RED, color: "#fff" }}>
          Apply for VTON Partner Access <ArrowRight className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => setStep("commitment")} className="w-full py-2 text-sm text-white/50 hover:text-white/70 transition">
          ← Back
        </button>
      </form>
    </div>
  );
}

export default function VTON() {
  const scrollToApply = () => document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });

  const steps = [
    { n: "1", title: "Place Your Accountability Deposit", desc: "Your deposit activates access to VTON opportunity assignments and demonstrates professional commitment." },
    { n: "2", title: "Receive Qualified Veteran Transition Opportunity Assignments", desc: "VTON assigns identified veteran-transition homeowner opportunities in your territory." },
    { n: "3", title: "48-Hour Opportunity Review Window", desc: "You may decline or forfeit any assigned opportunity within 48 hours for any reason — geography, timing, schedule, lead fit, or personal discretion. No penalty." },
    { n: "4", title: "Complete the VTON Protocol — Because Execution Creates Real Opportunity", desc: "Once retained beyond 48 hours, you accept the VTON prescribed action protocols. These may include qualified door knock, required contact attempts, QR/code validation, CRM documentation, required follow-up, and benefit presentation." },
    { n: "5", title: "Earn Back Your Deposit Through Verified Action Completion", desc: "Deposit earn-back is tied to your verified actions — not consumer conversion. Closing is upside. Execution is deposit control." },
    { n: "6", title: "Build Your VTON Performance Score", desc: "Strong protocol execution may unlock expanded territories, priority assignments, and elevated VTON certification." },
  ];

  const forAgents = [
    "Disciplined field operators and door-capable professionals",
    "Agents who follow instructions and complete documentation",
    "Veteran-aligned partners who believe in the benefit mission",
    "Opportunity-driven closers who execute with consistency",
    "Partners who want a structured, differentiated system",
    "Professionals who believe execution creates better odds",
  ];

  const notFor = [
    "Passive agents expecting automatic results",
    "Random lead seekers without follow-through discipline",
    "Agents unwilling to document activity or follow protocols",
    "Partners who want to buy names without doing the work",
  ];

  const pilots = ["Denver", "Colorado Springs", "San Antonio", "Jacksonville", "Hampton Roads", "Phoenix"];

  const protocols = [
    "Timely outreach after acceptance",
    "Qualified door knock or contact attempt",
    "QR code / rep code validation",
    "CRM documentation and outcome logging",
    "Required follow-up completion",
    "Meaningful Veteran's Next Move Benefit explanation",
  ];

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
          Apply for VTON Partner Access
        </button>
      </header>

      <RWBStripe />

      {/* Hero */}
      <section style={{ background: NAVY }} className="px-4 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-7">
            <Badge label="VTON" />
            <Badge label="Partner Accountability & Opportunity Program" />
            <Badge label="Cycle 1 Evaluation" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            Review Opportunities. Accept Strategically.<br />
            <span style={{ color: "#ef9a9a" }}>Execute Professionally. Earn Back Your Deposit Through Action.</span>
          </h1>
          <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-4 max-w-2xl mx-auto">
            VTON partners may freely decline assigned opportunities within 48 hours. Once accepted, partners who complete the VTON prescribed action protocols will earn back their deposit through verified execution milestones — regardless of final homeowner decisions.
          </p>
          <p className="text-blue-300 text-sm leading-relaxed mb-4 max-w-xl mx-auto">
            VTON exists because <strong className="text-white">disciplined execution and clear Veteran's Next Move Benefit communication may create stronger historical odds than ordinary prospecting.</strong>
          </p>

          {/* 1-in-10 Benchmark */}
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-5 py-3 mb-8 mx-auto">
            <Star className="h-5 w-5 text-amber-400 flex-shrink-0" />
            <p className="text-sm text-blue-100 text-left">
              <strong className="text-white">Historical benchmark:</strong> Approximately 1 in 10 qualified veteran homeowners meaningfully engaged may become a closed opportunity.
              <span className="text-blue-400 text-xs block mt-0.5">Not a guarantee. A structured operating philosophy.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={scrollToApply} className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition" style={{ background: RED, color: "#fff" }}>
              Apply for VTON Partner Access <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#how-it-works" className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base border-2 border-white/30 text-white hover:bg-white/10 transition">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      <RWBStripe />

      {/* Core Concept Banner */}
      <section className="px-4 py-10 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              { icon: Clock, label: "48-Hour Choice Window", sub: "Decline any opportunity, no penalty" },
              { icon: Shield, label: "Accountability After Acceptance", sub: "Protocol compliance earns deposit back" },
              { icon: TrendingUp, label: "~1 in 10 Historical Benchmark", sub: "Disciplined execution, real opportunity" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-2 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
                <Icon className="h-6 w-6" style={{ color: NAVY }} />
                <p className="text-sm font-black text-slate-900">{label}</p>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What VTON Is */}
      <section className="px-4 py-16" style={{ background: GRAY }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>What This Is</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-5" style={{ color: NAVY }}>
            Flexibility + Accountability + Verified Action + Opportunity Creation
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            VTON is not a lead-selling platform. It is a structured Veteran Transition Opportunity Network built around your judgment before acceptance and your discipline after acceptance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              "Qualified veteran-transition homeowner opportunity assignments",
              "48-hour decline window — full discretion before commitment",
              "Deposit earned back through verified protocol execution",
              "Performance scoring tied to reliability and professionalism",
              "Historical 1-in-10 operating benchmark to guide expectations",
              "Structured field accountability system — not random prospecting",
            ].map(item => (
              <div key={item} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: RED }} />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border-l-4 rounded-xl px-5 py-4" style={{ borderLeftColor: NAVY }}>
            <p className="text-sm text-slate-700 font-semibold">
              Choice first. Accountability after acceptance. Opportunity through execution.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Process</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8" style={{ color: NAVY }}>How VTON Works</h2>
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

          {/* 1-in-10 encouragement callout */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
            <div className="flex items-start gap-3">
              <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black text-amber-900 mb-1">VTON Historical Operating Model</p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Our historical operating model suggests that for approximately every 10 qualified veteran homeowners you successfully engage and clearly educate about the Veteran's Next Move Benefits, one may ultimately become a closed opportunity.
                </p>
                <p className="text-xs text-amber-600 mt-2 italic">
                  While no outcome is guaranteed, VTON is built on the belief that structured veteran-transition outreach may create materially stronger odds than random prospecting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deposit Earn-Back */}
      <section className="px-4 py-16" style={{ background: GRAY }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Deposit Earn-Back</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-5" style={{ color: NAVY }}>Your Deposit Is Earned Back Through Verified Execution</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Your VTON deposit is tied to measurable actions within your control — not to consumer decisions you cannot control.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Accountability Deposit", value: "$2,000", sub: "Fully earnable back through protocol execution" },
              { label: "Earn-Back Per Verified Action", value: "$200", sub: "Per verified prescribed action completed" },
              { label: "Actions for Full Earn-Back", value: "10", sub: "Complete your deposit earn-back cycle" },
            ].map(card => (
              <div key={card.label} className="bg-white border-2 border-slate-200 rounded-2xl px-5 py-5 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{card.label}</p>
                <p className="text-3xl font-black mb-0.5" style={{ color: NAVY }}>{card.value}</p>
                <p className="text-xs text-slate-500">{card.sub}</p>
              </div>
            ))}
          </div>

          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Verified Prescribed Actions May Include:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {protocols.map(item => (
              <div key={item} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                <Check className="h-4 w-4 flex-shrink-0" style={{ color: "#10b981" }} />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white border-l-4 rounded-xl px-5 py-4" style={{ borderLeftColor: RED }}>
              <p className="text-sm font-bold" style={{ color: RED }}>Closing is upside.</p>
              <p className="text-xs text-slate-500 mt-1">Transaction outcomes are not guaranteed and are not required for deposit earn-back.</p>
            </div>
            <div className="bg-white border-l-4 rounded-xl px-5 py-4" style={{ borderLeftColor: NAVY }}>
              <p className="text-sm font-bold" style={{ color: NAVY }}>Execution is deposit control.</p>
              <p className="text-xs text-slate-500 mt-1">This is not a sales gamble. This is an accountability system where disciplined action earns deposit return.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Prescribed Action Protocol */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Protocol</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-5" style={{ color: NAVY }}>VTON Prescribed Action Protocols</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Once you accept an opportunity (beyond the 48-hour window), VTON expects professional follow-up and follow-through. This may include:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {protocols.map(item => (
              <div key={item} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: NAVY }} />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
            <p className="text-sm font-semibold text-amber-800">Soft Accountability:</p>
            <p className="text-sm text-amber-700 mt-1 leading-relaxed">When accepted opportunities are not followed-up or followed-through according to VTON prescribed action protocols, deposit earn-back may be delayed, reduced, or paused.</p>
          </div>
        </div>
      </section>

      {/* Performance Score */}
      <section className="px-4 py-16" style={{ background: GRAY }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Performance Score</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3" style={{ color: NAVY }}>Your Score Reflects Reliability and Opportunity Potential</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-xl">
            Performance score determines future invitations, expanded territories, priority assignments, and VTON certification level.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Target, label: "Speed & Protocol Compliance", items: ["Outreach timing", "Required contact attempts", "Protocol follow-through"] },
              { icon: Shield, label: "Documentation & Validation", items: ["CRM compliance", "QR / code validation", "Outcome logging"] },
              { icon: TrendingUp, label: "Benefit Presentation", items: ["Veteran's Next Move Benefit clarity", "Consultation advancement", "Professionalism score"] },
            ].map(({ icon: Icon, label, items }) => (
              <div key={label} className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="h-4 w-4" style={{ color: NAVY }} />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-600">{label}</p>
                </div>
                <div className="space-y-1.5">
                  {items.map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: RED }} />
                      <p className="text-xs text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <ScoreTiers />

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white border-l-4 rounded-xl px-5 py-3" style={{ borderLeftColor: "#10b981" }}>
              <p className="text-sm font-bold text-slate-800">Deposit return = protocol completion</p>
            </div>
            <div className="bg-white border-l-4 rounded-xl px-5 py-3" style={{ borderLeftColor: NAVY }}>
              <p className="text-sm font-bold text-slate-800">Score = future opportunity level</p>
            </div>
          </div>
        </div>
      </section>

      {/* For / Not For */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Who This Is For</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-5" style={{ color: NAVY }}>Built for Disciplined Field Operators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">Built for:</p>
              <div className="space-y-2">
                {forAgents.map(item => (
                  <div key={item} className="flex items-start gap-3 bg-white border border-green-100 rounded-xl px-4 py-3">
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
          <div className="border-l-4 rounded-xl px-5 py-4 bg-slate-50" style={{ borderLeftColor: NAVY }}>
            <p className="text-sm font-bold text-slate-800 italic">
              "I am earning access to a superior system." — That is the mindset VTON selects for.
            </p>
          </div>
        </div>
      </section>

      {/* Pilot Markets */}
      <section className="px-4 py-16" style={{ background: NAVY }}>
        <div className="max-w-3xl mx-auto text-center">
          <SectionLabel>Availability</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">Pilot Territories Opening Soon</h2>
          <p className="text-blue-200 text-sm mb-8 max-w-xl mx-auto">
            VTON is evaluating approved field partners in select veteran-heavy markets for Cycle 1 evaluation.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {pilots.map(city => (
              <span key={city} className="px-4 py-2 rounded-full text-sm font-semibold border border-white/20 text-white bg-white/10">{city}</span>
            ))}
          </div>
          <button onClick={scrollToApply} className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl text-base transition" style={{ background: RED, color: "#fff" }}>
            Apply for VTON Partner Access <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-2xl mx-auto">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-2xl font-extrabold text-center mb-3" style={{ color: NAVY }}>Frequently Asked Questions</h2>
          <p className="text-center text-sm text-slate-500 mb-8 max-w-lg mx-auto">
            Including why this is <strong className="text-slate-700">not a lead-buying program</strong>, how the 48-hour window works, and how deposit earn-back is structured.
          </p>
          <div className="flex items-start gap-3 p-4 mb-8 rounded-xl border-2 bg-green-50" style={{ borderColor: "#10b981" }}>
            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-green-800 uppercase tracking-wide mb-0.5">Freedom to choose. Accountability to perform.</p>
              <p className="text-sm text-green-700 leading-relaxed">
                You may decline any opportunity within 48 hours. After acceptance, your deposit is earned back through protocol execution — not sales outcomes.
              </p>
            </div>
          </div>
          <FAQ />
        </div>
      </section>

      {/* Final CTA */}
      <section id="apply" className="px-4 py-16" style={{ background: NAVY }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <SectionLabel>Apply</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Follow the Protocol. Explain the Veteran's Next Move Benefits Clearly. Build Toward the Historical VTON Opportunity Model.
            </h2>
            <p className="text-blue-200 text-sm max-w-lg mx-auto leading-relaxed">
              VTON is built on the belief that disciplined execution, structured accountability, and qualified veteran-transition outreach may create materially stronger odds than ordinary prospecting.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs text-blue-300">
              <span>Freedom to choose.</span>
              <span>·</span>
              <span>Clarity to commit.</span>
              <span>·</span>
              <span>Accountability to perform.</span>
              <span>·</span>
              <span>Opportunity through disciplined execution.</span>
            </div>
          </div>
          <ApplyForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-slate-900 text-center">
        <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-8 w-auto mx-auto mb-4 opacity-40" />
        <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed mb-2">
          VTON, Veteran's Next Home™, and the Red White &amp; Blue Purchase Benefit are private programs and are not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency. Deposit earn-back is contingent on verified protocol completion. Territory access and transaction outcomes are not guaranteed. The 1-in-10 benchmark is a historical operating assumption, not a guarantee of income or results.
        </p>
        <p className="text-xs text-slate-500">BuyWiser Technology, Inc. NMLS #1887767 · CA DRE #01107013</p>
      </footer>
    </div>
  );
}