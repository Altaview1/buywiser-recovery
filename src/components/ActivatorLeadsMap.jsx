import { useState } from "react";

const STATUS_COLORS = {
  SCANNED: "#64748b",
  VERIFIED: "#3b82f6",
  QUALIFIED: "#f59e0b",
  SCHEDULED: "#a855f7",
  COMPLETED: "#16a34a",
  CLOSED: "#059669",
};

export default function ActivatorLeadsMap({ leads, onSelectLead }) {
  const [filter, setFilter] = useState("All");

  // Filter leads
  const filtered = leads.filter(l => 
    (filter === "All" || l.status === filter) && l.property_address
  );

  // Build map URL with first filtered address
  const mapAddress = filtered.length > 0 
    ? encodeURIComponent(filtered[0].property_address)
    : "California";
  
  const mapUrl = `https://www.google.com/maps/embed/v1/search?key=AIzaSyDummyKey&q=${mapAddress}`;

  return (
    <div className="space-y-4">
      {/* Status Summary */}
      <div className="rounded-lg p-4 bg-blue-50 border-2 border-blue-300 space-y-2 text-xs font-mono">
        <p className="font-bold text-blue-900">📍 Lead Map</p>
        <div className="grid grid-cols-3 gap-2">
          <div><span className="text-blue-600">Total:</span> {leads.length}</div>
          <div><span className="text-blue-600">Visible:</span> {filtered.length}</div>
          <div><span className="text-blue-600">Filter:</span> {filter}</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {["All", "SCANNED", "VERIFIED", "QUALIFIED", "SCHEDULED", "COMPLETED", "CLOSED"].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              filter === status
                ? "bg-slate-800 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Google Map Embed */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden h-[600px]">
        <iframe
          src={mapUrl}
          style={{ width: "100%", height: "100%", border: "none" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Lead locations map"
        />
      </div>

      {/* Lead List */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Leads ({filtered.length})</h3>
        </div>
        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-400 text-sm">
              No leads to display
            </div>
          ) : (
            filtered.map((lead, idx) => (
              <button
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="w-full text-left px-4 py-3 hover:bg-slate-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full flex-shrink-0"
                    style={{ background: STATUS_COLORS[lead.status] }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {idx + 1}. {lead.first_name} {lead.last_name}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(lead.property_address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline truncate block group-hover:text-blue-800"
                    >
                      📍 {lead.property_address}
                    </a>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded flex-shrink-0">
                    {lead.status}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}