import { useState } from "react";
import { motion } from "framer-motion";
import { X, Phone, Lock, Unlock, CheckCircle, Loader2, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PROFESSIONALS = [
  {
    id: "mortgage",
    icon: "🏦",
    name: "Mortgage Consultation",
    expert: "Bennett Liss",
    title: "30-Year CA Mortgage Expert · NMLS #1524446",
    description: "Rate strategy, pre-approval review, loan program comparison, or any financing question — answered by Bennett's team directly.",
    value: "Ensures you get the best rate and terms for your situation, potentially saving thousands over the life of the loan.",
    cashCost: 0.08,
    deliveryMethod: "Call or text within 2 hours",
    phone: "tel:+18183002642",
    isOptional: true,
  },
  {
    id: "agent",
    icon: "🏡",
    name: "Buyer Agent Support",
    expert: "Compass / Keller Williams",
    title: "Licensed CA Buyer's Agent",
    description: "Tour scheduling, offer negotiation strategy, local market insight, or representation on a specific property.",
    value: "Expert negotiation and market knowledge help you avoid overpaying and navigate complex local conditions.",
    cashCost: 0.12,
    deliveryMethod: "Agent assigned within 4 hours",
    phone: null,
    isOptional: true,
  },
  {
    id: "offer",
    icon: "✍️",
    name: "Offer Strategy Review",
    expert: "Bennett + Partner Agent",
    title: "Financing + Negotiation Alignment",
    description: "A coordinated review of your offer price, contingencies, financing terms, and competitive positioning before you submit.",
    value: "Professional alignment ensures your offer is competitive while protecting you with proper contingencies.",
    cashCost: 0.10,
    deliveryMethod: "Video or phone call within 24 hours",
    phone: null,
    isOptional: true,
  },
  {
    id: "legal",
    icon: "⚖️",
    name: "Real Estate Legal Review",
    expert: "RE Law Firm Partner",
    title: "Licensed CA Real Estate Attorney",
    description: "Contract clause review, title concerns, disclosure questions, or dispute resolution — by a licensed real estate attorney.",
    value: "Legal expertise identifies hidden risks in contracts and disclosures, protecting your investment.",
    cashCost: 0.09,
    deliveryMethod: "Attorney response within 1 business day",
    phone: null,
    isOptional: true,
  },
];

function formatCurrency(n) {
  return Number(n).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function UnlockModal({ isOpen, onClose, savingsPool, cashSpent, onUnlock }) {
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  const remaining = savingsPool - cashSpent;
  const selectedPro = PROFESSIONALS.find(p => p.id === selected);
  const serviceCost = selectedPro ? Math.round(savingsPool * selectedPro.cashCost) : 0;

  const handleConfirm = async () => {
    if (!name || !phone) return;
    setLoading(true);
    const cost = Math.round(savingsPool * selectedPro.cashCost);

    await base44.functions.invoke("notifySmartBuyUnlock", {
      buyerName: name,
      buyerPhone: phone,
      serviceName: selectedPro.name,
      expert: selectedPro.expert,
      note: note || "",
      serviceCost: cost,
      poolRemaining: remaining - cost,
    }).catch(() => {});

    setLoading(false);
    setConfirmed(true);
    onUnlock && onUnlock(cost);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-lg bg-slate-900 border border-slate-700 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Unlock className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-black text-white">Unlock Professional Help</p>
              <p className="text-[10px] text-slate-500">
                Pool: <span className="text-emerald-400 font-bold">{formatCurrency(remaining)}</span> remaining
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 transition text-slate-400">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {confirmed ? (
            /* Success state */
            <div className="px-5 py-10 text-center">
              {/* Celebratory Badge for Optional Services */}
              {selectedPro?.isOptional && (
                <div className="mb-5 relative inline-block">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="relative"
                  >
                    <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-emerald-400 to-blue-400 rounded-full blur-md opacity-75 animate-pulse" />
                    <div className="relative px-5 py-3 bg-gradient-to-r from-amber-300 to-emerald-300 rounded-full border-2 border-white shadow-lg">
                      <p className="text-sm font-black text-slate-900 tracking-tight">💰 MONEY WELL SPENT!</p>
                    </div>
                  </motion.div>
                  {/* Floating particles */}
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-lg pointer-events-none"
                      initial={{ opacity: 1, scale: 1 }}
                      animate={{ opacity: 0, scale: 0, y: -80, x: Math.cos(i * 1.57) * 60 }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      style={{
                        left: "50%",
                        top: "50%",
                        marginLeft: "-12px",
                        marginTop: "-12px",
                      }}
                    >
                      {["💚", "🎯", "⚡", "🏆"][i]}
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-7 w-7 text-emerald-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">You're Connected!</h3>
              <p className="text-sm text-slate-400 mb-1">
                <strong className="text-slate-300">{selectedPro?.expert}</strong> has been notified and will reach out to <strong className="text-slate-300">{phone}</strong>.
              </p>
              <p className="text-xs text-slate-500 mb-1">{selectedPro?.deliveryMethod}</p>
              <div className="mt-5 bg-slate-800 rounded-xl px-4 py-3 text-left">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Service cost</span>
                  <span className="text-red-400 font-bold">− {formatCurrency(serviceCost)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">New pool balance</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(remaining - serviceCost)}</span>
                </div>
              </div>
              {selectedPro?.phone && (
                <a href={selectedPro.phone}
                  className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-slate-900 font-black rounded-xl text-sm hover:bg-amber-300 transition">
                  <Phone className="h-3.5 w-3.5" /> Call Now
                </a>
              )}
              <button onClick={onClose} className="mt-3 block w-full text-xs text-slate-600 hover:text-slate-400 transition py-1">Close</button>
            </div>

          ) : selected ? (
            /* Confirmation step */
            <div className="px-5 py-5">
              <button onClick={() => setSelected(null)} className="text-xs text-slate-500 hover:text-slate-300 transition mb-4">← Back</button>

              <div className="bg-slate-800 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{selectedPro.icon}</span>
                  <div>
                    <p className="text-sm font-black text-white">{selectedPro.name}</p>
                    <p className="text-xs text-slate-400">{selectedPro.expert}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{selectedPro.description}</p>
                <div className="flex items-center justify-between border-t border-slate-700 pt-3">
                  <span className="text-xs text-slate-500">Service cost</span>
                  <span className="text-base font-black text-amber-400">{formatCurrency(serviceCost)}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-500">Pool after service</span>
                  <span className="text-sm font-bold text-emerald-400">{formatCurrency(remaining - serviceCost)}</span>
                </div>
              </div>

              {/* Gamification celebration for optional choices */}
              {selectedPro?.isOptional && (
                <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-2 border-emerald-400 rounded-xl p-3.5 mb-4 relative overflow-hidden">
                  <div className="absolute top-1 right-1 text-xl opacity-30 animate-pulse">🎯</div>
                  <p className="text-xs text-emerald-800 font-bold leading-relaxed">
                    🚀 <strong>Smart move!</strong> You're investing in expert guidance that could save you thousands. That's money well spent. You're playing to win.
                  </p>
                </div>
              )}

              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Your Name *</label>
                  <input
                    value={name} onChange={e => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Your Phone *</label>
                  <input
                    type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="(818) 555-0100"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Quick Note <span className="font-normal normal-case text-slate-600">(optional)</span></label>
                  <textarea
                    value={note} onChange={e => setNote(e.target.value)}
                    placeholder="What do you need help with?"
                    rows={2}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-700 bg-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500 transition resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleConfirm}
                disabled={!name || !phone || loading}
                className="w-full py-3.5 rounded-xl font-black text-sm text-slate-900 bg-amber-400 hover:bg-amber-300 transition flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Unlock className="h-4 w-4" /> Confirm Unlock · {formatCurrency(serviceCost)}</>}
              </button>
              <p className="text-[10px] text-slate-600 text-center mt-2">Service cost deducted from your Savings Pool at closing</p>
            </div>

          ) : (
             /* Service selection */
             <div className="px-5 py-4 space-y-3">
               <p className="text-xs text-slate-500 mb-4">Choose the type of help you need. The service cost is deducted from your Savings Pool — whatever remains is yours at closing.</p>
               <TooltipProvider>
                 {PROFESSIONALS.map(pro => {
                   const cost = Math.round(savingsPool * pro.cashCost);
                   const canAfford = remaining >= cost;
                   return (
                     <Tooltip key={pro.id}>
                       <TooltipTrigger asChild>
                         <button
                           onClick={() => canAfford && setSelected(pro.id)}
                           disabled={!canAfford}
                           className={`w-full text-left rounded-xl border p-4 transition ${canAfford ? "border-slate-700 bg-slate-800/50 hover:border-amber-500/50 hover:bg-slate-800" : "border-slate-800 bg-slate-900/30 opacity-40 cursor-not-allowed"}`}
                         >
                           <div className="flex items-start gap-3">
                             <span className="text-xl flex-shrink-0 mt-0.5">{pro.icon}</span>
                             <div className="flex-1 min-w-0">
                               <div className="flex items-center justify-between gap-2 mb-0.5">
                                 <p className="text-sm font-black text-white">{pro.name}</p>
                                 <span className="text-sm font-black text-amber-400 flex-shrink-0">{formatCurrency(cost)}</span>
                               </div>
                               <p className="text-[10px] text-slate-500 mb-1">{pro.expert} · {pro.title}</p>
                               <p className="text-xs text-slate-400 leading-snug">{pro.description}</p>
                               <p className="text-[10px] text-emerald-500 mt-1.5 font-semibold">{pro.deliveryMethod}</p>
                             </div>
                             <ArrowRight className="h-4 w-4 text-slate-600 flex-shrink-0 mt-0.5" />
                           </div>
                         </button>
                       </TooltipTrigger>
                       {canAfford && (
                         <TooltipContent side="left" className="max-w-xs bg-emerald-900 border-emerald-700 text-emerald-50">
                           <p className="text-sm font-semibold">{pro.value}</p>
                         </TooltipContent>
                       )}
                     </Tooltip>
                   );
                 })}
               </TooltipProvider>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}