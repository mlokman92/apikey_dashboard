'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiResponse(null);

    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();
      setApiResponse(data);

      if (!response.ok) {
        toast.error(data.message, {
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
        return;
      }

      toast.success(
        `${data.message}${data.data ? ` - ${data.data.remaining_calls} calls remaining` : ''}`, 
        {
          duration: 3000,
          position: 'top-center',
          style: {
            background: '#16a34a',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
          },
          icon: '✅',
        }
      );

      if (data.data) {
        setTimeout(() => {
          router.push('/protected');
        }, 1000);
      }

    } catch (error) {
      setApiResponse({ message: "Invalid API key" });
      toast.error('Invalid API key', {
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
            </div>
            
            <button
              type="submit"
              disabled={loading || !apiKey.trim()}
              className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Validating...' : 'Validate API Key'}
            </button>
          </form>

          {/* API Response Display */}
          {apiResponse && (
            <div className="mt-6 p-4 rounded-lg bg-gray-50 font-mono text-sm">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 