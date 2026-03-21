import { useEffect } from 'react';

export function usePageTitle(title) {
  // Set synchronously on every render
  document.title = title;

  useEffect(() => {
    document.title = title;

    const observer = new MutationObserver(() => {
      if (document.title !== title) {
        document.title = title;
      }
    });

    observer.observe(document.head, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
    };
  }, [title]);
}