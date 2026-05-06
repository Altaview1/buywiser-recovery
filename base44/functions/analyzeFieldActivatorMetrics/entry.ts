import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Analyze Field Activator metrics to detect gaming patterns
 * Flags reps with suspicious activity for admin review
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const activator_id = body.activator_id;

    if (!activator_id) {
      return Response.json({ error: 'activator_id required' }, { status: 400 });
    }

    // Fetch activator
    const activators = await base44.asServiceRole.entities.FieldActivator.filter({ id: activator_id });
    if (!activators || activators.length === 0) {
      return Response.json({ error: 'Activator not found' }, { status: 404 });
    }
    const activator = activators[0];

    // Fetch all leads for this activator
    const leads = await base44.asServiceRole.entities.ActivatorLead.filter({ activator_id: activator_id }, '-created_date', 500);

    if (leads.length === 0) {
      return Response.json({ skipped: true, reason: 'No leads found' });
    }

    // Calculate metrics
    const totalDoors = leads.length;
    const knockConfirmed = leads.filter(l => l.knock_attempt_confirmed).length;
    const inPersonScans = leads.filter(l => l.status === 'VERIFIED').length;
    const noAnswerLeads = leads.filter(l => l.attempt_outcome === 'NO_ANSWER').length;
    const homeownerAnsweredLeads = leads.filter(l => l.attempt_outcome === 'HOMEOWNER_ANSWERED').length;

    const doorToScanRatio = totalDoors > 0 ? (inPersonScans / totalDoors) * 100 : 0;
    const noAnswerRate = knockConfirmed > 0 ? (noAnswerLeads / knockConfirmed) * 100 : 0;
    const homeownerAnswerRate = knockConfirmed > 0 ? (homeownerAnsweredLeads / knockConfirmed) * 100 : 0;

    // Calculate average visit duration (exclude zeros)
    const visitsWithDuration = leads.filter(l => l.visit_duration_seconds && l.visit_duration_seconds > 0);
    const avgVisitDuration = visitsWithDuration.length > 0
      ? visitsWithDuration.reduce((sum, l) => sum + l.visit_duration_seconds, 0) / visitsWithDuration.length
      : 0;

    // Count short visits (< 45 seconds)
    const shortVisits = leads.filter(l => l.visit_duration_seconds && l.visit_duration_seconds < 45).length;

    // ANTI-GAMING FLAGS
    const flags = [];
    const thresholds = {
      min_scan_rate: 15, // 15% in-person scans
      min_homeowner_answer_rate: 20, // At least 20% should answer door
      max_no_answer_rate: 85, // Threshold for excessive NO_ANSWER
      min_visit_duration: 60, // Average should be >= 60 seconds
    };

    if (totalDoors >= 50 && doorToScanRatio < thresholds.min_scan_rate) {
      flags.push({
        flag: 'LOW_SCAN_RATE',
        message: `Scan rate ${doorToScanRatio.toFixed(1)}% below threshold after ${totalDoors} doors`,
        severity: 'WARNING',
      });
    }

    if (knockConfirmed >= 20 && homeownerAnswerRate < thresholds.min_homeowner_answer_rate) {
      flags.push({
        flag: 'LOW_HOMEOWNER_ANSWER_RATE',
        message: `Only ${homeownerAnswerRate.toFixed(1)}% homeowner interactions (expect >= ${thresholds.min_homeowner_answer_rate}%)`,
        severity: 'WARNING',
      });
    }

    if (knockConfirmed >= 20 && noAnswerRate > thresholds.max_no_answer_rate) {
      flags.push({
        flag: 'EXCESSIVE_NO_ANSWER',
        message: `${noAnswerRate.toFixed(1)}% NO_ANSWER rate exceeds threshold`,
        severity: 'ALERT',
      });
    }

    if (visitsWithDuration.length >= 10 && avgVisitDuration < thresholds.min_visit_duration) {
      flags.push({
        flag: 'LOW_VISIT_DURATION',
        message: `Average visit ${avgVisitDuration.toFixed(0)}s below threshold (expect >= ${thresholds.min_visit_duration}s)`,
        severity: 'ALERT',
      });
    }

    if (shortVisits >= 5) {
      flags.push({
        flag: 'EXCESSIVE_SHORT_VISITS',
        message: `${shortVisits} visits under 45 seconds detected`,
        severity: 'ALERT',
      });
    }

    const metrics = {
      activator_id: activator_id,
      activator_name: activator.name,
      total_doors: totalDoors,
      knock_confirmed: knockConfirmed,
      in_person_scans: inPersonScans,
      door_to_scan_ratio: doorToScanRatio.toFixed(1) + '%',
      no_answer_rate: noAnswerRate.toFixed(1) + '%',
      homeowner_answer_rate: homeownerAnswerRate.toFixed(1) + '%',
      avg_visit_duration_seconds: Math.round(avgVisitDuration),
      short_visits_under_45s: shortVisits,
      flags: flags,
    };

    console.log(`📊 Metrics for ${activator.name}:`, JSON.stringify(metrics, null, 2));

    return Response.json({ success: true, metrics });
  } catch (error) {
    console.error('analyzeFieldActivatorMetrics error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});