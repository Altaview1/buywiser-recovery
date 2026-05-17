import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

// SmartBuy Buyer Pipeline ONLY — completely separate from VTON/Veteran campaign
const SMARTBUY_SECTIONS = [
  {
    label: '🏡 Buyer Journey',
    links: [
      { label: 'SmartBuy Home', path: '/smartbuy' },
      { label: 'SmartBuy Workflow', path: '/smartbuy-workflow' },
      { label: 'Buyer Cash Back', path: '/cashback' },
      { label: 'Token Rewind (Savings Guarantee)', path: '/token-rewind' },
      { label: 'Token Available FAQ', path: '/token-available-faq' },
      { label: 'My Profile', path: '/my-profile' },
      { label: '🎁 Refer a Friend — Earn $500', path: '/referral' },
    ]
  },
  {
    label: '🛒 Marketplace & Experts',
    links: [
      { label: 'Marketplace', path: '/marketplace' },
      { label: 'Our Experts', path: '/our-experts' },
    ]
  },
  {
    label: '🏠 BuyWiser Main Site',
    links: [
      { label: 'Home', path: '/' },
      { label: 'About', path: '/About' },
      { label: 'Contact / Get a Review', path: '/Contact' },
      { label: 'Calculators', path: '/Calculators' },
      { label: 'Reviews', path: '/Reviews' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Disclosures', path: '/Disclosures' },
    ]
  },
];

export default function SmartBuyNavMenu() {
  const [open, setOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const ref = useRef(null);

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
      {open && (
        <div
          className="absolute bottom-14 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-emerald-200 overflow-hidden mb-2"
          style={{ maxHeight: '80vh', overflowY: 'auto' }}
        >
          {/* Header — emerald to distinguish from VTON/Admin slate menu */}
          <div className="sticky top-0 bg-emerald-800 px-4 py-3 flex items-center justify-between">
            <div>
              <span className="text-white font-bold text-sm">🏡 SmartBuy™ Navigation</span>
              <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest mt-0.5">Buyer Rebate Pipeline</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-emerald-300 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="py-1">
            {SMARTBUY_SECTIONS.map((section) => (
              <div key={section.label}>
                <button
                  onClick={() => setExpandedSection(expandedSection === section.label ? null : section.label)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest hover:bg-emerald-50 transition"
                >
                  <span>{section.label}</span>
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expandedSection === section.label ? 'rotate-90' : ''}`} />
                </button>
                {expandedSection === section.label && (
                  <div className="bg-emerald-50 border-t border-b border-emerald-100">
                    {section.links.map((link) => (
                      <button
                        key={link.path}
                        onClick={() => navigate(link.path)}
                        className="w-full text-left px-6 py-2 text-sm text-slate-700 hover:bg-emerald-100 hover:text-emerald-800 transition"
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

      {/* Toggle button — emerald to clearly distinguish from Admin's slate button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 bg-emerald-700 hover:bg-emerald-600 text-white rounded-full shadow-xl flex items-center justify-center transition-all"
        title="SmartBuy Navigation"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
    </div>
  );
}