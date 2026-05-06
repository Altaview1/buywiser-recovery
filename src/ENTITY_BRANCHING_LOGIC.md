# Entity Branching Logic - Buywiser VTON System

## Entity 1: ActivatorLead
**Origin:** QR scan by field rep at property  
**Key Decision Points:** Status progression through door-knock protocol

```
SCANNED (initial)
  ├─ VERIFIED
  │   ├─ QUALIFIED
  │   │   ├─ SCHEDULED
  │   │   │   ├─ COMPLETED
  │   │   │   │   └─ CLOSED (outcome: converted/not_interested/no_answer)
  │   │   │   └─ NO_SHOW
  │   │   │       └─ CLOSED (outcome: callback_scheduled)
  │   │   └─ CLOSED (outcome: not_interested)
  │   └─ CLOSED (outcome: no_answer after visits)
  └─ CLOSED (never verified)
```

**Associated Trigger:** Creates `ActivatorPayment` VERIFIED_DOOR_ATTEMPT record ($15)

---

## Entity 2: VTONOpportunity
**Origin:** Office creates from VA-financed homeowner data  
**Key Decision Points:** 48-hour decision window + protocol execution

```
ASSIGNED
  ├─ [48-hour window]
  │   ├─ ACCEPTED
  │   │   ├─ CONTACTED
  │   │   │   ├─ IN_PROGRESS
  │   │   │   │   ├─ CONVERSATION_VERIFIED
  │   │   │   │   │   ├─ CONSULTATION_SCHEDULED
  │   │   │   │   │   │   ├─ CLOSED_WON
  │   │   │   │   │   │   └─ CLOSED_LOST
  │   │   │   │   │   └─ CLOSED_LOST
  │   │   │   │   └─ CLOSED_LOST
  │   │   │   └─ CLOSED_LOST
  │   │   └─ CLOSED_LOST (no contact)
  │   │
  │   └─ FORFEITED
  │       └─ NEEDS_REASSIGNMENT = true
  │           └─ [Office reassigns to new partner]
  │
  └─ [After 48 hours, no action]
      └─ AUTO-FORFEITED
          └─ NEEDS_REASSIGNMENT = true
```

**Associated Triggers:**
- QR scan from packet → ActivatorPayment $200 earn-back credit
- Conversation verified → ActivatorPayment $200 earn-back credit
- Closed Won → Partner deposit refund ($2,000 max across all)

---

## Entity 3: ActivatorPayment
**Origin:** Triggered by ActivatorLead or ActivatorPayment events  
**Key Decision Points:** Payment approval & audit flags

```
PENDING
  ├─ [Visit Duration Check: < 45 seconds?]
  │   ├─ YES → PENDING_AUDIT
  │   │   ├─ [Admin reviews visit pattern]
  │   │   │   ├─ APPROVED (after manual override)
  │   │   │   │   └─ [Can mark PAID]
  │   │   │   └─ REJECTED (suspicious pattern detected)
  │   │   │       └─ [Payment blocked, add rejection_reason]
  │   │   └─ [Time expires] → EXPIRED
  │   │
  │   └─ NO → APPROVED
  │       └─ [Admin action: Mark as PAID]
  │           └─ PAID
  │               └─ [Funds disbursed]
  │
  └─ REJECTED
      └─ [rejection_reason logged]
          └─ [Reapply or appeal]
```

**Audit Rules:**
- Visit < 45 seconds = PENDING_AUDIT
- No-answer rate > 90% + 10+ visits = Suspicious
- Scan rate < 5% on 50+ visits = Suspicious

---

## Cross-Entity Relationships

### Flow 1: Field Activator Door-Knock → Payment
```
ActivatorLead (SCANNED)
  → knock_attempt_confirmed = true
  → visit_duration_seconds = 47
  → Creates: ActivatorPayment (VERIFIED_DOOR_ATTEMPT, $15)
  → Status: PENDING (passes audit, 47 > 45)
```

### Flow 2: VTON Opportunity → Partner Earn-Back Credit
```
VTONOpportunity (ASSIGNED)
  → Partner accepts (within 48hr window)
  → QR scanned from packet OR conversation verified
  → Creates: ActivatorPayment ($200 deposit credit)
  → Accumulates toward $2,000 max refund
```

### Flow 3: Forfeited Opportunity → Reassignment
```
VTONOpportunity (ASSIGNED)
  → No action within 48 hours
  → Status: FORFEITED
  → needs_reassignment = true
  → forfeited_from_partner = email
  → Office reassigns to new partner
  → New partner gets fresh 48-hour window
```

---

## Summary: Three Critical Paths

| Entity | Failure Path | Success Path | Payment Trigger |
|--------|--------------|--------------|-----------------|
| **ActivatorLead** | CLOSED (no_answer) | COMPLETED → CLOSED_WON | $15 door-knock fee |
| **VTONOpportunity** | FORFEITED (48hr timeout) | CLOSED_WON (verified conversation) | $200 deposit credit |
| **ActivatorPayment** | REJECTED (audit flag) | PAID (admin approval) | Funds disbursed |