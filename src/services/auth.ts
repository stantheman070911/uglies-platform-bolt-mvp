import { supabase, handleSupabaseError } from './supabase';
import type { LoginCredentials, RegisterData, User, UserRole } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export async function signIn(
  credentials: LoginCredentials
): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;

    // Fetch user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select(`
        *,
        products:products(count),
        groups:group_buys(count),
        participations:group_participants(count)
      `)
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    // Transform database user to our app User type
    const user: User = {
      id: profileData.id,
      email: profileData.email,
      role: profileData.role as UserRole,
      displayName: profileData.display_name,
      avatarUrl: profileData.avatar_url || undefined,
      createdAt: profileData.created_at,
      lastLogin: profileData.last_login || undefined,
      isVerified: profileData.is_verified,
      isActive: profileData.is_active,
      metadata: profileData.metadata || undefined,
    };

    return {
      data: user,
      error: null,
      status: 200,
    };
  } catch (err) {
    const error = err as Error;
    return {
      data: null,
      error: handleSupabaseError(error),
      status: 500,
    };
  }
}

export async function signUp(
  registerData: RegisterData
): Promise<ApiResponse<User>> {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
    });

    if (authError) throw authError;

    if (!authData.user) {
      throw new Error('User creation failed');
    }

    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id,
          email: registerData.email,
          role: registerData.role,
          display_name: registerData.displayName,
          is_verified: false,
          is_active: true,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (profileError) throw profileError;

    // Transform database user to our app User type
    const user: User = {
      id: profileData.id,
      email: profileData.email,
      role: profileData.role as UserRole,
      displayName: profileData.display_name,
      avatarUrl: profileData.avatar_url || undefined,
      createdAt: profileData.created_at,
      lastLogin: profileData.last_login || undefined,
      isVerified: profileData.is_verified,
      isActive: profileData.is_active,
      metadata: profileData.metadata || undefined,
    };

    return {
      data: user,
      error: null,
      status: 200,
    };
  } catch (err) {
    const error = err as Error;
    return {
      data: null,
      error: handleSupabaseError(error),
      status: 500,
    };
  }
}

export async function signOut(): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return {
      data: null,
      error: null,
      status: 200,
    };
  } catch (err) {
    const error = err as Error;
    return {
      data: null,
      error: handleSupabaseError(error),
      status: 500,
    };
  }
}

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user) {
      return {
        data: null,
        error: authError?.message || 'No authenticated user found',
        status: 401,
      };
    }

    // Fetch user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select(`
        *,
        products:products(count),
        groups:group_buys(count),
        participations:group_participants(count)
      `)
      .eq('id', authData.user.id)
      .single();

    if (profileError) throw profileError;

    // Transform database user to our app User type
    const user: User = {
      id: profileData.id,
      email: profileData.email,
      role: profileData.role as UserRole,
      displayName: profileData.display_name,
      avatarUrl: profileData.avatar_url || undefined,
      createdAt: profileData.created_at,
      lastLogin: profileData.last_login || undefined,
      isVerified: profileData.is_verified,
      isActive: profileData.is_active,
      metadata: profileData.metadata || undefined,
    };

    return {
      data: user,
      error: null,
      status: 200,
    };
  } catch (err) {
    const error = err as Error;
    return {
      data: null,
      error: handleSupabaseError(error),
      status: 500,
    };
  }
}

// Get user profile with complete info
export const getUserProfile = async (userId: string) => {
  try {
    const { data: profile, error } = await supabase
      .from('users')
      .select(`
        *,
        products:products(count),
        groups:group_buys(count),
        participations:group_participants(count)
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { success: true, data: profile };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error) 
    };
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  phone_number?: string;
  location?: any;
  preferences?: any;
}) => {
  try {
    const { data: profile, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return { success: true, data: profile };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error) 
    };
  }
};

// Check if user can create groups (not blocked, verified, etc.)
export const checkUserPermissions = async (userId: string) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select(`
        role,
        created_at,
        is_verified,
        is_active,
        status
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;

    const canCreateGroups = user.is_active && user.status === 'active';
    const canJoinGroups = user.is_active && user.status === 'active';
    const canCreateProducts = user.role === 'farmer' && user.is_verified;
    const canManageGroups = user.role === 'coordinator' || user.role === 'admin';

    return {
      success: true,
      permissions: {
        canCreateGroups,
        canJoinGroups,
        canCreateProducts,
        canManageGroups,
        role: user.role,
        isVerified: user.is_verified,
        isActive: user.is_active,
        status: user.status
      }
    };
  } catch (error) {
    return { 
      success: false, 
      error: handleSupabaseError(error) 
    };
  }
};