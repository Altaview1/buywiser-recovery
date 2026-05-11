import { Star, MapPin } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "We completed the SmartBuy™ process and received over $28,000 back. Only used professional help where we actually needed it.",
    author: "Sarah & Michael",
    location: "Orange County, CA",
    savings: "$28,000+",
    stars: 5,
  },
  {
    quote: "The AI handled way more of the process than we expected. We only called when we hit a snag.",
    author: "James",
    location: "San Diego, CA",
    savings: "$22,500",
    stars: 5,
  },
  {
    quote: "We lowered our rate AND received closing credits. Best of both worlds with SmartBuy.",
    author: "Lisa & Tom",
    location: "Riverside, CA",
    savings: "$19,200",
    stars: 5,
  },
  {
    quote: "Traditional real estate bundles everything. SmartBuy let us keep part of the value we earned.",
    author: "David",
    location: "Temecula, CA",
    savings: "$24,000",
    stars: 5,
  },
];

export default function SmartBuyTestimonials() {
  return (
    <section className="px-4 sm:px-6 py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">Trusted by California Buyers</p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">Real Buyers, Real Savings</h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">Join hundreds of buyers who've kept thousands through SmartBuy™. See what they saved.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TESTIMONIALS.map((testimonial, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition">
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {[...Array(testimonial.stars)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-slate-700 leading-relaxed mb-4 italic">
                "{testimonial.quote}"
              </p>

              {/* Author + Savings */}
              <div className="flex items-end justify-between pt-4 border-t border-slate-100">
                <div>
                  <p className="text-sm font-bold text-slate-900">{testimonial.author}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {testimonial.location}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-semibold">Preserved</p>
                  <p className="text-lg font-black text-emerald-600">{testimonial.savings}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Buyers Served", value: "400+" },
            { label: "Avg. Savings", value: "$22K+" },
            { label: "Success Rate", value: "99%" },
            { label: "Years Trusted", value: "30+" },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600">{value}</p>
              <p className="text-xs text-slate-600 font-semibold mt-1 uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 mb-4">Ready to join them? Start your SmartBuy™ journey today—no cost, no obligation.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-xl text-sm hover:bg-emerald-700 transition"
          >
            ↑ See Your Savings Potential
          </button>
        </div>
      </div>
    </section>
  );
}