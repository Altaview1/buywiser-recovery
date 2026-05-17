# VTON & SmartBuy Code Migration Guide

**From Base44 → GitHub Recovery Repo**

---

## 📋 Overview

This guide explains how to sync your live Base44 codebase to the GitHub recovery repository (`buywiser-recovery`). It's a **backup-first strategy** — GitHub stays clean, Base44 stays live.

---

## 🔄 Migration Workflow

### Phase 1: Initial Full Backup (One-Time)

#### Step 1: Export from Base44
1. Log into your Base44 project
2. **Download all files:**
   - Dashboard → Settings → Export project
   - Or manually export each folder:
     - `src/pages/` → copy all `.jsx` files
     - `src/components/` → copy all `.jsx` files
     - `src/functions/` → copy all `.js` files
     - `src/entities/` → copy all `.json` files
     - `src/lib/` → copy all utility files
     - Root files: `App.jsx`, `Layout.jsx`, `index.css`, `tailwind.config.js`

#### Step 2: Organize into GitHub Structure
```bash
# Create local structure
mkdir -p buywiser-recovery/{vton,smartbuy,shared,app}

# Move VTON-specific files
mv src/pages/VTON*.jsx buywiser-recovery/vton/pages/
mv src/pages/VTONScan.jsx buywiser-recovery/vton/pages/
mv src/pages/FieldActivator*.jsx buywiser-recovery/vton/pages/
mv src/functions/vton*.js buywiser-recovery/vton/functions/
mv src/functions/notify*VTON*.js buywiser-recovery/vton/functions/

# Move SmartBuy-specific files
mv src/pages/SmartBuy*.jsx buywiser-recovery/smartbuy/pages/
mv src/functions/sendSmartBuyWelcomeSequence.js buywiser-recovery/smartbuy/functions/
mv src/functions/notifySmartBuy*.js buywiser-recovery/smartbuy/functions/

# Move shared/cross-cutting concerns
mv src/functions/send*.js buywiser-recovery/shared/functions/
mv src/components/ChatWidget.jsx buywiser-recovery/shared/components/
mv src/components/AdminNavMenu.jsx buywiser-recovery/shared/components/

# Move app-level files
mv src/App.jsx buywiser-recovery/app/
mv src/Layout.jsx buywiser-recovery/app/
mv src/index.css buywiser-recovery/app/
mv src/tailwind.config.js buywiser-recovery/app/

# Copy entity schemas
cp src/entities/*.json buywiser-recovery/vton/entities/  # VTON-specific
cp src/entities/*.json buywiser-recovery/smartbuy/entities/  # SmartBuy-specific
cp src/entities/{User,ContactSubmission}.json buywiser-recovery/shared/entities/
```

#### Step 3: Commit Initial Backup
```bash
cd buywiser-recovery
git add .
git commit -m "Initial backup: Complete VTON + SmartBuy + shared codebase"
git push origin main
```

---

### Phase 2: Ongoing Sync (Weekly/Monthly)

#### Automated Option: GitHub Actions

The `.github/workflows/sync.yml` file automates code sync.

**How it works:**
1. You run a script in Base44 to export changed files
2. GitHub Actions auto-syncs to the repo on a schedule
3. All changes are logged as commits

**Setup (one-time):**
```bash
# Create .github/workflows/sync.yml (already provided)
# Add a GitHub token to Base44 secrets (if needed)
```

**Run sync manually:**
```bash
./scripts/sync-to-github.sh
```

---

#### Manual Option: Periodic Snapshots

**Best for:** Small teams, low-frequency changes, or testing

```bash
# 1. Export from Base44 (download as ZIP)
#    Dashboard → Settings → Export Project

# 2. Extract and copy to local
unzip base44-export.zip
cp -r src/* ./buywiser-recovery/

# 3. Organize files (use Phase 1 structure)

# 4. Commit with descriptive message
git add .
git commit -m "Sync [2026-05-17]: PropertyRadar lead scoring improvements, SmartBuy token fixes"
git push origin main
```

---

## 📂 File Organization Rules

### VTON Campaign Files

**Pages** (`vton/pages/`)
- `VTONScan.jsx` – Lead intake via QR code
- `VTONCampaignDashboard.jsx` – Admin monitoring
- `VTONMailDashboard.jsx` – Lob mail tracking
- `VTONPersonalizedLanding.jsx` – Personalized benefit pages
- `FieldActivatorPortal.jsx` – FA mobile app
- `FieldRepDashboard.jsx` – Field rep management

**Components** (`vton/components/`)
- `vton/VTONMailPipeline.jsx` – Mail workflow
- `vton/MetaAudienceSyncPanel.jsx` – Meta setup
- `field-rep/FieldRepLoginGate.jsx` – FA auth
- `field-rep/VisitLogger.jsx` – Door-knock logging

**Functions** (`vton/functions/`)
- `vtonBulkImportPropertyRadar.js` – PropertyRadar lead sourcing
- `vtonDirectMailQueue.js` – Lob mail queueing
- `vtonMetaAudienceSync.js` – Meta custom audience
- `vtonPersonalizationEngine.js` – Dynamic content
- `createVerifiedDoorPayment.js` – FA payout
- All `notify*VTON*.js` – Notifications
- All `vton*.js` – VTON-specific logic

**Entities** (`vton/entities/`)
- `VTONLead.json`
- `ActivatorLead.json`
- `FieldActivator.json`
- `ActivatorPayment.json`
- `VTONMailConfig.json`
- Other VTON-specific schemas

---

### SmartBuy Campaign Files

**Pages** (`smartbuy/pages/`)
- `SmartBuy.jsx` – Main intake
- `SmartBuyWorkflow.jsx` – Journey tracking
- `Marketplace.jsx` – Service marketplace
- `TokenRewindPage.jsx` – Token management

**Components** (`smartbuy/components/`)
- `smartbuy/SmartBuyIntakeForm.jsx`
- `smartbuy/TokenTutorial.jsx`
- `smartbuy/SavingsMeter.jsx`
- `smartbuy/marketplace/*` – Service listing

**Functions** (`smartbuy/functions/`)
- `sendSmartBuyWelcomeSequence.js`
- `notifySmartBuyUnlock.js`
- `notifyStageComplete.js`
- All SmartBuy-specific logic

**Entities** (`smartbuy/entities/`)
- `SmartBuyLead.json`
- Token and service schemas

---

### Shared Infrastructure

**Shared Functions** (`shared/functions/`)
- `sendSMS.js` – Twilio SMS
- `sendEmail.js` – Resend email
- `sendVerificationEmail.js`
- `sendLeadConfirmationEmail.js`
- Anything used by BOTH pipelines

**Shared Components** (`shared/components/`)
- `ChatWidget.jsx`
- `AdminNavMenu.jsx`
- `StickyBanner.jsx`
- UI utilities

**Shared Entities** (`shared/entities/`)
- `User.json`
- `ContactSubmission.json`
- App-wide schemas

---

## ✅ Pre-Migration Checklist

- [ ] All VTON functions are prefixed with `vton*` or `notify*VTON*`
- [ ] All SmartBuy functions are prefixed with `smartbuy*` or `notifySmartBuy*`
- [ ] Shared functions have no campaign-specific logic
- [ ] Entity schemas have `rls` (row-level security) defined
- [ ] All `.jsx` files use relative imports (`../components/`)
- [ ] No hardcoded API keys or secrets in code
- [ ] All functions have descriptive names and comments
- [ ] Test all functions in Base44 before export

---

## 🔍 Validation After Sync

```bash
# 1. Check file counts
find vton -type f | wc -l      # ~80 files
find smartbuy -type f | wc -l  # ~30 files
find shared -type f | wc -l    # ~50 files

# 2. Verify structure
tree -L 2 vton/
tree -L 2 smartbuy/
tree -L 2 shared/

# 3. Check for common mistakes
grep -r "import.*smartbuy" vton/functions/  # Should be empty
grep -r "import.*vton" smartbuy/functions/  # Should be empty
grep -r "API_KEY\|SECRET" .  # Should return none (no secrets)

# 4. Validate JSON schemas
for file in */entities/*.json; do jq empty "$file" && echo "✓ $file"; done
```

---

## 📞 Common Issues

### Issue: Functions are duplicated across pipelines
**Solution:** Move duplicates to `shared/functions/` and import from there.

### Issue: Entity fields differ between pipelines
**Solution:** Create separate entity files (e.g., `VTONLead.json` vs `SmartBuyLead.json`). Never share entity schemas.

### Issue: Changes in Base44 aren't syncing to GitHub
**Solution:** 
1. Manually trigger sync: `./scripts/sync-to-github.sh`
2. Or wait for next automated sync (check GitHub Actions logs)

### Issue: Merge conflicts when syncing
**Solution:**
```bash
# Always pull latest before pushing
git pull origin main
git merge --strategy-option=ours vton-dev  # Keep GitHub version
git push origin main
```

---

## 🚀 After Sync: Deploying Back to Base44

If you need to deploy from GitHub back to Base44:

```bash
# 1. Clone/pull the repo locally
git clone https://github.com/Altaview1/buywiser-recovery.git
cd buywiser-recovery

# 2. Copy back to your Base44 project structure
cp -r vton/pages/* /your-base44-project/src/pages/
cp -r vton/functions/* /your-base44-project/src/functions/
cp -r vton/components/* /your-base44-project/src/components/
cp -r vton/entities/* /your-base44-project/src/entities/

# 3. Deploy with Base44 CLI
cd /your-base44-project
base44 deploy functions/
base44 deploy  # Full deploy

# 4. Test in Base44 preview
# Verify all functions and pages work
```

---

## 📅 Sync Schedule Recommendation

- **Small changes (bug fixes):** Sync weekly
- **Feature releases:** Sync immediately after testing
- **Major refactors:** Sync daily during active development
- **Stable periods:** Sync monthly for archive

---

## 🔐 Security Checklist

Before every commit:
```bash
# 1. Scan for secrets
git diff --cached | grep -i "key\|secret\|token\|password"

# 2. Verify no Base44 credentials
grep -r "NMLS\|API_KEY" .

# 3. Check file permissions
find . -type f -executable | grep -v ".git"

# 4. Review commit message for sensitive info
# (Don't mention specific lead names, emails, or numbers)
```

---

## 📖 Additional Resources

- **README.md** – Overview & structure
- **REPO_STRUCTURE.md** – Detailed folder organization
- **vton/docs/VTON_ARCHITECTURE.md** – VTON system design
- **smartbuy/docs/SMARTBUY_ARCHITECTURE.md** – SmartBuy system design

---

**Last Updated:** May 17, 2026  
**Maintained By:** BuyWiser Engineering