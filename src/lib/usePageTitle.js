import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title;

    const observer = new MutationObserver(() => {
      if (document.title !== title) {
        document.title = title;
      }
    });

    observer.observe(document.head, { childList: true, subtree: true, characterData: true });

    const interval = setInterval(() => {
      if (document.title !== title) {
        document.title = title;
      }
    }, 500);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [title]);
}