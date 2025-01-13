import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '~hooks/useAuth';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
    </div>
  );
};

export default AdminDashboard;