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
      bio: profileData.bio,
      region: profileData.region,
      createdAt: profileData.created_at,
      lastLogin: profileData.last_login || undefined,
      isVerified: profileData.is_verified,
      isActive: profileData.is_active,
      preferences: profileData.preferences || {},
      stats: {
        products: profileData.products?.[0]?.count || 0,
        groups: profileData.groups?.[0]?.count || 0,
        participations: profileData.participations?.[0]?.count || 0
      }
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
          region: registerData.region,
          bio: registerData.bio || null,
          is_verified: false,
          is_active: true,
          preferences: {},
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
      bio: profileData.bio,
      region: profileData.region,
      createdAt: profileData.created_at,
      lastLogin: profileData.last_login || undefined,
      isVerified: profileData.is_verified,
      isActive: profileData.is_active,
      preferences: profileData.preferences || {},
      stats: {
        products: 0,
        groups: 0,
        participations: 0
      }
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
      bio: profileData.bio,
      region: profileData.region,
      createdAt: profileData.created_at,
      lastLogin: profileData.last_login || undefined,
      isVerified: profileData.is_verified,
      isActive: profileData.is_active,
      preferences: profileData.preferences || {},
      stats: {
        products: profileData.products?.[0]?.count || 0,
        groups: profileData.groups?.[0]?.count || 0,
        participations: profileData.participations?.[0]?.count || 0
      }
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

export const updateUserProfile = async (userId: string, updates: {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  region?: string;
  preferences?: Record<string, any>;
}) => {
  try {
    // First, fetch current preferences
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('preferences')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    // Merge new preferences with existing ones
    const newPreferences = { ...(user?.preferences || {}), ...updates.preferences };

    // Update user profile with merged preferences
    const { data: profile, error } = await supabase
      .from('users')
      .update({
        ...updates,
        preferences: newPreferences,
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