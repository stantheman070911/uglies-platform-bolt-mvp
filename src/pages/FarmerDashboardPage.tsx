import React from 'react';
import { FarmerDashboard } from '@/components/profile/FarmerDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const FarmerDashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Only allow farmers to access this dashboard
  if (user.role !== 'farmer') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <FarmerDashboard />
      </div>
    </div>
  );
};

export default FarmerDashboardPage;
