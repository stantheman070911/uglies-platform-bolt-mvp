import React from 'react';
import { ConsumerDashboard } from '@/components/profile/ConsumerDashboard';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const ConsumerDashboardPage: React.FC = () => {
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

  // Redirect farmers to their specific dashboard
  if (user.role === 'farmer') {
    return <Navigate to="/farmer-dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ConsumerDashboard />
      </div>
    </div>
  );
};

export default ConsumerDashboardPage;
