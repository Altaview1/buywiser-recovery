import { useState } from "react";
import { base44 } from "@/api/base44Client";
import SMSConsentCheckbox, { FormFooter } from "./SMSConsentCheckbox";
import { CheckCircle2, Shield, Award } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

export default function VTONPublicOptIn() {
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", email: "", property_address: "" });
  const [smsConsent, setSmsConsent] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.email.trim()) e.email = "Required";
    if (!smsConsent) e.smsConsent = "You must agree to receive SMS communications to continue.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); setConsentError(errs.smsConsent || ""); return; }
    setConsentError("");
    setSubmitting(true);
    try {
      await base44.entities.VTONLead.create({
        ...form,
        veteran_indicator: true,
        campaign_stage: "initial_outreach",
        sms_status: "pending",
        email_status: "pending",
        suppression_status: "active",
        facebook_audience_synced: false,
        direct_mail_sent: false,
        appointment_booked: false,
        city: "",
        state: "CA",
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Opt-in failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const inp = (field) =>
    `w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition ${
      errors[field] ? "border-red-400" : "border-slate-200 focus:border-blue-500"
    }`;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: NAVY }}>
        <div className="text-center text-white max-w-md">
          <div className="mb-4 text-6xl">🎖️</div>
          <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-3">You're Registered!</h1>
          <p className="text-blue-300 mb-4">A VTON™ specialist will be in touch to walk you through your Veteran NextHome GAP Benefit.</p>
          <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-left">
            <p className="text-blue-200 text-xs leading-relaxed">
              Thank you. Your request has been received. A VTON™ representative may contact you regarding your Veteran NextHome GAP Benefit Review. Reply <strong className="text-white">STOP</strong> at any time to opt out of SMS communications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: NAVY }}>
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/10 border border-white/20">
            <span className="text-xs font-black uppercase tracking-widest text-blue-200">Veteran Transition Opportunity Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Claim Your Veteran NextHome Benefit</h1>
          <p className="text-blue-300">See how much you qualify for as a veteran selling your current home.</p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Award, text: "VA Verified Program" },
            { icon: Shield, text: "No Obligation" },
            { icon: CheckCircle2, text: "Free 15-Min Review" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="bg-white/10 border border-white/20 rounded-xl p-3 text-center">
              <Icon className="h-5 w-5 text-blue-300 mx-auto mb-1" />
              <p className="text-xs text-blue-200 font-semibold">{text}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">First Name *</label>
              <input className={inp("first_name")} placeholder="John" value={form.first_name}
                onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Last Name</label>
              <input className={inp("last_name")} placeholder="Smith" value={form.last_name}
                onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Mobile Phone *</label>
            <input type="tel" className={inp("phone")} placeholder="(818) 555-1234" value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Email Address *</label>
            <input type="email" className={inp("email")} placeholder="john@email.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Current Property Address</label>
            <input className={inp("property_address")} placeholder="123 Main St, Los Angeles, CA" value={form.property_address}
              onChange={e => setForm(f => ({ ...f, property_address: e.target.value }))} />
          </div>

          <SMSConsentCheckbox
            checked={smsConsent}
            onChange={setSmsConsent}
            error={consentError}
          />

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl font-black text-base text-white transition disabled:opacity-50"
            style={{ background: submitting ? "#888" : RED }}
          >
            {submitting ? "Submitting…" : "Check My Veteran Benefit →"}
          </button>

          <FormFooter />
        </form>
      </div>
    </div>
  );
}