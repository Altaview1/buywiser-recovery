import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './Layout.jsx';

// Page imports
import Home from './pages/Home';
import MortgageApplication from './pages/MortgageApplication';
import Contact from './pages/Contact';
import Calculators from './pages/Calculators';
import Refinance from './pages/Refinance';
import FHAStreamline from './pages/FHAStreamline';
import VAStreamline from './pages/VAStreamline';
import CashOut from './pages/CashOut';
import Purchase from './pages/Purchase';
import About from './pages/About';
import Reviews from './pages/Reviews';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclosures from './pages/Disclosures';
import MortgageAI from './pages/MortgageAI';
import BuywiserHome from './pages/BuywiserHome';
import LeadsDashboard from './pages/LeadsDashboard';
import FlagWatermark from './components/FlagWatermark';
import AdminNavMenu from './components/AdminNavMenu';

import PartnerDashboard from './pages/PartnerDashboard';
import PersonalizedBenefit from './pages/PersonalizedBenefit';
import AgentQRDashboard from './pages/AgentQRDashboard';
import FAQ from './pages/FAQ';
import MortgageFAQ from './pages/MortgageFAQ';
import ProspectsDashboard from './pages/ProspectsDashboard';
import PartnerLeadsDashboard from './pages/PartnerLeadsDashboard';
import AdminSettings from './pages/AdminSettings';
import VTONScan from './pages/VTONScan';
import FieldActivatorDashboard from './pages/FieldActivatorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FieldActivatorPortal from './pages/FieldActivatorPortal';
import SalesCoachChat from './pages/SalesCoachChat';
import ManagementDashboard from './pages/ManagementDashboard';
import ResourceHub from './pages/ResourceHub';
import FieldRepDashboard from './pages/FieldRepDashboard';
import FieldActivatorOnboarding from './pages/FieldActivatorOnboarding';
import QRScanDashboard from './pages/QRScanDashboard';
import PortalHubPage from './pages/PortalHubPage';
import BuyerCashBack from './pages/BuyerCashBack';
import SmartBuy from './pages/SmartBuy';
import SmartBuyOrchestrator from './components/smartbuy/SmartBuyOrchestrator';
import TokenRewindPage from './pages/TokenRewindPage';
import Marketplace from './pages/Marketplace';
import OurExperts from './pages/OurExperts';
import TokenAvailableFAQ from './pages/TokenAvailableFAQ';
import MyProfile from './pages/MyProfile';
import SmartBuyWorkflow from './pages/SmartBuyWorkflow';
import VTONBenefitBooking from './pages/VTONBenefitBooking';
import VTONCampaignDashboard from './pages/VTONCampaignDashboard';
import VTONLetterTemplateReview from './pages/VTONLetterTemplateReview';
import VTONEmailHistory from './pages/VTONEmailHistory';
import VTONMailDashboard from './pages/VTONMailDashboard';
import VTONLobErrorDashboard from './pages/VTONLobErrorDashboard';
import VTONQRScanTest from './pages/VTONQRScanTest';
import VTONTestimonials from './pages/VTONTestimonials';
import VTONPersonalizedLanding from './pages/VTONPersonalizedLanding';
import AdminLogin from './pages/AdminLogin';
import PrivacyPolicy2 from './pages/PrivacyPolicy2';
import TermsAndConditions from './pages/TermsAndConditions';
import PropertyRadarDashboard from './pages/PropertyRadarDashboard';
import VTONArchitectureMap from './pages/VTONArchitectureMap';
import ReferralProgram from './pages/ReferralProgram';
import RouteOptimizationDashboard from './pages/RouteOptimizationDashboard';
import StaffingNeedsReport from './pages/StaffingNeedsReport';
import LeadPipelineBoard from './pages/LeadPipelineBoard';
import MobileLeadDashboard from './pages/MobileLeadDashboard';

const LayoutWrapper = ({ children, currentPageName }) => (
  <Layout currentPageName={currentPageName}>{children}</Layout>
);

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/Apply" element={<MortgageApplication />} />
      <Route path="/Contact" element={<LayoutWrapper currentPageName="Contact"><Contact /></LayoutWrapper>} />
      <Route path="/Calculators" element={<LayoutWrapper currentPageName="Calculators"><Calculators /></LayoutWrapper>} />
      <Route path="/Refinance" element={<LayoutWrapper currentPageName="Refinance"><Refinance /></LayoutWrapper>} />
      <Route path="/FHAStreamline" element={<LayoutWrapper currentPageName="FHAStreamline"><FHAStreamline /></LayoutWrapper>} />
      <Route path="/VAStreamline" element={<LayoutWrapper currentPageName="VAStreamline"><VAStreamline /></LayoutWrapper>} />
      <Route path="/CashOut" element={<LayoutWrapper currentPageName="CashOut"><CashOut /></LayoutWrapper>} />
      <Route path="/Purchase" element={<LayoutWrapper currentPageName="Purchase"><Purchase /></LayoutWrapper>} />
      <Route path="/About" element={<LayoutWrapper currentPageName="About"><About /></LayoutWrapper>} />
      <Route path="/Reviews" element={<LayoutWrapper currentPageName="Reviews"><Reviews /></LayoutWrapper>} />
      <Route path="/PrivacyPolicy" element={<LayoutWrapper currentPageName="PrivacyPolicy"><PrivacyPolicy /></LayoutWrapper>} />
      <Route path="/Disclosures" element={<LayoutWrapper currentPageName="Disclosures"><Disclosures /></LayoutWrapper>} />
      <Route path="/MortgageAI" element={<MortgageAI />} />
      <Route path="/BuywiserHome" element={<BuywiserHome />} />
      <Route path="/leads" element={<LeadsDashboard />} />
      <Route path="/partner" element={<PartnerDashboard />} />
      <Route path="/b" element={<PersonalizedBenefit />} />
      <Route path="/agent-qr" element={<AgentQRDashboard />} />
      <Route path="/FAQ" element={<LayoutWrapper currentPageName="FAQ"><FAQ /></LayoutWrapper>} />
      <Route path="/MortgageFAQ" element={<LayoutWrapper currentPageName="MortgageFAQ"><MortgageFAQ /></LayoutWrapper>} />
      <Route path="/activator" element={<FieldActivatorDashboard />} />
      {/* Field Activator Portal & Coach */}
      <Route path="/field-activator" element={<FieldActivatorPortal />} />
      <Route path="/sales-coach" element={<SalesCoachChat />} />

      {/* Admin Routes */}
      <Route path="/management-dashboard" element={<ManagementDashboard />} />
      <Route path="/resources" element={<ResourceHub />} />

      {/* Field Rep Portal */}
      <Route path="/field-rep-dashboard" element={<FieldRepDashboard />} />
      <Route path="/fa-onboarding" element={<FieldActivatorOnboarding />} />
      <Route path="/qr-scans" element={<QRScanDashboard />} />

      {/* Redirects for old/alternate URLs */}
      <Route path="/ApplyNow" element={<Navigate to="/Apply" replace />} />
      <Route path="/ContactUs" element={<Navigate to="/Contact" replace />} />
      <Route path="/MortgageCalculators" element={<Navigate to="/Calculators" replace />} />
      <Route path="/MortgageReview" element={<Navigate to="/Apply" replace />} />
      <Route path="/vton-partner" element={<Navigate to="/vton" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <FlagWatermark />
        <AdminNavMenu />
        <Routes>
          {/* Public portals — NO auth required */}
          <Route path="/" element={<BuywiserHome />} />
          <Route path="/portals" element={<PortalHubPage />} />
          <Route path="/vton" element={<BuywiserHome />} />
          <Route path="/vton-home" element={<BuywiserHome />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="/vton-scan" element={<VTONScan />} />
          <Route path="/vton-benefit" element={<VTONBenefitBooking />} />
          <Route path="/vton-campaign" element={<VTONCampaignDashboard />} />
          <Route path="/vton-letter-review" element={<VTONLetterTemplateReview />} />
          <Route path="/vton-email-history" element={<VTONEmailHistory />} />
          <Route path="/vton-mail-dashboard" element={<VTONMailDashboard />} />
          <Route path="/vton-lob-errors" element={<VTONLobErrorDashboard />} />
          <Route path="/vton-qr-scan-test" element={<VTONQRScanTest />} />
          <Route path="/vton-testimonials" element={<VTONTestimonials />} />
          <Route path="/vton-personalized/:leadId" element={<VTONPersonalizedLanding />} />
          <Route path="/vton-personalized" element={<VTONPersonalizedLanding />} />
          <Route path="/privacy" element={<PrivacyPolicy2 />} />
          <Route path="/property-radar" element={<PropertyRadarDashboard />} />
          <Route path="/vton-architecture" element={<VTONArchitectureMap />} />
          <Route path="/referral" element={<ReferralProgram />} />
          <Route path="/route-optimization" element={<RouteOptimizationDashboard />} />
          <Route path="/staffing-report" element={<StaffingNeedsReport />} />
          <Route path="/lead-pipeline" element={<LeadPipelineBoard />} />
          <Route path="/mobile-leads" element={<MobileLeadDashboard />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/prospects" element={<ProspectsDashboard />} />
          <Route path="/partner-leads" element={<PartnerLeadsDashboard />} />
          <Route path="/activator-admin" element={<AuthProvider><AdminDashboard /></AuthProvider>} />
          <Route path="/admin-settings" element={<AdminSettings />} />
          <Route path="/cashback" element={<BuyerCashBack />} />
          <Route path="/smartbuy" element={<SmartBuy />} />
          <Route path="/smartbuy-orchestrator" element={<SmartBuyOrchestrator />} />
          <Route path="/token-rewind" element={<TokenRewindPage />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/our-experts" element={<OurExperts />} />
          <Route path="/token-available-faq" element={<TokenAvailableFAQ />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/smartbuy-workflow" element={<SmartBuyWorkflow />} />
          <Route path="/Apply" element={<MortgageApplication />} />
          <Route path="/Contact" element={<LayoutWrapper currentPageName="Contact"><Contact /></LayoutWrapper>} />
          <Route path="/Calculators" element={<LayoutWrapper currentPageName="Calculators"><Calculators /></LayoutWrapper>} />
          <Route path="/Refinance" element={<LayoutWrapper currentPageName="Refinance"><Refinance /></LayoutWrapper>} />
          <Route path="/FHAStreamline" element={<LayoutWrapper currentPageName="FHAStreamline"><FHAStreamline /></LayoutWrapper>} />
          <Route path="/VAStreamline" element={<LayoutWrapper currentPageName="VAStreamline"><VAStreamline /></LayoutWrapper>} />
          <Route path="/CashOut" element={<LayoutWrapper currentPageName="CashOut"><CashOut /></LayoutWrapper>} />
          <Route path="/Purchase" element={<LayoutWrapper currentPageName="Purchase"><Purchase /></LayoutWrapper>} />
          <Route path="/About" element={<LayoutWrapper currentPageName="About"><About /></LayoutWrapper>} />
          <Route path="/Reviews" element={<LayoutWrapper currentPageName="Reviews"><Reviews /></LayoutWrapper>} />
          <Route path="/PrivacyPolicy" element={<LayoutWrapper currentPageName="PrivacyPolicy"><PrivacyPolicy /></LayoutWrapper>} />
          <Route path="/Disclosures" element={<LayoutWrapper currentPageName="Disclosures"><Disclosures /></LayoutWrapper>} />
          <Route path="/MortgageAI" element={<MortgageAI />} />
          <Route path="/BuywiserHome" element={<BuywiserHome />} />
          <Route path="/leads" element={<LeadsDashboard />} />
          <Route path="/partner" element={<PartnerDashboard />} />
          <Route path="/b" element={<PersonalizedBenefit />} />
          <Route path="/agent-qr" element={<AgentQRDashboard />} />
          <Route path="/FAQ" element={<LayoutWrapper currentPageName="FAQ"><FAQ /></LayoutWrapper>} />
          <Route path="/MortgageFAQ" element={<LayoutWrapper currentPageName="MortgageFAQ"><MortgageFAQ /></LayoutWrapper>} />
          <Route path="/activator" element={<FieldActivatorDashboard />} />
          <Route path="/field-activator" element={<FieldActivatorPortal />} />
          <Route path="/sales-coach" element={<SalesCoachChat />} />
          <Route path="/management-dashboard" element={<ManagementDashboard />} />
          <Route path="/resources" element={<ResourceHub />} />
          <Route path="/field-rep-dashboard" element={<FieldRepDashboard />} />
          <Route path="/fa-onboarding" element={<FieldActivatorOnboarding />} />
          <Route path="/qr-scans" element={<QRScanDashboard />} />
          <Route path="/ApplyNow" element={<Navigate to="/Apply" replace />} />
          <Route path="/ContactUs" element={<Navigate to="/Contact" replace />} />
          <Route path="/MortgageCalculators" element={<Navigate to="/Calculators" replace />} />
          <Route path="/MortgageReview" element={<Navigate to="/Apply" replace />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;