import { useState, useMemo } from "react";
import { Search, Zap, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { TRANSACTION_PHASES, CATEGORIES, SERVICES, PHASE_SMART_SUGGESTIONS } from "./marketplaceData";
import ServiceCard from "./ServiceCard";

function PhaseTab({ phase, isActive, onClick }) {
  return (
    <button
      onClick={() => onClick(phase.id)}
      className={`px-3.5 py-2 rounded-full text-xs font-black uppercase tracking-wide transition whitespace-nowrap border ${
        isActive
          ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300"
          : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300"
      }`}
    >
      {phase.label}
    </button>
  );
}

function CategorySection({ category, services, savingsPool, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  if (!services.length) return null;

  return (
    <div className="border border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-900 hover:bg-slate-800/60 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{category.icon}</span>
          <span className="text-sm font-black text-white">{category.label}</span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full">
            {services.length}
          </span>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 space-y-2 bg-slate-950/40">
          {services.map(s => (
            <ServiceCard key={s.id} service={s} savingsPool={savingsPool} />
          ))}
        </div>
      )}
    </div>
  );
}

function SmartSuggestionsBar({ phase, allServices, savingsPool }) {
  const suggested = PHASE_SMART_SUGGESTIONS[phase];
  if (!suggested || phase === "all") return null;
  const services = suggested.map(id => allServices.find(s => s.id === id)).filter(Boolean);
  if (!services.length) return null;

  return (
    <div className="mb-6 bg-slate-900 border border-violet-500/30 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-violet-400" />
        <span className="text-xs font-black uppercase tracking-widest text-violet-400">Smart Suggestions for This Phase</span>
      </div>
      <div className="space-y-2">
        {services.map(s => (
          <ServiceCard key={s.id} service={s} savingsPool={savingsPool} />
        ))}
      </div>
    </div>
  );
}

export default function PropertyServicesMarketplace({ savingsPool = 18750 }) {
  const [activePhase, setActivePhase] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = SERVICES;
    if (activePhase !== "all") {
      list = list.filter(s => s.phases?.includes(activePhase));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activePhase, search]);

  const groupedByCategory = useMemo(() => {
    return CATEGORIES.map(cat => ({
      category: cat,
      services: filtered.filter(s => s.category === cat.id),
    })).filter(g => g.services.length > 0);
  }, [filtered]);

  return (
    <section className="px-4 sm:px-6 py-16 bg-slate-950 border-t border-slate-800">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">SmartBuy™ Platform</span>
            </div>
            <h2 className="text-2xl font-black text-white">Property Services Marketplace™</h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Vetted professionals for every phase of your transaction — unlocked with tokens, delivered on demand.
            </p>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
            <Zap className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-xs text-slate-400">Pool:</span>
            <span className="text-sm font-black text-amber-300">
              {savingsPool.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        {/* Phase tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
          {TRANSACTION_PHASES.map(p => (
            <PhaseTab key={p.id} phase={p} isActive={activePhase === p.id} onClick={setActivePhase} />
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search services — pool, appraisal, moving, cleaning..."
            className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-800 bg-slate-900 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
          />
        </div>

        {/* Smart suggestions (phase-aware) */}
        {!search && <SmartSuggestionsBar phase={activePhase} allServices={SERVICES} savingsPool={savingsPool} />}

        {/* Grouped categories */}
        {groupedByCategory.length > 0 ? (
          <div className="space-y-3">
            {groupedByCategory.map(({ category, services }, i) => (
              <CategorySection
                key={category.id}
                category={category}
                services={services}
                savingsPool={savingsPool}
                defaultOpen={i === 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-sm">
            No services found. Try a different phase or search term.
          </div>
        )}

        {/* Footer note */}
        <p className="text-[10px] text-slate-600 text-center mt-8 leading-relaxed">
          All marketplace vendors are vetted and credentialed by Buywiser. Token costs are deducted from your Savings Pool at closing — not charged upfront.
          Token Rewind™ guarantee applies to all eligible advisory services.{" "}
          <a href="/token-rewind" className="underline hover:text-slate-400 transition">Learn more →</a>
        </p>
      </div>
    </section>
  );
}