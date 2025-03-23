import { useState, useEffect } from 'react';
import axios from 'axios';

interface Message {
  _id: string;
  clientId: string;
  username: string;
  content: string;
  createdAt: string;
}

function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Admin token
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/messages');
        setMessages(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-600">Loading messages...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Client Messages</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>
      )}
      <div className="bg-white rounded-lg shadow-md p-6">
        {messages.length > 0 ? (
          <ul className="space-y-4">
            {messages.map((msg) => (
              <li key={msg._id} className="border-b border-gray-200 pb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-indigo-600">{msg.username}</span> (
                  {msg.clientId})
                </p>
                <p className="text-gray-800">{msg.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No messages received yet.</p>
        )}
      </div>
    </div>
  );
}

export default Messages;