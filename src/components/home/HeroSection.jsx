import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Key, DollarSign, Home } from "lucide-react";

export default function HeroSection() {
  const cards = [
    {
      icon: Key,
      title: "Purchase",
      desc: "I want to buy a home",
      link: createPageUrl("ApplyNow") + "?type=purchase",
    },
    {
      icon: DollarSign,
      title: "Refinance",
      desc: "I'm ready to refinance",
      link: createPageUrl("ApplyNow") + "?type=refinance",
    },
    {
      icon: Home,
      title: "Talk with Us",
      desc: "I want to see if I qualify to buy my first home",
      link: createPageUrl("ContactUs"),
    },
  ];

  return (
    <section className="relative">
      {/* Hero Background */}
      <div
        className="relative h-[600px] md:h-[650px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/30" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight max-w-3xl">
            Find Your Ideal Mortgage Solution
          </h1>

          {/* Goals Cards */}
          <div className="mt-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-10 max-w-2xl w-full">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-700 mb-6">
              Tell us about your goals
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 md:divide-x divide-slate-200">
              {cards.map((card) => (
                <Link
                  key={card.title}
                  to={card.link}
                  className="flex flex-col items-center px-4 py-3 hover:bg-green-50 rounded-xl transition-colors group"
                >
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-3 group-hover:bg-green-200 transition-colors">
                    <card.icon className="h-7 w-7 text-green-600" />
                  </div>
                  <span className="font-bold text-slate-800 text-lg">{card.title}</span>
                  <span className="text-slate-500 text-sm text-center mt-1">{card.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}