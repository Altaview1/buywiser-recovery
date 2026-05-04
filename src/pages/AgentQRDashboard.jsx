import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, ScanLine, MapPin, CheckCircle, AlertCircle, RefreshCw, Save, Upload, Loader2, X, ExternalLink, User } from "lucide-react";

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
    const results = await base44.entities.PartnerApplication.filter({ email: email.toLowerCase().trim(), status: "approved" });
    if (results.length > 0) {
      onAccess(results[0]);
    } else {
      setError("No approved partner account found for this email.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: NAVY }}>
      <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-8 w-auto mb-6 opacity-60" />
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 text-center" style={{ background: NAVY }}>
          <QrCode className="h-6 w-6 text-white/60 mx-auto mb-2" />
          <p className="text-white font-black text-sm uppercase tracking-widest">Agent QR Dashboard</p>
          <p className="text-blue-300 text-xs mt-1">Track scans & manage your profile</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your Partner Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
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
            {loading ? "Checking…" : "Access My Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

function QRCard({ opp }) {
  const [showQR, setShowQR] = useState(false);
  const url = `${window.location.origin}/b?opp=${opp.id}`;
  const address = [opp.property_address, opp.city, opp.state].filter(Boolean).join(", ");

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-4 py-4 flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${opp.qr_scanned ? "bg-green-100" : "bg-slate-100"}`}>
          {opp.qr_scanned
            ? <ScanLine className="h-5 w-5 text-green-600" />
            : <QrCode className="h-5 w-5 text-slate-400" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800 truncate">{opp.homeowner_name || "Homeowner"}</p>
          <p className="text-xs text-slate-400 truncate flex items-center gap-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />{address || "—"}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
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
              <span className="text-xs text-slate-400">
                Benefit ≈ ${Math.round(opp.estimated_price * 0.015).toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition" title="Preview page">
            <ExternalLink className="h-4 w-4" />
          </a>
          <button onClick={() => setShowQR(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg text-white transition"
            style={{ background: NAVY }}>
            <QrCode className="h-3.5 w-3.5" /> QR
          </button>
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.65)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: NAVY }}>
              <p className="text-white font-black text-sm">QR Code</p>
              <button onClick={() => setShowQR(false)} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition">
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

  return (
    <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 flex items-center gap-2" style={{ background: NAVY }}>
        <User className="h-4 w-4 text-white/60" />
        <p className="text-sm font-black text-white uppercase tracking-widest">My Contact Details</p>
      </div>
      <div className="p-5 space-y-4">
        {/* Photo */}
        <div className="flex items-center gap-4">
          {form.photo_url
            ? <img src={form.photo_url} alt="" className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 flex-shrink-0" />
            : <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-xl font-black text-slate-400 flex-shrink-0">{form.name?.charAt(0) || "A"}</div>
          }
          <div className="flex-1 space-y-2">
            <label className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-slate-300 rounded-lg text-xs text-slate-600 hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer w-fit">
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              {uploading ? "Uploading…" : "Upload Photo"}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
            <input type="url" className={inputCls} placeholder="Or paste photo URL…"
              value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
            <input required className={inputCls} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
            <input type="tel" className={inputCls} placeholder="(818) 555-1234" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Title</label>
            <input className={inputCls} placeholder="VTON Partner Agent" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">RE License #</label>
            <input className={inputCls} placeholder="01234567" value={form.license_number} onChange={e => setForm(f => ({ ...f, license_number: e.target.value }))} />
          </div>
        </div>

        <button type="submit" disabled={saving || uploading}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl text-white transition disabled:opacity-50"
          style={{ background: saved ? "#10b981" : NAVY }}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default function AgentQRDashboard() {
  const [agent, setAgent] = useState(null);
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("qr");

  const fetchOpps = async (email) => {
    setLoading(true);
    const data = await base44.entities.VTONOpportunity.filter({ partner_email: email }, "-created_date", 100);
    setOpps(data);
    setLoading(false);
  };

  const handleAccess = (a) => {
    setAgent(a);
    fetchOpps(a.email);
  };

  if (!agent) return <AccessGate onAccess={handleAccess} />;

  const totalQRs = opps.length;
  const scannedCount = opps.filter(o => o.qr_scanned).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto opacity-70" />
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              {agent.photo_url
                ? <img src={agent.photo_url} alt="" className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                : <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-500">{agent.name?.charAt(0)}</div>
              }
              <p className="text-sm font-bold text-slate-800">{agent.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchOpps(agent.email)} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button onClick={() => setAgent(null)} className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-slate-800">{totalQRs}</p>
            <p className="text-xs text-slate-500 mt-0.5">Active QR Codes</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-green-600">{scannedCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Scans</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-0">
          <button onClick={() => setActiveTab("qr")}
            className={`px-4 py-2 text-sm font-bold rounded-t-lg border-b-2 transition ${activeTab === "qr" ? "border-slate-800 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            My QR Codes
          </button>
          <button onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 text-sm font-bold rounded-t-lg border-b-2 transition ${activeTab === "profile" ? "border-slate-800 text-slate-900" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
            Contact Details
          </button>
        </div>

        {activeTab === "qr" && (
          loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
            </div>
          ) : opps.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <QrCode className="h-10 w-10 mx-auto mb-3 text-slate-200" />
              <p className="font-semibold text-slate-500">No QR codes assigned yet</p>
              <p className="text-sm text-slate-400 mt-1">Your QR codes will appear here once opportunities are assigned to you.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-medium">{totalQRs} QR code{totalQRs !== 1 ? "s" : ""} · {scannedCount} scanned</p>
              {opps.map(opp => <QRCard key={opp.id} opp={opp} />)}
            </div>
          )
        )}

        {activeTab === "profile" && (
          <ProfileEditor agent={agent} onSaved={setAgent} />
        )}
      </div>
    </div>
  );
}