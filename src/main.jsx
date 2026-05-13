import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Suppress 401 errors from /User/me on public routes (expected for unauthenticated users)
const originalFetch = window.fetch;
window.fetch = function(...args) {
  return originalFetch.apply(this, args).catch(err => {
    // Re-throw the error so it's still caught by the app
    throw err;
  });
};

// Suppress console.error for expected 401s from /entities/User/me
const originalError = console.error;
console.error = function(...args) {
  const msg = args?.[0]?.message || String(args[0]) || '';
  // Skip logging 401 from User/me endpoint
  if (msg.includes('401') && String(args[0]).includes('User/me')) {
    return;
  }
  originalError.apply(console, args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)