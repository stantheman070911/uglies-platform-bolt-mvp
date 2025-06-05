import { useState, useEffect, createContext, useContext } from 'react';
import { supabase, handleSupabaseError } from '@/services/supabase';
import type { User, LoginCredentials, RegisterData, UserRole } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signUp: (data: RegisterData) => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    region?: string;
    preferences?: Record<string, any>;
  }) => Promise<{ success: boolean; error?: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  updateProfile: async () => ({ success: false })
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;

        if (authUser) {
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select(`
              *,
              products:products(count),
              groups:group_buys(count),
              participations:group_participants(count)
            `)
            .eq('id', authUser.id)
            .single();

          if (profileError) throw profileError;

          setUser({
            id: profile.id,
            email: profile.email,
            role: profile.role as UserRole,
            displayName: profile.display_name,
            avatarUrl: profile.avatar_url,
            bio: profile.bio,
            region: profile.region,
            createdAt: profile.created_at,
            lastLogin: profile.last_login,
            isVerified: profile.is_verified,
            isActive: profile.is_active,
            preferences: profile.preferences || {},
            stats: {
              products: profile.products?.[0]?.count || 0,
              groups: profile.groups?.[0]?.count || 0,
              participations: profile.participations?.[0]?.count || 0
            }
          });
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select(`
            *,
            products:products(count),
            groups:group_buys(count),
            participations:group_participants(count)
          `)
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: profile.id,
            email: profile.email,
            role: profile.role as UserRole,
            displayName: profile.display_name,
            avatarUrl: profile.avatar_url,
            bio: profile.bio,
            region: profile.region,
            createdAt: profile.created_at,
            lastLogin: profile.last_login,
            isVerified: profile.is_verified,
            isActive: profile.is_active,
            preferences: profile.preferences || {},
            stats: {
              products: profile.products?.[0]?.count || 0,
              groups: profile.groups?.[0]?.count || 0,
              participations: profile.participations?.[0]?.count || 0
            }
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const updateProfile = async (updates: {
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    region?: string;
    preferences?: Record<string, any>;
  }) => {
    if (!user?.id) {
      return { success: false, error: 'No authenticated user' };
    }

    try {
      const result = await supabase.from('users').update({
        display_name: updates.displayName,
        bio: updates.bio,
        avatar_url: updates.avatarUrl,
        region: updates.region,
        preferences: updates.preferences ? {
          ...user.preferences,
          ...updates.preferences
        } : user.preferences,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single();

      if (result.error) throw result.error;

      setUser(prev => prev ? {
        ...prev,
        displayName: updates.displayName || prev.displayName,
        bio: updates.bio || prev.bio,
        avatarUrl: updates.avatarUrl || prev.avatarUrl,
        region: updates.region || prev.region,
        preferences: updates.preferences ? {
          ...prev.preferences,
          ...updates.preferences
        } : prev.preferences
      } : null);

      return { success: true };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  };

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    signIn: async (email, password) => ({ success: false }),
    signUp: async (data) => ({ success: false }),
    signOut: async () => {},
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};