import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

const testimonials = [
  {
    text: "I can't thank Bennett enough for making my dream of homeownership come true. His team was incredibly supportive throughout the entire process, explaining every step and ensuring I got the best possible rate. I'm now a proud homeowner and couldn't be happier!",
    name: "Sarah J.",
    location: "Oak Park, CA",
  },
  {
    text: "Bennett is amazing. He will get you a great deal and is so incredibly easy to work with. Bennett spent so much time with me, making sure I was comfortable and understood all steps in the process. He is exceptionally knowledgeable and was able to save my deal multiple times because of his expertise.",
    name: "Christina G.",
    location: "Mission Viejo, CA",
  },
  {
    text: "Our experience with Bennett was exceptional. From the moment we applied for our mortgage, he provided expert guidance and kept us informed at every turn. Thanks to his dedication, we're now living in our dream home. Highly recommended!",
    name: "John M.",
    location: "Encino, CA",
  },
  {
    text: "I was initially worried about the mortgage application process, but working with Bennett changed everything. His team's professionalism and efficiency made the entire process a breeze. I'm thrilled with my new home and grateful for his assistance.",
    name: "Lisa C.",
    location: "Sherman Oaks, CA",
  },
  {
    text: "Bennett went above and beyond to secure the best mortgage deal for me. His commitment to finding the right solution for my financial situation was evident throughout. I'm now saving money every month on my mortgage payments, and I couldn't be happier.",
    name: "Michael R.",
    location: "Woodland Hills, CA",
  },
  {
    text: "Bennett from BuyWiser Mortgage made buying our first home a truly joyful experience. They answered all our questions patiently and helped us understand the mortgage options available. We're now settled into our new home, and it's all thanks to Bennett's expertise.",
    name: "Amanda L.",
    location: "West Hollywood, CA",
  },
  {
    text: "When I purchased my new home I initially worked with another mortgage broker who promised one thing and delivered another. Then, someone gave me Bennett Liss' name and I had a completely different experience. He communicated clearly, honestly, and consistently.",
    name: "Michele D.",
    location: "Calabasas, CA",
  },
  {
    text: "Ben assisted me through the entire loan process. He took the time to explain all the details and answer all my questions. He made me feel comfortable at all times with one of the biggest purchases of my life. I highly recommend Ben for all your home mortgage needs.",
    name: "Steve N.",
    location: "Moorpark, CA",
  },
  {
    text: "Bennett Liss is one of the MOST HELPFUL people ever! I feel like he made the impossible possible. He always checked in on me, talked me off the ledge, and ensured I was making a good decision! He is the best!",
    name: "Lisa C.",
    location: "Westwood, Los Angeles, CA",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            What our clients say about us!
          </h2>
        </div>

        <div className="max-w-3xl mx-auto relative">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center min-h-[280px] flex flex-col items-center justify-center">
            <Quote className="h-10 w-10 text-green-200 mb-4" />
            <p className="text-slate-600 text-lg leading-relaxed mb-6 italic">
              "{t.text}"
            </p>
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="font-bold text-slate-800">- {t.name}</p>
            <p className="text-green-600 text-sm font-medium">{t.location}</p>
          </div>

          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-green-50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-green-50 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-slate-600" />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current ? "bg-green-600 w-6" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}