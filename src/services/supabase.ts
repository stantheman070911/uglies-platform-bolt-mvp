import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'uglies-platform@1.0.0'
    }
  }
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error);
  
  const errorMessages: Record<string, string> = {
    '23505': 'This data already exists',
    '23503': 'Referenced data does not exist',
    '42501': 'Insufficient permissions',
    'PGRST116': 'No data found'
  };
  
  return errorMessages[error.code] || error.message || 'An unexpected error occurred';
};

// Create realtime subscription
export const createRealtimeSubscription = (
  table: string,
  callback: (payload: any) => void,
  filter?: string
) => {
  let channel = supabase.channel(`realtime_${table}_${Date.now()}`);
  
  if (filter) {
    channel = channel.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table,
      filter
    }, callback);
  } else {
    channel = channel.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table
    }, callback);
  }
  
  return channel.subscribe();
};

// Database health check
export const checkDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    return { healthy: true };
  } catch (error) {
    return { 
      healthy: false, 
      error: handleSupabaseError(error) 
    };
  }
};

export default supabase;