# Entity Branching Logic - Buywiser VTON System

Three parallel user workflows: **Field Activator** (door-knocks), **Homeowner/Admin** (VTON partner opportunity), and **Admin** (payment oversight).

---

## USER FLOW 1: FIELD ACTIVATOR (ActivatorLead + Kanban Pipeline)

**User:** Field rep knocks on doors  
**Primary Entity:** ActivatorLead  
**Pipeline Field:** `pipeline_stage` (new, contacted, interested, meeting_set, closed)  
**UI Location:** `/lead-pipeline` (drag-and-drop Kanban board)  
**Origin:** QR scan at property address

```
SCANNED (initial QR capture)
  └─ knock_attempt_confirmed = true
     └─ visit_duration_seconds logged
        └─ Creates: ActivatorPayment (VERIFIED_DOOR_ATTEMPT, $15)
           ├─ Payment Status → PENDING (if visit ≥ 45s)
           │                → PENDING_AUDIT (if visit < 45s)
           │
           └─ KANBAN PIPELINE STAGE FLOW:
              │
              ├─ new (initial lead capture)
              │  └─ [Manual drag → contacted] (field rep reaches out)
              │
              ├─ contacted (call/email logged in interaction_notes)
              │  └─ [Manual drag → interested] (prospect shows interest)
              │
              ├─ interested (prospect qualified)
              │  └─ [Manual drag → meeting_set] (appointment scheduled)
              │     └─ benefit_review_status transitions: NOT_SCHEDULED → SCHEDULED
              │
              ├─ meeting_set (appointment scheduled)
              │  └─ [Manual drag → closed] (outcome logged)
              │     └─ benefit_review_status: ATTENDED | NO_SHOW | CANCELLED
              │
              └─ closed (final outcome)
                 ├─ Call logged (interaction_notes.type = 'call')
                 ├─ Email logged (interaction_notes.type = 'email')
                 └─ Notes logged (interaction_notes.type = 'note')
```

**FA Reward:** Payment approval (admin) → $15 disbursed  
**Visual Tracking:** Drag-drop on Kanban board updates `pipeline_stage` in real-time  
**Inline Logging:** Click card modal to add calls, emails, notes with timestamps

---

## USER FLOW 2: VTON PARTNER (VTONOpportunity)

**User:** Real estate partner/agent  
**Entity:** VTONOpportunity  
**Origin:** Admin assigns from VA-financed seller list

```
ASSIGNED (in 48-hour decision window)
  │
  ├─ FORFEITED (partner declines within 48h)
  │  ├─ needs_reassignment = true
  │  ├─ forfeited_from_partner = email logged
  │  └─ [Office reassigns to different partner → fresh 48h window]
  │
  └─ [After 48h, no action] → AUTO-FORFEITED
     ├─ needs_reassignment = true
     └─ [Office reassignment triggered]
```

**OR**

```
ACCEPTED (within 48-hour window)
  └─ CONTACTED (partner reaches out)
     └─ IN_PROGRESS (active pursuit)
        ├─ CONVERSATION_VERIFIED
        │  ├─ Increments: PartnerApplication.verified_conversations ++
        │  └─ CONSULTATION_SCHEDULED
        │     ├─ CLOSED_WON (deal completed)
        │     └─ CLOSED_LOST (deal fell through)
        │
        └─ CLOSED_LOST (no verification)
```

**Partner Accountability:** verified_conversations counter (tracked for leaderboard, performance ranking)

---

## USER FLOW 3: ADMIN (ActivatorPayment Oversight)

**User:** Admin dashboard  
**Entity:** ActivatorPayment  
**Origin:** Automatically created from ActivatorLead door-knock events

```
PENDING (standard door-knock)
  │ [visit_duration_seconds ≥ 45?]
  │
  ├─ YES → APPROVED (auto-approve)
  │  └─ Admin Action: Mark PAID
  │     └─ PAID (funds disbursed to field rep)
  │
  └─ NO → PENDING_AUDIT (flagged for review)
     │ [Admin reviews visit pattern]
     │ - Visit < 45 seconds
     │ - No-answer rate > 90% (on 10+ visits)
     │ - Scan rate < 5% (on 50+ visits)
     │
     ├─ APPROVED (override, pattern acceptable)
     │  └─ Admin marks PAID
     │
     └─ REJECTED (suspicious pattern confirmed)
        ├─ rejection_reason = "[description]"
        └─ [Payment blocked, rep may reapply]
```

**Admin Controls:** 
- Auto-approve visits ≥ 45s
- Manual audit override for short visits
- Reject on gaming/suspicious patterns
- Review no-answer rate, scan rate, duration metrics

---

## Cross-Entity Triggers

| Trigger | From | To | Action |
|---------|------|-----|--------|
| Door-knock completed | ActivatorLead (knock_attempt_confirmed=true) | ActivatorPayment | Create $15 payment record |
| Conversation verified | VTONOpportunity (conversation verified) | PartnerApplication | Increment verified_conversations counter |
| 48h timeout (no action) | VTONOpportunity (ASSIGNED) | VTONOpportunity (FORFEITED) | Set needs_reassignment=true |
| Partner declines | VTONOpportunity (ASSIGNED) | VTONOpportunity (FORFEITED) | Set needs_reassignment=true |
| Short visit flag | ActivatorPayment (visit < 45s) | ActivatorPayment | Status → PENDING_AUDIT |

---

## Summary by Role

| Role | Entity | Success Metric | Pipeline Tracking | Failure Consequence |
|------|--------|-----------------|-----------------|-------------------|
| **Field Activator** | ActivatorLead → ActivatorPayment | Door-knock verified ($15 earned) | Kanban pipeline stages (new → closed) | No payment (suspicious pattern) |
| **VTON Partner** | VTONOpportunity | Verified conversation (counter++) | Partner-specific view | Forfeited opportunity (48h timeout) |
| **Admin** | ActivatorPayment | Approved & paid out | Payment oversight dashboard | Rejected on audit flag |

---

## Kanban Board (`/lead-pipeline`) — Architecture

**Scope:** ActivatorLead lifecycle visualization  
**Column Definitions:**

| Stage | Status | Description | Typical Actions |
|-------|--------|-------------|-----------------|
| **New** | 🟦 Default | Freshly scanned lead from QR code | Review notes, check contact info |
| **Contacted** | 🟦 Reached out | Field rep called or emailed | Log call outcome, note objections |
| **Interested** | 🟦 Qualified | Prospect expressed interest in benefit review | Schedule appointment |
| **Meeting Set** | 🟦 Appointment booked | Benefit review appointment confirmed | Track attendance, send reminders |
| **Closed** | ✅ Terminal | Meeting completed OR prospect unqualified | Final outcome: attended/no-show/not interested |

**Card Display:** Lead name · address · estimated equity · interaction count  
**Drag-and-drop:** Updates `pipeline_stage` field instantly via Base44 SDK  
**Modal (click card):** View/edit lead details, add calls/emails/notes, view history