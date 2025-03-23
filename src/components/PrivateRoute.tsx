import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface PrivateRouteProps {
  children: ReactNode;
}

interface DecodedToken {
  userId?: string;
  clientId?: string;
  role: string;
  exp: number;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const location = useLocation();
  const adminToken = localStorage.getItem('token');
  const clientToken = localStorage.getItem('userToken');

  const isTokenValid = (token: string | null): DecodedToken | null => {
    if (!token) return null;
    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (Date.now() >= decoded.exp * 1000) return null; // Token expired
      return decoded;
    } catch (error) {
      return null;
    }
  };

  const adminDecoded = isTokenValid(adminToken);
  const clientDecoded = isTokenValid(clientToken);

  if (location.pathname.startsWith('/admin')) {
    if (!adminDecoded || adminDecoded.role !== 'admin') {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } else if (location.pathname.startsWith('/client') && !location.pathname.includes('/login') && !location.pathname.includes('/signup')) {
    if (!clientDecoded || clientDecoded.role !== 'client') {
      return <Navigate to="/client/login" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
}

export default PrivateRoute;