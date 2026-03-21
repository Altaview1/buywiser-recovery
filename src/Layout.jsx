import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Phone, ChevronDown, Menu, X, Home } from 'lucide-react';
import { useState } from 'react';

const serviceLinks = [
  { label: 'Refinance', path: 'Refinance', desc: 'Lower your rate or payment' },
  { label: 'FHA Streamline', path: 'FHAStreamline', desc: 'Simplified FHA refinance' },
  { label: 'VA Streamline', path: 'VAStreamline', desc: 'IRRRL for eligible veterans' },
  { label: 'Cash-Out Options', path: 'CashOut', desc: 'Access your home equity' },
  { label: 'Home Purchase', path: 'Purchase', desc: 'Buy with confidence' },
];

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

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
                <div className="text-xs text-slate-500 hidden sm:block">California Mortgage Experts</div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-50 rounded-md transition">Home</Link>

              <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-50 rounded-md transition">
                  Loan Options <ChevronDown className="h-3.5 w-3.5 mt-0.5" />
                </button>
                {servicesOpen && (
                  <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                    {serviceLinks.map((link) => (
                      <Link key={link.path} to={createPageUrl(link.path)} className="block px-4 py-2.5 hover:bg-gray-50 transition group" onClick={() => setServicesOpen(false)}>
                        <div className="text-sm font-medium text-slate-800 group-hover:text-green-700">{link.label}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{link.desc}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to={createPageUrl('About')} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-50 rounded-md transition">About</Link>
              <Link to={createPageUrl('Reviews')} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-50 rounded-md transition">Reviews</Link>
              <Link to={createPageUrl('MortgageCalculators')} className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-gray-50 rounded-md transition">Calculators</Link>
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <a href="tel:+18183002642" className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-green-600 transition font-medium">
                <Phone className="h-4 w-4" />(818) 300-2642
              </a>
              <Link to={createPageUrl('ContactUs')} className="px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition shadow-sm">
                Request a Review
              </Link>
            </div>

            <div className="flex items-center gap-3 lg:hidden">
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
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-3 space-y-0.5">
              <Link to="/" className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>Home</Link>
              <div>
                <button className="w-full text-left px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 rounded-lg flex items-center justify-between" onClick={() => setMobileServicesOpen(!mobileServicesOpen)}>
                  Loan Options <ChevronDown className={`h-4 w-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileServicesOpen && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {serviceLinks.map((link) => (
                      <Link key={link.path} to={createPageUrl(link.path)} className="block px-3 py-2 text-sm text-slate-600 hover:text-green-700 hover:bg-green-50 rounded-lg" onClick={() => { setMobileOpen(false); setMobileServicesOpen(false); }}>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link to={createPageUrl('About')} className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>About</Link>
              <Link to={createPageUrl('Reviews')} className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>Reviews</Link>
              <Link to={createPageUrl('MortgageCalculators')} className="block px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50 rounded-lg" onClick={() => setMobileOpen(false)}>Calculators</Link>
              <div className="pt-2">
                <Link to={createPageUrl('ContactUs')} className="block px-3 py-3 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg text-center" onClick={() => setMobileOpen(false)}>
                  Request a Mortgage Review
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

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
                  <div className="text-xs text-slate-400">California Mortgage Experts</div>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Helping California homeowners and buyers navigate mortgage decisions with clarity and confidence.
              </p>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Company NMLS: 1887767</p>
                <p className="text-xs text-slate-500">Personal NMLS: 1524446</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Loan Options</h4>
              <div className="space-y-2">
                {serviceLinks.map((link) => (
                  <Link key={link.path} to={createPageUrl(link.path)} className="block text-sm text-slate-400 hover:text-white transition">{link.label}</Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <div className="space-y-2">
                <Link to={createPageUrl('About')} className="block text-sm text-slate-400 hover:text-white transition">About</Link>
                <Link to={createPageUrl('Reviews')} className="block text-sm text-slate-400 hover:text-white transition">Reviews</Link>
                <Link to={createPageUrl('ContactUs')} className="block text-sm text-slate-400 hover:text-white transition">Contact</Link>
                <Link to={createPageUrl('MortgageCalculators')} className="block text-sm text-slate-400 hover:text-white transition">Calculators</Link>
                <Link to={createPageUrl('PrivacyPolicy')} className="block text-sm text-slate-400 hover:text-white transition">Privacy Policy</Link>
                <Link to={createPageUrl('Disclosures')} className="block text-sm text-slate-400 hover:text-white transition">Licensing & Disclosures</Link>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-slate-400 mb-4">
                <p>5115 Lankershim Blvd #705<br />North Hollywood, CA 91601</p>
                <a href="tel:+18183002642" className="block hover:text-white transition">(818) 300-2642</a>
                <a href="mailto:bennett@buywiser.com" className="block hover:text-white transition">bennett@buywiser.com</a>
              </div>
              <Link to={createPageUrl('ContactUs')} className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition">
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