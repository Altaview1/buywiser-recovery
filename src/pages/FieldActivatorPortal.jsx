import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MapPin, Phone, Camera, CheckCircle, Clock, X, Save, LogOut, Home, AlertCircle, Loader2, Upload } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

function AccessGate({ onAccess }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const activators = await base44.entities.FieldActivator.filter({ email: email.trim(), status: "active" });
    if (activators.length > 0) {
      onAccess(activators[0]);
    } else {
      setError("No active Field Activator account found.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: NAVY }}>
      <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto mb-6 opacity-60" />
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 text-center" style={{ background: NAVY }}>
          <p className="text-white font-black text-sm uppercase tracking-widest">Field Activator Portal</p>
          <p className="text-blue-300 text-xs mt-1">Door-knock tracking & visit logging</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 transition" />
          </div>
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full py-3.5 font-bold text-sm rounded-xl text-white transition disabled:opacity-50"
            style={{ background: loading ? "#888" : RED }}>
            {loading ? "Checking…" : "Access Portal"}
          </button>
        </form>
      </div>
    </div>
  );
}

function VisitLogger({ lead, activator, onSaved, onClose }) {
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [homeownerName, setHomeownerName] = useState("");
  const [homeownerPhone, setHomeownerPhone] = useState("");
  const [codeScanned, setCodeScanned] = useState(false);
  const [doorPhotoUrl, setDoorPhotoUrl] = useState("");
  const [callbackTime, setCallbackTime] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setDoorPhotoUrl(file_url);
    } catch (err) {
      alert("Photo upload failed: " + err.message);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!status) {
      alert("Please select a visit status");
      return;
    }
    setSaving(true);
    try {
      const visit = await base44.entities.Visit.create({
        lead_id: lead.id,
        activator_id: activator.id,
        visit_date: new Date().toISOString(),
        status,
        notes,
        homeowner_name: homeownerName || null,
        homeowner_phone: homeownerPhone || null,
        code_scanned: codeScanned,
        door_photo_url: doorPhotoUrl || null,
        callback_time: callbackTime ? new Date(callbackTime).toISOString() : null,
      });

      // Notify admin
      await base44.functions.invoke("notifyVisitLogged", {
        visit,
        lead,
        activator,
      });

      onSaved();
      onClose();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-200 sticky top-0" style={{ background: NAVY }}>
        <div>
          <p className="text-white font-bold text-sm">{lead.first_name} {lead.last_name}</p>
          <p className="text-blue-300 text-xs">{lead.property_address}</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
        
        {/* Visit Status */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Visit Outcome *</label>
          <div className="space-y-2 touch-manipulation">
            {[
              { val: "no_answer", label: "🚪 No Answer" },
              { val: "spoke_homeowner", label: "👤 Spoke with Homeowner" },
              { val: "code_scanned", label: "📱 Code Scanned" },
              { val: "not_interested", label: "❌ Not Interested" },
              { val: "callback_scheduled", label: "📅 Callback Scheduled" },
            ].map(opt => (
              <button key={opt.val} onClick={() => setStatus(opt.val)}
                className={`w-full py-3.5 sm:py-3 px-4 rounded-xl text-sm sm:text-base font-semibold border-2 text-left transition active:scale-95 ${
                  status === opt.val
                    ? "border-blue-600 bg-blue-50 text-blue-800"
                    : "border-slate-200 bg-white text-slate-700"
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Code Scanned */}
        {status === "code_scanned" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <input type="checkbox" id="codeScanned" checked={codeScanned} onChange={e => setCodeScanned(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer" />
              <label htmlFor="codeScanned" className="text-sm font-semibold text-green-700 flex-1">QR Code successfully scanned</label>
            </div>
          </div>
        )}

        {/* Homeowner Details */}
        {["spoke_homeowner", "code_scanned"].includes(status) && (
          <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Homeowner Details</p>
            <input placeholder="Full name (optional)" value={homeownerName} onChange={e => setHomeownerName(e.target.value)}
              className="w-full px-4 py-3.5 text-base border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white touch-manipulation" />
            <input type="tel" placeholder="Phone (optional)" value={homeownerPhone} onChange={e => setHomeownerPhone(e.target.value)}
              className="w-full px-4 py-3.5 text-base border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white touch-manipulation" />
          </div>
        )}

        {/* Callback Time */}
        {status === "callback_scheduled" && (
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Call Back When?</label>
            <input type="datetime-local" value={callbackTime} onChange={e => setCallbackTime(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
          </div>
        )}

        {/* Door Photo */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Door / Property Photo (optional)</label>
          {doorPhotoUrl ? (
            <div className="space-y-2">
              <img src={doorPhotoUrl} alt="Door" className="w-full rounded-lg h-48 object-cover border border-slate-200" />
              <button type="button" onClick={() => setDoorPhotoUrl("")}
                className="w-full py-2 text-xs font-bold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition">
                Remove Photo
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4 text-slate-400" />}
              <span className="text-xs font-bold text-slate-600">{uploading ? "Uploading…" : "Take / Upload Photo"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
            </label>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Visit Notes</label>
          <textarea placeholder="What happened at the door? Any important details?" value={notes} onChange={e => setNotes(e.target.value)} rows={4}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white resize-none" />
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="border-t border-slate-200 px-4 sm:px-6 py-3 space-y-2 touch-manipulation">
      <button onClick={handleSave} disabled={saving || !status}
        className="w-full py-4 sm:py-3 rounded-xl font-bold text-base sm:text-sm text-white transition disabled:opacity-40 active:scale-95 flex items-center justify-center gap-2"
        style={{ background: NAVY }}>
        <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save Visit"}
      </button>
      <button onClick={onClose}
        className="w-full py-4 sm:py-3 rounded-xl font-bold text-base sm:text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition">
        Cancel
      </button>
      </div>
    </div>
  );
}

export default function FieldActivatorPortal() {
  const [activator, setActivator] = useState(null);
  const [leads, setLeads] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showVisitLogger, setShowVisitLogger] = useState(false);

  const fetchData = async (a) => {
    setLoading(true);
    const [leadsData, visitsData] = await Promise.all([
      base44.entities.ActivatorLead.filter({ rep_code: a.rep_code }, "-created_date", 100),
      base44.entities.Visit.filter({ activator_id: a.id }, "-visit_date", 200),
    ]);
    setLeads(leadsData);
    setVisits(visitsData);
    setLoading(false);
  };

  const handleAccess = (a) => {
    setActivator(a);
    fetchData(a);
  };

  if (!activator) return <AccessGate onAccess={handleAccess} />;

  // Stats
  const unvisited = leads.filter(l => !visits.some(v => v.lead_id === l.id)).length;
  const visited = leads.length - unvisited;
  const today = new Date().toDateString();
  const todayVisits = visits.filter(v => new Date(v.visit_date).toDateString() === today).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {showVisitLogger && selectedLead && (
        <VisitLogger
          lead={selectedLead}
          activator={activator}
          onSaved={() => fetchData(activator)}
          onClose={() => { setShowVisitLogger(false); setSelectedLead(null); }}
        />
      )}

      {/* Header */}
      <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-slate-200 sticky top-0 z-10 bg-white">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 truncate">Field Activator</p>
            <p className="text-sm sm:text-base font-bold text-slate-800 truncate">{activator.name}</p>
          </div>
          <button onClick={() => setActivator(null)} className="flex items-center gap-1 px-2.5 sm:px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition whitespace-nowrap">
            <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-100 rounded-lg px-2 py-2.5 text-center touch-manipulation">
            <p className="text-base sm:text-lg font-black text-slate-800">{leads.length}</p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
          <div className="bg-green-100 rounded-lg px-2 py-2.5 text-center touch-manipulation">
            <p className="text-base sm:text-lg font-black text-green-700">{visited}</p>
            <p className="text-xs text-green-600">Visited</p>
          </div>
          <div className="bg-amber-100 rounded-lg px-2 py-2.5 text-center touch-manipulation">
            <p className="text-base sm:text-lg font-black text-amber-700">{todayVisits}</p>
            <p className="text-xs text-amber-600">Today</p>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Home className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No leads assigned yet</p>
          </div>
        ) : (
          leads.map(lead => {
            const leadVisits = visits.filter(v => v.lead_id === lead.id).sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date));
            const lastVisit = leadVisits[0];
            
            return (
              <div key={lead.id} className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-sm active:shadow-md transition-shadow touch-manipulation">
                {/* Lead Info */}
                <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm sm:text-base truncate">{lead.first_name} {lead.last_name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="h-3 w-3 flex-shrink-0" /> <span className="truncate">{lead.property_address}</span>
                    </p>
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 mt-1.5 active:bg-blue-100 rounded px-1 py-0.5 transition">
                        <Phone className="h-3 w-3 flex-shrink-0" /> {lead.phone}
                      </a>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {lastVisit ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 whitespace-nowrap">
                        <CheckCircle className="h-3 w-3" /> <span className="hidden sm:inline">Visited</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 whitespace-nowrap">
                        <Clock className="h-3 w-3" /> <span className="hidden sm:inline">Pending</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Last Visit Summary */}
                {lastVisit && (
                  <div className="bg-slate-50 rounded-lg px-3 py-2 mb-2 sm:mb-3 text-xs">
                    <p className="font-bold text-slate-700 mb-1 text-xs sm:text-sm">Last: {new Date(lastVisit.visit_date).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    <p className="text-slate-600 text-xs truncate">
                      <strong>{lastVisit.status.replace(/_/g, " ")}</strong>
                      {lastVisit.notes && ` — ${lastVisit.notes.slice(0, 40)}…`}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 touch-manipulation">
                  <button onClick={() => { setSelectedLead(lead); setShowVisitLogger(true); }}
                    className="flex-1 py-3 sm:py-2.5 rounded-lg font-bold text-sm text-white transition active:opacity-80"
                    style={{ background: NAVY }}>
                    + Log Visit
                  </button>
                  {lastVisit && (
                    <button onClick={() => alert(`Last visit: ${lastVisit.status}\n\n${lastVisit.notes}`)}
                      className="px-3 sm:px-4 py-3 sm:py-2.5 rounded-lg font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 active:bg-slate-100 transition">
                      <span className="hidden sm:inline">History</span>
                      <span className="sm:hidden">↓</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}