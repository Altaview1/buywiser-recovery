import { useEffect } from 'react';

export function usePageTitle(title) {
  // Set immediately (synchronous) to beat any platform injection
  document.title = title;

  useEffect(() => {
    document.title = title;

    // MutationObserver: re-assert our title if anything changes it externally
    const observer = new MutationObserver(() => {
      if (document.title !== title) {
        document.title = title;
      }
    });
    const titleEl = document.querySelector('title');
    if (titleEl) {
      observer.observe(titleEl, { childList: true });
    }

    return () => {
      observer.disconnect();
      document.title = 'BuyWiser Home Loans | California Mortgage Guidance';
    };
  }, [title]);
}