# 🚀 VTON Lob Mailing - Quick Start

## Production Checklist (TL;DR)

### ✅ 1. Update API Key
- Get **LIVE** key from [Lob Dashboard](https://dashboard.lob.com/settings/api-keys)
- Must start with `live_` (NOT `test_`)
- Update in Base44: **Dashboard → Settings → Environment Variables → LOB_API_KEY**

### ✅ 2. Approve Template
- Go to `/vton-letter-review`
- Preview template with test lead
- Click **"Approve Template"**

### ✅ 3. Test First
- Import 5-10 test leads
- Verify letters arrive in 2-5 days
- Check QR codes scan correctly

### ✅ 4. Go Live
- Bulk import triggers mail automatically
- Monitor at `/vton-campaign`
- Track in [Lob Dashboard](https://dashboard.lob.com)

---

## How It Works

```
Lead Imported → Template Personalized → Lob API → Mail Sent (2-5 days)
```

**Cost:** ~$0.60-$1.00 per letter (postage + printing)

---

## Key Functions

| Function | Purpose |
|----------|---------|
| `sendVTONWelcomeLetter` | Sends individual welcome letter |
| `vtonDirectMailQueue` | Queues mail for lead (called by bulk import) |
| `vtonBulkImportPropertyRadar` | Bulk imports + auto-triggers mail |

---

## Template Variables

```
${first_name}      → "John"
${last_name}       → "Smith"
${property_address} → "123 Main St"
${city}            → "Los Angeles"
${state}           → "CA"
${zip_code}        → "90210"
${estimated_benefit} → "$50,000"
${qrUrl}           → Auto-generated QR code
```

---

## Common Issues

| Error | Fix |
|-------|-----|
| "LOB_API_KEY not configured" | Update secret in Base44 settings |
| "Letter template not approved" | Approve template at `/vton-letter-review` |
| "Missing required address fields" | Ensure lead has property_address, city, state, zip |

---

## Monitoring

**Base44:**
- `/vton-campaign` → Lead status, `direct_mail_sent` field

**Lob:**
- [Dashboard](https://dashboard.lob.com) → Usage, costs, delivery status

---

## Support Docs

- 📋 [Full Production Checklist](./VTON_LOB_PRODUCTION_CHECKLIST.md)
- 🎨 [Template Formatting Guide](./VTON_LETTER_TEMPLATE_GUIDE.md)
- 📖 [Lob API Docs](https://docs.lob.com)