import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasRole } from '../utils/permissions';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Verifying security token...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !hasRole(user, allowedRoles)) {
    return (
      <div className="p-8 text-center max-w-md mx-auto my-12 bg-slate-900 rounded-2xl border border-rose-500/30">
        <h3 className="text-lg font-bold text-rose-400 mb-2">Access Denied</h3>
        <p className="text-xs text-slate-300">
          Your role <span className="font-mono text-amber-400">[{user?.role}]</span> does not have authorization to view this page.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
