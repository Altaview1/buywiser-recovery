import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import {
  Users, Search, RefreshCw, ChevronDown, ExternalLink,
  CheckCircle, Clock, Phone, Star, XCircle, StickyNote, Save, X,
  Upload, Plus, ChevronUp, FileSpreadsheet, BarChart2, RefreshCcw
} from "lucide-react";
import BulkLeadUpload from "@/components/BulkLeadUpload";
import OutcomeSummary from "@/components/OutcomeSummary";

const STATUS_CONFIG = {
  New:       { color: "bg-blue-500 text-white border-blue-500",       accent: "#3B82F6", icon: Clock },
  Contacted: { color: "bg-amber-500 text-white border-amber-500",     accent: "#F59E0B", icon: Phone },
  Qualified: { color: "bg-purple-600 text-white border-purple-600",   accent: "#9333EA", icon: Star },
  Closed:    { color: "bg-green-600 text-white border-green-600",     accent: "#16A34A", icon: CheckCircle },
  Lost:      { color: "bg-slate-400 text-white border-slate-400",     accent: "#94A3B8", icon: XCircle },
};

const ALL_STATUSES = ["All", "New", "Contacted", "Qualified", "Closed", "Lost"];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["New"];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
      <Icon className="h-3 w-3" /> {status || "New"}
    </span>
  );
}

function UploadLeadModal({ onClose, onCreated }) {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({
    address_or_link: "",
    name: "",
    email: "",
    phone: "",
    assigned_agent: "",
    utm_source: "admin_upload",
    status: "New",
    internal_notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.PartnerApplication.filter({ status: "approved" }, "name", 100)
      .then(setAgents);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const created = await base44.entities.Lead.create(form);
    setSaving(false);
    onCreated(created);
    onClose();
  };

  const inputCls = "w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white transition";
  const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-white/60" />
            <p className="text-sm font-bold text-white">Upload New Lead</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelCls}>Property Address or Listing URL *</label>
            <input required className={inputCls} placeholder="123 Main St or https://..." value={form.address_or_link}
              onChange={e => setForm(f => ({ ...f, address_or_link: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Assign to Agent *</label>
            <select required className={inputCls} value={form.assigned_agent}
              onChange={e => setForm(f => ({ ...f, assigned_agent: e.target.value }))}>
              <option value="">Select an agent…</option>
              {agents.map(a => (
                <option key={a.id} value={a.name}>{a.name} {a.territory ? `— ${a.territory}` : ""}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Lead Name</label>
              <input className={inputCls} placeholder="Jane Smith" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} placeholder="(818) 555-1234" value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input type="email" className={inputCls} placeholder="lead@email.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className={labelCls}>Initial Notes</label>
            <textarea rows={2} className={inputCls} placeholder="Any notes for the agent…" value={form.internal_notes}
              onChange={e => setForm(f => ({ ...f, internal_notes: e.target.value }))} />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition disabled:opacity-50">
              <Plus className="h-4 w-4" /> {saving ? "Adding…" : "Add Lead"}
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

const CLOSE_REASONS = [
  "No Answer",
  "Not Interested",
  "Reserved Consultation",
  "Current Agent Loyalty",
  "Not Moving",
  "Other",
];

function RecirculateModal({ lead, onClose, onRecirculated }) {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    base44.entities.PartnerApplication.filter({ status: "approved" }, "name", 100).then(setAgents);
  }, []);

  const handleConfirm = async () => {
    if (!selectedAgent) return;
    setSaving(true);
    const updated = await base44.entities.Lead.update(lead.id, {
      assigned_agent: selectedAgent,
      status: "New",
      close_reason: "",
      agent_comment: "",
      internal_notes: (lead.internal_notes ? lead.internal_notes + "\n\n" : "") +
        `[Recirculated ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} → reassigned to ${selectedAgent}]`,
    });
    setSaving(false);
    onRecirculated({ ...lead, assigned_agent: selectedAgent, status: "New", close_reason: "", agent_comment: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4 text-white/60" />
            <p className="text-sm font-bold text-white">Recirculate Lead</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-800 mb-0.5">{lead.name || "Lead"}</p>
            <p className="text-slate-500">{lead.address_or_link}</p>
            <p className="mt-1 text-slate-400">Previously with: <span className="font-medium text-slate-600">{lead.assigned_agent || "—"}</span></p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Reassign to Agent *</label>
            <select
              value={selectedAgent}
              onChange={e => setSelectedAgent(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
            >
              <option value="">Select an agent…</option>
              {agents.filter(a => a.name !== lead.assigned_agent).map(a => (
                <option key={a.id} value={a.name}>{a.name}{a.territory ? ` — ${a.territory}` : ""}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-slate-400">This will reset the lead to <strong>New</strong> and assign it to the selected agent.</p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirm}
              disabled={!selectedAgent || saving}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition disabled:opacity-40"
            >
              <RefreshCcw className="h-3.5 w-3.5" /> {saving ? "Reassigning…" : "Recirculate"}
            </button>
            <button onClick={onClose} className="px-4 py-2.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadRow({ lead, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [showRecirculate, setShowRecirculate] = useState(false);
  const [agents, setAgents] = useState([]);
  const [reassignAgent, setReassignAgent] = useState("");
  const [reassigning, setReassigning] = useState(false);
  const [status, setStatus] = useState(lead.status || "New");
  const [closeReason, setCloseReason] = useState(lead.close_reason || "");
  const [agentComment, setAgentComment] = useState(lead.agent_comment || "");
  const [notes, setNotes] = useState(lead.internal_notes || "");
  const [saving, setSaving] = useState(false);

  const isNotInterested = lead.close_reason === "Not Interested";

  useEffect(() => {
    if (isNotInterested && editing) {
      base44.entities.PartnerApplication.filter({ status: "approved" }, "name", 100).then(setAgents);
    }
  }, [isNotInterested, editing]);

  const handleReassign = async () => {
    if (!reassignAgent) return;
    setReassigning(true);
    const updatedNotes = (lead.internal_notes ? lead.internal_notes + "\n\n" : "") +
      `[Reassigned ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} from ${lead.assigned_agent || "—"} → ${reassignAgent}]`;
    await base44.entities.Lead.update(lead.id, {
      assigned_agent: reassignAgent,
      status: "New",
      close_reason: "",
      agent_comment: "",
      internal_notes: updatedNotes,
    });
    setReassigning(false);
    setEditing(false);
    onUpdate({ ...lead, assigned_agent: reassignAgent, status: "New", close_reason: "", agent_comment: "", internal_notes: updatedNotes });
  };

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Lead.update(lead.id, {
      status,
      close_reason: status === "Closed" ? closeReason : "",
      agent_comment: agentComment,
      internal_notes: notes,
    });
    setSaving(false);
    setEditing(false);
    onUpdate({ ...lead, status, close_reason: status === "Closed" ? closeReason : "", agent_comment: agentComment, internal_notes: notes });
  };

  const handleCancel = () => {
    setStatus(lead.status || "New");
    setCloseReason(lead.close_reason || "");
    setAgentComment(lead.agent_comment || "");
    setNotes(lead.internal_notes || "");
    setEditing(false);
  };

  const isUrl = lead.address_or_link?.startsWith("http");
  const source = lead.utm_source || "web";
  const date = lead.created_date
    ? new Date(lead.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

  const accentColor = (STATUS_CONFIG[lead.status || "New"] || STATUS_CONFIG["New"]).accent;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      style={{ borderLeft: `4px solid ${accentColor}` }}>
      {/* Top row */}
      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-start gap-3 justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <StatusBadge status={lead.status || "New"} />
            {lead.code_matched && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Mailer Code: {lead.code}
              </span>
            )}
            <span className="text-xs text-slate-400">{date}</span>
            <span className="text-xs text-slate-400 capitalize">· {source}</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 truncate">
            {isUrl ? (
              <a href={lead.address_or_link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-700 hover:underline">
                {lead.address_or_link} <ExternalLink className="h-3 w-3 flex-shrink-0" />
              </a>
            ) : (
              lead.address_or_link
            )}
          </p>
          <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
            {lead.name && <span>👤 {lead.name}</span>}
            {lead.email && <a href={`mailto:${lead.email}`} className="hover:text-blue-700">✉️ {lead.email}</a>}
            {lead.phone && <a href={`tel:${lead.phone}`} className="hover:text-blue-700">📞 {lead.phone}</a>}
            {lead.assigned_agent && <span>🏠 Agent: {lead.assigned_agent}</span>}
          </div>
          {lead.close_reason && !editing && (lead.status === "Closed") && (
            <div className="mt-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                {lead.close_reason}
              </span>
            </div>
          )}
          {lead.agent_comment && !editing && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-2 py-1.5">
              <span className="font-semibold flex-shrink-0">💬</span>
              <span className="italic">{lead.agent_comment}</span>
            </div>
          )}
          {lead.internal_notes && !editing && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-500 italic">
              <StickyNote className="h-3 w-3 mt-0.5 flex-shrink-0 text-amber-500" />
              <span className="line-clamp-2">{lead.internal_notes}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {(lead.status === "Closed" || lead.status === "Lost") && !editing && (
            <button
              onClick={() => setShowRecirculate(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition"
            >
              <RefreshCcw className="h-3 w-3" /> Recirculate
            </button>
          )}
          <button
            onClick={() => setEditing(!editing)}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>
        {showRecirculate && (
          <RecirculateModal
            lead={lead}
            onClose={() => setShowRecirculate(false)}
            onRecirculated={(updated) => { onUpdate(updated); setShowRecirculate(false); }}
          />
        )}
      </div>

      {/* Edit panel */}
      {editing && (
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(STATUS_CONFIG).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    status === s ? STATUS_CONFIG[s].color + " ring-2 ring-offset-1 ring-blue-400" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          {status === "Closed" && (
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Close Reason *</label>
              <div className="flex flex-wrap gap-2">
                {CLOSE_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setCloseReason(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      closeReason === r
                        ? "bg-slate-800 text-white border-slate-800 ring-2 ring-offset-1 ring-blue-400"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Agent Comment <span className="font-normal normal-case text-slate-400">(brief context for this update)</span></label>
            <input
              type="text"
              value={agentComment}
              onChange={(e) => setAgentComment(e.target.value)}
              placeholder="e.g. Left voicemail, called back tomorrow, very interested…"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Internal Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead's transition progress…"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white resize-none"
            />
          </div>
          {isNotInterested && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 space-y-2">
              <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">Reassign to Another Agent</p>
              <p className="text-xs text-orange-600">This lead is marked <strong>Not Interested</strong>. You can reassign it to a different team member — it will reset to <strong>New</strong>.</p>
              <div className="flex gap-2 items-center">
                <select
                  value={reassignAgent}
                  onChange={e => setReassignAgent(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-orange-200 rounded-lg focus:outline-none focus:border-orange-400 bg-white"
                >
                  <option value="">Select a team member…</option>
                  {agents.filter(a => a.name !== lead.assigned_agent).map(a => (
                    <option key={a.id} value={a.name}>{a.name}{a.territory ? ` — ${a.territory}` : ""}</option>
                  ))}
                </select>
                <button
                  onClick={handleReassign}
                  disabled={!reassignAgent || reassigning}
                  className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-lg hover:bg-orange-700 transition disabled:opacity-40 flex-shrink-0"
                >
                  <RefreshCcw className="h-3.5 w-3.5" /> {reassigning ? "Reassigning…" : "Reassign"}
                </button>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" /> {saving ? "Saving…" : "Save Changes"}
            </button>
            <button onClick={handleCancel} className="px-4 py-2 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-white transition">
              <X className="h-3.5 w-3.5 inline mr-1" />Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showUpload, setShowUpload] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [filterReason, setFilterReason] = useState("All");

  const fetchLeads = async () => {
    setLoading(true);
    const data = await base44.entities.Lead.list("-created_date", 200);
    setLeads(data);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleUpdate = (updated) => {
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const handleCreated = (newLead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const filtered = leads.filter((l) => {
    const matchStatus = filterStatus === "All" || (l.status || "New") === filterStatus;
    const matchReason = filterReason === "All" || l.close_reason === filterReason;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      l.address_or_link?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.name?.toLowerCase().includes(q) ||
      l.phone?.toLowerCase().includes(q) ||
      l.code?.toLowerCase().includes(q);
    return matchStatus && matchReason && matchSearch;
  });

  const counts = ALL_STATUSES.slice(1).reduce((acc, s) => {
    acc[s] = leads.filter((l) => (l.status || "New") === s).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50">
      {showUpload && <UploadLeadModal onClose={() => setShowUpload(false)} onCreated={handleCreated} />}
      {showBulk && <BulkLeadUpload onClose={() => setShowBulk(false)} onImported={(count) => { fetchLeads(); }} />}
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img
                src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png"
                alt="BuyWiser" className="h-8 w-auto opacity-80"
              />
            </Link>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-slate-500" />
              <h1 className="text-base font-bold text-slate-800">Leads Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchLeads} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button onClick={() => setShowUpload(true)} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition">
              <Upload className="h-3.5 w-3.5" /> Upload Lead
            </button>
            <button onClick={() => setShowBulk(true)} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg text-white bg-blue-700 hover:bg-blue-800 transition">
              <FileSpreadsheet className="h-3.5 w-3.5" /> Bulk Import
            </button>
            <button onClick={() => setShowSummary(v => !v)} className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg border transition ${showSummary ? "bg-indigo-700 text-white border-indigo-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              <BarChart2 className="h-3.5 w-3.5" /> Outcomes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Outcome Summary Panel */}
        {showSummary && (
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Partner Performance — Outcome Summary</p>
            <OutcomeSummary leads={leads} />
          </div>
        )}

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {ALL_STATUSES.slice(1).map((s) => {
            const cfg = STATUS_CONFIG[s];
            const Icon = cfg.icon;
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? "All" : s)}
                className={`rounded-xl border p-3 text-left transition ${
                  filterStatus === s ? cfg.color + " ring-2 ring-offset-1 ring-blue-400" : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-4 w-4 mb-1" style={{ color: cfg.accent }} />
                <p className="text-lg font-black text-slate-800">{counts[s] || 0}</p>
                <p className="text-xs text-slate-500">{s}</p>
              </button>
            );
          })}
        </div>

        {/* Search & filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by address, email, name, code…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 transition font-medium text-slate-700"
            >
              {ALL_STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-blue-500 transition font-medium text-slate-700"
            >
              <option value="All">All Outcomes</option>
              {CLOSE_REASONS.map((r) => <option key={r}>{r}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No leads found</p>
            <p className="text-sm mt-1">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 font-medium">{filtered.length} lead{filtered.length !== 1 ? "s" : ""}</p>
            {filtered.map((lead) => (
              <LeadRow key={lead.id} lead={lead} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}