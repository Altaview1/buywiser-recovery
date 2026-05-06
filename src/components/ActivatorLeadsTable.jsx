import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronUp, ChevronDown, MapPin, TrendingUp, Eye } from "lucide-react";

const STATUS_COLORS = {
  SCANNED:   { bg: "bg-slate-100", text: "text-slate-600", label: "New Lead" },
  VERIFIED:  { bg: "bg-blue-100", text: "text-blue-700", label: "Contacted" },
  QUALIFIED: { bg: "bg-amber-100", text: "text-amber-700", label: "Qualified" },
  SCHEDULED: { bg: "bg-purple-100", text: "text-purple-700", label: "Scheduled" },
  COMPLETED: { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
  CLOSED:    { bg: "bg-emerald-100", text: "text-emerald-800", label: "Closed" },
};

export default function ActivatorLeadsTable({ leads, onSelectLead, loading }) {
  const [sortBy, setSortBy] = useState("created_date");
  const [sortDir, setSortDir] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [updatingId, setUpdatingId] = useState(null);
  const [localOverrides, setLocalOverrides] = useState({});

  const filtered = leads.filter(l => {
    const matchStatus = filterStatus === "All" || l.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || 
      `${l.first_name} ${l.last_name} ${l.email} ${l.property_address}`.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === "created_date") {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    } else if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (sortDir === "asc") return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    setUpdatingId(leadId);
    setLocalOverrides(prev => ({ ...prev, [leadId]: newStatus }));
    try {
      await base44.entities.ActivatorLead.update(leadId, { status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
      setLocalOverrides(prev => { const n = { ...prev }; delete n[leadId]; return n; });
    }
    setUpdatingId(null);
  };

  // Check if any lead has non-empty values for a field
  const hasDataForField = (fieldKey) => leads.some(l => l[fieldKey] && l[fieldKey] > 0);

  const SortHeader = ({ col, label }) => (
    <button
      onClick={() => handleSort(col)}
      className="flex items-center gap-1 hover:text-slate-900 transition"
    >
      {label}
      {sortBy === col && (
        sortDir === "asc" 
          ? <ChevronUp className="h-3.5 w-3.5" /> 
          : <ChevronDown className="h-3.5 w-3.5" />
      )}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name, email, address…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none font-medium text-slate-700"
        >
          <option>All</option>
          {["SCANNED", "VERIFIED", "QUALIFIED", "SCHEDULED", "COMPLETED", "CLOSED"].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                  <SortHeader col="first_name" label="Contact" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">
                  <SortHeader col="property_address" label="Property" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Status</th>
                {hasDataForField("estimated_price") && (
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-600">
                    <SortHeader col="estimated_price" label="Est. Value" />
                  </th>
                )}
                {hasDataForField("estimated_equity") && (
                  <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-600">
                    <SortHeader col="estimated_equity" label="Equity" />
                  </th>
                )}
                {hasDataForField("distress_score") && (
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                    <SortHeader col="distress_score" label="Distress" />
                  </th>
                )}
                {hasDataForField("listing_dom") && (
                  <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600">
                    <SortHeader col="listing_dom" label="DOM" />
                  </th>
                )}
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">Rep</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    <div className="w-5 h-5 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400 text-sm">No leads found</td>
                </tr>
              ) : (
                sorted.map(lead => {
                  const currentStatus = localOverrides[lead.id] || lead.status;
                  const cfg = STATUS_COLORS[currentStatus] || STATUS_COLORS.SCANNED;
                  const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
                  
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-slate-900">{fullName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {lead.email && <div>{lead.email}</div>}
                          {lead.phone && <div>{lead.phone}</div>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-sm text-slate-700">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                          <span>{lead.property_address}</span>
                        </div>
                        {lead.property_type && (
                          <div className="text-xs text-slate-500 mt-0.5">{lead.property_type}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          disabled={updatingId === lead.id}
                          className={`appearance-none px-3 py-2 text-xs font-semibold rounded-lg border cursor-pointer disabled:opacity-50 transition ${cfg.bg} ${cfg.text} border-current`}
                        >
                          {["SCANNED", "VERIFIED", "QUALIFIED", "SCHEDULED", "COMPLETED", "CLOSED"].map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      {hasDataForField("estimated_price") && (
                        <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                          {lead.estimated_price ? `$${(lead.estimated_price/1000).toFixed(0)}K` : ''}
                        </td>
                      )}
                      {hasDataForField("estimated_equity") && (
                        <td className="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                          {lead.estimated_equity ? `$${(lead.estimated_equity/1000).toFixed(0)}K` : ''}
                        </td>
                      )}
                      {hasDataForField("distress_score") && (
                        <td className="px-4 py-3 text-center">
                          {lead.distress_score != null && lead.distress_score > 0 ? (
                            <span className={`inline-flex px-2 py-1 rounded text-xs font-bold ${lead.distress_score > 50 ? "bg-red-100 text-red-700" : lead.distress_score > 30 ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-600"}`}>
                              {lead.distress_score}
                            </span>
                          ) : ''}
                        </td>
                      )}
                      {hasDataForField("listing_dom") && (
                        <td className="px-4 py-3 text-center">
                          {lead.listing_dom != null && lead.listing_dom > 0 ? (
                            <span className="inline-flex px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                              {lead.listing_dom}
                            </span>
                          ) : ''}
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm text-slate-700">
                        {lead.rep_code ? (
                          <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">{lead.rep_code}</span>
                        ) : ''}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onSelectLead(lead)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <p>{sorted.length} lead{sorted.length !== 1 ? "s" : ""} displayed</p>
        <p>{leads.length} total lead{leads.length !== 1 ? "s" : ""}</p>
      </div>
    </div>
  );
}