import { CheckCircle, Lock } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const CRITERIA = [
  { label: "You have an active VA loan on the home you're selling" },
  { label: "You served in the U.S. military (any branch)" },
  { label: "You plan to purchase another home" },
  { label: "Your next purchase will be in a qualifying market" },
];

export default function QualificationCriteria({ onScrollToCTA }) {
  return (
    <section className="px-4 py-14 bg-white">
      <div className="max-w-xl mx-auto">

        {/* Label */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lock className="h-3.5 w-3.5" style={{ color: RED }} />
          <p className="text-xs font-black uppercase tracking-widest" style={{ color: RED }}>
            Qualification Criteria
          </p>
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-extrabold text-center mb-2" style={{ color: NAVY }}>
          This Benefit Isn't for Everyone.
        </h2>
        <p className="text-sm text-slate-500 text-center leading-relaxed mb-2 max-w-md mx-auto">
          The Veteran's Next Home™ Benefit is a private, structured program — not a public offer. It's reserved for a specific group of qualifying veteran homeowners.
        </p>

        {/* "You qualify" callout */}
        <div
          className="mx-auto max-w-sm mb-8 px-5 py-3 rounded-2xl border-2 text-center"
          style={{ borderColor: "#10b981", background: "#f0fdf4" }}
        >
          <p className="text-sm font-black text-green-800 uppercase tracking-widest">
            Based on your profile — you appear to qualify.
          </p>
          <p className="text-xs text-green-700 mt-1">
            A personal benefit review will confirm your eligibility.
          </p>
        </div>

        {/* Criteria list */}
        <div className="space-y-2.5 mb-8">
          {CRITERIA.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5"
            >
              <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#10b981" }} />
              <p className="text-sm text-slate-700 font-medium">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Subtle exclusivity note + CTA */}
        <div className="bg-slate-900 rounded-2xl px-6 py-5 text-center space-y-3">
          <p className="text-white text-sm leading-relaxed">
            <span className="font-black text-white">Only veteran homeowners meeting all criteria</span>
            <span className="text-slate-300"> are eligible to receive the Red White &amp; Blue Purchase Benefit.</span>
          </p>
          <p className="text-slate-400 text-xs italic">
            Spots in each market are limited. A benefit review confirms your qualification and locks in your access.
          </p>
          <button
            onClick={onScrollToCTA}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white transition"
            style={{ background: RED }}
          >
            Confirm My Eligibility &amp; Start My Benefit Review →
          </button>
        </div>

      </div>
    </section>
  );
}