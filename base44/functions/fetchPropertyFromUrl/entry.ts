import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { url } = await req.json();

  if (!url) return Response.json({ error: 'No URL provided' }, { status: 400 });

  const isValidUrl = url.includes('zillow.com') || url.includes('redfin.com') || url.includes('realtor.com') || url.includes('trulia.com');
  if (!isValidUrl) {
    return Response.json({ error: 'Please paste a Zillow, Redfin, Realtor.com, or Trulia listing URL.' }, { status: 400 });
  }

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt: `Visit this real estate listing URL and extract property details: ${url}

Return ONLY a JSON object with these exact fields:
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
  "image_url": "https://... (the main listing photo URL if available, else null)",
  "year_built": 2005,
  "description": "brief 1-sentence description of the home"
}

If a field is not available, use null. Price should be a number without commas or dollar signs. Return raw JSON only, no markdown.`,
    add_context_from_internet: true,
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

  return Response.json({ property: result });
});