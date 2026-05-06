import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { MapPin, Phone, Camera, CheckCircle, Clock, X, Save, LogOut, Home, AlertCircle, Loader2, ShieldAlert, Timer } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";
const MIN_VISIT_SECONDS = 45;

const ATTEMPT_OUTCOMES = [
  { val: "NO_ANSWER",          label: "🚪 No Answer",            requiresPhoto: true },
  { val: "HOMEOWNER_ANSWERED", label: "👤 Homeowner Answered",   requiresPhoto: false },
  { val: "OCCUPANT_ANSWERED",  label: "👥 Occupant Answered",    requiresPhoto: false },
  { val: "REFUSED",            label: "❌ Refused / Not Interested", requiresPhoto: false },
  { val: "INACCESSIBLE",       label: "🚧 Inaccessible",         requiresPhoto: true },
  { val: "OTHER",              label: "📝 Other",                requiresPhoto: false },
];

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

function DoorAttemptLogger({ lead, activator, onSaved, onClose }) {
  const [knockConfirmed, setKnockConfirmed] = useState(false);
  const [outcome, setOutcome] = useState("");
  const [notes, setNotes] = useState("");
  const [homeownerName, setHomeownerName] = useState("");
  const [homeownerPhone, setHomeownerPhone] = useState("");
  const [proofPhotoUrl, setProofPhotoUrl] = useState("");
  const [callbackTime, setCallbackTime] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef(null);

  // Timer — starts when component mounts (FA arrived at property)
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const selectedOutcome = ATTEMPT_OUTCOMES.find(o => o.val === outcome);
  const requiresPhoto = selectedOutcome?.requiresPhoto;
  const photoMissing = requiresPhoto && !proofPhotoUrl;
  const belowMinDuration = elapsedSeconds < MIN_VISIT_SECONDS;
  const canSave = knockConfirmed && outcome && !photoMissing;

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setProofPhotoUrl(file_url);
    } catch (err) {
      alert("Photo upload failed: " + err.message);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);

    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const shouldFlag = duration < MIN_VISIT_SECONDS;

    try {
      // Create visit record
      const visit = await base44.entities.Visit.create({
        lead_id: lead.id,
        activator_id: activator.id,
        visit_date: new Date().toISOString(),
        status: outcome.toLowerCase(),
        notes,
        homeowner_name: homeownerName || null,
        homeowner_phone: homeownerPhone || null,
        door_photo_url: proofPhotoUrl || null,
        callback_time: callbackTime ? new Date(callbackTime).toISOString() : null,
        code_scanned: false,
      });

      // Update lead with attempt data
      let newStatus = "VERIFIED";
      if (outcome === "REFUSED") newStatus = "CLOSED";

      await base44.entities.ActivatorLead.update(lead.id, {
        status: newStatus,
        knock_attempt_confirmed: true,
        attempt_outcome: outcome,
        visit_duration_seconds: duration,
        proof_photo_url: proofPhotoUrl || null,
        audit_flag: shouldFlag,
      });

      // Create VERIFIED_DOOR_ATTEMPT payment for Tier 1 only
      if (activator.activator_tier === "FIELD_ACTIVATOR" || !activator.activator_tier) {
        const existing = await base44.entities.ActivatorPayment.filter({ lead_id: lead.id, type: "VERIFIED_DOOR_ATTEMPT" });
        if (existing.length === 0) {
          await base44.entities.ActivatorPayment.create({
            activator_id: activator.id,
            lead_id: lead.id,
            rep_code: activator.rep_code,
            type: "VERIFIED_DOOR_ATTEMPT",
            amount: 15,
            status: shouldFlag ? "PENDING_AUDIT" : "PENDING",
            visit_duration_seconds: duration,
            attempt_outcome: outcome,
            notes: shouldFlag ? `Auto-flagged: visit duration ${duration}s < ${MIN_VISIT_SECONDS}s minimum` : null,
          });
        }
      }

      // Notify admin
      await base44.functions.invoke("notifyVisitLogged", { visit, lead, activator });

      onSaved();
      onClose();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
    setSaving(false);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

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

      {/* Timer bar */}
      <div className={`px-4 py-2 flex items-center justify-between text-xs font-bold ${elapsedSeconds >= MIN_VISIT_SECONDS ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
        <div className="flex items-center gap-1.5">
          <Timer className="h-3.5 w-3.5" />
          <span>Time at property: {formatTime(elapsedSeconds)}</span>
        </div>
        {elapsedSeconds >= MIN_VISIT_SECONDS
          ? <span>✓ Minimum met</span>
          : <span>{MIN_VISIT_SECONDS - elapsedSeconds}s remaining for full credit</span>}
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">

        {/* Policy reminder */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <p className="text-xs font-bold text-slate-700 mb-0.5">You are paid for verified door attempts, not simple packet delivery.</p>
          <p className="text-xs text-slate-500">Every verified door attempt requires a real knock/ring attempt and accurate logging.</p>
        </div>

        {/* Step 1 — Knock confirmation */}
        <div className="bg-white border-2 rounded-xl p-4 space-y-3" style={{ borderColor: knockConfirmed ? "#16a34a" : "#e2e8f0" }}>
          <p className="text-xs font-black uppercase tracking-wider text-slate-600">Step 1 — Confirm Knock / Ring *</p>
          <button
            onClick={() => setKnockConfirmed(!knockConfirmed)}
            className={`w-full py-4 rounded-xl font-bold text-sm border-2 transition flex items-center justify-center gap-2 ${
              knockConfirmed ? "bg-green-50 border-green-500 text-green-800" : "bg-white border-slate-300 text-slate-600"
            }`}>
            {knockConfirmed ? <CheckCircle className="h-5 w-5 text-green-600" /> : <div className="w-5 h-5 rounded-full border-2 border-slate-300" />}
            {knockConfirmed ? "✓ Knock / Ring Confirmed" : "Tap to Confirm You Knocked or Rang"}
          </button>
        </div>

        {/* Step 2 — Outcome */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          <p className="text-xs font-black uppercase tracking-wider text-slate-600">Step 2 — Select Attempt Outcome *</p>
          {ATTEMPT_OUTCOMES.map(opt => (
            <button key={opt.val} onClick={() => setOutcome(opt.val)}
              className={`w-full py-3.5 px-4 rounded-xl text-sm font-semibold border-2 text-left transition ${
                outcome === opt.val ? "border-blue-600 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-700"
              }`}>
              {opt.label}
              {opt.requiresPhoto && <span className="ml-2 text-xs text-amber-600 font-bold">(photo required)</span>}
            </button>
          ))}
        </div>

        {/* Homeowner details if answered */}
        {["HOMEOWNER_ANSWERED", "OCCUPANT_ANSWERED"].includes(outcome) && (
          <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Contact Details (optional)</p>
            <input placeholder="Name" value={homeownerName} onChange={e => setHomeownerName(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
            <input type="tel" placeholder="Phone" value={homeownerPhone} onChange={e => setHomeownerPhone(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
          </div>
        )}

        {/* Callback */}
        {outcome === "HOMEOWNER_ANSWERED" && (
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Callback Time (optional)</label>
            <input type="datetime-local" value={callbackTime} onChange={e => setCallbackTime(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white" />
          </div>
        )}

        {/* Step 3 — Photo */}
        <div className={`bg-white border-2 rounded-xl p-4 space-y-3 ${requiresPhoto && !proofPhotoUrl ? "border-amber-400" : "border-slate-200"}`}>
          <p className="text-xs font-black uppercase tracking-wider text-slate-600">
            Step 3 — Proof Photo {requiresPhoto ? <span className="text-amber-600">* Required</span> : "(optional)"}
          </p>
          {requiresPhoto && !proofPhotoUrl && (
            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
              📸 Photo required for "{selectedOutcome?.label}" — show packet placement and property surroundings.
            </p>
          )}
          {proofPhotoUrl ? (
            <div className="space-y-2">
              <img src={proofPhotoUrl} alt="Proof" className="w-full rounded-lg h-48 object-cover border border-slate-200" />
              <button onClick={() => setProofPhotoUrl("")}
                className="w-full py-2 text-xs font-bold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition">
                Remove Photo
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-2 px-4 py-4 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4 text-slate-400" />}
              <span className="text-sm font-bold text-slate-600">{uploading ? "Uploading…" : "Take / Upload Photo"}</span>
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
            </label>
          )}
        </div>

        {/* Notes */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-black uppercase tracking-wider text-slate-600 mb-2">Visit Notes</p>
          <textarea placeholder="What happened at the door? Important details…" value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white resize-none" />
        </div>

        {/* Duration warning */}
        {belowMinDuration && knockConfirmed && outcome && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-800">Short visit detected ({elapsedSeconds}s)</p>
              <p className="text-xs text-amber-700">Payment will be flagged for admin review. Stay at the property until the timer reaches {MIN_VISIT_SECONDS}s for automatic approval.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 px-4 py-3 space-y-2">
        <button onClick={handleSave} disabled={saving || !canSave}
          className="w-full py-4 rounded-xl font-bold text-base text-white transition disabled:opacity-40 active:scale-95 flex items-center justify-center gap-2"
          style={{ background: NAVY }}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Submit Door Attempt"}
        </button>
        {!canSave && !saving && (
          <p className="text-xs text-center text-slate-400">
            {!knockConfirmed ? "Confirm knock/ring above" : !outcome ? "Select an outcome" : photoMissing ? "Upload required proof photo" : ""}
          </p>
        )}
        <button onClick={onClose}
          className="w-full py-3 rounded-xl font-bold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
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
  const [showLogger, setShowLogger] = useState(false);

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

  const handleAccess = (a) => { setActivator(a); fetchData(a); };

  if (!activator) return <AccessGate onAccess={handleAccess} />;

  const unvisited = leads.filter(l => !visits.some(v => v.lead_id === l.id)).length;
  const visited = leads.length - unvisited;
  const today = new Date().toDateString();
  const todayVisits = visits.filter(v => new Date(v.visit_date).toDateString() === today).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {showLogger && selectedLead && (
        <DoorAttemptLogger
          lead={selectedLead}
          activator={activator}
          onSaved={() => fetchData(activator)}
          onClose={() => { setShowLogger(false); setSelectedLead(null); }}
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

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-100 rounded-lg px-2 py-2.5 text-center">
            <p className="text-base sm:text-lg font-black text-slate-800">{leads.length}</p>
            <p className="text-xs text-slate-500">Assigned</p>
          </div>
          <div className="bg-green-100 rounded-lg px-2 py-2.5 text-center">
            <p className="text-base sm:text-lg font-black text-green-700">{visited}</p>
            <p className="text-xs text-green-600">Attempted</p>
          </div>
          <div className="bg-amber-100 rounded-lg px-2 py-2.5 text-center">
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
            const isAuditFlagged = lead.audit_flag;

            return (
              <div key={lead.id} className={`bg-white border rounded-xl p-3 sm:p-4 shadow-sm transition-shadow touch-manipulation ${isAuditFlagged ? "border-amber-300" : "border-slate-200"}`}>
                <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-bold text-slate-900 text-sm truncate">{lead.first_name} {lead.last_name}</p>
                      {isAuditFlagged && <span className="text-xs font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded flex-shrink-0">⚑ Flagged</span>}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="h-3 w-3 flex-shrink-0" /> <span className="truncate">{lead.property_address}</span>
                    </p>
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-1.5">
                        <Phone className="h-3 w-3" /> {lead.phone}
                      </a>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    {lastVisit ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3" /> Attempted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    )}
                  </div>
                </div>

                {lastVisit && (
                  <div className="bg-slate-50 rounded-lg px-3 py-2 mb-2 sm:mb-3 text-xs">
                    <p className="font-bold text-slate-700 mb-0.5">
                      Last: {new Date(lastVisit.visit_date).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </p>
                    <p className="text-slate-600 truncate">
                      <strong>{(lead.attempt_outcome || lastVisit.status || "").replace(/_/g, " ")}</strong>
                      {lead.visit_duration_seconds && <span className="text-slate-400 ml-1">· {lead.visit_duration_seconds}s</span>}
                      {lastVisit.notes && ` — ${lastVisit.notes.slice(0, 40)}…`}
                    </p>
                    {lastVisit.door_photo_url && (
                      <img src={lastVisit.door_photo_url} alt="Property" className="w-full rounded-lg h-20 object-cover border border-slate-200 mt-2" />
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <button onClick={() => { setSelectedLead(lead); setShowLogger(true); }}
                    className="flex-1 py-3 sm:py-2.5 rounded-lg font-bold text-sm text-white transition active:opacity-80"
                    style={{ background: NAVY }}>
                    + Log Door Attempt
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}