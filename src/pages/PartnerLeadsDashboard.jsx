import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { AlertCircle, RefreshCw, LogOut, Phone, Mail, MapPin, CheckCircle, Clock, Target, TrendingUp } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const LEAD_STATUSES = [
  { value: "New", label: "New", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "Contacted", label: "Contacted", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { value: "Qualified", label: "Qualified", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "Closed", label: "Closed", color: "bg-green-100 text-green-700 border-green-200" },
  { value: "Lost", label: "Lost", color: "bg-slate-100 text-slate-600 border-slate-200" },
];

function AccessGate({ onAccess }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await base44.functions.invoke('verifyPartner', { email: email.trim() });
      if (res.data?.partner) {
        onAccess(res.data.partner);
      } else {
        setError('Partner account not found.');
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to verify account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ background: NAVY }}>
      <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-8 w-auto mb-6 opacity-60" />
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-5 text-center" style={{ background: NAVY }}>
          <p className="text-white font-black text-sm uppercase tracking-widest">Partner Leads Dashboard</p>
          <p className="text-blue-300 text-xs mt-1">View your leads and VTON opportunities</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Partner Email</label>
            <input 
              type="email" 
              required 
              value={email} 
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
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 font-bold text-sm rounded-xl text-white transition disabled:opacity-50"
            style={{ background: loading ? "#888" : RED }}
          >
            {loading ? "Verifying…" : "Access My Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

function LeadsSection({ leads, onRefresh }) {
  const newCount = leads.filter(l => (l.status || "New") === "New").length;
  const contactedCount = leads.filter(l => (l.status || "New") === "Contacted").length;
  const qualifiedCount = leads.filter(l => (l.status || "New") === "Qualified").length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">My Leads</p>
          <p className="text-sm font-semibold text-slate-800 mt-1">{leads.length} total</p>
        </div>
        <button onClick={onRefresh} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 px-5 py-4 border-b border-slate-100">
        <div className="text-center">
          <p className="text-2xl font-black text-blue-600">{newCount}</p>
          <p className="text-xs text-slate-500">New</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-amber-600">{contactedCount}</p>
          <p className="text-xs text-slate-500">Contacted</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-purple-600">{qualifiedCount}</p>
          <p className="text-xs text-slate-500">Qualified</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-slate-800">{leads.length > 0 ? Math.round((contactedCount / leads.length) * 100) : 0}%</p>
          <p className="text-xs text-slate-500">Contacted</p>
        </div>
      </div>

      {/* Leads list */}
      {leads.length === 0 ? (
        <div className="px-5 py-8 text-center text-slate-400">
          <p className="text-sm">No leads assigned yet</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {leads.slice(0, 5).map(lead => {
            const cfg = LEAD_STATUSES.find(s => s.value === (lead.status || "New")) || LEAD_STATUSES[0];
            return (
              <div key={lead.id} className="px-5 py-3 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{lead.name || lead.address_or_link || "—"}</p>
                    <div className="flex items-center gap-3 flex-wrap mt-1">
                      {lead.email && (
                        <a href={`mailto:${lead.email}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {lead.email}
                        </a>
                      )}
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {lead.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border whitespace-nowrap flex-shrink-0 ${cfg.color}`}>
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
          {leads.length > 5 && (
            <div className="px-5 py-3 bg-slate-50 text-center text-xs text-slate-500">
              +{leads.length - 5} more leads
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OpportunitiesSection({ opportunities, onRefresh }) {
  const assigned = opportunities.length;
  const contacted = opportunities.filter(o => !["assigned", "review_window", "forfeited"].includes(o.opportunity_status || "assigned")).length;
  const completed = opportunities.filter(o => ["completed", "closed_won"].includes(o.opportunity_status)).length;
  const earnedBack = Math.min((contacted || 0) * 200, 2000);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">VTON Opportunities</p>
          <p className="text-sm font-semibold text-slate-800 mt-1">{assigned} assigned</p>
        </div>
        <button onClick={onRefresh} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 transition">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Progress metrics */}
      <div className="space-y-4 px-5 py-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold text-slate-500">Contacted / Assigned</p>
            <p className="text-xs font-bold text-slate-700">{contacted} / {assigned}</p>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ width: `${assigned > 0 ? (contacted / assigned) * 100 : 0}%`, background: "#3B82F6" }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs font-semibold text-slate-500">Deposit Earned Back</p>
            <p className="text-xs font-bold text-slate-700">${earnedBack.toLocaleString()} / $2,000</p>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500" 
              style={{ width: `${(earnedBack / 2000) * 100}%`, background: "#10b981" }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">{contacted} verified actions × $200 refund each</p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-sm font-black text-slate-800">{assigned}</p>
            <p className="text-xs text-slate-500">Assigned</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-sm font-black text-amber-600">{contacted}</p>
            <p className="text-xs text-slate-500">Engaged</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-sm font-black text-green-600">{completed}</p>
            <p className="text-xs text-slate-500">Completed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartnerLeadsDashboard() {
  const [partner, setPartner] = useState(null);
  const [leads, setLeads] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAccess = async (p) => {
    setPartner(p);
    await fetchData(p.email);
  };

  const fetchData = async (email) => {
    setLoading(true);
    const [leadsData, oppsData] = await Promise.all([
      base44.entities.Lead.filter({ assigned_agent: partner?.name }, "-created_date", 100),
      base44.entities.VTONOpportunity.filter({ partner_email: email }, "-created_date", 100),
    ]);
    setLeads(leadsData);
    setOpportunities(oppsData);
    setLoading(false);
  };

  if (!partner) return <AccessGate onAccess={handleAccess} />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto opacity-70" />
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Partner Dashboard</p>
              <p className="text-sm font-bold text-slate-800">{partner.name}</p>
            </div>
          </div>
          <button onClick={() => setPartner(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <LeadsSection leads={leads} onRefresh={() => fetchData(partner.email)} />
            <OpportunitiesSection opportunities={opportunities} onRefresh={() => fetchData(partner.email)} />

            {/* Quick info */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4">
              <p className="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">Territory</p>
              <p className="text-sm font-semibold text-blue-900">{partner.territory || "To be assigned"}</p>
              {partner.calendar_url && (
                <a href={partner.calendar_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition">
                  📅 Schedule Appointment
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}