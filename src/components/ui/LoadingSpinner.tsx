import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';
  message?: string;
  submessage?: string;
  timeout?: number;
  onTimeout?: () => void;
  className?: string;
  overlay?: boolean;
  testId?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  variant = 'spinner',
  color = 'primary',
  message,
  submessage,
  timeout,
  onTimeout,
  className = '',
  overlay = false,
  testId = 'loading-spinner'
}) => {
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (timeout && timeout > 0) {
      const timer = setTimeout(() => {
        setHasTimedOut(true);
        onTimeout?.();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [timeout, onTimeout]);

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    tertiary: 'text-tertiary-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />;
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${colorClasses[color]} rounded-full animate-pulse`}
                style={{
                  width: size === 'small' ? 4 : size === 'medium' ? 8 : 12,
                  height: size === 'small' ? 4 : size === 'medium' ? 8 : 12,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        );
      case 'pulse':
        return (
          <div 
            className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
          />
        );
      case 'skeleton':
        return (
          <div className="space-y-2">
            <div className={`h-4 bg-${color}-200 rounded animate-pulse`} />
            <div className={`h-4 bg-${color}-200 rounded animate-pulse w-3/4`} />
            <div className={`h-4 bg-${color}-200 rounded animate-pulse w-1/2`} />
          </div>
        );
      default:
        return <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />;
    }
  };

  if (hasTimedOut) {
    return (
      <div className="flex flex-col items-center justify-center p-4\" data-testid={`${testId}-timeout`}>
        <AlertCircle className={`${sizeClasses[size]} text-warning-500 mb-2`} />
        <p className="text-surface-600 text-sm">Loading timeout</p>
        {submessage && (
          <p className="text-surface-500 text-xs mt-1">{submessage}</p>
        )}
      </div>
    );
  }

  const containerClasses = `
    flex flex-col items-center justify-center p-4
    ${overlay ? 'fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-50' : ''}
    ${className}
  `;

  return (
    <div 
      className={containerClasses}
      data-testid={testId}
      role="status"
      aria-label={message || 'Loading'}
    >
      {renderSpinner()}
      {message && (
        <div className="mt-3">
          <p className="text-surface-700 font-medium text-sm">{message}</p>
          {submessage && (
            <p className="text-surface-500 text-xs mt-1">{submessage}</p>
          )}
        </div>
      )}
    </div>
  );
};

// Pre-configured loading variants
export const ProductLoadingSpinner = () => (
  <LoadingSpinner 
    variant="skeleton" 
    message="Loading products..." 
    color="secondary"
  />
);

export const GroupLoadingSpinner = () => (
  <LoadingSpinner 
    variant="spinner" 
    message="Loading group details..." 
    color="primary"
  />
);

export const AuthLoadingSpinner = () => (
  <LoadingSpinner 
    variant="spinner" 
    message="Authenticating..." 
    color="primary"
    size="large"
    timeout={10000}
  />
);