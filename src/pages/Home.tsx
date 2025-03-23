import { Link } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-12 md:py-20 flex-grow flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            Welcome to Sandee Portal
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-indigo-100 mb-8">
            Seamless access for Admins and Clients
          </p>
        </div>
      </header>

      {/* Auth Options Section */}
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Admin Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Admin Access</h2>
              <p className="text-gray-600 text-center mb-6">
                Manage the platform with full control. Log in or sign up as an admin below.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 w-full sm:w-auto"
                >
                  <LogIn className="w-5 h-5" />
                  Admin Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 w-full sm:w-auto"
                >
                  <UserPlus className="w-5 h-5" />
                  Admin Signup
                </Link>
              </div>
            </div>

            {/* Client Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Client Access</h2>
              <p className="text-gray-600 text-center mb-6">
                Access your dashboard and communicate with admins. Log in or sign up as a client.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  to="/client/login"
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 w-full sm:w-auto"
                >
                  <LogIn className="w-5 h-5" />
                  Client Login
                </Link>
                <Link
                  to="/client/signup"
                  className="flex items-center justify-center gap-2 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 w-full sm:w-auto"
                >
                  <UserPlus className="w-5 h-5" />
                  Client Signup
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">© 2025 xAI Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;