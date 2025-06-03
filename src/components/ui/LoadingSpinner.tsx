import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, Clock } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'progress';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error';
  message?: string;
  submessage?: string;
  timeout?: number;
  onTimeout?: () => void;
  showProgress?: boolean;
  progress?: number;
  className?: string;
  overlay?: boolean;
  overlayColor?: 'light' | 'dark' | 'transparent';
  position?: 'center' | 'inline' | 'absolute' | 'fixed';
  zIndex?: number;
  testId?: string;
}

interface LoadingState {
  isVisible: boolean;
  hasTimedOut: boolean;
  currentProgress: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  variant = 'spinner',
  color = 'primary',
  message,
  submessage,
  timeout,
  onTimeout,
  showProgress = false,
  progress = 0,
  className = '',
  overlay = false,
  overlayColor = 'light',
  position = 'center',
  zIndex = 50,
  testId = 'loading-spinner'
}) => {
  const [state, setState] = useState<LoadingState>({
    isVisible: true,
    hasTimedOut: false,
    currentProgress: progress
  });

  // Size configurations
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  // Color configurations
  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    tertiary: 'text-tertiary-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500'
  };

  // Position configurations
  const positionClasses = {
    center: 'flex items-center justify-center min-h-32',
    inline: 'inline-flex items-center',
    absolute: 'absolute inset-0 flex items-center justify-center',
    fixed: 'fixed inset-0 flex items-center justify-center'
  };

  // Overlay configurations
  const overlayClasses = {
    light: 'bg-white bg-opacity-80 backdrop-blur-sm',
    dark: 'bg-surface-900 bg-opacity-80 backdrop-blur-sm',
    transparent: 'bg-transparent'
  };

  // Timeout handling
  useEffect(() => {
    if (timeout && timeout > 0) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, hasTimedOut: true }));
        onTimeout?.();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [timeout, onTimeout]);

  // Progress animation
  useEffect(() => {
    if (showProgress && progress !== state.currentProgress) {
      const duration = 300;
      const steps = 30;
      const stepValue = (progress - state.currentProgress) / steps;
      let currentStep = 0;

      const progressTimer = setInterval(() => {
        currentStep++;
        setState(prev => ({
          ...prev,
          currentProgress: Math.min(100, prev.currentProgress + stepValue)
        }));

        if (currentStep >= steps) {
          clearInterval(progressTimer);
          setState(prev => ({ ...prev, currentProgress: progress }));
        }
      }, duration / steps);

      return () => clearInterval(progressTimer);
    }
  }, [progress, showProgress, state.currentProgress]);

  // Render spinner variants
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
          <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`} />
        );
      
      case 'skeleton':
        return (
          <div className="space-y-2">
            <div className={`h-4 bg-${color}-200 rounded animate-pulse`} />
            <div className={`h-4 bg-${color}-200 rounded animate-pulse w-3/4`} />
            <div className={`h-4 bg-${color}-200 rounded animate-pulse w-1/2`} />
          </div>
        );
      
      case 'progress':
        return (
          <div className="w-full">
            <div className="bg-surface-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full ${colorClasses[color]} transition-all duration-300 ease-out`}
                style={{ width: `${state.currentProgress}%` }}
              />
            </div>
            {showProgress && (
              <p className="text-xs text-surface-500 mt-1 text-center">
                {Math.round(state.currentProgress)}%
              </p>
            )}
          </div>
        );
      
      default:
        return <Loader2 className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`} />;
    }
  };

  // Render timeout state
  if (state.hasTimedOut) {
    return (
      <div 
        className={`${positionClasses[position]} ${overlay ? overlayClasses[overlayColor] : ''} ${className}`}
        style={{ zIndex: overlay ? zIndex : undefined }}
        data-testid={`${testId}-timeout`}
      >
        <div className="text-center">
          <AlertCircle className={`${sizeClasses[size]} text-warning-500 mx-auto mb-2`} />
          <p className="text-surface-600 text-sm">Loading timeout</p>
          {submessage && (
            <p className="text-surface-500 text-xs mt-1">{submessage}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`
        ${positionClasses[position]} 
        ${overlay ? overlayClasses[overlayColor] : ''} 
        ${className}
      `}
      style={{ zIndex: overlay ? zIndex : undefined }}
      data-testid={testId}
      role="status"
      aria-live="polite"
      aria-label={message || 'Loading'}
    >
      <div className="text-center">
        {renderSpinner()}
        
        {message && (
          <div className="mt-3">
            <p className="text-surface-700 font-medium text-sm">
              {message}
            </p>
            {submessage && (
              <p className="text-surface-500 text-xs mt-1">
                {submessage}
              </p>
            )}
          </div>
        )}

        {timeout && !state.hasTimedOut && (
          <div className="mt-2 flex items-center justify-center text-surface-400">
            <Clock className="w-3 h-3 mr-1" />
            <span className="text-xs">Max wait: {Math.round(timeout / 1000)}s</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Pre-configured loading variants
export const ProductLoadingSpinner = () => (
  <LoadingSpinner 
    variant="skeleton" 
    message="Loading products..." 
    color="secondary"
    size="medium"
  />
);

export const GroupLoadingSpinner = () => (
  <LoadingSpinner 
    variant="progress" 
    message="Loading group details..." 
    color="primary"
    showProgress
    size="medium"
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

export const OverlayLoadingSpinner = () => (
  <LoadingSpinner 
    variant="spinner" 
    message="Processing..." 
    overlay
    position="fixed"
    color="primary"
    size="large"
  />
);