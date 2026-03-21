import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title;
    return () => {
      document.title = 'BuyWiser Home Loans | California Mortgage Guidance';
    };
  }, [title]);
}