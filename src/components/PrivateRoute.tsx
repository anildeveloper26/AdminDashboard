// src/components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const adminToken = localStorage.getItem('token');
  const clientToken = localStorage.getItem('userToken');
  const currentPath = window.location.pathname;

  console.log('PrivateRoute:', { adminToken, clientToken, currentPath });

  if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/users') || currentPath.startsWith('/activity')) {
    return adminToken ? <>{children}</> : <Navigate to="/login" replace />;
  }

  if (currentPath.startsWith('/client/dashboard')) {
    return clientToken ? <>{children}</> : <Navigate to="/client/login" replace />;
  }

  return <>{children}</>;
}

export default PrivateRoute;