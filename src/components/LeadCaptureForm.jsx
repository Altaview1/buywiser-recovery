import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, ArrowRight, Loader2, Calendar } from "lucide-react";

export default function LeadCaptureForm({ prefillCode }) {
  const [mode, setMode] = useState("quick"); // "quick" or "schedule"
  const [form, setForm] = useState({
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 10;
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email || !validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.phone || !validatePhone(form.phone)) {
      newErrors.phone = "Please enter a valid phone number (at least 10 digits)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    await base44.entities.ContactSubmission.create({
      first_name: form.email.split("@")[0],
      email: form.email,
      phone: form.phone,
      form_type: "contact",
      status: "new",
      how_heard: "buywiser_landing",
    });
    setLoading(false);
    setSubmitted(true);
  };

  const inputCls =
    "w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-600 transition bg-white";
  const labelCls = "block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5";

  if (submitted) {
    return (
      <div className="bg-white border-2 border-green-200 rounded-xl p-8 text-center shadow-sm">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">You've Been Assigned a BuyWiser Concierge</h3>
        <p className="text-sm text-slate-500">
          A BuyWiser Concierge has been assigned to go over your Red White &amp; Blue Purchase Benefit and will be in touch within one business day.
        </p>
        <p className="text-xs text-slate-400 mt-3">Questions? Call (818) 300-2642</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-900">
        <p className="text-white font-bold text-sm">Start Your Veteran's Next Home™ Benefit Review</p>
        <p className="text-slate-400 text-xs mt-0.5">No cost · No obligation · Response within 1 business day</p>
      </div>

      {/* Mode selector */}
      <div className="px-6 pt-6 flex gap-2 border-b border-slate-100">
        <button
          onClick={() => setMode("quick")}
          className={`pb-3 px-2 text-sm font-semibold border-b-2 transition ${
            mode === "quick"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Quick Review
        </button>
        <button
          onClick={() => setMode("schedule")}
          className={`pb-3 px-2 text-sm font-semibold border-b-2 transition ${
            mode === "schedule"
              ? "border-slate-900 text-slate-900"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          Schedule Consultation
        </button>
      </div>

      {mode === "quick" ? (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelCls}>Email Address *</label>
            <input
              type="email"
              required
              className={`${inputCls} ${errors.email ? "border-red-500" : ""}`}
              placeholder="jane@email.com"
              value={form.email}
              onChange={(e) => {
                setForm((f) => ({ ...f, email: e.target.value }));
                if (errors.email) setErrors((err) => ({ ...err, email: "" }));
              }}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className={labelCls}>Phone Number *</label>
            <input
              type="tel"
              required
              className={`${inputCls} ${errors.phone ? "border-red-500" : ""}`}
              placeholder="(818) 555-1234"
              value={form.phone}
              onChange={(e) => {
                setForm((f) => ({ ...f, phone: e.target.value }));
                if (errors.phone) setErrors((err) => ({ ...err, phone: "" }));
              }}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 font-bold text-base rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "#cc0000", color: "#fff" }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                Get My Benefit Estimate <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="text-xs text-slate-400 text-center">
            Your information is used only to respond to your inquiry. We never sell your data.
          </p>
        </form>
      ) : (
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Schedule a consultation with a BuyWiser Concierge to discuss your next home transition and Red White &amp; Blue Purchase Benefit in detail.
          </p>
          <a
            href="tel:+18183002642"
            className="flex items-center justify-center gap-2 w-full py-4 font-bold text-base rounded-lg transition"
            style={{ background: "#cc0000", color: "#fff" }}
          >
            <Calendar className="h-4 w-4" /> Call to Schedule (818) 300-2642
          </a>
          <p className="text-xs text-slate-400 text-center">
            Available Monday–Friday, 9am–5pm PT
          </p>
        </div>
      )}
    </div>
  );
}