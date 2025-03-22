import { useState } from 'react';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

function ActivityLogs() {
  const [filters, setFilters] = useState({
    userId: '',
    startDate: '',
    endDate: '',
  });

  // Static dummy data for activity logs
  const dummyLogs= [
    {
      _id: '1',
      userId: 'user123',
      action: 'login',
      details: 'User logged in successfully',
      timestamp: '2025-03-01T10:00:00Z',
    },
    {
      _id: '2',
      userId: 'user456',
      action: 'user_created',
      details: 'Created new user: test@example.com',
      timestamp: '2025-03-02T14:30:00Z',
    },
    {
      _id: '3',
      userId: 'user123',
      action: 'logout',
      details: 'User logged out',
      timestamp: '2025-03-03T09:15:00Z',
    },
    {
      _id: '4',
      userId: 'user789',
      action: 'profile_updated',
      details: 'Updated phone number',
      timestamp: '2025-03-04T16:45:00Z',
    },
    {
      _id: '5',
      userId: 'user456',
      action: 'login_failed',
      details: 'Incorrect password',
      timestamp: '2025-03-05T12:00:00Z',
    },
  ];

  // Filter logs locally based on user input
  const filteredLogs = dummyLogs.filter((log) => {
    const logDate = new Date(log.timestamp);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    return (
      (!filters.userId || log.userId.toLowerCase().includes(filters.userId.toLowerCase())) &&
      (!startDate || logDate >= startDate) &&
      (!endDate || logDate <= endDate)
    );
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Activity Logs</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filters.userId}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Filter by user ID"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <tr key={log._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {log.details || 'No details'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ActivityLogs;