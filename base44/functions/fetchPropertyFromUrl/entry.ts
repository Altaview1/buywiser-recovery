import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { url } = await req.json();

  if (!url) return Response.json({ error: 'No URL provided' }, { status: 400 });

  const isValidUrl = url.includes('zillow.com') || url.includes('redfin.com') || url.includes('realtor.com') || url.includes('trulia.com');
  if (!isValidUrl) {
    return Response.json({ error: 'Please paste a Zillow, Redfin, Realtor.com, or Trulia listing URL.' }, { status: 400 });
  }

  // Extract address hint from Zillow URL slug if present
  const slugMatch = url.match(/homedetails\/([^/]+)\//);
  const addressHint = slugMatch ? slugMatch[1].replace(/-/g, ' ') : '';

  const prompt = `Search the web for this real estate listing and extract property details.

URL: ${url}
${addressHint ? `Address hint from URL: ${addressHint}` : ''}

Search for this specific property listing on Zillow, Redfin, or via real estate data sources. 
Return ONLY a valid JSON object (no markdown, no code blocks) with these exact fields:
{
  "address": "full street address",
  "city": "city name",
  "state": "state abbreviation",
  "zip": "zip code",
  "price": 1250000,
  "beds": 4,
  "baths": 3,
  "sqft": 2400,
  "status": "For Sale",
  "property_type": "Single Family Home",
  "image_url": null,
  "year_built": 2005,
  "description": "brief 1-sentence description of the home"
}

Price must be a number (no commas/dollar signs). Use null for unavailable fields. Return raw JSON only.`;

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    add_context_from_internet: true,
    model: 'gemini_3_1_pro',
    response_json_schema: {
      type: "object",
      properties: {
        address: { type: "string" },
        city: { type: "string" },
        state: { type: "string" },
        zip: { type: "string" },
        price: { type: "number" },
        beds: { type: "number" },
        baths: { type: "number" },
        sqft: { type: "number" },
        status: { type: "string" },
        property_type: { type: "string" },
        image_url: { type: "string" },
        year_built: { type: "number" },
        description: { type: "string" }
      }
    }
  });

  // If result is null or has no address, try a fallback with just the address hint
  if (!result || !result.address) {
    if (addressHint) {
      const fallback = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Find real estate data for this property: "${addressHint}". Return a JSON object with: address, city, state, zip, price (number), beds (number), baths (number), sqft (number), status, property_type, year_built (number), description. Use null for unknown fields. Raw JSON only, no markdown.`,
        add_context_from_internet: true,
        model: 'gemini_3_1_pro',
        response_json_schema: {
          type: "object",
          properties: {
            address: { type: "string" },
            city: { type: "string" },
            state: { type: "string" },
            zip: { type: "string" },
            price: { type: "number" },
            beds: { type: "number" },
            baths: { type: "number" },
            sqft: { type: "number" },
            status: { type: "string" },
            property_type: { type: "string" },
            image_url: { type: "string" },
            year_built: { type: "number" },
            description: { type: "string" }
          }
        }
      });
      return Response.json({ property: fallback });
    }
    return Response.json({ error: 'Could not retrieve property data. Zillow may be blocking access. Try a Redfin link instead.' }, { status: 422 });
  }

  return Response.json({ property: result });
});