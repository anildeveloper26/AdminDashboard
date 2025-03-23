import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Users, Activity, MessageSquare, Menu, X } from 'lucide-react';

function Layout() {
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false); // State to toggle mobile nav

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex overflow-hidden">
      {/* Admin Navigation Bar */}
      <nav
        className={`w-64 bg-white shadow-lg flex-shrink-0 h-screen fixed top-0 left-0 transform transition-all duration-300 ease-in-out z-20 ${
          isNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:w-64`}
      >
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-br-lg shadow-md flex justify-between items-center">
          <h2 className="text-xl font-extrabold tracking-tight flex items-center gap-2">
            <span className="bg-white text-indigo-600 p-1 rounded-full w-7 h-7 flex items-center justify-center text-sm">A</span>
            Admin Panel
          </h2>
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsNavOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <ul className="space-y-1 p-4">
          <li>
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 ${
                location.pathname === '/admin/dashboard' ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm' : ''
              }`}
              onClick={() => setIsNavOpen(false)} // Close nav on mobile click
            >
              <Home className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/users"
              className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 ${
                location.pathname === '/admin/users' ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm' : ''
              }`}
              onClick={() => setIsNavOpen(false)}
            >
              <Users className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium">Clients</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/activity"
              className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 ${
                location.pathname === '/admin/activity' ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm' : ''
              }`}
              onClick={() => setIsNavOpen(false)}
            >
              <Activity className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium">Activity Logs</span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/messages"
              className={`flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-200 ${
                location.pathname === '/admin/messages' ? 'bg-indigo-100 text-indigo-700 font-semibold shadow-sm' : ''
              }`}
              onClick={() => setIsNavOpen(false)}
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

      {/* Mobile Menu Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-indigo-600 text-white rounded-full shadow-md focus:outline-none hover:bg-indigo-700 transition-colors duration-200"
        onClick={() => setIsNavOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Main Content */}
      <main
        className={`flex-1 p-4 md:p-8 bg-gray-50 overflow-y-auto transition-all duration-300 ease-in-out ${
          isNavOpen ? 'ml-0 opacity-50' : 'ml-0 md:ml-64'
        }`}
      >
        <div className="max-w-full sm:max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Overlay for Mobile Nav */}
      {isNavOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsNavOpen(false)}
        />
      )}
    </div>
  );
}

export default Layout;