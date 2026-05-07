import { ArrowRight } from "lucide-react";

const RED = "#C62828";

const TESTIMONIALS = [
  {
    name: "Cody & Frank M.",
    branch: "Navy Veterans",
    benefit: "$9,500",
    quote: "The GAP Benefit covered our closing costs. We didn't expect that kind of help.",
  },
  {
    name: "James R.",
    branch: "Army (Ret.)",
    benefit: "$12,000",
    quote: "Buywiser structured everything perfectly. The benefit was real and made a huge difference.",
  },
  {
    name: "Sarah & Tom K.",
    branch: "Marine Corps",
    benefit: "$8,750",
    quote: "We were skeptical at first. But they delivered exactly what they promised.",
  },
  {
    name: "Marcus W.",
    branch: "Air Force (Ret.)",
    benefit: "$11,200",
    quote: "This benefit helped us bridge the gap between selling and buying. Game changer.",
  },
];

export default function GAPBenefitTestimonials({ onScrollToCTA }) {
  return (
    <section className="px-4 py-14 bg-slate-50">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Success Stories</p>
          <h2 className="text-2xl font-extrabold text-slate-900">Veterans Who Used Their GAP Benefits</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, s) => (
                  <svg key={s} className="w-4 h-4 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-slate-700 italic mb-4 leading-relaxed">"{t.quote}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.branch}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-center">
                  <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wide">GAP Benefit</p>
                  <p className="text-lg font-black text-green-700">{t.benefit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-500 mb-4">Individual results vary. Benefit amount depends on purchase structure and qualifying details.</p>
          <button
            onClick={onScrollToCTA}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white transition shadow-lg hover:shadow-xl"
            style={{ background: RED }}
          >
            See If You Qualify <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}