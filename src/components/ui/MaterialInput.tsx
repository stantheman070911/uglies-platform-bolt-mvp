import React, { forwardRef, InputHTMLAttributes, useState, useRef, useImperativeHandle } from 'react';
import { Eye, EyeOff, AlertCircle, Check, X } from 'lucide-react';

interface MaterialInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  success?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'standard';
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  loading?: boolean;
  showPasswordToggle?: boolean;
  showClearButton?: boolean;
  onClear?: () => void;
  testId?: string;
}

export interface MaterialInputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
}

export const MaterialInput = forwardRef<MaterialInputRef, MaterialInputProps>(({
  label,
  helperText,
  error,
  success = false,
  size = 'medium',
  variant = 'outlined',
  fullWidth = false,
  startIcon,
  endIcon,
  loading = false,
  showPasswordToggle = false,
  showClearButton = false,
  onClear,
  testId = 'material-input',
  className = '',
  disabled = false,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: () => {
      if (inputRef.current) {
        inputRef.current.value = '';
        onChange?.({ target: inputRef.current } as React.ChangeEvent<HTMLInputElement>);
      }
      onClear?.();
    }
  }));

  // Size configurations
  const sizeClasses = {
    small: {
      input: 'h-8 text-sm',
      label: 'text-xs',
      padding: 'px-3',
      icon: 'w-4 h-4'
    },
    medium: {
      input: 'h-10 text-base',
      label: 'text-sm',
      padding: 'px-4',
      icon: 'w-5 h-5'
    },
    large: {
      input: 'h-12 text-lg',
      label: 'text-base',
      padding: 'px-5',
      icon: 'w-6 h-6'
    }
  };

  // Variant configurations
  const getVariantClasses = () => {
    const baseClasses = 'transition-all duration-200 ease-out';
    const variantMap = {
      outlined: {
        wrapper: `
          ${baseClasses}
          relative
          rounded-lg
          border-2
          ${error ? 'border-error-500' : focused ? 'border-primary-500' : 'border-surface-300'}
          ${focused ? 'border-primary-500' : ''}
          ${success ? 'border-success-500' : ''}
          ${disabled ? 'border-surface-200 bg-surface-50' : ''}
        `,
        input: `
          bg-transparent
          w-full
          outline-none
          ${sizeClasses[size].input}
          ${sizeClasses[size].padding}
          ${startIcon ? 'pl-10' : ''}
          ${(endIcon || showPasswordToggle || showClearButton) ? 'pr-10' : ''}
        `,
        label: `
          absolute
          left-3
          transition-all
          duration-200
          ${focused || value ? '-top-2.5 bg-white px-1 text-sm' : `top-1/2 -translate-y-1/2 ${sizeClasses[size].label}`}
          ${error ? 'text-error-500' : focused ? 'text-primary-500' : 'text-surface-500'}
          ${success ? 'text-success-500' : ''}
          ${disabled ? 'text-surface-400' : ''}
        `
      },
      filled: {
        wrapper: `
          ${baseClasses}
          relative
          rounded-t-lg
          border-b-2
          bg-surface-100
          ${error ? 'border-error-500' : focused ? 'border-primary-500' : 'border-surface-300'}
          ${focused ? 'border-primary-500' : ''}
          ${success ? 'border-success-500' : ''}
          ${disabled ? 'border-surface-200 bg-surface-50' : ''}
        `,
        input: `
          bg-transparent
          w-full
          outline-none
          pt-6
          ${sizeClasses[size].input}
          ${sizeClasses[size].padding}
          ${startIcon ? 'pl-10' : ''}
          ${(endIcon || showPasswordToggle || showClearButton) ? 'pr-10' : ''}
        `,
        label: `
          absolute
          left-3
          transition-all
          duration-200
          ${focused || value ? 'top-2 text-xs' : `top-1/2 -translate-y-1/2 ${sizeClasses[size].label}`}
          ${error ? 'text-error-500' : focused ? 'text-primary-500' : 'text-surface-500'}
          ${success ? 'text-success-500' : ''}
          ${disabled ? 'text-surface-400' : ''}
        `
      },
      standard: {
        wrapper: `
          ${baseClasses}
          relative
          border-b-2
          ${error ? 'border-error-500' : focused ? 'border-primary-500' : 'border-surface-300'}
          ${focused ? 'border-primary-500' : ''}
          ${success ? 'border-success-500' : ''}
          ${disabled ? 'border-surface-200' : ''}
        `,
        input: `
          bg-transparent
          w-full
          outline-none
          ${sizeClasses[size].input}
          ${sizeClasses[size].padding}
          ${startIcon ? 'pl-10' : ''}
          ${(endIcon || showPasswordToggle || showClearButton) ? 'pr-10' : ''}
        `,
        label: `
          absolute
          left-3
          transition-all
          duration-200
          ${focused || value ? '-top-6 text-sm' : `top-1/2 -translate-y-1/2 ${sizeClasses[size].label}`}
          ${error ? 'text-error-500' : focused ? 'text-primary-500' : 'text-surface-500'}
          ${success ? 'text-success-500' : ''}
          ${disabled ? 'text-surface-400' : ''}
        `
      }
    };

    return variantMap[variant];
  };

  const variantClasses = getVariantClasses();

  // Handle focus events
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  // Handle password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle clear button click
  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      onChange?.({ target: inputRef.current } as React.ChangeEvent<HTMLInputElement>);
    }
    onClear?.();
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'max-w-sm'} ${className}`}>
      <div className={variantClasses.wrapper}>
        {/* Start Icon */}
        {startIcon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 ${sizeClasses[size].icon}`}>
            {startIcon}
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type={showPassword ? 'text' : type}
          className={variantClasses.input}
          disabled={disabled || loading}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-testid={testId}
          {...props}
        />

        {/* Label */}
        {label && (
          <label className={variantClasses.label}>
            {label}
          </label>
        )}

        {/* End Icon Area */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Password Toggle */}
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-surface-400 hover:text-surface-600 focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className={sizeClasses[size].icon} />
              ) : (
                <Eye className={sizeClasses[size].icon} />
              )}
            </button>
          )}

          {/* Clear Button */}
          {showClearButton && value && !disabled && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="text-surface-400 hover:text-surface-600 focus:outline-none"
            >
              <X className={sizeClasses[size].icon} />
            </button>
          )}

          {/* Success/Error Icons */}
          {!loading && (
            <>
              {success && <Check className={`${sizeClasses[size].icon} text-success-500`} />}
              {error && <AlertCircle className={`${sizeClasses[size].icon} text-error-500`} />}
            </>
          )}

          {/* Custom End Icon */}
          {endIcon}
        </div>
      </div>

      {/* Helper Text */}
      {(helperText || error) && (
        <div className={`mt-1 text-sm ${error ? 'text-error-500' : 'text-surface-500'}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

MaterialInput.displayName = 'MaterialInput';

// Pre-configured input variants
export const EmailInput = (props: Omit<MaterialInputProps, 'type' | 'label' | 'helperText'>) => (
  <MaterialInput
    type="email"
    label="Email Address"
    helperText="Enter your email address"
    {...props}
  />
);

export const PasswordInput = (props: Omit<MaterialInputProps, 'type' | 'label' | 'showPasswordToggle'>) => (
  <MaterialInput
    type="password"
    label="Password"
    showPasswordToggle
    {...props}
  />
);

export const SearchInput = (props: Omit<MaterialInputProps, 'type' | 'startIcon'>) => (
  <MaterialInput
    type="search"
    startIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>}
    {...props}
  />
);