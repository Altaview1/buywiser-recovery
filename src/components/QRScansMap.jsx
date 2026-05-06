import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const STATUS_COLORS = {
  PENDING: "#FBBF24",
  APPROVED: "#10B981",
  REJECTED: "#EF4444",
};

function MapFitBounds({ scans }) {
  const map = useMap();
  useMemo(() => {
    const withCoords = scans.filter(s => s.lat && s.lng);
    if (withCoords.length > 0) {
      const bounds = L.latLngBounds(withCoords.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [scans, map]);
  return null;
}

export default function QRScansMap({ scans, payments }) {
  const paymentMap = useMemo(
    () => Object.fromEntries(payments.map(p => [p.lead_id, p.status])),
    [payments]
  );

  const scansWithCoords = useMemo(
    () => scans.filter(s => s.lat && s.lng),
    [scans]
  );

  const defaultCenter = [37.0902, -95.7129]; // US center

  return (
    <MapContainer
      center={defaultCenter}
      zoom={4}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <MapFitBounds scans={scansWithCoords} />
      {scansWithCoords.map((scan) => {
        const paymentStatus = paymentMap[scan.id] || "PENDING";
        const color = STATUS_COLORS[paymentStatus] || STATUS_COLORS.PENDING;

        return (
          <Marker
            key={scan.id}
            position={[scan.lat, scan.lng]}
            icon={L.divIcon({
              className: "custom-marker",
              html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">📍</div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
              popupAnchor: [0, -16],
            })}
          >
            <Popup>
              <div className="text-xs space-y-1 font-medium min-w-48">
                <p className="font-bold text-slate-900">
                  {scan.first_name} {scan.last_name}
                </p>
                <p className="text-slate-600">{scan.property_address}</p>
                {scan.rep_code && (
                  <p className="text-slate-500">
                    Rep: <span className="font-mono">{scan.rep_code}</span>
                  </p>
                )}
                <p className="text-slate-400 text-[11px]">
                  {new Date(scan.created_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <div className="mt-2 pt-2 border-t border-slate-200">
                  <span
                    style={{
                      color,
                      fontWeight: "bold",
                      fontSize: "12px",
                    }}
                  >
                    ● {paymentStatus}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}