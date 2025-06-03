import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectIfAuthenticated?: string;
  analytics?: string;
  requireLoggedOut?: boolean;
  maxVisits?: number;
  rateLimit?: number;
  geoRestricted?: boolean;
  allowedCountries?: string[];
  maintenanceBypass?: boolean;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectIfAuthenticated,
  analytics,
  requireLoggedOut = false,
  maxVisits = 0,
  rateLimit = 0,
  geoRestricted = false,
  allowedCountries = [],
  maintenanceBypass = false
}) => {
  const { isAuthenticated, isLoading, userLocation } = useAuth();
  const { trackEvent } = useAnalytics();
  const location = useLocation();

  useEffect(() => {
    if (analytics) {
      trackEvent('public_route_access', {
        route: location.pathname,
        analytics_id: analytics,
        is_authenticated: isAuthenticated,
        country: userLocation?.country
      });
    }

    // Rate limiting check
    if (rateLimit > 0) {
      const key = `rate_limit_${location.pathname}`;
      const now = Date.now();
      const visits = JSON.parse(localStorage.getItem(key) || '[]');
      const recentVisits = visits.filter((time: number) => now - time < 60000);

      if (recentVisits.length >= rateLimit) {
        trackEvent('rate_limit_exceeded', {
          route: location.pathname,
          visits_per_minute: recentVisits.length
        });
        window.location.href = '/rate-limited';
        return;
      }

      localStorage.setItem(key, JSON.stringify([...recentVisits, now]));
    }

    // Max visits check
    if (maxVisits > 0) {
      const key = `visits_${location.pathname}`;
      const visits = Number(localStorage.getItem(key) || '0') + 1;
      localStorage.setItem(key, visits.toString());

      if (visits > maxVisits) {
        trackEvent('max_visits_exceeded', {
          route: location.pathname,
          visits: visits
        });
        window.location.href = '/visit-limit-exceeded';
        return;
      }
    }

    // Geo-restriction check
    if (geoRestricted && userLocation && allowedCountries.length > 0) {
      if (!allowedCountries.includes(userLocation.country)) {
        trackEvent('geo_restricted_access', {
          route: location.pathname,
          country: userLocation.country
        });
        window.location.href = '/geo-restricted';
        return;
      }
    }

    // Maintenance mode check
    if (!maintenanceBypass && window.location.hostname !== 'localhost') {
      const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';
      if (isMaintenanceMode) {
        window.location.href = '/maintenance';
        return;
      }
    }
  }, [
    location.pathname,
    analytics,
    isAuthenticated,
    userLocation,
    trackEvent,
    rateLimit,
    maxVisits,
    geoRestricted,
    allowedCountries,
    maintenanceBypass
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <LoadingSpinner 
          size="large"
          message="Loading..."
          timeout={15000}
        />
      </div>
    );
  }

  if (isAuthenticated && redirectIfAuthenticated) {
    trackEvent('authenticated_redirect', {
      from: location.pathname,
      to: redirectIfAuthenticated
    });
    return <Navigate to={redirectIfAuthenticated} state={{ from: location }} replace />;
  }

  if (isAuthenticated && requireLoggedOut) {
    trackEvent('logged_in_access_denied', {
      route: location.pathname
    });
    return <Navigate to="/profile" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};