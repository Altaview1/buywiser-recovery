# Entity Branching Logic: Buywiser Multi-Sided Marketplace
> **Executive Summary for Investors**  
> A three-sided marketplace connecting field activation teams, real estate partners, and veteran homeowners. Revenue streams: per-door-attempt payments (field ops), lead assignment commissions (partner network), and direct consumer services (homeowner consulting).

---

## Business Model Overview

**Thesis:** Buywiser captures value across the VA mortgage refinance funnel by aggregating supply (verified leads), incentivizing distribution (field activators), and monetizing demand (partner agents + direct consulting).

**Three Revenue Streams:**
1. **Field Operations** ($15/verified door attempt) — Door-knock verification + lead capture
2. **Partner Network** (commission on closed deals) — Lead assignment + follow-up support
3. **Direct Consumer** (booking fees) — Benefit review consultations booked directly by homeowners

---

## Architecture: Three Parallel User Workflows

### **FLOW 1: FIELD ACTIVATION NETWORK** 
*How we scale door-knock lead capture with financial incentives + audit guardrails*

**Entity Chain:** `FieldActivator` → `ActivatorLead` → `ActivatorPayment`

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIELD ACTIVATOR (Sales Rep)                   │
│ Profile: rep_code, email, phone, assigned_area, total_earnings   │
│ Tiers: FIELD_ACTIVATOR → SENIOR_FIELD_ACTIVATOR                  │
│        (Promotion at 15% in-person scan rate + 50+ doors)        │
└─────────────────────────────────────────────────────────────────┘
                              │
                     Door knocks property
                      (QR code on packet)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ACTIVATOR LEAD (Capture)                    │
│  Status: SCANNED → VERIFIED → QUALIFIED → SCHEDULED → COMPLETED  │
│  Fields: first_name, property_address, estimated_equity,         │
│          knock_attempt_confirmed, visit_duration_seconds         │
│  Pipeline Stage (Kanban): new → contacted → interested →         │
│                           meeting_set → closed                   │
│  Interaction Log: calls, emails, notes with timestamps           │
└─────────────────────────────────────────────────────────────────┘
                              │
                   Door-knock confirmed +
                  visit duration logged
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ACTIVATOR PAYMENT (Revenue)                   │
│  Type: VERIFIED_DOOR_ATTEMPT                                     │
│  Amount: $15 per verified attempt                                │
│  Status Flow:                                                    │
│    PENDING (visit ≥ 45s) → APPROVED → PAID ✓                    │
│    PENDING_AUDIT (visit < 45s) → APPROVED/REJECTED               │
│  Audit Triggers:                                                 │
│    • visit_duration < 45 seconds                                 │
│    • no_answer rate > 90% (on 10+ visits)                        │
│    • scan_rate < 5% (on 50+ visits)                              │
│    • suspicious patterns flagged by admin                        │
└─────────────────────────────────────────────────────────────────┘

UNIT ECONOMICS:
✓ Cost per payout: $15/door attempt
✓ Verification: mandatory photo proof + duration log
✓ Anti-fraud: auto-audit for suspicious patterns, manual override by admin
✓ Scaling: tier promotions incentivize quality over volume
```

**Why This Works:**
- **Incentive Alignment:** Field reps earn only on verified, quality door attempts (not bulk spam)
- **Audit Trail:** Visit duration, photo proof, and historical patterns prevent gaming
- **Scalability:** Tier structure creates career path (more earnings at SENIOR level)
- **Transparency:** Every payment has traceable ActivatorLead + photo evidence

---

### **FLOW 2: PARTNER AGENT NETWORK**
*How we distribute leads to real estate agents with accountability metrics*

**Entity Chain:** `VTONOpportunity` → `PartnerApplication` → Deal Closed

```
┌─────────────────────────────────────────────────────────────────┐
│                  VTON LEAD (Aggregated Pool)                     │
│  Source: PropertyRadar (CA, VA-financed, active listings)        │
│  Freshness: imported daily, 1-90 days on market                  │
│  Deduplication: by address + phone to prevent duplicates        │
│  Volume: ~X leads/week (PropertyRadar pool size)                │
└─────────────────────────────────────────────────────────────────┘
                              │
                  Admin assigns to partner
                     (round-robin + scoring)
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VTON OPPORTUNITY (Assignment)                 │
│  Status: ASSIGNED (48-hour decision window)                      │
│    │                                                             │
│    ├─ ACCEPTED (partner interested)                              │
│    │   ├─ CONTACTED (partner reaches homeowner)                  │
│    │   ├─ IN_PROGRESS (active conversation)                      │
│    │   ├─ CONVERSATION_VERIFIED ← metric tracked on partner      │
│    │   ├─ CONSULTATION_SCHEDULED                                 │
│    │   ├─ CLOSED_WON ✓ (deal completed, commission paid)        │
│    │   └─ CLOSED_LOST (deal fell through)                        │
│    │                                                             │
│    ├─ FORFEITED (partner declines within 48h)                    │
│    │   └─ needs_reassignment=true → office reassigns             │
│    │                                                             │
│    └─ AUTO_FORFEITED (48h timeout, no action)                    │
│        └─ needs_reassignment=true → office reassigns             │
└─────────────────────────────────────────────────────────────────┘
                              │
                  Partner converts to deal
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                PARTNER APPLICATION (Accountability)              │
│  Fields: verified_conversations (counter), conversion_rate,      │
│          avg_days_to_close, quality_feedback                    │
│  Metrics Dashboard: Leaderboard, performance ranking              │
│  Commission Structure: % of loan amount on CLOSED_WON            │
└─────────────────────────────────────────────────────────────────┘

UNIT ECONOMICS:
✓ Lead quality: PropertyRadar verified (actual VA mortgages)
✓ Accountability: verified_conversations tracked, forfeiture penalties
✓ Speed: 48-hour decision window prevents hoarding
✓ Incentives: top performers get priority assignment + higher-equity deals
```

**Why This Works:**
- **Verification Pipeline:** Only PropertyRadar leads (actual mortgage holders) = quality
- **Accountability:** Verified conversation counter + forfeiture penalties prevent abandonment
- **Network Effect:** Partners compete for prime leads (higher equity), driving quality service
- **Transparency:** Real metrics (days to close, conversion rate) visible to admin + partners

---

### **FLOW 3: ADMIN OVERSIGHT & COMPLIANCE**
*How we maintain operational integrity across field + partner network*

**Entity Chain:** `ActivatorPayment` → `Visit` → `VisitAuditLog`

```
┌─────────────────────────────────────────────────────────────────┐
│                    ACTIVATOR PAYMENT (Oversight)                 │
│  Auto-generated on every door-knock event                        │
│  Status: PENDING → {APPROVED → PAID} OR {PENDING_AUDIT → ...}   │
│                                                                 │
│  APPROVAL LOGIC:                                                │
│    if visit_duration ≥ 45s  → auto-APPROVE → PAID              │
│    if visit_duration < 45s  → flag PENDING_AUDIT               │
│                              → admin manual review              │
│                                                                 │
│  REJECTION RULES (admin override):                              │
│    • Suspicious pattern (short visit + high no-answer rate)     │
│    • Gaming attempt (visit < 15s, no photo proof)               │
│    • Repeat offender (audit flag history)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                       Admin reviews
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VISIT (Full Record)                         │
│  lead_id, activator_id, visit_date, status                      │
│  door_photo_url, homeowner_name, homeowner_phone                │
│  code_scanned (yes/no), callback_time (if scheduled)            │
│  Notes: Field rep observations                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                       Admin updates visit
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VISIT AUDIT LOG (Compliance)                  │
│  Triggered: Every Update to Visit entity                        │
│  Records: admin_email, changed_fields, old_values, new_values   │
│  Timestamp: when change was made                                │
│  Notes: reason for change                                       │
│  Purpose: Full audit trail for compliance + dispute resolution  │
└─────────────────────────────────────────────────────────────────┘

COMPLIANCE FRAMEWORK:
✓ Every payment has linked proof (photo + duration)
✓ Every update logged (VisitAuditLog)
✓ Anti-fraud: PENDING_AUDIT for suspicious patterns
✓ Dispute resolution: full edit history per visit
```

**Why This Works:**
- **Fraud Prevention:** Photo proof + duration + pattern analysis prevents gaming
- **Legal Protection:** Audit trail (VisitAuditLog) defends against rep disputes
- **Operational Visibility:** Admin dashboard shows all pending audits + rejections
- **Scalability:** Auto-approval for clean visits (≥45s) reduces admin overhead

---

## Revenue Model & Unit Economics

### **Stream 1: Field Activation** (Direct Cost Model)
```
Revenue per door attempt: $15 (paid to field rep)
Volume driver: PropertyRadar lead pool (~X/week)
Quality gate: visit_duration ≥ 45s + photo proof
Margin: Covered by partner commissions (Flow 2)
Scale: Tier promotions incentivize higher scan rates
```

### **Stream 2: Partner Commissions** (Commission Model)
```
Revenue per closed deal: X% of loan amount (negotiable)
Volume driver: CLOSED_WON opportunities
Quality gate: verified_conversations + PartnerApplication metrics
Attribution: Opportunity linked to VTON lead (trackable)
Scale: Network effects (partners compete for leads)
```

### **Stream 3: Direct Consumer** (Booking Fees)
```
Revenue per consultation: Booking fee ($X)
Volume driver: Homeowners on ActivatorLead path (pipeline_stage)
Quality gate: Qualified leads (planning_to_buy + timeline filled)
Attribution: appointment_scheduled flag on ActivatorLead
Scale: Self-serve path reduces admin overhead
```

---

## Key Metrics for Investors

### **Operational Health**
| Metric | Target | Indicator |
|--------|--------|-----------|
| Payment Approval Rate | >90% | Field ops running clean |
| Audit Rejection Rate | <5% | Fraud detection working |
| Forfeiture Rate (Partners) | <20% | Partner engagement healthy |
| Verified Conversation Rate | >40% | Partner quality improving |
| Lead-to-Booking Conversion | >15% | Sales funnel efficient |

### **Scalability Indicators**
| Indicator | Evidence |
|-----------|----------|
| Field ops scale | FIELD_ACTIVATOR → SENIOR_FIELD_ACTIVATOR tiers |
| Partner network scale | Round-robin assignment + leaderboard competition |
| Automation scale | Auto-approval (≥45s) reduces admin touch |
| Network effects | Tier promotions + forfeiture penalties drive quality |

### **Risk Mitigation**
| Risk | Mitigation |
|------|-----------|
| Field rep fraud | Photo proof + duration + audit flag + VisitAuditLog |
| Partner abandonment | 48-hour forfeit window + verified_conversations counter |
| Lead quality | PropertyRadar verification + deduplication |
| Compliance | Audit trail for every update + admin override capability |

---

## Kanban Pipeline: Visual Lead Management

**Entity:** ActivatorLead (field ops + kanban tracking)  
**UI:** `/lead-pipeline` (drag-and-drop Kanban board)

```
┌──────────┬──────────┬──────────┬─────────────┬────────┐
│   NEW    │ CONTACTED│INTERESTED│ MEETING_SET │ CLOSED │
├──────────┼──────────┼──────────┼─────────────┼────────┤
│ Lead     │ Call     │ Prospect │ Appointment │ Outcome│
│ captured │ logged   │ qualified│ confirmed   │ final  │
│ from QR  │ (notes)  │ + email  │ + reminder  │ (won/  │
│          │ + date   │ sent     │ sent        │ lost)  │
└──────────┴──────────┴──────────┴─────────────┴────────┘

Action per stage:
- NEW: Review lead profile, check contact info
- CONTACTED: Log call/email outcome, add notes
- INTERESTED: Verify qualification, schedule appointment
- MEETING_SET: Track attendance, send reminders
- CLOSED: Final outcome + feedback
```

**Why Kanban for Investors:**
- **Visibility:** Board shows entire pipeline health at a glance
- **Velocity:** Drag-drop updates `pipeline_stage` instantly (fast feedback loop)
- **Automation:** Stage transitions can trigger notifications/reminders
- **Metrics:** Stage distribution shows bottlenecks + opportunities
- **Scaling:** Same board works for 10 reps or 100 reps

---

## Competitive Advantages (Entity-Level)

| Advantage | Mechanism | Entity Evidence |
|-----------|-----------|-----------------|
| **Verified Leads** | PropertyRadar + QR scan | ActivatorLead.proof_photo_url, scan_timestamp |
| **Aligned Incentives** | $15/verified attempt + tier promotions | ActivatorPayment.status, FieldActivator.tier |
| **Transparent Metrics** | verified_conversations + audit log | PartnerApplication.verified_conversations, VisitAuditLog |
| **Fraud Prevention** | Photo proof + duration + patterns | ActivatorPayment.PENDING_AUDIT logic, VisitAuditLog |
| **Fast Assignment** | 48-hour forfeit window | VTONOpportunity.auto_forfeit_at |
| **Audit Trail** | Every update logged | VisitAuditLog.timestamp, changed_fields |

---

## Growth Path

**Year 1:** Establish field ops + partner network in CA  
- Field team: 50-100 active reps  
- Partners: 20-30 agents  
- Monthly volume: ~500-1000 verified leads  
- Unit economics: Proven + documented in VisitAuditLog  

**Year 2:** Expand to additional states + direct consumer channel  
- Same entity architecture scales across geographies  
- Kanban pipeline + audit trail transferable  
- Partner metrics (verified_conversations) create leaderboard competition  

**Year 3:** Build AI-driven lead scoring + predictive closing  
- Entity data (interaction_notes + appointment_scheduled) feeds ML model  
- Scoring informs partner assignment priority  
- Tier promotions become algorithmic  

---

## Summary: Why This Model Works

**For Field Reps:** Clear $15/attempt + transparency = low barrier to entry  
**For Partners:** Verified leads + verified conversation tracking = accountability  
**For Homeowners:** Multiple touchpoints (field, partner, direct) = guaranteed outreach  
**For Company:** Every transaction auditable + commission-based (low fixed cost)  
**For Investors:** Scalable three-sided marketplace with built-in compliance  

**Bottom Line:** Entity branching logic creates a trust layer (verification + audit trail) that enables a commission-based marketplace to function at scale. Each user role's incentives align with data capture, so the system gets better (and harder to game) as it grows.