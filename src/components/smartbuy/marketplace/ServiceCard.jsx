import { useState } from "react";
import { Star, ChevronDown, ChevronUp, Zap, Lock, Loader2, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

function StarRating({ rating }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`h-3 w-3 ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-slate-700"}`} />
      ))}
      <span className="text-[10px] text-slate-400 ml-1">{rating}</span>
    </div>
  );
}

export default function ServiceCard({ service, savingsPool = 750000 * 0.025 }) {
  const [expanded, setExpanded] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const tokenCost = service.tokens ? Math.round(savingsPool * (service.tokens / 10000)) : 0;

  const handleUnlock = async () => {
    if (!name || !phone) return;
    setUnlocking(true);
    await base44.functions.invoke("notifySmartBuyUnlock", {
      buyerName: name,
      buyerPhone: phone,
      serviceName: service.name,
      expert: "SmartBuy™ Marketplace",
      note: `Category: ${service.category} | Phase: ${service.phases?.join(", ")}`,
      tokenCost: tokenCost,
      poolRemaining: savingsPool - tokenCost,
    }).catch(() => {});
    setUnlocking(false);
    setUnlocked(true);
  };

  const inputCls = "w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-violet-500 transition";

  return (
    <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${expanded ? "border-slate-600 bg-slate-800/60" : "border-slate-800 bg-slate-900 hover:border-slate-700"}`}>
      {/* Card top row */}
      <button className="w-full text-left px-4 py-3.5 flex items-start gap-3" onClick={() => !service.comingSoon && setExpanded(v => !v)}>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-sm font-black text-white leading-snug">{service.name}</span>
            {service.badge && (
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${service.badgeColor}`}>
                {service.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{service.description}</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {service.rating && <StarRating rating={service.rating} />}
            {service.reviews && <span className="text-[10px] text-slate-500">{service.reviews} reviews</span>}
            {service.experience && <span className="text-[10px] text-slate-500">· {service.experience}</span>}
            {service.deliveryTime && <span className="text-[10px] text-emerald-500 font-semibold">⏱ {service.deliveryTime}</span>}
          </div>
        </div>

        <div className="flex-shrink-0 text-right flex flex-col items-end gap-1.5">
          {service.comingSoon ? (
            <div className="flex items-center gap-1 text-slate-500">
              <Lock className="h-3.5 w-3.5" />
              <span className="text-xs font-black text-slate-500">Soon</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-400" />
                <span className="text-sm font-black text-amber-300">{service.tokens?.toLocaleString()} tokens</span>
              </div>
              <span className="text-[10px] text-slate-500">{service.pct} of savings</span>
            </>
          )}
          {!service.comingSoon && (
            expanded
              ? <ChevronUp className="h-3.5 w-3.5 text-slate-500 mt-1" />
              : <ChevronDown className="h-3.5 w-3.5 text-slate-500 mt-1" />
          )}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-800">
          {/* AI tip */}
          {service.aiTip && (
            <div className="mt-3 mb-3 flex items-start gap-2.5 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3">
              <span className="text-base flex-shrink-0">🤖</span>
              <p className="text-xs text-violet-200 leading-relaxed">{service.aiTip}</p>
            </div>
          )}

          {/* Certifications */}
          {service.certifications?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 mt-2">
              {service.certifications.map(c => (
                <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center gap-1">
                  <CheckCircle className="h-2.5 w-2.5 text-emerald-500" /> {c}
                </span>
              ))}
            </div>
          )}

          {/* Unlock form or success */}
          {unlocked ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-black text-white">Request Sent!</p>
                <p className="text-[10px] text-slate-400">A Buywiser specialist will contact {phone} to coordinate this service.</p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 mt-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Unlock This Service</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input className={inputCls} placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
                <input type="tel" className={inputCls} placeholder="Your phone" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <button
                onClick={handleUnlock}
                disabled={unlocking || !name || !phone}
                className="w-full py-2.5 rounded-lg font-black text-xs text-white bg-violet-600 hover:bg-violet-500 transition flex items-center justify-center gap-1.5 disabled:opacity-40"
              >
                {unlocking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Zap className="h-3.5 w-3.5" /> Unlock · {service.tokens?.toLocaleString()} tokens</>}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}