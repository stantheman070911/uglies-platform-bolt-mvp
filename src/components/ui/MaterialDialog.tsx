import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { MaterialButton } from './MaterialButton';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

interface MaterialDialogProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  position?: 'center' | 'top' | 'bottom';
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
  preventScroll?: boolean;
  fullScreen?: boolean;
  testId?: string;
}

export const MaterialDialog = forwardRef<HTMLDivElement, MaterialDialogProps>(({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  size = 'medium',
  position = 'center',
  showCloseButton = true,
  closeOnEscape = true,
  closeOnClickOutside = true,
  preventScroll = true,
  fullScreen = false,
  testId = 'material-dialog',
}, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Size configurations
  const sizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
    full: 'max-w-full w-full mx-4'
  };

  // Position configurations
  const positionClasses = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-16',
    bottom: 'items-end justify-center pb-16'
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, closeOnEscape]);

  // Handle scroll lock
  useEffect(() => {
    if (preventScroll) {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open, preventScroll]);

  // Handle animation timing
  useEffect(() => {
    if (open) {
      setIsVisible(true);
      setIsClosing(false);
    }
  }, [open]);

  // Handle click outside
  useOnClickOutside(dialogRef, () => {
    if (closeOnClickOutside) {
      handleClose();
    }
  });

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 200);
  };

  if (!isVisible && !open) {
    return null;
  }

  return createPortal(
    <div
      className={`
        fixed inset-0 z-50
        flex ${positionClasses[position]}
        bg-black bg-opacity-50 backdrop-blur-sm
        transition-opacity duration-200
        ${isClosing ? 'opacity-0' : 'opacity-100'}
      `}
      role="dialog"
      aria-modal="true"
      data-testid={testId}
    >
      <div
        ref={dialogRef}
        className={`
          relative
          bg-white
          rounded-lg
          shadow-elevation-3
          transform
          transition-all
          duration-200
          ${fullScreen ? 'w-screen h-screen m-0 rounded-none' : sizeClasses[size]}
          ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        `}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-surface-100 text-surface-500"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        )}

        {/* Header */}
        {(title || description) && (
          <div className="p-6 pb-0">
            {title && (
              <h2 className="text-xl font-semibold text-surface-900 mb-2">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-surface-600">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="px-6 py-4 bg-surface-50 border-t border-surface-200 rounded-b-lg flex justify-end space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
});

MaterialDialog.displayName = 'MaterialDialog';

// Pre-configured dialog variants
export const ConfirmDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'success';
}> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger'
}) => {
  const variantClasses = {
    danger: 'bg-error-500 hover:bg-error-600',
    warning: 'bg-warning-500 hover:bg-warning-600',
    success: 'bg-success-500 hover:bg-success-600'
  };

  return (
    <MaterialDialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="small"
      actions={
        <>
          <MaterialButton
            variant="text"
            color="surface"
            onClick={onClose}
          >
            {cancelText}
          </MaterialButton>
          <MaterialButton
            variant="filled"
            color={variant === 'danger' ? 'error' : variant === 'warning' ? 'warning' : 'success'}
            onClick={onConfirm}
          >
            {confirmText}
          </MaterialButton>
        </>
      }
    />
  );
};

export const FormDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  submitText?: string;
  cancelText?: string;
  children: React.ReactNode;
}> = ({
  open,
  onClose,
  onSubmit,
  title,
  submitText = 'Submit',
  cancelText = 'Cancel',
  children
}) => {
  return (
    <MaterialDialog
      open={open}
      onClose={onClose}
      title={title}
      size="medium"
      actions={
        <>
          <MaterialButton
            variant="text"
            color="surface"
            onClick={onClose}
          >
            {cancelText}
          </MaterialButton>
          <MaterialButton
            variant="filled"
            color="primary"
            onClick={onSubmit}
          >
            {submitText}
          </MaterialButton>
        </>
      }
    >
      {children}
    </MaterialDialog>
  );
};