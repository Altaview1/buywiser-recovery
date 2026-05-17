import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, MapPin, Zap, Users, Navigation, TrendingUp, RefreshCw, ChevronDown } from 'lucide-react';

const ClusterIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const RouteIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-purple.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [20, 34],
  iconAnchor: [10, 34],
  popupAnchor: [1, -28],
  shadowSize: [34, 34],
});

const ActivatorIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Heatmap layer component
function HeatmapLayer({ leads, showHeatmap }) {
  const map = useMap();
  
  useEffect(() => {
    if (!showHeatmap || !leads || leads.length === 0) return;

    // Create heatmap layer using canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Initialize leaflet-heat if available, otherwise use simple gradient overlay
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet.heat/0.2.0/leaflet-heat.min.js';
    script.onload = () => {
      const heatData = leads
        .filter(l => l.lat && l.lng)
        .map(l => [l.lat, l.lng, 1]); // intensity = 1 for all leads
      
      if (window.L && window.L.heatLayer && heatData.length > 0) {
        const heatLayer = window.L.heatLayer(heatData, {
          radius: 30,
          blur: 25,
          maxZoom: 17,
          gradient: {
            0.0: '#0000ff',
            0.33: '#00ff00',
            0.67: '#ffff00',
            1.0: '#ff0000'
          }
        });
        heatLayer.addTo(map);
        
        return () => {
          map.removeLayer(heatLayer);
        };
      }
    };
    document.head.appendChild(script);
  }, [showHeatmap, leads, map]);

  return null;
}

export default function RouteOptimizationDashboard() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [expandedCluster, setExpandedCluster] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showActivators, setShowActivators] = useState(true);

  const [activators, setActivators] = useState([]);

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        const [analysisRes, activatorsRes] = await Promise.all([
          base44.functions.invoke('analyzeLeadClusters', {}),
          base44.asServiceRole.entities.FieldActivator.filter({ status: 'active' })
        ]);
        setAnalysis(analysisRes.data);
        setActivators(activatorsRes || []);
        setLoading(false);
      } catch (err) {
        console.error('Analysis error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    runAnalysis();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600">Analyzing lead clusters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900">Analysis Error</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const clusterColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#84CC16'
  ];

  const mapBounds = analysis?.clusters?.length > 0 
    ? [[
        Math.min(...analysis.clusters.map(c => c.bounds.south)),
        Math.min(...analysis.clusters.map(c => c.bounds.west)),
      ], [
        Math.max(...analysis.clusters.map(c => c.bounds.north)),
        Math.max(...analysis.clusters.map(c => c.bounds.east)),
      ]]
    : [[34.05, -118.24], [34.10, -118.20]];

  const defaultCenter = analysis?.clusters?.[0]?.center || { lat: 34.05, lng: -118.24 };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Field Operations</p>
            <h1 className="text-lg font-bold text-slate-800 mt-0.5">Route Optimization Dashboard</h1>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Card className="p-4 text-center">
            <p className="text-2xl font-black text-slate-800">{analysis?.summary.total_leads}</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Leads</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-black text-blue-700">{analysis?.summary.total_clusters}</p>
            <p className="text-xs text-slate-500 mt-0.5">Clusters</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-black text-green-700">{analysis?.summary.average_leads_per_cluster}</p>
            <p className="text-xs text-slate-500 mt-0.5">Avg per Cluster</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-black text-purple-700">{analysis?.summary.total_estimated_distance_km} km</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Distance</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-black text-amber-700">{analysis?.summary.total_estimated_hours} hrs</p>
            <p className="text-xs text-slate-500 mt-0.5">Total Time</p>
          </Card>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis?.insights?.map((insight, idx) => (
            <Card key={idx} className={`p-4 border-l-4 ${
              insight.priority === 'HIGH' ? 'border-l-red-500 bg-red-50' :
              insight.priority === 'MEDIUM' ? 'border-l-amber-500 bg-amber-50' :
              'border-l-blue-500 bg-blue-50'
            }`}>
              <div className="flex items-start gap-3">
                <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  insight.priority === 'HIGH' ? 'text-red-600' :
                  insight.priority === 'MEDIUM' ? 'text-amber-600' :
                  'text-blue-600'
                }`} />
                <div>
                  <p className="font-semibold text-sm">{insight.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{insight.message}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Map Controls */}
        <Card className="p-4">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showHeatmap} 
                onChange={(e) => setShowHeatmap(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-sm font-medium text-slate-900">Lead Density Heatmap</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showActivators} 
                onChange={(e) => setShowActivators(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300"
              />
              <span className="text-sm font-medium text-slate-900">Active Activators</span>
            </label>
            <div className="ml-auto flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-slate-600">Low Density</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-slate-600">High Density</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Map */}
        <Card className="overflow-hidden">
          <MapContainer 
            bounds={mapBounds} 
            style={{ height: '500px', width: '100%' }}
            boundsOptions={{ padding: [50, 50] }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {/* Heatmap Layer */}
            {showHeatmap && <HeatmapLayer leads={analysis?.clusters?.flatMap(c => c.suggested_route) || []} showHeatmap={showHeatmap} />}

            {analysis?.clusters?.map((cluster, idx) => (
              <React.Fragment key={`cluster-${idx}`}>
                {/* Cluster Center */}
                <Marker 
                  position={[cluster.center.lat, cluster.center.lng]}
                  icon={ClusterIcon}
                  eventHandlers={{ click: () => setSelectedCluster(idx) }}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">Cluster {cluster.cluster_id}</p>
                      <p className="text-xs mt-1">{cluster.lead_count} leads</p>
                      <p className="text-xs text-slate-600">{cluster.metrics.estimated_hours_for_complete_route} hrs</p>
                    </div>
                  </Popup>
                </Marker>

                {/* Cluster Radius Circle */}
                <Circle
                  center={[cluster.center.lat, cluster.center.lng]}
                  radius={cluster.bounds.radius_km * 1000}
                  pathOptions={{
                    color: clusterColors[idx % clusterColors.length],
                    fillColor: clusterColors[idx % clusterColors.length],
                    fillOpacity: 0.1,
                    weight: 2,
                  }}
                />

                {/* Route Markers */}
                {selectedCluster === idx && cluster.suggested_route.map((waypoint, rIdx) => (
                  <Marker 
                    key={`route-${idx}-${rIdx}`}
                    position={[waypoint.lat, waypoint.lng]}
                    icon={RouteIcon}
                  >
                    <Popup>
                      <div className="text-xs">
                        <p className="font-bold">Stop {waypoint.sequence}</p>
                        <p>{waypoint.name}</p>
                        <p className="text-slate-600">{waypoint.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </React.Fragment>
            ))}

            {/* Active Activators */}
            {showActivators && activators.map((activator) => (
              <Marker
                key={`activator-${activator.id}`}
                position={[34.05, -118.24]}
                icon={ActivatorIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">{activator.name}</p>
                    <p className="text-xs text-slate-600">{activator.assigned_area || 'Area TBD'}</p>
                    <Badge className="mt-2 bg-orange-100 text-orange-800">
                      {activator.total_scans} scans
                    </Badge>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </Card>

        {/* Cluster Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Cluster Details</h2>
          {analysis?.clusters?.map((cluster, idx) => (
            <Card key={idx} className="overflow-hidden">
              <button
                onClick={() => setExpandedCluster(expandedCluster === idx ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition text-left"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: clusterColors[idx % clusterColors.length] }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">Cluster {cluster.cluster_id}</p>
                    <p className="text-sm text-slate-600">{cluster.lead_count} leads • {cluster.metrics.estimated_hours_for_complete_route} hrs</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      cluster.metrics.efficiency_score > 2 ? 'bg-green-100 text-green-800' :
                      cluster.metrics.efficiency_score > 1 ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {cluster.metrics.efficiency_score}/10 efficiency
                    </Badge>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition ${expandedCluster === idx ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </button>

              {expandedCluster === idx && (
                <div className="border-t border-slate-100 p-5 space-y-5 bg-slate-50">
                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-slate-600">Distance</p>
                      <p className="text-lg font-bold text-slate-800">{cluster.metrics.total_cluster_distance_km} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Avg Between</p>
                      <p className="text-lg font-bold text-slate-800">{cluster.metrics.avg_distance_between_leads_km} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Leads/Hour</p>
                      <p className="text-lg font-bold text-green-700">{cluster.metrics.leads_per_hour}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-600">Coverage</p>
                      <p className="text-lg font-bold text-blue-700">{Math.round((cluster.bounds.radius_km) * 2)} km Ø</p>
                    </div>
                  </div>

                  {/* Lead Types */}
                  <div>
                    <p className="font-semibold text-sm mb-3 text-slate-900">Lead Types</p>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(cluster.lead_types).map(([type, count]) => (
                        <div key={type} className="text-center p-2 bg-white rounded-lg border border-slate-200">
                          <p className="text-sm font-bold text-slate-800">{count}</p>
                          <p className="text-xs text-slate-600">{type}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Distribution */}
                  <div>
                    <p className="font-semibold text-sm mb-3 text-slate-900">Status Breakdown</p>
                    <div className="space-y-2">
                      {Object.entries(cluster.status_distribution).map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">{status}</span>
                          <span className="font-bold text-slate-800">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* High Priority Leads */}
                  {cluster.high_priority_leads.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm mb-3 text-slate-900 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-red-600" /> Top Priority (Score 70+)
                      </p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {cluster.high_priority_leads.map((lead, pidx) => (
                          <div key={pidx} className="p-2 bg-white rounded border-l-2 border-red-500">
                            <p className="text-sm font-semibold text-slate-900">{lead.name}</p>
                            <p className="text-xs text-slate-600">{lead.address}</p>
                            <p className="text-xs mt-1">
                              <span className="font-bold text-red-700">Score: {lead.priority_score}</span>
                              {lead.estimated_equity && <span> • ${(lead.estimated_equity / 1000).toFixed(0)}K equity</span>}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Route */}
                  <div>
                    <p className="font-semibold text-sm mb-3 text-slate-900 flex items-center gap-2">
                      <Navigation className="h-4 w-4" /> Optimized Route (First 10)
                    </p>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {cluster.suggested_route.map((stop, sIdx) => (
                        <div key={sIdx} className="text-xs p-1.5 bg-white rounded text-slate-700 border border-slate-200">
                          <span className="font-bold text-slate-800">#{stop.sequence}</span> {stop.name} - {stop.address}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Activator Assignments */}
        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-4 w-4" /> Recommended Activator Assignments
            </h3>
          </div>
          <div className="divide-y divide-slate-100">
            {analysis?.activator_assignments?.map((assignment, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-slate-900">Cluster {assignment.cluster_id}</p>
                    <p className="text-sm text-slate-600 mt-0.5">{assignment.reason}</p>
                  </div>
                  <Badge className={`${
                    assignment.workload_fit === 'BALANCED' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {assignment.workload_fit}
                  </Badge>
                </div>
                {assignment.suggested_activator && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900">{assignment.suggested_activator.name}</p>
                    <p className="text-xs text-blue-700">{assignment.suggested_activator.email}</p>
                    <p className="text-xs text-blue-600 mt-1">Current scans: {assignment.suggested_activator.current_total_scans}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}