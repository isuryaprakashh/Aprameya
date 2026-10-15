import React from 'react';
import { useAuth } from '@/context/AuthContext';
import UserProfile from '@/pages/UserProfile';
import AprameyaLoadingScreen from '@/components/AprameyaLoadingScreen';

const DashboardRouter: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <AprameyaLoadingScreen minDuration={800} message="LOADING LABORATORY DASHBOARD..." />;
  }

  return <UserProfile />;
};

export default DashboardRouter;