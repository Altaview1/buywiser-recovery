import { Play } from "lucide-react";

export default function SmartBuyVideoPlaceholder() {
  return (
    <section className="px-4 sm:px-6 py-16 bg-slate-50 border-t border-slate-100">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-8">
          <p className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-2">See How It Works</p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            Watch: How SmartBuy™ Preserves Your Cash
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
            A 2-minute walkthrough of how AI + licensed experts work together to keep more of the transaction value in your pocket.
          </p>
        </div>

        {/* Video Placeholder */}
        <div className="relative w-full rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg bg-slate-900 aspect-video flex items-center justify-center">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 opacity-90" />

          {/* Decorative text layer */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 select-none pointer-events-none">
            <p className="text-white text-7xl font-black tracking-tighter">SmartBuy™</p>
          </div>

          {/* Play button + label */}
          <div className="relative z-10 flex flex-col items-center gap-4 text-center px-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-900/40">
              <Play className="h-8 w-8 text-emerald-300 ml-1" />
            </div>
            <div>
              <p className="text-white font-black text-lg mb-1">Video Coming Soon</p>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                We're producing a clear, 2-minute visual guide to the SmartBuy™ cash-preservation process.
              </p>
            </div>
          </div>

          {/* Bottom badge */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs text-slate-300 font-semibold">In Production · Available Soon</p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Prefer to talk now?{" "}
          <a href="tel:+18183002642" className="text-emerald-600 font-semibold hover:underline">
            Call (818) 300-2642
          </a>{" "}
          — Bennett's team will walk you through it personally.
        </p>

      </div>
    </section>
  );
}