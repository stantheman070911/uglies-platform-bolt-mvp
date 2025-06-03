import { supabase } from './supabase';
import type { LoginCredentials, RegisterData, User, UserRole } from '@/types/auth';
import { ApiResponse } from '@/types/api';

export async function signIn(
  credentials: LoginCredentials
): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return {
        data: null,
        error: error.message,
        status: 400,
      };
    }

    // Fetch user profile data
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      return {
        data: null,
        error: profileError.message,
        status: 400,
      };
    }

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
      error: error.message,
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

    if (authError) {
      return {
        data: null,
        error: authError.message,
        status: 400,
      };
    }

    if (!authData.user) {
      return {
        data: null,
        error: 'User creation failed',
        status: 400,
      };
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

    if (profileError) {
      return {
        data: null,
        error: profileError.message,
        status: 400,
      };
    }

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
      error: error.message,
      status: 500,
    };
  }
}

export async function signOut(): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        data: null,
        error: error.message,
        status: 400,
      };
    }

    return {
      data: null,
      error: null,
      status: 200,
    };
  } catch (err) {
    const error = err as Error;
    return {
      data: null,
      error: error.message,
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
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      return {
        data: null,
        error: profileError.message,
        status: 400,
      };
    }

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
      error: error.message,
      status: 500,
    };
  }
}