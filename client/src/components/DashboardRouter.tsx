import React from 'react';
import { useAuth } from '@/context/AuthContext';
import UserProfile from '@/pages/UserProfile'; // Import UserProfile

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    // This should not happen since ProtectedRoute handles auth
    return null;
  }

  // Route to the appropriate dashboard based on user role
  switch (user.role) {
    case 'ADMIN':
    case 'CORE':
    case 'CORE_TEAM':
    case 'ASPIRANT':
      return <UserProfile />;
    default:
      return <UserProfile />;
  }
};

export default DashboardRouter;