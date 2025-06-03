import React, { useEffect, useState } from 'react';
import { supabase } from '@/services/supabase';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const SupabaseTest: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Testing Supabase connection...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test basic query to verify connection
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .limit(1)
          .single();

        if (error) throw error;

        setStatus('success');
        setMessage('Successfully connected to Supabase!');
      } catch (error) {
        console.error('Supabase connection error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Failed to connect to Supabase');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md" 
      style={{ 
        backgroundColor: status === 'error' ? '#FEE2E2' : 
                        status === 'success' ? '#DCFCE7' : 
                        '#F3F4F6'
      }}
    >
      <div className="flex items-center space-x-3">
        {status === 'loading' && (
          <div className="animate-spin h-5 w-5 border-2 border-green-500 border-t-transparent rounded-full" />
        )}
        {status === 'success' && (
          <CheckCircle2 className="text-green-600\" size={20} />
        )}
        {status === 'error' && (
          <AlertCircle className="text-red-600" size={20} />
        )}
        <span className={
          status === 'error' ? 'text-red-700' : 
          status === 'success' ? 'text-green-700' : 
          'text-gray-700'
        }>
          {message}
        </span>
      </div>
    </div>
  );
};

export default SupabaseTest;