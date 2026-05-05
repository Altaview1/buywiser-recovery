import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const STATUS_COLORS = {
  SCANNED: "#64748b",
  VERIFIED: "#3b82f6",
  QUALIFIED: "#f59e0b",
  SCHEDULED: "#a855f7",
  COMPLETED: "#16a34a",
  CLOSED: "#059669",
};

export default function ActivatorLeadsMap({ leads, onSelectLead }) {
  const [validLeads, setValidLeads] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    // Filter and geocode leads that have addresses
    const filtered = leads.filter(l => {
      const matchFilter = filter === "All" || l.status === filter;
      return matchFilter && l.property_address;
    });
    setValidLeads(filtered);
  }, [leads, filter]);

  // Calculate center from leads
  const centerLat = 34.0522; // Los Angeles
  const centerLon = -118.2437;

  // Mock coordinates for demo (in production, would use geocoding)
  const getCoordinates = (address) => {
    const hash = address.split("").reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a; // Convert to 32bit integer
    }, 0);
    
    return [
      centerLat + (hash % 100) / 1000 - 0.05,
      centerLon + (hash % 100) / 1000 - 0.05,
    ];
  };

  return (
    <div className="space-y-4">
      {/* Filter */}
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
        {validLeads.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
            <div className="text-center">
              <p className="font-semibold mb-1">No leads to display</p>
              <p className="text-sm">Select a different filter or add leads</p>
            </div>
          </div>
        ) : (
          <MapContainer center={[centerLat, centerLon]} zoom={10} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {validLeads.map(lead => {
              const [lat, lon] = getCoordinates(lead.property_address);
              const color = STATUS_COLORS[lead.status] || "#64748b";
              const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
              
              return (
                <Marker
                  key={lead.id}
                  position={[lat, lon]}
                  icon={L.icon({
                    iconUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDMyIDQwIj48cGF0aCBmaWxsPSIke2NvbG9yfSIgZD0iTTE2IDAgQzExLjYgMCA4IDMuNiA4IDggYzAgNCA4IDE2IDggMTZzMTYtMTIgMTYtMTZjMC00LjQtMy42LTgtOC04eiIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iOCIgcj0iMiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==`.replace("${color}", color),
                    iconSize: [32, 40],
                    iconAnchor: [16, 40],
                    popupAnchor: [0, -40],
                  })}
                >
                  <Popup>
                    <div className="text-xs space-y-1 w-48">
                      <p className="font-bold">{fullName || "Prospect"}</p>
                      <p className="text-slate-600">{lead.property_address}</p>
                      {lead.property_type && <p><span className="font-semibold">Type:</span> {lead.property_type}</p>}
                      {lead.estimated_price && <p><span className="font-semibold">Est:</span> ${(lead.estimated_price/1000).toFixed(0)}K</p>}
                      {lead.listing_dom != null && lead.listing_dom > 0 && <p><span className="font-semibold">DOM:</span> {lead.listing_dom}</p>}
                      <button
                        onClick={() => onSelectLead(lead)}
                        className="mt-2 w-full px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition"
                      >
                        View Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>

      {/* Stats */}
      <div className="text-xs text-slate-500">
        <p>{validLeads.length} prospect{validLeads.length !== 1 ? "s" : ""} displayed on map</p>
      </div>
    </div>
  );
}