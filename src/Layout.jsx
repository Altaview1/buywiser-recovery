import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Home, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ChatWidget from './components/ChatWidget';

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex items-center">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Home className="h-8 w-8 text-white" />
                </div>
                <div className="ml-3">
                  <div className="text-xl font-bold text-gray-900">Buy Wiser</div>
                  <div className="text-xs text-gray-600">Mortgage Solutions</div>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to={createPageUrl('Home')} className="text-gray-700 hover:text-green-600 transition">
                Home
              </Link>
              <Link to={createPageUrl('Purchase')} className="text-gray-700 hover:text-green-600 transition">
                Buy a Home
              </Link>
              <Link to={createPageUrl('Refinance')} className="text-gray-700 hover:text-green-600 transition">
                Refinance
              </Link>
              <Link to={createPageUrl('Calculators')} className="text-gray-700 hover:text-green-600 transition">
                Mortgage Calculators
              </Link>
              <Link to={createPageUrl('LoanPrograms')} className="text-gray-700 hover:text-green-600 transition">
                Loan Programs
              </Link>
              <Link to={createPageUrl('About')} className="text-gray-700 hover:text-green-600 transition">
                About
              </Link>
              <Link to={createPageUrl('Contact')} className="text-gray-700 hover:text-green-600 transition">
                Contact
              </Link>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Link to={createPageUrl('Contact')} className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition">
                Request an Appointment
              </Link>
              <Link to={createPageUrl('Purchase')} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Apply Now
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-green-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <Link to={createPageUrl('Home')} className="text-gray-700 hover:text-green-600 py-2">
                  Home
                </Link>
                <Link to={createPageUrl('Purchase')} className="text-gray-700 hover:text-green-600 py-2">
                  Buy a Home
                </Link>
                <Link to={createPageUrl('Refinance')} className="text-gray-700 hover:text-green-600 py-2">
                  Refinance
                </Link>
                <Link to={createPageUrl('Calculators')} className="text-gray-700 hover:text-green-600 py-2">
                  Mortgage Calculators
                </Link>
                <Link to={createPageUrl('LoanPrograms')} className="text-gray-700 hover:text-green-600 py-2">
                  Loan Programs
                </Link>
                <Link to={createPageUrl('About')} className="text-gray-700 hover:text-green-600 py-2">
                  About
                </Link>
                <Link to={createPageUrl('Contact')} className="text-gray-700 hover:text-green-600 py-2">
                  Contact
                </Link>
                <Link to={createPageUrl('Purchase')} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg text-center">
                  Apply Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-green-600 to-green-700 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-green-50 text-sm">
                We've been helping customers afford the home of their dreams for many years and we love what we do.
              </p>
              <p className="text-green-50 text-sm mt-2">
                Company NMLS: 1887767<br />
                Personal NMLS: 1524446
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="text-green-50 text-sm space-y-2">
                <p>5115 Lankershim Blvd #705</p>
                <p>North Hollywood, CA 91601</p>
                <p>Phone: (818) 300-2642</p>
                <p>bennett@buywiser.com</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <div className="flex flex-col space-y-2 text-green-50 text-sm">
                <Link to={createPageUrl('LoanPrograms')} className="hover:text-white transition">
                  Loan Programs
                </Link>
                <Link to={createPageUrl('Calculators')} className="hover:text-white transition">
                  Mortgage Calculators
                </Link>
                <Link to={createPageUrl('About')} className="hover:text-white transition">
                  About Us
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="flex flex-col space-y-2 text-green-50 text-sm">
                <Link to={createPageUrl('Purchase')} className="hover:text-white transition">
                  Apply Now
                </Link>
                <Link to={createPageUrl('Contact')} className="hover:text-white transition">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-green-500 text-center text-green-50 text-sm">
            <p>&copy; {new Date().getFullYear()} Buy Wiser Mortgage. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <ChatWidget />
    </div>
  );
}