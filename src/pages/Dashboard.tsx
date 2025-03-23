import { useState, useEffect } from 'react';
import { Users as ClientsIcon, UserCheck, Clock, Activity } from 'lucide-react';
import axios from 'axios';
import CountUp from 'react-countup';

interface ActivityLog {
  _id: string;
  clientId: string; // Changed from userId to clientId
  username: string;
  action: string;
  timestamp: string;
}

function Dashboard() {
  const [totalClients, setTotalClients] = useState<number | null>(null); // Changed from totalUsers
  const [activeClients, setActiveClients] = useState<number | null>(null); // Changed from activeUsers
  const [todayLogins, setTodayLogins] = useState<number | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API instance
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Admin token for admin panel
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // Fetch dashboard data for clients
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [totalRes, activeRes, loginsRes, activitiesRes] = await Promise.all([
          api.get('/clients/count'), // Updated to /clients
          api.get('/clients/active'), // Updated to /clients
          api.get('/clients/today-logins'), // Updated to /clients
          api.get('/clients/recent-activities'), // Updated to /clients
        ]);

        setTotalClients(totalRes.data.count);
        setActiveClients(activeRes.data.count);
        setTodayLogins(loginsRes.data.count);
        setRecentActivities(activitiesRes.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch client dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-gray-500 text-lg animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
        Client Dashboard
      </h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl shadow-md border border-red-200 animate-fade-in">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-t-4 border-blue-500">
          <div className="flex items-center">
            <ClientsIcon className="w-10 h-10 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">Total Clients</h3>
              <p className="text-3xl font-bold text-gray-800">
                {totalClients !== null ? (
                  <CountUp end={totalClients} duration={5} />
                ) : (
                  'N/A'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-t-4 border-green-500">
          <div className="flex items-center">
            <UserCheck className="w-10 h-10 text-green-500" />
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">Active Clients</h3>
              <p className="text-3xl font-bold text-gray-800">
                {activeClients !== null ? (
                  <CountUp end={activeClients} duration={5} />
                ) : (
                  'N/A'
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-t-4 border-purple-500">
          <div className="flex items-center">
            <Clock className="w-10 h-10 text-purple-500" />
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">Today's Logins</h3>
              <p className="text-3xl font-bold text-gray-800">
                {todayLogins ?? 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-gray-200">
        <div className="flex items-center mb-4">
          <Activity className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold ml-2 text-gray-800">Recent Client Activity</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {recentActivities.length > 0 ? (
            recentActivities.slice(0, 5).map((activity, index) => (
              <div
                key={activity._id}
                className="py-3 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-indigo-600">{activity.username}</span>{' '}
                  ({activity.clientId}) {activity.action}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 py-3">No recent client activities</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;