import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Users, DollarSign, TrendingUp, CheckCircle, RefreshCw, Plus, X, Save, Search, FileSpreadsheet } from "lucide-react";
import BulkProspectUpload from "@/components/activator/BulkProspectUpload";

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
  const [partners, setPartners] = useState([]);
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState("leads");
  const [showAddActivator, setShowAddActivator] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

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
      base44.entities.PartnerApplication.filter({ status: "approved" }, "name", 200),
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
    const matchSearch = !q || `${l.first_name} ${l.last_name} ${l.email} ${l.rep_code}`.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  // Stats
  const totalVerified = leads.filter(l => l.status !== "SCANNED").length;
  const totalScheduled = leads.filter(l => ["SCHEDULED", "COMPLETED", "CLOSED"].includes(l.status)).length;
  const totalPaid = payments.filter(p => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const pendingApproval = payments.filter(p => p.status === "PENDING").length;

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
          partners={partners}
          onClose={() => setShowBulkUpload(false)}
          onImported={(count) => { fetchAll(); setActiveTab("leads"); }}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-7 w-auto opacity-80" />
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <p className="text-sm font-bold text-slate-800">Field Activation Admin</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchAll} className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button onClick={() => setShowBulkUpload(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg text-white transition bg-blue-700 hover:bg-blue-800">
              <FileSpreadsheet className="h-3.5 w-3.5" /> Bulk Upload Prospects
            </button>
            <button onClick={() => setShowAddActivator(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg text-white transition"
              style={{ background: NAVY }}>
              <Plus className="h-3.5 w-3.5" /> Add Activator
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Leads", value: leads.length, color: "text-slate-800" },
            { label: "Verified", value: totalVerified, color: "text-blue-700" },
            { label: "Scheduled", value: totalScheduled, color: "text-purple-700" },
            { label: "Paid Out", value: `$${totalPaid}`, color: "text-green-700" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Pending approvals banner */}
        {pendingApproval > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
            <DollarSign className="h-5 w-5 text-amber-600" />
            <p className="text-sm font-bold text-amber-800">{pendingApproval} payment{pendingApproval > 1 ? "s" : ""} pending approval</p>
            <button onClick={() => setActiveTab("payments")} className="ml-auto text-xs font-bold text-amber-700 underline">
              Review →
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          {["leads", "activators", "payments"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold rounded-t-lg transition capitalize ${
                activeTab === tab ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* LEADS TAB */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search by name, email, rep code…"
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 transition" />
              </div>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none font-medium text-slate-700">
                <option>All</option>
                {["SCANNED", "VERIFIED", "QUALIFIED", "SCHEDULED", "COMPLETED", "CLOSED"].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {["Name", "Contact", "Rep Code", "Status", "Charity", "Date"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-black uppercase tracking-wider text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">No leads found</td></tr>
                  ) : filteredLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3 font-semibold text-slate-800">{lead.first_name} {lead.last_name}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        <div>{lead.email}</div>
                        <div>{lead.phone}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{lead.rep_code || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${STATUS_COLORS[lead.status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">{lead.charity_selected?.replace("_", " ") || "—"}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {lead.created_date ? new Date(lead.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ACTIVATORS TAB */}
        {activeTab === "activators" && (
          <div className="space-y-3">
            {repPerf.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No field activators yet. Add one above.</p>
              </div>
            ) : repPerf.map(a => (
              <div key={a.id} className="bg-white border border-slate-200 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{a.name}</p>
                    <p className="text-xs text-slate-400">{a.email} · {a.assigned_area || "No area assigned"}</p>
                  </div>
                  <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded font-bold text-slate-700">{a.rep_code}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: "Leads", value: a.leadCount },
                    { label: "Verified", value: a.verifiedCount },
                    { label: "Scheduled", value: a.scheduledCount },
                    { label: "Paid", value: `$${a.paidAmount}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-slate-50 rounded-xl py-2">
                      <p className="text-lg font-black text-slate-800">{value}</p>
                      <p className="text-xs text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
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
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-sm">No payments yet</td></tr>
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
                      <td className="px-4 py-3 font-black text-slate-800">${p.amount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${PAYMENT_STATUS_COLORS[p.status]}`}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        {p.status === "PENDING" && (
                          <button onClick={() => handleApprovePayment(p)}
                            className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                            Approve
                          </button>
                        )}
                        {p.status === "APPROVED" && (
                          <button onClick={() => handleMarkPaid(p)}
                            className="px-3 py-1 text-xs font-bold bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                            Mark Paid
                          </button>
                        )}
                        {p.status === "PAID" && <CheckCircle className="h-4 w-4 text-green-600" />}
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