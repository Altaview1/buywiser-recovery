import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Suppress console errors for expected 401s and BuilderBridge messages
const originalError = console.error;
const originalWarn = console.warn;
console.error = function(...args) {
  const msg = String(args[0] || '');
  if (msg.includes('401') || msg.includes('User/me')) {
    return; // Silently ignore 401 auth errors
  }
  originalError.apply(console, args);
};
console.warn = function(...args) {
  const msg = String(args[0] || '');
  if (msg.includes('BuilderBridge')) {
    return; // Silently ignore BuilderBridge warnings
  }
  originalWarn.apply(console, args);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)