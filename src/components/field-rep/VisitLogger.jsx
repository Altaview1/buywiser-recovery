import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Camera, Loader2, X } from "lucide-react";

const NAVY = "#0B1F3B";

const VISIT_OUTCOMES = [
  { val: "no_answer", label: "🚪 No Answer", color: "bg-slate-100 text-slate-700" },
  { val: "spoke_homeowner", label: "👤 Spoke with Homeowner", color: "bg-green-100 text-green-700" },
  { val: "code_scanned", label: "📱 Code Scanned", color: "bg-blue-100 text-blue-700" },
  { val: "not_interested", label: "❌ Not Interested", color: "bg-red-100 text-red-700" },
  { val: "callback_scheduled", label: "📅 Callback Scheduled", color: "bg-purple-100 text-purple-700" },
];

export default function VisitLogger({ lead, rep, onBack, onComplete }) {
  const [outcome, setOutcome] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setPhoto(file_url);
    } catch (err) {
      alert("Photo upload failed: " + err.message);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!outcome) {
      alert("Please select a visit outcome");
      return;
    }

    setSaving(true);
    try {
      // Create visit record
      const visit = await base44.entities.Visit.create({
        lead_id: lead.id,
        activator_id: rep.id,
        visit_date: new Date().toISOString(),
        status: outcome,
        notes,
        door_photo_url: photo || null,
        code_scanned: outcome === "code_scanned",
      });

      // Update lead status based on outcome
      let newStatus = "VERIFIED";
      if (outcome === "not_interested") newStatus = "CLOSED";
      else if (outcome === "code_scanned") newStatus = "QUALIFIED";

      await base44.entities.ActivatorLead.update(lead.id, { status: newStatus });

      // Notify admin of status change
      await base44.functions.invoke("notifyOnAnyChange", {
        event: { type: "update", entity_name: "ActivatorLead", entity_id: lead.id },
        data: {
          status: newStatus,
          rep_code: rep.rep_code,
          visit_outcome: outcome,
        },
      });

      onComplete();
    } catch (err) {
      alert("Failed to log visit: " + err.message);
      setSaving(false);
    }
  };

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
          <p className="text-sm font-bold text-slate-800">Log Visit</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Address */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Property</p>
            <p className="text-sm font-bold text-slate-900 mb-1">{lead.property_address}</p>
            <p className="text-xs text-slate-600">
              {lead.first_name} {lead.last_name}
            </p>
          </div>

          {/* Visit Outcome */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">What happened?</p>
            <div className="space-y-2">
              {VISIT_OUTCOMES.map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setOutcome(opt.val)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-semibold border-2 text-left transition ${
                    outcome === opt.val
                      ? `border-blue-600 ${opt.color}`
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Photo Evidence (optional)</p>
            {photo ? (
              <div className="space-y-2">
                <img src={photo} alt="Visit photo" className="w-full rounded-lg h-48 object-cover border border-slate-200" />
                <button
                  onClick={() => setPhoto(null)}
                  className="w-full py-2 text-xs font-bold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  Remove Photo
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 text-slate-400" />
                )}
                <span className="text-xs font-bold text-slate-600">
                  {uploading ? "Uploading…" : "Take / Upload Photo"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes (optional)</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What happened at the door? Any details?"
              rows={4}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="space-y-2 pb-4">
            <button
              onClick={handleSave}
              disabled={saving || !outcome}
              className="w-full py-4 rounded-lg font-bold text-sm text-white transition disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: saving ? "#888" : NAVY }}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {saving ? "Saving…" : "Save Visit"}
            </button>
            <button
              onClick={onBack}
              className="w-full py-3 rounded-lg font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}