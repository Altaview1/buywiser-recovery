import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Phone, Menu, X, Home, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import ChatWidget from './components/ChatWidget';

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

  return (
    <div className="min-h-screen flex flex-col bg-white pb-16 lg:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-base font-bold text-slate-900">BuyWiser Home Loans</div>
                <div className="text-xs text-slate-500 hidden sm:block">California's Boutique Mortgage Experts Since 1991</div>
              </div>
            </Link>

            <nav className="hidden xl:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.path} className="px-2.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-50 rounded-md transition whitespace-nowrap">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden xl:flex items-center gap-4">
              <a href="tel:+18183002642" className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-green-600 transition font-medium">
                <Phone className="h-4 w-4" />(818) 300-2642
              </a>
              <Link to={createPageUrl('Contact')} className="px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition shadow-sm">
                Request My Review
              </Link>
            </div>

            <div className="flex items-center gap-3 xl:hidden">
              <a href="tel:+18183002642" className="flex items-center gap-1 text-sm font-semibold text-green-600">
                <Phone className="h-4 w-4" />Call
              </a>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-slate-700 rounded-md">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="xl:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-0.5">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.path} className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-2">
                <Link to={createPageUrl('Contact')} className="block px-3 py-3 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg text-center" onClick={() => setMobileOpen(false)}>
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
        <a href="tel:+18183002642" className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-green-600 text-green-700 rounded-xl font-bold text-sm">
          <Phone className="h-4 w-4" /> Call Now
        </a>
        <Link to={createPageUrl('Contact')} className="flex-1 flex items-center justify-center gap-1 py-3 bg-green-600 text-white rounded-xl font-bold text-sm">
          Request a Review <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Home className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm leading-tight">BuyWiser Home Loans</div>
                  <div className="text-xs text-slate-400">Boutique Mortgage Experts Since 1991</div>
                </div>
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
                <p>5115 Lankershim Blvd #705<br />North Hollywood, CA 91601</p>
                <a href="tel:+18183002642" className="block hover:text-white transition">(818) 300-2642</a>
                <a href="mailto:bennett@buywiser.com" className="block hover:text-white transition">bennett@buywiser.com</a>
              </div>
              <Link to={createPageUrl('Contact')} className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition">
                Request a Review →
              </Link>
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