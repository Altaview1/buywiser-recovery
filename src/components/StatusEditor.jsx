import { useState } from "react";
import { X, Save } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_COLORS = {
  SCANNED: "bg-slate-100 text-slate-600",
  VERIFIED: "bg-blue-100 text-blue-700",
  QUALIFIED: "bg-amber-100 text-amber-700",
  SCHEDULED: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  CLOSED: "bg-emerald-100 text-emerald-800",
};

export default function StatusEditor({ lead, isOpen, onClose, onSaved }) {
  const [selectedStatus, setSelectedStatus] = useState(lead?.status || "SCANNED");
  const [saving, setSaving] = useState(false);

  if (!isOpen || !lead) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.ActivatorLead.update(lead.id, { status: selectedStatus });
      onSaved?.();
      onClose();
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between bg-slate-900">
          <div>
            <p className="text-white font-bold text-sm">{lead.first_name} {lead.last_name}</p>
            <p className="text-blue-300 text-xs mt-0.5">{lead.property_address}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Select New Status</p>
            <div className="space-y-2">
              {["SCANNED", "VERIFIED", "QUALIFIED", "SCHEDULED", "COMPLETED", "CLOSED"].map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-semibold border-2 text-left transition ${
                    selectedStatus === status
                      ? `border-blue-600 bg-blue-50 text-blue-800`
                      : `border-slate-200 bg-white text-slate-700 hover:border-slate-300`
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving || selectedStatus === lead.status}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Status"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}