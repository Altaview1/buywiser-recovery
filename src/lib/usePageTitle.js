import { useEffect } from 'react';

export function usePageTitle(title) {
  // Set immediately — synchronous, before any effect
  document.title = title;

  useEffect(() => {
    document.title = title;

    // Observer catches DOM mutations to <head>
    const observer = new MutationObserver(() => {
      if (document.title !== title) {
        document.title = title;
      }
    });
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });

    // Continuous poll — wins against any async platform injection
    const interval = setInterval(() => {
      if (document.title !== title) {
        document.title = title;
      }
    }, 300);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [title]);
}