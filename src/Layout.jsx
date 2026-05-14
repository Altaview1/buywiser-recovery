import { Link } from 'react-router-dom';
import StickyBanner from './components/StickyBanner';
import { createPageUrl } from './utils';
import { Phone, Menu, X, ArrowRight, LayoutDashboard, Users, MapPin, QrCode, DollarSign, UserCheck, ClipboardList } from 'lucide-react';
import { useState, useEffect } from 'react';
import ChatWidget from './components/ChatWidget';
import { base44 } from '@/api/base44Client';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Refinance Review', path: '/Contact' },
  { label: 'Cash-Out', path: createPageUrl('CashOut') },
  { label: 'FHA Streamline', path: createPageUrl('FHAStreamline') },
  { label: 'VA Streamline', path: createPageUrl('VAStreamline') },
  { label: 'Calculators', path: createPageUrl('Calculators') },
  { label: 'Reviews', path: createPageUrl('Reviews') },
  { label: 'About', path: createPageUrl('About') },
  { label: 'Contact', path: createPageUrl('Contact') },
];

const footerLinks = [
  { label: 'Refinance Review', path: '/Contact' },
  { label: 'Cash-Out', path: createPageUrl('CashOut') },
  { label: 'FHA Streamline', path: createPageUrl('FHAStreamline') },
  { label: 'VA Streamline', path: createPageUrl('VAStreamline') },
  { label: 'Home Purchase', path: createPageUrl('Purchase') },
];

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const isAuthed = await base44.auth.isAuthenticated();
        if (isAuthed) {
          const currentUser = await base44.auth.me();
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };
    
    loadUser();
  }, []);

  const adminLinks = [
    { label: 'Admin Dashboard', icon: LayoutDashboard, path: '/activator-admin' },
    { label: 'Admin Settings', icon: ClipboardList, path: '/admin-settings' },
    { label: 'Field Operations', icon: MapPin, path: '/field-rep-dashboard' },
    { label: 'QR Scan Dashboard', icon: QrCode, path: '/qr-scans' },
    { label: 'Management', icon: Users, path: '/management-dashboard' },
  ];

  const partnerLinks = [
    { label: 'My Opportunities', icon: LayoutDashboard, path: '/partner' },
    { label: 'My Leads', icon: Users, path: '/prospects' },
  ];

  const portalLinks = user?.role === 'admin' ? adminLinks : user ? partnerLinks : [];

  return (
    <div className="min-h-screen flex flex-col bg-white pb-16 lg:pb-0">
      <StickyBanner />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-10 w-auto" />
              <div className="text-xs text-slate-500 hidden sm:block leading-tight">California's Boutique Mortgage Experts Since 1991</div>
            </Link>

            <nav className="hidden xl:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.path} className="px-2.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-50 rounded-md transition whitespace-nowrap">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden xl:flex items-center gap-4">
              <a href="/activator-admin" className="px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition border border-slate-700">
                ⚙️ Admin Sign In
              </a>
              <a href="/partner" className="text-sm text-slate-600 hover:text-slate-900 transition font-medium">
                Agent Sign In
              </a>
              <a href="tel:+18183002642" className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-700 transition font-medium">
                <Phone className="h-4 w-4" />(818) 300-2642
              </a>
              <Link to={createPageUrl('Contact')} className="px-5 py-2 bg-blue-800 text-white text-sm font-semibold rounded-lg hover:bg-blue-900 transition shadow-sm">
                Request My Review
              </Link>
            </div>

            <div className="flex items-center gap-2 xl:hidden">
              <a href="/activator-admin" className="px-3 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition border border-slate-700">
                ⚙️ Admin
              </a>
              <a href="tel:+18183002642" className="flex items-center gap-1 text-sm font-semibold text-blue-700">
                <Phone className="h-4 w-4" />Call
              </a>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-slate-700 rounded-md">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="xl:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-0.5">
              {/* Main nav links */}
              {navLinks.map((link) => (
                <Link key={link.label} to={link.path} className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}

              {/* Portal links for logged-in users */}
              {portalLinks.length > 0 && (
                <>
                  <div className="pt-2 pb-1 px-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{user?.role === 'admin' ? 'Admin Portals' : 'Partner Portal'}</p>
                  </div>
                  {portalLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a key={link.path} href={link.path} className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                        <Icon className="h-4 w-4" /> {link.label}
                      </a>
                    );
                  })}
                </>
              )}

              {/* Public portals always visible */}
              <div className="pt-2 pb-1 px-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Portals</p>
              </div>
              <a href="/vton-scan" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                🎖️ Veteran Benefit Scan
              </a>
              <a href="/partner" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                🤝 Partner Sign In
              </a>
              <a href="/field-activator" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                📍 Field Activator Portal
              </a>

              {user && (
                <button onClick={() => { base44.auth.logout('/'); setMobileOpen(false); }}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg mt-1">
                  Sign Out
                </button>
              )}

              <div className="pt-2">
                <Link to={createPageUrl('Contact')} className="block px-3 py-3 text-sm font-semibold text-white bg-blue-800 hover:bg-blue-900 rounded-lg text-center" onClick={() => setMobileOpen(false)}>
                  Request My Review
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>
      <ChatWidget />

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 shadow-lg px-4 py-3 flex gap-3">
        <a href="tel:+18183002642" className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-blue-700 text-blue-800 rounded-xl font-bold text-sm">
          <Phone className="h-4 w-4" /> Call Now
        </a>
        <Link to={createPageUrl('Contact')} className="flex-1 flex items-center justify-center gap-1 py-3 bg-blue-800 text-white rounded-xl font-bold text-sm">
          Request a Review <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="https://media.base44.com/images/public/69984fca7363ecc074d7a3fc/ce4df4224_buywiserlogo.png" alt="BuyWiser" className="h-9 w-auto brightness-0 invert" />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Helping California homeowners evaluate refinance options with clarity and no pressure.
              </p>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Company NMLS: 1887767</p>
                <p className="text-xs text-slate-500">Personal NMLS: 1524446</p>
                <p className="text-xs text-slate-500">CA RE License: 01107013</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Refinance Options</h4>
              <div className="space-y-2">
                {footerLinks.map((link) => (
                  <Link key={link.label} to={link.path} className="block text-sm text-slate-400 hover:text-white transition">{link.label}</Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <div className="space-y-2">
                <Link to={createPageUrl('About')} className="block text-sm text-slate-400 hover:text-white transition">About</Link>
                <Link to={createPageUrl('Reviews')} className="block text-sm text-slate-400 hover:text-white transition">Reviews</Link>
                <Link to={createPageUrl('Contact')} className="block text-sm text-slate-400 hover:text-white transition">Contact</Link>
                <Link to={createPageUrl('Calculators')} className="block text-sm text-slate-400 hover:text-white transition">Calculators</Link>
                <Link to={createPageUrl('PrivacyPolicy')} className="block text-sm text-slate-400 hover:text-white transition">Privacy Policy</Link>
                <Link to={createPageUrl('Disclosures')} className="block text-sm text-slate-400 hover:text-white transition">Licensing &amp; Disclosures</Link>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-slate-400 mb-4">
                <a href="tel:+18183002642" className="block hover:text-white transition">(818) 300-2642</a>
                <a href="mailto:bennett@buywiser.com" className="block hover:text-white transition">bennett@buywiser.com</a>
              </div>
              <Link to={createPageUrl('Contact')} className="inline-block px-4 py-2 bg-amber-400 text-blue-900 text-sm font-bold rounded-lg hover:bg-amber-300 transition">
                Request a Review →
              </Link>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="border-t border-slate-800 pt-6 mb-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* Equal Housing Lender */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 rounded-lg border border-slate-700">
                <svg className="h-7 w-7 text-slate-300 flex-shrink-0" viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4L2 16h4v20h28V16h4L20 4zm0 3.5L34 17v1h-2V34H8V18H6L20 7.5zM16 20h8v2h-8v-2zm0 4h8v2h-8v-2z"/>
                </svg>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 leading-tight">Equal Housing</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 leading-tight">Lender</p>
                </div>
              </div>

              {/* NMLS */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 rounded-lg border border-slate-700">
                <div className="w-7 h-7 rounded bg-blue-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[9px] font-black">NMLS</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 leading-tight">NMLS Registered</p>
                  <p className="text-[10px] text-slate-400 leading-tight">#1887767</p>
                </div>
              </div>

              {/* CA DFPI Licensed */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 rounded-lg border border-slate-700">
                <div className="w-7 h-7 rounded bg-amber-600 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 leading-tight">CA DFPI</p>
                  <p className="text-[10px] text-slate-400 leading-tight">Licensed Lender</p>
                </div>
              </div>

              {/* SSL Secure */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 rounded-lg border border-slate-700">
                <div className="w-7 h-7 rounded bg-green-700 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 leading-tight">SSL Secure</p>
                  <p className="text-[10px] text-slate-400 leading-tight">256-bit Encrypted</p>
                </div>
              </div>

              {/* BBB */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 rounded-lg border border-slate-700">
                <div className="w-7 h-7 rounded bg-blue-900 border border-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[9px] font-black">BBB</span>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 leading-tight">BBB Accredited</p>
                  <p className="text-[10px] text-slate-400 leading-tight">Business</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                BuyWiser Technology, Inc. DBA BuyWiser Home Loans. Company NMLS #1887767. Individual NMLS #1524446. Licensed by the California Department of Financial Protection and Innovation (DFPI) under the California Residential Mortgage Lending Act (CRMLA). This is not a commitment to lend. All loan programs subject to borrower qualification. Rates and terms subject to change without notice. Equal Housing Opportunity.
              </p>
              <p className="text-xs text-slate-500 flex-shrink-0">© {new Date().getFullYear()} BuyWiser Technology, Inc.<br />All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}