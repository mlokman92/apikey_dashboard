'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, check if the API key exists
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, usage, max_usage, has_monthly_limit, monthly_limit')
        .eq('key', apiKey)
        .single();

      if (error || !data) {
        toast.error('Invalid API key', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#dc2626', // red-600
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          icon: '❌',
        });
        return;
      }

      // Check usage limits
      if (data.usage >= data.max_usage) {
        toast.error('API key has exceeded maximum usage limit', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#dc2626',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          icon: '⚠️',
        });
        return;
      }

      // Check monthly limit if enabled
      if (data.has_monthly_limit && data.monthly_limit && data.usage >= data.monthly_limit) {
        toast.error('API key has exceeded monthly usage limit', {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#dc2626',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          icon: '⚠️',
        });
        return;
      }

      // If all checks pass, show success and navigate
      toast.success('Valid API key, /protected can be accessed', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#16a34a', // green-600
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        icon: '✅',
      });

      // Navigate to protected route after successful validation
      setTimeout(() => {
        router.push('/protected');
      }, 1000);

    } catch (error) {
      console.error('Error validating API key:', error);
      toast.error('Error validating API key. Please try again.', {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#dc2626',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        icon: '❌',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">API Playground</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Enter your API key to test access to protected routes
              </p>
            </div>
            
            <button
              type="submit"
              disabled={loading || !apiKey.trim()}
              className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Validating...' : 'Validate API Key'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 