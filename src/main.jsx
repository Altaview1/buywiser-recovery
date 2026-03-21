import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Set title immediately before any platform injection can occur
document.title = 'BuyWiser Home Loans | California Mortgage Guidance';

// Keep overriding any platform attempts to rename the tab
const titleObserver = new MutationObserver(() => {
  const banned = ['clone', 'applynow', 'mortgagecalculators', 'contactus'];
  const current = document.title.toLowerCase();
  if (banned.some(word => current.includes(word))) {
    // Reset to a sane default; individual pages will set their own title via usePageTitle
    document.title = 'BuyWiser Home Loans | California Mortgage Guidance';
  }
});
titleObserver.observe(document.head, { childList: true, subtree: true, characterData: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)