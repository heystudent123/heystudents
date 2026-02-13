import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isLoaded, isSignedIn } = useClerkAuth();
  const { user, loading } = useAuth();

  // Show loading state while Clerk or backend user is loading
  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is not signed in via Clerk, redirect to login page
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and user doesn't have it, redirect to home
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has required role (if specified)
  return <>{children}</>;
};

export default ProtectedRoute;
