import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, LogOut, Menu, X } from 'lucide-react';

function Layout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile toggle

  const handleLogout = () => {
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-dvh bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <button className="lg:hidden text-gray-600" onClick={toggleSidebar}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="mt-6">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 transition-colors duration-200 ${
                isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 transition-colors duration-200 ${
                isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''
              }`
            }
          >
            <Users className="w-5 h-5 mr-3" />
            Users
          </NavLink>
          <NavLink
            to="/activity"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 transition-colors duration-200 ${
                isActive ? 'bg-indigo-100 text-indigo-700 font-semibold' : ''
              }`
            }
          >
            <Activity className="w-5 h-5 mr-3" />
            Activity Logs
          </NavLink>
        </nav>
        <div className="absolute bottom-0 w-full p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-gray-700 hover:text-red-600 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col ">
        {/* Header with Toggle Button */}
        <header className="flex items-center justify-between p-4 bg-white shadow-md lg:hidden">
          <h2 className="text-xl font-semibold text-gray-800">Admin</h2>
          <button onClick={toggleSidebar} className="text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Scrollable Outlet */}
        <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;