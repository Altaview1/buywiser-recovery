# BuyWiser Recovery – Complete Codebase Backup

**Repository:** https://github.com/Altaview1/buywiser-recovery  
**Last Updated:** May 2026  
**Status:** Active backup of all VTON and lead management systems

---

## 📋 Overview

This repository contains **complete, production-ready code** for two distinct mortgage technology pipelines:

### 🎖️ **VTON Pipeline** (Veteran Seller Opportunities)
- PropertyRadar lead sourcing (CA VA loans, 1-90 DOM)
- Direct mail via Lob integration (personalized letters)
- Meta custom audience sync for paid advertising
- Lead scoring, engagement tracking, and follow-up automation
- Field activator QR code activation system
- Veteran benefit review scheduling

### 💰 **SmartBuy Pipeline** (Buyer Rebate System)
- Buyer intake forms and lead qualification
- Token-based savings pool management
- Service marketplace and closing cost visualization
- Appointment booking and consultation tracking
- Completely separate from VTON – no data mixing

---

## 📁 Repository Structure

```
buywiser-recovery/
├── README.md                              # This file
├── MIGRATION_GUIDE.md                     # How to sync from Base44 → GitHub
├── REPO_STRUCTURE.md                      # Detailed folder organization
│
├── vton/                                  # 🎖️ VTON Campaign (Veteran Pipeline)
│   ├── docs/
│   │   ├── VTON_ARCHITECTURE.md          # System design & data flow
│   │   ├── VTON_LOB_GUIDE.md             # Lob (direct mail) setup
│   │   ├── VTON_LETTER_TEMPLATES.md      # Mail template reference
│   │   └── PROPERTY_RADAR_API.md         # PropertyRadar integration
│   │
│   ├── pages/                             # VTON-specific UI pages
│   │   ├── VTONScan.jsx
│   │   ├── VTONBenefitBooking.jsx
│   │   ├── VTONCampaignDashboard.jsx
│   │   ├── VTONMailDashboard.jsx
│   │   ├── VTONPersonalizedLanding.jsx
│   │   └── ...
│   │
│   ├── components/                        # VTON UI components
│   │   ├── vton/
│   │   │   ├── VTONMailPipeline.jsx
│   │   │   ├── MetaAudienceSyncPanel.jsx
│   │   │   └── ...
│   │   └── field-rep/
│   │       ├── FieldRepLoginGate.jsx
│   │       ├── FieldRepDashboard.jsx
│   │       └── ...
│   │
│   ├── functions/                         # Backend functions (Deno)
│   │   ├── vtonBulkImportPropertyRadar.js
│   │   ├── vtonDirectMailQueue.js
│   │   ├── vtonMetaAudienceSync.js
│   │   ├── sendVTONWelcomeLetter.js
│   │   ├── vtonPersonalizationEngine.js
│   │   └── ... (50+ VTON functions)
│   │
│   └── entities/                          # Data schemas
│       ├── VTONLead.json
│       ├── ActivatorLead.json
│       ├── VTONMailConfig.json
│       └── ...

├── smartbuy/                              # 💰 SmartBuy Pipeline (Buyer Rebate)
│   ├── docs/
│   │   ├── SMARTBUY_ARCHITECTURE.md
│   │   └── TOKEN_SYSTEM.md
│   │
│   ├── pages/
│   │   ├── SmartBuy.jsx
│   │   ├── SmartBuyWorkflow.jsx
│   │   └── ...
│   │
│   ├── components/
│   │   └── smartbuy/
│   │       ├── SmartBuyIntakeForm.jsx
│   │       ├── TokenTutorial.jsx
│   │       └── ...
│   │
│   └── functions/
│       ├── sendSmartBuyWelcomeSequence.js
│       ├── notifySmartBuyUnlock.js
│       └── ...

├── shared/                                # Shared infrastructure
│   ├── functions/
│   │   ├── sendSMS.js
│   │   ├── sendEmail.js
│   │   └── ... (shared utilities)
│   │
│   ├── components/
│   │   ├── ChatWidget.jsx
│   │   ├── AdminNavMenu.jsx
│   │   └── ... (app-wide components)
│   │
│   └── entities/
│       ├── User.json
│       ├── ContactSubmission.json
│       └── ... (shared schemas)

├── app/                                   # Main app files
│   ├── App.jsx
│   ├── Layout.jsx
│   ├── index.css
│   └── tailwind.config.js

└── .github/
    └── workflows/
        └── sync.yml                       # Auto-sync from Base44 (GitHub Actions)
```

---

## ⚠️ CRITICAL: Campaign Separation

**VTON and SmartBuy are COMPLETELY SEPARATE systems.**

- ✅ **Do** have separate code folders, configs, and documentation
- ✅ **Do** use separate feature branches (`vton-dev` vs `smartbuy-dev`)
- ✅ **Do** isolate their entity schemas and backend functions
- ❌ **Don't** mix lead types, data flows, or UI components
- ❌ **Don't** create shared functions between pipelines

**Reason:** Cross-contamination causes bugs, compliance issues, and makes debugging impossible.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Git
- Base44 CLI (for deployment)

### 1. Clone the Repository
```bash
git clone https://github.com/Altaview1/buywiser-recovery.git
cd buywiser-recovery
npm install
```

### 2. Review Campaign-Specific Docs
```bash
# VTON pipeline setup
cat vton/docs/VTON_ARCHITECTURE.md

# SmartBuy pipeline setup
cat smartbuy/docs/SMARTBUY_ARCHITECTURE.md

# Full migration guide
cat MIGRATION_GUIDE.md
```

### 3. Deploy to Your Base44 Instance
```bash
# Deploy functions
base44 deploy functions/

# Or selective deployment
base44 deploy vton/functions/  # VTON only
base44 deploy smartbuy/functions/  # SmartBuy only
```

---

## 📊 Key Statistics

### VTON Functions (50+ backend handlers)
- PropertyRadar integration (lead sourcing)
- Lob direct mail (printing + postage)
- Meta audience sync (paid ads)
- Lead scoring & engagement
- Field activator payout system
- Behavioral triggers & follow-ups

### SmartBuy Functions (15+ handlers)
- Lead intake & qualification
- Token pool management
- Appointment scheduling
- Notification system

### Shared Functions (30+ utilities)
- SMS/Email delivery (Twilio, Resend)
- Data validation
- Reporting & analytics

### Total Lines of Code
- **Components:** ~40K lines (React/JSX)
- **Backend Functions:** ~35K lines (Deno)
- **Entities:** ~25 schemas
- **Documentation:** ~10K lines

---

## 🔐 Secrets Management

This repo **does NOT include secrets**. Required environment variables (stored in Base44):

```
TWILIO_API_KEY
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_FROM_NUMBER
META_ACCESS_TOKEN
META_CUSTOM_AUDIENCE_ID
PROPERTY_RADAR_API_KEY
LOB_API_KEY
RESEND_API_KEY
ADMIN_NOTIFICATION_EMAIL
```

⚠️ **Never commit API keys, tokens, or passwords.**

---

## 📖 Documentation Structure

| File | Purpose |
|------|---------|
| `REPO_STRUCTURE.md` | Detailed folder/file organization |
| `MIGRATION_GUIDE.md` | How to sync Base44 → GitHub |
| `vton/docs/VTON_ARCHITECTURE.md` | VTON system design |
| `vton/docs/VTON_LOB_GUIDE.md` | Lob (direct mail) setup |
| `vton/docs/PROPERTY_RADAR_API.md` | PropertyRadar integration |
| `smartbuy/docs/SMARTBUY_ARCHITECTURE.md` | SmartBuy system design |

---

## 🔄 Branching Strategy

```
main (production)
├── vton-dev (VTON staging)
│   └── vton-feature/* (feature branches)
└── smartbuy-dev (SmartBuy staging)
    └── smartbuy-feature/* (feature branches)
```

**Rule:** Never merge between VTON and SmartBuy branches.

---

## 🤝 Contributing

1. **Create a feature branch:**
   ```bash
   git checkout -b vton-feature/my-feature
   # or
   git checkout -b smartbuy-feature/my-feature
   ```

2. **Make changes, test locally**

3. **Commit with clear messages:**
   ```bash
   git commit -m "[VTON] Add PropertyRadar lead filtering"
   git commit -m "[SmartBuy] Fix token calculation bug"
   ```

4. **Push and create a Pull Request**

5. **Code review before merge to main**

---

## 📞 Support

For issues, questions, or documentation updates:
- **Email:** bennett@buywiser.com
- **Issues:** Open a GitHub issue in this repo
- **Docs:** Update `.md` files directly

---

## 📄 License

BuyWiser Technology, Inc. © 2026. All rights reserved.

---

**Last synced from Base44:** May 17, 2026