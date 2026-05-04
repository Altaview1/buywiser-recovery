import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Mail, Phone, MapPin } from "lucide-react";
import L from "leaflet";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const CALIFORNIA_CENTER = [36.7783, -119.4179];
const DEFAULT_ZOOM = 6;

export default function LeadsMapView({ leads }) {
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState(CALIFORNIA_CENTER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const geocodeLeads = async () => {
      const geocoded = [];
      
      for (const lead of leads) {
        const address = lead.address_or_link;
        if (!address) continue;

        try {
          // Use OpenStreetMap Nominatim geocoder (free, no API key needed)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
          );
          const results = await response.json();
          
          if (results.length > 0) {
            const { lat, lon } = results[0];
            geocoded.push({
              id: lead.id,
              lat: parseFloat(lat),
              lng: parseFloat(lon),
              name: lead.name || "Lead",
              email: lead.email,
              phone: lead.phone,
              address: address,
              status: lead.status || "New",
            });
          }
        } catch (error) {
          console.error(`Geocoding failed for ${address}:`, error);
        }
      }

      setMarkers(geocoded);
      
      // Center map on leads if any were geocoded
      if (geocoded.length > 0) {
        const avgLat = geocoded.reduce((sum, m) => sum + m.lat, 0) / geocoded.length;
        const avgLng = geocoded.reduce((sum, m) => sum + m.lng, 0) / geocoded.length;
        setCenter([avgLat, avgLng]);
      }
      
      setLoading(false);
    };

    geocodeLeads();
  }, [leads]);

  const statusColors = {
    New: "#3B82F6",
    Contacted: "#F59E0B",
    Qualified: "#9333EA",
    Closed: "#16A34A",
    Lost: "#94A3B8",
  };

  if (loading) {
    return (
      <div className="w-full h-96 rounded-2xl border border-slate-200 flex items-center justify-center bg-slate-50">
        <div className="w-6 h-6 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    );
  }

  if (markers.length === 0) {
    return (
      <div className="w-full h-96 rounded-2xl border border-slate-200 flex flex-col items-center justify-center bg-slate-50">
        <MapPin className="h-10 w-10 text-slate-300 mb-2" />
        <p className="text-slate-400 font-medium">No property locations to map</p>
        <p className="text-xs text-slate-400 mt-0.5">Leads must have addresses or property URLs to display on map</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <MapContainer
        center={center}
        zoom={DEFAULT_ZOOM}
        style={{ width: "100%", height: "500px" }}
        className="rounded-2xl"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={L.icon({
              iconUrl: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${statusColors[marker.status] || '#3B82F6'}" width="32" height="32"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>`)}`,
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            })}
          >
            <Popup>
              <div className="text-xs space-y-1 min-w-48">
                <p className="font-bold text-slate-800">{marker.name}</p>
                <div className="flex items-center gap-1 text-slate-600">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{marker.address}</span>
                </div>
                {marker.email && (
                  <div className="flex items-center gap-1 text-slate-600">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{marker.email}</span>
                  </div>
                )}
                {marker.phone && (
                  <div className="flex items-center gap-1 text-slate-600">
                    <Phone className="h-3 w-3 flex-shrink-0" />
                    <span>{marker.phone}</span>
                  </div>
                )}
                <div className="pt-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white`} style={{ background: statusColors[marker.status] }}>
                    {marker.status}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500">
        {markers.length} lead{markers.length !== 1 ? "s" : ""} mapped · Pin colors indicate lead status
      </div>
    </div>
  );
}