import { useState, useMemo } from "react";
import { useState, useMemo } from "react";
import { Search, Zap, Sparkles, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { SERVICES, CATEGORIES, TRANSACTION_PHASES, PHASE_SMART_SUGGESTIONS } from "./marketplaceData.js";
import ServiceCard from "./ServiceCard";

const PHASE_ICONS = {
  all: "🏠", pre_offer: "🔍", inspection: "🔬", appraisal: "📊",
  mortgage: "🏦", closing: "🔑", post_close: "📦",
};

function CategorySection({ category, services, savingsPool }) {
  const [open, setOpen] = useState(false);
  const available = services.filter(s => !s.comingSoon).length;

  return (
    <div className="rounded-xl border border-slate-700 overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-900 hover:bg-slate-800/70 transition">
        <div className="flex items-center gap-3">
          <span className="text-lg">{category.icon}</span>
          <div className="text-left">
            <p className="text-sm font-black text-white">{category.label}</p>
            <p className="text-[10px] text-slate-500">{available} available{services.some(s => s.comingSoon) ? " · expansion planned" : ""}</p>
          </div>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
      </button>
      {open && (
        <div className="px-3 py-3 bg-slate-950/60 border-t border-slate-800 space-y-2">
          {services.map(s => <ServiceCard key={s.id} service={s} savingsPool={savingsPool} />)}
        </div>
      )}
    </div>
  );
}

export default function PropertyServicesMarketplace({ savingsPool = 18750 }) {
  const [phase, setPhase] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = SERVICES;
    if (phase !== "all") list = list.filter(s => s.phases?.includes(phase));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [phase, search]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(s => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, [filtered]);

  const visibleCats = CATEGORIES.filter(c => grouped[c.id]?.length);

  const smartIds = PHASE_SMART_SUGGESTIONS[phase] || [];
  const smartServices = SERVICES.filter(s => smartIds.includes(s.id)).slice(0, 3);

  return (
    <section className="px-4 sm:px-6 py-20 border-t border-slate-800/40 bg-slate-950">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-3">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">SmartBuy™</span>
            </div>
            <h2 className="text-3xl font-black text-white mb-2">Property Services Marketplace™</h2>
            <p className="text-slate-400 text-sm max-w-xl">
              Token-powered, vetted services surfaced intelligently by transaction phase. Every vendor is licensed, insured, and backed by the Token Rewind™ guarantee.
            </p>
          </div>
          <a href="/marketplace"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 font-black text-xs rounded-xl transition whitespace-nowrap">
            Full Marketplace <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Phase filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {TRANSACTION_PHASES.map(p => (
            <button key={p.id} onClick={() => setPhase(p.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition whitespace-nowrap ${
                phase === p.id
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600"
              }`}>
              <span>{PHASE_ICONS[p.id]}</span> {p.label}
            </button>
          ))}
        </div>

        {/* Smart suggestions banner */}
        {smartServices.length > 0 && phase !== "all" && (
          <div className="mb-5 rounded-2xl border border-violet-500/30 bg-violet-500/5 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-violet-500/20 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-300">Recommended for This Phase</span>
            </div>
            <div className="px-4 py-3 flex flex-wrap gap-3">
              {smartServices.map(s => (
                <div key={s.id} className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
                  <span className="text-sm">{CATEGORIES.find(c => c.id === s.category)?.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-white leading-tight">{s.name}</p>
                    {s.tokens
                      ? <p className="text-[10px] text-amber-400 font-bold">{s.tokens.toLocaleString()} tokens</p>
                      : <p className="text-[10px] text-slate-500">Coming soon</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search services..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs">✕</button>}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-500 text-sm">No services match. <button onClick={() => { setSearch(""); setPhase("all"); }} className="text-emerald-400 underline">Clear filters</button></p>
          </div>
        ) : search ? (
          <div className="space-y-2">
            {filtered.map(s => <ServiceCard key={s.id} service={s} savingsPool={savingsPool} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {visibleCats.map(cat => (
              <CategorySection key={cat.id} category={cat} services={grouped[cat.id]} savingsPool={savingsPool} />
            ))}
          </div>
        )}

        {/* CTA to full marketplace */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-700 rounded-2xl px-6 py-5">
          <div>
            <p className="text-sm font-black text-white mb-0.5">Explore the Full Marketplace</p>
            <p className="text-xs text-slate-400">All services, advanced filtering, full vendor details, and AI tips.</p>
          </div>
          <a href="/marketplace"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-sm rounded-xl transition whitespace-nowrap">
            Open Marketplace <ArrowRight className="h-4 w-4" />
          </a>
        </div>

      </div>
    </section>
  );
}