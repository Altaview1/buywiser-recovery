import { Unlock, User, MessageCircle, CheckCircle, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: Unlock,
    color: "bg-amber-500/20 border-amber-500/40 text-amber-400",
    title: "Choose Your Expert",
    desc: "Pick from mortgage guidance (Bennett Liss), buyer agent support, offer strategy review, or real estate legal counsel.",
  },
  {
    icon: User,
    color: "bg-blue-500/20 border-blue-500/40 text-blue-400",
    title: "Enter Your Details",
    desc: "Provide your name, phone number, and a quick note about what you need. Takes under 30 seconds.",
  },
  {
    icon: MessageCircle,
    color: "bg-emerald-500/20 border-emerald-500/40 text-emerald-400",
    title: "Expert Is Notified Instantly",
    desc: "Bennett or the assigned professional is alerted in real time. Expect a call or text within the delivery window shown.",
  },
  {
    icon: CheckCircle,
    color: "bg-purple-500/20 border-purple-500/40 text-purple-400",
    title: "Service Cost Deducted At Closing",
    desc: "The professional service cost is subtracted from your Savings Pool at closing — not charged upfront. Whatever remains is yours to keep.",
  },
];

export default function UnlockSteps({ onUnlock }) {
  return (
    <section className="px-4 sm:px-6 py-16 border-t border-slate-800/60 bg-slate-900/20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-3">
            <Unlock className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">How Unlocking Works</span>
          </div>
          <h2 className="text-2xl font-black text-white">4 Steps From Question to Expert</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            Stuck at any point in your transaction? Here is exactly what happens when you tap Get Help.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STEPS.map(({ icon: Icon, color, title, desc }, i) => (
            <div key={i} className="relative flex flex-col">
              {i < STEPS.length - 1 && (
                <div className="hidden lg:flex absolute -right-2 top-8 z-10 items-center justify-center w-4">
                  <ArrowRight className="h-3.5 w-3.5 text-slate-700" />
                </div>
              )}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Step {i + 1}</span>
                </div>
                <h3 className="text-sm font-black text-white mb-2">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed flex-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
            <span className="text-xl">🪙</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-white mb-1">Tokens Are Not Charged Upfront — Ever</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your Savings Pool is funded by commission savings at closing. Token costs come from that pool — not your bank account. Keep 100% if you never unlock help.
            </p>
          </div>
          {onUnlock && (
            <button
              onClick={onUnlock}
              className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-amber-400 text-slate-900 font-black rounded-xl text-sm hover:bg-amber-300 transition whitespace-nowrap"
            >
              <Unlock className="h-3.5 w-3.5" /> Unlock Help Now
            </button>
          )}
        </div>
      </div>
    </section>
  );
}