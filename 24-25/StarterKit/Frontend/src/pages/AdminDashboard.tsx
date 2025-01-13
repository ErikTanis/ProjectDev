import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '~hooks/useAuth';
import { authService } from '~services/authService';

const AdminDashboard: React.FC = () => {
  const { isAuthenticated, token } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!token) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.checkAdmin(token);
        setIsAdmin(response.isAdmin);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [token]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-grey dark:bg-gray-800 rounded-lg shadow-md p-8">
          <p className="text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-grey dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Admin Dashboard
        </h1>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          {/* TODO: ... */}
          <div className="pl-4 border-l-4 border-blue-500">
            <p className="mb-4">
              Welcome to the admin dashboard! This page is only accessible to admin users and will be fixed soon :)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;