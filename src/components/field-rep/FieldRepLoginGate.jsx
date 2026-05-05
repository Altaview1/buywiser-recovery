import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { LogIn, AlertCircle } from "lucide-react";

const NAVY = "#0B1F3B";

export default function FieldRepLoginGate({ onSuccess, isLoading }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setChecking(true);

    try {
      const activators = await base44.entities.FieldActivator.filter({
        email: email.trim(),
        status: "active",
      });

      if (activators.length > 0) {
        onSuccess(activators[0]);
      } else {
        setError("No active field activator account found for this email.");
      }
    } catch (err) {
      setError("Error checking account: " + err.message);
    }

    setChecking(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: NAVY }}>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 text-center" style={{ background: NAVY }}>
          <p className="text-white font-black text-sm uppercase tracking-widest">Field Activator Portal</p>
          <p className="text-blue-300 text-xs mt-1">Door-knock tracking & progress logging</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Your Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 transition"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={checking}
            className="w-full py-3.5 font-bold text-sm rounded-xl text-white transition disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: checking ? "#888" : NAVY }}
          >
            <LogIn className="h-4 w-4" />
            {checking ? "Checking…" : "Access Portal"}
          </button>
        </form>
      </div>
    </div>
  );
}