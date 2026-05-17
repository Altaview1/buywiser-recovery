import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Users, MapPin, TrendingUp, RefreshCw, BarChart3 } from 'lucide-react';

export default function StaffingNeedsReport() {
  const [staffingData, setStaffingData] = useState(null);
  const [clusters, setClusters] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // Get cluster analysis
      const clusterResponse = await base44.functions.invoke('analyzeLeadClusters', {});
      const clusterData = clusterResponse.data;
      setClusters(clusterData);

      // Get staffing analysis
      const staffingResponse = await base44.functions.invoke('analyzeStaffingNeeds', {
        clusters: clusterData.clusters || []
      });
      setStaffingData(staffingResponse.data);
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 6 hours
    const interval = setInterval(loadData, 6 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Analyzing staffing needs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full p-6 border-red-200 bg-red-50">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-900">Error loading report</p>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const summary = staffingData?.summary || {};
  const hiringStrategy = staffingData?.hiring_strategy || {};

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Staffing Needs Report</h1>
            <p className="text-sm text-slate-600 mt-1">Dynamic analysis of field activator requirements by region</p>
          </div>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <p className="text-xs text-slate-500">Last updated: {lastUpdated}</p>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Total Leads</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{summary.total_leads}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-200" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Active Clusters</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{summary.total_clusters}</p>
              </div>
              <MapPin className="h-8 w-8 text-green-200" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Activators Needed</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{summary.total_activators_needed}</p>
              </div>
              <Users className="h-8 w-8 text-orange-200" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Coverage Ratio</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{summary.leads_per_activator}</p>
                <p className="text-xs text-slate-500 mt-1">leads/activator</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-200" />
            </div>
          </Card>
        </div>

        {/* Hiring Strategy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Immediate */}
          <Card className="border-red-200 bg-red-50 overflow-hidden">
            <div className="px-6 py-4 border-b border-red-200 bg-red-100">
              <h3 className="font-bold text-red-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> Immediate Hiring
              </h3>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-red-700">{hiringStrategy.immediate_count}</p>
              <p className="text-sm text-red-600 mt-2">regions need activators</p>
              <div className="mt-4 space-y-2">
                {hiringStrategy.immediate_clusters?.map((cluster, idx) => (
                  <div key={idx} className="text-xs p-2 bg-red-100 rounded border border-red-200">
                    <p className="font-semibold text-red-900">{cluster.primary_city}</p>
                    <p className="text-red-700">{cluster.recommended_activators} activators • {cluster.lead_count} leads</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Near-term */}
          <Card className="border-amber-200 bg-amber-50 overflow-hidden">
            <div className="px-6 py-4 border-b border-amber-200 bg-amber-100">
              <h3 className="font-bold text-amber-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Near-Term Planning
              </h3>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-amber-700">{hiringStrategy.near_term_count}</p>
              <p className="text-sm text-amber-600 mt-2">regions for expansion</p>
              <div className="mt-4 space-y-2">
                {hiringStrategy.near_term_clusters?.map((cluster, idx) => (
                  <div key={idx} className="text-xs p-2 bg-amber-100 rounded border border-amber-200">
                    <p className="font-semibold text-amber-900">{cluster.primary_city}</p>
                    <p className="text-amber-700">{cluster.recommended_activators} activators • {cluster.lead_count} leads</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Backlog */}
          <Card className="border-slate-200 bg-slate-50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-100">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Monitor & Watch
              </h3>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-slate-700">{hiringStrategy.backlog_count}</p>
              <p className="text-sm text-slate-600 mt-2">backlog areas</p>
              <div className="mt-4 space-y-2">
                {hiringStrategy.backlog_clusters?.slice(0, 3).map((cluster, idx) => (
                  <div key={idx} className="text-xs p-2 bg-slate-100 rounded border border-slate-200">
                    <p className="font-semibold text-slate-900">{cluster.primary_city}</p>
                    <p className="text-slate-700">{cluster.recommended_activators} activators • {cluster.lead_count} leads</p>
                  </div>
                ))}
                {hiringStrategy.backlog_count > 3 && (
                  <p className="text-xs text-slate-600 mt-2 italic">+{hiringStrategy.backlog_count - 3} more areas</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Cluster Analysis */}
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
            <h3 className="text-lg font-bold text-slate-900">Detailed Cluster Analysis</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Cluster</th>
                  <th className="px-6 py-3 text-left font-semibold text-slate-700">Location</th>
                  <th className="px-6 py-3 text-right font-semibold text-slate-700">Leads</th>
                  <th className="px-6 py-3 text-right font-semibold text-slate-700">Activators</th>
                  <th className="px-6 py-3 text-right font-semibold text-slate-700">Distance</th>
                  <th className="px-6 py-3 text-center font-semibold text-slate-700">Urgency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staffingData?.staffing_by_cluster?.map((cluster, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-semibold text-slate-900">Cluster {cluster.cluster_id}</td>
                    <td className="px-6 py-4 text-slate-700">
                      <div>
                        <p className="font-medium">{cluster.primary_city}</p>
                        <p className="text-xs text-slate-600">{cluster.radius_km} km radius</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-900 font-semibold">{cluster.lead_count}</td>
                    <td className="px-6 py-4 text-right">
                      <Badge className={`${
                        cluster.urgency === 'HIGH' ? 'bg-red-100 text-red-800' :
                        cluster.urgency === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {cluster.recommended_activators}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-700">{cluster.avg_distance_between_leads_km} km</td>
                    <td className="px-6 py-4 text-center">
                      <Badge className={`${
                        cluster.urgency === 'HIGH' ? 'bg-red-100 text-red-800' :
                        cluster.urgency === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {cluster.urgency}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recommendations */}
        {staffingData?.recommendations && (
          <Card className="p-6 border-blue-200 bg-blue-50">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" /> Strategic Recommendations
            </h3>
            <ul className="space-y-2">
              {staffingData.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-2 text-sm text-blue-900">
                  <span className="font-bold text-blue-600">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}