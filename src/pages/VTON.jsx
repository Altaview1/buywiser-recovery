import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight, Check, X, Award, Target, TrendingUp, Shield } from "lucide-react";
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
  { range: "90–100", tier: "Priority Partner", color: "#10b981", bg: "#ecfdf5", border: "#6ee7b7", desc: "Eligible for expanded territories and preferred assignments" },
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
    {
      q: "Is this a pay-per-lead program?",
      a: "No — and this distinction matters. VTON is not a lead-buying platform. You are not purchasing contact information. Your deposit is a refundable performance commitment, not a lead fee. You earn it back through verified field actions, not by buying access to names and numbers."
    },
    {
      q: "What is the $2,000 deposit, exactly?",
      a: "It is a fully refundable accountability commitment. Every time you complete a verified field action — door knock, homeowner conversation, QR scan, CRM entry — you earn $200 back. Complete 10 verified actions and your full deposit is returned. The deposit exists to ensure partners are serious about execution, not to generate revenue for VTON."
    },
    {
      q: "So VTON makes no money from my deposit?",
      a: "Correct. Your deposit is held and returned to you through verified performance. VTON earns only on closed transactions — 10% of commission income on deals that close through VTON opportunities. If you don't close deals, VTON earns nothing on your deposit."
    },
    {
      q: "What's the difference between this and buying leads?",
      a: "Lead companies charge you upfront for contact info regardless of quality or outcome. VTON assigns you pre-qualified veteran-transition homeowner opportunities, provides tools and scripts, and refunds your commitment as you do the work. Your deposit is not a cost — it is a performance bond that comes back to you through execution."
    },
    {
      q: "What are the opportunities VTON assigns?",
      a: "Qualified veteran homeowners in your territory who are transitioning — selling a VA-financed home and likely buying again. These are not cold lists. They are identified opportunities with VA loan history and demonstrated transition signals."
    },
    {
      q: "How do I earn my deposit back?",
      a: "By completing verified field actions: door knocks, QR code validations, documented homeowner conversations, CRM logging compliance, follow-up completions, and buyer consultation advancement. Each verified action earns $200 back — 10 actions returns your full $2,000."
    },
    {
      q: "What counts as a verified accountability action?",
      a: "A verified action requires actual homeowner or decision-maker contact, a rep-specific QR scan or code entry, a logged CRM note, a date/time record, and a basic outcome selection. You cannot self-report without validation."
    },
    {
      q: "What happens after my deposit is fully refunded?",
      a: "Your VTON Performance Score is reviewed to determine whether you will be invited into continued or expanded territory participation. High scorers may access priority assignments and additional territories."
    },
    {
      q: "Does VTON guarantee transactions?",
      a: "No. VTON evaluates execution, accountability, and opportunity creation. Transaction outcomes vary. VTON is a field performance network, not a transaction guarantee system."
    },
    {
      q: "What does VTON receive on closed deals?",
      a: "VTON receives 10% of commission income actually received on closed transactions arising from VTON opportunities, plus Buywiser retains mortgage opportunity where applicable. There are no hidden fees."
    },
    {
      q: "How motivated are these homeowners to actually move?",
      a: "Highly. VTON opportunities carry an 85% next-move/buy ratio within 30 days of assignment. These are not cold prospects — they are veteran homeowners who have demonstrated active transition signals and are in the decision window. You are not trying to create urgency. The urgency already exists."
    },
    {
      q: "Do all of these homeowners qualify for the Red White & Blue Next Move Offer?",
      a: "Yes. Every opportunity assigned through VTON has been pre-screened and qualifies for the Red White & Blue Next Move Offer based on their previous loan being a VA loan. You do not need to qualify them on that point — they are already eligible. Your job is to introduce the benefit and start the conversation."
    },
    {
      q: "Are any of these homeowners already locked into a contract with another agent?",
      a: "No. VTON will not assign any opportunity where the homeowner has signed an exclusive buyer's agency agreement with another agent. That means there is no legal loyalty to a competing agent, no contractual barrier, and no reason they cannot work with you. The field is clear."
    },
    {
      q: "What outreach has already happened before I knock on the door?",
      a: "Every homeowner in your assignment pool has already been contacted by mail, email, and text before you arrive. By the time you knock or call, they have seen the Red White & Blue Next Move Offer multiple times. You are the live follow-through — the human touchpoint that converts awareness into a real conversation. The groundwork is already laid."
    },
    {
      q: "Does participating in Veteran's Next Home™ cost me anything upfront as an agent?",
      a: "No — and this is what makes Veteran's Next Home™ unlike virtually every other buyer benefit model in real estate. You pay nothing to participate. There are no upfront fees, no subscription costs, and no per-lead charges. The model works entirely on the back end: when you close a transaction through the program, you contribute 1% of your commission back to the buyer as their Red White & Blue Purchase Benefit. That's it. The buyer receives a real, meaningful benefit at closing — funded from your commission, not from their pocket or yours upfront."
    },
    {
      q: "Where does the other 0.5% of the buyer's benefit come from?",
      a: "If the buyer chooses Buywiser for their financing, Buywiser contributes an additional 0.5% — bringing the total benefit to the buyer up to 1.5% of the purchase price. The agent's contribution is always 1%. The extra 0.5% is Buywiser's share, and it only applies when the buyer uses Buywiser for their mortgage. So the full 1.5% benefit is a joint contribution: 1% from the agent's commission, 0.5% from Buywiser's lending side. If the buyer uses outside financing, they still receive the 1% from you — the Buywiser share simply doesn't apply."
    },
    {
      q: "Is this connected to the VA or a government program?",
      a: "No. VTON, Veteran's Next Home™, and the Red White & Blue Purchase Benefit are private Buywiser-related programs and are not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency."
    },
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
  { heading: "This is not a lead-buying program.", body: "You are not purchasing contact information. Your $2,000 deposit is a fully refundable accountability commitment — returned to you $200 at a time as you complete verified field actions." },
  { heading: "VTON earns nothing from your deposit.", body: "We earn only on closed transactions. If you execute and complete your 10 verified actions, your full $2,000 is returned. The deposit exists to ensure you are serious — not to generate revenue for VTON." },
  { heading: "These are warm, pre-qualified opportunities.", body: "Every homeowner has already received mail, email, and texts about the Red White & Blue Next Move Offer. They carry an 85% next-move ratio within 30 days. No exclusive buyer contracts. No legal barriers. You are the live follow-through." },
  { heading: "Your job is execution and documentation.", body: "Show up, knock the door, log the conversation, scan the QR code. That's how you earn your deposit back and build your VTON Performance Score for continued territory access." },
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
      console.error("Error submitting application:", error);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(255,255,255,0.15)" }}>
          <Award className="h-7 w-7 text-white" />
        </div>
        <p className="text-white font-black text-lg mb-1 uppercase tracking-wide">Accountability Review Submitted</p>
        <p className="text-blue-200 text-sm max-w-sm mx-auto leading-relaxed">Your application has been received. VTON is evaluating your profile. We'll be in touch within one business day.</p>
        <p className="text-blue-300 text-xs mt-3 italic">VTON is evaluating you as much as you are evaluating VTON.</p>
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

  if (step === "commitment") {
    return (
      <div className="space-y-4">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-1.5">
            {["quiz", "commitment", "form"].map((s, i) => (
              <div key={s} className={`rounded-full transition-all ${step === s ? "w-5 h-2 bg-white" : i < ["quiz","commitment","form"].indexOf(step) ? "w-2 h-2 bg-white/60" : "w-2 h-2 bg-white/20"}`} />
            ))}
          </div>
          <span className="text-xs text-white/50 ml-1">Step 2 of 3 — Before You Apply</span>
        </div>

        <div className="bg-white/10 border border-white/20 rounded-2xl p-5 space-y-1">
          <p className="text-white font-black text-sm uppercase tracking-widest mb-3">Understand the Accountability Commitment</p>
          <p className="text-blue-200 text-xs mb-4 leading-relaxed">Before we ask for your information, we want you to fully understand what you are committing to — and why the deposit is not a cost.</p>
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
            <strong className="text-white">The deposit ($2,000) is discussed and collected only after your accountability review interview</strong> — not during this application. You are applying for the interview, not paying today.
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
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-1">
        <div className="flex gap-1.5">
          {["quiz", "commitment", "form"].map((s, i) => (
            <div key={s} className={`rounded-full transition-all ${step === s ? "w-5 h-2 bg-white" : i < ["quiz","commitment","form"].indexOf(step) ? "w-2 h-2 bg-white/60" : "w-2 h-2 bg-white/20"}`} />
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
        <button type="submit" className="w-full py-4 font-bold text-base rounded-xl transition flex items-center justify-center gap-2"
          style={{ background: RED, color: "#fff" }}>
          Apply for Accountability Review <ArrowRight className="h-4 w-4" />
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
    { n: "1", title: "Place Your Accountability Deposit", desc: "Partners place a fully refundable deposit to activate participation and demonstrate commitment to execution." },
    { n: "2", title: "Receive Qualified Opportunity Assignments", desc: "VTON assigns identified veteran-transition homeowner opportunities in your territory." },
    { n: "3", title: "Complete Verified Accountability Actions", desc: "Partners earn refund credits by performing and documenting required outreach actions — door knocks, conversations, QR validations, CRM compliance." },
    { n: "4", title: "Earn Back Your Deposit Through Execution", desc: "Your deposit is refunded incrementally as you complete verified field actions. $200 refund per verified accountability action." },
    { n: "5", title: "Receive Your VTON Performance Score", desc: "Once your deposit is fully refunded, your performance score determines whether VTON invites you into continued territory participation or expanded opportunities." },
  ];

  const provides = [
    "Qualified veteran-transition opportunity assignments",
    "Territory exclusivity",
    "QR-code accountability validation system",
    "Rep-specific tracking codes",
    "Door scripts and Veteran's Next Home™ messaging",
    "Leave-behind materials",
    "CRM outcome tracking and compliance tools",
    "Red White & Blue Purchase Benefit framework",
    "Buywiser mortgage support where applicable",
    "VTON Performance Score tracking",
  ];

  const forAgents = [
    "Follow instructions and protocols",
    "Complete outreach and document activity",
    "Create verified homeowner conversations",
    "Professionally represent the VTON framework",
    "Believe in earning access through execution",
    "Want a differentiated veteran homeowner niche",
    "Are comfortable with field outreach and door knocking",
  ];

  const notFor = [
    "Passive agents expecting automatic results",
    "Agents who want internet leads without field work",
    "Agents unwilling to follow the VTON accountability protocol",
    "Agents who will not document their activity",
  ];

  const pilots = ["Denver", "Colorado Springs", "San Antonio", "Jacksonville", "Hampton Roads", "Phoenix"];

  const accountabilityActions = [
    "Verified qualified door knock",
    "Verified homeowner conversation",
    "QR code scan / code entry",
    "CRM logging compliance",
    "Follow-up completion",
    "Buyer consultation advancement",
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
          Apply for Accountability Review
        </button>
      </header>

      <RWBStripe />

      {/* Hero */}
      <section style={{ background: NAVY }} className="px-4 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-2 mb-7">
            <Badge label="VTON" />
            <Badge label="Partner Accountability Program" />
            <Badge label="Cycle 1 Evaluation" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight tracking-tight">
            Prove You Can Execute.<br />
            <span style={{ color: "#ef9a9a" }}>Earn Your Full Deposit Back.</span>
          </h1>
          <p className="text-blue-200 text-base sm:text-lg leading-relaxed mb-4 max-w-2xl mx-auto">
            VTON is built for disciplined field partners who can professionally engage qualified veteran homeowner opportunities.
          </p>
          <p className="text-blue-300 text-sm leading-relaxed mb-4 max-w-xl mx-auto">
            Your deposit is not a lead fee. It is a <strong className="text-white">fully refundable accountability commitment</strong> designed to ensure real outreach, verified execution, and measurable performance.
          </p>
          <p className="text-blue-400 text-sm italic mb-10 max-w-xl mx-auto">
            VTON is evaluating you as much as you are evaluating VTON.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={scrollToApply} className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-base transition" style={{ background: RED, color: "#fff" }}>
              Apply for Accountability Review <ArrowRight className="h-4 w-4" />
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
              { icon: Target, label: "Your Actions", sub: "Determine your refund" },
              { icon: TrendingUp, label: "Your Score", sub: "Determines your future" },
              { icon: Award, label: "Your Execution", sub: "Earns your place" },
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

      {/* Why This Is Different */}
      <section className="px-4 py-16" style={{ background: GRAY }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>What This Is</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-5" style={{ color: NAVY }}>
            Not Lead Buying. Not Random Prospecting. Structured Accountability-Based Field Qualification.
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            VTON is a field-performance network that uses veteran-transition opportunities to identify disciplined operators. Your deposit is the accountability mechanism. Your actions determine your refund. Your score determines your future.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {[
              "Qualified veteran-transition homeowner assignments",
              "VA-financed home sale triggers — not cold lists",
              "Accountability-validated field outreach",
              "Performance scoring and tier advancement",
              "Fully refundable deposit through verified execution",
            ].map(item => (
              <div key={item} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                <Check className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: RED }} />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
          <div className="bg-white border-l-4 rounded-xl px-5 py-4" style={{ borderLeftColor: NAVY }}>
            <p className="text-sm text-slate-700 font-semibold">
              Your first cycle is a proving ground. Earn your place.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Process</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8" style={{ color: NAVY }}>How the VTON Accountability Program Works</h2>
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

      {/* Refund / Accountability Structure */}
      <section className="px-4 py-16" style={{ background: GRAY }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Refund Structure</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-5" style={{ color: NAVY }}>Your Deposit Is Fully Refundable Through Verified Performance</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            Your deposit is refunded in structured increments as accountability actions are completed and verified. This is not a cost — it is a commitment mechanism that rewards execution.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Accountability Deposit", value: "$2,000", sub: "Fully refundable through execution" },
              { label: "Refund Per Verified Action", value: "$200", sub: "Per verified accountability action" },
              { label: "Actions for Full Refund", value: "10", sub: "Complete your deposit cycle" },
            ].map(card => (
              <div key={card.label} className="bg-white border-2 border-slate-200 rounded-2xl px-5 py-5 text-center">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{card.label}</p>
                <p className="text-3xl font-black mb-0.5" style={{ color: NAVY }}>{card.value}</p>
                <p className="text-xs text-slate-500">{card.sub}</p>
              </div>
            ))}
          </div>

          <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Verified Accountability Actions Include:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {accountabilityActions.map(item => (
              <div key={item} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3">
                <Check className="h-4 w-4 flex-shrink-0" style={{ color: "#10b981" }} />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border-l-4 rounded-xl px-5 py-4" style={{ borderLeftColor: RED }}>
            <p className="text-sm font-bold" style={{ color: RED }}>Your real risk is not money. Your real requirement is execution.</p>
          </div>
        </div>
      </section>

      {/* Performance Score */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Performance Score</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3" style={{ color: NAVY }}>Your Score Determines Your Future with VTON</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-xl">
            Once your accountability deposit cycle is complete, your VTON Performance Score determines whether you are invited into continued or expanded territory participation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Target, label: "Accountability Score", items: ["Door attempts", "QR scans", "Protocol compliance", "Documentation speed"] },
              { icon: Shield, label: "Conversation Score", items: ["Verified homeowner interactions", "Contact quality", "Follow-up completion"] },
              { icon: TrendingUp, label: "Opportunity Advancement Score", items: ["Consultations generated", "Buyer interest created", "Next-stage progression"] },
            ].map(({ icon: Icon, label, items }) => (
              <div key={label} className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
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
        </div>
      </section>

      {/* Accountability Discipline Section */}
      <section className="px-4 py-16" style={{ background: GRAY }}>
        <div className="max-w-3xl mx-auto">
          <SectionLabel>Accountability Standards</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-5" style={{ color: NAVY }}>This Program Rewards Discipline, Not Excuses</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            VTON is designed for field partners who complete accountability standards and represent the program professionally. Partners who excel may be invited into expanded territories or advanced VTON opportunities.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-green-700 mb-3">This is for partners who:</p>
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
          <div className="mt-6 border-l-4 rounded-xl px-5 py-4 bg-white" style={{ borderLeftColor: NAVY }}>
            <p className="text-sm font-bold text-slate-800 italic">
              "I am earning access to a superior system." — That is the mindset VTON selects for.
            </p>
          </div>
        </div>
      </section>

      {/* What VTON Provides */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <SectionLabel>What You Get</SectionLabel>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-8" style={{ color: NAVY }}>What VTON Provides</h2>
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
            VTON is currently evaluating approved field partners in select veteran-heavy markets for Cycle 1 evaluation.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {pilots.map(city => (
              <span key={city} className="px-4 py-2 rounded-full text-sm font-semibold border border-white/20 text-white bg-white/10">
                {city}
              </span>
            ))}
          </div>
          <button onClick={scrollToApply} className="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-xl text-base transition" style={{ background: RED, color: "#fff" }}>
            Apply for Accountability Review <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-2xl mx-auto">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-2xl font-extrabold text-center mb-3" style={{ color: NAVY }}>Frequently Asked Questions</h2>
          <p className="text-center text-sm text-slate-500 mb-6 max-w-lg mx-auto">
            Especially: why this is <strong className="text-slate-700">not a lead-buying program</strong> and how the refundable deposit model actually works.
          </p>
          {/* Key distinction callout */}
          <div className="flex items-start gap-3 p-4 mb-8 rounded-xl border-2 bg-green-50" style={{ borderColor: "#10b981" }}>
            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-black text-green-800 uppercase tracking-wide mb-0.5">You are not buying leads.</p>
              <p className="text-sm text-green-700 leading-relaxed">
                Your $2,000 deposit is fully refundable through verified execution. VTON earns nothing from your deposit — only from closed transactions. Your money comes back through your work.
              </p>
            </div>
          </div>
          <FAQ />
        </div>
      </section>

      {/* Final CTA / Apply Form */}
      <section id="apply" className="px-4 py-16" style={{ background: NAVY }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <SectionLabel>Apply</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">Apply to Prove You Belong in VTON</h2>
            <p className="text-blue-200 text-sm max-w-lg mx-auto leading-relaxed">
              VTON is not for passive agents. It is for disciplined operators who can execute in the field and document their performance.
            </p>
            <p className="text-blue-400 text-xs mt-2 italic">VTON is evaluating you as much as you are evaluating VTON.</p>
          </div>
          <ApplyForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-slate-900 text-center">
        <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-8 w-auto mx-auto mb-4 opacity-40" />
        <p className="text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed mb-2">
          VTON, Veteran's Next Home™, and the Red White &amp; Blue Purchase Benefit are private programs and are not affiliated with or endorsed by the U.S. Department of Veterans Affairs or any government agency. Deposit refunds are contingent on verified performance. Territory access and transaction outcomes are not guaranteed.
        </p>
        <p className="text-xs text-slate-500">BuyWiser Technology, Inc. NMLS #1887767 · CA DRE #01107013</p>
      </footer>
    </div>
  );
}