# VTON Lob Mailing - Production Checklist

## ✅ Step 1: Update Lob API Key to LIVE

**CRITICAL:** You must switch from test to live API key for production mailing.

1. Go to [Lob Dashboard Settings](https://dashboard.lob.com/settings/api-keys)
2. Copy your **LIVE API Key** (starts with `live_`, NOT `test_`)
3. In your Base44 app:
   - Go to **Dashboard → Settings → Environment Variables**
   - Update `LOB_API_KEY` secret with the live key
   - Save changes

**⚠️ Warning:** Live API key charges real money for each mail piece sent!

---

## ✅ Step 2: Approve Your Letter Template

Before any mail can be sent, you must have an approved HTML template.

1. Go to **VTON Letter Template Review** page (`/vton-letter-review`)
2. Review/edit the default HTML template
3. **Test it first:**
   - Enter a test lead ID (or use sample data)
   - Click "Send Test Email" to preview how it looks
4. Once satisfied, click **"Approve Template"**
   - This sets `is_approved: true` in `VTONMailConfig`
   - Only approved templates can be used for mailing

**Template Requirements:**
- Size: 6x11 inches (standard letter)
- HTML format (already configured)
- Must include personalization variables:
  - `${first_name}`, `${last_name}`
  - `${property_address}`, `${city}`, `${state}`, `${zip_code}`
  - `${estimated_benefit}`
  - `${qrUrl}` (auto-generated QR code)

---

## ✅ Step 3: Test with Real Addresses

Before full production rollout:

1. Import a small batch of test leads (5-10) via **VTON Campaign Dashboard**
2. Send welcome letters to verify:
   - ✅ Address formatting is correct
   - ✅ Personalization works (names, property details)
   - ✅ QR code scans correctly
   - ✅ Delivery timing (Lob takes 2-5 business days)
   - ✅ Print quality

**Test Process:**
```bash
# Use the sendVTONWelcomeLetter function
# In Base44 Dashboard → Code → Functions → sendVTONWelcomeLetter
# Test with payload: {"leadId": "YOUR_TEST_LEAD_ID"}
```

---

## ✅ Step 4: Configure Return Address

Your return address is already set in the code:

```
Buywiser Home Loans
12640 Riverside Drive
North Hollywood, CA 91607
```

If you need to change it:
- Edit `functions/vtonDirectMailQueue`
- Update the `from[...]` fields in the Lob API call
- Ensure it matches your official business address

---

## ✅ Step 5: Set Up Webhooks (Optional but Recommended)

Track mail delivery status automatically:

1. In [Lob Dashboard](https://dashboard.lob.com), go to **Settings → Webhooks**
2. Add webhook endpoint:
   - URL: Your Base44 backend function URL (create `functions/lobWebhook.js`)
   - Events: `letter.created`, `letter.rendered`, `letter.mailed`, `letter.delivered`
3. Create webhook handler function to update `VTONLead` records

**Example webhook handler:**
```javascript
// functions/lobWebhook.js
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const event = await req.json();
  
  if (event.event === 'letter.delivered') {
    // Update lead record with delivery confirmation
    await base44.asServiceRole.entities.VTONLead.update(event.lead_id, {
      direct_mail_delivered: true,
      direct_mail_delivery_date: new Date().toISOString()
    });
  }
  
  return Response.json({ success: true });
});
```

---

## ✅ Step 6: Go Live!

Once testing is complete:

1. **Enable automated mailing:**
   - Mails are sent automatically when leads are imported (via `vtonBulkImportPropertyRadar`)
   - Or manually trigger via **VTON Campaign Dashboard**

2. **Monitor costs:**
   - Check [Lob Dashboard](https://dashboard.lob.com) for usage
   - Current pricing: ~$0.60-$1.00 per letter (postage + printing)

3. **Track delivery:**
   - Use Lob dashboard to monitor mail status
   - Leads show `direct_mail_sent: true` after successful send

---

## 📊 Production Monitoring

**Daily Checks:**
- ✅ Review `VTONCampaignDashboard` for mail status
- ✅ Check Lob dashboard for delivery rates
- ✅ Monitor for failed sends (invalid addresses)

**Weekly Reports:**
- Total letters sent
- Delivery success rate
- Cost per letter

---

## 🆘 Troubleshooting

**"LOB_API_KEY not configured"**
- Update the secret in Base44 Dashboard → Settings → Environment Variables

**"Letter template not approved"**
- Go to `/vton-letter-review` and approve a template

**Lob API errors:**
- Check [Lob error codes](https://docs.lob.com/#tag/Errors)
- Common issues: invalid address, insufficient balance, template errors

**Address validation:**
- Consider adding Lob's Address Verification API before sending
- Reduces undeliverable mail

---

## 📞 Support

- **Lob Support:** [help.lob.com](https://help.lob.com)