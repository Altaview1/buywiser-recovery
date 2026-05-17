import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

const NAV_SECTIONS = [
  {
    label: '🏠 Public Site',
    links: [
      { label: 'Home', path: '/' },
      { label: 'About', path: '/About' },
      { label: 'Reviews', path: '/Reviews' },
      { label: 'Contact / Refinance Review', path: '/Contact' },
      { label: 'Calculators', path: '/Calculators' },
      { label: 'FHA Streamline', path: '/FHAStreamline' },
      { label: 'VA Streamline', path: '/VAStreamline' },
      { label: 'Cash-Out', path: '/CashOut' },
      { label: 'Home Purchase', path: '/Purchase' },
      { label: 'Mortgage FAQ', path: '/MortgageFAQ' },
      { label: 'FAQ', path: '/FAQ' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms & Conditions', path: '/terms' },
      { label: 'Disclosures', path: '/Disclosures' },
    ]
  },
  {
    label: '🎖️ VTON / Veteran',
    links: [
      { label: 'VTON Scan (Lead Intake)', path: '/vton-scan' },
      { label: 'VTON Benefit Booking', path: '/vton-benefit' },
      { label: 'VTON Personalized Landing', path: '/vton-personalized' },
      { label: 'VTON Testimonials', path: '/vton-testimonials' },
      { label: 'VTON QR Scan Test', path: '/vton-qr-scan-test' },
    ]
  },
  {
    label: '⚙️ Admin Portals',
    links: [
      { label: 'Admin Login', path: '/admin-login' },
      { label: 'Admin Dashboard', path: '/activator-admin' },
      { label: 'Admin Settings', path: '/admin-settings' },
      { label: 'VTON Campaign Dashboard', path: '/vton-campaign' },
      { label: 'VTON Mail Dashboard', path: '/vton-mail-dashboard' },
      { label: 'VTON Letter Template Review', path: '/vton-letter-review' },
      { label: 'VTON Email History', path: '/vton-email-history' },
      { label: 'VTON Lob Errors', path: '/vton-lob-errors' },
      { label: 'Leads Dashboard', path: '/leads' },
      { label: 'Prospects Dashboard', path: '/prospects' },
      { label: 'Partner Leads', path: '/partner-leads' },
      { label: 'Management Dashboard', path: '/management-dashboard' },
      { label: 'PropertyRadar Dashboard', path: '/property-radar' },
    ]
  },
  {
    label: '🤝 Partners',
    links: [
      { label: 'Partner Dashboard', path: '/partner' },
      { label: 'Agent QR Dashboard', path: '/agent-qr' },
      { label: 'Personalized Benefit', path: '/b' },
    ]
  },
  {
    label: '📍 Field Activators',
    links: [
      { label: 'Field Activator Portal', path: '/field-activator' },
      { label: 'Field Activator Dashboard', path: '/activator' },
      { label: 'Field Rep Dashboard', path: '/field-rep-dashboard' },
      { label: 'FA Onboarding', path: '/fa-onboarding' },
      { label: 'QR Scan Dashboard', path: '/qr-scans' },
      { label: 'Sales Coach', path: '/sales-coach' },
      { label: 'Resources', path: '/resources' },
    ]
  },
  {
    label: '🏡 SmartBuy / Buyer',
    links: [
      { label: 'SmartBuy', path: '/smartbuy' },
      { label: 'SmartBuy Workflow', path: '/smartbuy-workflow' },
      { label: 'Buyer Cash Back', path: '/cashback' },
      { label: 'Marketplace', path: '/marketplace' },
      { label: 'Our Experts', path: '/our-experts' },
      { label: 'Token Rewind', path: '/token-rewind' },
      { label: 'Token Available FAQ', path: '/token-available-faq' },
      { label: 'My Profile', path: '/my-profile' },
    ]
  },
  {
    label: '📋 Other',
    links: [
      { label: 'Portal Hub', path: '/portals' },
      { label: 'Mortgage AI', path: '/MortgageAI' },
      { label: 'Apply Now', path: '/Apply' },
    ]
  },
];

export default function AdminNavMenu() {
  const [open, setOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navigate = (path) => {
    window.location.href = path;
    setOpen(false);
  };

  return (
    <div ref={ref} className="fixed bottom-6 right-6 z-[9999]">
      {/* Menu panel */}
      {open && (
        <div className="absolute bottom-14 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden mb-2"
          style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <div className="sticky top-0 bg-slate-900 px-4 py-3 flex items-center justify-between">
            <span className="text-white font-bold text-sm">App Navigation</span>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="py-1">
            {NAV_SECTIONS.map((section) => (
              <div key={section.label}>
                <button
                  onClick={() => setExpandedSection(expandedSection === section.label ? null : section.label)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest hover:bg-slate-50 transition"
                >
                  <span>{section.label}</span>
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expandedSection === section.label ? 'rotate-90' : ''}`} />
                </button>
                {expandedSection === section.label && (
                  <div className="bg-slate-50 border-t border-b border-slate-100">
                    {section.links.map((link) => (
                      <button
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        className="w-full text-left px-6 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
                      >
                        {link.label}
                        <span className="ml-1 text-xs text-slate-400">{link.path}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 bg-slate-900 hover:bg-slate-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all"
        title="App Navigation"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </div>
  );
}