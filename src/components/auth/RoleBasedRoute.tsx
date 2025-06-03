import React, { useEffect, useState, useCallback } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAnalytics } from '@/hooks/useAnalytics';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type UserRole = 'farmer' | 'customer' | 'coordinator' | 'admin' | 'moderator' | 'support';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  requiredPermissions?: string[];
  minimumTier?: 'basic' | 'premium' | 'enterprise';
  requireEmailVerified?: boolean;
  requirePhoneVerified?: boolean;
  requireKYC?: boolean;
  businessHoursOnly?: boolean;
  maxConcurrentSessions?: number;
  ipWhitelist?: string[];
  deviceLimit?: number;
  subscriptionRequired?: boolean;
  trialDaysRequired?: number;
  analytics?: string;
  redirectTo?: string;
  customValidator?: (user: any) => Promise<boolean>;
}

interface RoleValidation {
  hasAccess: boolean;
  reason?: string;
  redirectPath?: string;
  upgradeRequired?: boolean;
  temporaryBlock?: boolean;
  retryAfter?: number;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  requiredPermissions = [],
  minimumTier = 'basic',
  requireEmailVerified = false,
  requirePhoneVerified = false,
  requireKYC = false,
  businessHoursOnly = false,
  maxConcurrentSessions = 5,
  ipWhitelist = [],
  deviceLimit = 3,
  subscriptionRequired = false,
  trialDaysRequired = 0,
  analytics,
  redirectTo = '/profile',
  customValidator
}) => {
  const { 
    user, 
    isLoading, 
    isAuthenticated,
    permissions,
    subscription,
    kycStatus,
    sessions,
    currentIP,
    deviceCount,
    trialDaysRemaining
  } = useAuth();
  
  const { trackEvent } = useAnalytics();
  const location = useLocation();
  const [validation, setValidation] = useState<RoleValidation>({ hasAccess: false });
  const [isValidating, setIsValidating] = useState(true);

  const validateRoleAccess = useCallback(async (): Promise<RoleValidation> => {
    if (!user || !isAuthenticated) {
      return { 
        hasAccess: false, 
        reason: 'Authentication required',
        redirectPath: '/auth' 
      };
    }

    try {
      // Role validation
      if (!allowedRoles.includes(user.user_type as UserRole)) {
        trackEvent('role_access_denied', {
          route: location.pathname,
          user_role: user.user_type,
          allowed_roles: allowedRoles,
          user_id: user.id
        });
        
        return {
          hasAccess: false,
          reason: `Access restricted to: ${allowedRoles.join(', ')}`,
          redirectPath: '/access-denied'
        };
      }

      // Permission validation
      if (requiredPermissions.length > 0) {
        const hasAllPermissions = requiredPermissions.every(permission =>
          permissions?.includes(permission)
        );
        
        if (!hasAllPermissions) {
          const missingPermissions = requiredPermissions.filter(permission =>
            !permissions?.includes(permission)
          );
          
          trackEvent('permission_access_denied', {
            route: location.pathname,
            missing_permissions: missingPermissions,
            user_id: user.id
          });
          
          return {
            hasAccess: false,
            reason: `Missing permissions: ${missingPermissions.join(', ')}`,
            redirectPath: '/insufficient-permissions'
          };
        }
      }

      // Tier validation
      if (minimumTier !== 'basic') {
        const tierHierarchy = { basic: 0, premium: 1, enterprise: 2 };
        const userTier = subscription?.tier || 'basic';
        const requiredLevel = tierHierarchy[minimumTier];
        const userLevel = tierHierarchy[userTier];
        
        if (userLevel < requiredLevel) {
          trackEvent('tier_access_denied', {
            route: location.pathname,
            user_tier: userTier,
            required_tier: minimumTier,
            user_id: user.id
          });
          
          return {
            hasAccess: false,
            reason: `${minimumTier} tier or higher required`,
            redirectPath: '/upgrade',
            upgradeRequired: true
          };
        }
      }

      // Email verification
      if (requireEmailVerified && !user.email_confirmed_at) {
        return {
          hasAccess: false,
          reason: 'Email verification required',
          redirectPath: '/auth/verify-email'
        };
      }

      // Phone verification
      if (requirePhoneVerified && !user.phone_confirmed_at) {
        return {
          hasAccess: false,
          reason: 'Phone verification required',
          redirectPath: '/auth/verify-phone'
        };
      }

      // KYC verification
      if (requireKYC && kycStatus !== 'verified') {
        return {
          hasAccess: false,
          reason: 'Identity verification required',
          redirectPath: '/kyc/verify'
        };
      }

      // Business hours check
      if (businessHoursOnly) {
        const now = new Date();
        const hour = now.getUTCHours();
        const isBusinessHours = hour >= 9 && hour < 18;
        
        if (!isBusinessHours) {
          trackEvent('business_hours_access_denied', {
            route: location.pathname,
            current_hour: hour,
            user_id: user.id
          });
          
          return {
            hasAccess: false,
            reason: 'Feature only available during business hours (9 AM - 6 PM UTC)',
            temporaryBlock: true,
            retryAfter: hour < 9 ? (9 - hour) * 60 : (24 - hour + 9) * 60
          };
        }
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
          hasAccess: false,
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
          hasAccess: false,
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
          hasAccess: false,
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
          hasAccess: false,
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
          hasAccess: false,
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
            hasAccess: false,
            reason: 'Custom validation failed',
            redirectPath: '/validation-failed'
          };
        }
      }

      // All validations passed
      if (analytics) {
        trackEvent('role_route_access_granted', {
          route: location.pathname,
          analytics_id: analytics,
          user_role: user.user_type,
          user_id: user.id,
          validations_passed: 10
        });
      }

      return { hasAccess: true };

    } catch (error) {
      console.error('Role validation error:', error);
      trackEvent('role_validation_error', {
        route: location.pathname,
        error: error instanceof Error ? error.message : 'Unknown error',
        user_id: user?.id
      });
      
      return {
        hasAccess: false,
        reason: 'Validation system error',
        redirectPath: '/error/500'
      };
    }
  }, [
    user,
    isAuthenticated,
    allowedRoles,
    requiredPermissions,
    permissions,
    minimumTier,
    subscription,
    requireEmailVerified,
    requirePhoneVerified,
    requireKYC,
    kycStatus,
    businessHoursOnly,
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
    trackEvent
  ]);

  useEffect(() => {
    const performValidation = async () => {
      if (!isLoading) {
        setIsValidating(true);
        const result = await validateRoleAccess();
        setValidation(result);
        setIsValidating(false);
      }
    };

    performValidation();
  }, [isLoading, validateRoleAccess]);

  if (isLoading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <LoadingSpinner 
          size="large"
          message="Validating permissions..."
          timeout={15000}
          onTimeout={() => {
            trackEvent('role_validation_timeout', {
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
    trackEvent('role_route_unauthenticated', {
      route: location.pathname,
      required_roles: allowedRoles
    });
    
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!validation.hasAccess) {
    if (validation.redirectPath) {
      return <Navigate 
        to={validation.redirectPath} 
        state={{ 
          from: location,
          reason: validation.reason,
          upgradeRequired: validation.upgradeRequired,
          temporaryBlock: validation.temporaryBlock,
          retryAfter: validation.retryAfter
        }} 
        replace 
      />;
    }
    
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};