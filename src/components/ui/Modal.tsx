import React, { useEffect, useRef, forwardRef, HTMLAttributes } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { MaterialButton } from './MaterialButton';

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  size?: 'small' | 'medium' | 'large' | 'xl' | 'fullscreen';
  variant?: 'default' | 'alert' | 'confirm' | 'form';
  title?: string;
  subtitle?: string;
  icon?: 'none' | 'info' | 'success' | 'warning' | 'error' | 'custom';
  customIcon?: React.ReactNode;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  actions?: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
    variant?: 'filled' | 'outlined' | 'text';
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'filled' | 'outlined' | 'text';
  };
  backdrop?: 'blur' | 'dark' | 'light' | 'transparent';
  animation?: 'fade' | 'scale' | 'slide' | 'none';
  persistent?: boolean;
  testId?: string;
  ariaLabel?: string;
  focusTrap?: boolean;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(({
  isOpen,
  onClose,
  size = 'medium',
  variant = 'default',
  title,
  subtitle,
  icon = 'none',
  customIcon,
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  actions,
  primaryAction,
  secondaryAction,
  backdrop = 'blur',
  animation = 'scale',
  persistent = false,
  testId = 'modal',
  ariaLabel,
  focusTrap = true,
  children,
  className = '',
  ...props
}, ref) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Size configurations
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
    xl: 'max-w-2xl',
    fullscreen: 'max-w-full h-full w-full'
  };

  // Backdrop configurations
  const backdropClasses = {
    blur: 'bg-black bg-opacity-50 backdrop-blur-sm',
    dark: 'bg-black bg-opacity-70',
    light: 'bg-white bg-opacity-80',
    transparent: 'bg-transparent'
  };

  // Animation configurations
  const animationClasses = {
    fade: {
      enter: 'transition-opacity duration-300 ease-out opacity-0',
      enterActive: 'opacity-100',
      exit: 'transition-opacity duration-200 ease-in opacity-100',
      exitActive: 'opacity-0'
    },
    scale: {
      enter: 'transition-all duration-300 ease-out opacity-0 scale-95',
      enterActive: 'opacity-100 scale-100',
      exit: 'transition-all duration-200 ease-in opacity-100 scale-100',
      exitActive: 'opacity-0 scale-95'
    },
    slide: {
      enter: 'transition-all duration-300 ease-out opacity-0 translate-y-4',
      enterActive: 'opacity-100 translate-y-0',
      exit: 'transition-all duration-200 ease-in opacity-100 translate-y-0',
      exitActive: 'opacity-0 translate-y-4'
    },
    none: {
      enter: '',
      enterActive: '',
      exit: '',
      exitActive: ''
    }
  };

  // Icon configurations
  const iconComponents = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle
  };

  const iconColors = {
    info: 'text-primary-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    error: 'text-error-500'
  };

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      if (focusTrap && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        firstElement?.focus();
      }
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }

    return () => {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, focusTrap]);

  // Keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      if (event.key === 'Escape' && closeOnEscape && !persistent) {
        onClose();
      }

      // Focus trap
      if (focusTrap && event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, focusTrap, persistent, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnBackdrop && !persistent) {
      onClose();
    }
  };

  // Render icon
  const renderIcon = () => {
    if (icon === 'none') return null;
    
    if (customIcon) {
      return <div className="w-6 h-6 flex items-center justify-center">{customIcon}</div>;
    }

    if (icon !== 'custom' && iconComponents[icon]) {
      const IconComponent = iconComponents[icon];
      return <IconComponent className={`w-6 h-6 ${iconColors[icon]}`} />;
    }

    return null;
  };

  // Render actions
  const renderActions = () => {
    if (actions) return actions;

    if (!primaryAction && !secondaryAction) return null;

    return (
      <div className="flex items-center justify-end space-x-3 pt-4">
        {secondaryAction && (
          <MaterialButton
            variant={secondaryAction.variant || 'outlined'}
            onClick={secondaryAction.onClick}
            color="surface"
          >
            {secondaryAction.label}
          </MaterialButton>
        )}
        {primaryAction && (
          <MaterialButton
            variant={primaryAction.variant || 'filled'}
            color={primaryAction.color || 'primary'}
            loading={primaryAction.loading}
            onClick={primaryAction.onClick}
          >
            {primaryAction.label}
          </MaterialButton>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${backdropClasses[backdrop]}`}
      onClick={handleBackdropClick}
      data-testid={`${testId}-backdrop`}
    >
      <div
        ref={modalRef}
        className={`
          relative bg-white rounded-xl shadow-elevation-3
          ${sizeClasses[size]}
          ${size !== 'fullscreen' ? 'mx-4 my-8' : ''}
          ${animationClasses[animation].enter}
          ${isOpen ? animationClasses[animation].enterActive : ''}
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title}
        data-testid={testId}
        {...props}
      >
        {/* Close Button */}
        {showCloseButton && !persistent && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-colors z-10"
            data-testid={`${testId}-close`}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header */}
        {(title || subtitle || icon !== 'none') && (
          <div className={`p-6 ${children || renderActions() ? 'pb-4' : ''}`}>
            <div className="flex items-start space-x-3">
              {renderIcon()}
              <div className="flex-1">
                {title && (
                  <h2 className="text-xl font-semibold text-surface-900 mb-1">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-surface-600 text-sm">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {children && (
          <div className={`px-6 ${!(title || subtitle || icon !== 'none') ? 'pt-6' : ''} ${!renderActions() ? 'pb-6' : ''}`}>
            {children}
          </div>
        )}

        {/* Actions */}
        {renderActions() && (
          <div className="px-6 pb-6">
            {renderActions()}
          </div>
        )}
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

// Pre-configured modal variants
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "warning",
  loading = false,
  ...props
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'warning' | 'error' | 'info';
  loading?: boolean;
} & Omit<ModalProps, 'primaryAction' | 'secondaryAction'>) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    size="small"
    icon={variant}
    title={title}
    primaryAction={{
      label: confirmLabel,
      onClick: onConfirm,
      loading,
      color: variant === 'error' ? 'error' : variant === 'warning' ? 'warning' : 'primary'
    }}
    secondaryAction={{
      label: cancelLabel,
      onClick: onClose
    }}
    {...props}
  >
    <p className="text-surface-700">{message}</p>
  </Modal>
);

// Join Group Modal for UGLIES Platform
export const JoinGroupModal = ({
  isOpen,
  onClose,
  onJoin,
  group,
  loading = false,
  ...props
}: {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (quantity: number) => void;
  group: any;
  loading?: boolean;
} & Omit<ModalProps, 'primaryAction' | 'secondaryAction'>) => {
  const [quantity, setQuantity] = React.useState(1);
  const estimatedCost = quantity * (group?.current_price_per_unit || 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Group Buy"
      icon="success"
      primaryAction={{
        label: `Join for $${estimatedCost.toFixed(2)}`,
        onClick: () => onJoin(quantity),
        loading,
        color: 'secondary'
      }}
      secondaryAction={{
        label: "Cancel",
        onClick: onClose
      }}
      {...props}
    >
      <div className="space-y-4">
        <div className="bg-surface-50 rounded-lg p-4">
          <h4 className="font-semibold text-surface-900 mb-2">{group?.product?.name}</h4>
          <p className="text-surface-600 text-sm mb-3">{group?.product?.description}</p>
          <div className="flex items-center justify-between text-sm">
            <span>Current Price</span>
            <span className="font-bold text-secondary-600">${group?.current_price_per_unit}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg border border-surface-300 flex items-center justify-center hover:bg-surface-50"
            >
              -
            </button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg border border-surface-300 flex items-center justify-center hover:bg-surface-50"
            >
              +
            </button>
          </div>
        </div>

        <div className="bg-secondary-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-secondary-700 font-medium">Total Cost</span>
            <span className="text-xl font-bold text-secondary-800">${estimatedCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Share Group Modal for UGLIES Platform
export const ShareGroupModal = ({
  isOpen,
  onClose,
  inviteCode,
  groupTitle,
  ...props
}: {
  isOpen: boolean;
  onClose: () => void;
  inviteCode: string;
  groupTitle: string;
} & Omit<ModalProps, 'primaryAction'>) => {
  const [copied, setCopied] = React.useState(false);
  const shareUrl = `${window.location.origin}/groups/join/${inviteCode}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Group Buy"
      icon="info"
      primaryAction={{
        label: copied ? "Copied!" : "Copy Link",
        onClick: handleCopy,
        color: copied ? 'success' : 'primary'
      }}
      {...props}
    >
      <div className="space-y-4">
        <p className="text-surface-600">
          Share this group buy with friends to reach the target quantity and get better prices!
        </p>
        
        <div className="bg-surface-50 rounded-lg p-4">
          <h4 className="font-semibold text-surface-900 mb-2">{groupTitle}</h4>
          <p className="text-surface-600 text-sm mb-3">Invite Code: <span className="font-mono font-bold">{inviteCode}</span></p>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-2">
            Share Link
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-surface-300 rounded-lg bg-surface-50 text-sm"
            />
            <MaterialButton
              variant="outlined"
              size="small"
              onClick={handleCopy}
              iconType={copied ? 'check' : 'share'}
            >
              {copied ? 'Copied' : 'Copy'}
            </MaterialButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// Form Modal Wrapper
export const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  submitLabel = "Submit",
  loading = false,
  children,
  ...props
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  submitLabel?: string;
  loading?: boolean;
  children: React.ReactNode;
} & Omit<ModalProps, 'primaryAction' | 'secondaryAction'>) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="medium"
    primaryAction={{
      label: submitLabel,
      onClick: onSubmit,
      loading,
      color: 'primary'
    }}
    secondaryAction={{
      label: "Cancel",
      onClick: onClose
    }}
    {...props}
  >
    {children}
  </Modal>
);