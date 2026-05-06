# Entity Branching Logic - Buywiser VTON System

Three parallel user workflows: **Field Activator** (door-knocks), **Homeowner/Admin** (VTON partner opportunity), and **Admin** (payment oversight).

---

## USER FLOW 1: FIELD ACTIVATOR (ActivatorLead)

**User:** Field rep knocks on doors  
**Entity:** ActivatorLead  
**Origin:** QR scan at property address

```
SCANNED (initial QR capture)
  └─ knock_attempt_confirmed = true
     └─ visit_duration_seconds logged
        └─ Creates: ActivatorPayment (VERIFIED_DOOR_ATTEMPT, $15)
           ├─ Payment Status → PENDING (if visit ≥ 45s)
           │                → PENDING_AUDIT (if visit < 45s)
           │
           └─ Lead Status Flow:
              ├─ VERIFIED (conversation occurred)
              │  ├─ QUALIFIED (prospect interested)
              │  │  ├─ SCHEDULED (appointment set)
              │  │  │  ├─ COMPLETED
              │  │  │  │  └─ CLOSED (outcome: converted/not_interested/callback_scheduled)
              │  │  │  └─ NO_SHOW
              │  │  │     └─ CLOSED
              │  │  └─ CLOSED (not interested)
              │  └─ CLOSED (no follow-up)
              │
              └─ CLOSED (no answer, no verification)
```

**FA Reward:** Payment approval (admin) → $15 disbursed

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

| Role | Entity | Success Metric | Failure Consequence |
|------|--------|-----------------|-------------------|
| **Field Activator** | ActivatorLead → ActivatorPayment | Door-knock verified ($15 earned) | No payment (suspicious pattern) |
| **VTON Partner** | VTONOpportunity | Verified conversation (counter++) | Forfeited opportunity (48h timeout) |
| **Admin** | ActivatorPayment | Approved & paid out | Rejected on audit flag |