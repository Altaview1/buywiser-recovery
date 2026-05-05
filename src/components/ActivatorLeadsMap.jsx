import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { base44 } from "@/api/base44Client";

// Test data
const SAMPLE_LEADS = [
  {
    id: "test-1",
    first_name: "John",
    last_name: "Smith",
    email: "john@test.com",
    property_address: "123 Oak Street, Glendale, CA 91205",
    lat: 34.1602,
    lng: -118.2583,
    status: "VERIFIED",
  },
  {
    id: "test-2",
    first_name: "Jane",
    last_name: "Doe",
    email: "jane@test.com",
    property_address: "456 Elm Avenue, Burbank, CA 91502",
    lat: 34.1659,
    lng: -118.3079,
    status: "QUALIFIED",
  },
  {
    id: "test-3",
    first_name: "Bob",
    last_name: "Johnson",
    email: "bob@test.com",
    property_address: "789 Maple Drive, Pasadena, CA 91101",
    lat: 34.1478,
    lng: -118.1445,
    status: "SCHEDULED",
  },
];

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
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

  // Use sample data if no real leads
  const displayLeads = leads.length === 0 ? SAMPLE_LEADS : leads;

  const filtered = displayLeads.filter(l => {
    const matchFilter = filter === "All" || l.status === filter;
    return matchFilter && l.lat && l.lng;
  });

  // Default center (Glendale, CA area)
  const center = filtered.length > 0 
    ? [filtered[0].lat, filtered[0].lng]
    : [34.1602, -118.2583];

  return (
    <div className="space-y-4">
      {/* Diagnostic Panel */}
      <div className={`rounded-lg p-4 space-y-2 text-xs font-mono ${leads.length === 0 ? 'bg-amber-50 border-2 border-amber-400' : 'bg-blue-50 border-2 border-blue-300'}`}>
        <p className={`font-bold ${leads.length === 0 ? 'text-amber-900' : 'text-blue-900'}`}>
          {leads.length === 0 ? '⚠️ USING TEST DATA' : '📊 MAP READY'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div><span className="text-blue-600">Leads:</span> {displayLeads.length}</div>
          <div><span className="text-blue-600">Visible:</span> {filtered.length}</div>
          <div><span className="text-blue-600">Selected:</span> {selectedLeadIds.length}</div>
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

      {/* Map */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden h-[600px]">
        {filtered.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
            <p className="text-center">
              <p className="font-semibold">No leads to display</p>
              <p className="text-sm">Add leads with coordinates to see them on the map</p>
            </p>
          </div>
        ) : (
          <MapContainer center={center} zoom={11} style={{ height: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            {filtered.map((lead, idx) => {
              const isSelected = selectedLeadIds.includes(lead.id);
              return (
                <Marker
                  key={lead.id}
                  position={[lead.lat, lead.lng]}
                  icon={L.divIcon({
                    html: `
                      <div style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: ${isSelected ? '32px' : '24px'};
                        height: ${isSelected ? '32px' : '24px'};
                        border-radius: 50%;
                        background: ${STATUS_COLORS[lead.status] || '#64748b'};
                        border: ${isSelected ? '3px solid #dc2626' : '2px solid white'};
                        color: white;
                        font-weight: bold;
                        font-size: 12px;
                        cursor: pointer;
                      ">
                        ${idx + 1}
                      </div>
                    `,
                    className: "",
                    iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
                  })}
                  eventHandlers={{
                    click: () => onSelectLead(lead),
                  }}
                >
                  <Popup>
                    <div style={{ fontSize: "12px", maxWidth: "200px" }}>
                      <strong>${idx + 1} {lead.first_name} {lead.last_name}</strong>
                      <br />
                      {lead.property_address}
                      <br />
                      <span style={{ fontSize: "10px", color: "#666" }}>{lead.status}</span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>

      {/* Stats */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs">
        <p className="font-bold text-amber-900">📍 {filtered.length} prospect{filtered.length !== 1 ? "s" : ""} mapped</p>
      </div>
    </div>
  );
}