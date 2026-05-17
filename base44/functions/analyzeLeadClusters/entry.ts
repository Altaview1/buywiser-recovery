import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Analyze Lead Clusters for Field Activator Route Optimization
 * Uses K-means clustering to identify geographic zones for efficient door-knocking routes
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Fetch activator leads listed ≤90 days with valid coordinates
    const allLeads = await base44.asServiceRole.entities.ActivatorLead.list();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    
    const leadsWithCoords = allLeads.filter(l => {
      if (!l.lat || !l.lng) return false;
      if (!l.listing_date) return false;
      const listingDate = new Date(l.listing_date);
      return listingDate >= ninetyDaysAgo && listingDate <= new Date();
    });

    if (leadsWithCoords.length < 3) {
      return Response.json({ 
        error: 'Insufficient leads with coordinates', 
        message: 'Need at least 3 leads with geocoded addresses' 
      }, { status: 400 });
    }

    // Fetch field activators
    const activators = await base44.asServiceRole.entities.FieldActivator.filter({ status: 'active' });

    // Simple K-means clustering implementation
    const numClusters = Math.min(Math.ceil(leadsWithCoords.length / 15), activators.length || 5);
    const clusters = kMeansClustering(leadsWithCoords, numClusters);

    // Analyze each cluster
    const clusterAnalysis = clusters.map((cluster, idx) => {
      const leads = cluster.leads;
      
      // Calculate cluster bounds and center
      const lats = leads.map(l => l.lat);
      const lngs = leads.map(l => l.lng);
      const centerLat = lats.reduce((a, b) => a + b) / lats.length;
      const centerLng = lngs.reduce((a, b) => a + b) / lngs.length;
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      // Calculate cluster spread (in km)
      const clusterRadiusKm = calculateDistance(centerLat, centerLng, maxLat, maxLng);

      // Calculate total driving distance within cluster (rough estimate)
      let totalDistance = 0;
      for (let i = 0; i < leads.length; i++) {
        for (let j = i + 1; j < leads.length; j++) {
          totalDistance += calculateDistance(leads[i].lat, leads[i].lng, leads[j].lat, leads[j].lng);
        }
      }
      const avgDistancePerLead = leads.length > 1 ? totalDistance / leads.length : 0;

      // Estimate driving time (assume 25 mph in urban, 35 mph highway average with stops)
      const estimatedHoursNeeded = (totalDistance / 30) + (leads.length * 0.25); // 0.25 hrs per door knock

      // Lead type distribution in cluster
      const leadTypes = {
        MORTGAGE: leads.filter(l => l.lead_type === 'MORTGAGE').length,
        FULL_STACK: leads.filter(l => l.lead_type === 'FULL_STACK').length,
        UNDECIDED: leads.filter(l => l.lead_type === 'UNDECIDED').length,
      };

      // Status distribution
      const statusDistribution = {
        SCANNED: leads.filter(l => l.status === 'SCANNED').length,
        VERIFIED: leads.filter(l => l.status === 'VERIFIED').length,
        QUALIFIED: leads.filter(l => l.status === 'QUALIFIED').length,
        SCHEDULED: leads.filter(l => l.status === 'SCHEDULED').length,
        COMPLETED: leads.filter(l => l.status === 'COMPLETED').length,
      };

      // High-priority leads (high equity, long-time property owners)
      const priorityLeads = leads
        .filter(l => (l.contact_priority_score || 0) >= 70)
        .sort((a, b) => (b.contact_priority_score || 0) - (a.contact_priority_score || 0))
        .slice(0, 5);

      // Suggested route (nearest neighbor approximation)
      const route = suggestRoute(leads);

      return {
        cluster_id: idx,
        center: { lat: centerLat, lng: centerLng },
        bounds: {
          north: maxLat,
          south: minLat,
          east: maxLng,
          west: minLng,
          radius_km: Math.round(clusterRadiusKm * 10) / 10,
        },
        lead_count: leads.length,
        lead_types: leadTypes,
        status_distribution: statusDistribution,
        metrics: {
          total_cluster_distance_km: Math.round(totalDistance * 10) / 10,
          avg_distance_between_leads_km: Math.round(avgDistancePerLead * 10) / 10,
          estimated_hours_for_complete_route: Math.round(estimatedHoursNeeded * 10) / 10,
          leads_per_hour: leads.length > 0 ? Math.round((leads.length / estimatedHoursNeeded) * 10) / 10 : 0,
          efficiency_score: Math.round((leads.length / (estimatedHoursNeeded || 1)) * 100) / 100,
        },
        high_priority_leads: priorityLeads.map(l => ({
          id: l.id,
          name: `${l.first_name} ${l.last_name}`,
          address: l.property_address,
          priority_score: l.contact_priority_score,
          estimated_equity: l.estimated_equity,
        })),
        suggested_route: route,
      };
    });

    // Suggest activator assignments
    const activatorAssignments = suggestActivatorAssignments(clusterAnalysis, activators);

    return Response.json({
      success: true,
      summary: {
        total_leads: leadsWithCoords.length,
        total_clusters: clusterAnalysis.length,
        active_activators: activators.length,
        average_leads_per_cluster: Math.round((leadsWithCoords.length / clusterAnalysis.length) * 10) / 10,
        total_estimated_distance_km: Math.round(
          clusterAnalysis.reduce((sum, c) => sum + c.metrics.total_cluster_distance_km, 0) * 10
        ) / 10,
        total_estimated_hours: Math.round(
          clusterAnalysis.reduce((sum, c) => sum + c.metrics.estimated_hours_for_complete_route, 0) * 10
        ) / 10,
      },
      clusters: clusterAnalysis,
      activator_assignments: activatorAssignments,
      insights: generateInsights(clusterAnalysis, activators),
    });

  } catch (error) {
    console.error('Clustering error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

/**
 * Simple K-means clustering algorithm
 */
function kMeansClustering(leads, k, maxIterations = 20) {
  // Initialize centroids randomly from leads
  let centroids = [];
  const indices = new Set();
  while (centroids.length < k) {
    const idx = Math.floor(Math.random() * leads.length);
    if (!indices.has(idx)) {
      centroids.push({ lat: leads[idx].lat, lng: leads[idx].lng });
      indices.add(idx);
    }
  }

  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign leads to nearest centroid
    const clusters = Array.from({ length: k }, () => []);
    
    leads.forEach(lead => {
      let minDist = Infinity;
      let nearestCluster = 0;
      
      centroids.forEach((centroid, idx) => {
        const dist = calculateDistance(lead.lat, lead.lng, centroid.lat, centroid.lng);
        if (dist < minDist) {
          minDist = dist;
          nearestCluster = idx;
        }
      });
      
      clusters[nearestCluster].push(lead);
    });

    // Update centroids
    const newCentroids = clusters.map(cluster => {
      if (cluster.length === 0) return centroids[0];
      const avgLat = cluster.reduce((sum, l) => sum + l.lat, 0) / cluster.length;
      const avgLng = cluster.reduce((sum, l) => sum + l.lng, 0) / cluster.length;
      return { lat: avgLat, lng: avgLng };
    });

    // Check for convergence
    if (centroids.every((c, i) => 
      calculateDistance(c.lat, c.lng, newCentroids[i].lat, newCentroids[i].lng) < 0.01
    )) {
      return clusters.map(leads => ({ leads }));
    }

    centroids = newCentroids;
  }

  return centroids.map((_, idx) => ({ 
    leads: leads.filter((lead, i) => {
      let nearestCluster = 0;
      let minDist = Infinity;
      centroids.forEach((c, cidx) => {
        const dist = calculateDistance(lead.lat, lead.lng, c.lat, c.lng);
        if (dist < minDist) {
          minDist = dist;
          nearestCluster = cidx;
        }
      });
      return nearestCluster === idx;
    })
  })).filter(c => c.leads.length > 0);
}

/**
 * Calculate distance between two coordinates (Haversine formula in km)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Suggest optimal route using nearest neighbor heuristic
 */
function suggestRoute(leads) {
  if (leads.length === 0) return [];
  
  const route = [leads[0]];
  const remaining = new Set(leads.slice(1));

  while (remaining.size > 0) {
    const current = route[route.length - 1];
    let nearest = null;
    let minDist = Infinity;

    remaining.forEach(lead => {
      const dist = calculateDistance(current.lat, current.lng, lead.lat, lead.lng);
      if (dist < minDist) {
        minDist = dist;
        nearest = lead;
      }
    });

    if (nearest) {
      route.push(nearest);
      remaining.delete(nearest);
    }
  }

  return route.slice(0, 10).map(l => ({
    sequence: route.indexOf(l) + 1,
    name: `${l.first_name} ${l.last_name}`,
    address: l.property_address,
    lat: l.lat,
    lng: l.lng,
  }));
}

/**
 * Suggest activator assignments to clusters
 */
function suggestActivatorAssignments(clusters, activators) {
  // Sort clusters by efficiency (highest efficiency first)
  const sortedClusters = [...clusters].sort((a, b) => 
    b.metrics.efficiency_score - a.metrics.efficiency_score
  );

  return sortedClusters.map((cluster, idx) => {
    const assignedActivator = activators[idx % activators.length];
    return {
      cluster_id: cluster.cluster_id,
      suggested_activator: assignedActivator ? {
        id: assignedActivator.id,
        name: assignedActivator.name,
        email: assignedActivator.email,
        current_total_scans: assignedActivator.total_scans,
      } : null,
      reason: `${cluster.lead_count} leads, ${cluster.metrics.estimated_hours_for_complete_route} hours estimated`,
      workload_fit: assignedActivator ? 'BALANCED' : 'NO_ACTIVATOR',
    };
  });
}

/**
 * Generate strategic insights from cluster analysis
 */
function generateInsights(clusters, activators) {
  const insights = [];

  // Density insights
  const avgLeadsPerCluster = clusters.reduce((sum, c) => sum + c.lead_count, 0) / clusters.length;
  const densestCluster = clusters.reduce((max, c) => 
    c.lead_count > max.lead_count ? c : max
  );

  insights.push({
    type: 'DENSITY',
    title: 'Cluster Density Variance',
    message: `Densest cluster has ${densestCluster.lead_count} leads (${Math.round((densestCluster.lead_count / avgLeadsPerCluster - 1) * 100)}% above average)`,
    priority: densestCluster.lead_count > avgLeadsPerCluster * 1.5 ? 'HIGH' : 'LOW',
  });

  // Efficiency insights
  const efficientClusters = clusters.filter(c => c.metrics.efficiency_score > 2.0);
  insights.push({
    type: 'EFFICIENCY',
    title: 'High Efficiency Zones',
    message: `${efficientClusters.length} clusters with >2.0 leads/hour efficiency (${Math.round((efficientClusters.length / clusters.length) * 100)}%)`,
    priority: efficientClusters.length > 0 ? 'MEDIUM' : 'LOW',
  });

  // Coverage insights
  const uncoveredLeads = clusters.reduce((sum, c) => sum + c.status_distribution.SCANNED, 0);
  insights.push({
    type: 'COVERAGE',
    title: 'Unworked Leads',
    message: `${uncoveredLeads} leads still in SCANNED status - highest priority for door-knocking`,
    priority: uncoveredLeads > 20 ? 'HIGH' : 'MEDIUM',
  });

  // Staffing insights
  const coverageRatio = activators.length > 0 ? (clusters.length / activators.length) : 0;
  insights.push({
    type: 'STAFFING',
    title: 'Activator to Cluster Ratio',
    message: `${activators.length} activators covering ${clusters.length} clusters (${Math.round(coverageRatio * 100) / 100} clusters per activator)`,
    priority: coverageRatio > 1.5 ? 'HIGH' : 'LOW',
  });

  return insights;
}