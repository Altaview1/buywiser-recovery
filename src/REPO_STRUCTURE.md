# Repository Structure Reference

**Complete folder & file organization for `buywiser-recovery`**

---

## 📁 Top-Level Directory

```
buywiser-recovery/
├── README.md                      # Main overview
├── MIGRATION_GUIDE.md             # Sync instructions
├── REPO_STRUCTURE.md              # This file
├── .gitignore                     # Git ignore rules
├── .github/                       # GitHub configuration
│   └── workflows/
│       └── sync.yml               # Auto-sync workflow
│
├── vton/                          # 🎖️ VTON Campaign
├── smartbuy/                      # 💰 SmartBuy Campaign
├── shared/                        # 🔗 Shared Infrastructure
└── app/                           # 🏠 App Core Files
```

---

## 🎖️ VTON Campaign (`vton/`)

### Purpose
Veteran seller outreach pipeline: PropertyRadar lead sourcing → Lob direct mail → Meta audience sync → Field activation → Benefit booking.

### Folder Structure

```
vton/
├── docs/                          # VTON Documentation
│   ├── VTON_ARCHITECTURE.md       # System design & data flow
│   ├── VTON_LOB_GUIDE.md          # Lob (direct mail) setup & API
│   ├── VTON_LETTER_TEMPLATES.md   # Mail template variables
│   ├── PROPERTY_RADAR_API.md      # PropertyRadar integration
│   ├── VTON_LOB_QUICKSTART.md     # Quick setup guide
│   └── VTON_LOB_PRODUCTION_CHECKLIST.md
│
├── pages/                         # VTON-Specific Pages (React)
│   ├── VTONScan.jsx               # Lead intake via QR scan
│   ├── VTONBenefitBooking.jsx     # Vet benefit review booking
│   ├── VTONCampaignDashboard.jsx  # Admin campaign monitoring
│   ├── VTONMailDashboard.jsx      # Lob letter tracking
│   ├── VTONLobErrorDashboard.jsx  # Lob error handling & recovery
│   ├── VTONLetterTemplateReview.jsx # Template approval workflow
│   ├── VTONEmailHistory.jsx       # Email campaign history
│   ├── VTONPersonalizedLanding.jsx # Dynamic landing pages (per lead)
│   ├── VTONQRScanTest.jsx         # Testing QR code scans
│   ├── VTONTestimonials.jsx       # Vet testimonials gallery
│   ├── FieldActivatorPortal.jsx   # FA mobile app
│   ├── FieldActivatorDashboard.jsx # FA performance tracking
│   ├── FieldActivatorOnboarding.jsx # FA training & setup
│   ├── FieldRepDashboard.jsx      # Field rep management
│   ├── QRScanDashboard.jsx        # QR scan analytics
│   ├── AdminDashboard.jsx         # Admin control center
│   ├── MobileLeadDashboard.jsx    # Mobile-optimized lead view
│   ├── LeadPipelineBoard.jsx      # Kanban board for leads
│   ├── PropertyRadarDashboard.jsx # PropertyRadar lead pool
│   └── RouteOptimizationDashboard.jsx # FA route planning
│
├── components/                    # VTON UI Components
│   ├── vton/
│   │   ├── VTONMailPipeline.jsx   # Mail workflow stages
│   │   ├── VTONBulkImportUI.jsx   # Bulk lead import interface
│   │   ├── MetaAudienceSyncPanel.jsx # Meta campaign setup
│   │   ├── MetaAudienceStatus.jsx # Audience sync status
│   │   ├── MetaCampaignSetup.jsx  # Meta campaign config
│   │   ├── DuplicateScanner.jsx   # Find duplicate leads
│   │   ├── DoorKnockOutcomeLogger.jsx # FA visit logging
│   │   ├── Leaderboard.jsx        # FA performance ranking
│   │   ├── OpportunityMapView.jsx # Geographic lead map
│   │   ├── OpportunityQRGenerator.jsx # QR code generator
│   │   ├── PartnerProfileEditor.jsx # Partner profile mgmt
│   │   ├── PartnerProgressTracker.jsx # Partner KPI tracking
│   │   ├── VerificationBadge.jsx  # Email/phone verification
│   │   ├── LeadNotesPanel.jsx     # Internal notes & coaching
│   │   ├── SMSConsentCheckbox.jsx # SMS opt-in confirmation
│   │   ├── VTONPublicOptIn.jsx    # Public opt-in form
│   │   └── PartnerPreScreenQuiz.jsx # Partner qualification quiz
│   │
│   ├── field-rep/
│   │   ├── FieldRepLoginGate.jsx  # FA email authentication
│   │   ├── FieldRepHeader.jsx     # FA dashboard header
│   │   ├── AssignedLeadsList.jsx  # FA assigned leads list
│   │   ├── LeadDetailView.jsx     # Lead details for FA
│   │   ├── VisitLogger.jsx        # Door-knock outcome logging
│   │   ├── BulkLeadImport.jsx     # Bulk FA lead assignment
│   │   ├── DailyChecklist.jsx     # FA daily task checklist
│   │   └── LeadCheckIn.jsx        # Quick check-in interface
│   │
│   └── activator/
│       ├── BulkProspectUpload.jsx # Bulk prospect CSV upload
│       └── QRFlyerPrint.jsx       # Print QR code flyers
│
├── functions/                     # VTON Backend Functions (Deno)
│   ├── VTON Core
│   │   ├── vtonBulkImportPropertyRadar.js      # PropertyRadar bulk import
│   │   ├── vtonPropertyRadarAdapter.js         # PropertyRadar data mapping
│   │   ├── vtonListingVerification.js          # Verify listings are valid
│   │   ├── importPropertyRadarOpportunities.js # Import opportunities
│   │   ├── fetchPropertyRadarLeads.js          # Fetch PropertyRadar data
│   │   ├── getVALoanListingsByDOM.js           # Filter by days on market
│   │   ├── propertyRadarDrillDown.js           # Drill-down analytics
│   │   ├── dailyPropertyRadarCount.js          # Daily snapshot count
│   │   ├── dailyPropertyRadarSummary.js        # Daily summary report
│   │   ├── testPropertyRadarImport.js          # Test import flow
│   │   ├── notifyPropertyRadarImportResults.js # Notify on import complete
│   │   └── deleteVTONImport.js                 # Delete import batch
│   │
│   ├── Direct Mail (Lob Integration)
│   │   ├── sendVTONWelcomeLetter.js     # Generate & queue letter
│   │   ├── vtonDirectMailQueue.js       # Queue management
│   │   ├── approveVTONMail.js           # Admin approval workflow
│   │   ├── lobWebhookHandler.js         # Handle Lob webhooks
│   │   ├── syncLobPrintingStatus.js     # Sync Lob status updates
│   │   ├── pollLobStatusUpdates.js      # Poll for status changes
│   │   ├── testLobIntegration.js        # Test Lob setup
│   │   ├── verifyLobSetup.js            # Verify Lob configuration
│   │   ├── notifyVTONMailFailures.js    # Alert on mail errors
│   │   ├── notifyVTONMailFailureImmediate.js # Immediate alert
│   │   ├── notifyBatchApprovalFailure.js # Batch approval error
│   │   └── notifyBatchDelivered.js      # Notify delivery complete
│   │
│   ├── Meta Audience Sync
│   │   ├── vtonMetaAudienceSync.js      # Sync to Meta custom audience
│   │   ├── syncMetaCustomAudience.js    # Meta audience uploader
│   │   └── testVTONQRCode.js            # Test QR code generation
│   │
│   ├── Personalization & Engagement
│   │   ├── vtonPersonalizationEngine.js # Dynamic content engine
│   │   ├── vtonEngagementTracker.js     # Track lead engagement
│   │   ├── vtonBehavioralTriggers.js    # Rule-based actions
│   │   ├── vtonBehavioralFollowup.js    # Automated follow-ups
│   │   ├── vtonRapidResponse.js         # Fast follow-up system
│   │   └── vtonWAAVAdapter.js           # WAAV lead integration
│   │
│   ├── Lead Management
│   │   ├── onNewLead.js                 # New lead webhook
│   │   ├── calculateLeadPriorityScore.js # Score leads
│   │   ├── notifyNewVTONLead.js         # Notify on new lead
│   │   ├── notifyNewVTONOpportunity.js  # Notify on opportunity
│   │   ├── notifyQRScanLead.js          # Notify on QR scan
│   │   ├── notifyQRScanHomeowner.js     # SMS to homeowner
│   │   └── scheduleHomeownerConsultation.js # Book appointment
│   │
│   ├── Field Activator System
│   │   ├── createVerifiedDoorPayment.js     # Create FA payment
│   │   ├── triggerActivatorPayout.js        # Process FA payout
│   │   ├── triggerAttendancePayment.js      # Attendance bonus
│   │   ├── analyzeFieldActivatorMetrics.js  # FA performance analysis
│   │   ├── optimizeActivatorRoute.js        # Route optimization
│   │   ├── notifyNewActivator.js            # Welcome new FA
│   │   ├── logVisitUpdate.js                # Log door attempt
│   │   ├── notifyVisitLogged.js             # Notify visit recorded
│   │   └── notifyPaymentApproved.js         # Payment approval notification
│   │
│   ├── Reports & Analytics
│   │   ├── analyzeLeadClusters.js           # Geographic analysis
│   │   ├── analyzeStaffingNeeds.js          # Staffing recommendations
│   │   ├── dailyVTONCampaignReport.js       # Daily campaign report
│   │   ├── dailyVTONFollowUpReminder.js     # Follow-up reminders
│   │   ├── weeklyLeadAndScanSummary.js      # Weekly summary
│   │   └── weeklyPartnerReport.js           # Weekly partner KPIs
│   │
│   └── Misc/Testing
│       ├── sendVTONTestEmail.js         # Test email system
│       └── testVTONQRCode.js            # Test QR codes
│
├── entities/                      # VTON Data Schemas (JSON)
│   ├── VTONLead.json              # Veteran lead schema
│   ├── ActivatorLead.json         # Field activator lead schema
│   ├── FieldActivator.json        # Field activator profile
│   ├── ActivatorPayment.json      # FA payment record
│   ├── Visit.json                 # Visit log record
│   ├── VTONMailConfig.json        # Mail template config
│   ├── VTONEmailLog.json          # Email campaign log
│   ├── PropertyRadarDailySnapshot.json # Daily lead pool snapshot
│   ├── VisitAuditLog.json         # Admin audit trail
│   ├── EmailTemplate.json         # Email template library
│   ├── Resource.json              # Sales resources/scripts
│   ├── Message.json               # Internal messaging
│   ├── MailerCode.json            # Personal benefit codes
│   ├── PayoutConfig.json          # FA payout rules
│   └── VTONOpportunity.json       # Sales opportunity schema
│
└── VTON_ARCHITECTURE_REFERENCE.md # Architecture overview
```

---

## 💰 SmartBuy Campaign (`smartbuy/`)

### Purpose
Buyer rebate pipeline: Lead intake → Qualification → Token pool management → Service marketplace → Closing coordination.

### Folder Structure

```
smartbuy/
├── docs/
│   ├── SMARTBUY_ARCHITECTURE.md   # System design
│   └── TOKEN_SYSTEM.md            # Token mechanics explained
│
├── pages/
│   ├── SmartBuy.jsx               # Main SmartBuy intake/hub
│   ├── SmartBuyWorkflow.jsx       # Buyer journey tracking
│   ├── SmartBuyOrchestrator.jsx   # Workflow orchestration
│   ├── Marketplace.jsx            # Service marketplace
│   ├── TokenRewindPage.jsx        # Token pool visualization
│   ├── BuyerCashBack.jsx          # Cash back program
│   ├── TokenAvailableFAQ.jsx      # Token system FAQ
│   └── ReferralProgram.jsx        # Referral incentives
│
├── components/
│   └── smartbuy/
│       ├── SmartBuyIntakeForm.jsx      # Lead capture form
│       ├── SmartBuyTestimonials.jsx    # Success stories
│       ├── SmartBuyVideoPlaceholder.jsx # Video placeholder
│       ├── SmartBuyFAQ.jsx             # FAQ component
│       ├── CommonQuestions.jsx         # Common Q&A
│       ├── JourneyProgressBar.jsx      # Stage progress indicator
│       ├── StageCompletionPopup.jsx    # Stage completion modal
│       ├── UnlockModal.jsx             # Token unlock interface
│       ├── UnlockSteps.jsx             # Token unlock steps
│       ├── UnlockSteps.jsx             # Token unlock steps
│       ├── TokenTutorial.jsx           # Token system tutorial
│       ├── TokenBalanceIndicator.jsx   # Current token balance
│       ├── TokenRewind.jsx             # Token rewind interface
│       ├── SavingsMeter.jsx            # Savings visualization
│       ├── SavingsMeterHero.jsx        # Hero savings meter
│       ├── SavingsSummaryDashboard.jsx # Savings summary
│       ├── TestimonialRotator.jsx      # Rotating testimonials
│       ├── ReferralSection.jsx         # Referral CTA section
│       ├── ConsultationRequestModal.jsx # Book consultation
│       ├── ReferralDashboard.jsx       # Referral tracking
│       ├── SocialPostGenerator.jsx     # Social sharing tool
│       ├── MeetYourExpert.jsx          # Expert matching
│       ├── ComparisonTable.jsx         # Service comparison
│       ├── ServicePriceList.jsx        # Service pricing
│       ├── SaveoMeter.jsx              # Savings estimate
│       ├── MyReports.jsx               # User reports
│       ├── ProgressBar.jsx             # Progress indicator
│       │
│       ├── workflow/
│       │   ├── StageIndicator.jsx      # Current stage indicator
│       │   ├── StageNavigation.jsx     # Stage navigation
│       │   ├── PrequalificationStage.jsx
│       │   ├── HomeSearchStage.jsx
│       │   ├── PropertySearchStage.jsx
│       │   ├── TouringStage.jsx
│       │   ├── TourStage.jsx
│       │   ├── OfferStage.jsx
│       │   ├── InspectionStage.jsx
│       │   ├── AppraisalStage.jsx
│       │   ├── FinancingStage.jsx
│       │   ├── EscrowStage.jsx
│       │   ├── ClosingStage.jsx
│       │   └── StatusStage.jsx
│       │
│       ├── marketplace/
│       │   ├── PropertyServicesMarketplace.jsx # Main marketplace
│       │   ├── ServiceCard.jsx             # Individual service card
│       │   ├── ClosingCostVisualizer.jsx   # Closing cost breakdown
│       │   └── marketplaceData.js          # Service pricing data
│       │
│       └── pricing/
│           └── servicePricing.js       # Pricing constants
│
├── functions/
│   ├── sendSmartBuyWelcomeSequence.js  # Welcome email/SMS
│   ├── notifySmartBuyUnlock.js         # Token unlock alert
│   ├── notifyStageComplete.js          # Stage completion notification
│   └── issueCouponWithAppointment.js   # Coupon generation
│
└── entities/
    ├── SmartBuyLead.json          # Buyer lead schema
    ├── SmartBuyLead.json          # Buyer lead schema
    └── AppointmentRequest.json    # Appointment booking schema
```

---

## 🔗 Shared Infrastructure (`shared/`)

### Purpose
Cross-cutting functionality used by BOTH VTON and SmartBuy.

### Folder Structure

```
shared/
├── functions/                     # Shared Backend Functions
│   ├── Email & SMS
│   │   ├── sendSMS.js             # Twilio SMS delivery
│   │   ├── sendEmail.js           # Resend email delivery
│   │   ├── sendVerificationEmail.js
│   │   ├── sendLeadConfirmationEmail.js
│   │   ├── sendMeetingConfirmationEmail.js
│   │   ├── sendReferralInvite.js  # Referral email
│   │   └── twilioInboundSMS.js    # Inbound SMS handler
│   │
│   ├── Notifications
│   │   ├── notifyNewContactSubmission.js
│   │   ├── notifyNewMortgageApplication.js
│   │   ├── notifyNewLeadEmail.js
│   │   ├── notifyLeadSMS.js
│   │   ├── notifyConsultationBooked.js
│   │   ├── notifyReservedConsultation.js
│   │   ├── notifyQuizCompleted.js
│   │   ├── notifyNotInterested.js
│   │   ├── notifyOfficeLeadClosed.js
│   │   ├── notifyLeadClosedRefund.js
│   │   ├── notifyPartnerNewOpportunity.js
│   │   ├── notifyOnAnyChange.js
│   │   └── notifyLeadPageVisit.js
│   │
│   ├── Data & Integration
│   │   ├── fetchPropertyFromUrl.js
│   │   ├── getMapsConfig.js
│   │   ├── getExpertsByZipCode.js
│   │   ├── verifyPartner.js
│   │   ├── processReferralSignup.js
│   │   ├── geocodeLeadAddresses.js
│   │   ├── bookInterviewSlot.js
│   │   ├── bulkCreateOpportunities.js
│   │   └── securityScanAndFix.js
│   │
│   └── Misc
│       ├── notifyOnAnyChange.js  # Generic change notification
│       └── forfeitStaleOpportunities.js
│
├── components/                    # Shared UI Components
│   ├── ChatWidget.jsx             # Live chat widget
│   ├── AdminNavMenu.jsx           # Admin navigation menu
│   ├── StickyBanner.jsx           # Top banner
│   ├── VideoTestimonial.jsx       # Video testimonial player
│   ├── VideoTestimonialGallery.jsx # Gallery of testimonials
│   ├── GetStartedForm.jsx         # Get started CTA form
│   ├── ProcessSteps.jsx           # Process steps component
│   ├── LeadCaptureForm.jsx        # Generic lead form
│   ├── ApplicationProgressSteps.jsx
│   ├── UnifiedActivityTimeline.jsx # Activity log timeline
│   ├── ContactDetailView.jsx      # Contact details display
│   ├── LeadAndActivatorMap.jsx    # Map visualization
│   ├── LeadDetailModal.jsx        # Lead detail modal
│   ├── StatusEditor.jsx           # Status editing
│   │
│   ├── ui/                        # Shadcn/UI Components
│   │   ├── button/
│   │   ├── card/
│   │   ├── input/
│   │   ├── select/
│   │   ├── dialog/
│   │   ├── table/
│   │   ├── form/
│   │   ├── dropdown-menu/
│   │   ├── tabs/
│   │   ├── toast/
│   │   ├── tooltip/
│   │   └── ... (30+ UI components)
│   │
│   └── activator/
│       └── BulkProspectUpload.jsx
│
├── entities/                      # Shared Data Schemas
│   ├── User.json                  # App user profile
│   ├── ContactSubmission.json     # Contact form submission
│   ├── MortgageApplication.json   # Mortgage app
│   ├── BuyerRebateLead.json       # Buyer rebate lead
│   ├── Lead.json                  # Generic lead schema
│   ├── Report.json                # Report entity
│   ├── Referral.json              # Referral tracking
│   └── PartnerApplication.json    # Partner application
│
└── lib/                           # Utility Libraries
    ├── utils.js                   # Generic utilities
    ├── appConfig.js               # App configuration
    ├── app-params.js              # URL/storage parameters
    ├── query-client.js            # React Query config
    ├── AuthContext.jsx            # Auth context provider
    ├── usePageTitle.js            # Page title hook
    ├── use-mobile.jsx             # Mobile detection hook
    └── PageNotFound.jsx           # 404 page
```

---

## 🏠 App Core Files (`app/`)

### Purpose
Top-level application configuration and layout.

### Folder Structure

```
app/
├── App.jsx                        # Main app router & routes
├── Layout.jsx                     # Default page layout
├── index.css                      # Global CSS & design tokens
├── tailwind.config.js             # Tailwind configuration
├── main.jsx                       # React entry point
└── index.html                     # HTML entry point
```

### Key Files

**App.jsx** – Route definitions
- ~100+ routes for VTON, SmartBuy, public pages, admin dashboards
- Auth wrapper, loader states, error handling

**Layout.jsx** – Shared page layout
- Header with logo, nav, CTA buttons
- Footer with links, licensing info, trust badges
- Mobile-responsive design

**index.css** – Design system
- CSS variables (colors, fonts, spacing)
- Tailwind base layer customization
- Global styles

**tailwind.config.js** – Tailwind theme
- Color palette (primary, secondary, accent, destructive)
- Custom spacing, typography
- Responsive breakpoints

---

## 📊 File Statistics

```
Total Files:       ~500
├── React Components (.jsx):  ~200 files (~40K lines)
├── Backend Functions (.js):  ~100 files (~35K lines)
├── Entity Schemas (.json):   ~25 files
├── Documentation (.md):       ~10 files (~10K lines)
├── Config/Lib Files:          ~50 files (~5K lines)
└── UI Components:             ~50 files

Code Breakdown:
├── VTON Campaign:    ~30K lines
├── SmartBuy Campaign: ~8K lines
├── Shared Lib:        ~10K lines
└── App Core:          ~2K lines
```

---

## 🔍 How to Find Things

### "I need to modify lead intake..."
- **VTON leads:** `vton/pages/VTONScan.jsx` + `vton/functions/vtonBulkImportPropertyRadar.js`
- **SmartBuy leads:** `smartbuy/pages/SmartBuy.jsx` + `smartbuy/components/smartbuy/SmartBuyIntakeForm.jsx`

### "I need to change email notifications..."
- Generic emails: `shared/functions/sendEmail.js`
- VTON-specific: `vton/functions/notifyNewVTONLead.js`
- SmartBuy-specific: `smartbuy/functions/sendSmartBuyWelcomeSequence.js`

### "I need to add a new data field..."
- Find schema: `vton/entities/VTONLead.json` or `smartbuy/entities/SmartBuyLead.json`
- Add field to JSON schema
- Update components that display/edit that field
- Update backend functions that access that field

### "I need to see admin dashboards..."
- VTON admin: `vton/pages/AdminDashboard.jsx`, `vton/pages/VTONCampaignDashboard.jsx`
- SmartBuy admin: `smartbuy/pages/Marketplace.jsx`, `smartbuy/pages/SmartBuyWorkflow.jsx`
- Shared admin: `vton/pages/PropertyRadarDashboard.jsx`, `vton/pages/RouteOptimizationDashboard.jsx`

### "I need to test something..."
- VTON test functions: `vton/functions/testLobIntegration.js`, `vton/functions/testPropertyRadarImport.js`
- SmartBuy test: Use `/smartbuy-orchestrator` page
- Check logs in Base44 dashboard → Code → Functions

---

## 🚀 Quick Navigation

| Want to... | Location |
|-----------|----------|
| Add a VTON page | `vton/pages/*.jsx` + update `App.jsx` |
| Add a SmartBuy page | `smartbuy/pages/*.jsx` + update `App.jsx` |
| Create new backend function | `vton/functions/`, `smartbuy/functions/`, or `shared/functions/` |
| Modify entity schema | `vton/entities/`, `smartbuy/entities/`, or `shared/entities/` |
| Update notifications | `shared/functions/` or campaign-specific folders |
| Check architecture | Read `docs/` files in each campaign |
| Find UI component | `shared/components/ui/` or campaign-specific `components/` |

---

**Last Updated:** May 17, 2026