import React from 'react';
import { useAuth } from '@/context/AuthContext';
import UserProfile from '@/pages/UserProfile';

const DashboardRouter: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return <UserProfile />;
};

export default DashboardRouter;