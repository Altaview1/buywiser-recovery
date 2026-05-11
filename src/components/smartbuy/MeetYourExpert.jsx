import { Phone, Star, Shield, Award, CheckCircle } from "lucide-react";

const CREDENTIALS = [
  "30 years originating California mortgage loans",
  "NMLS Licensed Mortgage Originator #1524446",
  "CA DRE Real Estate License #01107013",
  "VA, FHA, Conventional & Jumbo loan specialist",
  "Thousands of California buyers closed since 1991",
  "Founder, BuyWiser Technology, Inc.",
];

const STATS = [
  { value: "30+", label: "Years in CA Mortgage" },
  { value: "1991", label: "In Business Since" },
  { value: "$1B+", label: "Loans Originated" },
  { value: "5★", label: "Client Rating" },
];

export default function MeetYourExpert({ onScrollToForm }) {
  return (
    <section className="px-4 sm:px-6 py-20 border-t border-slate-800/60 bg-slate-900/30">
      <div className="max-w-5xl mx-auto">

        {/* Section label */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
            <Award className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Meet Your Expert</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
            A 30-Year Track Record.<br />
            <span className="text-amber-400">Always In Your Corner.</span>
          </h2>
          <p className="text-slate-400 text-base mt-3 max-w-xl mx-auto leading-relaxed">
            SmartBuy™ is AI-guided — but the human behind it has been doing this since 1991. Bennett Liss is available to every SmartBuy™ buyer throughout their entire journey.
          </p>
        </div>

        {/* Main card */}
        <div className="bg-slate-900 border border-amber-500/20 rounded-3xl overflow-hidden shadow-2xl mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-5">

            {/* Left: portrait + contact */}
            <div className="lg:col-span-2 p-8 flex flex-col items-center text-center border-b lg:border-b-0 lg:border-r border-slate-800"
              style={{ background: "linear-gradient(160deg, #1a1f2e 0%, #0f172a 100%)" }}>

              {/* Avatar */}
              <div className="relative mb-5">
                <div className="w-32 h-32 rounded-2xl bg-slate-700 border-4 border-amber-500/40 flex items-center justify-center text-6xl shadow-xl overflow-hidden">
                  🏦
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-black text-white mb-1">Bennett Liss</h3>
              <p className="text-amber-400 text-sm font-bold mb-1">Founder & Lead Mortgage Expert</p>
              <p className="text-slate-500 text-xs mb-5">BuyWiser Home Loans · Since 1991</p>

              {/* Star rating */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                ))}
                <span className="text-xs text-slate-400 ml-1">5.0 · 200+ reviews</span>
              </div>

              {/* CTAs */}
              <div className="w-full space-y-2">
                <a href="tel:+18183002642"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-400 text-slate-900 font-black text-sm hover:bg-amber-300 transition">
                  <Phone className="h-4 w-4" /> (818) 300-2642
                </a>
                <a href="mailto:bennett@buywiser.com"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-800 transition">
                  bennett@buywiser.com
                </a>
              </div>

              {/* License badges */}
              <div className="mt-5 space-y-1.5 w-full">
                {[
                  { label: "NMLS", value: "#1524446" },
                  { label: "CA DRE", value: "#01107013" },
                  { label: "Company NMLS", value: "#1887767" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
                    <span className="text-xs font-bold text-slate-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: bio + credentials */}
            <div className="lg:col-span-3 p-8 flex flex-col justify-between">

              {/* Bio */}
              <div className="mb-8">
                <p className="text-slate-300 text-base leading-relaxed mb-4">
                  Bennett Liss has been originating California mortgage loans since <strong className="text-white">1991</strong> — before the internet existed as we know it, before online listings, before digital closings. He's seen every market cycle, every rate environment, and every type of buyer situation.
                </p>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  He founded BuyWiser specifically to give buyers the kind of transparent, non-pressured guidance that the traditional real estate model rarely delivers. SmartBuy™ is the technology layer on top of that philosophy — <em className="text-slate-300">you self-direct, but you're never without backup.</em>
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  When you unlock mortgage support on SmartBuy™, you're not getting a call center or a junior loan officer. You're getting Bennett — or a member of his direct team — with the full weight of 30 years of California mortgage experience behind every answer.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {STATS.map(({ value, label }) => (
                  <div key={label} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-3 text-center">
                    <p className="text-xl font-black text-amber-400 leading-tight">{value}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-semibold leading-tight">{label}</p>
                  </div>
                ))}
              </div>

              {/* Credentials checklist */}
              <div className="space-y-2">
                {CREDENTIALS.map(c => (
                  <div key={c} className="flex items-center gap-2.5">
                    <Shield className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{c}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              {onScrollToForm && (
                <button onClick={onScrollToForm}
                  className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-400 text-slate-900 font-black rounded-xl text-sm hover:bg-emerald-300 transition">
                  Start My SmartBuy™ Account →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trust footnote */}
        <p className="text-center text-xs text-slate-600 max-w-lg mx-auto">
          Bennett is available to every SmartBuy™ buyer throughout the transaction — not just at sign-up. Unlock mortgage guidance at any stage, at any time.
        </p>

      </div>
    </section>
  );
}