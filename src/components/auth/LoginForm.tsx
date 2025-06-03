import React, { useState } from 'react';
import { MaterialInput } from '../ui/MaterialInput';
import { MaterialButton } from '../ui/MaterialButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onSwitchToRegister,
  className = ''
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result.success) {
        onSuccess?.();
      } else {
        setErrors({ 
          submit: result.error?.message || 'Login failed. Please try again.' 
        });
      }
    } catch (error: any) {
      setErrors({ 
        submit: 'An unexpected error occurred. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-surface-900 mb-2">Welcome Back</h2>
        <p className="text-surface-600">Sign in to your UGLIES account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <MaterialInput
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          startIcon={<Mail className="w-5 h-5" />}
          fullWidth
          disabled={isSubmitting}
          autoComplete="email"
          testId="login-email"
        />

        <MaterialInput
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={errors.password}
          startIcon={<Lock className="w-5 h-5" />}
          showPasswordToggle
          fullWidth
          disabled={isSubmitting}
          autoComplete="current-password"
          testId="login-password"
        />

        {errors.submit && (
          <div className="flex items-center gap-2 p-3 bg-error-50 border border-error-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-error-500 flex-shrink-0" />
            <p className="text-error-700 text-sm">{errors.submit}</p>
          </div>
        )}

        <MaterialButton
          type="submit"
          fullWidth
          size="large"
          loading={isSubmitting}
          disabled={isSubmitting}
          testId="login-submit"
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </MaterialButton>

        <div className="text-center">
          <p className="text-surface-600 text-sm">
            New to UGLIES?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-primary-600 hover:text-primary-700 font-medium"
              disabled={isSubmitting}
            >
              Create an account
            </button>
          </p>
        </div>
      </form>

      {isSubmitting && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
          <LoadingSpinner
            variant="spinner"
            message="Signing you in..."
            color="primary"
            size="medium"
          />
        </div>
      )}
    </div>
  );
};

export default LoginForm;