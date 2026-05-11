import { useState } from "react";
import { ChevronRight, Zap, Home, Users, DollarSign, CheckCircle } from "lucide-react";

const TUTORIALS = [
  {
    id: "property-eval",
    title: "Get a Property Evaluation",
    description: "Use HouseCanary AI reports to value a property before making an offer",
    icon: Home,
    color: "emerald",
    steps: [
      { num: 1, text: "Find a property on Zillow or your local MLS" },
      { num: 2, text: "Open SmartBuy and go to 'Property Intelligence Marketplace'" },
      { num: 3, text: "Choose 'HouseCanary Property Valuation' ($30 SmartBuy Cash™)" },
      { num: 4, text: "Enter the property address or listing URL" },
      { num: 5, text: "Receive AI valuation + comparable sales data within 2 hours" },
      { num: 6, text: "Use the data to decide if the asking price is fair" }
    ],
    cashCost: "$30",
    timeline: "2-4 hours"
  },
  {
    id: "realtor-consult",
    title: "Consult with a Top Realtor",
    description: "Get offer strategy, negotiation, and local market advice",
    icon: Users,
    color: "blue",
    steps: [
      { num: 1, text: "Have a property and asking price in mind" },
      { num: 2, text: "Open SmartBuy and go to 'Professional Services'" },
      { num: 3, text: "Select 'Buyer Agent Support' or 'Offer Strategy Review'" },
      { num: 4, text: "Fill in your name, phone, and property details" },
      { num: 5, text: "Confirm the SmartBuy Cash™ cost (typically $1,000–$1,200)" },
      { num: 6, text: "Licensed agent contacts you within 4 hours" },
      { num: 7, text: "Get personalized advice on offer price, terms, and negotiation" }
    ],
    cashCost: "$1,000+",
    timeline: "4 hours"
  },
  {
    id: "mortgage-consult",
    title: "Consult with a Mortgage Banker",
    description: "Get pre-approval, rate strategy, and loan program guidance",
    icon: DollarSign,
    color: "amber",
    steps: [
      { num: 1, text: "Know your credit score and approximate down payment" },
      { num: 2, text: "Go to SmartBuy 'Mortgage Guidance' in Professional Services" },
      { num: 3, text: "Select 'Mortgage Consultation with Bennett Liss' ($800 SmartBuy Cash™)" },
      { num: 4, text: "Enter your contact info and current mortgage situation" },
      { num: 5, text: "Submit—Bennett's team will call within 2 hours" },
      { num: 6, text: "Discuss pre-approval, rates, loan programs, and timeline" },
      { num: 7, text: "Get a personalized loan offer with no upfront cost" }
    ],
    cashCost: "$800",
    timeline: "2 hours"
  }
];

function TutorialCard({ tutorial, isSelected, onSelect }) {
  const Icon = tutorial.icon;
  const colorClasses = {
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300",
    blue: "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300",
    amber: "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300"
  };

  return (
    <button
      onClick={() => onSelect(tutorial.id)}
      className={`text-left p-4 rounded-xl border-2 transition ${
        isSelected
          ? colorClasses[tutorial.color]
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">{tutorial.title}</p>
          <p className="text-xs text-slate-600 mt-1">{tutorial.description}</p>
        </div>
        <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5 opacity-50" />
      </div>
    </button>
  );
}

function StepsList({ tutorial }) {
  return (
    <div className="space-y-3">
      {tutorial.steps.map(step => (
        <div key={step.num} className="flex gap-3 items-start">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black">
            {step.num}
          </div>
          <p className="text-sm text-slate-700 leading-relaxed pt-0.5">{step.text}</p>
        </div>
      ))}
    </div>
  );
}

export default function TokenTutorial() {
  const [selected, setSelected] = useState("property-eval");
  const tutorial = TUTORIALS.find(t => t.id === selected);

  return (
    <section className="px-4 sm:px-6 py-16 border-t border-slate-100 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
         <div className="text-center mb-10">
           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200 border border-slate-300 mb-4">
             <Zap className="h-3.5 w-3.5 text-slate-700" />
             <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Get Started</span>
           </div>
           <h2 className="text-3xl font-black text-slate-900 mb-2">How to Use Your SmartBuy Cash™</h2>
           <p className="text-slate-600 text-base max-w-2xl mx-auto">
             Follow these simple steps to allocate your cash and unlock expert advice and property intelligence.
           </p>
         </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sidebar: Tutorial Selection */}
          <div className="space-y-3">
            {TUTORIALS.map(t => (
              <TutorialCard
                key={t.id}
                tutorial={t}
                isSelected={selected === t.id}
                onSelect={setSelected}
              />
            ))}
          </div>

          {/* Main Content */}
          {tutorial && (
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
              {/* Tutorial Header */}
              <div className="mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    tutorial.color === "emerald" ? "bg-emerald-100 text-emerald-700" :
                    tutorial.color === "blue" ? "bg-blue-100 text-blue-700" :
                    "bg-amber-100 text-amber-700"
                  }`}>
                    {<tutorial.icon className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{tutorial.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{tutorial.description}</p>
                  </div>
                </div>

                {/* Cash & Timeline Info */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className={`rounded-lg px-3 py-2 ${
                    tutorial.color === "emerald" ? "bg-emerald-50 border border-emerald-200" :
                    tutorial.color === "blue" ? "bg-blue-50 border border-blue-200" :
                    "bg-amber-50 border border-amber-200"
                  }`}>
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-0.5">SmartBuy Cash™ Cost</p>
                    <div className="flex items-baseline gap-1">
                      <Zap className={`h-4 w-4 ${
                        tutorial.color === "emerald" ? "text-emerald-600" :
                        tutorial.color === "blue" ? "text-blue-600" :
                        "text-amber-600"
                      }`} />
                      <p className="font-black text-lg">{tutorial.cashCost}</p>
                    </div>
                  </div>
                  <div className="rounded-lg px-3 py-2 bg-slate-50 border border-slate-200">
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold mb-0.5">Response Time</p>
                    <p className="font-black text-lg text-slate-900">{tutorial.timeline}</p>
                  </div>
                </div>
              </div>

              {/* Steps */}
              <div className="border-t border-slate-200 pt-6">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Step-by-Step Guide</p>
                <StepsList tutorial={tutorial} />
              </div>

              {/* CTA */}
              <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200 text-center">
                <p className="text-xs text-slate-600 mb-2">Ready to get started?</p>
                <a href="/smartbuy" className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-black rounded-lg hover:bg-slate-800 transition text-sm">
                  Open SmartBuy <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: "⏱️", title: "Quick Timeline", text: "Most expert consultations happen within 2-4 hours" },
            { icon: "💰", title: "Keep Your Savings", text: "Unspent SmartBuy Cash™ = cash rebate at closing" },
            { icon: "🔄", title: "SmartBuy Savings Guarantee™", text: "Unhappy with a service? Request a replacement or refund" }
          ].map((tip, i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white text-center">
              <p className="text-2xl mb-2">{tip.icon}</p>
              <p className="font-bold text-sm text-slate-900 mb-1">{tip.title}</p>
              <p className="text-xs text-slate-600">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}