import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { env } from '@/utils/env';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireEmailVerified?: boolean;
  requirePhoneVerified?: boolean;
  requireProfile?: boolean;
  minAccountAge?: number;
  maxInactivity?: number;
  analytics?: string;
  redirectTo?: string;
  allowedCountries?: string[];
  blockedCountries?: string[];
  requireMFA?: boolean;
  minimumTier?: 'basic' | 'premium' | 'enterprise';
  featureFlags?: string[];
  rateLimitPerMinute?: number;
  maxConcurrentSessions?: number;
  ipWhitelist?: string[];
  deviceLimit?: number;
  subscriptionRequired?: boolean;
  trialDaysRequired?: number;
  customValidator?: (user: any) => Promise<boolean>;
}

interface SecurityValidation {
  isValid: boolean;
  reason?: string;
  redirectPath?: string;
  canBypass?: boolean;
  temporaryBlock?: boolean;
  retryAfter?: number;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireEmailVerified = false,
  requirePhoneVerified = false,
  requireProfile = false,
  minAccountAge = 0,
  maxInactivity = env.VITE_SESSION_TIMEOUT,
  analytics,
  redirectTo = '/auth',
  allowedCountries = [],
  blockedCountries = [],
  requireMFA = false,
  minimumTier = 'basic',
  featureFlags = [],
  rateLimitPerMinute = env.VITE_API_RATE_LIMIT,
  maxConcurrentSessions = 5,
  ipWhitelist = [],
  deviceLimit = 3,
  subscriptionRequired = false,
  trialDaysRequired = 0,
  customValidator
}) => {
  const { 
    user, 
    isLoading, 
    isAuthenticated,
    lastActivity,
    userLocation,
    subscription,
    mfaEnabled,
    sessions,
    currentIP,
    deviceCount,
    trialDaysRemaining,
    kycStatus
  } = useAuth();
  
  const { trackEvent } = useAnalytics();
  const location = useLocation();
  const [validation, setValidation] = useState<SecurityValidation>({ isValid: false });
  const [isValidating, setIsValidating] = useState(true);

  const validateSecurity = useCallback(async (): Promise<SecurityValidation> => {
    if (!user || !isAuthenticated) {
      return { isValid: false, redirectPath: redirectTo };
    }

    try {
      // Email verification check
      if (requireEmailVerified && !user.email_confirmed_at) {
        trackEvent('security_check_failed', {
          route: location.pathname,
          reason: 'email_not_verified',
          user_id: user.id
        });
        return {
          isValid: false,
          reason: 'Email verification required',
          redirectPath: '/auth/verify-email'
        };
      }

      // Phone verification check
      if (requirePhoneVerified && !user.phone_confirmed_at) {
        trackEvent('security_check_failed', {
          route: location.pathname,
          reason: 'phone_not_verified',
          user_id: user.id
        });
        return {
          isValid: false,
          reason: 'Phone verification required',
          redirectPath: '/auth/verify-phone'
        };
      }

      // Profile completion check
      if (requireProfile) {
        const profileComplete = user.display_name && user.region && user.bio;
        if (!profileComplete) {
          trackEvent('security_check_failed', {
            route: location.pathname,
            reason: 'profile_incomplete',
            user_id: user.id
          });
          return {
            isValid: false,
            reason: 'Profile completion required',
            redirectPath: '/profile/setup'
          };
        }
      }

      // Account age check
      if (minAccountAge > 0) {
        const accountAge = Date.now() - new Date(user.created_at).getTime();
        const requiredAge = minAccountAge * 24 * 60 * 60 * 1000;
        if (accountAge < requiredAge) {
          trackEvent('security_check_failed', {
            route: location.pathname,
            reason: 'account_too_new',
            user_id: user.id,
            account_age_days: Math.floor(accountAge / (24 * 60 * 60 * 1000))
          });
          return {
            isValid: false,
            reason: `Account must be at least ${minAccountAge} days old`,
            redirectPath: '/profile'
          };
        }
      }

      // Inactivity check
      if (lastActivity && maxInactivity > 0) {
        const inactiveTime = Date.now() - lastActivity.getTime();
        const maxInactiveMs = maxInactivity * 60 * 1000;
        if (inactiveTime > maxInactiveMs) {
          trackEvent('security_check_failed', {
            route: location.pathname,
            reason: 'session_expired',
            user_id: user.id,
            inactive_minutes: Math.floor(inactiveTime / (60 * 1000))
          });
          return {
            isValid: false,
            reason: 'Session expired due to inactivity',
            redirectPath: '/auth/session-expired'
          };
        }
      }

      // Geolocation checks
      if (userLocation) {
        if (allowedCountries.length > 0 && !allowedCountries.includes(userLocation.country)) {
          trackEvent('security_check_failed', {
            route: location.pathname,
            reason: 'country_not_allowed',
            user_id: user.id,
            country: userLocation.country
          });
          return {
            isValid: false,
            reason: 'Access not available in your country',
            redirectPath: '/geo-restricted'
          };
        }

        if (blockedCountries.includes(userLocation.country)) {
          trackEvent('security_check_failed', {
            route: location.pathname,
            reason: 'country_blocked',
            user_id: user.id,
            country: userLocation.country
          });
          return {
            isValid: false,
            reason: 'Access blocked in your country',
            redirectPath: '/geo-blocked'
          };
        }
      }

      // MFA requirement check
      if (requireMFA && !mfaEnabled) {
        trackEvent('security_check_failed', {
          route: location.pathname,
          reason: 'mfa_required',
          user_id: user.id
        });
        return {
          isValid: false,
          reason: 'Multi-factor authentication required',
          redirectPath: '/auth/setup-mfa'
        };
      }

      // Subscription tier check
      if (minimumTier !== 'basic') {
        const tierHierarchy = { basic: 0, premium: 1, enterprise: 2 };
        const userTier = subscription?.tier || 'basic';
        const requiredLevel = tierHierarchy[minimumTier];
        const userLevel = tierHierarchy[userTier];
        
        if (userLevel < requiredLevel) {
          trackEvent('security_check_failed', {
            route: location.pathname,
            reason: 'insufficient_tier',
            user_id: user.id,
            user_tier: userTier,
            required_tier: minimumTier
          });
          return {
            isValid: false,
            reason: `${minimumTier} subscription required`,
            redirectPath: '/upgrade',
            upgradeRequired: true
          };
        }
      }

      // Feature flags check
      if (featureFlags.length > 0) {
        const enabledFlags = await checkFeatureFlags(featureFlags);
        const allEnabled = featureFlags.every(flag => enabledFlags[flag]);
        
        if (!allEnabled) {
          trackEvent('security_check_failed', {
            route: location.pathname,
            reason: 'feature_not_enabled',
            user_id: user.id,
            required_flags: featureFlags
          });
          return {
            isValid: false,
            reason: 'Feature not available',
            redirectPath: '/feature-unavailable'
          };
        }
      }

      // Rate limiting check
      if (rateLimitPerMinute > 0) {
        const rateLimitKey = `rate_limit_${user.id}_${location.pathname}`;
        const requests = JSON.parse(localStorage.getItem(rateLimitKey) || '[]');
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        const recentRequests = requests.filter((timestamp: number) => timestamp > oneMinuteAgo);
        
        if (recentRequests.length >= rateLimitPerMinute) {
          trackEvent('security_check_failed', {
            route: location.pathname,
            reason: 'rate_limit_exceeded',
            user_id: user.id,
            requests_per_minute: recentRequests.length
          });
          return {
            isValid: false,
            reason: 'Too many requests, please slow down',
            redirectPath: '/rate-limited',
            temporaryBlock: true,
            retryAfter: 60
          };
        }
        
        recentRequests.push(now);
        localStorage.setItem(rateLimitKey, JSON.stringify(recentRequests));
      }

      // Concurrent sessions check
      if (maxConcurrentSessions > 0 && sessions && sessions.length > maxConcurrentSessions) {
        trackEvent('concurrent_sessions_exceeded', {
          route: location.pathname,
          session_count: sessions.length,
          max_allowed: maxConcurrentSessions,
          user_id: user.id
        });
        
        return {
          isValid: false,
          reason: `Maximum ${maxConcurrentSessions} concurrent sessions allowed`,
          redirectPath: '/manage-sessions'
        };
      }

      // IP whitelist check
      if (ipWhitelist.length > 0 && currentIP && !ipWhitelist.includes(currentIP)) {
        trackEvent('ip_access_denied', {
          route: location.pathname,
          ip_address: currentIP,
          user_id: user.id
        });
        
        return {
          isValid: false,
          reason: 'Access restricted to approved IP addresses',
          redirectPath: '/ip-restricted'
        };
      }

      // Device limit check
      if (deviceLimit > 0 && deviceCount && deviceCount > deviceLimit) {
        trackEvent('device_limit_exceeded', {
          route: location.pathname,
          device_count: deviceCount,
          max_allowed: deviceLimit,
          user_id: user.id
        });
        
        return {
          isValid: false,
          reason: `Maximum ${deviceLimit} devices allowed`,
          redirectPath: '/manage-devices'
        };
      }

      // Subscription check
      if (subscriptionRequired && (!subscription || !subscription.active)) {
        trackEvent('subscription_required', {
          route: location.pathname,
          has_subscription: !!subscription,
          is_active: subscription?.active || false,
          user_id: user.id
        });
        
        return {
          isValid: false,
          reason: 'Active subscription required',
          redirectPath: '/subscribe',
          upgradeRequired: true
        };
      }

      // Trial days check
      if (trialDaysRequired > 0 && (trialDaysRemaining || 0) < trialDaysRequired) {
        trackEvent('trial_days_insufficient', {
          route: location.pathname,
          days_remaining: trialDaysRemaining || 0,
          days_required: trialDaysRequired,
          user_id: user.id
        });
        
        return {
          isValid: false,
          reason: `${trialDaysRequired} trial days required`,
          redirectPath: '/extend-trial',
          upgradeRequired: true
        };
      }

      // Custom validation
      if (customValidator) {
        const customValid = await customValidator(user);
        if (!customValid) {
          trackEvent('custom_validation_failed', {
            route: location.pathname,
            user_id: user.id
          });
          
          return {
            isValid: false,
            reason: 'Custom validation failed',
            redirectPath: '/validation-failed'
          };
        }
      }

      // All checks passed
      if (analytics) {
        trackEvent('protected_route_access_granted', {
          route: location.pathname,
          analytics_id: analytics,
          user_id: user.id,
          user_type: user.user_type,
          checks_passed: 12
        });
      }

      return { isValid: true };

    } catch (error) {
      console.error('Security validation error:', error);
      trackEvent('security_validation_error', {
        route: location.pathname,
        error: error instanceof Error ? error.message : 'Unknown error',
        user_id: user?.id
      });
      
      return {
        isValid: false,
        reason: 'Security validation failed',
        redirectPath: '/error/500'
      };
    }
  }, [
    user,
    isAuthenticated,
    requireEmailVerified,
    requirePhoneVerified,
    requireProfile,
    minAccountAge,
    maxInactivity,
    lastActivity,
    userLocation,
    allowedCountries,
    blockedCountries,
    requireMFA,
    mfaEnabled,
    minimumTier,
    subscription,
    featureFlags,
    rateLimitPerMinute,
    maxConcurrentSessions,
    sessions,
    ipWhitelist,
    currentIP,
    deviceLimit,
    deviceCount,
    subscriptionRequired,
    trialDaysRequired,
    trialDaysRemaining,
    customValidator,
    location.pathname,
    analytics,
    trackEvent,
    redirectTo
  ]);

  const checkFeatureFlags = async (flags: string[]): Promise<Record<string, boolean>> => {
    const results: Record<string, boolean> = {};
    
    for (const flag of flags) {
      const envVar = `VITE_FEATURE_${flag.toUpperCase()}`;
      results[flag] = import.meta.env[envVar] === 'true';
    }
    
    return results;
  };

  useEffect(() => {
    const performValidation = async () => {
      if (!isLoading) {
        setIsValidating(true);
        const result = await validateSecurity();
        setValidation(result);
        setIsValidating(false);
      }
    };

    performValidation();
  }, [isLoading, validateSecurity]);

  if (isLoading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <LoadingSpinner 
          size="large"
          message="Verifying access..."
          timeout={15000}
          onTimeout={() => {
            trackEvent('security_validation_timeout', {
              route: location.pathname,
              user_id: user?.id
            });
            window.location.href = '/error/timeout';
          }}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    trackEvent('protected_route_access_denied', {
      route: location.pathname,
      reason: 'not_authenticated'
    });
    
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!validation.isValid) {
    if (validation.redirectPath) {
      return <Navigate 
        to={validation.redirectPath} 
        state={{ 
          from: location,
          reason: validation.reason,
          canBypass: validation.canBypass,
          temporaryBlock: validation.temporaryBlock,
          retryAfter: validation.retryAfter,
          upgradeRequired: validation.upgradeRequired
        }} 
        replace 
      />;
    }
    
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};