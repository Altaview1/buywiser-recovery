import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";

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
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const routePolylineRef = useRef(null);

  // Load Google Maps API from environment/secret
  useEffect(() => {
    if (window.google) {
      setMapsReady(true);
      return;
    }

    // Fetch API key from backend secret
    const loadMaps = async () => {
      try {
        const res = await base44.functions.invoke('getMapsConfig', {});
        const apiKey = res.data?.apiKey;

        if (!apiKey) {
          console.error("Google Maps API key not available");
          setMapsReady(false);
          return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
        script.async = true;
        script.onload = () => {
          console.log("Google Maps loaded successfully");
          setMapsReady(true);
        };
        script.onerror = (err) => {
          console.error("Failed to load Google Maps API:", err);
          setMapsReady(false);
        };
        document.head.appendChild(script);
      } catch (err) {
        console.error("Failed to load maps config:", err);
        setMapsReady(false);
      }
    };

    loadMaps();
  }, []);

  // Geocode and plot leads
  useEffect(() => {
    if (!mapsReady || !window.google) {
      console.log("Waiting for Google Maps to load...", { mapsReady, hasGoogle: !!window.google });
      return;
    }

    const init = async () => {
      const filtered = leads.filter(l => {
        const matchFilter = filter === "All" || l.status === filter;
        return matchFilter && l.property_address;
      });

      console.log("Filtered leads:", filtered.length, "from", leads.length);

      if (filtered.length === 0) {
        setGeocodedLeads([]);
        setLoading(false);
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
                console.warn(`Geocoding failed for ${lead.property_address}: ${status}`);
                resolve(null);
              }
            });
          });
          if (result) geocoded.push(result);
        } catch (err) {
          console.error(`Geocoding error for ${lead.property_address}:`, err);
        }
      }

      console.log("Geocoded leads:", geocoded.length);
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

    // Clear old markers and polylines
    if (mapInstance.current.markers) {
      mapInstance.current.markers.forEach(m => m.setMap(null));
    }
    if (routePolylineRef.current) {
      routePolylineRef.current.setMap(null);
      routePolylineRef.current = null;
    }
    mapInstance.current.markers = [];

    // Add markers
    const infoWindows = [];
    leadsData.forEach((lead, idx) => {
      const isSelected = selectedLeadIds.includes(lead.id);
      const marker = new window.google.maps.Marker({
        position: { lat: lead.lat, lng: lead.lng },
        map: mapInstance.current,
        title: `${lead.first_name} ${lead.last_name}`,
        label: { text: String(idx + 1), color: "white", fontSize: "12px", fontWeight: "bold" },
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 16 : 12,
          fillColor: isSelected ? "#dc2626" : STATUS_COLORS[lead.status] || "#64748b",
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: isSelected ? 3 : 2,
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
            <button onclick="window.dispatchEvent(new CustomEvent('toggleSelect', { detail: '${lead.id}' }))" 
              style="margin-top: 4px; margin-left: 4px; padding: 4px 8px; background: ${isSelected ? '#dc2626' : '#10b981'}; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; font-weight: bold;">
              ${isSelected ? 'Deselect' : 'Select for Route'}
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

    // Custom event listeners
    window.addEventListener("selectLead", (e) => {
      const leadId = e.detail;
      const lead = leadsData.find(l => l.id === leadId);
      if (lead) onSelectLead(lead);
    });

    window.addEventListener("toggleSelect", (e) => {
      const leadId = e.detail;
      setSelectedLeadIds(prev => 
        prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
      );
    });
  };

  // Calculate optimal route when leads are selected
  const calculateRoute = async () => {
    if (selectedLeadIds.length < 2) {
      alert("Please select at least 2 locations for route optimization");
      return;
    }

    const selected = geocodedLeads.filter(l => selectedLeadIds.includes(l.id));
    if (selected.length < 2) return;

    const directionsService = new window.google.maps.DirectionsService();
    const origin = selected[0];
    const destination = selected[selected.length - 1];
    const waypoints = selected.slice(1, -1).map(l => ({
      location: { lat: l.lat, lng: l.lng },
      stopover: true,
    }));

    try {
      const result = await directionsService.route({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        waypoints,
        optimizeWaypoints: true,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      // Draw polyline
      const route = result.routes[0];
      if (routePolylineRef.current) {
        routePolylineRef.current.setMap(null);
      }

      routePolylineRef.current = new window.google.maps.Polyline({
        path: route.overview_path,
        geodesic: true,
        strokeColor: "#2563eb",
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map: mapInstance.current,
      });

      // Calculate total distance and time
      let totalDistance = 0;
      let totalTime = 0;
      route.legs.forEach(leg => {
        totalDistance += leg.distance.value;
        totalTime += leg.duration.value;
      });

      setRouteInfo({
        distance: (totalDistance / 1609.34).toFixed(1), // miles
        time: Math.round(totalTime / 60), // minutes
        stops: selected.length,
      });
    } catch (err) {
      console.error("Route calculation failed:", err);
      alert("Could not calculate route. Try selecting different locations.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter & Route Controls */}
      <div className="space-y-3">
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

        {/* Route Optimization Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">
            Selected: {selectedLeadIds.length}
          </span>
          {selectedLeadIds.length > 0 && (
            <button
              onClick={calculateRoute}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
            >
              📍 Optimize Route ({selectedLeadIds.length})
            </button>
          )}
          {selectedLeadIds.length > 0 && (
            <button
              onClick={() => setSelectedLeadIds([])}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* Route Info */}
        {routeInfo && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-xs space-y-1">
            <p className="font-bold text-green-800">✓ Route Optimized</p>
            <p className="text-green-700">📏 Distance: <strong>{routeInfo.distance} mi</strong> | ⏱ Est. Time: <strong>{routeInfo.time} min</strong> | 📍 Stops: <strong>{routeInfo.stops}</strong></p>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden h-[600px] relative">
        {!mapsReady ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
            <div className="text-center max-w-xs">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Loading Google Maps...</p>
              <p className="text-xs text-slate-400 mt-2">
                If this takes too long, your API key may need domain restrictions updated to allow this preview domain.
              </p>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                {window.location.host}
              </p>
            </div>
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