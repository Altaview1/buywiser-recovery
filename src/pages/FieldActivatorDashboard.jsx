import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { QRCodeSVG } from "qrcode.react";
import { AlertCircle, RefreshCw, LogOut, DollarSign, Users, QrCode, MapPin, TrendingUp } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const STATUS_COLORS = {
  SCANNED:   "bg-slate-100 text-slate-600",
  VERIFIED:  "bg-blue-100 text-blue-700",
  QUALIFIED: "bg-amber-100 text-amber-700",
  SCHEDULED: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  CLOSED:    "bg-emerald-100 text-emerald-800",
};

const PAYMENT_STATUS = {
  PENDING:  "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-blue-50 text-blue-700 border-blue-200",
  PAID:     "bg-green-50 text-green-700 border-green-200",
};

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
      setError("No active Field Activator account found with that email.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: NAVY }}>
      <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-8 w-auto mb-6 opacity-60" />
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 text-center" style={{ background: NAVY }}>
          <p className="text-white font-black text-sm uppercase tracking-widest">Field Activator Portal</p>
          <p className="text-blue-300 text-xs mt-1">VTON — Veteran's Next Home™</p>
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
            {loading ? "Checking…" : "Access My Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function FieldActivatorDashboard() {
  const [activator, setActivator] = useState(null);
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const fetchData = async (a) => {
    setLoading(true);
    const [leadsData, paymentsData] = await Promise.all([
      base44.entities.ActivatorLead.filter({ rep_code: a.rep_code }, "-created_date", 100),
      base44.entities.ActivatorPayment.filter({ activator_id: a.id }, "-created_date", 100),
    ]);
    setLeads(leadsData);
    setPayments(paymentsData);
    setLoading(false);
  };

  const handleAccess = (a) => {
    setActivator(a);
    fetchData(a);
  };

  if (!activator) return <AccessGate onAccess={handleAccess} />;

  const verifiedLeads = leads.filter(l => l.status !== "SCANNED").length;
  const scheduledLeads = leads.filter(l => ["SCHEDULED", "COMPLETED", "CLOSED"].includes(l.status)).length;
  const totalEarnings = payments.filter(p => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const pendingEarnings = payments.filter(p => p.status !== "PAID").reduce((s, p) => s + p.amount, 0);

  const qrUrl = `${window.location.origin}/vton-scan?rep=${activator.rep_code}`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Field Activator Dashboard</p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">{activator.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchData(activator)}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button onClick={() => setActivator(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Rep Code + QR */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Your Rep Code</p>
              <p className="text-3xl font-black tracking-widest mt-1" style={{ color: NAVY }}>{activator.rep_code}</p>
              <p className="text-xs text-slate-400 mt-1">Share this QR to attribute scans to you</p>
            </div>
            <button onClick={() => setShowQR(!showQR)}
              className="p-3 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition">
              <QrCode className="h-6 w-6" />
            </button>
          </div>
          {showQR && (
            <div className="flex flex-col items-center mt-4 pt-4 border-t border-slate-100">
              <div className="p-4 bg-white border-2 border-slate-200 rounded-xl mb-3">
                <QRCodeSVG value={qrUrl} size={180} bgColor="#ffffff" fgColor={NAVY} level="M" />
              </div>
              <p className="text-xs text-slate-400 text-center max-w-xs">
                Print this QR code. When a homeowner scans it, they land on your personalized benefit page and the lead is attributed to you.
              </p>
            </div>
          )}
        </div>

        {/* Area */}
        {activator.assigned_area && (
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-700 font-medium">Assigned Area: <strong>{activator.assigned_area}</strong></span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Leads", value: leads.length, icon: Users, color: "text-slate-800" },
            { label: "Verified", value: verifiedLeads, icon: TrendingUp, color: "text-blue-700" },
            { label: "Scheduled", value: scheduledLeads, icon: TrendingUp, color: "text-purple-700" },
            { label: "Paid Out", value: `$${totalEarnings}`, icon: DollarSign, color: "text-green-700" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Earnings Summary */}
        {payments.length > 0 && (() => {
          const paid = payments.filter(p => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
          const approved = payments.filter(p => p.status === "APPROVED").reduce((s, p) => s + p.amount, 0);
          const pending = payments.filter(p => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);
          const total = paid + approved + pending;
          return (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4" style={{ background: NAVY }}>
                <p className="text-xs font-black uppercase tracking-widest text-blue-300 mb-1">Earnings Summary</p>
                <p className="text-3xl font-black text-white">${total.toLocaleString()}</p>
                <p className="text-xs text-blue-300 mt-0.5">Lifetime earnings across all payouts</p>
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-100">
                <div className="px-4 py-4 text-center">
                  <p className="text-xl font-black text-green-600">${paid.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Paid Out</p>
                  <p className="text-xs text-green-600 font-semibold mt-1">✓ Received</p>
                </div>
                <div className="px-4 py-4 text-center">
                  <p className="text-xl font-black text-blue-600">${approved.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Approved</p>
                  <p className="text-xs text-blue-600 font-semibold mt-1">Processing</p>
                </div>
                <div className="px-4 py-4 text-center">
                  <p className="text-xl font-black text-amber-600">${pending.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Pending</p>
                  <p className="text-xs text-amber-600 font-semibold mt-1">Awaiting Review</p>
                </div>
              </div>

              {/* Itemized breakdown */}
              <div className="border-t border-slate-100 px-5 py-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Itemized Payouts</p>
                <div className="space-y-2">
                  {payments.map(p => (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-xs rounded-full border font-bold ${
                          p.type === "CLOSE" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                          p.type === "CONSULT" ? "bg-purple-100 text-purple-700 border-purple-200" :
                          "bg-blue-100 text-blue-700 border-blue-200"
                        }`}>{p.type}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full border font-semibold ${PAYMENT_STATUS[p.status]}`}>{p.status}</span>
                      </div>
                      <span className="text-sm font-black text-slate-800">${p.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Leads list */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Your Leads</p>
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
            </div>
          ) : leads.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No leads yet. Start distributing your QR code!</p>
          ) : (
            <div className="space-y-2">
              {leads.map(lead => (
                <div key={lead.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{lead.first_name} {lead.last_name}</p>
                    <p className="text-xs text-slate-400">{lead.email}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[lead.status] || "bg-slate-100 text-slate-500"}`}>
                    {lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}