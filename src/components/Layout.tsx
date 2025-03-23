import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Users, Activity, MessageSquare } from 'lucide-react'; // Added MessageSquare icon

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex overflow-hidden">
      {/* Admin Navigation Bar */}
      <nav className="w-64 bg-white shadow-lg flex-shrink-0 h-screen fixed top-0 left-0 transform transition-all duration-300 ease-in-out z-10">
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-br-lg shadow-md">
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="bg-white text-indigo-600 p-1 rounded-full w-8 h-8 flex items-center justify-center">A</span>
            Admin Panel
          </h2>
        </div>
        <ul className="space-y-1 p-4">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 ${
                location.pathname === '/dashboard' ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm' : ''
              }`}
            >
              <Home className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/users"
              className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 ${
                location.pathname === '/users' ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm' : ''
              }`}
            >
              <Users className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium">Clients</span>
            </Link>
          </li>
          <li>
            <Link
              to="/activity"
              className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 ${
                location.pathname === '/activity' ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm' : ''
              }`}
            >
              <Activity className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium">Activity Logs</span>
            </Link>
          </li>
          <li>
            <Link
              to="/messages"
              className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 ${
                location.pathname === '/messages' ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm' : ''
              }`}
            >
              <MessageSquare className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium">Messages</span>
            </Link>
          </li>
        </ul>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">© 2025 xAI Admin</p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-64 bg-gray-50 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;