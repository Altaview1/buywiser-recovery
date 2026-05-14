import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { QRCodeSVG } from "qrcode.react";
import {
  QrCode, ScanLine, MapPin, CheckCircle, AlertCircle, RefreshCw,
  Save, Upload, Loader2, X, ExternalLink, User, Phone, ChevronDown,
  TrendingUp, Award
} from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

/* ─── Access Gate ─────────────────────────────────────────────────────── */
function AccessGate({ onAccess }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const results = await base44.entities.PartnerApplication.filter({
      email: email.toLowerCase().trim(),
      status: "approved",
    });
    if (results.length > 0) {
      onAccess(results[0]);
    } else {
      setError("No approved partner account found for this email.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-4" style={{ background: NAVY, zIndex: 9999 }}>
      <img
        src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
        alt="BuyWiser" className="h-8 w-auto mb-6 opacity-60"
      />
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 text-center" style={{ background: NAVY }}>
          <QrCode className="h-6 w-6 text-white/60 mx-auto mb-2" />
          <p className="text-white font-black text-sm uppercase tracking-widest">Agent QR Dashboard</p>
          <p className="text-blue-300 text-xs mt-1">Track scans &amp; manage your profile</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Your Partner Email
            </label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 transition"
            />
          </div>
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}
          <button
            type="submit" disabled={loading}
            className="w-full py-3.5 font-bold text-sm rounded-xl text-white transition disabled:opacity-50"
            style={{ background: loading ? "#888" : RED }}
          >
            {loading ? "Checking…" : "Access My Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Lead Status Definitions ─────────────────────────────────────────── */
const LEAD_STATUSES = [
  { value: "assigned",    label: "New",         color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "contacted",   label: "Contacted",   color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "conversation_verified", label: "In Progress", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "closed_won",  label: "Closed Won",  color: "bg-green-100 text-green-700 border-green-200" },
  { value: "closed_lost", label: "Closed Lost", color: "bg-red-100 text-red-700 border-red-200" },
];

/* ─── Lead Row ─────────────────────────────────────────────────────────── */
function LeadRow({ opp, onUpdate }) {
  const [status, setStatus] = useState(opp.opportunity_status || "assigned");
  const [saving, setSaving] = useState(false);
  const address = [opp.property_address, opp.city, opp.state].filter(Boolean).join(", ");

  const handleChange = async (newStatus) => {
    setStatus(newStatus);
    setSaving(true);
    await base44.entities.VTONOpportunity.update(opp.id, { opportunity_status: newStatus });
    setSaving(false);
    onUpdate({ ...opp, opportunity_status: newStatus });
  };

  const statusStyle = LEAD_STATUSES.find(x => x.value === status)?.color || "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      {/* Row 1: Name + phone */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{opp.homeowner_name || "Homeowner"}</p>
          {address && (
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{address}</span>
            </p>
          )}
        </div>
        {opp.homeowner_phone && (
          <a
            href={`tel:${opp.homeowner_phone}`}
            className="flex-shrink-0 p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-green-600 hover:border-green-300 transition"
            title="Call homeowner"
          >
            <Phone className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* Row 2: Badges + status selector */}
      <div className="flex flex-wrap items-center gap-2">
        {opp.qr_scanned && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle className="h-3 w-3" /> QR Scanned
          </span>
        )}
        <div className="relative ml-auto">
          <select
            value={status}
            onChange={e => handleChange(e.target.value)}
            disabled={saving}
            className={`appearance-none pl-3 pr-8 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer focus:outline-none disabled:opacity-60 transition ${statusStyle}`}
          >
            {LEAD_STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown className="h-3 w-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
        </div>
        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400 flex-shrink-0" />}
      </div>
    </div>
  );
}

/* ─── QR Card ──────────────────────────────────────────────────────────── */
function QRCard({ opp }) {
  const [showQR, setShowQR] = useState(false);
  const url = `${window.location.origin}/b?opp=${opp.id}`;
  const address = [opp.property_address, opp.city, opp.state].filter(Boolean).join(", ");

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      {/* Top row: icon + info + actions */}
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${opp.qr_scanned ? "bg-green-100" : "bg-slate-100"}`}>
          {opp.qr_scanned
            ? <ScanLine className="h-5 w-5 text-green-600" />
            : <QrCode className="h-5 w-5 text-slate-400" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{opp.homeowner_name || "Homeowner"}</p>
          {address && (
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{address}</span>
            </p>
          )}
        </div>

        {/* Action buttons — stacked vertically to avoid overflow */}
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <a
            href={url} target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 transition"
            title="Preview page"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={() => setShowQR(true)}
            className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg text-white transition"
            style={{ background: NAVY }}
          >
            <QrCode className="h-3.5 w-3.5" /> QR
          </button>
        </div>
      </div>

      {/* Bottom row: scan status + benefit */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        {opp.qr_scanned ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle className="h-3 w-3" /> Scanned
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            Not yet scanned
          </span>
        )}
        {opp.estimated_price && (
          <span className="text-xs text-slate-400 ml-auto">
            Benefit ≈ ${Math.round(opp.estimated_price * 0.015).toLocaleString()}
          </span>
        )}
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.65)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: NAVY }}>
              <p className="text-white font-black text-sm">QR Code</p>
              <button
                onClick={() => setShowQR(false)}
                className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center gap-3">
              <div className="p-3 bg-white border-2 border-slate-200 rounded-xl">
                <QRCodeSVG value={url} size={180} bgColor="#ffffff" fgColor={NAVY} level="M" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">{opp.homeowner_name || "Homeowner"}</p>
                <p className="text-xs text-slate-400">{address}</p>
              </div>
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-blue-600 underline break-all text-center">{url}</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Profile Editor ───────────────────────────────────────────────────── */
function ProfileEditor({ agent, onSaved }) {
  const [form, setForm] = useState({
    name: agent.name || "",
    phone: agent.phone || "",
    title: agent.title || "",
    license_number: agent.license_number || "",
    photo_url: agent.photo_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, photo_url: file_url }));
    setUploading(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await base44.entities.PartnerApplication.update(agent.id, form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    onSaved({ ...agent, ...form });
  };

  const inputCls = "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white transition";
  const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1";

  return (
    <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Section header */}
      <div className="px-5 py-4 flex items-center gap-2" style={{ background: NAVY }}>
        <User className="h-4 w-4 text-white/60" />
        <p className="text-sm font-black text-white uppercase tracking-widest">My Contact Details</p>
      </div>

      <div className="p-5 space-y-5">
        {/* Photo row */}
        <div className="flex items-center gap-4">
          {form.photo_url
            ? <img src={form.photo_url} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 flex-shrink-0" />
            : <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-xl font-black text-slate-400 flex-shrink-0">
                {form.name?.charAt(0) || "A"}
              </div>
          }
          <div className="flex-1 space-y-2 min-w-0">
            <label className="inline-flex items-center gap-2 px-3 py-2 border-2 border-dashed border-slate-300 rounded-lg text-xs text-slate-600 hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {uploading ? "Uploading…" : "Upload Photo"}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
            <input
              type="url" className={inputCls} placeholder="Or paste photo URL…"
              value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))}
            />
          </div>
        </div>

        {/* Fields grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Full Name</label>
            <input required className={inputCls} value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input type="tel" className={inputCls} placeholder="(818) 555-1234"
              value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Title</label>
            <input className={inputCls} placeholder="VTON Partner Agent"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>RE License #</label>
            <input className={inputCls} placeholder="01234567"
              value={form.license_number} onChange={e => setForm(f => ({ ...f, license_number: e.target.value }))} />
          </div>
        </div>

        <div className="pt-1">
          <button
            type="submit" disabled={saving || uploading}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl text-white transition disabled:opacity-50"
            style={{ background: saved ? "#10b981" : NAVY }}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ─── Engagement Tab ───────────────────────────────────────────────────── */
function EngagementTab({ activators, activatorLeads }) {
  const ranked = activators.map(a => {
    const aLeads = activatorLeads.filter(l => l.rep_code === a.rep_code);
    const scans = aLeads.length;
    const verified = aLeads.filter(l => l.status !== "SCANNED").length;
    const scheduled = aLeads.filter(l => ["SCHEDULED", "COMPLETED", "CLOSED"].includes(l.status)).length;
    const closed = aLeads.filter(l => l.status === "CLOSED").length;
    const rate = scans > 0 ? Math.round((verified / scans) * 100) : 0;
    return { ...a, scans, verified, scheduled, closed, rate };
  }).sort((a, b) => b.verified - a.verified);

  if (ranked.length === 0) return (
    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
      <TrendingUp className="h-10 w-10 mx-auto mb-3 text-slate-200" />
      <p className="font-semibold text-slate-500">No Field Activator data yet</p>
      <p className="text-sm text-slate-400 mt-1">Engagement data will appear once activators start collecting scans.</p>
    </div>
  );

  const maxVerified = Math.max(...ranked.map(r => r.verified), 1);

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Ranked by verified leads</p>

      {/* Summary totals */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Scans", value: activatorLeads.length, color: "text-slate-800" },
          { label: "Verified", value: activatorLeads.filter(l => l.status !== "SCANNED").length, color: "text-blue-700" },
          { label: "Scheduled", value: activatorLeads.filter(l => ["SCHEDULED", "COMPLETED", "CLOSED"].includes(l.status)).length, color: "text-purple-700" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-3 text-center">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      {ranked.map((a, i) => (
        <div key={a.id} className="bg-white border border-slate-200 rounded-2xl p-4">
          {/* Activator header */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
              i === 0 ? "bg-amber-100 text-amber-700" :
              i === 1 ? "bg-slate-100 text-slate-600" :
              i === 2 ? "bg-orange-100 text-orange-600" :
              "bg-slate-50 text-slate-400"
            }`}>
              {i === 0 ? <Award className="h-4 w-4" /> : `#${i + 1}`}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{a.name}</p>
              <p className="text-xs text-slate-400 truncate">
                {a.assigned_area || "No area"} · <span className="font-mono">{a.rep_code}</span>
              </p>
            </div>
            <span className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-bold border ${
              a.rate >= 70 ? "bg-green-50 text-green-700 border-green-200" :
              a.rate >= 40 ? "bg-amber-50 text-amber-700 border-amber-200" :
              "bg-slate-100 text-slate-500 border-slate-200"
            }`}>{a.rate}%</span>
          </div>

          {/* Progress bar */}
          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(a.verified / maxVerified) * 100}%`, background: i === 0 ? "#f59e0b" : NAVY }}
            />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: "Scans", value: a.scans },
              { label: "Verified", value: a.verified },
              { label: "Scheduled", value: a.scheduled },
              { label: "Closed", value: a.closed },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-lg py-2">
                <p className="text-base font-black text-slate-800">{value}</p>
                <p className="text-[11px] text-slate-400 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Dashboard ───────────────────────────────────────────────────── */
const TABS = [
  { key: "qr",         label: "My QR Codes" },
  { key: "leads",      label: "Lead Status" },
  { key: "profile",    label: "My Details" },
  { key: "engagement", label: "Activator Data" },
];

export default function AgentQRDashboard() {
  const [agent, setAgent] = useState(null);
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("qr");
  const [activatorLeads, setActivatorLeads] = useState([]);
  const [activators, setActivators] = useState([]);

  const handleOppUpdate = (updated) => {
    setOpps(prev => prev.map(o => o.id === updated.id ? updated : o));
  };

  const fetchOpps = async (email) => {
    setLoading(true);
    const [data, leads, acts] = await Promise.all([
      base44.entities.VTONOpportunity.filter({ partner_email: email }, "-created_date", 100),
      base44.entities.ActivatorLead.list("-created_date", 500),
      base44.entities.FieldActivator.list("name", 100),
    ]);
    setOpps(data);
    setActivatorLeads(leads);
    setActivators(acts);
    setLoading(false);
  };

  const handleAccess = (a) => {
    setAgent(a);
    fetchOpps(a.email);
  };

  if (!agent) return <AccessGate onAccess={handleAccess} />;

  const totalQRs      = opps.length;
  const scannedCount  = opps.filter(o => o.qr_scanned).length;
  const contactedCount = opps.filter(o => ["contacted", "conversation_verified", "closed_won"].includes(o.opportunity_status)).length;
  const closedCount   = opps.filter(o => o.opportunity_status === "closed_won").length;

  const stats = [
    { label: "Total Leads", value: totalQRs, color: "text-slate-800" },
    { label: "QR Scanned",  value: scannedCount, color: "text-green-600" },
    { label: "Contacted",   value: contactedCount, color: "text-amber-600" },
    { label: "Closed Won",  value: closedCount, color: "text-purple-600" },
  ];

  return (
    <div className="fixed inset-0 bg-slate-100 overflow-y-auto" style={{ zIndex: 9990 }}>

      {/* ── Sticky Header ── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
              alt="BuyWiser" className="h-7 w-auto opacity-70 flex-shrink-0"
            />
            <div className="h-5 w-px bg-slate-200 flex-shrink-0" />
            <div className="flex items-center gap-2 min-w-0">
              {agent.photo_url
                ? <img src={agent.photo_url} alt="" className="w-7 h-7 rounded-full object-cover border border-slate-200 flex-shrink-0" />
                : <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-500 flex-shrink-0">
                    {agent.name?.charAt(0)}
                  </div>
              }
              <p className="text-sm font-bold text-slate-800 truncate">{agent.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => fetchOpps(agent.email)}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setAgent(null)}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* ── Page Content ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm">
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Tab Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2.5 px-3 text-xs sm:text-sm font-bold rounded-xl border-2 transition text-center leading-tight ${
                activeTab === tab.key
                  ? "border-slate-800 bg-slate-800 text-white"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── QR Codes Tab ── */}
        {activeTab === "qr" && (
          loading
            ? <Spinner />
            : opps.length === 0
              ? <EmptyState icon={QrCode} title="No QR codes assigned yet" sub="Your QR codes will appear here once opportunities are assigned to you." />
              : (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 font-medium">
                    {totalQRs} QR code{totalQRs !== 1 ? "s" : ""} · {scannedCount} scanned
                  </p>
                  {opps.map(opp => <QRCard key={opp.id} opp={opp} />)}
                </div>
              )
        )}

        {/* ── Lead Status Tab ── */}
        {activeTab === "leads" && (
          loading
            ? <Spinner />
            : opps.length === 0
              ? <EmptyState icon={MapPin} title="No leads yet" />
              : (
                <div className="space-y-3">
                  {/* Status summary pills */}
                  <div className="flex flex-wrap gap-2">
                    {LEAD_STATUSES.map(s => {
                      const count = opps.filter(o => (o.opportunity_status || "assigned") === s.value).length;
                      return (
                        <span key={s.value} className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${s.color}`}>
                          {s.label}: {count}
                        </span>
                      );
                    })}
                  </div>
                  {opps.map(opp => <LeadRow key={opp.id} opp={opp} onUpdate={handleOppUpdate} />)}
                </div>
              )
        )}

        {/* ── Profile Tab ── */}
        {activeTab === "profile" && (
          <ProfileEditor agent={agent} onSaved={setAgent} />
        )}

        {/* ── Engagement Tab ── */}
        {activeTab === "engagement" && (
          <EngagementTab activators={activators} activatorLeads={activatorLeads} />
        )}
      </div>
    </div>
  );
}

/* ─── Shared helpers ───────────────────────────────────────────────────── */
function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
    </div>
  );
}

function EmptyState({ icon: Icon, title, sub }) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
      <Icon className="h-10 w-10 mx-auto mb-3 text-slate-200" />
      <p className="font-semibold text-slate-500">{title}</p>
      {sub && <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">{sub}</p>}
    </div>
  );
}