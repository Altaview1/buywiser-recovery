import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { LogOut, RefreshCw, Users, MapPin, DollarSign, TrendingUp, AlertCircle, Upload, X, Bell, Target, Zap } from "lucide-react";

const NAVY = "#0B1F3B";
const RED = "#C62828";

function AssignLeadModal({ lead, partners, onClose, onAssigned }) {
  const [selectedPartner, setSelectedPartner] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAssign = async () => {
    if (!selectedPartner) return;
    setSaving(true);
    await base44.entities.Lead.update(lead.id, { assigned_agent: selectedPartner });
    setSaving(false);
    onAssigned({ ...lead, assigned_agent: selectedPartner });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg max-w-sm w-full shadow-xl">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200">
          <h2 className="font-bold text-slate-900">Assign Lead to Partner</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">{lead.name}</p>
            <p className="text-xs text-slate-500">{lead.address_or_link}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Select Partner</label>
            <select value={selectedPartner} onChange={e => setSelectedPartner(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
              <option value="">Choose a partner...</option>
              {partners.map(p => <option key={p.id} value={p.name}>{p.name} - {p.territory || "Unassigned"}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAssign} disabled={!selectedPartner || saving}
              className="flex-1 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition disabled:opacity-50">
              {saving ? "Assigning..." : "Assign"}
            </button>
            <button onClick={onClose} className="flex-1 py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activators, setActivators] = useState([]);
  const [leads, setLeads] = useState([]);
  const [payments, setPayments] = useState([]);
  const [partners, setPartners] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedActivator, setSelectedActivator] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [reassignModal, setReassignModal] = useState(null);

  useEffect(() => {
    checkAuthAndFetch();
  }, []);

  const checkAuthAndFetch = async () => {
    try {
      const me = await base44.auth.me();
      if (!me || me.role !== "admin") {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(me);
      await fetchData();
    } catch (err) {
      console.error("Auth error:", err);
      setLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [a, l, p, pts, opps] = await Promise.all([
        base44.entities.FieldActivator.filter({ status: "active" }, "-created_date", 100),
        base44.entities.ActivatorLead.list("-created_date", 500),
        base44.entities.ActivatorPayment.list("-created_date", 500),
        base44.entities.PartnerApplication.filter({ status: "approved" }, "-created_date", 100),
        base44.entities.VTONOpportunity.list("-created_date", 500),
      ]);
      setActivators(a);
      setLeads(l);
      setPayments(p);
      setPartners(pts);
      setOpportunities(opps);
      
      // Simulate notifications from recent activity
      const recentPayments = p.filter(x => new Date(x.created_date) > new Date(Date.now() - 24*60*60*1000)).length;
      const pendingAudit = p.filter(x => x.status === "PENDING_AUDIT").length;
      const newOpps = opps.filter(x => x.opportunity_status === "assigned" && new Date(x.created_date) > new Date(Date.now() - 24*60*60*1000)).length;
      
      const notifs = [];
      if (pendingAudit > 0) notifs.push({ id: 1, type: "warning", message: `${pendingAudit} payments flagged for audit (short visits)`, icon: "⚠️" });
      if (newOpps > 0) notifs.push({ id: 2, type: "info", message: `${newOpps} new VTON opportunities assigned today`, icon: "🎯" });
      if (recentPayments > 0) notifs.push({ id: 3, type: "success", message: `${recentPayments} new payment records this week`, icon: "✅" });
      setNotifications(notifs);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  };

  const handleStatusChange = async (lead, newStatus) => {
    try {
      await base44.entities.ActivatorLead.update(lead.id, { status: newStatus });
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus } : l));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleLogout = () => {
    base44.auth.logout("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: NAVY }}>
        <div className="text-white text-center">
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: NAVY }}>
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg font-bold text-slate-900 mb-2">Admin Sign In Required</p>
          <p className="text-sm text-slate-600 mb-6">Please sign in with your admin account to access this dashboard.</p>
          <button
            onClick={() => base44.auth.redirectToLogin(window.location.href)}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition hover:opacity-90"
            style={{ background: NAVY }}
          >
            Sign In to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  // STATS
  const totalLeads = leads.length;
  const contacted = leads.filter(l => l.status !== "SCANNED").length;
  const scheduled = leads.filter(l => ["SCHEDULED", "COMPLETED", "CLOSED"].includes(l.status)).length;
  const pendingPayments = payments.filter(p => p.status === "PENDING").reduce((s, p) => s + p.amount, 0);
  const paidOut = payments.filter(p => p.status === "PAID").reduce((s, p) => s + p.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-6 w-auto opacity-70" />
            <p className="text-xs text-slate-400 mt-1">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <p className="text-2xl font-black text-slate-800">{totalLeads}</p>
            <p className="text-xs text-slate-500 mt-1">Total Leads</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <p className="text-2xl font-black text-blue-700">{contacted}</p>
            <p className="text-xs text-slate-500 mt-1">Contacted</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <p className="text-2xl font-black text-purple-700">{scheduled}</p>
            <p className="text-xs text-slate-500 mt-1">Scheduled</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <p className="text-2xl font-black text-amber-700">${(pendingPayments/1000).toFixed(0)}K</p>
            <p className="text-xs text-slate-500 mt-1">Pending Pay</p>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
            <p className="text-2xl font-black text-green-700">${(paidOut/1000).toFixed(0)}K</p>
            <p className="text-xs text-slate-500 mt-1">Paid Out</p>
          </div>
        </div>

        {/* Notifications Banner */}
        {notifications.length > 0 && (
          <div className="space-y-2">
            {notifications.map(notif => (
              <div key={notif.id} className={`rounded-lg p-4 flex items-start gap-3 ${
                notif.type === "warning" ? "bg-amber-50 border border-amber-200" :
                notif.type === "success" ? "bg-green-50 border border-green-200" :
                "bg-blue-50 border border-blue-200"
              }`}>
                <span className="text-lg">{notif.icon}</span>
                <p className={`text-sm font-medium ${
                  notif.type === "warning" ? "text-amber-800" :
                  notif.type === "success" ? "text-green-800" :
                  "text-blue-800"
                }`}>{notif.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "scans", label: "QR Scans", icon: "📲" },
            { id: "opportunities", label: "VTON Opportunities", icon: "🎯" },
            { id: "activators", label: "Activators", icon: "👥" },
            { id: "leads", label: "Leads", icon: "📍" },
            { id: "partners", label: "Partners", icon: "🤝" },
            { id: "payments", label: "Payments", icon: "💰" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-semibold transition border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-600 text-slate-900"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Activators */}
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Top Activators by Leads</h3>
              <div className="space-y-2">
                {activators
                  .map(a => ({
                    ...a,
                    leadCount: leads.filter(l => l.rep_code === a.rep_code).length,
                  }))
                  .sort((a, b) => b.leadCount - a.leadCount)
                  .slice(0, 5)
                  .map(a => (
                    <div key={a.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                      <p className="text-sm font-semibold text-slate-800">{a.name}</p>
                      <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">{a.leadCount}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Recent Leads</h3>
              <div className="space-y-2">
                {leads.slice(0, 5).map(l => (
                  <div key={l.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">{l.first_name} {l.last_name}</p>
                      <p className="text-xs text-slate-500 truncate">{l.property_address}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${
                      l.status === "CLOSED" ? "bg-green-100 text-green-700" :
                      l.status === "SCHEDULED" ? "bg-purple-100 text-purple-700" :
                      l.status === "QUALIFIED" ? "bg-amber-100 text-amber-700" :
                      "bg-slate-100 text-slate-600"
                    }`}>
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "activators" && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Name</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Rep Code</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-600">Leads</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-600">Tier</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-600">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activators.map(a => {
                    const leadCount = leads.filter(l => l.rep_code === a.rep_code).length;
                    const tier = a.activator_tier === "SENIOR_FIELD_ACTIVATOR" ? "⭐ Senior" : "Tier 1";
                    return (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">{a.name}</td>
                        <td className="px-4 py-3 font-mono text-xs bg-slate-50 text-slate-700">{a.rep_code}</td>
                        <td className="px-4 py-3 text-center font-bold text-blue-700">{leadCount}</td>
                        <td className="px-4 py-3 text-center text-xs font-bold">{tier}</td>
                        <td className="px-4 py-3 text-center text-blue-600 hover:underline">
                          {a.phone && <a href={`tel:${a.phone}`}>📞</a>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "leads" && (
          <>
            {assignModal && (
              <AssignLeadModal
                lead={assignModal}
                partners={partners}
                onClose={() => setAssignModal(null)}
                onAssigned={(updated) => {
                  setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
                  setAssignModal(null);
                }}
              />
            )}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-slate-600">Contact</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-600">Address</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-600">Status</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-600">Assigned To</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.slice(0, 20).map(l => (
                      <tr key={l.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{l.name}</div>
                          <div className="text-xs text-slate-500">{l.email}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">{l.address_or_link}</td>
                        <td className="px-4 py-3">
                          <select
                            value={l.status || "New"}
                            onChange={(e) => handleStatusChange(l, e.target.value)}
                            className="text-xs px-2 py-1 rounded border border-slate-200 focus:outline-none"
                          >
                            <option>New</option>
                            <option>Contacted</option>
                            <option>Qualified</option>
                            <option>Closed</option>
                            <option>Lost</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 font-semibold text-xs text-slate-700">{l.assigned_agent || "—"}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setAssignModal(l)}
                            className="text-xs font-bold text-blue-600 hover:underline mr-2"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => setEditingLead(l)}
                            className="text-xs font-bold text-green-600 hover:underline"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "partners" && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Name</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Email</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Territory</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-600">Deposit Balance</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-600">Verified Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {partners.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">{p.name}</td>
                      <td className="px-4 py-3 text-xs text-slate-600">{p.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{p.territory || "Pending"}</td>
                      <td className="px-4 py-3 text-center font-bold text-green-700">${p.deposit_balance || 0}</td>
                      <td className="px-4 py-3 text-center font-bold text-blue-700">{p.verified_conversations || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "scans" && (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Timestamp</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Homeowner</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Property</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Rep Code</th>
                    <th className="px-4 py-3 text-left font-bold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.slice(0, 30).map(l => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">{new Date(l.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{l.first_name} {l.last_name}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 truncate">{l.property_address}</td>
                      <td className="px-4 py-3 text-xs font-mono bg-slate-50">{l.rep_code}</td>
                      <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-1 rounded ${l.status === "QUALIFIED" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "opportunities" && (
          <>
            {reassignModal && (
              <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4 mb-6">
                <div className="bg-white rounded-lg max-w-sm w-full shadow-xl">
                  <div className="px-6 py-4 flex items-center justify-between border-b border-slate-200">
                    <h2 className="font-bold text-slate-900">Reassign Opportunity</h2>
                    <button onClick={() => setReassignModal(null)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{reassignModal?.homeowner_name}</p>
                      <p className="text-xs text-slate-500">{reassignModal?.property_address}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase mb-2">New Partner</label>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            base44.entities.VTONOpportunity.update(reassignModal.id, { partner_email: e.target.value });
                            setOpportunities(prev => prev.map(o => o.id === reassignModal.id ? { ...o, partner_email: e.target.value } : o));
                            setReassignModal(null);
                          }
                        }}
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                      >
                        <option value="">Select partner...</option>
                        {partners.map(p => <option key={p.id} value={p.email}>{p.name} - {p.territory || "Unassigned"}</option>)}
                      </select>
                    </div>
                    <button onClick={() => setReassignModal(null)} className="w-full py-2 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-slate-600">Homeowner</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-600">Property</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-600">Assigned Partner</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-600">Status</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-600">Benefit</th>
                      <th className="px-4 py-3 text-center font-bold text-slate-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {opportunities.slice(0, 25).map(o => {
                      const partner = partners.find(p => p.email === o.partner_email);
                      const benefit = o.estimated_price ? `$${Math.round(o.estimated_price * 0.015).toLocaleString()}` : "—";
                      return (
                        <tr key={o.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-semibold text-slate-900">{o.homeowner_name}</td>
                          <td className="px-4 py-3 text-xs text-slate-600 truncate">{o.property_address}{o.city ? `, ${o.city}` : ""}</td>
                          <td className="px-4 py-3 text-sm text-slate-700">{partner?.name || "Unassigned"}</td>
                          <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-1 rounded ${o.opportunity_status === "completed" ? "bg-green-100 text-green-700" : o.opportunity_status === "accepted" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{o.opportunity_status}</span></td>
                          <td className="px-4 py-3 text-right font-bold text-slate-800">{benefit}</td>
                          <td className="px-4 py-3 text-center">
                            <button onClick={() => setReassignModal(o)} className="text-xs font-bold text-blue-600 hover:underline">
                              Reassign
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "payments" && (
           <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-sm">
                 <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                     <th className="px-4 py-3 text-left font-bold text-slate-600">Activator</th>
                     <th className="px-4 py-3 text-left font-bold text-slate-600">Type</th>
                     <th className="px-4 py-3 text-right font-bold text-slate-600">Amount</th>
                     <th className="px-4 py-3 text-left font-bold text-slate-600">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {payments.slice(0, 20).map(p => {
                     const activator = activators.find(a => a.id === p.activator_id);
                     return (
                       <tr key={p.id} className="hover:bg-slate-50">
                         <td className="px-4 py-3 font-semibold text-slate-900">{activator?.name || p.rep_code}</td>
                         <td className="px-4 py-3 text-xs text-slate-600">{p.type}</td>
                         <td className="px-4 py-3 text-right font-bold text-slate-800">${p.amount}</td>
                         <td className="px-4 py-3">
                           <span className={`text-xs font-bold px-2 py-1 rounded ${
                             p.status === "PAID" ? "bg-green-100 text-green-700" :
                             p.status === "APPROVED" ? "bg-blue-100 text-blue-700" :
                             p.status === "PENDING_AUDIT" ? "bg-orange-100 text-orange-700" :
                             p.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                             "bg-red-100 text-red-700"
                           }`}>
                             {p.status}
                           </span>
                         </td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}