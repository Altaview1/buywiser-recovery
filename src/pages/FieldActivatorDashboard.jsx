import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { QRCodeSVG } from "qrcode.react";
import { AlertCircle, RefreshCw, LogOut, QrCode, MapPin, Printer, Users, DollarSign, CheckCircle2, CalendarCheck, MailOpen } from "lucide-react";
import QRFlyerPrint from "@/components/activator/QRFlyerPrint";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const PAYMENT_TYPE_CONFIG = {
  IN_PERSON_SCHEDULED: { label: "In-Person Scheduled", color: "bg-blue-100 text-blue-800 border-blue-200" },
  IN_PERSON_ATTENDED:  { label: "In-Person Attended",  color: "bg-green-100 text-green-800 border-green-200" },
  LEAVE_BEHIND_ATTENDED: { label: "Leave-Behind Attended", color: "bg-purple-100 text-purple-800 border-purple-200" },
};

const PAYMENT_STATUS_STYLE = {
  PENDING:  "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-blue-50 text-blue-700 border-blue-200",
  PAID:     "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-600 border-red-200",
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
  const [showFlyer, setShowFlyer] = useState(false);

  const fetchData = async (a) => {
    setLoading(true);
    const [leadsData, paymentsData] = await Promise.all([
      base44.entities.ActivatorLead.filter({ rep_code: a.rep_code }, "-created_date", 200),
      base44.entities.ActivatorPayment.filter({ activator_id: a.id }, "-created_date", 200),
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

  // QR URLs — in-person (no mode param) vs leave-behind (?mode=lb)
  const baseQrUrl = `${window.location.origin}/vton-scan?rep=${activator.rep_code}`;
  const inPersonQrUrl = baseQrUrl;
  const leaveBehandQrUrl = `${baseQrUrl}&mode=lb`;

  // Activation stats
  const inPersonLeads = leads.filter(l => l.activation_source === "IN_PERSON_ACTIVATION");
  const leaveLeads    = leads.filter(l => l.activation_source === "LEAVE_BEHIND_ACTIVATION");
  const inPersonScheduled = inPersonLeads.filter(l => ["SCHEDULED", "ATTENDED"].includes(l.benefit_review_status));
  const inPersonAttended  = inPersonLeads.filter(l => l.benefit_review_status === "ATTENDED");
  const leaveScheduled    = leaveLeads.filter(l => ["SCHEDULED", "ATTENDED"].includes(l.benefit_review_status));
  const leaveAttended     = leaveLeads.filter(l => l.benefit_review_status === "ATTENDED");

  // Payment totals
  const pending  = payments.filter(p => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);
  const approved = payments.filter(p => p.status === "APPROVED").reduce((s, p) => s + p.amount, 0);
  const paid     = payments.filter(p => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const total    = pending + approved + paid;

  return (
    <div className="min-h-screen bg-slate-50">
      {showFlyer && <QRFlyerPrint activator={activator} onClose={() => setShowFlyer(false)} />}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Field Activator Portal</p>
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

        {/* Rep Info + QR codes */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Your Rep Code</p>
              <p className="text-3xl font-black tracking-widest mt-1" style={{ color: NAVY }}>{activator.rep_code}</p>
              {activator.assigned_area && (
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" />{activator.assigned_area}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowFlyer(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition text-xs font-bold">
                <Printer className="h-4 w-4" /> Print Flyer
              </button>
              <button onClick={() => setShowQR(!showQR)}
                className="p-3 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                <QrCode className="h-6 w-6" />
              </button>
            </div>
          </div>

          {showQR && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
              {/* In-Person QR */}
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-white border-2 border-blue-300 rounded-xl">
                  <QRCodeSVG value={inPersonQrUrl} size={140} bgColor="#ffffff" fgColor={NAVY} level="M" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-blue-700 uppercase tracking-wider">In-Person Scan</p>
                  <p className="text-xs text-slate-400 mt-0.5">Show at the door</p>
                </div>
              </div>
              {/* Leave-Behind QR */}
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-white border-2 border-purple-300 rounded-xl">
                  <QRCodeSVG value={leaveBehandQrUrl} size={140} bgColor="#ffffff" fgColor="#5b21b6" level="M" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-purple-700 uppercase tracking-wider">Leave-Behind</p>
                  <p className="text-xs text-slate-400 mt-0.5">For packets & door hangers</p>
                </div>
              </div>
              <p className="col-span-2 text-xs text-slate-400 text-center">Use the correct QR for each activation type. They track differently for your compensation.</p>
            </div>
          )}
        </div>

        {/* Compensation Model Explainer */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100" style={{ background: NAVY }}>
            <p className="text-xs font-black uppercase tracking-widest text-blue-300">How You Earn</p>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">🤝</span>
                <div>
                  <p className="text-xs font-black text-blue-800 uppercase tracking-wider mb-1">In-Person Activation</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">$150</strong> when you verify and schedule a Benefit Review at the door using your in-person QR code.
                    <br />
                    <strong className="text-slate-800">+$150</strong> additional if the homeowner attends their Benefit Review.
                  </p>
                  <p className="text-xs text-blue-600 font-semibold mt-1">Total possible: $300</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="text-lg">📬</span>
                <div>
                  <p className="text-xs font-black text-purple-800 uppercase tracking-wider mb-1">Leave-Behind Activation</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">$150</strong> if a homeowner from your packet later attends a Benefit Review.
                  </p>
                  <p className="text-xs text-purple-600 font-semibold mt-1">Total possible: $150</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activation Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Activation Summary</p>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
              <p className="text-xs font-black uppercase tracking-wider text-blue-700 mb-2">In-Person</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xl font-black text-blue-800">{inPersonScheduled.length}</p>
                  <p className="text-xs text-blue-500">Scheduled</p>
                </div>
                <div>
                  <p className="text-xl font-black text-green-700">{inPersonAttended.length}</p>
                  <p className="text-xs text-green-500">Attended</p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-center">
              <p className="text-xs font-black uppercase tracking-wider text-purple-700 mb-2">Leave-Behind</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xl font-black text-purple-800">{leaveScheduled.length}</p>
                  <p className="text-xs text-purple-500">Scheduled</p>
                </div>
                <div>
                  <p className="text-xl font-black text-green-700">{leaveAttended.length}</p>
                  <p className="text-xs text-green-500">Attended</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-lg px-3 py-2">
            <Users className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{leads.length} total leads attributed to your rep code</span>
          </div>
        </div>

        {/* Earnings Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4" style={{ background: NAVY }}>
            <p className="text-xs font-black uppercase tracking-widest text-blue-300 mb-1">Earnings Summary</p>
            <p className="text-3xl font-black text-white">${total.toLocaleString()}</p>
            <p className="text-xs text-blue-300 mt-0.5">Lifetime earnings across all activation events</p>
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

          {/* Itemized */}
          {payments.length > 0 && (
            <div className="border-t border-slate-100 px-5 py-4">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Itemized Payouts</p>
              <div className="space-y-2">
                {payments.map(p => {
                  const cfg = PAYMENT_TYPE_CONFIG[p.type] || { label: p.type, color: "bg-slate-100 text-slate-700 border-slate-200" };
                  return (
                    <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 text-xs rounded-full border font-bold ${cfg.color}`}>{cfg.label}</span>
                        <span className={`px-2 py-0.5 text-xs rounded-full border font-semibold ${PAYMENT_STATUS_STYLE[p.status]}`}>{p.status}</span>
                      </div>
                      <span className="text-sm font-black text-slate-800 flex-shrink-0">${p.amount}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Leads list */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Your Leads</p>
          {loading ? (
            <div className="flex justify-center py-6">
              <div className="w-5 h-5 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
            </div>
          ) : leads.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No leads yet. Start distributing your QR codes!</p>
          ) : (
            <div className="space-y-2">
              {leads.map(lead => {
                const sourceIcon = lead.activation_source === "IN_PERSON_ACTIVATION" ? "🤝" : lead.activation_source === "LEAVE_BEHIND_ACTIVATION" ? "📬" : "❓";
                const reviewBadge = lead.benefit_review_status && lead.benefit_review_status !== "NOT_SCHEDULED" ? (
                  <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                    lead.benefit_review_status === "ATTENDED" ? "bg-green-100 text-green-700" :
                    lead.benefit_review_status === "SCHEDULED" ? "bg-blue-100 text-blue-700" :
                    "bg-slate-100 text-slate-500"
                  }`}>{lead.benefit_review_status}</span>
                ) : null;
                return (
                  <div key={lead.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base flex-shrink-0">{sourceIcon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{lead.first_name} {lead.last_name}</p>
                        <p className="text-xs text-slate-400 truncate">{lead.property_address || lead.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {reviewBadge}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}