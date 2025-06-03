import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterData, UserRole } from '@/types/auth';
import { Mail, Lock, User, Loader } from 'lucide-react';

const RegisterForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>();
  const { register: signUp, error } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterData) => {
    setIsSubmitting(true);
    try {
      const success = await signUp(data);
      if (success) {
        navigate('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create an Account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
            Display Name
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <User size={18} />
            </div>
            <input
              id="displayName"
              type="text"
              placeholder="Your name"
              className={`form-input pl-10 ${errors.displayName ? 'border-red-500' : ''}`}
              {...register('displayName', { 
                required: 'Display name is required',
                minLength: {
                  value: 2,
                  message: 'Display name must be at least 2 characters'
                }
              })}
            />
          </div>
          {errors.displayName && (
            <p className="mt-1 text-sm text-red-600">{errors.displayName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Mail size={18} />
            </div>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={`form-input pl-10 ${errors.email ? 'border-red-500' : ''}`}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Lock size={18} />
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={`form-input pl-10 ${errors.password ? 'border-red-500' : ''}`}
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                }
              })}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            I am a...
          </label>
          <select
            id="role"
            className={`form-input ${errors.role ? 'border-red-500' : ''}`}
            {...register('role', { required: 'Please select a role' })}
          >
            <option value="">Select your role</option>
            <option value={UserRole.FARMER}>Farmer</option>
            <option value={UserRole.CUSTOMER}>Customer</option>
            <option value={UserRole.COORDINATOR}>Coordinator</option>
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary flex justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin mr-2\" size={18} />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth" className="text-green-600 hover:text-green-500 font-medium">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;