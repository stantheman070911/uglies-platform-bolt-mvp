import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

export const RouteChangeTracker: React.FC = () => {
  const location = useLocation();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const timestamp = Date.now();
    const referrer = document.referrer;
    
    trackEvent('page_view', {
      path: location.pathname,
      search: location.search,
      hash: location.hash,
      timestamp,
      referrer
    });

    // Track page exit
    return () => {
      const duration = Date.now() - timestamp;
      trackEvent('page_exit', {
        path: location.pathname,
        duration,
        timestamp: Date.now()
      });
    };
  }, [location, trackEvent]);

  return null;
};