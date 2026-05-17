# VTON Campaign — Architecture Reference
> **DO NOT MODIFY THIS FILE** — This is a preserved reference document.  
> Use this as a blueprint when building out the SmartBuy Buyer Pipeline.  
> Last updated: 2026-05-17

---

## 1. What VTON Is
**Veteran's Transition Opportunity Network (VTON)**  
A direct outreach campaign targeting veteran homeowners (VA loan holders) who are actively selling in California. The pipeline identifies them via PropertyRadar, contacts them via direct mail (Lob), email (Resend), and SMS (Twilio), and books them into a "Veteran's Next Home Benefit Review" consultation.

**Core distinction:** VTON is a SELLER pipeline (veteran is the seller). Not to be confused with SmartBuy (buyer pipeline).

---

## 2. Entity Structure

### Primary Entity: `VTONLead`
The central record for every veteran prospect. Key fields:
- `first_name`, `last_name`, `phone`, `email`
- `property_address`, `city`, `state`, `zip_code`
- `listing_date`, `listing_price`, `estimated_equity`
- `veteran_indicator`, `likely_va_loan_indicator`
- **Mail tracking:** `mail_approval_status`, `lob_letter_id`, `lob_delivery_status`, `lob_error_resolved`, `lob_last_updated`, `lob_delivery_date`, `lob_estimated_cost`
- **Outreach status:** `sms_status`, `email_status`, `facebook_audience_synced`, `direct_mail_sent`
- **Campaign pipeline:** `campaign_stage`, `contact_status`, `suppression_status`
- **Scoring:** `contact_priority_score`, `estimated_benefit`
- **Attribution:** `import_batch_id` (tracks which import session created this lead)

### Supporting Entities
- `VTONMailConfig` — Stores the approved HTML letter template (one active record)
- `VTONEmailLog` — Logs every email sent (type, status, lead reference)
- `VTONOpportunity` — Partner-assigned opportunities derived from VTON leads (separate from leads)
- `PropertyRadarDailySnapshot` — Daily counts of active CA VA listings (total pool + new listings)

---

## 3. Data Ingestion Pipeline

### Source: PropertyRadar API
- **Criteria:** State=CA, FirstLoanType=V (VA), ListingStatus=Active, DaysOnMarket=[1,90]
- **Fields used:** Grid fieldset + RadarID, State, ZipFive, FirstPurpose, FirstLoanType, ListingPrice, DaysOnMarket, TotalLoanBalance, OwnerFirstName, OwnerLastName
- **Purchase mode:** `Purchase=0` for preview (no billing), `Purchase=1` for live

### Import Functions
- `importPropertyRadarOpportunities` — Full import → creates `VTONOpportunity` records with round-robin partner assignment
- `vtonBulkImportPropertyRadar` — Bulk import → creates `VTONLead` records
- `vtonPropertyRadarAdapter` — Adapter layer for field mapping
- `fetchPropertyRadarLeads` — Raw fetch utility
- `testPropertyRadarImport` — Test/preview mode

### Deduplication
- On `VTONLead`: uses `property_address` (lowercased, trimmed)
- On `VTONOpportunity`: same address check against existing records
- `import_batch_id` on VTONLead tracks batches for bulk delete

### Daily Monitoring
- `dailyPropertyRadarCount` — Scheduled daily; fetches pool count + new listings; upserts `PropertyRadarDailySnapshot`
- `dailyPropertyRadarSummary` — Emails admin a summary report
- Dashboard: `/property-radar` — Charts the snapshot history, shows drill-down by DOM bucket

---

## 4. Outreach Channels

### Direct Mail (Lob)
- **Flow:** Lead created → `mail_approval_status = pending_approval` → Admin reviews in `/vton-mail-dashboard` → Approves → `vtonDirectMailQueue` sends to Lob → Lob returns `letter_id`
- **Template:** HTML stored in `VTONMailConfig.letter_html`; personalized server-side with veteran name, address, benefit estimate
- **Tracking:** `lobWebhookHandler` receives Lob delivery webhooks → updates `lob_delivery_status`, `lob_last_updated`, `lob_delivery_date`
- **Error handling:** `/vton-lob-errors` dashboard shows failed/returned/cancelled letters
- **Cost tracking:** `lob_estimated_cost` per lead; dashboard shows total spend

### Email (Resend)
- `sendVTONWelcomeLetter` — Sends personalized welcome email to veteran
- `sendVTONTestEmail` — Test email to admin before campaign launch
- All sends logged to `VTONEmailLog` entity
- History viewable at `/vton-email-history`

### SMS (Twilio)
- `sendSMS` — Generic SMS sender
- `twilioInboundSMS` — Handles inbound replies; routes to suppression or response logic
- `vtonRapidResponse` — Auto-response sequences

### Meta/Facebook
- `syncMetaCustomAudience` / `vtonMetaAudienceSync` — Pushes lead emails to Meta custom audience
- `META_CUSTOM_AUDIENCE_ID` + `META_ACCESS_TOKEN` secrets required

---

## 5. Partner & Field Activator Layer

### Partners (`PartnerApplication`)
- Approved partners receive `VTONOpportunity` assignments (round-robin)
- Partners view their opportunities at `/partner`
- Partners can: contact homeowner, log outcomes, forfeit opportunities, rate lead quality
- `notifyPartnerNewOpportunity` — Email notification on new assignment
- `weeklyPartnerReport` — Automated weekly summary

### Field Activators (`FieldActivator`, `ActivatorLead`)
- Physical door-knocking field reps with unique `rep_code`
- QR code on packet → homeowner scans → `/vton-scan` intake flow
- Payment: `$15 per verified door attempt` (configurable in `PayoutConfig`)
- Anti-gaming: `min_visit_duration_seconds`, `audit_flag`, `proof_photo_url`
- `createVerifiedDoorPayment` → creates `ActivatorPayment` record
- Tiers: `FIELD_ACTIVATOR` → `SENIOR_FIELD_ACTIVATOR` (promotion at 15% in-person scan rate, 50+ doors)

---

## 6. Lead Intake Flow (`/vton-scan`)

Multi-step wizard:
1. **Landing** — Rep code / property address pre-filled from URL params
2. **Contact capture** — Name, phone, email
3. **Intent qualification** — Planning to buy? Timeline? Agent commitment?
4. **Lead type classification** — MORTGAGE, FULL_STACK, or UNDECIDED
5. **Benefit overview** — Shows estimated savings pool
6. **Charity selection** — Picks charity for donation incentive
7. **Appointment scheduling** — Books benefit review

Key functions triggered:
- `notifyNewVTONLead` — Admin notified
- `sendLeadConfirmationEmail` — Confirmation to veteran
- `notifyConsultationBooked` — On appointment booking
- `calculateLeadPriorityScore` — Scores lead 0-100
- `triggerActivatorPayout` / `thankHomeownerOnVerified` — Activator payment flow

---

## 7. Behavioral / Automation Layer

- `vtonBehavioralTriggers` — Evaluates rules and fires follow-up actions
- `vtonBehavioralFollowup` — Sends follow-up messages based on engagement
- `vtonEngagementTracker` — Tracks page visits, link clicks, email opens
- `vtonListingVerification` — Verifies listing is still active
- `vtonPersonalizationEngine` — Generates personalized content per lead
- `vtonWAAVAdapter` — WAAV integration adapter
- `dailyVTONCampaignReport` — Daily admin email summary
- `dailyVTONFollowUpReminder` — Reminds team of leads needing follow-up

---

## 8. Admin Dashboard Pages

| Route | Purpose |
|-------|---------|
| `/vton-campaign` | Main campaign dashboard — import, manage, track leads |
| `/vton-mail-dashboard` | Approve/reject/send Lob direct mail |
| `/vton-letter-review` | Edit and approve the HTML letter template |
| `/vton-email-history` | View all email + Lob letter history |
| `/vton-lob-errors` | Investigate and resolve Lob delivery failures |
| `/property-radar` | Daily snapshot dashboard with DOM drill-down |
| `/vton-benefit` | Public booking page for veteran consultations |
| `/vton-personalized/:leadId` | Personalized landing page per veteran |
| `/vton-scan` | Field activator / public lead intake |
| `/vton-qr-scan-test` | Test QR scan flow without billing |
| `/vton-testimonials` | Video testimonial gallery |
| `/prospects` | Prospects pipeline view |
| `/partner-leads` | Partner-specific lead view |
| `/partner` | Partner opportunity dashboard |
| `/activator-admin` | Full admin dashboard |
| `/field-activator` | Field activator portal |
| `/field-rep-dashboard` | Field rep management |
| `/qr-scans` | QR scan activity dashboard |
| `/management-dashboard` | Executive management view |

---

## 9. Key Design Patterns to Reuse in SmartBuy

### Pattern 1: Import + Dedup + Batch Tracking
- Use `import_batch_id` on every bulk import so batches can be deleted cleanly
- Always lowercase+trim address for dedup
- Always offer preview mode (no billing) before live import

### Pattern 2: Approval Queue Before External Actions
- Never send mail/SMS/email directly — always go through an approval step first
- Use a status enum: `pending_approval → approved → sent` (or `rejected`)
- Admin reviews in a dashboard before anything goes out

### Pattern 3: Webhook-Driven Status Updates
- External service (Lob, Twilio, Meta) sends webhook → backend function updates entity
- Keep delivery status in the entity itself (not just in the external system)
- Log errors with `lob_error_resolved` flag so admin can track resolution

### Pattern 4: Priority Scoring
- Score leads 0-100 on intake based on signals (veteran status, DOM, equity, engagement)
- Surface high-priority leads first in admin views
- `calculateLeadPriorityScore` function — adapt the scoring logic for SmartBuy buyer signals

### Pattern 5: Multi-Channel Outreach Logging
- Every outbound action (email, SMS, mail) gets a log record
- Log: recipient, type, status, timestamp, error message
- Never rely on external system alone for status — mirror it locally

### Pattern 6: Suppression Before Any Outreach
- Check `suppression_status` before sending
- Respect `do_not_contact`, `unsubscribed`, `complaint` statuses
- Twilio inbound SMS handler updates suppression automatically

### Pattern 7: Round-Robin Assignment
- Fetch all eligible assignees, sort consistently, use `index % count`
- Store assignment on the record so it's auditable
- Notify assignee immediately on assignment

### Pattern 8: Entity-Driven Automation
- Use entity automations (create/update triggers) for immediate reactions
- Use scheduled automations for daily/weekly digest reports
- Keep function logic small and single-purpose

---

## 10. Secrets Used by VTON

| Secret | Purpose |
|--------|---------|
| `PROPERTY_RADAR_API_KEY` | PropertyRadar API access |
| `LOB_API_KEY` | Lob direct mail API |
| `RESEND_API_KEY` | Email sending |
| `TWILIO_ACCOUNT_SID` | Twilio SMS |
| `TWILIO_AUTH_TOKEN` | Twilio auth |
| `TWILIO_API_KEY` | Twilio API key |
| `TWILIO_FROM_NUMBER` | Twilio sender number |
| `META_ACCESS_TOKEN` | Meta/Facebook Ads API |
| `META_CUSTOM_AUDIENCE_ID` | Meta custom audience |
| `BENNETT_PHONE` | Admin notification phone |
| `ADMIN_NOTIFICATION_EMAIL` | Admin notification email |

---

## 11. SmartBuy Adaptation Notes
> Fill these in when starting the SmartBuy build.

- [ ] **Lead source:** PropertyRadar (seller) → _SmartBuy: Zillow/Redfin scrape or buyer form intake_
- [ ] **Lead entity:** `VTONLead` → _SmartBuy: `SmartBuyLead` already exists_
- [ ] **Outreach:** Lob mail + Resend + Twilio → _SmartBuy: Email only (buyers are inbound, not cold outreach)_
- [ ] **Approval queue:** Mail approval → _SmartBuy: Token unlock approval / service booking approval_
- [ ] **Partner layer:** VTON Partners → _SmartBuy: Expert network (Compass, KW, Bennett's team)_
- [ ] **Field layer:** Field Activators → _SmartBuy: N/A (no door-knocking in buyer pipeline)_
- [ ] **Scoring:** Priority score (veteran signals) → _SmartBuy: Buyer readiness score (pre-approval, timeline, property link)_
- [ ] **Dashboard:** `/vton-campaign` pattern → _SmartBuy: `/smartbuy-workflow` + admin view TBD_
- [ ] **Savings tracking:** N/A in VTON → _SmartBuy: SAVE-o-Meter, token pool, stage completion_