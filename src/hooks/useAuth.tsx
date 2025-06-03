import { useState, useEffect, createContext, useContext } from 'react';
import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUser 
} from '@/services/auth';
import type { User, LoginCredentials, RegisterData, AuthState } from '@/types/auth';
import { supabase } from '@/services/supabase';

// Create Auth context
const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<boolean>;
}>({
  user: null,
  isLoading: true,
  error: null,
  login: async () => false,
  register: async () => false,
  logout: async () => false,
});

// Auth Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check for current user on initial load
    const checkUser = async () => {
      try {
        const { data, error } = await getCurrentUser();
        
        if (error) {
          setAuthState({
            user: null,
            isLoading: false,
            error: null, // Don't show error on initial load
          });
          return;
        }

        setAuthState({
          user: data,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setAuthState({
          user: null,
          isLoading: false,
          error: null, // Don't show error on initial load
        });
      }
    };
    
    checkUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data } = await getCurrentUser();
          setAuthState({
            user: data,
            isLoading: false,
            error: null,
          });
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      }
    );

    // Clean up subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState({ ...authState, isLoading: true, error: null });
    
    const { data, error } = await signIn(credentials);
    
    setAuthState({
      user: data,
      isLoading: false,
      error: error,
    });
    
    return !error;
  };

  // Register function
  const register = async (registerData: RegisterData): Promise<boolean> => {
    setAuthState({ ...authState, isLoading: true, error: null });
    
    const { data, error } = await signUp(registerData);
    
    setAuthState({
      user: data,
      isLoading: false,
      error: error,
    });
    
    return !error;
  };

  // Logout function
  const logout = async (): Promise<boolean> => {
    setAuthState({ ...authState, isLoading: true, error: null });
    
    const { error } = await signOut();
    
    if (error) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: error,
      });
      return false;
    }
    
    setAuthState({
      user: null,
      isLoading: false,
      error: null,
    });
    
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isLoading: authState.isLoading,
        error: authState.error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};