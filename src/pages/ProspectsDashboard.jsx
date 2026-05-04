import { useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  MapPin, Phone, RefreshCw, AlertCircle, ChevronDown,
  Loader2, CheckCircle, Clock, TrendingUp, XCircle, Home,
  DollarSign, Shield, ScanLine, User
} from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const STATUSES = [
  { value: "assigned",               label: "New",                color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "contacted",              label: "Contacted",          color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "conversation_verified",  label: "Verified",           color: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "consultation_scheduled", label: "Consultation Set",   color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { value: "closed_won",             label: "Closed Won",         color: "bg-green-100 text-green-700 border-green-200" },
  { value: "closed_lost",            label: "Closed Lost",        color: "bg-slate-100 text-slate-500 border-slate-200" },
  { value: "forfeited",              label: "Forfeited",          color: "bg-red-100 text-red-600 border-red-200" },
];

function getStatusConfig(value) {
  return STATUSES.find(s => s.value === value) || STATUSES[0];
}

// ── Access Gate ────────────────────────────────────────────────────────────────
function AccessGate({ onAccess }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Query all approved partners and filter in-code for case-insensitive match
      const allPartners = await base44.entities.PartnerApplication.filter({
        status: "approved",
      }, "-created_date", 500);
      
      const emailLower = email.toLowerCase().trim();
      console.log("Searching for email:", emailLower, "Found partners:", allPartners.map(p => ({ name: p.name, email: p.email })));
      const match = allPartners.find(p => p.email && p.email.toLowerCase() === emailLower);
      
      if (match) {
        onAccess(match);
      } else {
        setError("No approved partner account found for this email. Found: " + allPartners.map(p => p.email).join(", "));
      }
    } catch (err) {
      setError("Error checking account. Please try again.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: NAVY }}>
      <img
        src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
        alt="BuyWiser" className="h-8 w-auto mb-6 opacity-60"
      />
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 text-center" style={{ background: NAVY }}>
          <Home className="h-6 w-6 text-white/60 mx-auto mb-2" />
          <p className="text-white font-black text-sm uppercase tracking-widest">Partner Prospects</p>
          <p className="text-blue-300 text-xs mt-1">Sign in with your partner email</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
              Partner Email
            </label>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
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
          <button type="submit" disabled={loading}
            className="w-full py-3.5 font-bold text-sm rounded-xl text-white transition disabled:opacity-50"
            style={{ background: loading ? "#888" : RED }}>
            {loading ? "Checking…" : "View My Prospects"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Prospect Row ───────────────────────────────────────────────────────────────
function ProspectRow({ opp, onUpdate }) {
  const [status, setStatus] = useState(opp.opportunity_status || "assigned");
  const [saving, setSaving] = useState(false);

  const address = [opp.property_address, opp.city, opp.state].filter(Boolean).join(", ");
  const cfg = getStatusConfig(status);
  const benefit = opp.estimated_price
    ? `$${Math.round(opp.estimated_price * 0.015).toLocaleString()}`
    : null;

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    setSaving(true);
    await base44.entities.VTONOpportunity.update(opp.id, { opportunity_status: newStatus });
    setSaving(false);
    onUpdate({ ...opp, opportunity_status: newStatus });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:shadow-sm transition-shadow">
      {/* Left: info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-slate-900">{opp.homeowner_name || "Veteran Homeowner"}</p>
          {opp.va_loan_confirmed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200">
              <Shield className="h-3 w-3" /> VA
            </span>
          )}
          {opp.qr_scanned && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
              <ScanLine className="h-3 w-3" /> QR Scanned
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
          <MapPin className="h-3 w-3 flex-shrink-0" /> {address || "—"}
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {opp.estimated_price && (
            <span className="text-xs text-slate-400 flex items-center gap-0.5">
              <Home className="h-3 w-3" />
              {opp.estimated_price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
            </span>
          )}
          {benefit && (
            <span className="text-xs font-semibold flex items-center gap-0.5" style={{ color: RED }}>
              <DollarSign className="h-3 w-3" /> up to {benefit} benefit
            </span>
          )}
          {opp.created_date && (
            <span className="text-xs text-slate-400">
              Assigned {new Date(opp.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {opp.homeowner_phone && (
          <a href={`tel:${opp.homeowner_phone}`}
            className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-green-600 hover:border-green-200 transition"
            title="Call homeowner">
            <Phone className="h-4 w-4" />
          </a>
        )}
        <div className="relative">
          <select
            value={status}
            onChange={e => handleStatusChange(e.target.value)}
            disabled={saving}
            className={`appearance-none pl-3 pr-7 py-2 text-xs font-semibold rounded-lg border cursor-pointer focus:outline-none disabled:opacity-60 transition ${cfg.color}`}
          >
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown className="h-3 w-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
        </div>
        {saving && <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function ProspectsDashboard() {
  const [agent, setAgent] = useState(null);
  const [opps, setOpps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchOpps = async (email) => {
    setLoading(true);
    const data = await base44.entities.VTONOpportunity.filter(
      { partner_email: email }, "-created_date", 200
    );
    setOpps(data);
    setLoading(false);
  };

  const handleAccess = (a) => {
    setAgent(a);
    fetchOpps(a.email);
  };

  const handleUpdate = (updated) => {
    setOpps(prev => prev.map(o => o.id === updated.id ? updated : o));
  };

  if (!agent) return <AccessGate onAccess={handleAccess} />;

  // Stats
  const total = opps.length;
  const newCount = opps.filter(o => (o.opportunity_status || "assigned") === "assigned").length;
  const activeCount = opps.filter(o => ["contacted", "conversation_verified", "consultation_scheduled"].includes(o.opportunity_status)).length;
  const wonCount = opps.filter(o => o.opportunity_status === "closed_won").length;
  const scannedCount = opps.filter(o => o.qr_scanned).length;

  // Filtered list
  const filtered = filter === "all"
    ? opps
    : opps.filter(o => (o.opportunity_status || "assigned") === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
              alt="BuyWiser" className="h-7 w-auto opacity-70"
            />
            <div className="h-5 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              {agent.photo_url
                ? <img src={agent.photo_url} alt="" className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                : <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
              }
              <div>
                <p className="text-sm font-bold text-slate-800 leading-tight">{agent.name}</p>
                <p className="text-xs text-slate-400 leading-tight">My Prospects</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchOpps(agent.email)}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button onClick={() => setAgent(null)}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-slate-800">{total}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Prospects</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-blue-600">{newCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">New / Pending</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-amber-600">{activeCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">In Progress</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-green-600">{wonCount}</p>
            <p className="text-xs text-slate-500 mt-0.5">Closed Won</p>
          </div>
        </div>

        {/* QR scan note */}
        {scannedCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span><strong>{scannedCount}</strong> prospect{scannedCount !== 1 ? "s have" : " has"} already scanned their QR benefit page.</span>
          </div>
        )}

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${filter === "all" ? "bg-slate-800 text-white border-slate-800" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            All ({total})
          </button>
          {STATUSES.map(s => {
            const count = opps.filter(o => (o.opportunity_status || "assigned") === s.value).length;
            if (count === 0) return null;
            return (
              <button key={s.value} onClick={() => setFilter(s.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${filter === s.value ? `${s.color} ring-2 ring-offset-1 ring-blue-300` : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {s.label} ({count})
              </button>
            );
          })}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <MapPin className="h-10 w-10 mx-auto mb-3 text-slate-200" />
            <p className="font-semibold text-slate-500">No prospects in this view</p>
            <p className="text-sm text-slate-400 mt-1">Check back soon — new prospects are assigned as they're identified.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 font-medium">{filtered.length} prospect{filtered.length !== 1 ? "s" : ""}</p>
            {filtered.map(opp => (
              <ProspectRow key={opp.id} opp={opp} onUpdate={handleUpdate} />
            ))}
          </div>
        )}

        <p className="text-xs text-slate-300 text-center pb-4">
          VTON, Veteran's Next Home™, and the Red White & Blue Purchase Benefit are private programs not affiliated with the U.S. Department of Veterans Affairs.
        </p>
      </div>
    </div>
  );
}