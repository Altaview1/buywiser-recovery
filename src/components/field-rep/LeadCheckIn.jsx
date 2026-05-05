import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, MapPin, Check, Loader2 } from "lucide-react";

const NAVY = "#0B1F3B";
const GREEN = "#16a34a";

export default function LeadCheckIn({ lead, rep, onBack, onComplete }) {
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleCheckIn = async () => {
    setChecking(true);
    try {
      // Create a check-in visit record
      await base44.entities.Visit.create({
        lead_id: lead.id,
        activator_id: rep.id,
        visit_date: new Date().toISOString(),
        status: "code_scanned",
        notes: "Checked in via portal",
        code_scanned: true,
      });

      // Notify admin
      await base44.functions.invoke("notifyOnAnyChange", {
        event: { type: "update", entity_name: "ActivatorLead", entity_id: lead.id },
        data: { status: "VERIFIED", rep_code: rep.rep_code },
      });

      setChecked(true);
      setTimeout(() => onComplete(), 1500);
    } catch (err) {
      alert("Check-in failed: " + err.message);
      setChecking(false);
    }
  };

  if (checked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: GREEN }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-white" />
          </div>
          <p className="text-white text-xl font-black mb-2">Checked In!</p>
          <p className="text-white/80 text-sm">Ready for your visit at this property</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <p className="text-sm font-bold text-slate-800">Property Check-In</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 mb-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">You are at</p>
            <p className="text-lg font-bold text-slate-900">{lead.property_address}</p>
            <p className="text-sm text-slate-600">
              {lead.first_name} {lead.last_name}
            </p>
          </div>

          <button
            onClick={handleCheckIn}
            disabled={checking}
            className="w-full py-5 rounded-2xl font-black text-base text-white transition disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: checking ? "#888" : NAVY }}
          >
            {checking ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Checking In…
              </>
            ) : (
              <>
                <Check className="h-5 w-5" />
                Confirm Arrival
              </>
            )}
          </button>

          <button
            onClick={onBack}
            className="w-full mt-3 py-3 rounded-lg font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}