import { useState, useMemo } from "react";
import { Search, Zap, ChevronDown, ChevronUp, Sparkles, RotateCcw, Clock, CheckCircle, Lock } from "lucide-react";
import { SERVICES, TRANSACTION_PHASES, PHASE_SMART_SUGGESTIONS } from "@/components/smartbuy/marketplace/marketplaceData";
import ServiceCard from "@/components/smartbuy/marketplace/ServiceCard";
import ClosingCostVisualizer from "@/components/smartbuy/marketplace/ClosingCostVisualizer";

const STAGE_COLOR_MAP = {
  emerald: { ring: "ring-emerald-500/40", bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300", dot: "bg-emerald-400", badge: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" },
  blue:    { ring: "ring-blue-500/40",    bg: "bg-blue-500/10",    border: "border-blue-500/30",    text: "text-blue-300",    dot: "bg-blue-400",    badge: "bg-blue-500/20 border-blue-500/30 text-blue-300" },
  purple:  { ring: "ring-purple-500/40",  bg: "bg-purple-500/10",  border: "border-purple-500/30",  text: "text-purple-300",  dot: "bg-purple-400",  badge: "bg-purple-500/20 border-purple-500/30 text-purple-300" },
  amber:   { ring: "ring-amber-500/40",   bg: "bg-amber-500/10",   border: "border-amber-500/30",   text: "text-amber-300",   dot: "bg-amber-400",   badge: "bg-amber-500/20 border-amber-500/30 text-amber-300" },
  rose:    { ring: "ring-rose-500/40",    bg: "bg-rose-500/10",    border: "border-rose-500/30",    text: "text-rose-300",    dot: "bg-rose-400",    badge: "bg-rose-500/20 border-rose-500/30 text-rose-300" },
  slate:   { ring: "ring-slate-500/40",   bg: "bg-slate-500/10",   border: "border-slate-700",      text: "text-slate-400",   dot: "bg-slate-500",   badge: "bg-slate-700/40 border-slate-600 text-slate-400" },
};

function SmartBadge({ phase }) {
  const suggested = PHASE_SMART_SUGGESTIONS[phase] || [];
  if (!suggested.length) return null;
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
      <Sparkles className="h-3 w-3 text-violet-400" />
      <span className="text-[10px] font-black text-violet-300 uppercase tracking-widest">AI Picks</span>
    </div>
  );
}

function StageBlock({ stage, services, savingsPool, searchActive }) {
  const [open, setOpen] = useState(false);
  const colors = STAGE_COLOR_MAP[stage.color] || STAGE_COLOR_MAP.slate;
  const suggested = PHASE_SMART_SUGGESTIONS[stage.id] || [];
  const available = services.filter(s => !s.comingSoon);

  // Auto-open when searching
  const isOpen = searchActive || open;

  return (
    <div className={`rounded-2xl border overflow-hidden transition-all duration-200 ${isOpen ? `${colors.border} ${colors.ring}` : "border-slate-800"}`}>

      {/* Stage header — the "timeline row" */}
      <button
        onClick={() => !searchActive && setOpen(v => !v)}
        className={`w-full text-left px-5 py-4 flex items-start gap-4 transition-colors ${isOpen ? "bg-slate-900" : "bg-slate-900/60 hover:bg-slate-900"}`}
      >
        {/* Step indicator */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0 mt-0.5">
          <div className={`w-9 h-9 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center text-lg`}>
            {stage.icon}
          </div>
          <span className={`text-[9px] font-black uppercase tracking-widest ${colors.text}`}>Step {stage.step}</span>
        </div>

        {/* Stage info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-black text-white">{stage.label}</span>
            <SmartBadge phase={stage.id} />
            {stage.isClosing && (
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300">
                Tokens Applied Here
              </span>
            )}
          </div>

          {/* WHEN banner */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <Clock className="h-3 w-3 text-slate-500 flex-shrink-0" />
            <span className="text-[10px] text-slate-400 font-semibold">{stage.when}</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed hidden sm:block">{stage.description}</p>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] text-slate-500">{available.length} service{available.length !== 1 ? "s" : ""} available</span>
            {!searchActive && (
              <span className={`text-[10px] font-bold ${colors.text}`}>
                {isOpen ? "↑ Collapse" : "↓ Explore services"}
              </span>
            )}
          </div>
        </div>

        {/* Lock/open indicator */}
        {!searchActive && (
          <div className="flex-shrink-0">
            {isOpen
              ? <ChevronUp className="h-4 w-4 text-slate-500" />
              : <ChevronDown className="h-4 w-4 text-slate-500" />}
          </div>
        )}
      </button>

      {/* Services inside this stage */}
      {isOpen && (
        <div className="border-t border-slate-800">
          {/* Context note */}
          <div className={`px-5 py-3 ${colors.bg} border-b border-slate-800`}>
            <div className="flex items-start gap-2.5">
              <Clock className={`h-3.5 w-3.5 ${colors.text} flex-shrink-0 mt-0.5`} />
              <p className={`text-xs ${colors.text} leading-relaxed`}>
                <strong>When these services apply:</strong> {stage.description}
              </p>
            </div>
          </div>

          <div className="px-4 py-3 space-y-2 bg-slate-950/40">
            {services.map(service => {
              const isSuggested = suggested.includes(service.id);
              return (
                <div key={service.id} className={isSuggested ? "ring-1 ring-violet-500/30 rounded-xl" : ""}>
                  {isSuggested && (
                    <div className="px-3 py-1 bg-violet-500/10 border-x border-t border-violet-500/20 rounded-t-xl flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3 text-violet-400" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-violet-300">AI Recommended for This Stage</span>
                    </div>
                  )}
                  <ServiceCard
                    key={service.id}
                    service={service}
                    savingsPool={savingsPool}
                    roundedTop={!isSuggested}
                  />
                </div>
              );
            })}
          </div>

          {/* Closing cost visualizer — only on closing stage */}
          {stage.isClosing && (
            <div className="px-4 pb-4 bg-slate-950/40">
              <div className="flex items-center gap-2 mb-3 pt-1">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 px-2">Closing Cost Token Breakdown</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>
              <ClosingCostVisualizer savingsPool={savingsPool} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [savingsPool] = useState(750000 * 0.025);

  // Group services by their PRIMARY phase (first in phases array)
  const servicesByStage = useMemo(() => {
    const map = {};
    TRANSACTION_PHASES.forEach(s => { map[s.id] = []; });

    SERVICES.forEach(service => {
      // Put service in its first/primary phase
      const primaryPhase = service.phases?.[0];
      if (primaryPhase && map[primaryPhase] !== undefined) {
        map[primaryPhase].push(service);
      }
    });
    return map;
  }, []);

  // When searching, show flat filtered list
  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return SERVICES.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      s.category?.toLowerCase().includes(q) ||
      s.why_now?.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-orange-50 text-slate-900">

      {/* ── Header ── */}
      <div className="border-b border-yellow-200 bg-gradient-to-r from-yellow-100 to-orange-100 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-0.5">
                <div className="w-7 h-7 rounded-lg bg-yellow-300 border border-yellow-400 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-amber-700" />
                </div>
                <h1 className="text-lg font-black tracking-tight text-amber-900">Property Services Marketplace™</h1>
              </div>
              <p className="text-xs text-amber-800">Services organized by <strong className="text-amber-900">when they happen</strong> in your transaction · Token credits applied at closing</p>
            </div>
            <div className="flex items-center gap-2">
              <a href="/token-rewind" className="flex items-center gap-1 text-[10px] text-amber-700 hover:text-amber-800 font-black transition">
                <RotateCcw className="h-3 w-3" /> Token Rewind™
              </a>
              <a href="/smartbuy" className="px-4 py-2 rounded-lg bg-yellow-300 border border-yellow-400 text-amber-900 font-black text-xs hover:bg-yellow-200 transition">
                ← SmartBuy™
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Timeline explainer ── */}
        <div className="mb-6 rounded-2xl border border-yellow-300 bg-yellow-50 px-5 py-4 flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-yellow-200 border border-yellow-300 flex items-center justify-center flex-shrink-0 text-lg">📅</div>
          <div>
            <p className="text-sm font-black text-amber-900 mb-1">Services Are Unlocked as Your Transaction Progresses</p>
            <p className="text-xs text-amber-800 leading-relaxed">
              Each service below belongs to a specific stage of your home purchase. You cannot order an appraisal coordination service until you're under contract — and you cannot apply token credits toward closing costs until settlement day. Open each stage to see what's available to you right now.
            </p>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-700" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search services across all stages..."
            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-yellow-300 bg-white text-amber-900 placeholder-amber-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-600 hover:text-amber-900 transition text-xs">✕</button>
          )}
        </div>

        {/* ── Search results ── */}
        {searchResults !== null ? (
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
              {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{search}"
            </p>
            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl mb-2">🔍</p>
                <p className="text-amber-700 text-sm">No services match your search.</p>
                <button onClick={() => setSearch("")} className="mt-3 text-xs text-yellow-600 hover:text-amber-800 transition underline">Clear search</button>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map(s => (
                  <div key={s.id}>
                    {/* Show which stage this belongs to */}
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[10px] text-slate-500">
                        {TRANSACTION_PHASES.find(st => st.id === s.phases?.[0])?.icon}{" "}
                        {TRANSACTION_PHASES.find(st => st.id === s.phases?.[0])?.label}
                      </span>
                    </div>
                    <ServiceCard service={s} savingsPool={savingsPool} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── Timeline view ── */
          <div className="space-y-3">
            {TRANSACTION_PHASES.map((stage, idx) => {
              const services = servicesByStage[stage.id] || [];
              if (services.length === 0) return null;
              return (
                <div key={stage.id} className="relative">
                  {/* Vertical connector line */}
                  {idx < TRANSACTION_PHASES.length - 1 && (
                    <div className="absolute left-7 top-full w-0.5 h-3 bg-yellow-300 z-10" />
                  )}
                  <StageBlock
                    stage={stage}
                    services={services}
                    savingsPool={savingsPool}
                    searchActive={false}
                  />
                </div>
              );
            })}

            {/* ── Final trust bar ── */}
            <div className="mt-8 rounded-2xl border border-yellow-300 bg-yellow-100 px-6 py-5">
              <div className="flex flex-wrap items-center justify-center gap-6 text-center">
                {[
                  { icon: "✅", label: "All Vendors Vetted", sub: "Licensed & insured" },
                  { icon: "🔒", label: "Token Rewind™", sub: "Replacement or refund guarantee" },
                  { icon: "📅", label: "Timeline-Aware", sub: "Services surfaced at the right time" },
                  { icon: "🤖", label: "AI-Guided", sub: "Phase-aware recommendations" },
                ].map(({ icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center gap-1 min-w-[100px]">
                   <span className="text-xl">{icon}</span>
                   <p className="text-[11px] font-black text-amber-900">{label}</p>
                   <p className="text-[10px] text-amber-700">{sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-center text-[10px] text-amber-700 mt-4 leading-relaxed">
              Token credits are applied from your SmartBuy™ Savings Pool at closing — never charged upfront.<br />
              BuyWiser Technology, Inc. · NMLS #1887767 · CA DRE #01107013
            </p>
          </div>
        )}
      </div>
    </div>
  );
}