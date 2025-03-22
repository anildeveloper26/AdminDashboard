import { Users as UsersIcon, UserCheck, Clock, Activity } from 'lucide-react';

function Dashboard() {


  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <UsersIcon className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Total Users</h3>
              <p className="text-2xl font-semibold"></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Active Users</h3>
              <p className="text-2xl font-semibold"></p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm">Today's Logins</h3>
              <p className="text-2xl font-semibold"></p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Activity className="w-6 h-6 text-gray-500" />
          <h2 className="text-lg font-semibold ml-2">Recent Activity</h2>
        </div>
        
        <div className="divide-y">

        </div>
      </div>
    </div>
  );
}

export default Dashboard;