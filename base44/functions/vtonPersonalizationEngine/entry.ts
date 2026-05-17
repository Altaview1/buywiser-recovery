import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Personalization Engine
 * Merge variables into SMS, email, and direct mail templates
 * Handles {{first_name}}, {{property_address}}, {{estimated_benefit}}, etc.
 */

const MERGE_VARIABLES = {
  first_name: 'lead.first_name',
  last_name: 'lead.last_name',
  property_address: 'lead.property_address',
  city: 'lead.city',
  state: 'lead.state',
  zip_code: 'lead.zip_code',
  listing_price: 'lead.listing_price',
  estimated_benefit: 'lead.estimated_benefit',
  listing_date: 'lead.listing_date'
};

function resolvePath(obj, path) {
  return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

function personalize(template, lead) {
  let result = template;
  
  for (const [variable, path] of Object.entries(MERGE_VARIABLES)) {
    const value = resolvePath({ lead }, path);
    const placeholder = `{{${variable}}}`;
    
    if (value) {
      if (variable === 'estimated_benefit') {
        result = result.replace(new RegExp(placeholder, 'g'), `$${Number(value).toLocaleString()}`);
      } else if (variable === 'listing_price') {
        result = result.replace(new RegExp(placeholder, 'g'), `$${Number(value).toLocaleString()}`);
      } else if (variable === 'listing_date') {
        result = result.replace(new RegExp(placeholder, 'g'), new Date(value).toLocaleDateString());
      } else {
        result = result.replace(new RegExp(placeholder, 'g'), String(value));
      }
    }
  }
  
  return result;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }
    const { lead_id, template, template_type } = await req.json();

    if (!lead_id || !template) {
      return Response.json({ error: 'Missing lead_id or template' }, { status: 400 });
    }
    const leads = await base44.entities.VTONLead.filter({ id: lead_id });

    if (leads.length === 0) {
      return Response.json({ error: 'Lead not found' }, { status: 404 });
    }

    const lead = leads[0];
    const personalized = personalize(template, lead);

    return Response.json({
      status: 'success',
      lead_id,
      template_type,
      original_template: template,
      personalized_content: personalized,
      merge_variables_used: Object.keys(MERGE_VARIABLES)
    });
  } catch (error) {
    console.error('Personalization error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});