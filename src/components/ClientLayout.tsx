// src/components/ClientLayout.tsx
import { Outlet } from 'react-router-dom';

function ClientLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Optional: Add client-specific header or nav here if needed */}
      <Outlet /> {/* Renders the nested route components (e.g., ClientDashboard) */}
    </div>
  );
}

export default ClientLayout;