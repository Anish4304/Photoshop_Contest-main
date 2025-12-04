import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: 'photographer' | 'judge' | 'admin';
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
