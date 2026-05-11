import { useState, useMemo } from "react";
import { Search, Zap, ChevronDown, ChevronUp, Sparkles, ArrowRight, RotateCcw } from "lucide-react";
import { SERVICES, CATEGORIES, TRANSACTION_PHASES, PHASE_SMART_SUGGESTIONS } from "../components/smartbuy/marketplace/marketplaceData";
import ServiceCard from "../components/smartbuy/marketplace/ServiceCard";

const PHASE_ICONS = {
  all: "🏠", pre_offer: "🔍", inspection: "🔬", appraisal: "📊",
  mortgage: "🏦", closing: "🔑", post_close: "📦",
};

const PHASE_DESCRIPTIONS = {
  all: "Browse all available services across your entire transaction.",
  pre_offer: "Tools to sharpen your offer strategy before you're under contract.",
  inspection: "Specialty inspectors to uncover hidden issues during your contingency period.",
  appraisal: "Appraisal coordination and value defense services.",
  mortgage: "Financing optimization and mortgage advisory services.",
  closing: "Services to prepare for your close date.",
  post_close: "Move-in coordination, cleaning, and post-closing setup.",
};

function SmartSuggestBanner({ phase, savingsPool }) {
  const suggested = PHASE_SMART_SUGGESTIONS[phase] || [];
  if (!suggested.length || phase === "all") return null;
  const services = SERVICES.filter(s => suggested.includes(s.id)).slice(0, 3);
  if (!services.length) return null;

  return (
    <div className="mb-6 rounded-2xl overflow-hidden border border-violet-500/30 bg-gradient-to-r from-violet-500/10 to-emerald-500/5">
      <div className="px-5 py-3 border-b border-violet-500/20 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-violet-400" />
        <span className="text-xs font-black uppercase tracking-widest text-violet-300">Smart Suggestions for This Phase</span>
      </div>
      <div className="px-5 py-4 flex flex-wrap gap-3">
        {services.map(s => (
          <div key={s.id} className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2">
            <span className="text-sm">{CATEGORIES.find(c => c.id === s.category)?.icon}</span>
            <div>
              <p className="text-xs font-semibold text-white leading-tight">{s.name}</p>
              {s.tokens && <p className="text-[10px] text-amber-400 font-bold">{s.tokens.toLocaleString()} tokens</p>}
              {s.comingSoon && <p className="text-[10px] text-slate-500">Coming soon</p>}
            </div>
          </div>
        ))}
        <div className="flex items-center text-[10px] text-violet-400 gap-1 ml-auto self-center font-semibold">
          <ArrowRight className="h-3 w-3" /> These are prioritized for your current phase
        </div>
      </div>
    </div>
  );
}

function CategorySection({ category, services, savingsPool, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const available = services.filter(s => !s.comingSoon).length;

  return (
    <div className="rounded-2xl border border-slate-800 overflow-hidden mb-4">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-900 hover:bg-slate-800/60 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{category.icon}</span>
          <div className="text-left">
            <p className="text-sm font-black text-white">{category.label}</p>
            <p className="text-[10px] text-slate-500">
              {available} service{available !== 1 ? "s" : ""} available
              {services.some(s => s.comingSoon) && " · 1 coming soon"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {services.some(s => s.badge === "Coming Soon") && (
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-700 rounded-full px-2 py-0.5">
              + Expansion Planned
            </span>
          )}
          {open
            ? <ChevronUp className="h-4 w-4 text-slate-500" />
            : <ChevronDown className="h-4 w-4 text-slate-500" />}
        </div>
      </button>

      {open && (
        <div className="px-4 py-3 bg-slate-950/40 space-y-2 border-t border-slate-800">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} savingsPool={savingsPool} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Marketplace() {
  const [phase, setPhase] = useState("all");
  const [search, setSearch] = useState("");
  const [savingsPool] = useState(750000 * 0.025); // default; future: pass from user profile

  const filteredServices = useMemo(() => {
    let list = SERVICES;
    if (phase !== "all") {
      list = list.filter(s => s.phases?.includes(phase));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q) ||
        s.certifications?.some(c => c.toLowerCase().includes(q))
      );
    }
    return list;
  }, [phase, search]);

  const groupedByCategory = useMemo(() => {
    const map = {};
    filteredServices.forEach(s => {
      if (!map[s.category]) map[s.category] = [];
      map[s.category].push(s);
    });
    return map;
  }, [filteredServices]);

  const visibleCategories = CATEGORIES.filter(c => groupedByCategory[c.id]?.length);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Header ── */}
      <div className="border-b border-slate-800 bg-slate-900/60 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-0.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <h1 className="text-lg font-black tracking-tight">Property Services Marketplace™</h1>
                <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 rounded-full px-2 py-0.5">SmartBuy™</span>
              </div>
              <p className="text-xs text-slate-400">Token-powered vetted services · every stage of your transaction</p>
            </div>
            <div className="flex items-center gap-2">
              <a href="/token-rewind" className="flex items-center gap-1 text-[10px] text-violet-400 hover:text-violet-300 font-black transition">
                <RotateCcw className="h-3 w-3" /> Token Rewind™
              </a>
              <a href="/smartbuy" className="px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-black text-xs hover:bg-emerald-500/30 transition">
                ← SmartBuy™
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Search ── */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search services, categories, or certifications..."
            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-slate-700 bg-slate-900 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition text-xs">✕</button>
          )}
        </div>

        {/* ── Phase filter ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {TRANSACTION_PHASES.map(p => (
            <button
              key={p.id}
              onClick={() => setPhase(p.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black border transition whitespace-nowrap ${
                phase === p.id
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-300"
              }`}
            >
              <span>{PHASE_ICONS[p.id]}</span> {p.label}
            </button>
          ))}
        </div>

        {/* ── Phase description ── */}
        {phase !== "all" && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{PHASE_ICONS[phase]}</span>
            <div>
              <p className="text-xs font-black text-white mb-0.5">{TRANSACTION_PHASES.find(p2 => p2.id === phase)?.label} Phase</p>
              <p className="text-xs text-slate-400">{PHASE_DESCRIPTIONS[phase]}</p>
            </div>
          </div>
        )}

        {/* ── Smart suggestions ── */}
        <SmartSuggestBanner phase={phase} savingsPool={savingsPool} />

        {/* ── MI Coming-Soon callout ── */}
        {(phase === "all" || phase === "mortgage") && !search && (
          <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-5 py-4 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-xl">🛡️</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-black text-amber-200">Mortgage Insurance Optimization™</p>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 border border-slate-700 rounded-full px-2 py-0.5">Coming Soon</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                A future module that will let you allocate tokens toward lower MI premiums, lender-paid MI structures, FHA vs conventional comparisons, and monthly payment optimization — powered by live pricing APIs and underwriting scenario engines.
              </p>
              <p className="text-[10px] text-amber-400 mt-2 font-semibold">🤖 AI Tip: Choosing a slightly larger down payment may substantially reduce monthly mortgage insurance costs.</p>
            </div>
          </div>
        )}

        {/* ── Service Results ── */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-slate-400 text-sm">No services match your search.</p>
            <button onClick={() => { setSearch(""); setPhase("all"); }} className="mt-3 text-xs text-emerald-400 hover:text-emerald-300 transition underline">Clear filters</button>
          </div>
        ) : search ? (
          /* Flat list when searching */
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
              {filteredServices.length} result{filteredServices.length !== 1 ? "s" : ""} for "{search}"
            </p>
            {filteredServices.map(s => (
              <ServiceCard key={s.id} service={s} savingsPool={savingsPool} />
            ))}
          </div>
        ) : (
          /* Grouped by category */
          <div>
            {visibleCategories.map((cat, i) => (
              <CategorySection
                key={cat.id}
                category={cat}
                services={groupedByCategory[cat.id]}
                savingsPool={savingsPool}
                defaultOpen={i === 0 || phase !== "all"}
              />
            ))}
          </div>
        )}

        {/* ── Bottom trust bar ── */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-6 text-center">
            {[
              { icon: "✅", label: "All Vendors Vetted", sub: "Licensed & insured" },
              { icon: "🔒", label: "Token Rewind™", sub: "Replacement or refund guarantee" },
              { icon: "⚡", label: "On-Demand Access", sub: "No hold queues" },
              { icon: "🤖", label: "AI-Guided", sub: "Phase-aware surfacing" },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-1 min-w-[100px]">
                <span className="text-xl">{icon}</span>
                <p className="text-[11px] font-black text-white">{label}</p>
                <p className="text-[10px] text-slate-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-600 mt-5 leading-relaxed">
          All marketplace services are coordinated by Buywiser. Token costs deducted from your SmartBuy™ Savings Pool at closing — never charged upfront.
          <br />BuyWiser Technology, Inc. · NMLS #1887767 · CA DRE #01107013
        </p>
      </div>
    </div>
  );
}