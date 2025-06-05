import React, { useState } from 'react';
// FIX: Changed from named import to two default imports
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

enum AuthMode {
  LOGIN = 'login',
  REGISTER = 'register'
}

const AuthPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const initialMode = searchParams.get('mode') === 'register' 
    ? AuthMode.REGISTER 
    : AuthMode.LOGIN;
  
  const [mode, setMode] = useState<AuthMode>(initialMode);

  useEffect(() => {
    // If user is already authenticated, redirect them away from auth page
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleSuccess = () => {
    navigate('/profile'); // Navigate to profile page on successful login/register
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setSearchParams({ mode: newMode });
  };
  
  return (
    <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Toggle Buttons */}
        <div className="flex rounded-lg shadow-sm mb-8 bg-surface-100 p-1">
          <button
            type="button"
            onClick={() => handleSwitchMode(AuthMode.LOGIN)}
            className={`w-1/2 py-2.5 px-4 text-center font-semibold rounded-md transition-all duration-300 ${
              mode === AuthMode.LOGIN
                ? 'bg-white text-primary-600 shadow'
                : 'bg-transparent text-surface-600 hover:bg-surface-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode(AuthMode.REGISTER)}
            className={`w-1/2 py-2.5 px-4 text-center font-semibold rounded-md transition-all duration-300 ${
              mode === AuthMode.REGISTER
                ? 'bg-white text-primary-600 shadow'
                : 'bg-transparent text-surface-600 hover:bg-surface-200'
            }`}
          >
            Register
          </button>
        </div>
        
        {mode === AuthMode.LOGIN 
          ? <LoginForm onSuccess={handleSuccess} onSwitchToRegister={() => handleSwitchMode(AuthMode.REGISTER)} /> 
          : <RegisterForm onSuccess={handleSuccess} onSwitchToLogin={() => handleSwitchMode(AuthMode.LOGIN)} />
        }
      </div>
    </div>
  );
};

export default AuthPage;