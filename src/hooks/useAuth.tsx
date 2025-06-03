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
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: any }>;
  checkPermissions: () => Promise<{
    canCreateGroups: boolean;
    canJoinGroups: boolean;
    canCreateProducts: boolean;
    canManageGroups: boolean;
  }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
  signIn: async () => ({ success: false }),
  signUp: async () => ({ success: false }),
  signOut: async () => {},
  updateProfile: async () => ({ success: false }),
  checkPermissions: async () => ({
    canCreateGroups: false,
    canJoinGroups: false,
    canCreateProducts: false,
    canManageGroups: false
  })
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for current user on initial load
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

    // Subscribe to auth changes
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

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      return { success: true, user: data.user };
    } catch (error) {
      const message = handleSupabaseError(error);
      setError(message);
      return { success: false, error: message };
    }
  };

  const signUp = async (data: RegisterData) => {
    try {
      setError(null);
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName,
            role: data.role
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          role: data.role,
          display_name: data.displayName,
          region: data.region,
          bio: data.bio || null,
          is_verified: false,
          is_active: true,
          created_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      return { success: true };
    } catch (error) {
      const message = handleSupabaseError(error);
      setError(message);
      return { success: false, error: message };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      setError(handleSupabaseError(error));
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error('No authenticated user');

      const { error } = await supabase
        .from('users')
        .update({
          display_name: updates.displayName,
          bio: updates.bio,
          avatar_url: updates.avatarUrl,
          region: updates.region,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setUser(prev => prev ? { ...prev, ...updates } : null);
      return { success: true };
    } catch (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
  };

  const checkPermissions = async () => {
    if (!user) {
      return {
        canCreateGroups: false,
        canJoinGroups: false,
        canCreateProducts: false,
        canManageGroups: false
      };
    }

    return {
      canCreateGroups: user.isActive && user.role !== 'farmer',
      canJoinGroups: user.isActive,
      canCreateProducts: user.role === 'farmer' && user.isVerified,
      canManageGroups: ['coordinator', 'admin'].includes(user.role)
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        updateProfile,
        checkPermissions
      }}
    >
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