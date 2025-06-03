import React, { useState } from 'react';
import { LoginForm, RegisterForm } from '@/components/auth';
import { useSearchParams } from 'react-router-dom';

enum AuthMode {
  LOGIN = 'login',
  REGISTER = 'register'
}

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' 
    ? AuthMode.REGISTER 
    : AuthMode.LOGIN;
  
  const [mode, setMode] = useState<AuthMode>(initialMode);
  
  return (
    <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Toggle Buttons */}
        <div className="flex rounded-md shadow-sm mb-8">
          <button
            type="button"
            onClick={() => setMode(AuthMode.LOGIN)}
            className={`w-1/2 py-3 px-4 text-center font-medium rounded-l-md ${
              mode === AuthMode.LOGIN
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-r-0 border-gray-200`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode(AuthMode.REGISTER)}
            className={`w-1/2 py-3 px-4 text-center font-medium rounded-r-md ${
              mode === AuthMode.REGISTER
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-200`}
          >
            Register
          </button>
        </div>
        
        {mode === AuthMode.LOGIN ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default AuthPage;