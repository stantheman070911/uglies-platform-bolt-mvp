import React, { useState } from 'react';
import { MaterialInput } from '../ui/MaterialInput';
import { MaterialButton } from '../ui/MaterialButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, User, MapPin, AlertCircle } from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
  className?: string;
}

const userTypes = [
  { 
    value: 'farmer', 
    label: 'Farmer',
    description: 'Sell quality produce, share your farm story, build community',
    icon: '🌱'
  },
  { 
    value: 'customer', 
    label: 'Customer',
    description: 'Buy fresh produce, join group purchases, support local farming',
    icon: '🛒'
  },
  { 
    value: 'coordinator', 
    label: 'Coordinator',
    description: 'Help organize community group buys, connect farmers with consumers',
    icon: '🤝'
  }
];

const globalRegions = [
  { value: 'local_area', label: 'Local Area', description: 'Farms within 25 miles' },
  { value: 'nearby', label: 'Nearby Farms', description: 'Regional agricultural communities' },
  { value: 'urban_farming', label: 'Urban Agriculture', description: 'City-based growing operations' },
  { value: 'organic_certified', label: 'Certified Organic', description: 'Certified organic producers' },
  { value: 'heritage_farms', label: 'Heritage Varieties', description: 'Traditional and heirloom producers' },
  { value: 'seasonal_local', label: 'Seasonal Focus', description: 'Peak season local harvest' }
];

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    userType: '',
    region: '',
    bio: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();

  const validateStep1 = () => {
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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.displayName) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

    if (!formData.userType) {
      newErrors.userType = 'Please select your role';
    }

    if (!formData.region) {
      newErrors.region = 'Please select your region';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
        userType: formData.userType as 'farmer' | 'customer' | 'coordinator',
        region: formData.region,
        bio: formData.bio
      });
      
      if (result.success) {
        onSuccess?.();
      } else {
        setErrors({ 
          submit: result.error?.message || 'Registration failed. Please try again.' 
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

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-surface-900 mb-2">Join UGLIES</h2>
        <p className="text-surface-600">Connect with local agriculture</p>
      </div>

      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 1 ? 'bg-primary-500 text-white' : 'bg-surface-200 text-surface-500'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-primary-500' : 'bg-surface-200'}`} />
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentStep >= 2 ? 'bg-primary-500 text-white' : 'bg-surface-200 text-surface-500'
          }`}>
            2
          </div>
        </div>
      </div>

      {currentStep === 1 ? (
        <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
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
            testId="register-email"
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
            autoComplete="new-password"
            testId="register-password"
          />

          <MaterialInput
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            error={errors.confirmPassword}
            startIcon={<Lock className="w-5 h-5" />}
            showPasswordToggle
            fullWidth
            disabled={isSubmitting}
            autoComplete="new-password"
            testId="register-confirm-password"
          />

          <MaterialButton
            type="submit"
            fullWidth
            size="large"
            iconType="arrow"
            icon="trailing"
            disabled={isSubmitting}
            testId="register-next"
          >
            Continue
          </MaterialButton>

          <div className="text-center">
            <p className="text-surface-600 text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary-600 hover:text-primary-700 font-medium"
                disabled={isSubmitting}
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <MaterialInput
            label="Display Name"
            type="text"
            value={formData.displayName}
            onChange={handleInputChange('displayName')}
            error={errors.displayName}
            startIcon={<User className="w-5 h-5" />}
            fullWidth
            disabled={isSubmitting}
            placeholder="How should we call you?"
            testId="register-display-name"
          />

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-3">
              I am a... <span className="text-error-500">*</span>
            </label>
            <div className="space-y-3">
              {userTypes.map((type) => (
                <label
                  key={type.value}
                  className={`
                    flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${formData.userType === type.value 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-surface-200 hover:border-surface-300'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="userType"
                    value={type.value}
                    checked={formData.userType === type.value}
                    onChange={handleInputChange('userType')}
                    className="sr-only"
                  />
                  <span className="text-2xl mr-3">{type.icon}</span>
                  <div>
                    <div className="font-medium text-surface-900">{type.label}</div>
                    <div className="text-sm text-surface-600">{type.description}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.userType && (
              <p className="mt-1 text-sm text-error-600">{errors.userType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Region <span className="text-error-500">*</span>
            </label>
            <select
              value={formData.region}
              onChange={handleInputChange('region')}
              className={`
                w-full px-4 py-3 border-2 rounded-lg bg-white transition-colors
                ${errors.region ? 'border-error-500' : 'border-surface-300 focus:border-primary-500'}
              `}
              disabled={isSubmitting}
            >
              <option value="">Select your region</option>
              {globalRegions.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label} - {region.description}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className="mt-1 text-sm text-error-600">{errors.region}</p>
            )}
          </div>

          {formData.userType === 'farmer' && (
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Tell us about your farm (optional)
              </label>
              <textarea
                value={formData.bio}
                onChange={handleInputChange('bio')}
                placeholder="Share your farming story, specialties, or philosophy..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-surface-300 rounded-lg focus:border-primary-500 transition-colors resize-none"
                disabled={isSubmitting}
              />
            </div>
          )}

          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-error-50 border border-error-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-error-500 flex-shrink-0" />
              <p className="text-error-700 text-sm">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-3">
            <MaterialButton
              type="button"
              variant="outlined"
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex-1"
            >
              Back
            </MaterialButton>
            <MaterialButton
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="flex-1"
              testId="register-submit"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </MaterialButton>
          </div>
        </form>
      )}

      {isSubmitting && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center rounded-lg">
          <LoadingSpinner
            variant="spinner"
            message="Creating your account..."
            submessage="Welcome to the UGLIES community!"
            color="primary"
            size="medium"
          />
        </div>
      )}
    </div>
  );
};

export default RegisterForm;