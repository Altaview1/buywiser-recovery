import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";

export default function LeadCaptureForm() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    loan_type: "",
    comments: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await base44.entities.ContactSubmission.create({
      ...form,
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
        <h3 className="text-lg font-bold text-slate-900 mb-1">We'll Be in Touch</h3>
        <p className="text-sm text-slate-500">
          Thank you! Bennett will review your information and reach out within one business day.
        </p>
        <p className="text-xs text-slate-400 mt-3">Questions? Call (818) 300-2642</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-900">
        <p className="text-white font-bold text-sm">Get Your Personalized Benefit Estimate</p>
        <p className="text-slate-400 text-xs mt-0.5">No cost · No obligation · Response within 1 business day</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>First Name *</label>
            <input
              type="text"
              required
              className={inputCls}
              placeholder="Jane"
              value={form.first_name}
              onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            />
          </div>
          <div>
            <label className={labelCls}>Last Name *</label>
            <input
              type="text"
              required
              className={inputCls}
              placeholder="Smith"
              value={form.last_name}
              onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Email Address *</label>
          <input
            type="email"
            required
            className={inputCls}
            placeholder="jane@email.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelCls}>Phone Number *</label>
          <input
            type="tel"
            required
            className={inputCls}
            placeholder="(818) 555-1234"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>

        <div>
          <label className={labelCls}>What Are You Looking to Do?</label>
          <select
            className={inputCls}
            value={form.loan_type}
            onChange={(e) => setForm((f) => ({ ...f, loan_type: e.target.value }))}
          >
            <option value="">Select your goal</option>
            <option value="Purchase next home (VA loan)">Purchase next home (VA loan)</option>
            <option value="Purchase next home (conventional)">Purchase next home (conventional)</option>
            <option value="Refinance current home">Refinance current home</option>
            <option value="Explore my options">Explore my options</option>
          </select>
        </div>

        <div>
          <label className={labelCls}>Anything Else? <span className="font-normal text-slate-400 normal-case">(optional)</span></label>
          <textarea
            className={inputCls}
            rows={3}
            placeholder="Your current situation, timeline, or any questions..."
            value={form.comments}
            onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value }))}
          />
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
    </div>
  );
}