import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { QRCodeSVG } from "qrcode.react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import Leaderboard from "@/components/vton/Leaderboard";
import VerificationBadge from "@/components/vton/VerificationBadge";
import PartnerProgressTracker from "@/components/vton/PartnerProgressTracker";
import {
  MapPin, Home, DollarSign, Shield, CheckCircle, Clock,
  Phone, Calendar, XCircle, ChevronDown, ChevronUp,
  AlertCircle, RefreshCw, LogOut, Save, X, QrCode, Timer, Star, Target, TrendingUp, Upload
} from "lucide-react";
import OpportunityQRGenerator from "@/components/vton/OpportunityQRGenerator";

const NAVY = "#0B1F3B";
const RED = "#C62828";

// Updated statuses reflecting the new model
const OPPORTUNITY_STATUSES = [
  "assigned", "review_window", "accepted", "in_progress",
  "completed", "forfeited", "protocol_incomplete"
];

const FORFEIT_HOURS = 48; // Updated to 48-hour window

const OUTCOMES = [
  { value: "no_answer", label: "No Answer" },
  { value: "not_interested", label: "Not Interested" },
  { value: "interested", label: "Interested" },
  { value: "callback_scheduled", label: "Callback Scheduled" },
  { value: "consultation_booked", label: "Consultation Booked" },
  { value: "converted", label: "Converted" },
];

const STATUS_CONFIG = {
  assigned:            { color: "bg-blue-100 text-blue-800 border-blue-200",     icon: Clock,         label: "Assigned" },
  review_window:       { color: "bg-amber-100 text-amber-800 border-amber-200",  icon: Timer,         label: "Review Window" },
  accepted:            { color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: CheckCircle,  label: "Accepted" },
  in_progress:         { color: "bg-purple-100 text-purple-800 border-purple-200", icon: TrendingUp,   label: "In Progress" },
  completed:           { color: "bg-green-100 text-green-800 border-green-200",   icon: CheckCircle,   label: "Completed" },
  forfeited:           { color: "bg-red-100 text-red-700 border-red-200",          icon: XCircle,       label: "Forfeited" },
  protocol_incomplete: { color: "bg-slate-100 text-slate-600 border-slate-200",   icon: AlertCircle,   label: "Protocol Incomplete" },
  // Legacy support
  contacted:              { color: "bg-amber-100 text-amber-800 border-amber-200", icon: Phone,        label: "Contacted" },
  conversation_verified:  { color: "bg-purple-100 text-purple-800 border-purple-200", icon: CheckCircle, label: "Verified" },
  consultation_scheduled: { color: "bg-indigo-100 text-indigo-800 border-indigo-200", icon: Calendar,  label: "Consultation" },
  closed_won:             { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle,   label: "Won" },
  closed_lost:            { color: "bg-slate-100 text-slate-500 border-slate-200", icon: XCircle,       label: "Lost" },
};

const PRIORITY_CONFIG = {
  high:   "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low:    "bg-slate-100 text-slate-500 border-slate-200",
};

function DecisionTimer({ createdDate }) {
  const deadline = new Date(createdDate).getTime() + FORFEIT_HOURS * 60 * 60 * 1000;

  const getRemaining = () => {
    const diff = deadline - Date.now();
    if (diff <= 0) return null;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s, diff };
  };

  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const interval = setInterval(() => setRemaining(getRemaining()), 1000);
    return () => clearInterval(interval);
  }, [createdDate]);

  if (!remaining) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
      <Timer className="h-3 w-3" /> Decision Window Closed
    </span>
  );

  const urgent = remaining.diff < 6 * 3600000;
  const warning = remaining.diff < 12 * 3600000;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
      urgent ? "bg-red-100 text-red-700 border-red-200 animate-pulse" :
      warning ? "bg-amber-100 text-amber-700 border-amber-200" :
      "bg-blue-50 text-blue-700 border-blue-200"
    }`}>
      <Timer className="h-3 w-3" />
      48hr Window: {remaining.h}h {remaining.m}m {remaining.s}s
    </span>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.assigned;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <Icon className="h-3 w-3" /> {cfg.label}
    </span>
  );
}

function OpportunityCard({ opp, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [status, setStatus] = useState(opp.opportunity_status || "assigned");
  const [outcome, setOutcome] = useState(opp.outcome || "");
  const [notes, setNotes] = useState(opp.crm_notes || "");
  const [qrScanned, setQrScanned] = useState(opp.qr_scanned || false);
  const [saving, setSaving] = useState(false);
  const [rating, setRating] = useState(opp.lead_quality_rating || 0);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingFeedback, setRatingFeedback] = useState(opp.lead_quality_feedback || "");
  const [ratingSaving, setRatingSaving] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(!!opp.lead_quality_rating);

  const isInDecisionWindow = (() => {
    const deadline = new Date(opp.created_date).getTime() + FORFEIT_HOURS * 60 * 60 * 1000;
    return Date.now() < deadline && (status === "assigned" || status === "review_window");
  })();

  const handleRatingSubmit = async (stars) => {
    setRatingSaving(true);
    await base44.entities.VTONOpportunity.update(opp.id, {
      lead_quality_rating: stars,
      lead_quality_feedback: ratingFeedback,
    });
    setRating(stars);
    setRatingSubmitted(true);
    setRatingSaving(false);
    onUpdate({ ...opp, lead_quality_rating: stars, lead_quality_feedback: ratingFeedback });
  };

  const qrValue = `https://buywiser.base44.app/partner?verify=${opp.id}&partner=${encodeURIComponent(opp.partner_email || "")}`;
  const repCode = `VTON-${opp.id.slice(-6).toUpperCase()}`;
  const estBenefit = opp.estimated_price ? (opp.estimated_price * 0.015).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) : null;

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.VTONOpportunity.update(opp.id, {
      opportunity_status: status,
      outcome,
      crm_notes: notes,
      qr_scanned: qrScanned,
      ...(status === "accepted" && !opp.contact_date ? { contact_date: new Date().toISOString() } : {}),
    });
    setSaving(false);
    setEditing(false);
    onUpdate({ ...opp, opportunity_status: status, outcome, crm_notes: notes, qr_scanned: qrScanned });
  };

  const handleQuickStatus = async (newStatus) => {
    setStatus(newStatus);
    await base44.entities.VTONOpportunity.update(opp.id, { opportunity_status: newStatus });
    onUpdate({ ...opp, opportunity_status: newStatus });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* 48-hour decision window banner */}
      {isInDecisionWindow && (
        <div className="px-5 py-2 flex items-center gap-2 text-xs font-semibold" style={{ background: "#fffbeb", borderBottom: "1px solid #fde68a" }}>
          <Clock className="h-3.5 w-3.5 text-amber-600" />
          <span className="text-amber-800">48-Hour Decision Window — You may decline this opportunity for any reason before the timer expires.</span>
        </div>
      )}

      {/* Card header */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <StatusBadge status={opp.opportunity_status || "assigned"} />
              {(opp.opportunity_status === "assigned" || opp.opportunity_status === "review_window") && (
                <DecisionTimer createdDate={opp.created_date} />
              )}
              {opp.priority && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${PRIORITY_CONFIG[opp.priority]}`}>
                  {opp.priority.charAt(0).toUpperCase() + opp.priority.slice(1)} Priority
                </span>
              )}
              {opp.va_loan_confirmed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  <Shield className="h-3 w-3" /> VA Confirmed
                </span>
              )}
              {opp.qr_scanned && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                  <CheckCircle className="h-3 w-3" /> QR Validated
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm font-bold text-slate-900">{opp.homeowner_name || "Homeowner"}</p>
              {opp.homeowner_phone && (
                <a href={`tel:${opp.homeowner_phone}`}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition">
                  <Phone className="h-3 w-3" /> Call
                </a>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span>{opp.property_address}{opp.city ? `, ${opp.city}` : ""}{opp.state ? `, ${opp.state}` : ""}</span>
            </div>
            {opp.estimated_price && (
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Home className="h-3 w-3" /> ~{opp.estimated_price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                </span>
                {estBenefit && (
                  <span className="text-xs font-semibold" style={{ color: RED }}>
                    <DollarSign className="h-3 w-3 inline" /> up to {estBenefit} veteran benefit
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setShowQR(true)}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition" title="Show QR Code">
              <QrCode className="h-4 w-4" />
            </button>
            {/* Quick status dropdown */}
            <select
              value={status}
              onChange={e => handleQuickStatus(e.target.value)}
              className="px-2 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 bg-white hover:bg-slate-50 transition cursor-pointer focus:outline-none focus:border-blue-400"
            >
              {OPPORTUNITY_STATUSES.map(s => (
                <option key={s} value={s}>{STATUS_CONFIG[s]?.label || s}</option>
              ))}
            </select>
            <button onClick={() => { setEditing(!editing); setExpanded(true); }}
              className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
              Log Update
            </button>
            <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 transition">
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: NAVY }}>
              <div>
                <p className="text-white font-black text-sm uppercase tracking-widest">Conversation QR Code</p>
                <p className="text-blue-300 text-xs mt-0.5">{opp.homeowner_name || "Homeowner"} · {opp.property_address}</p>
              </div>
              <button onClick={() => setShowQR(false)} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 flex flex-col items-center gap-4">
              <div className="p-4 bg-white border-2 border-slate-200 rounded-xl">
                <QRCodeSVG value={qrValue} size={180} bgColor="#ffffff" fgColor="#0B1F3B" level="M" />
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Rep Code</p>
                <p className="text-2xl font-black tracking-widest" style={{ color: NAVY }}>{repCode}</p>
              </div>
              <div className="w-full bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 text-center leading-relaxed">
                Show this QR code to the homeowner or enter the rep code to validate the conversation and earn your <strong>$200 deposit earn-back credit</strong>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded / Edit panel */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 space-y-4">

          {/* Lead Quality Rating */}
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Rate This Opportunity's Quality</p>
            {ratingSubmitted ? (
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <span key={s} className={`text-lg ${s <= rating ? "text-amber-400" : "text-slate-200"}`}>★</span>
                  ))}
                </div>
                <span className="text-xs text-slate-500">Feedback submitted</span>
                <button onClick={() => setRatingSubmitted(false)} className="text-xs text-blue-500 hover:text-blue-700 underline ml-auto">Edit</button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => (
                    <button key={s}
                      onMouseEnter={() => setRatingHover(s)}
                      onMouseLeave={() => setRatingHover(0)}
                      onClick={() => setRating(s)}
                      className={`text-2xl transition-transform hover:scale-110 ${s <= (ratingHover || rating) ? "text-amber-400" : "text-slate-200"}`}>★</button>
                  ))}
                  {rating > 0 && (
                    <span className="text-xs text-slate-500 ml-2">{["","Poor","Below Average","Average","Good","Excellent"][rating]}</span>
                  )}
                </div>
                <input type="text" placeholder="Optional comment about this opportunity"
                  value={ratingFeedback} onChange={e => setRatingFeedback(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400 bg-slate-50" />
                <button disabled={!rating || ratingSaving} onClick={() => handleRatingSubmit(rating)}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg text-white transition disabled:opacity-40" style={{ background: NAVY }}>
                  {ratingSaving ? "Saving…" : "Submit Rating"}
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {OPPORTUNITY_STATUSES.map(s => {
                    const cfg = STATUS_CONFIG[s];
                    return (
                      <button key={s} onClick={() => setStatus(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${status === s ? cfg.color + " ring-2 ring-offset-1 ring-blue-400" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                        {cfg?.label || s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Outcome</label>
                <select value={outcome} onChange={e => setOutcome(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
                  <option value="">Select outcome</option>
                  {OUTCOMES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">CRM Notes</label>
                <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Log conversation details, benefit discussion, follow-up timing, homeowner reaction..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white resize-none" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={qrScanned} onChange={e => setQrScanned(e.target.checked)} className="rounded" />
                <span className="text-xs font-semibold text-slate-700">QR code scanned / rep code validated</span>
              </label>

              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 text-white text-xs font-bold rounded-lg transition disabled:opacity-50" style={{ background: NAVY }}>
                  <Save className="h-3.5 w-3.5" /> {saving ? "Saving…" : "Save Update"}
                </button>
                <button onClick={() => setEditing(false)}
                  className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-white transition">
                  <X className="h-3.5 w-3.5 inline mr-1" />Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 text-sm text-slate-600">
              {opp.outcome && <p><span className="font-semibold text-slate-700">Last Outcome:</span> {OUTCOMES.find(o => o.value === opp.outcome)?.label || opp.outcome}</p>}
              {opp.contact_date && <p><span className="font-semibold text-slate-700">Accepted:</span> {new Date(opp.contact_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>}
              {opp.crm_notes ? (
                <div>
                  <p className="font-semibold text-slate-700 mb-1">Notes:</p>
                  <p className="text-slate-500 leading-relaxed whitespace-pre-line">{opp.crm_notes}</p>
                </div>
              ) : (
                <p className="text-slate-400 italic text-xs">No notes logged yet. Click "Log Update" to add details.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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
      setError("No approved partner account found for this email. Contact VTON to request access.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: NAVY }}>
      <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-8 w-auto mb-6 opacity-60" />
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 text-center" style={{ background: NAVY }}>
          <p className="text-white font-black text-sm uppercase tracking-widest">VTON Partner Dashboard</p>
          <p className="text-blue-300 text-xs mt-1">Veteran Transition Opportunity Network — Cycle 1</p>
          <p className="text-blue-400 text-xs mt-2 italic font-medium">For Approved Field Partners Only</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 leading-relaxed">
            VTON partners enjoy a <strong>48-hour decision window</strong> on every opportunity. After acceptance, your deposit is earned back through <strong>protocol execution</strong> — not sales outcomes.
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Partner Email</label>
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
          <p className="text-xs text-slate-400 text-center">
            Not a partner yet?{" "}
            <a href="/vton" className="underline hover:text-slate-600">Apply for VTON Partner Access</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function PartnerDashboard() {
  const [partner, setPartner] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("opportunities");
  const [approvedPartnerCount, setApprovedPartnerCount] = useState(0);

  const fetchOpportunities = async (partnerEmail) => {
    setLoading(true);
    const data = await base44.entities.VTONOpportunity.filter({ partner_email: partnerEmail }, "-created_date", 100);
    setOpportunities(data);
    setLoading(false);
  };

  const handleAccess = async (p) => {
    setPartner(p);
    fetchOpportunities(p.email);
    const partners = await base44.entities.PartnerApplication.filter({ status: "approved" }, "-created_date", 100);
    setApprovedPartnerCount(partners.length);
  };

  const handleUpdate = (updated) => {
    setOpportunities(prev => prev.map(o => o.id === updated.id ? updated : o));
  };

  // Status counts
  const statusCounts = OPPORTUNITY_STATUSES.reduce((acc, s) => {
    acc[s] = opportunities.filter(o => (o.opportunity_status || "assigned") === s).length;
    return acc;
  }, {});

  // Engagement stats for 1-in-10 tracker
  const totalAssigned = opportunities.length;
  const meaningfulEngagements = opportunities.filter(o =>
    ["in_progress", "completed", "accepted", "conversation_verified", "consultation_scheduled", "closed_won"].includes(o.opportunity_status)
  ).length;
  const closedWon = opportunities.filter(o => ["closed_won", "completed"].includes(o.opportunity_status)).length;
  const benchmarkTarget = Math.floor(meaningfulEngagements / 10);

  // Monthly chart data
  const monthlyChartData = (() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const label = d.toLocaleString("en-US", { month: "short" });
      const count = opportunities.filter(o => {
        if (!["completed", "conversation_verified", "closed_won"].includes(o.opportunity_status || "")) return false;
        const updated = new Date(o.updated_date || o.created_date);
        return updated.getMonth() === d.getMonth() && updated.getFullYear() === d.getFullYear();
      }).length;
      return { month: label, count, isCurrent: i === 5 };
    });
  })();

  const filtered = filter === "all" ? opportunities : opportunities.filter(o => (o.opportunity_status || "assigned") === filter);
  const depositEarned = Math.min((partner?.verified_conversations || 0) * 200, 2000);

  if (!partner) return <AccessGate onAccess={handleAccess} />;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto opacity-70" />
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">VTON Partner Dashboard</p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm font-semibold text-slate-800">{partner.name}</p>
                {partner.quiz_passed && <VerificationBadge size="sm" />}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => fetchOpportunities(partner.email)}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button onClick={() => setPartner(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Progress Tracker */}
        <PartnerProgressTracker partner={partner} />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-slate-800">{totalAssigned}</p>
            <p className="text-xs text-slate-500 mt-0.5">Assigned Opportunities</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black" style={{ color: NAVY }}>{meaningfulEngagements}</p>
            <p className="text-xs text-slate-500 mt-0.5">Meaningful Engagements</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-green-700">{closedWon}</p>
            <p className="text-xs text-slate-500 mt-0.5">Closed Won</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black" style={{ color: "#10b981" }}>${depositEarned.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-0.5">Deposit Earn-Back</p>
          </div>
        </div>

        {/* 1-in-10 Opportunity Conversion Tracker */}
        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
          <div className="flex items-start gap-3 mb-4">
            <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">VTON Historical Opportunity Benchmark</p>
              <p className="text-xs text-slate-400 mt-0.5">~1 in 10 meaningful veteran benefit conversations may become a closed opportunity</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-slate-800">{meaningfulEngagements}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-tight">Qualified Veteran Engagements</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-amber-700">{benchmarkTarget}</p>
              <p className="text-xs text-amber-600 mt-0.5 leading-tight">Historical Benchmark (~1 in 10)</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
              <p className="text-2xl font-black text-green-700">{closedWon}</p>
              <p className="text-xs text-green-600 mt-0.5 leading-tight">Actual Closed Won</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 italic text-center">Not a guarantee. A historical operating philosophy. Disciplined execution may create stronger odds than ordinary prospecting.</p>
        </div>

        {/* Success Ratio */}
        {(() => {
          const contacted = opportunities.filter(o => !["assigned", "review_window", "forfeited"].includes(o.opportunity_status || "assigned")).length;
          const successful = opportunities.filter(o => ["in_progress", "completed", "conversation_verified", "consultation_scheduled", "closed_won"].includes(o.opportunity_status)).length;
          const ratio = contacted > 0 ? Math.round((successful / contacted) * 100) : 0;
          const GOAL = 85;
          const isOnTrack = ratio >= GOAL;
          const barColor = ratio >= GOAL ? "#10b981" : ratio >= 60 ? "#f59e0b" : RED;
          return (
            <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Protocol Completion Rate</p>
                  <p className="text-xs text-slate-400 mt-0.5">Accepted opportunities with verified execution</p>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-black ${isOnTrack ? "text-green-600" : ratio >= 60 ? "text-amber-500" : "text-red-500"}`}>
                    {contacted > 0 ? `${ratio}%` : "—"}
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">Goal: 85%</p>
                </div>
              </div>
              <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(ratio, 100)}%`, background: barColor }} />
                <div className="absolute top-0 bottom-0 w-0.5 bg-slate-400" style={{ left: "85%" }} />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-slate-400">{successful} successful out of {contacted} accepted</p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  <p className="text-xs text-slate-400">85% goal</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Territory + Deposit Earn-Back */}
        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-0.5">Assigned Territory</p>
            <p className="text-sm font-bold text-slate-800">{partner.territory || "Territory Pending Assignment"}</p>
          </div>
          <div className="h-px sm:h-10 sm:w-px bg-slate-100" />
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Deposit Earn-Back Progress</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ background: "#10b981", width: `${Math.min(100, ((partner?.verified_conversations || 0) * 200 / 2000) * 100)}%` }} />
              </div>
              <span className="text-xs font-bold text-slate-700">${depositEarned.toLocaleString()} / $2,000</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{partner?.verified_conversations || 0} verified actions × $200 earn-back credit</p>
          </div>
        </div>

        {/* Monthly chart */}
        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Completed Actions by Month</p>
          <p className="text-xs text-slate-400 mb-4">Last 6 months</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={monthlyChartData} barCategoryGap="30%">
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0", boxShadow: "none" }}
                formatter={(v) => [v, "Completed Actions"]} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {monthlyChartData.map((entry, index) => (
                  <Cell key={index} fill={entry.isCurrent ? RED : "#cbd5e1"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leaderboard */}
        {approvedPartnerCount >= 5 && (
          <Leaderboard currentPartnerEmail={partner.email} currentPartnerVerified={partner.verified_conversations || 0} />
        )}

        {/* Main tab switcher */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button onClick={() => setActiveTab("opportunities")}
            className={`px-4 py-2 text-sm font-bold rounded-t-lg transition ${activeTab === "opportunities" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            Opportunities
          </button>
          <button onClick={() => setActiveTab("qr")}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-t-lg transition ${activeTab === "qr" ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <QrCode className="h-3.5 w-3.5" /> QR Benefit Packets
          </button>
        </div>

        {/* QR Packets panel */}
        {activeTab === "qr" && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4">
              <p className="text-sm font-black text-blue-900 mb-1">🇺🇸 Personalized Benefit QR Codes</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                Each QR code links to a personalized benefit page for that specific homeowner — showing their name, address, estimated benefit check, <strong>and your agent profile card</strong>. Print and include in your outreach packet.
              </p>
            </div>
            <OpportunityQRGenerator opportunities={opportunities} partner={partner} />
          </div>
        )}

        {/* Filter tabs — only shown in opportunities tab */}
        {activeTab === "opportunities" && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${filter === "all" ? "bg-slate-800 text-white border-slate-800" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
            All ({opportunities.length})
          </button>
          {OPPORTUNITY_STATUSES.map(s => {
            const cfg = STATUS_CONFIG[s];
            return (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${filter === s ? cfg.color + " ring-2 ring-offset-1 ring-blue-300" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {cfg?.label} ({statusCounts[s] || 0})
              </button>
            );
          })}
        </div>
        )}

        {/* Opportunities list */}
        {activeTab === "opportunities" && (
          loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <MapPin className="h-10 w-10 mx-auto mb-3 text-slate-200" />
              <p className="font-semibold text-slate-500">No opportunities in this view</p>
              <p className="text-sm text-slate-400 mt-1">Check back soon — new opportunities are assigned as they are identified.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 font-medium">{filtered.length} opportunit{filtered.length !== 1 ? "ies" : "y"}</p>
              {filtered.map(opp => (
                <OpportunityCard key={opp.id} opp={opp} onUpdate={handleUpdate} />
              ))}
            </div>
          )
        )}

        {/* VTON Insight Module */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <div className="flex items-start gap-3">
            <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-amber-800 mb-1">VTON Insight</p>
              <p className="text-sm text-amber-900 leading-relaxed">
                Historical operating assumptions suggest that approximately <strong>1 in 10 meaningful Veteran's Next Move Benefit conversations</strong> may become a closed opportunity.
              </p>
              <p className="text-xs text-amber-600 mt-1.5 italic">Not a guarantee. A framework for disciplined execution.</p>
            </div>
          </div>
        </div>

        {/* Protocol reminder */}
        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">VTON Protocol Reminder</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <Clock className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-amber-500" />
              <span>48-hour decision window — decline any opportunity for any reason before it expires</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-green-500" />
              <span>QR validation + CRM documentation earns your $200 deposit earn-back credit per verified action</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-green-500" />
              <span>Clearly explain the Veteran's Next Move Benefits. Execution creates opportunity.</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center">
          <p className="text-xs font-bold text-slate-600 mb-0.5">Freedom to choose. Clarity to commit. Accountability to perform.</p>
          <p className="text-xs text-slate-400">VTON respects your judgment before acceptance. VTON rewards your discipline after acceptance.</p>
        </div>
        <p className="text-xs text-slate-400 text-center pb-4">
          VTON, Veteran's Next Home™, and the Red White &amp; Blue Purchase Benefit are private programs not affiliated with the U.S. Department of Veterans Affairs.
        </p>
      </div>
    </div>
  );
}