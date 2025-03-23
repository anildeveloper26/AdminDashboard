import { useState, useEffect } from 'react';
import { UserPlus, Edit2, Power } from 'lucide-react';
import axios from 'axios';
import type { User } from '../types'; // Assuming User type matches Client model

// Update type to reflect Client model (no role field for editing)
interface Client {
  _id: string;
  username: string;
  email: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

function Clients() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null); // Changed from User to Client
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '', // Only for new clients
  });
  const [clientsList, setClientsList] = useState<Client[]>([]); // Changed from usersList
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // API instance
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Admin token
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Fetch clients
  const fetchClients = async () => {
    setFetchLoading(true);
    setError(null);
    try {
      const response = await api.get('/clients'); // Updated to /clients
      setClientsList(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch clients');
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleToggleStatus = async (clientId: string) => { // Changed from userId
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.patch(`/clients/${clientId}/toggle-status`); // Updated to /clients
      await fetchClients(); // Refetch to update UI
      setSuccess('Client status updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to toggle status');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (selectedClient) {
      // Update existing client
      try {
        const response = await api.put(`/clients/${selectedClient._id}`, { // Updated to /clients
          username: formData.username,
          email: formData.email,
        });
        await fetchClients(); // Refetch to update the list
        setSuccess('Client updated successfully');
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to update client');
      }
    } else {
      // Create new client
      try {
        const response = await api.post('/clients', { // Updated to /clients
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        await fetchClients(); // Refetch to include the new client
        setSuccess('Client added successfully');
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to add client');
      }
    }

    setLoading(false);
    setIsModalOpen(false);
    setFormData({ username: '', email: '', password: '' }); // Removed role
    setSelectedClient(null);
  };

  const handleEdit = (client: Client) => { // Changed from User to Client
    setSelectedClient(client);
    setFormData({
      username: client.username,
      email: client.email,
      password: '', // Don’t prefill password for edits
    });
    setIsModalOpen(true);
  };

  if (fetchLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="text-gray-500">Loading clients...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clients</h1>
        <button
          onClick={() => {
            setSelectedClient(null);
            setFormData({ username: '', email: '', password: '' }); // Removed role
            setIsModalOpen(true);
          }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          disabled={loading || fetchLoading}
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add Client
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>
      )}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientsList.length > 0 ? (
              clientsList.map((client) => (
                <tr key={client._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{client.username}</div>
                    <div className="text-sm text-gray-500">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        client.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {client.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.lastLogin ? new Date(client.lastLogin).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(client)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      disabled={loading}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(client._id)}
                      className={`${
                        client.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                      }`}
                      disabled={loading}
                    >
                      <Power className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No clients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Create/Edit Client */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedClient ? 'Edit Client' : 'Add New Client'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                  required
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                  required
                  disabled={loading}
                />
              </div>
              {!selectedClient && (
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                    required
                    disabled={loading}
                  />
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : selectedClient ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;