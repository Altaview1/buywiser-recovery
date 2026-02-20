import { MessageSquare, Search, Lock } from "lucide-react";

const steps = [
  {
    num: 1,
    icon: MessageSquare,
    title: "Answer a few questions",
    desc: "Tell us what you're looking for so we can match you with the perfect mortgage",
  },
  {
    num: 2,
    icon: Search,
    title: "Find your lender",
    desc: "We'll search for the top rates from our network of lenders in your area",
  },
  {
    num: 3,
    icon: Lock,
    title: "Lock in your rate",
    desc: "Your lender will contact you shortly so you get more info or lock in your rate",
  },
];

export default function StepsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <p className="text-green-600 font-semibold text-sm uppercase tracking-wider mb-2">Start Your Home Loan Journey Today!</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            A Simple 3-Step Process
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step) => (
            <div key={step.num} className="text-center group">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <step.icon className="h-9 w-9 text-green-600" />
                </div>
                <span className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-green-600 text-white text-sm font-bold flex items-center justify-center shadow-lg">
                  {step.num}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}