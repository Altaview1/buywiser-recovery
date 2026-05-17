# ⚡ QUICK TROUBLESHOOTING GUIDE

## 🚨 Common Issues & Fixes

### 1. Meta Sync Failing (syncMetaCustomAudience)
**Error:** "2 consecutive failures"  
**Fix:**
```
Dashboard → Settings → Environment Variables
→ Refresh META_ACCESS_TOKEN from Meta Business Platform
→ Re-run automation manually
```
**Time to fix:** 2 minutes

---

### 2. Route Not Showing in Hamburger Menu
**Check:**
- Is route defined in App.jsx? (Required)
- Is route added to AdminNavMenu.jsx? (For visibility)
- Clear browser cache (Ctrl+Shift+Del)

---

### 3. API Key Errors (PropertyRadar, Lob, Twilio)
**Check:**
- Dashboard → Settings → Environment Variables
- Verify all required secrets present:
  - PROPERTY_RADAR_API_KEY ✅
  - LOB_API_KEY ✅
  - TWILIO_ACCOUNT_SID ✅
  - TWILIO_AUTH_TOKEN ✅
  - TWILIO_API_KEY ✅
  - TWILIO_FROM_NUMBER ✅
  - RESEND_API_KEY ✅
  - META_ACCESS_TOKEN ✅

---

### 4. Mobile Dashboard SMS/Call Not Working
**Check:**
- Device has phone capability (mobile/desktop doesn't differ in link generation)
- Phone number format is correct (should be E.164: +1234567890)
- Test with actual lead record

---

### 5. Automation Not Running
**Check:**
1. Automation is active (not paused)
2. Correct time zone conversion (Your tz: Asia/Bangkok = UTC+7)
3. Check "Last Run" status in list_automations
4. Manual trigger available in dashboard if needed

---

### 6. PropertyRadar Drill-Down Hanging
**Fix:**
- Go to `/property-radar`
- Click "Refresh" button
- Wait 10-15 seconds (API can be slow)
- If still hanging, check API key renewal

---

### 7. Lob Letters Not Syncing Status
**Check:**
- Automation `pollLobStatusUpdates` is active (runs daily 2 AM)
- Lob webhook registered in Lob dashboard
- Check `/vton-lob-errors` for specific failures

---

### 8. Email Not Sending
**Check:**
- RESEND_API_KEY is valid
- Recipient email is in valid format
- Check automation run logs for errors
- Verify `sendMeetingConfirmationEmail` automation is active

---

### 9. CSV Export Not Working on Mobile
**Fix:**
- Use Chrome/Firefox (Safari may have issues)
- Check browser storage permissions
- Try on desktop first to verify data quality

---

### 10. Field Rep Can't Login to Portal
**Check:**
- Is email registered as FieldActivator?
- Status = 'active' (not 'inactive')?
- Check authentication gate in FieldActivatorPortal.jsx

---

## 🧪 QUICK VERIFICATION TESTS

### Test PropertyRadar Connection (2 min)
```
1. Navigate to /property-radar
2. Click "Refresh"
3. Should show DOM buckets with counts
4. Try drilling into 0-7 day bucket
```
**Expected:** Bucket shows 5-20 leads with addresses

---

### Test Lob Integration (2 min)
```
1. Navigate to /vton-mail-dashboard
2. Look for "Letter Pipeline" card
3. Should show pending, mailed, delivered counts
4. Try navigating to /vton-lob-errors
```
**Expected:** Dashboards load with real data (may show 0 if no letters sent yet)

---

### Test Twilio SMS (30 sec)
```
1. Navigate to /mobile-leads
2. Find any lead with phone number
3. Verify SMS button is visible
4. (In browser) SMS link format: sms:+1234567890
```
**Expected:** SMS button appears, click opens SMS app

---

### Test Email Trigger (5 min)
```
1. Go to Admin Dashboard
2. Find any ActivatorLead
3. Change pipeline_stage to 'meeting_set'
4. Check admin email for confirmation
```
**Expected:** Email arrives within 30 seconds with homeowner name + meeting details

---

### Test Security Scan (Check Logs)
```
1. Next Monday 12:00 AM (Bangkok time)
2. Check ADMIN_NOTIFICATION_EMAIL inbox
3. Look for "Weekly Security Scan Report"
4. Verify no hardcoded secrets found
```
**Expected:** Email with scan results + auto-fix summary

---

## 📞 SUPPORT ESCALATION

If issue persists after troubleshooting:

1. **Check logs:** Dashboard → Functions → [function_name] → Logs
2. **Verify secrets:** Settings → Environment Variables (don't share publicly)
3. **Check automations:** Dashboard → Automations → [automation_name] → Run history
4. **Manual re-run:** Some automations can be triggered manually in dashboard

---

## 🔄 Weekly Maintenance Checklist

- [ ] Monday 12:00 AM: Security scan runs (check email)
- [ ] Monday 2:00 AM: Weekly lead summary (check email)
- [ ] Daily 1:00 AM: PropertyRadar count sync (verify `/property-radar` updates)
- [ ] Daily 2:00 AM: Lob status sync (check `/vton-mail-dashboard`)
- [ ] Daily 3:00 AM: Meta audience sync (⚠️ currently failing, needs token refresh)

---

**Last Updated:** 2026-05-17  
**Next Review:** 2026-05-24