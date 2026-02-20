import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { useState } from "react";
import { Menu, X, Phone, Home, DollarSign, Calculator, BookOpen, Users, ChevronDown } from "lucide-react";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const navLinks = [
    { label: "Buy a Home", page: "ApplyNow", query: "?type=purchase" },
    { label: "Refinance", page: "ApplyNow", query: "?type=refinance" },
    { label: "Mortgage Calculators", page: "MortgageCalculators" },
    { label: "Loan Programs", page: "LoanPrograms" },
    { label: "About", page: "About" },
    { label: "Contact Us", page: "ContactUs" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <Home className="h-8 w-8 text-green-600" strokeWidth={2.5} />
              <span className="text-xl font-bold tracking-tight">
                <span className="text-green-600">Buy</span>
                <span className="text-slate-700">Wiser</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={createPageUrl(link.page) + (link.query || "")}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to={createPageUrl("ContactUs")}
              className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-full hover:bg-green-50 transition-colors"
            >
              Request an Appointment
            </Link>
            <Link
              to={createPageUrl("ApplyNow")}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-600"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t">
            <nav className="flex flex-col pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={createPageUrl(link.page) + (link.query || "")}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-green-600 hover:bg-green-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 px-4 pt-3">
                <Link
                  to={createPageUrl("ContactUs")}
                  onClick={() => setMobileOpen(false)}
                  className="text-center px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-full"
                >
                  Request an Appointment
                </Link>
                <Link
                  to={createPageUrl("ApplyNow")}
                  onClick={() => setMobileOpen(false)}
                  className="text-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full"
                >
                  Apply Now
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h4 className="font-semibold text-lg mb-3">About Us</h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              We've been helping customers afford the home of their dreams for many years and we love what we do.
            </p>
            <p className="text-slate-400 text-xs mt-3">Company NMLS: 1887767</p>
            <p className="text-slate-400 text-xs">Personal NMLS: 1524446</p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Contact Us</h4>
            <p className="text-slate-300 text-sm">5115 Lankershim Blvd #705</p>
            <p className="text-slate-300 text-sm">North Hollywood, CA 91601</p>
            <p className="text-slate-300 text-sm mt-2">Phone: (818) 300-2642</p>
            <p className="text-slate-300 text-sm">bennett@buywiser.com</p>
          </div>

          {/* Disclaimers */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Disclaimers</h4>
            <ul className="space-y-1.5">
              <li><Link to={createPageUrl("Home")} className="text-slate-300 text-sm hover:text-green-400 transition-colors">Legal</Link></li>
              <li><Link to={createPageUrl("Home")} className="text-slate-300 text-sm hover:text-green-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to={createPageUrl("Home")} className="text-slate-300 text-sm hover:text-green-400 transition-colors">Accessibility Statement</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Resources</h4>
            <ul className="space-y-1.5">
              <li><Link to={createPageUrl("LoanPrograms")} className="text-slate-300 text-sm hover:text-green-400 transition-colors">Loan Programs</Link></li>
              <li><Link to={createPageUrl("MortgageCalculators")} className="text-slate-300 text-sm hover:text-green-400 transition-colors">Mortgage Calculators</Link></li>
              <li><Link to={createPageUrl("About")} className="text-slate-300 text-sm hover:text-green-400 transition-colors">About Us</Link></li>
              <li><Link to={createPageUrl("ContactUs")} className="text-slate-300 text-sm hover:text-green-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-6 text-center">
          <p className="text-slate-400 text-xs">
            © {new Date().getFullYear()} BuyWiser Mortgage. All rights reserved. NMLS #1887767
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <style>{`
        :root {
          --bw-green: #2E7D32;
          --bw-green-light: #4CAF50;
        }
      `}</style>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}