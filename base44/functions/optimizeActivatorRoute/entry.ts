import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Optimize Activator Route
 * Takes cluster leads and returns the most efficient door-knocking sequence
 * Uses nearest-neighbor algorithm for TSP approximation
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { cluster_leads } = await req.json();

    if (!cluster_leads || !Array.isArray(cluster_leads) || cluster_leads.length === 0) {
      return Response.json({ error: 'cluster_leads array required' }, { status: 400 });
    }

    // Filter leads with valid coordinates
    const leadsWithCoords = cluster_leads.filter(lead => lead.lat && lead.lng);

    if (leadsWithCoords.length === 0) {
      return Response.json({ error: 'No leads with valid coordinates' }, { status: 400 });
    }

    // Calculate distance between two points (haversine formula in km)
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // Nearest-neighbor TSP algorithm
    const optimizeRoute = (leads) => {
      const unvisited = [...leads];
      const route = [unvisited.shift()];
      let totalDistance = 0;

      while (unvisited.length > 0) {
        const current = route[route.length - 1];
        let nearestIdx = 0;
        let nearestDistance = Infinity;

        unvisited.forEach((lead, idx) => {
          const dist = calculateDistance(current.lat, current.lng, lead.lat, lead.lng);
          if (dist < nearestDistance) {
            nearestDistance = dist;
            nearestIdx = idx;
          }
        });

        const nearest = unvisited.splice(nearestIdx, 1)[0];
        route.push(nearest);
        totalDistance += nearestDistance;
      }

      return { route, totalDistance };
    };

    const { route, totalDistance } = optimizeRoute(leadsWithCoords);

    // Calculate estimated time (walking/driving at ~30 km/h + 15 min per stop)
    const estimatedHours = (totalDistance / 30) + (route.length * 0.25);

    return Response.json({
      optimized_route: route,
      total_distance_km: parseFloat(totalDistance.toFixed(2)),
      estimated_hours: parseFloat(estimatedHours.toFixed(2)),
      stop_count: route.length,
      polyline: route.map(lead => [lead.lat, lead.lng])
    });
  } catch (error) {
    console.error('Route optimization error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});