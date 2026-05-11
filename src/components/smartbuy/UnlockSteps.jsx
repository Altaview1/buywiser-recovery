import { Unlock, UserCheck, MessageSquare, DollarSign, ArrowRight, ChevronRight } from "lucide-react";

const STEPS = [
  {
    icon: Unlock,
    color: "amber",
    number: "01",
    title: 'Tap "Get Help"',
    subtitle: "At any stage in your workflow",
    desc: 'Whenever you hit a wall — on mortgage questions, offer strategy, contract language, or anything else — tap the amber "Get Help" button. It appears on every stage card.',
    visual: (
      <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/40 bg-amber-500/10 w-fit">
        <Unlock className="h-3.5 w-3.5 text-amber-400" />
        <span className="text-xs font-black text-amber-400">Get Help</span>
      </div>
    ),
  },
  {
    icon: UserCheck,
    color: "blue",
    number: "02",
    title: "Choose Your Expert",
    subtitle: "Pick who you need",
    desc: "A panel shows you the available professionals — Bennett Liss for mortgage, a buyer's agent for property support, or an attorney for legal review. Each shows the token cost upfront.",
    visual: (
      <div className="space-y-2 w-full">
        {[
          { name: "Bennett Liss", role: "Mortgage · 30 Yrs", cost: "$1,500", active: true },
          { name: "Buyer Agent", role: "Compass / KW", cost: "$2,200", active: false },
        ].map(({ name, role, cost, active }) => (
          <div key={name} className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs transition ${active ? "border-amber-500/50 bg-amber-500/10" : "border-slate-700 bg-slate-800/50"}`}>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-sm ${active ? "bg-amber-400" : "bg-slate-700"}`}>
                {active ? "🏦" : "🏡"}
              </div>
              <div>
                <p className={`font-black leading-tight ${active ? "text-white" : "text-slate-400"}`}>{name}</p>
                <p className="text-slate-600 leading-tight">{role}</p>
              </div>
            </div>
            <span className={`font-black ${active ? "text-amber-400" : "text-slate-500"}`}>{cost}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: DollarSign,
    color: "emerald",
    number: "03",
    title: "Confirm the Token Trade",
    subtitle: "Transparent cost, no surprises",
    desc: "You see exactly how many tokens (dollars from your Savings Pool) will be deducted. Confirm your name and phone. The token cost is only settled at closing — not charged upfront.",
    visual: (
      <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 w-full space-y-2 text-xs">
        <div className="flex justify-between text-slate-400">
          <span>Service selected</span>
          <span className="font-bold text-white">Mortgage Consultation</span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>Token cost</span>
          <span className="font-bold text-red-400">− $1,500</span>
        </div>
        <div className="border-t border-slate-700 pt-2 flex justify-between">
          <span className="text-slate-400">Pool after unlock</span>
          <span className="font-black text-emerald-400">$17,250</span>
        </div>
        <div className="pt-1 text-[10px] text-slate-600 text-center">Settled at closing · not charged today</div>
      </div>
    ),
  },
  {
    icon: MessageSquare,
    color: "emerald",
    number: "04",
    title: "Expert Reaches Out",
    subtitle: "Call or text within hours",
    desc: "Bennett or your assigned expert contacts you directly at the number you provided. No scheduling link, no hold music, no middleman. Real conversation, real answers.",
    visual: (
      <div className="space-y-2 w-full">
        <div className="flex items-start gap-2.5 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">🏦</div>
          <div>
            <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-0.5">Bennett Liss · BuyWiser</p>
            <p className="text-xs text-slate-300 leading-snug">"Hi, this is Bennett — I just got your request. Happy to walk through the financing on this property. Do you have a few minutes?"</p>
          </div>
        </div>
        <p className="text-[10px] text-slate-600 text-center">Typical response: within 2 hours</p>
      </div>
    ),
  },
];

const colorMap = {
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    icon: "text-amber-400",
    num: "bg-amber-500 text-slate-900",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    icon: "text-blue-400",
    num: "bg-blue-500 text-white",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    icon: "text-emerald-400",
    num: "bg-emerald-500 text-slate-900",
  },
};

export default function UnlockSteps({ onOpenUnlock }) {
  return (
    <section className="px-4 sm:px-6 py-20 border-t border-slate-800/60 bg-slate-900/40">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
            <Unlock className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">How The Unlock Works</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-3">
            4 Steps to Talk to an Expert
          </h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            Trading a token is simple, transparent, and costs you nothing until closing. Here's exactly what happens when you ask for help.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {STEPS.map((step, i) => {
            const c = colorMap[step.color];
            const Icon = step.icon;
            return (
              <div key={i} className={`relative bg-slate-900 border rounded-2xl p-6 flex flex-col gap-5 ${c.border}`}>
                {/* Step number + icon */}
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${c.num}`}>
                    {step.number}
                  </div>
                  <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-4 w-4 ${c.icon}`} />
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="ml-auto hidden md:flex items-center gap-1 text-slate-700 text-[10px] font-bold uppercase tracking-widest">
                      next <ChevronRight className="h-3 w-3" />
                    </div>
                  )}
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-base font-black text-white mb-0.5">{step.title}</h3>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${c.text}`}>{step.subtitle}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>

                {/* Visual */}
                <div className="mt-auto pt-1">
                  {step.visual}
                </div>
              </div>
            );
          })}
        </div>

        {/* Connector arrows on desktop */}
        <div className="hidden md:flex items-center justify-center gap-2 mb-10 text-slate-700">
          {["Tap Get Help", "Choose Expert", "Confirm Trade", "Expert Calls You"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">{label}</span>
              {i < 3 && <ArrowRight className="h-3.5 w-3.5 text-slate-700" />}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/20 rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="text-sm font-black text-white mb-1">Nothing is charged today.</p>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Token costs are settled at closing from your Savings Pool. If you don't close, no tokens are collected. You only trade tokens for help you actually use.
            </p>
          </div>
          <button
            onClick={onOpenUnlock}
            className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-amber-400 text-slate-900 font-black rounded-xl text-sm hover:bg-amber-300 transition whitespace-nowrap shadow-lg"
          >
            <Unlock className="h-4 w-4" /> Try Unlocking Now
          </button>
        </div>

      </div>
    </section>
  );
}