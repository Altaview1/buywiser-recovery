import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronDown, Mail, Phone, MapPin, Tag, Trash2, Loader2 } from "lucide-react";

const STATUS_COLORS = {
  New: "bg-blue-100 text-blue-700 border-blue-200",
  Contacted: "bg-amber-100 text-amber-700 border-amber-200",
  Qualified: "bg-purple-100 text-purple-700 border-purple-200",
  Closed: "bg-green-100 text-green-700 border-green-200",
  Lost: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function LeadsTable({ leads, onUpdate }) {
  const [expandedId, setExpandedId] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleStatusChange = async (leadId, newStatus) => {
    await base44.entities.Lead.update(leadId, { status: newStatus });
    onUpdate();
  };

  const handleDelete = async (leadId) => {
    setDeleting(leadId);
    await base44.entities.Lead.delete(leadId);
    onUpdate();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Contact</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Address</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">Agent</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {leads.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-400">
                  No leads yet
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{lead.name || "—"}</p>
                    {lead.code && (
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Tag className="h-3 w-3" /> {lead.code}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {lead.email && (
                        <p className="text-xs flex items-center gap-1.5 text-slate-600">
                          <Mail className="h-3 w-3" /> {lead.email}
                        </p>
                      )}
                      {lead.phone && (
                        <p className="text-xs flex items-center gap-1.5 text-slate-600">
                          <Phone className="h-3 w-3" /> {lead.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">{lead.address_or_link || "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status || "New"}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none ${
                        STATUS_COLORS[lead.status || "New"] || STATUS_COLORS.New
                      }`}
                    >
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Qualified</option>
                      <option>Closed</option>
                      <option>Lost</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{lead.assigned_agent || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setExpandedId(expandedId === lead.id ? null : lead.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition"
                      >
                        <ChevronDown
                          className={`h-4 w-4 text-slate-400 transition-transform ${
                            expandedId === lead.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id)}
                        disabled={deleting === lead.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                      >
                        {deleting === lead.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Expanded row details */}
      {expandedId && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-4">
          {leads.find((l) => l.id === expandedId) && (
            <div className="max-w-3xl space-y-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Internal Notes
                </p>
                <textarea
                  defaultValue={leads.find((l) => l.id === expandedId)?.internal_notes || ""}
                  placeholder="Add notes..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  rows={2}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Close Reason
                </p>
                <p className="text-sm text-slate-600">
                  {leads.find((l) => l.id === expandedId)?.close_reason || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Agent Comment
                </p>
                <p className="text-sm text-slate-600">
                  {leads.find((l) => l.id === expandedId)?.agent_comment || "No comment"}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}