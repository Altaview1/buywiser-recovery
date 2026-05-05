import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const STATUS_COLORS = {
  SCANNED: "#64748b",
  VERIFIED: "#3b82f6",
  QUALIFIED: "#f59e0b",
  SCHEDULED: "#a855f7",
  COMPLETED: "#16a34a",
  CLOSED: "#059669",
};

// Custom marker icons for each status
const createMarkerIcon = (color) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div></div>`,
    iconSize: [32, 32],
    popupAnchor: [0, -16],
  });
};

function MapFitBounds({ leads }) {
  const map = useMap();
  useEffect(() => {
    if (leads.length === 0) return;
    const bounds = L.latLngBounds(leads.map(l => [l.lat, l.lng]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [leads, map]);
  return null;
}

export default function ActivatorLeadsMap({ leads, onSelectLead }) {
  const [filter, setFilter] = useState("All");
  const [geocoding, setGeocoding] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 34.1602, lng: -118.2583 }); // Default: Glendale, CA

  // Filter leads with valid geocoding
  const filtered = leads.filter(l => 
    (filter === "All" || l.status === filter) && l.property_address && l.lat && l.lng
  );

  // Update map center when filtered leads change
  useEffect(() => {
    if (filtered.length > 0) {
      setMapCenter({ lat: filtered[0].lat, lng: filtered[0].lng });
    }
  }, [filtered]);

  // Geocode all addresses
  const handleGeocodeAll = async () => {
    setGeocoding(true);
    try {
      const res = await base44.functions.invoke('geocodeLeadAddresses', {});
      if (res.data.success) {
        alert(`✓ Geocoded ${res.data.processed} leads`);
        // Reload leads by refreshing the page or fetching fresh data
        window.location.reload();
      }
    } catch (err) {
      alert('Geocoding failed: ' + err.message);
    }
    setGeocoding(false);
  };

  const mapUrl = `https://www.google.com/maps/embed/v1/search?key=AIzaSyBk4X5r3IuozWjNDkDkWJL-RI69zs9PNLc&q=${mapCenter.lat},${mapCenter.lng}`;

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

      {/* Geocode Button */}
      <div className="flex gap-2 flex-wrap justify-between items-center">
        <button
          onClick={handleGeocodeAll}
          disabled={geocoding}
          className="px-4 py-2 rounded-lg font-bold text-sm text-white transition disabled:opacity-50"
          style={{ background: "#0B1F3B" }}
        >
          {geocoding ? "Processing…" : "🗺️ Geocode All Addresses"}
        </button>
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

      {/* Interactive Leaflet Map */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden h-[600px]">
        <MapContainer center={[mapCenter.lat, mapCenter.lng]} zoom={11} style={{ width: "100%", height: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <MapFitBounds leads={filtered} />
          {filtered.map(lead => (
            <Marker
              key={lead.id}
              position={[lead.lat, lead.lng]}
              icon={createMarkerIcon(STATUS_COLORS[lead.status])}
              eventHandlers={{ click: () => onSelectLead(lead) }}
            >
              <Popup className="text-sm">
                <div className="space-y-1">
                  <p className="font-bold">{lead.first_name} {lead.last_name}</p>
                  <p className="text-xs text-slate-600">{lead.property_address}</p>
                  <p className="text-xs font-semibold text-slate-700">{lead.status}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
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