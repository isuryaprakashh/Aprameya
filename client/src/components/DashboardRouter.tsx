import React from 'react';
import { useAuth } from '@/context/AuthContext';
import UserProfile from '@/pages/UserProfile'; // Import UserProfile

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  // Debug logging
  console.log('DashboardRouter rendering, user:', user);

  if (!user) {
    // This should not happen since ProtectedRoute handles auth
    console.warn('DashboardRouter: No user found');
    return null;
  }

  // Route to the appropriate dashboard based on user role
  console.log('DashboardRouter: Routing to dashboard for role:', user.role);

  switch (user.role) {
    case 'ADMIN':
    case 'CORE':
    case 'CORE_TEAM':
    case 'ASPIRANT':
      return <UserProfile />;
    default:
      console.warn(`Unknown user role: ${user.role}, defaulting to UserProfile`);
      return <UserProfile />;
  }
};

export default DashboardRouter;