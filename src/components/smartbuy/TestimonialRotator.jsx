import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "My husband and I completed the SmartBuy™ process and received over $28,000 back.",
    author: "California Buyer",
    savings: "$28,000+",
  },
  {
    quote: "We only used professional help where we actually needed it.",
    author: "Orange County Buyer",
    savings: "$18,500",
  },
  {
    quote: "It came out to almost $400 an hour for the work we did ourselves.",
    author: "Riverside Buyer",
    savings: "$22,000",
  },
  {
    quote: "The AI handled far more of the process than I expected.",
    author: "First-Time Buyer",
    savings: "$15,750",
  },
  {
    quote: "We lowered our rate and still received closing credits.",
    author: "San Diego Buyer",
    savings: "$19,200",
  },
  {
    quote: "Traditional real estate bundles everything together. SmartBuy™ let us keep part of the value.",
    author: "Temecula Buyer",
    savings: "$24,000",
  },
];

export default function TestimonialRotator() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const testimonial = TESTIMONIALS[current];

  return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
      <div className="mb-4 h-20">
        <p className="text-lg font-semibold text-slate-900 leading-relaxed italic">
          "{testimonial.quote}"
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-black text-slate-900">{testimonial.author}</p>
          <p className="text-xs text-emerald-700 font-bold mt-0.5">Preserved: {testimonial.savings}</p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current ? "bg-emerald-600 w-6" : "bg-emerald-300 w-1.5 hover:bg-emerald-400"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}