import { useEffect } from 'react';

export function usePageTitle(title) {
  // Set synchronously on every render — fires before platform can override
  document.title = title;

  useEffect(() => {
    document.title = title;

    // Observer: catches any mutation to the <head> or its text nodes
    const observer = new MutationObserver(() => {
      if (document.title !== title) {
        document.title = title;
      }
    });

    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Belt-and-suspenders: poll for 3 seconds after mount in case
    // the platform injects the title after the observer is set
    const intervals = [100, 250, 500, 1000, 2000, 3000];
    const timers = intervals.map(ms =>
      setTimeout(() => {
        if (document.title !== title) {
          document.title = title;
        }
      }, ms)
    );

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [title]);
}