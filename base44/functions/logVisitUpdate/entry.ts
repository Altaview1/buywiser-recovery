import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    // This is triggered by entity automation on Visit update
    const payload = await req.json();
    const { event, data, old_data } = payload;

    if (event.type !== 'update') {
      return Response.json({ status: 'skipped', reason: 'Not an update event' });
    }

    if (!user || user.role !== 'admin') {
      return Response.json({ status: 'skipped', reason: 'Non-admin update' });
    }

    // Identify which fields changed
    const changedFields = [];
    const oldValues = {};
    const newValues = {};

    if (old_data && data) {
      for (const [key, newValue] of Object.entries(data)) {
        const oldValue = old_data[key];
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changedFields.push(key);
          oldValues[key] = oldValue;
          newValues[key] = newValue;
        }
      }
    }

    // Skip if no actual changes
    if (changedFields.length === 0) {
      return Response.json({ status: 'skipped', reason: 'No field changes detected' });
    }

    // Create audit log entry
    const auditLog = await base44.asServiceRole.entities.VisitAuditLog.create({
      visit_id: event.entity_id,
      admin_email: user.email,
      changed_fields: changedFields,
      old_values: oldValues,
      new_values: newValues,
      timestamp: new Date().toISOString()
    });

    console.log(`Visit audit logged: ${event.entity_id} by ${user.email}, fields: ${changedFields.join(', ')}`);
    return Response.json({
      success: true,
      audit_log_id: auditLog.id,
      changed_fields: changedFields
    });
  } catch (error) {
    console.error('Visit audit log error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});