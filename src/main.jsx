import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Set clean title immediately before platform can inject
document.title = 'BuyWiser Home Loans | California Mortgage Guidance';

// Global guardian: if the platform ever injects "Clone", "ApplyNow", 
// "MortgageCalculators", or "ContactUs" into the title, strip it out immediately
const BANNED = ['clone', 'applynow', 'mortgagecalculators', 'contactus'];
const BRAND = 'BuyWiser Home Loans';

function cleanTitle() {
  const t = document.title;
  const lower = t.toLowerCase();
  if (BANNED.some(w => lower.includes(w))) {
    // Rebuild: strip the bad part, keep the page-specific part if present
    // Platform format is typically: "PageKey | AppName"
    const parts = t.split('|').map(s => s.trim());
    // Filter out any part that contains a banned word
    const clean = parts.filter(p => !BANNED.some(w => p.toLowerCase().includes(w)));
    if (clean.length > 0) {
      document.title = clean.join(' | ');
    } else {
      document.title = BRAND + ' | California Mortgage Guidance';
    }
  }
}

const guardian = new MutationObserver(cleanTitle);
guardian.observe(document.head, { childList: true, subtree: true, characterData: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)