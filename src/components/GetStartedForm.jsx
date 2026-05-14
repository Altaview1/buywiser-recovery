import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowRight, Loader2 } from "lucide-react";

export default function GetStartedForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    setLoading(true);
    try {
      await base44.entities.Lead.create({
        address_or_link: "Website Inquiry — Get Started Form",
        name,
        email,
        phone,
        utm_source: "buywiser_home",
        status: "New",
      });
      setSubmitted(true);
      setName("");
      setEmail("");
      setPhone("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Failed to save lead:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Your Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 transition bg-white"
      />
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 transition bg-white"
      />
      <input
        type="tel"
        placeholder="(555) 123-4567"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 transition bg-white"
      />

      {submitted && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700 font-medium">
          ✓ CONGRATULATIONS! A licensed GAP LOAN OFFICER WILL BE CONTACTING YOU IN THE NEXT 24 HOURS.
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !name || !email || !phone}
        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-800 text-white font-bold rounded-xl hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
          </>
        ) : (
          <>
            Get Started <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-xs text-slate-400 text-center">
        No cost · No obligation · Response within 1 business day
      </p>
    </form>
  );
}