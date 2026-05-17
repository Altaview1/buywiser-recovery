import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Analyze Staffing Needs
 * Takes lead clusters and recommends staffing levels per region
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { clusters } = await req.json();
    if (!clusters || clusters.length === 0) {
      return Response.json({ error: 'No clusters provided' }, { status: 400 });
    }

    // Configuration
    const LEADS_PER_ACTIVATOR_PER_DAY = 8;
    const WORKING_DAYS_PER_WEEK = 5;
    const LEADS_PER_ACTIVATOR_PER_WEEK = LEADS_PER_ACTIVATOR_PER_DAY * WORKING_DAYS_PER_WEEK;
    const RAMP_UP_BUFFER = 1.2; // 20% buffer for new activator ramp-up

    // Analyze each cluster
    const staffingAnalysis = clusters.map((cluster, idx) => {
      const leadCount = cluster.lead_count || cluster.suggested_route?.length || 0;
      const avgDistanceBetweenLeads = cluster.metrics?.avg_distance_between_leads_km || 0;
      const totalDistance = cluster.metrics?.total_cluster_distance_km || 0;
      const estimatedHours = cluster.metrics?.estimated_hours_for_complete_route || 0;

      // Calculate base activators needed
      const baseActivatorsNeeded = Math.ceil(leadCount / LEADS_PER_ACTIVATOR_PER_WEEK);
      
      // Adjust for distance efficiency
      let distanceMultiplier = 1;
      if (avgDistanceBetweenLeads > 10) {
        distanceMultiplier = 1.3; // Sparse cluster = more travel time
      } else if (avgDistanceBetweenLeads > 5) {
        distanceMultiplier = 1.15;
      }

      // Final recommendation with buffer
      const recommendedActivators = Math.max(
        1,
        Math.ceil(baseActivatorsNeeded * distanceMultiplier * RAMP_UP_BUFFER)
      );

      // Estimate hiring urgency
      let urgency = 'LOW';
      if (recommendedActivators > 3) urgency = 'HIGH';
      else if (recommendedActivators > 1) urgency = 'MEDIUM';

      return {
        cluster_id: cluster.cluster_id || idx + 1,
        lead_count: leadCount,
        recommended_activators: recommendedActivators,
        base_activators: baseActivatorsNeeded,
        distance_factor: distanceMultiplier.toFixed(2),
        urgency,
        avg_distance_between_leads_km: avgDistanceBetweenLeads,
        total_distance_km: totalDistance,
        estimated_hours_per_complete_route: estimatedHours,
        geographic_center: cluster.center || null,
        radius_km: cluster.bounds?.radius_km || 0,
        primary_city: cluster.primary_cities?.[0] || 'TBD',
        supporting_cities: cluster.primary_cities?.slice(1, 3) || []
      };
    });

    // Aggregate staffing summary
    const totalLeads = staffingAnalysis.reduce((sum, s) => sum + s.lead_count, 0);
    const totalActivatorsNeeded = staffingAnalysis.reduce((sum, s) => sum + s.recommended_activators, 0);
    const highUrgencyClusters = staffingAnalysis.filter(s => s.urgency === 'HIGH').length;

    // Group by urgency for regional hiring strategy
    const hiringStrategy = {
      immediate: staffingAnalysis.filter(s => s.urgency === 'HIGH'),
      near_term: staffingAnalysis.filter(s => s.urgency === 'MEDIUM'),
      backlog: staffingAnalysis.filter(s => s.urgency === 'LOW')
    };

    // Calculate coverage efficiency
    const leadsPerActivator = (totalLeads / totalActivatorsNeeded).toFixed(1);

    return Response.json({
      summary: {
        total_leads: totalLeads,
        total_clusters: clusters.length,
        total_activators_needed: totalActivatorsNeeded,
        leads_per_activator: leadsPerActivator,
        coverage_efficiency_score: ((totalLeads / totalActivatorsNeeded / LEADS_PER_ACTIVATOR_PER_WEEK) * 100).toFixed(0) + '%',
        high_urgency_clusters: highUrgencyClusters
      },
      staffing_by_cluster: staffingAnalysis,
      hiring_strategy: {
        immediate_count: hiringStrategy.immediate.length,
        immediate_clusters: hiringStrategy.immediate,
        near_term_count: hiringStrategy.near_term.length,
        near_term_clusters: hiringStrategy.near_term,
        backlog_count: hiringStrategy.backlog.length,
        backlog_clusters: hiringStrategy.backlog
      },
      recommendations: [
        `Hire ${hiringStrategy.immediate.length} activators immediately for ${hiringStrategy.immediate.map(c => c.primary_city).join(', ')}`,
        `Plan hiring of ${hiringStrategy.near_term.length} activators for near-term expansion in medium-density areas`,
        `Monitor backlog areas (${hiringStrategy.backlog.length}) for growth trends`,
        `Current coverage ratio: ${leadsPerActivator} leads per activator (target: ${LEADS_PER_ACTIVATOR_PER_WEEK} per week)`
      ],
      refresh_frequency: 'Daily - new data updates this analysis automatically'
    });

  } catch (error) {
    console.error('Staffing analysis error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});