import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, Users, AlertCircle } from 'lucide-react';

// Fix Leaflet default marker icons
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

const LeadIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ActivatorIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      const latLngs = bounds.map(b => [b.lat, b.lng]);
      const featureGroup = L.featureGroup(latLngs.map(ll => L.marker(ll)));
      map.fitBounds(featureGroup.getBounds(), { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

export default function LeadAndActivatorMap() {
  const [leads, setLeads] = useState([]);
  const [activators, setActivators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLeads, setShowLeads] = useState(true);
  const [showActivators, setShowActivators] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch activator leads with coordinates
        const activatorLeadsData = await base44.asServiceRole.entities.ActivatorLead.list();
        const validActivatorLeads = activatorLeadsData.filter(lead => lead.lat && lead.lng);
        setLeads(validActivatorLeads);

        // Fetch field activators with assigned areas
        const activatorsData = await base44.asServiceRole.entities.FieldActivator.list();
        setActivators(activatorsData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching map data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mapBounds = [
    ...leads.filter(l => l.lat && l.lng).map(l => ({ lat: l.lat, lng: l.lng })),
    ...activators.filter(a => a.assigned_area).map(() => ({ lat: 34.05, lng: -118.24 })) // Default LA area
  ];

  const defaultCenter = mapBounds.length > 0 
    ? [mapBounds[0].lat, mapBounds[0].lng]
    : [34.05, -118.24]; // Default to LA area

  if (loading) {
    return (
      <Card className="p-8 flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-600">Loading map data...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Error loading map</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="show-leads"
              checked={showLeads} 
              onCheckedChange={setShowLeads}
            />
            <label htmlFor="show-leads" className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Leads ({leads.length})
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox 
              id="show-activators"
              checked={showActivators} 
              onCheckedChange={setShowActivators}
            />
            <label htmlFor="show-activators" className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Field Activators ({activators.length})
            </label>
          </div>
        </div>
      </Card>

      {/* Map */}
      <Card className="overflow-hidden">
        <MapContainer 
          center={defaultCenter} 
          zoom={10} 
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          <MapBounds bounds={mapBounds} />

          {/* Lead Markers */}
          {showLeads && leads.map(lead => (
            lead.lat && lead.lng && (
              <Marker 
                key={`lead-${lead.id}`} 
                position={[lead.lat, lead.lng]}
                icon={LeadIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{lead.first_name} {lead.last_name}</p>
                    <p className="text-xs text-slate-600">{lead.property_address}</p>
                    <Badge className="mt-2 bg-blue-100 text-blue-800">
                      {lead.status || 'SCANNED'}
                    </Badge>
                    {lead.activation_source && (
                      <p className="text-xs mt-1 text-slate-600">
                        Via: {lead.activation_source}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          ))}

          {/* Activator Markers */}
          {showActivators && activators.map(activator => (
            <Marker 
              key={`activator-${activator.id}`}
              position={[34.05, -118.24]} // Placeholder center for LA area
              icon={ActivatorIcon}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{activator.name}</p>
                  <p className="text-xs text-slate-600">{activator.assigned_area || 'N/A'}</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    {activator.status}
                  </Badge>
                  <div className="text-xs mt-2 space-y-1">
                    <p>Scans: <strong>{activator.total_scans}</strong></p>
                    <p>Tier: <strong>{activator.activator_tier}</strong></p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs text-slate-600">Active Leads</p>
              <p className="text-2xl font-bold text-slate-900">{leads.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-xs text-slate-600">Field Activators</p>
              <p className="text-2xl font-bold text-slate-900">{activators.filter(a => a.status === 'active').length}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}