import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import {
  Users, Search, RefreshCw, ChevronDown, ExternalLink,
  CheckCircle, Clock, Phone, Star, XCircle, StickyNote, Save, X
} from "lucide-react";

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

function LeadRow({ lead, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(lead.status || "New");
  const [notes, setNotes] = useState(lead.internal_notes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Lead.update(lead.id, { status, internal_notes: notes });
    setSaving(false);
    setEditing(false);
    onUpdate({ ...lead, status, internal_notes: notes });
  };

  const handleCancel = () => {
    setStatus(lead.status || "New");
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
          {lead.internal_notes && !editing && (
            <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-500 italic">
              <StickyNote className="h-3 w-3 mt-0.5 flex-shrink-0 text-amber-500" />
              <span className="line-clamp-2">{lead.internal_notes}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
        >
          {editing ? "Cancel" : "Edit"}
        </button>
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

  const filtered = leads.filter((l) => {
    const matchStatus = filterStatus === "All" || (l.status || "New") === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      l.address_or_link?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.name?.toLowerCase().includes(q) ||
      l.phone?.toLowerCase().includes(q) ||
      l.code?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = ALL_STATUSES.slice(1).reduce((acc, s) => {
    acc[s] = leads.filter((l) => (l.status || "New") === s).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50">
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
          <button onClick={fetchLeads} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">

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