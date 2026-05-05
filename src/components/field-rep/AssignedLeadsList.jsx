import { MapPin, Phone, Mail, CheckCircle, Clock, Eye } from "lucide-react";

const STATUS_COLORS = {
  SCANNED: "bg-slate-100 text-slate-600",
  VERIFIED: "bg-blue-100 text-blue-700",
  QUALIFIED: "bg-amber-100 text-amber-700",
  SCHEDULED: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  CLOSED: "bg-emerald-100 text-emerald-800",
};

export default function AssignedLeadsList({ leads, visits, onSelectLead }) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <Clock className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="font-semibold">No leads assigned yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => {
        const visited = visits.some((v) => v.lead_id === lead.id);
        const fullName = `${lead.first_name || ""} ${lead.last_name || ""}`.trim();

        return (
          <button
            key={lead.id}
            onClick={() => onSelectLead(lead)}
            className="w-full text-left px-4 py-4 rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-md transition bg-white active:bg-slate-50"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate">{fullName}</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{lead.property_address}</span>
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 whitespace-nowrap ${
                  STATUS_COLORS[lead.status] || STATUS_COLORS.SCANNED
                }`}
              >
                {lead.status}
              </span>
            </div>

            {/* Contact info */}
            <div className="space-y-1 mb-2">
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" /> {lead.phone}
                </a>
              )}
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <Mail className="h-3 w-3" /> {lead.email}
                </a>
              )}
            </div>

            {/* Visit status */}
            {visited ? (
              <div className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded inline-flex">
                <CheckCircle className="h-3 w-3" /> Visited
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded inline-flex">
                <Clock className="h-3 w-3" /> Pending
              </div>
            )}
          </button>
        );
      })}

      <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-100">
        {leads.length} lead{leads.length !== 1 ? "s" : ""} assigned
      </div>
    </div>
  );
}