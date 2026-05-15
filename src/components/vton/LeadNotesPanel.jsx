import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Save, X, StickyNote } from "lucide-react";

export default function LeadNotesPanel({ lead, onClose, onSaved }) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.VTONLead.update(lead.id, { notes });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (onSaved) onSaved(lead.id, notes);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-amber-500" />
            <div>
              <p className="font-bold text-slate-900 text-sm">{lead.first_name} {lead.last_name}</p>
              <p className="text-xs text-slate-500">{lead.property_address}, {lead.city}, {lead.state}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notes area */}
        <div className="p-6">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Notes &amp; Reminders
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes, reminders, or next steps for this lead..."
            className="w-full h-48 px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            autoFocus
          />
          <p className="text-xs text-slate-400 mt-1">{notes.length} characters</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 pb-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : saved ? "✓ Saved" : "Save Notes"}
          </button>
        </div>
      </div>
    </div>
  );
}