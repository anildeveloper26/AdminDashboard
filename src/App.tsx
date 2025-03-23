import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Clients';
import ActivityLogs from './pages/ActivityLogs';
import Messages from './pages/Messages'; // Import the new Messages component
import Layout from './components/Layout'; // Admin layout
import ClientLayout from './components/ClientLayout'; // Client layout
import PrivateRoute from './components/PrivateRoute';
import SignUp from './pages/SignUp';
import ClientLogin from './pages/ClientLogin';
import ClientSignup from './pages/ClientSignup';
import ClientDashboard from './pages/ClientDashboard';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Client Routes */}
          <Route path="/client/login" element={<ClientLogin />} />
          <Route path="/client/signup" element={<ClientSignup />} />

          {/* Admin Protected Routes */}
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="activity" element={<ActivityLogs />} />
            <Route path="messages" element={<Messages />} /> {/* Added Messages route */}
          </Route>

          {/* Client Protected Route */}
          <Route path="/client" element={<PrivateRoute><ClientLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="/client/dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />
          </Route>

          {/* Catch-all Route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;