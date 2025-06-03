import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with TypeScript types and optimized configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
      heartbeat: 30000
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'uglies-platform@1.0.0'
    }
  },
  db: {
    schema: 'public'
  }
});

// Helper function for real-time subscriptions
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

// Error handling helper
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error);
  
  const errorMessages: Record<string, string> = {
    '23505': 'This data already exists',
    '23503': 'Referenced data does not exist',
    '42501': 'Insufficient permissions',
    'PGRST116': 'No data found',
    'auth/invalid-email': 'Invalid email address',
    'auth/wrong-password': 'Incorrect password',
    'auth/user-not-found': 'User not found',
    'auth/email-already-in-use': 'Email already in use',
    'auth/weak-password': 'Password is too weak',
    'auth/invalid-credential': 'Invalid credentials',
    'auth/operation-not-allowed': 'Operation not allowed',
    'auth/requires-recent-login': 'Please log in again to continue',
    'storage/invalid-format': 'Invalid file format',
    'storage/object-not-found': 'File not found',
    'storage/quota-exceeded': 'Storage quota exceeded',
    'realtime/connection-error': 'Real-time connection error',
    'realtime/subscription-error': 'Subscription error'
  };
  
  return errorMessages[error.code] || error.message || 'An unexpected error occurred';
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

// Connection monitoring
export const monitorConnection = (
  onConnect: () => void,
  onDisconnect: () => void,
  onError: (error: Error) => void
) => {
  const channel = supabase.channel('system');
  
  channel
    .on('system', { event: 'connected' }, () => onConnect())
    .on('system', { event: 'disconnected' }, () => onDisconnect())
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        onConnect();
      } else if (status === 'CLOSED') {
        onDisconnect();
      } else if (status === 'CHANNEL_ERROR') {
        onError(new Error('Channel error'));
      }
    });

  return () => {
    channel.unsubscribe();
  };
};

// Cache management
export const clearCache = () => {
  supabase.removeAllChannels();
  supabase.rest.reset();
};

export default supabase;
