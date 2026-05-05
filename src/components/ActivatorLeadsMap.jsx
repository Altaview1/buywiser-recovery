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
  const [geocodedLeads, setGeocodedLeads] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.0522, -118.2437]);
  const [mapZoom, setMapZoom] = useState(10);
  const [geocodingLoading, setGeocodingLoading] = useState(false);

  // Geocode addresses using Nominatim (OpenStreetMap)
  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (err) {
      console.error(`Geocoding failed for ${address}:`, err);
    }
    return null;
  };

  useEffect(() => {
    const init = async () => {
      const filtered = leads.filter(l => {
        const matchFilter = filter === "All" || l.status === filter;
        return matchFilter && l.property_address;
      });

      setGeocodingLoading(true);
      const geocoded = await Promise.all(
        filtered.map(async (lead) => {
          const coords = await geocodeAddress(lead.property_address);
          return coords ? { ...lead, coordinates: coords } : null;
        })
      );

      const validGeocoded = geocoded.filter(l => l !== null);
      setValidLeads(validGeocoded);

      // Calculate center and bounds from geocoded leads
      if (validGeocoded.length > 0) {
        const lats = validGeocoded.map(l => l.coordinates[0]);
        const lons = validGeocoded.map(l => l.coordinates[1]);
        const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2;
        const centerLon = (Math.max(...lons) + Math.min(...lons)) / 2;
        setMapCenter([centerLat, centerLon]);

        // Adjust zoom based on spread
        const latDiff = Math.max(...lats) - Math.min(...lats);
        const lonDiff = Math.max(...lons) - Math.min(...lons);
        const maxDiff = Math.max(latDiff, lonDiff);
        const zoom = maxDiff > 0.5 ? 9 : maxDiff > 0.1 ? 11 : 12;
        setMapZoom(zoom);
      }

      setGeocodingLoading(false);
    };

    init();
  }, [leads, filter]);

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

      {/* Geocoding Status */}
      {geocodingLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
          🔄 Geocoding {leads.filter(l => l.property_address).length} addresses... This may take a moment.
        </div>
      )}

      {/* Map */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden h-[600px] relative">
        {validLeads.length === 0 && !geocodingLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
            <div className="text-center">
              <p className="font-semibold mb-1">No leads to display</p>
              <p className="text-sm">Select a different filter or add leads with valid addresses</p>
            </div>
          </div>
        ) : geocodingLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
          </div>
        ) : (
          <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {validLeads.map((lead, idx) => {
              const [lat, lon] = lead.coordinates;
              const color = STATUS_COLORS[lead.status] || "#64748b";
              const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
              
              return (
                <Marker
                  key={lead.id}
                  position={[lat, lon]}
                  icon={L.icon({
                    iconUrl: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDMyIDQwIj48cGF0aCBmaWxsPSIke2NvbG9yfSIgZD0iTTE2IDAgQzExLjYgMCA4IDMuNiA4IDggYzAgNCA4IDE2IDggMTZzMTYtMTIgMTYtMTZjMC00LjQtMy42LTgtOC04eiIvPjx0ZXh0IHg9IjE2IiB5PSI4IiBmaWxsPSIjZmZmIiBmb250LXdlaWdodD0iYm9sZCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiPiR7aWR4ICsgMX08L3RleHQ+PC9zdmc+`.replace("${color}", color).replace("${idx + 1}", idx + 1),
                    iconSize: [32, 40],
                    iconAnchor: [16, 40],
                    popupAnchor: [0, -40],
                  })}
                >
                  <Popup>
                    <div className="text-xs space-y-1 w-48">
                      <p className="font-bold">#{idx + 1} {fullName || "Prospect"}</p>
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

      {/* Stats & Routing Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 space-y-1 text-xs">
        <p className="font-bold text-amber-900">📍 {validLeads.length} prospect{validLeads.length !== 1 ? "s" : ""} with geocoded addresses</p>
        {validLeads.length > 1 && (
          <p className="text-amber-700">💡 <strong>Route Tip:</strong> Numbered markers show suggested door-knock sequence. Visit in order 1 → {validLeads.length} for optimal efficiency.</p>
        )}
      </div>
    </div>
  );
}