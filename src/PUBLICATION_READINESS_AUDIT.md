# Publication Readiness Audit - Buywiser VTON System

**Date:** 2026-05-06  
**Status:** ⚠️ ISSUES IDENTIFIED — See Critical Gaps Below

---

## AUTOMATIONS VERIFIED (9 Total)

✅ **Entity Automations (6)**
1. `Send Homeowner Confirmation on Scan` → ActivatorLead QUALIFIED → notifyQRScanHomeowner (WORKING)
2. `New Contact Submission - Office Notification` → ContactSubmission CREATE → notifyNewContactSubmission (READY)
3. `Activator Visit Logged - Trigger Payment` → Visit CREATE → notifyVisitLogged (READY)
4. `Lead Status Change - Notify All` → Lead UPDATE → notifyOnAnyChange (READY)
5. `New Lead Created - Send Notifications` → Lead CREATE → onNewLead (READY)
6. `Trigger Attendance Payment on Benefit Review Attended` → ActivatorLead benefit_review_status=ATTENDED → triggerAttendancePayment (READY)

✅ **Scheduled Automations (3)**
1. `Daily Lead Follow-Up Reminders` → Daily 02:00 Bangkok → dailyLeadFollowUpReminder (ACTIVE)
2. `Forfeit Stale VTON Opportunities` → Every 6 hours → forfeitStaleOpportunities (⚠️ FAILED on last run)
3. `Weekly Partner Performance Report` → Weekly Mondays 01:00 → weeklyPartnerReport (READY)

✅ **Additional Entity Automations Found (3)**
1. `Notify Rep on New Lead` → ActivatorLead CREATE (rep_code exists) → notifyRepNewLead (WORKING)
2. `Notify Partner on New Opportunity` → VTONOpportunity CREATE → notifyPartnerNewOpportunity (READY)
3. `Sync VTON Status to Lead` → VTONOpportunity UPDATE → syncLeadStatusFromOpportunity (READY)

---

## CRITICAL GAPS IDENTIFIED

### 🔴 Gap 1: ActivatorPayment Status Changes → No Automation
**Trigger Event:** ActivatorPayment transitions (PENDING → APPROVED, APPROVED → PAID, PENDING → REJECTED)  
**Current Automation:** NONE  
**Expected Functions:**
- Payment APPROVED: notify field rep via SMS (triggerActivatorPayout or custom SMS)
- Payment PAID: Send confirmation email + SMS
- Payment REJECTED: Send rejection reason + SMS

**Impact:** Field activators won't be notified of payment decisions.  
**Fix Required:** Create entity automation(s) on ActivatorPayment status updates.

---

### 🔴 Gap 2: VTONOpportunity FORFEITED → No Partner Notification
**Trigger Event:** VTONOpportunity status changes to FORFEITED (timeout or manual decline)  
**Current Automation:** NONE (forfeitStaleOpportunities runs but doesn't notify partner)  
**Expected Function:** notifyPartnerForfeited or send partner decline notification  
**Impact:** Partners won't know they lost an opportunity.  
**Fix Required:** Add automation to notify partner when opportunity is forfeited.

---

### 🔴 Gap 3: VTONOpportunity Reassignment → No Notification
**Trigger Event:** VTONOpportunity reassigned (needs_reassignment=true → new partner_email)  
**Current Automation:** NONE  
**Expected Function:** notifyPartnerNewOpportunity (could reuse) OR custom reassignment notification  
**Impact:** New partner won't know they've been assigned a forfeited opportunity.  
**Fix Required:** Create automation to notify new partner on reassignment.

---

### 🟡 Gap 4: ActivatorLead CLOSED with Outcome → Inconsistent Notifications
**Status Transitions:**
- QUALIFIED → SCHEDULED → CLOSED (no_answer) → No function mapped
- SCHEDULED → COMPLETED → CLOSED (converted) → Which function notifies partner?
- SCHEDULED → NO_SHOW → CLOSED → No notification mapped

**Current Automations:** Based on ActivatorLead QUALIFIED status only.  
**Expected:** Functions for lead close outcomes (notifyLeadClosedRefund, notifyNotInterested exist but not wired)  
**Impact:** Partner/admin may not get outcome notifications consistently.  
**Fix Required:** Map all lead closure scenarios to appropriate notification functions.

---

### 🟡 Gap 5: Partner Application Quiz Completion → No Workflow
**Function Exists:** notifyQuizCompleted  
**Current Automation:** Found but may not be fully wired  
**Expected:** Auto-trigger interview booking or approval workflow  
**Impact:** New partner applications may stall after quiz completion.  
**Fix Required:** Verify automation exists and quiz completion triggers next stage.

---

### 🟡 Gap 6: Forfeit Stale Opportunities - Job Failing
**Automation:** "Forfeit Stale VTON Opportunities"  
**Status:** ⚠️ FAILED on 2026-05-06 11:02:24  
**Function:** forfeitStaleOpportunities  
**Impact:** Opportunities not auto-forfeiting after 48 hours → partners could hold indefinitely  
**Fix Required:** Debug function, check error logs, verify database access.

---

## NOTIFICATION FUNCTIONS INVENTORY

### ✅ Wired & Active (Email/SMS)
- notifyQRScanHomeowner (ActivatorLead QUALIFIED)
- notifyNewContactSubmission (ContactSubmission CREATE)
- notifyVisitLogged (Visit CREATE)
- onNewLead (Lead CREATE)
- notifyRepNewLead (ActivatorLead CREATE)
- notifyPartnerNewOpportunity (VTONOpportunity CREATE)
- dailyLeadFollowUpReminder (Scheduled daily)
- weeklyPartnerReport (Scheduled weekly)

### ⚠️ Function Exists But Not Clearly Wired
- triggerActivatorPayout (Payment workflow?)
- triggerAttendancePayment (Benefit review attended - wired)
- notifyLeadClosedRefund (When is this called?)
- notifyLeadSMS (Generic SMS - when triggered?)
- notifyNotInterested (Lead outcome notification - not clearly mapped)
- notifyOfficeLeadClosed (When lead closes - automation missing?)
- notifyQuizCompleted (Partner quiz - automation status unclear)
- notifyReservedConsultation (When consultation reserved - automation missing?)
- sendLeadConfirmationEmail (Lead confirmation - automation missing?)
- thankHomeownerOnVerified (When homeowner verifies - automation missing?)
- syncLeadStatusFromOpportunity (Update sync - automation found)

### 🔴 Functions Created But Never Called
- bookInterviewSlot (Partner interview booking)
- issueCouponWithAppointment (Coupon issuance)
- analyzeFieldActivatorMetrics (Performance analysis)
- bulkCreateOpportunities (Bulk opportunity import)
- createVerifiedDoorPayment (Verified door payment)
- geocodeLeadAddresses (Lead geocoding)
- getMapsConfig (Maps configuration)
- scheduleHomeownerConsultation (Schedule consultation)
- sendVerificationEmail (Verification emails)
- verifyPartner (Partner verification)
- fetchPropertyFromUrl (Property data fetching)

---

## API CONNECTIONS CHECK

### ✅ Secrets Configured
- GOOGLE_MAPS_API_KEY (for geocoding)
- RESEND_API_KEY (for emails)
- TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN + TWILIO_FROM_NUMBER (for SMS)
- BENNETT_PHONE + bennettphonenumber (for phone-based notifications)

### ✅ OAuth Connectors Authorized
- Google Calendar (authorized, webhooks enabled for events)

### ⚠️ Potential Issues
1. **Missing error handling in notification functions** → If Twilio/Resend fails, does it retry?
2. **Email recipients hardcoded?** → Verify bennett@buywiser.com isn't sole recipient
3. **SMS rate limiting** → No check for bulk SMS avoiding Twilio throttling
4. **Email templates** → No template versioning if changes needed mid-campaign

---

## CRITICAL BEFORE PUBLICATION

### Must Fix (Blocking Issues)
1. **Debug forfeitStaleOpportunities** - Function is failing and 48h timeout won't work
2. **Create ActivatorPayment automations** - Payment decisions must notify field reps
3. **Create VTONOpportunity FORFEITED notification** - Partners must know when they lose opportunities
4. **Create Reassignment notification** - New partners must be notified of inherited opportunities
5. **Map lead closure outcomes** - CLOSED statuses need clear notification paths

### Should Fix (Quality Issues)
1. Clarify which functions are called and when (many exist but flow unclear)
2. Add error handling & retry logic to critical notification paths
3. Test all email/SMS in staging before production
4. Verify phone numbers are correct across all functions
5. Create dead letter queue for failed notifications

### Review (Best Practice)
1. Email recipient list - ensure multiple stakeholders get critical notifications
2. SMS frequency - avoid spamming partners with duplicate messages
3. Notification timing - consider partner timezone vs Bangkok (user's TZ)
4. Escalation paths - what happens if critical notifications fail?

---

## RECOMMENDATION

**Status: NOT READY FOR PUBLICATION**

The app has solid core functionality but notification/automation wiring has **5 critical gaps** and **1 failing scheduled job** that will break partner experience.

**Priority Path:**
1. Fix forfeitStaleOpportunities (blocking 48h window)
2. Add ActivatorPayment automations (field rep experience)
3. Add VTONOpportunity FORFEITED notification (partner accountability)
4. Add reassignment notification (new partner onboarding)
5. Map lead closure scenarios (data completeness)

**Estimated Fix Time:** 2-3 hours for a developer who understands the business logic.

Once fixed, recommend full end-to-end test: Create ActivatorLead → Create VTONOpportunity → Verify all notifications fire correctly.