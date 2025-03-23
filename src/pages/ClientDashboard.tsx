import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, Send } from 'lucide-react';
import axios from 'axios';

function ClientDashboard() {
  const navigate = useNavigate();
  const [client, setClient] = useState<{ username: string; email: string; _id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // API instance
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('userToken'); // Client token
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  useEffect(() => {
    const storedClient = localStorage.getItem('currentUser');
    if (storedClient) {
      setClient(JSON.parse(storedClient));
    } else {
      navigate('/client/login');
    }
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('currentUser');
    navigate('/client/login');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      await api.post('/messages', {
        clientId: client?._id,
        username: client?.username,
        content: message,
      });
      setSuccess('Message sent successfully!');
      setMessage(''); // Clear input
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send message');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Client Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-4 mb-6">
            <UserCircle className="w-12 h-12 text-gray-400" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Welcome, {client.username}!
              </h2>
              <p className="text-gray-600">{client.email}</p>
            </div>
          </div>

          {/* Message Box */}
          <div className="border border-gray-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Send a Message to Admin</h3>
            <form onSubmit={handleSendMessage}>
              <div className="mb-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{message.length}/500 characters</p>
              </div>
              {success && (
                <div className="mb-4 p-2 bg-green-100 text-green-700 rounded-md">{success}</div>
              )}
              {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">{error}</div>
              )}
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ClientDashboard;