import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, AlertCircle } from "lucide-react";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const STATUS_COLORS = {
  assigned: "#3B82F6",
  accepted: "#4F46E5",
  in_progress: "#A855F7",
  completed: "#10B981",
  forfeited: "#EF4444",
  protocol_incomplete: "#64748B",
};

async function geocodeAddress(address) {
  if (!address) return null;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    );
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  return null;
}

export default function OpportunityMapView({ opportunities }) {
  const [geoData, setGeoData] = useState({});
  const [loading, setLoading] = useState(true);
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    async function geocodeAll() {
      const coords = {};
      let allLat = [], allLng = [];

      for (const opp of opportunities) {
        if (!opp.property_address) continue;
        const address = `${opp.property_address}${opp.city ? `, ${opp.city}` : ""}${opp.state ? `, ${opp.state}` : ""}`;
        const location = await geocodeAddress(address);
        if (location) {
          coords[opp.id] = location;
          allLat.push(location.lat);
          allLng.push(location.lng);
        }
      }

      if (allLat.length > 0) {
        const minLat = Math.min(...allLat);
        const maxLat = Math.max(...allLat);
        const minLng = Math.min(...allLng);
        const maxLng = Math.max(...allLng);
        setBounds([[minLat, minLng], [maxLat, maxLng]]);
      }

      setGeoData(coords);
      setLoading(false);
    }

    geocodeAll();
  }, [opportunities]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-50">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (Object.keys(geoData).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 gap-3">
        <AlertCircle className="h-10 w-10 text-slate-300" />
        <p className="text-sm font-semibold text-slate-500">No opportunities with valid addresses to display</p>
      </div>
    );
  }

  const center = bounds ? [
    (bounds[0][0] + bounds[1][0]) / 2,
    (bounds[0][1] + bounds[1][1]) / 2
  ] : [37.0902, -95.7129]; // Default to US center

  return (
    <MapContainer 
      center={center} 
      zoom={6} 
      bounds={bounds} 
      style={{ height: "100%", width: "100%" }}
      className="rounded-2xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {opportunities.map((opp) => {
        if (!geoData[opp.id]) return null;
        const { lat, lng } = geoData[opp.id];
        const color = STATUS_COLORS[opp.opportunity_status] || STATUS_COLORS.assigned;

        return (
          <Marker
            key={opp.id}
            position={[lat, lng]}
            icon={L.divIcon({
              className: "custom-marker",
              html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">📍</div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 15],
              popupAnchor: [0, -15],
            })}
          >
            <Popup>
              <div className="text-xs space-y-1 font-medium">
                <p className="font-bold text-slate-900">{opp.homeowner_name || "Homeowner"}</p>
                <p className="text-slate-600">{opp.property_address}{opp.city ? `, ${opp.city}` : ""}</p>
                {opp.estimated_price && (
                  <p className="text-slate-600">
                    ~{opp.estimated_price.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                  </p>
                )}
                <p className="text-slate-500 mt-1">
                  <span style={{ color, fontWeight: "bold" }}>●</span> {opp.opportunity_status || "assigned"}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}