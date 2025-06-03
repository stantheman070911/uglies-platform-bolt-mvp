import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { 
  Loader2, ChevronRight, Plus, Check, X, Download, Upload, Edit, 
  Trash2, Heart, Share2, Bookmark, Search, Filter, Menu, User,
  Home, Bell, Settings, ArrowRight, ArrowLeft, ExternalLink, Link,
  Save, Send, Globe, Lock, Unlock, Star, ShoppingCart, Mail, Calendar
} from 'lucide-react';

interface MaterialButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal';
  size?: 'small' | 'medium' | 'large' | 'xl';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'surface';
  icon?: 'none' | 'leading' | 'trailing' | 'only';
  iconType?: 'arrow' | 'plus' | 'check' | 'close' | 'download' | 'upload' | 'edit' | 'delete' | 
    'heart' | 'share' | 'bookmark' | 'search' | 'filter' | 'menu' | 'user' | 'home' | 'bell' | 
    'settings' | 'cart' | 'mail' | 'calendar' | 'custom';
  customIcon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: 'none' | 'small' | 'medium' | 'large' | 'full';
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  ripple?: boolean;
  href?: string;
  target?: string;
  testId?: string;
  ariaLabel?: string;
  badge?: string | number;
  tooltipText?: string;
}

const iconComponents = {
  arrow: ChevronRight,
  plus: Plus,
  check: Check,
  close: X,
  download: Download,
  upload: Upload,
  edit: Edit,
  delete: Trash2,
  heart: Heart,
  share: Share2,
  bookmark: Bookmark,
  search: Search,
  filter: Filter,
  menu: Menu,
  user: User,
  home: Home,
  bell: Bell,
  settings: Settings,
  cart: ShoppingCart,
  mail: Mail,
  calendar: Calendar
};

export const MaterialButton = forwardRef<HTMLButtonElement, MaterialButtonProps>(({
  variant = 'filled',
  size = 'medium',
  color = 'primary',
  icon = 'none',
  iconType,
  customIcon,
  loading = false,
  fullWidth = false,
  rounded = 'medium',
  elevation = 1,
  ripple = true,
  href,
  target,
  children,
  className = '',
  disabled = false,
  testId = 'material-button',
  ariaLabel,
  badge,
  tooltipText,
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

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
    xl: 'w-7 h-7'
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
    ? 'relative overflow-hidden transition-all duration-200 before:absolute before:inset-0 before:bg-white before:opacity-0 hover:before:opacity-10 active:before:opacity-20' 
    : '';

  // Icon rendering
  const renderIcon = () => {
    if (loading) {
      return <Loader2 className={`${iconSizes[size]} animate-spin`} />;
    }

    if (customIcon) {
      return <span className={iconSizes[size]}>{customIcon}</span>;
    }

    if (iconType && iconComponents[iconType]) {
      const IconComponent = iconComponents[iconType];
      return <IconComponent className={iconSizes[size]} />;
    }

    return null;
  };

  // Badge rendering
  const renderBadge = () => {
    if (!badge) return null;
    return (
      <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1">
        {badge}
      </span>
    );
  };

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

  // Render as link if href provided
  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={combinedClasses}
        aria-label={ariaLabel}
        title={tooltipText}
        data-testid={testId}
      >
        <span className="relative flex items-center gap-2">
          {icon === 'leading' && renderIcon()}
          {icon === 'only' ? renderIcon() : children}
          {icon === 'trailing' && renderIcon()}
          {renderBadge()}
        </span>
      </a>
    );
  }

  return (
    <button
      ref={ref}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      title={tooltipText}
      data-testid={testId}
      {...props}
    >
      <span className="relative flex items-center gap-2">
        {icon === 'leading' && renderIcon()}
        {icon === 'only' ? renderIcon() : children}
        {icon === 'trailing' && renderIcon()}
        {renderBadge()}
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

export const SuccessButton = (props: Omit<MaterialButtonProps, 'variant' | 'color'>) => (
  <MaterialButton variant="filled" color="success" {...props} />
);

export const WarningButton = (props: Omit<MaterialButtonProps, 'variant' | 'color'>) => (
  <MaterialButton variant="filled" color="warning" {...props} />
);

export const ErrorButton = (props: Omit<MaterialButtonProps, 'variant' | 'color'>) => (
  <MaterialButton variant="filled" color="error" {...props} />
);

export const IconButton = (props: Omit<MaterialButtonProps, 'icon'>) => (
  <MaterialButton icon="only" rounded="full" {...props} />
);

export const FloatingActionButton = (props: Omit<MaterialButtonProps, 'variant' | 'elevation' | 'rounded'>) => (
  <MaterialButton 
    variant="filled" 
    elevation={3} 
    rounded="full" 
    size="large"
    icon="only"
    className="fixed bottom-6 right-6 z-50"
    {...props} 
  />
);

// UGLIES Platform Specific Variants
export const JoinGroupButton = (props: Omit<MaterialButtonProps, 'iconType' | 'color'>) => (
  <MaterialButton iconType="plus" color="secondary" {...props} />
);

export const ShareButton = (props: Omit<MaterialButtonProps, 'iconType' | 'variant'>) => (
  <MaterialButton iconType="share" variant="outlined" {...props} />
);

export const FavoriteButton = (props: Omit<MaterialButtonProps, 'iconType' | 'variant'>) => (
  <MaterialButton iconType="heart" variant="text" {...props} />
);

export const CreateGroupButton = (props: Omit<MaterialButtonProps, 'iconType' | 'color'>) => (
  <MaterialButton iconType="plus" color="primary" icon="leading" {...props} />
);