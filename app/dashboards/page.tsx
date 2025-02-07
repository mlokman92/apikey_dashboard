'use client';

import { useState, useEffect } from 'react';
import { ClipboardIcon, PencilIcon, CheckIcon, XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import toast, { Toaster } from 'react-hot-toast';

interface ApiKey {
  id: string;
  key: string;
  name: string;
  created_at: string;
  usage: number;
  max_usage: number;
  monthly_limit?: number;
  has_monthly_limit: boolean;
}

interface CreateKeyForm {
  name: string;
  hasMonthlyLimit: boolean;
  monthlyLimit: number;
}

interface EditKeyForm {
  hasMonthlyLimit: boolean;
  monthlyLimit: number;
}

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingKeyData, setEditingKeyData] = useState<ApiKey | null>(null);
  const [createKeyForm, setCreateKeyForm] = useState<CreateKeyForm>({
    name: '',
    hasMonthlyLimit: false,
    monthlyLimit: 1000,
  });
  const [editKeyForm, setEditKeyForm] = useState<EditKeyForm>({
    hasMonthlyLimit: false,
    monthlyLimit: 1000,
  });

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      alert(error instanceof Error ? error.message : 'Failed to fetch API keys');
    }
  };

  const createApiKey = async () => {
    if (!createKeyForm.name.trim()) return;
    
    setLoading(true);
    try {
      const newKey = {
        name: createKeyForm.name,
        key: `key_${uuidv4()}`,
        usage: 0,
        max_usage: 1000,
        monthly_limit: createKeyForm.hasMonthlyLimit ? createKeyForm.monthlyLimit : null,
        has_monthly_limit: createKeyForm.hasMonthlyLimit,
      };

      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      await fetchApiKeys();
      setCreateKeyForm({
        name: '',
        hasMonthlyLimit: false,
        monthlyLimit: 1000,
      });
      setIsModalOpen(false);
      
      toast.success('API key created successfully', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#333',
        },
      });
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create API key', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#333',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchApiKeys();
      
      toast.success('API key deleted successfully', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#333',
        },
      });
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete API key', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#333',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(id);
      toast.success('API key copied to clipboard', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#333',
        },
      });
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy API key', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#333',
        },
      });
    }
  };

  const startEditing = (key: ApiKey) => {
    setEditingKeyData(key);
    setEditKeyForm({
      hasMonthlyLimit: !!key.monthly_limit,
      monthlyLimit: key.monthly_limit || 1000,
    });
    setIsEditModalOpen(true);
  };

  const updateKey = async () => {
    if (!editingKeyData) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({
          monthly_limit: editKeyForm.hasMonthlyLimit ? editKeyForm.monthlyLimit : null,
          has_monthly_limit: editKeyForm.hasMonthlyLimit,
        })
        .eq('id', editingKeyData.id);

      if (error) throw error;

      await fetchApiKeys();
      setIsEditModalOpen(false);
      setEditingKeyData(null);
      
      toast.success('API key updated successfully', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#333',
        },
      });
    } catch (error) {
      console.error('Error updating API key:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update API key', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#333',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <Toaster />

      {/* Current Plan Section */}
      <div className="mb-12 bg-gradient-to-r from-rose-100 via-purple-100 to-blue-200 p-8 rounded-xl">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm font-medium mb-2 bg-white/25 px-3 py-1 rounded-full inline-block">
              CURRENT PLAN
            </div>
            <h1 className="text-4xl font-bold mb-4">Researcher</h1>
            <div className="space-y-2">
              <div>
                <h3 className="text-sm font-medium mb-1">API Usage</h3>
                <div className="w-full bg-black/10 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="text-sm mt-1">0 / 1,000 Credits</div>
              </div>
            </div>
          </div>
          <button className="bg-white/90 hover:bg-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            Manage Plan
          </button>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">API Keys</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            + Create New Key
          </button>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            The key is used to authenticate your requests to the Research API.
          </div>

          <table className="w-full">
            <thead className="text-left text-sm text-gray-500">
              <tr>
                <th className="py-2">NAME</th>
                <th className="py-2">USAGE</th>
                <th className="py-2">KEY</th>
                <th className="py-2 text-right">OPTIONS</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id} className="border-t">
                  <td className="py-4 font-medium">
                    {editingKeyData && editingKeyData.id === key.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editingKeyData.name}
                          onChange={(e) => setEditingKeyData(prev => ({ ...prev, name: e.target.value }))}
                          className="px-2 py-1 border rounded w-full max-w-[200px]"
                        />
                        <button
                          onClick={updateKey}
                          disabled={!editingKeyData.name.trim() || loading}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setIsEditModalOpen(false)}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        {key.name}
                      </div>
                    )}
                  </td>
                  <td className="py-4 text-sm">{key.usage}</td>
                  <td className="py-4 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <span>{showKey === key.id ? key.key : '•'.repeat(35)}</span>
                      <button
                        onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showKey === key.id ? (
                          <EyeSlashIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEditing(key)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(key.key, key.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        {copySuccess === key.id ? (
                          <CheckIcon className="h-4 w-4" />
                        ) : (
                          <ClipboardIcon className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteApiKey(key.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {apiKeys.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-t">
              No API keys found. Create one to get started.
            </div>
          )}
        </div>
      </div>

      {/* Edit Key Modal */}
      {isEditModalOpen && editingKeyData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit API Key</h3>
            
            <div className="space-y-4">
              {/* Key Name Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Name
                </label>
                <div className="w-full px-4 py-2 bg-gray-50 rounded-lg text-gray-700">
                  {editingKeyData.name}
                </div>
              </div>

              {/* Monthly Limit Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  id="editMonthlyLimit"
                  type="checkbox"
                  checked={editKeyForm.hasMonthlyLimit}
                  onChange={(e) => setEditKeyForm(prev => ({ 
                    ...prev, 
                    hasMonthlyLimit: e.target.checked 
                  }))}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="editMonthlyLimit" className="text-sm text-gray-700">
                  Set monthly usage limit
                </label>
              </div>

              {/* Monthly Limit Input */}
              {editKeyForm.hasMonthlyLimit && (
                <div>
                  <label htmlFor="editLimitAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Limit
                  </label>
                  <input
                    id="editLimitAmount"
                    type="number"
                    min="1"
                    value={editKeyForm.monthlyLimit}
                    onChange={(e) => setEditKeyForm(prev => ({ 
                      ...prev, 
                      monthlyLimit: Math.max(1, parseInt(e.target.value) || 0) 
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Maximum number of API calls allowed per month
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingKeyData(null);
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateKey}
                disabled={loading}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Updated Create New Key Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New API Key</h3>
            
            <div className="space-y-4">
              {/* Key Name Input */}
              <div>
                <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Key Name
                </label>
                <input
                  id="keyName"
                  type="text"
                  value={createKeyForm.name}
                  onChange={(e) => setCreateKeyForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter key name"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Monthly Limit Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  id="monthlyLimit"
                  type="checkbox"
                  checked={createKeyForm.hasMonthlyLimit}
                  onChange={(e) => setCreateKeyForm(prev => ({ 
                    ...prev, 
                    hasMonthlyLimit: e.target.checked 
                  }))}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="monthlyLimit" className="text-sm text-gray-700">
                  Set monthly usage limit
                </label>
              </div>

              {/* Monthly Limit Input - Only shown if checkbox is checked */}
              {createKeyForm.hasMonthlyLimit && (
                <div>
                  <label htmlFor="limitAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Limit
                  </label>
                  <input
                    id="limitAmount"
                    type="number"
                    min="1"
                    value={createKeyForm.monthlyLimit}
                    onChange={(e) => setCreateKeyForm(prev => ({ 
                      ...prev, 
                      monthlyLimit: Math.max(1, parseInt(e.target.value) || 0) 
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Maximum number of API calls allowed per month
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setCreateKeyForm({
                    name: '',
                    hasMonthlyLimit: false,
                    monthlyLimit: 1000,
                  });
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createApiKey}
                disabled={!createKeyForm.name.trim() || loading}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 