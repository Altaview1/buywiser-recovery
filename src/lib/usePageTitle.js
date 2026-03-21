import { useEffect, useRef } from 'react';

export function usePageTitle(title) {
  const titleRef = useRef(title);
  titleRef.current = title;

  // Set immediately, synchronously
  document.title = title;

  useEffect(() => {
    document.title = title;

    // Watch the <head> for any title changes (platform may insert/replace <title> tags)
    const enforce = () => {
      if (document.title !== titleRef.current) {
        document.title = titleRef.current;
      }
    };

    const observer = new MutationObserver(enforce);

    // Observe head for added/removed nodes (platform may swap the <title> element)
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });

    // Also poll as a fallback every 100ms for the first 3 seconds
    let attempts = 0;
    const interval = setInterval(() => {
      enforce();
      attempts++;
      if (attempts >= 30) clearInterval(interval);
    }, 100);

    return () => {
      observer.disconnect();
      clearInterval(interval);
      document.title = 'BuyWiser Home Loans | California Mortgage Guidance';
    };
  }, [title]);
}