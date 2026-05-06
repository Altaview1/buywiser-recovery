import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Shield, CheckCircle, Calendar, Heart, ArrowRight, Star } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const CHARITIES = [
  { id: "wounded_warrior", name: "Wounded Warrior Project", icon: "🎖️" },
  { id: "tunnel_to_towers", name: "Tunnel to Towers", icon: "🏗️" },
  { id: "fisher_house", name: "Fisher House Foundation", icon: "🏠" },
  { id: "local_veteran", name: "Local Veteran Organization", icon: "⭐" },
];

export default function VTONScan() {
  const urlParams = new URLSearchParams(window.location.search);
  const repCode = urlParams.get("rep") || urlParams.get("rep_code") || "";
  const propertyAddress = urlParams.get("address") || "";
  // "mode=lb" on QR URL means leave-behind packet; absence = in-person scan
  const scanMode = urlParams.get("mode") === "lb" ? "LEAVE_BEHIND_ACTIVATION" : "IN_PERSON_ACTIVATION";

  const [step, setStep] = useState(1);
  const [leadId, setLeadId] = useState(null);
  const [form, setForm] = useState({
    first_name: urlParams.get("first_name") || "",
    last_name: urlParams.get("last_name") || "",
    email: urlParams.get("email") || "",
    phone: urlParams.get("phone") || "",
  });
  const [qualifier, setQualifier] = useState({
    planning_to_buy: "",
    timeline: "",
    next_home_type: "",
    agent_commitment: "",
  });
  const [leadType, setLeadType] = useState("");
  const [charity, setCharity] = useState("");

  // Guard: if we have a leadId but no leadType (e.g. page refresh), fetch from DB
  useEffect(() => {
    if (leadId && !leadType && step >= 4) {
      base44.entities.ActivatorLead.filter({ id: leadId }).then(results => {
        if (results.length > 0 && results[0].lead_type) {
          setLeadType(results[0].lead_type);
        } else {
          console.warn("lead_type missing for lead", leadId, "— defaulting to UNDECIDED");
        }
      }).catch(err => console.warn("Could not fetch lead_type:", err));
    }
  }, [leadId, leadType, step]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleVerify = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // Look up activator by rep code
      let activatorId = null;
      if (repCode) {
        const activators = await base44.entities.FieldActivator.filter({ rep_code: repCode });
        if (activators.length > 0) activatorId = activators[0].id;
      }

      const lead = await base44.entities.ActivatorLead.create({
        ...form,
        property_address: propertyAddress,
        rep_code: repCode,
        activator_id: activatorId,
        status: "QUALIFIED",
        activation_source: scanMode,
        benefit_review_status: "NOT_SCHEDULED",
        scan_timestamp: new Date().toISOString(),
      });
      setLeadId(lead.id);

      // Notify admin
      await base44.functions.invoke("notifyOnAnyChange", {
        event: { type: "create", entity_name: "ActivatorLead", entity_id: lead.id },
        data: { ...form, rep_code: repCode, property_address: propertyAddress, status: "VERIFIED", activation_source: scanMode },
      });

      setStep(3);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const computeLeadType = (q) => {
    if (q.planning_to_buy === "not_sure") return "UNDECIDED";
    if (q.planning_to_buy === "yes") {
      if (
        (q.timeline === "0-3months" || q.timeline === "3-6months") &&
        q.agent_commitment === "yes"
      ) return "MORTGAGE";
      if (q.agent_commitment === "no" || q.agent_commitment === "not_yet") return "FULL_STACK";
    }
    return "UNDECIDED";
  };

  const handleQualifierNext = async () => {
    const lead_type = computeLeadType(qualifier);
    setLeadType(lead_type);
    const tagMap = {
      MORTGAGE: "MORTGAGE_LEAD",
      FULL_STACK: "FULL_STACK_LEAD",
      UNDECIDED: "UNDECIDED_LEAD",
    };
    if (leadId) {
      await base44.entities.ActivatorLead.update(leadId, {
        ...qualifier,
        lead_type,
        crm_tag: tagMap[lead_type] || "",
        status: "QUALIFIED",
      });
    }
    setStep(4);
  };

  const handleCharityNext = async () => {
    if (leadId && charity) {
      await base44.entities.ActivatorLead.update(leadId, { charity_selected: charity });
    }
    setStep(6);
  };

  const handleScheduled = async () => {
    if (leadId) {
      // Fetch full lead to get activator_id and rep_code
      const leads = await base44.entities.ActivatorLead.filter({ id: leadId });
      const lead = leads[0];

      await base44.entities.ActivatorLead.update(leadId, {
        status: "SCHEDULED",
        appointment_scheduled: true,
        appointment_date: new Date().toISOString(),
        benefit_review_status: "SCHEDULED",
      });

      // IN_PERSON_ACTIVATION at door + scheduling = $150 pending payment
      if (scanMode === "IN_PERSON_ACTIVATION" && lead?.activator_id && lead?.rep_code) {
        // Guard: only create if no IN_PERSON_SCHEDULED payment already exists for this lead
        const existing = await base44.entities.ActivatorPayment.filter({ lead_id: leadId, type: "IN_PERSON_SCHEDULED" });
        if (existing.length === 0) {
          await base44.entities.ActivatorPayment.create({
            activator_id: lead.activator_id,
            lead_id: leadId,
            rep_code: lead.rep_code,
            type: "IN_PERSON_SCHEDULED",
            amount: 150,
            status: "PENDING",
          });
        }
      }
      // LEAVE_BEHIND: no upfront payment on scheduling — payment only on attendance
    }
    setStep(7);
  };

  const inputCls = (field) =>
    `w-full px-4 py-3.5 text-sm border-2 rounded-xl focus:outline-none transition ${
      errors[field] ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-blue-500 bg-white"
    }`;

  // SCREEN 1 — LANDING
  if (step === 1) return (
    <div className="min-h-screen flex flex-col" style={{ background: NAVY }}>
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12 text-center">
        <div className="mb-6">
          <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-8 mx-auto opacity-70 mb-4" />
          <div className="flex justify-center gap-1 mb-4">
            {["🇺🇸"].map((f, i) => <span key={i} className="text-2xl">{f}</span>)}
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl px-4 py-2 mb-6">
          <p className="text-xs font-black uppercase tracking-widest text-blue-300">Official Benefit Notice</p>
        </div>

        <h1 className="text-3xl font-extrabold text-white leading-tight mb-4 max-w-sm">
          Your Veteran's Next Home™ Benefit Notice
        </h1>

        <p className="text-blue-200 text-base leading-relaxed mb-3 max-w-sm">
          This is about your <strong className="text-white">next home purchase</strong>, not your current sale.
        </p>

        <p className="text-blue-300 text-sm leading-relaxed mb-8 max-w-sm">
          Because your home is listed and connected to VA financing, you may qualify for Veteran's Next Home™ purchase benefits.
        </p>

        <div className="bg-amber-400/20 border border-amber-400/40 rounded-xl px-4 py-3 mb-8 max-w-sm w-full text-left">
          <div className="flex items-start gap-2">
            <Heart className="h-4 w-4 text-amber-300 flex-shrink-0 mt-0.5" />
            <p className="text-amber-200 text-xs leading-relaxed">
              Start your Benefit Review and <strong className="text-amber-100">direct a $50 donation to a veteran charity</strong> of your choice.
            </p>
          </div>
        </div>

        <button
          onClick={() => setStep(2)}
          className="w-full max-w-sm py-4 rounded-2xl font-black text-base text-white flex items-center justify-center gap-2 shadow-lg transition hover:opacity-90"
          style={{ background: RED }}
        >
          Start Your Benefit Review <ArrowRight className="h-5 w-5" />
        </button>

        <p className="text-blue-400 text-xs mt-4 max-w-xs">
          No obligation. Takes less than 3 minutes. Not affiliated with the VA.
        </p>
      </div>
    </div>
  );

  // SCREEN 2 — CONTACT VERIFY
  if (step === 2) return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-5 py-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: NAVY }}>
            <Shield className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Confirm Where to Send Your Benefit Review</h2>
          <p className="text-slate-500 text-sm leading-relaxed">This ensures your Veteran's Next Home™ Benefit Review reaches you.</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">First Name *</label>
              <input className={inputCls("first_name")} placeholder="Jane" value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Last Name</label>
              <input className={inputCls("last_name")} placeholder="Smith" value={form.last_name}
                onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Email Address *</label>
            <input type="email" className={inputCls("email")} placeholder="jane@email.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Mobile Phone *</label>
            <input type="tel" className={inputCls("phone")} placeholder="(818) 555-1234" value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>

        {repCode && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 mb-5">
            <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
            <p className="text-xs text-blue-700">Rep Code: <strong>{repCode}</strong></p>
          </div>
        )}

        <p className="text-xs text-slate-400 text-center mb-4">Please confirm your contact details and tap verify.</p>

        <button
          onClick={handleVerify}
          disabled={saving}
          className="w-full py-4 rounded-2xl font-black text-base text-white transition disabled:opacity-50"
          style={{ background: saving ? "#888" : RED }}
        >
          {saving ? "Verifying…" : "Verify & Continue"}
        </button>

        <button onClick={() => setStep(1)} className="w-full mt-3 py-2 text-sm text-slate-400 hover:text-slate-600 transition">
          ← Back
        </button>
      </div>
    </div>
  );

  // SCREEN 3 — QUALIFIER
  if (step === 3) return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-5 py-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-amber-100">
            <Star className="h-6 w-6 text-amber-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Your Next Home Plans</h2>
          <p className="text-slate-500 text-sm">Help us personalize your Benefit Review.</p>
        </div>

        <div className="space-y-6 mb-8">
          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">Are you planning to buy another home?</p>
            <div className="space-y-2">
              {[["yes","Yes"], ["no","No"], ["not_sure","Not sure"]].map(([v,l]) => (
                <button key={v} onClick={() => setQualifier(q => ({ ...q, planning_to_buy: v }))}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-semibold border-2 text-left transition ${
                    qualifier.planning_to_buy === v
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">Timeline:</p>
            <div className="space-y-2">
              {[["0-3months","0–3 months"], ["3-6months","3–6 months"], ["6plus","6+ months"]].map(([v,l]) => (
                <button key={v} onClick={() => setQualifier(q => ({ ...q, timeline: v }))}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-semibold border-2 text-left transition ${
                    qualifier.timeline === v
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">Next home type:</p>
            <div className="space-y-2">
              {[["primary","Primary residence"], ["investment","Investment"], ["not_sure","Not sure"]].map(([v,l]) => (
                <button key={v} onClick={() => setQualifier(q => ({ ...q, next_home_type: v }))}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-semibold border-2 text-left transition ${
                    qualifier.next_home_type === v
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-slate-700 mb-3">Do you already have a real estate agent you're committed to?</p>
            <div className="space-y-2">
              {[["yes","Yes, I have an agent"], ["no","No, I don't have one"], ["not_yet","Not yet decided"]].map(([v,l]) => (
                <button key={v} onClick={() => setQualifier(q => ({ ...q, agent_commitment: v }))}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-semibold border-2 text-left transition ${
                    qualifier.agent_commitment === v
                      ? "border-blue-600 bg-blue-50 text-blue-800"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleQualifierNext}
          disabled={!qualifier.planning_to_buy}
          className="w-full py-4 rounded-2xl font-black text-base text-white transition disabled:opacity-40"
          style={{ background: RED }}
        >
          Continue <ArrowRight className="h-4 w-4 inline ml-1" />
        </button>
      </div>
    </div>
  );

  // SCREEN 4 — BENEFIT PAGE (dynamic by lead_type)
  const benefitContent = {
    MORTGAGE: {
      headline: "Optimize Your Next Home Purchase (Without Changing Your Agent)",
      body: "You can keep your current agent. This Veteran's Next Home™ Benefit Review focuses on your financing and purchase structure to ensure you're getting the best possible outcome.",
      cta: "Review My Purchase Structure",
    },
    FULL_STACK: {
      headline: "Maximize Your Veteran's Next Home™ Benefits",
      body: "Your next home can be structured as a complete solution—representation and financing—to capture the full Veteran's Next Home™ benefits.",
      cta: "Plan My Next Home Strategy",
    },
    UNDECIDED: {
      headline: "Understand Your Next Home Options",
      body: "This Veteran's Next Home™ Benefit Review helps you understand your options before anything gets locked in.",
      cta: "Start My Benefit Review",
    },
  };
  const effectiveLeadType = leadType || "UNDECIDED";
  const bc = benefitContent[effectiveLeadType];

  if (step === 4) return (
    <div className="min-h-screen" style={{ background: NAVY }}>
      <div className="px-5 py-10 max-w-md mx-auto text-center">
        <div className="text-4xl mb-4">🇺🇸</div>
        <p className="text-xs font-black uppercase tracking-widest text-blue-300 mb-3">Your Benefit</p>
        <h2 className="text-2xl font-extrabold text-white mb-4 leading-tight">
          {bc.headline}
        </h2>
        <p className="text-blue-200 text-sm leading-relaxed mb-6">
          {bc.body}
        </p>

        <div className="bg-white/10 rounded-2xl p-5 mb-6 text-left space-y-3">
          {[500000, 700000, 900000].map(price => (
            <div key={price} className="flex items-center justify-between py-2 border-b border-white/10 last:border-0">
              <span className="text-blue-200 text-sm">${(price/1000).toFixed(0)}K purchase</span>
              <span className="text-white font-bold text-sm">up to ${((price*0.015)/1000).toFixed(1)}K benefit</span>
            </div>
          ))}
        </div>

        <div className="bg-amber-400/20 border border-amber-400/40 rounded-xl px-4 py-3 mb-8 text-left">
          <p className="text-amber-200 text-xs leading-relaxed">
            <strong className="text-amber-100">VA Confirmed:</strong> Your current VA financing is a key qualifier for this benefit structure.
          </p>
        </div>

        <button onClick={() => setStep(5)}
          className="w-full py-4 rounded-2xl font-black text-base text-white transition hover:opacity-90"
          style={{ background: RED }}>
          {bc.cta} <ArrowRight className="h-4 w-4 inline ml-1" />
        </button>
      </div>
    </div>
  );

  // SCREEN 5 — CHARITY SELECTION
  if (step === 5) return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-5 py-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-100">
            <Heart className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Direct Your $50 Veteran Donation</h2>
          <p className="text-slate-500 text-sm">Choose where your donation goes when your Benefit Review completes.</p>
        </div>

        <div className="space-y-3 mb-8">
          {CHARITIES.map(c => (
            <button key={c.id} onClick={() => setCharity(c.id)}
              className={`w-full py-4 px-5 rounded-xl text-sm font-semibold border-2 text-left flex items-center gap-3 transition ${
                charity === c.id
                  ? "border-blue-600 bg-blue-50 text-blue-800"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}>
              <span className="text-xl">{c.icon}</span>
              {c.name}
              {charity === c.id && <CheckCircle className="h-4 w-4 text-blue-600 ml-auto" />}
            </button>
          ))}
        </div>

        <button onClick={handleCharityNext} disabled={!charity}
          className="w-full py-4 rounded-2xl font-black text-base text-white transition disabled:opacity-40"
          style={{ background: RED }}>
          Continue <ArrowRight className="h-4 w-4 inline ml-1" />
        </button>
      </div>
    </div>
  );

  const schedulePreface = {
    MORTGAGE: "This short Veteran's Next Home™ Benefit Review focuses on optimizing your financing and purchase structure. Your current agent remains in place.",
    FULL_STACK: "This Veteran's Next Home™ Benefit Review will map out your full next-home strategy, including representation and financing.",
    UNDECIDED: "This Veteran's Next Home™ Benefit Review will help clarify your next steps and options.",
  };

  // SCREEN 6 — SCHEDULE
  if (step === 6) return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-5 py-8 max-w-md mx-auto text-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-green-100">
          <Calendar className="h-6 w-6 text-green-700" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Schedule Your Benefit Review</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 text-left">
          <p className="text-blue-700 text-sm leading-relaxed">
            {schedulePreface[effectiveLeadType]}
          </p>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          No pressure, no obligation.
        </p>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 text-left space-y-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>15-minute review by phone or video</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>Learn your exact benefit estimate</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>No cost, no obligation</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
            <span>$50 donation directed on completion</span>
          </div>
        </div>

        <a
          href="https://calendly.com/buywiser"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleScheduled}
          className="block w-full py-4 rounded-2xl font-black text-base text-white transition hover:opacity-90 mb-3"
          style={{ background: RED }}
        >
          Book Your Benefit Review <Calendar className="h-4 w-4 inline ml-1" />
        </a>

        <button onClick={handleScheduled}
          className="w-full py-2 text-sm text-slate-400 hover:text-slate-600 transition">
          I'll schedule later →
        </button>
      </div>
    </div>
  );

  // SCREEN 7 — CONFIRMATION
  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: NAVY }}>
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">🎖️</div>
        <h2 className="text-2xl font-extrabold text-white mb-3">You're All Set</h2>
        <p className="text-blue-200 text-sm leading-relaxed mb-6">
          Your Veteran's Next Home™ Benefit Review is confirmed. A BuyWiser specialist will be in touch shortly.
        </p>
        {charity && (
          <div className="bg-white/10 rounded-xl px-4 py-3 mb-6">
            <p className="text-blue-200 text-xs">
              Your $50 donation will be directed to <strong className="text-white">
                {CHARITIES.find(c => c.id === charity)?.name}
              </strong> upon completion.
            </p>
          </div>
        )}
        <p className="text-blue-400 text-xs">
          Not affiliated with the U.S. Department of Veterans Affairs. BuyWiser Technology, Inc. NMLS #1887767
        </p>
      </div>
    </div>
  );
}