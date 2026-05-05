import { useState, useEffect, useRef } from "react";

const STATUS_COLORS = {
  SCANNED: "#64748b",
  VERIFIED: "#3b82f6",
  QUALIFIED: "#f59e0b",
  SCHEDULED: "#a855f7",
  COMPLETED: "#16a34a",
  CLOSED: "#059669",
};

export default function ActivatorLeadsMap({ leads, onSelectLead }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [filter, setFilter] = useState("All");
  const [geocodedLeads, setGeocodedLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);

  // Load Google Maps API from environment/secret
  useEffect(() => {
    if (window.google) {
      setMapsReady(true);
      return;
    }

    // Try multiple sources for API key
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
                   window.GOOGLE_MAPS_API_KEY ||
                   localStorage.getItem("GOOGLE_MAPS_API_KEY");
    
    if (!apiKey) {
      console.warn("Google Maps API key not found. Set VITE_GOOGLE_MAPS_API_KEY in .env.local");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.onload = () => setMapsReady(true);
    script.onerror = () => console.error("Failed to load Google Maps API");
    document.head.appendChild(script);
  }, []);

  // Geocode and plot leads
  useEffect(() => {
    if (!mapsReady || !window.google) return;

    const init = async () => {
      const filtered = leads.filter(l => {
        const matchFilter = filter === "All" || l.status === filter;
        return matchFilter && l.property_address;
      });

      if (filtered.length === 0) {
        setGeocodedLeads([]);
        return;
      }

      setLoading(true);
      const geocoder = new window.google.maps.Geocoder();
      const geocoded = [];

      for (const lead of filtered) {
        try {
          const result = await new Promise((resolve) => {
            geocoder.geocode({ address: lead.property_address }, (results, status) => {
              if (status === "OK" && results[0]) {
                const loc = results[0].geometry.location;
                resolve({ ...lead, lat: loc.lat(), lng: loc.lng() });
              } else {
                console.warn(`Geocoding failed for: ${lead.property_address}`);
                resolve(null);
              }
            });
          });
          if (result) geocoded.push(result);
        } catch (err) {
          console.error(`Geocoding error for ${lead.property_address}:`, err);
        }
      }

      setGeocodedLeads(geocoded);

      // Initialize or update map
      if (mapRef.current && geocoded.length > 0) {
        initializeMap(geocoded);
      }

      setLoading(false);
    };

    init();
  }, [leads, filter, mapsReady]);

  const initializeMap = (leadsData) => {
    if (!window.google || !mapRef.current) return;

    // Calculate bounds
    const bounds = new window.google.maps.LatLngBounds();
    leadsData.forEach(lead => {
      bounds.extend(new window.google.maps.LatLng(lead.lat, lead.lng));
    });

    // Create or update map
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        zoom: 10,
        center: bounds.getCenter(),
        mapTypeId: "roadmap",
      });
    }

    // Clear old markers
    if (mapInstance.current.markers) {
      mapInstance.current.markers.forEach(m => m.setMap(null));
    }
    mapInstance.current.markers = [];

    // Add markers
    const infoWindows = [];
    leadsData.forEach((lead, idx) => {
      const marker = new window.google.maps.Marker({
        position: { lat: lead.lat, lng: lead.lng },
        map: mapInstance.current,
        title: `${lead.first_name} ${lead.last_name}`,
        label: { text: String(idx + 1), color: "white", fontSize: "12px", fontWeight: "bold" },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: STATUS_COLORS[lead.status] || "#64748b",
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: 2,
        },
      });

      const fullName = `${lead.first_name || ''} ${lead.last_name || ''}`.trim();
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-size: 12px; max-width: 200px;">
            <strong>#${idx + 1} ${fullName || "Prospect"}</strong><br/>
            ${lead.property_address}<br/>
            ${lead.property_type ? `Type: ${lead.property_type}<br/>` : ""}
            ${lead.estimated_price ? `Est: $${(lead.estimated_price/1000).toFixed(0)}K<br/>` : ""}
            ${lead.listing_dom != null && lead.listing_dom > 0 ? `DOM: ${lead.listing_dom}<br/>` : ""}
            <button onclick="window.dispatchEvent(new CustomEvent('selectLead', { detail: '${lead.id}' }))" 
              style="margin-top: 8px; padding: 4px 8px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold;">
              View Details
            </button>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindows.forEach(iw => iw.close());
        infoWindow.open(mapInstance.current, marker);
      });

      mapInstance.current.markers.push(marker);
      infoWindows.push(infoWindow);
    });

    // Fit bounds
    mapInstance.current.fitBounds(bounds);

    // Custom event listener for marker clicks
    window.addEventListener("selectLead", (e) => {
      const leadId = e.detail;
      const lead = leadsData.find(l => l.id === leadId);
      if (lead) onSelectLead(lead);
    });
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
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden h-[600px] relative">
        {!mapsReady ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
            <p>Loading Google Maps...</p>
          </div>
        ) : geocodedLeads.length === 0 && !loading ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400">
            <div className="text-center">
              <p className="font-semibold mb-1">No leads to display</p>
              <p className="text-sm">Add leads with valid addresses to see them on the map</p>
            </div>
          </div>
        ) : (
          <>
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Stats */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 space-y-1 text-xs">
        <p className="font-bold text-amber-900">📍 {geocodedLeads.length} prospect{geocodedLeads.length !== 1 ? "s" : ""} mapped</p>
        {geocodedLeads.length > 1 && (
          <p className="text-amber-700">💡 <strong>Route Tip:</strong> Numbered markers show suggested door-knock sequence.</p>
        )}
      </div>
    </div>
  );
}