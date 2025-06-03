import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2, ChevronRight } from 'lucide-react';

interface MaterialButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  size?: 'small' | 'medium' | 'large' | 'xl';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'surface';
  icon?: 'none' | 'leading' | 'trailing' | 'only';
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: 'none' | 'small' | 'medium' | 'large' | 'full';
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  ripple?: boolean;
  testId?: string;
}

export const MaterialButton = forwardRef<HTMLButtonElement, MaterialButtonProps>(({
  variant = 'filled',
  size = 'medium',
  color = 'primary',
  icon = 'none',
  loading = false,
  fullWidth = false,
  rounded = 'medium',
  elevation = 1,
  ripple = true,
  children,
  className = '',
  disabled = false,
  testId = 'material-button',
  onClick,
  ...props
}, ref) => {
  // Size configurations
  const sizeClasses = {
    small: 'px-3 py-1.5 text-sm min-h-8',
    medium: 'px-4 py-2 text-base min-h-10',
    large: 'px-6 py-3 text-lg min-h-12',
    xl: 'px-8 py-4 text-xl min-h-14'
  };

  // Rounded configurations
  const roundedClasses = {
    none: 'rounded-none',
    small: 'rounded-sm',
    medium: 'rounded-lg',
    large: 'rounded-xl',
    full: 'rounded-full'
  };

  // Elevation configurations
  const elevationClasses = {
    0: 'shadow-none',
    1: 'shadow-elevation-1',
    2: 'shadow-elevation-2',
    3: 'shadow-elevation-3',
    4: 'shadow-elevation-4',
    5: 'shadow-elevation-5'
  };

  // Color and variant configurations
  const getVariantClasses = () => {
    const colorMap = {
      primary: {
        filled: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white',
        outlined: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100',
        text: 'text-primary-500 hover:bg-primary-50 active:bg-primary-100',
        elevated: 'bg-primary-500 hover:bg-primary-600 text-white shadow-primary-md',
        tonal: 'bg-primary-100 text-primary-700 hover:bg-primary-200 active:bg-primary-300'
      },
      secondary: {
        filled: 'bg-secondary-500 hover:bg-secondary-600 active:bg-secondary-700 text-white',
        outlined: 'border-2 border-secondary-500 text-secondary-500 hover:bg-secondary-50 active:bg-secondary-100',
        text: 'text-secondary-500 hover:bg-secondary-50 active:bg-secondary-100',
        elevated: 'bg-secondary-500 hover:bg-secondary-600 text-white shadow-secondary-md',
        tonal: 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200 active:bg-secondary-300'
      },
      tertiary: {
        filled: 'bg-tertiary-500 hover:bg-tertiary-600 active:bg-tertiary-700 text-white',
        outlined: 'border-2 border-tertiary-500 text-tertiary-500 hover:bg-tertiary-50 active:bg-tertiary-100',
        text: 'text-tertiary-500 hover:bg-tertiary-50 active:bg-tertiary-100',
        elevated: 'bg-tertiary-500 hover:bg-tertiary-600 text-white shadow-tertiary-md',
        tonal: 'bg-tertiary-100 text-tertiary-700 hover:bg-tertiary-200 active:bg-tertiary-300'
      },
      success: {
        filled: 'bg-success-500 hover:bg-success-600 active:bg-success-700 text-white',
        outlined: 'border-2 border-success-500 text-success-500 hover:bg-success-50 active:bg-success-100',
        text: 'text-success-500 hover:bg-success-50 active:bg-success-100',
        elevated: 'bg-success-500 hover:bg-success-600 text-white shadow-lg',
        tonal: 'bg-success-100 text-success-700 hover:bg-success-200 active:bg-success-300'
      },
      warning: {
        filled: 'bg-warning-500 hover:bg-warning-600 active:bg-warning-700 text-white',
        outlined: 'border-2 border-warning-500 text-warning-500 hover:bg-warning-50 active:bg-warning-100',
        text: 'text-warning-500 hover:bg-warning-50 active:bg-warning-100',
        elevated: 'bg-warning-500 hover:bg-warning-600 text-white shadow-lg',
        tonal: 'bg-warning-100 text-warning-700 hover:bg-warning-200 active:bg-warning-300'
      },
      error: {
        filled: 'bg-error-500 hover:bg-error-600 active:bg-error-700 text-white',
        outlined: 'border-2 border-error-500 text-error-500 hover:bg-error-50 active:bg-error-100',
        text: 'text-error-500 hover:bg-error-50 active:bg-error-100',
        elevated: 'bg-error-500 hover:bg-error-600 text-white shadow-lg',
        tonal: 'bg-error-100 text-error-700 hover:bg-error-200 active:bg-error-300'
      },
      surface: {
        filled: 'bg-surface-600 hover:bg-surface-700 active:bg-surface-800 text-white',
        outlined: 'border-2 border-surface-300 text-surface-600 hover:bg-surface-50 active:bg-surface-100',
        text: 'text-surface-600 hover:bg-surface-50 active:bg-surface-100',
        elevated: 'bg-white hover:bg-surface-50 text-surface-900 shadow-lg border border-surface-200',
        tonal: 'bg-surface-100 text-surface-700 hover:bg-surface-200 active:bg-surface-300'
      }
    };

    return colorMap[color][variant];
  };

  // Disabled state
  const disabledClasses = disabled || loading 
    ? 'opacity-50 cursor-not-allowed pointer-events-none' 
    : 'cursor-pointer';

  // Ripple effect
  const rippleClasses = ripple && !disabled && !loading 
    ? 'relative overflow-hidden transition-all duration-200 ease-out before:absolute before:inset-0 before:bg-white before:opacity-0 hover:before:opacity-10 active:before:opacity-20' 
    : '';

  // Combined classes
  const combinedClasses = `
    inline-flex items-center justify-center
    font-medium
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${color}-500
    ${sizeClasses[size]}
    ${roundedClasses[rounded]}
    ${elevationClasses[elevation]}
    ${getVariantClasses()}
    ${disabledClasses}
    ${rippleClasses}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      ref={ref}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
      data-testid={testId}
      {...props}
    >
      <span className="relative flex items-center gap-2">
        {icon === 'leading' && !loading && <ChevronRight className="w-5 h-5" />}
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
        {icon === 'trailing' && !loading && <ChevronRight className="w-5 h-5" />}
      </span>
    </button>
  );
});

MaterialButton.displayName = 'MaterialButton';

// Pre-configured button variants
export const PrimaryButton = (props: Omit<MaterialButtonProps, 'variant' | 'color'>) => (
  <MaterialButton variant="filled" color="primary" {...props} />
);

export const SecondaryButton = (props: Omit<MaterialButtonProps, 'variant' | 'color'>) => (
  <MaterialButton variant="outlined" color="primary" {...props} />
);

export const TextButton = (props: Omit<MaterialButtonProps, 'variant' | 'color'>) => (
  <MaterialButton variant="text" color="primary" {...props} />
);