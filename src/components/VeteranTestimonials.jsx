import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    name: "Hal & Marjie T.",
    location: "Oxnard, CA",
    saved: "$12,000",
    branch: "U.S. Army (Ret.)",
    review:
      "We had no idea this benefit existed until we found BuyWiser. The process was completely transparent — no pressure, just real numbers. We saved $12,000 on our next home purchase. Best decision we made.",
  },
  {
    name: "Chris K.",
    location: "Studio City, CA",
    saved: "$13,000",
    branch: "U.S. Marine Corps (Ret.)",
    review:
      "We looked at 7 homes and ended up with $13,000 in savings credited at closing. I wish I had known about this benefit years ago. BuyWiser walked us through every step.",
  },
  {
    name: "Dor S.",
    location: "Santa Monica, CA",
    saved: null,
    branch: "U.S. Navy (Ret.)",
    review:
      "Bennett and the team laid out a plan that made the whole move make sense financially. No runaround, no hidden fees — just clear guidance from people who actually know VA loans.",
  },
  {
    name: "James & Linda R.",
    location: "Thousand Oaks, CA",
    saved: "$9,800",
    branch: "U.S. Air Force (Ret.)",
    review:
      "After 22 years of service, we finally felt like someone was fighting for us on the financial side. BuyWiser helped us structure the benefit correctly and we closed with nearly $10K back.",
  },
  {
    name: "Marcus W.",
    location: "Valencia, CA",
    saved: "$11,200",
    branch: "U.S. Army (Ret.)",
    review:
      "I was skeptical at first — I'd heard too many empty promises. But BuyWiser delivered exactly what they said. The 1.5% benefit was real, and so was the savings on our next home.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function VeteranTestimonials() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => advance(1), 5500);
    return () => clearInterval(timer);
  }, [current]);

  const advance = (dir) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((c) => (c + dir + REVIEWS.length) % REVIEWS.length);
      setAnimating(false);
    }, 200);
  };

  const review = REVIEWS[current];

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
      {/* Header bar */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: "#0a1f5c" }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🇺🇸</span>
          <p className="text-white text-xs font-bold uppercase tracking-widest">Veteran Success Stories</p>
        </div>
        <Stars />
      </div>

      {/* Review card */}
      <div
        className="p-6 transition-opacity duration-200"
        style={{ opacity: animating ? 0 : 1, minHeight: 200 }}
      >
        <Quote className="h-6 w-6 mb-3" style={{ color: "#cc0000" }} />

        <p className="text-slate-700 text-sm leading-relaxed italic mb-4">
          "{review.review}"
        </p>

        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-bold text-slate-900">{review.name}</p>
            <p className="text-xs text-slate-500">{review.branch} &bull; {review.location}</p>
          </div>
          {review.saved && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 text-center">
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">Saved</p>
              <p className="text-lg font-black text-green-700">{review.saved}</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="px-5 pb-4 flex items-center justify-between">
        {/* Dots */}
        <div className="flex gap-1.5">
          {REVIEWS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current ? "w-5 h-2 bg-slate-800" : "w-2 h-2 bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* Arrows */}
        <div className="flex gap-1.5">
          <button
            onClick={() => advance(-1)}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition"
          >
            <ChevronLeft className="h-4 w-4 text-slate-500" />
          </button>
          <button
            onClick={() => advance(1)}
            className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition"
          >
            <ChevronRight className="h-4 w-4 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
}