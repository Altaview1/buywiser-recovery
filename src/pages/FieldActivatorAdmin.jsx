import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Users, DollarSign, TrendingUp, CheckCircle, RefreshCw, Plus, X, Save, FileSpreadsheet, BarChart2, Phone, Upload } from "lucide-react";
import BulkProspectUpload from "@/components/activator/BulkProspectUpload";
import ActivatorLeadsTable from "@/components/ActivatorLeadsTable";

const NAVY = "#0B1F3B";
const RED = "#C62828";

const STATUS_COLORS = {
  SCANNED:   "bg-slate-100 text-slate-600 border-slate-200",
  VERIFIED:  "bg-blue-100 text-blue-700 border-blue-200",
  QUALIFIED: "bg-amber-100 text-amber-700 border-amber-200",
  SCHEDULED: "bg-purple-100 text-purple-700 border-purple-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  CLOSED:    "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const PAYMENT_STATUS_COLORS = {
  PENDING:  "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-blue-50 text-blue-700 border-blue-200",
  PAID:     "bg-green-50 text-green-700 border-green-200",
};

function LeadDetailModal({ lead, onClose }) {
  if (!lead) return null;
  
  const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 overflow-auto" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between bg-slate-900 sticky top-0 z-10">
          <div>
            <p className="text-white font-bold text-sm">{fullName || lead.property_address || "Lead"}</p>
            <p className="text-blue-300 text-xs mt-0.5">{lead.email || "—"}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Contact Info */}
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Contact</p>
            <div className="space-y-2 text-sm">
              {fullName && <p className="font-bold text-slate-800">{fullName}</p>}
              {lead.phone && <a href={`tel:${lead.phone}`} className="block text-blue-600 hover:text-blue-800">📞 {lead.phone}</a>}
              {lead.email && <a href={`mailto:${lead.email}`} className="block text-blue-600 hover:text-blue-800">✉ {lead.email}</a>}
            </div>
          </div>

          {/* Property Details */}
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Property</p>
            <div className="space-y-2 text-sm">
              {lead.property_address && <p className="font-semibold text-slate-800">📍 {lead.property_address}</p>}
              {lead.property_type && <p><span className="text-slate-600">Type:</span> <span className="font-semibold">{lead.property_type}</span></p>}
              {lead.estimated_price && <p><span className="text-slate-600">Est Value:</span> <span className="font-semibold">${(lead.estimated_price/1000).toFixed(0)}K</span></p>}
              {lead.estimated_equity && <p><span className="text-slate-600">Est Equity:</span> <span className="font-semibold">${(lead.estimated_equity/1000).toFixed(0)}K</span></p>}
              {lead.distress_score != null && lead.distress_score > 0 && <p><span className="text-slate-600">Distress Score:</span> <span className="font-semibold text-red-600">{lead.distress_score}</span></p>}
              {lead.listing_dom != null && lead.listing_dom > 0 && <p><span className="text-slate-600">Days on Market:</span> <span className="font-semibold text-amber-600">{lead.listing_dom} days</span></p>}
            </div>
          </div>

          {/* Status & Rep */}
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Status</p>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[lead.status]}`}>
                {lead.status || "Unknown"}
              </span>
              {lead.rep_code && <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">Rep: {lead.rep_code}</span>}
            </div>
          </div>

          {/* Qualifications */}
          {(lead.planning_to_buy || lead.timeline || lead.next_home_type) && (
            <div className="bg-blue-50 rounded-lg p-3 space-y-1 text-xs">
              <p className="font-bold text-blue-700 mb-2">Qualifications</p>
              {lead.planning_to_buy && <p><span className="text-blue-600 font-semibold">Plans to Buy:</span> {lead.planning_to_buy}</p>}
              {lead.timeline && <p><span className="text-blue-600 font-semibold">Timeline:</span> {lead.timeline}</p>}
              {lead.next_home_type && <p><span className="text-blue-600 font-semibold">Home Type:</span> {lead.next_home_type}</p>}
            </div>
          )}

          {/* Appointment */}
          {lead.appointment_scheduled && (
            <div className="bg-green-50 rounded-lg p-3 text-xs">
              <p className="font-bold text-green-700">✓ Appointment Scheduled</p>
              {lead.appointment_date && <p className="text-green-600 mt-1">{new Date(lead.appointment_date).toLocaleDateString()}</p>}
            </div>
          )}

          {/* Charity */}
          {lead.charity_selected && (
            <div className="bg-amber-50 rounded-lg p-3 text-xs">
              <p className="font-bold text-amber-700">💝 Charity: {lead.charity_selected}</p>
            </div>
          )}

          {/* Timestamp */}
          <div className="border-t border-slate-100 pt-3 text-xs text-slate-400">
            <p>Created: {new Date(lead.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at {new Date(lead.created_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
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
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
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
            <button type="submit" disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2.5 font-bold text-sm rounded-lg text-white transition disabled:opacity-50"
              style={{ background: NAVY }}>
              <Plus className="h-4 w-4" /> {saving ? "Adding…" : "Add Activator"}
            </button>
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
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
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [partners, setPartners] = useState([]);
  const [activeTab, setActiveTab] = useState("leads");
  const [showAddActivator, setShowAddActivator] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  // Stats
  const totalLeads = leads.length;
  const totalContacted = leads.filter(l => l.status !== "SCANNED").length;
  const totalScheduled = leads.filter(l => ["SCHEDULED", "COMPLETED", "CLOSED"].includes(l.status)).length;
  const totalPaid = payments.filter(p => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const pendingApproval = payments.filter(p => p.status === "PENDING").length;
  const contactRate = totalLeads > 0 ? Math.round((totalContacted / totalLeads) * 100) : 0;

  // Rep performance
  const repPerf = activators.map(a => {
    const aLeads = leads.filter(l => l.rep_code === a.rep_code);
    const aPay = payments.filter(p => p.activator_id === a.id && p.status === "PAID");
    return {
      ...a,
      leadCount: aLeads.length,
      verifiedCount: aLeads.filter(l => l.status !== "SCANNED").length,
      scheduledCount: aLeads.filter(l => ["SCHEDULED", "COMPLETED", "CLOSED"].includes(l.status)).length,
      paidAmount: aPay.reduce((s, p) => s + p.amount, 0),
    };
  }).sort((a, b) => b.verifiedCount - a.verifiedCount);

  return (
    <div className="min-h-screen bg-slate-50">
      {showAddActivator && (
        <AddActivatorModal
          onClose={() => setShowAddActivator(false)}
          onCreated={(a) => setActivators(prev => [a, ...prev])}
        />
      )}
      {showBulkUpload && (
        <BulkProspectUpload
          activators={activators}
          onClose={() => setShowBulkUpload(false)}
          onImported={async () => { 
            setShowBulkUpload(false);
            await fetchAll(); 
          }}
        />
      )}
      {selectedLead && (
        <LeadDetailModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto opacity-80" />
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <h1 className="text-sm font-bold text-slate-800">Field Activation Management</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchAll} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button onClick={() => setShowBulkUpload(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg text-white transition bg-blue-700 hover:bg-blue-800">
              <FileSpreadsheet className="h-3.5 w-3.5" /> Bulk Upload
            </button>
            <button onClick={() => setShowAddActivator(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg text-white transition"
              style={{ background: NAVY }}>
              <Plus className="h-3.5 w-3.5" /> Add Activator
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-slate-800">{totalLeads}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Leads</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-blue-700">{totalContacted}</p>
            <p className="text-xs text-slate-500 mt-0.5">Contacted</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-purple-700">{totalScheduled}</p>
            <p className="text-xs text-slate-500 mt-0.5">Scheduled</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-black text-green-700">${totalPaid.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-0.5">Paid Out</p>
          </div>
        </div>

        {/* Contact Rate Progress */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-slate-900">Contact Rate</p>
            <span className={`text-lg font-black ${contactRate >= 50 ? "text-green-600" : contactRate >= 25 ? "text-amber-600" : "text-slate-500"}`}>
              {contactRate}%
            </span>
          </div>
          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${contactRate}%`,
                background: contactRate >= 50 ? "#16a34a" : contactRate >= 25 ? "#f59e0b" : "#0B1F3B"
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">{totalContacted} contacted out of {totalLeads} leads</p>
        </div>

        {/* Pending Approvals Banner */}
        {pendingApproval > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm font-bold text-amber-800 flex-1">{pendingApproval} payment{pendingApproval > 1 ? "s" : ""} awaiting approval</p>
            <button onClick={() => setActiveTab("payments")} className="text-xs font-bold text-amber-700 underline hover:text-amber-900">
              Review →
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200">
          {["leads", "activators", "payments"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold rounded-t-lg transition capitalize ${
                activeTab === tab ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}>
              {tab === "leads" && "Leads"}
              {tab === "activators" && "Activators"}
              {tab === "payments" && "Payments"}
            </button>
          ))}
        </div>

        {/* LEADS TAB */}
        {activeTab === "leads" && (
          <ActivatorLeadsTable 
            leads={leads} 
            onSelectLead={setSelectedLead}
            loading={false}
          />
        )}

        {/* ACTIVATORS TAB */}
        {activeTab === "activators" && (
          <div className="space-y-3">
            {repPerf.length === 0 ? (
              <div className="text-center py-12 bg-white border border-slate-200 rounded-lg text-slate-400">
                <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No field activators yet.</p>
              </div>
            ) : (
              repPerf.map(a => {
                const rate = a.leadCount > 0 ? Math.round((a.verifiedCount / a.leadCount) * 100) : 0;
                return (
                  <div key={a.id} className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{a.name}</p>
                        <p className="text-xs text-slate-500">{a.assigned_area || "No area"} · <span className="font-mono">{a.rep_code}</span></p>
                      </div>
                      <span className={`text-lg font-black ${rate >= 50 ? "text-green-600" : rate >= 25 ? "text-amber-600" : "text-slate-400"}`}>
                        {rate}%
                      </span>
                    </div>
                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${rate}%`,
                          background: rate >= 50 ? "#16a34a" : rate >= 25 ? "#f59e0b" : "#0B1F3B"
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="bg-slate-50 rounded p-2">
                        <p className="font-black text-slate-800">{a.leadCount}</p>
                        <p className="text-slate-500">Leads</p>
                      </div>
                      <div className="bg-blue-50 rounded p-2">
                        <p className="font-black text-blue-700">{a.verifiedCount}</p>
                        <p className="text-blue-500">Contacted</p>
                      </div>
                      <div className="bg-purple-50 rounded p-2">
                        <p className="font-black text-purple-700">{a.scheduledCount}</p>
                        <p className="text-purple-500">Scheduled</p>
                      </div>
                      <div className="bg-green-50 rounded p-2">
                        <p className="font-black text-green-700">${a.paidAmount}</p>
                        <p className="text-green-500">Paid</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Activator</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Type</th>
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-600">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">No payments</td></tr>
                ) : payments.map(p => {
                  const activator = activators.find(a => a.id === p.activator_id);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-semibold text-slate-800">{activator?.name || p.rep_code || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          p.type === "CLOSE" ? "bg-emerald-100 text-emerald-800" :
                          p.type === "CONSULT" ? "bg-purple-100 text-purple-700" :
                          "bg-blue-100 text-blue-700"
                        }`}>{p.type}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-black text-slate-800">${p.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${PAYMENT_STATUS_COLORS[p.status]}`}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {p.status === "PENDING" && (
                          <button onClick={() => handleApprovePayment(p)}
                            className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Approve
                          </button>
                        )}
                        {p.status === "APPROVED" && (
                          <button onClick={() => handleMarkPaid(p)}
                            className="px-3 py-1 text-xs font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                            Paid
                          </button>
                        )}
                        {p.status === "PAID" && <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}