import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Users, DollarSign, TrendingUp, CheckCircle, RefreshCw, Plus, X, Save, Search, FileSpreadsheet, BarChart2, Phone, Upload, ChevronDown, MapPin, Calendar, Home, AlertCircle, Zap } from "lucide-react";
import BulkProspectUpload from "@/components/activator/BulkProspectUpload";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const STATUS_CONFIG = {
  SCANNED:   { label: "New Scan", color: "bg-slate-100 text-slate-700 border-slate-200", accent: "#64748b" },
  VERIFIED:  { label: "Verified", color: "bg-blue-100 text-blue-700 border-blue-200", accent: "#3b82f6" },
  QUALIFIED: { label: "Qualified", color: "bg-amber-100 text-amber-700 border-amber-200", accent: "#f59e0b" },
  SCHEDULED: { label: "Scheduled", color: "bg-purple-100 text-purple-700 border-purple-200", accent: "#a855f7" },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-700 border-green-200", accent: "#16a34a" },
  CLOSED:    { label: "Closed", color: "bg-emerald-100 text-emerald-800 border-emerald-200", accent: "#059669" },
};

function LeadDetailModal({ lead, onClose }) {
  if (!lead) return null;
  const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-auto" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: NAVY }}>
          <div>
            <p className="text-white font-bold">{fullName || lead.property_address || "Prospect"}</p>
            <p className="text-blue-300 text-xs mt-0.5">{lead.property_address}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-2 gap-6">
          {/* Contact Info */}
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Contact</p>
            <div className="space-y-2">
              {fullName && <p className="font-bold text-slate-800">{fullName}</p>}
              {(lead.homeowner_phone || lead.phone) && (
                <a href={`tel:${lead.homeowner_phone || lead.phone}`} className="text-blue-600 hover:underline text-sm">
                  📞 {lead.homeowner_phone || lead.phone}
                </a>
              )}
              {(lead.homeowner_email || lead.email) && (
                <a href={`mailto:${lead.homeowner_email || lead.email}`} className="text-blue-600 hover:underline text-sm block">
                  ✉️ {lead.homeowner_email || lead.email}
                </a>
              )}
            </div>
          </div>

          {/* Status & Rep */}
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Status</p>
            <div className="space-y-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${STATUS_CONFIG[lead.status]?.color}`}>
                {STATUS_CONFIG[lead.status]?.label || lead.status}
              </span>
              {lead.rep_code && <p className="text-sm text-slate-600"><span className="font-semibold">Rep:</span> {lead.rep_code}</p>}
            </div>
          </div>

          {/* Property Data */}
          <div className="col-span-2">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Property Details</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {lead.property_type && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-600 font-semibold">Type</p>
                  <p className="text-sm font-bold text-slate-900">{lead.property_type}</p>
                </div>
              )}
              {lead.estimated_price && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-xs text-green-600 font-semibold">Est Value</p>
                  <p className="text-sm font-bold text-slate-900">${(lead.estimated_price/1000).toFixed(0)}K</p>
                </div>
              )}
              {lead.estimated_equity && (
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-xs text-purple-600 font-semibold">Est Equity</p>
                  <p className="text-sm font-bold text-slate-900">${(lead.estimated_equity/1000).toFixed(0)}K</p>
                </div>
              )}
              {lead.distress_score != null && lead.distress_score > 0 && (
                <div className={`rounded-lg p-3 border ${lead.distress_score > 30 ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-200"}`}>
                  <p className={`text-xs font-semibold ${lead.distress_score > 30 ? "text-red-600" : "text-slate-600"}`}>Distress Score</p>
                  <p className="text-sm font-bold text-slate-900">{lead.distress_score}</p>
                </div>
              )}
              {lead.listing_dom != null && lead.listing_dom > 0 && (
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <p className="text-xs text-amber-600 font-semibold">Days on Market</p>
                  <p className="text-sm font-bold text-slate-900">{lead.listing_dom}</p>
                </div>
              )}
            </div>
          </div>

          {/* Qualifications */}
          {(lead.planning_to_buy || lead.timeline || lead.next_home_type) && (
            <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs font-black uppercase tracking-wider text-blue-700 mb-3">Qualifications</p>
              <div className="grid grid-cols-3 gap-3 text-sm">
                {lead.planning_to_buy && <p><span className="font-semibold text-blue-700">Buy:</span> {lead.planning_to_buy}</p>}
                {lead.timeline && <p><span className="font-semibold text-blue-700">Timeline:</span> {lead.timeline}</p>}
                {lead.next_home_type && <p><span className="font-semibold text-blue-700">Type:</span> {lead.next_home_type}</p>}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="col-span-2 border-t border-slate-200 pt-4 text-xs text-slate-500">
            <p>Created: {new Date(lead.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddActivatorModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", rep_code: "", assigned_area: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const created = await base44.entities.FieldActivator.create({ ...form, status: "active" });
    setSaving(false);
    onCreated(created);
    onClose();
  };

  const inputCls = "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white";
  const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: NAVY }}>
          <p className="text-sm font-bold text-white">Add Field Activator</p>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelCls}>Full Name *</label>
            <input required className={inputCls} placeholder="John Smith" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Email *</label>
              <input required type="email" className={inputCls} placeholder="john@email.com" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} placeholder="(818) 555-1234" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Rep Code *</label>
              <input required className={inputCls} placeholder="SMITH01" value={form.rep_code}
                onChange={e => setForm(f => ({ ...f, rep_code: e.target.value.toUpperCase() }))} />
            </div>
            <div>
              <label className={labelCls}>Assigned Area</label>
              <input className={inputCls} placeholder="Glendale, CA" value={form.assigned_area}
                onChange={e => setForm(f => ({ ...f, assigned_area: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-5 py-2.5 font-bold text-sm rounded-lg text-white transition disabled:opacity-50" style={{ background: NAVY }}>
              <Plus className="h-4 w-4" /> {saving ? "Adding…" : "Add Activator"}
            </button>
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FieldActivatorAdmin() {
  const [loading, setLoading] = useState(true);
  const [activators, setActivators] = useState([]);
  const [partners, setPartners] = useState([]);
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddActivator, setShowAddActivator] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    const init = async () => {
      await fetchAll();
      setLoading(false);
    };
    init();
  }, []);

  const fetchAll = async () => {
    const [a, l, p, pts] = await Promise.all([
      base44.entities.FieldActivator.list("-created_date", 200),
      base44.entities.ActivatorLead.list("-created_date", 500),
      base44.entities.ActivatorPayment.list("-created_date", 500),
      base44.entities.PartnerApplication.filter({ status: "approved" }, "-created_date", 100),
    ]);
    setActivators(a);
    setLeads(l);
    setPayments(p);
    setPartners(pts);
  };

  const handleApprovePayment = async (payment) => {
    await base44.entities.ActivatorPayment.update(payment.id, { status: "APPROVED" });
    setPayments(prev => prev.map(p => p.id === payment.id ? { ...p, status: "APPROVED" } : p));
  };

  const handleMarkPaid = async (payment) => {
    await base44.entities.ActivatorPayment.update(payment.id, { status: "PAID" });
    setPayments(prev => prev.map(p => p.id === payment.id ? { ...p, status: "PAID" } : p));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
    </div>
  );

  const filteredLeads = leads.filter(l => {
    const matchStatus = filterStatus === "All" || l.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q || `${l.first_name} ${l.last_name} ${l.email} ${l.rep_code} ${l.property_address}`.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const stats = {
    total: leads.length,
    contacted: leads.filter(l => l.status !== "SCANNED").length,
    qualified: leads.filter(l => l.status === "QUALIFIED").length,
    scheduled: leads.filter(l => ["SCHEDULED", "COMPLETED", "CLOSED"].includes(l.status)).length,
    paid: payments.filter(p => p.status === "PAID").reduce((s, p) => s + p.amount, 0),
    pending: payments.filter(p => p.status === "PENDING").length,
  };

  const contactRate = stats.total > 0 ? Math.round((stats.contacted / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {showAddActivator && <AddActivatorModal onClose={() => setShowAddActivator(false)} onCreated={(a) => setActivators(prev => [a, ...prev])} />}
      {showBulkUpload && <BulkProspectUpload activators={activators} onClose={() => setShowBulkUpload(false)} onImported={async (count) => { await fetchAll(); setShowBulkUpload(false); }} />}
      {selectedLead && <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/"><img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto opacity-80" /></Link>
            <div className="h-5 w-px bg-slate-200" />
            <p className="text-sm font-bold text-slate-800">Field Activation Admin</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchAll} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition"><RefreshCw className="h-4 w-4" /></button>
            <button onClick={() => setShowBulkUpload(true)} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg text-white transition bg-blue-700 hover:bg-blue-800"><FileSpreadsheet className="h-3.5 w-3.5" /> Import</button>
            <button onClick={() => setShowAddActivator(true)} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg text-white transition" style={{ background: NAVY }}><Plus className="h-3.5 w-3.5" /> Activator</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-slate-800">{stats.total}</p>
            <p className="text-xs text-slate-500 mt-1">Total Leads</p>
          </div>
          <div className="bg-white border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-blue-700">{stats.contacted}</p>
            <p className="text-xs text-blue-600 mt-1">Contacted</p>
          </div>
          <div className="bg-white border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-amber-700">{stats.qualified}</p>
            <p className="text-xs text-amber-600 mt-1">Qualified</p>
          </div>
          <div className="bg-white border border-purple-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-purple-700">{stats.scheduled}</p>
            <p className="text-xs text-purple-600 mt-1">Scheduled</p>
          </div>
          <div className="bg-white border border-green-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-green-700">${(stats.paid/1000).toFixed(0)}K</p>
            <p className="text-xs text-green-600 mt-1">Paid Out</p>
          </div>
          <div className="bg-white border border-red-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-red-700">{stats.pending}</p>
            <p className="text-xs text-red-600 mt-1">Pending</p>
          </div>
        </div>

        {/* Contact Rate */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Contact Rate</p>
            <span className="text-lg font-black" style={{ color: contactRate >= 50 ? "#16a34a" : contactRate >= 25 ? "#f59e0b" : NAVY }}>{contactRate}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${contactRate}%`, background: contactRate >= 50 ? "#16a34a" : contactRate >= 25 ? "#f59e0b" : NAVY }} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          {["dashboard", "leads", "activators", "payments"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-bold rounded-t-lg transition capitalize ${activeTab === tab ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Top Performers</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activators.slice(0, 3).map(a => {
                  const aLeads = leads.filter(l => l.rep_code === a.rep_code);
                  const aContacted = aLeads.filter(l => l.status !== "SCANNED").length;
                  const rate = aLeads.length > 0 ? Math.round((aContacted / aLeads.length) * 100) : 0;
                  return (
                    <div key={a.id} className="bg-white border border-slate-200 rounded-xl p-4">
                      <p className="text-sm font-bold text-slate-900">{a.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{a.assigned_area || "No area"} · {a.rep_code}</p>
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600">Contact Rate</span>
                          <span className="font-bold" style={{ color: rate >= 50 ? "#16a34a" : rate >= 25 ? "#f59e0b" : "#6b7280" }}>{rate}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${rate}%`, background: rate >= 50 ? "#16a34a" : rate >= 25 ? "#f59e0b" : "#0B1F3B" }} />
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                          <div><p className="font-black text-slate-800">{aLeads.length}</p><p className="text-slate-500">Leads</p></div>
                          <div><p className="font-black text-blue-700">{aContacted}</p><p className="text-slate-500">Contacted</p></div>
                          <div><p className="font-black text-slate-600">{aLeads.length - aContacted}</p><p className="text-slate-500">Pending</p></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads by name, email, rep code, address…" className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500" />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none font-medium">
                <option>All</option>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => <option key={key} value={key}>{cfg.label}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLeads.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
                  <MapPin className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No leads found</p>
                </div>
              ) : (
                filteredLeads.map(lead => {
                  const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
                  const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.SCANNED;
                  return (
                    <button
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="text-left bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition"
                      style={{ borderLeft: `3px solid ${statusCfg.accent}` }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm">{fullName || lead.property_address || "Prospect"}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold border ${statusCfg.color}`}>{statusCfg.label}</span>
                        </div>
                      </div>

                      {lead.property_address && <p className="text-xs text-slate-600 flex items-center gap-1 mb-3"><MapPin className="h-3 w-3" /> {lead.property_address}</p>}

                      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                        {lead.property_type && <div className="bg-blue-50 rounded px-2 py-1"><span className="text-blue-600 font-semibold">Type:</span> {lead.property_type}</div>}
                        {lead.estimated_price && <div className="bg-green-50 rounded px-2 py-1"><span className="text-green-600 font-semibold">$:</span> {(lead.estimated_price/1000).toFixed(0)}K</div>}
                        {lead.estimated_equity && <div className="bg-purple-50 rounded px-2 py-1"><span className="text-purple-600 font-semibold">Eq:</span> {(lead.estimated_equity/1000).toFixed(0)}K</div>}
                        {lead.listing_dom != null && lead.listing_dom > 0 && <div className="bg-amber-50 rounded px-2 py-1"><Calendar className="h-3 w-3 inline mr-0.5 text-amber-600" /><span className="text-amber-600 font-semibold">{lead.listing_dom}</span></div>}
                        {lead.distress_score != null && lead.distress_score > 0 && <div className={`rounded px-2 py-1 ${lead.distress_score > 30 ? "bg-red-50" : "bg-slate-50"}`}><Zap className={`h-3 w-3 inline mr-0.5 ${lead.distress_score > 30 ? "text-red-600" : "text-slate-600"}`} /><span className={lead.distress_score > 30 ? "text-red-600 font-semibold" : "text-slate-600 font-semibold"}>{lead.distress_score}</span></div>}
                      </div>

                      {(lead.homeowner_phone || lead.homeowner_email) && (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {lead.homeowner_phone && <a href={`tel:${lead.homeowner_phone}`} className="text-green-600 hover:underline">📞</a>}
                          {lead.homeowner_email && <a href={`mailto:${lead.homeowner_email}`} className="text-blue-600 hover:underline">✉️</a>}
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ACTIVATORS TAB */}
        {activeTab === "activators" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activators.map(a => {
              const aLeads = leads.filter(l => l.rep_code === a.rep_code);
              const aContacted = aLeads.filter(l => l.status !== "SCANNED").length;
              const rate = aLeads.length > 0 ? Math.round((aContacted / aLeads.length) * 100) : 0;
              const aPaid = payments.filter(p => p.activator_id === a.id && p.status === "PAID").reduce((s, p) => s + p.amount, 0);
              return (
                <div key={a.id} className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-sm font-bold text-slate-900">{a.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{a.email} · {a.assigned_area || "No area"}</p>
                  <p className="text-xs text-slate-400 mt-0.5 font-mono">{a.rep_code}</p>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-slate-50 rounded-lg p-3 text-center"><p className="text-lg font-black text-slate-800">{aLeads.length}</p><p className="text-xs text-slate-500 mt-1">Leads</p></div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center"><p className="text-lg font-black text-blue-700">{aContacted}</p><p className="text-xs text-blue-600 mt-1">Contacted</p></div>
                    <div className="bg-amber-50 rounded-lg p-3 text-center"><p className="text-lg font-black text-amber-700">{rate}%</p><p className="text-xs text-amber-600 mt-1">Rate</p></div>
                    <div className="bg-green-50 rounded-lg p-3 text-center"><p className="text-lg font-black text-green-700">${aPaid}</p><p className="text-xs text-green-600 mt-1">Paid</p></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {["Activator", "Type", "Amount", "Status", "Action"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No payments yet</td></tr>
                ) : (
                  payments.map(p => {
                    const activator = activators.find(a => a.id === p.activator_id);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-semibold text-slate-800">{activator?.name || p.rep_code || "—"}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.type === "CLOSE" ? "bg-emerald-100 text-emerald-800" : p.type === "CONSULT" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>{p.type}</span></td>
                        <td className="px-4 py-3 font-black text-slate-800">${p.amount}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${p.status === "PAID" ? "bg-green-50 text-green-700 border-green-200" : p.status === "APPROVED" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>{p.status}</span></td>
                        <td className="px-4 py-3">
                          {p.status === "PENDING" && <button onClick={() => handleApprovePayment(p)} className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Approve</button>}
                          {p.status === "APPROVED" && <button onClick={() => handleMarkPaid(p)} className="px-3 py-1 text-xs font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Paid</button>}
                          {p.status === "PAID" && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}