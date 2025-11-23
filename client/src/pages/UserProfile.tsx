import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, EventRegistration, Comment } from '@shared/schema';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaShieldAlt, FaCalendar, FaComment, FaHistory } from 'react-icons/fa';

const UserProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch current user, user's event registrations, and comments
  const { data: currentUser } = useQuery<User>({
    queryKey: ['/api/me'],
    staleTime: 5000,
  });

  const { data: userEventRegistrations = [] } = useQuery<EventRegistration[]>({
    queryKey: ['/api/event-registrations/user'],
    staleTime: 5000,
    enabled: !!currentUser,
  });

  const { data: userComments = [] } = useQuery<Comment[]>({
    queryKey: ['/api/comments/user'],
    staleTime: 5000,
    enabled: !!currentUser,
  });

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: (userData: any) =>
      apiRequest('/api/user/profile', { method: 'PATCH', body: JSON.stringify(userData) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      setIsEditing(false);
      setProfileData({
        email: '',
        newPassword: '',
        confirmPassword: '',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });

  // Cancel event registration mutation
  const cancelEventRegistration = useMutation({
    mutationFn: (registrationId: number) =>
      apiRequest(`/api/event-registrations/${registrationId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/event-registrations/user'] });
      toast({
        title: 'Success',
        description: 'Event registration cancelled successfully',
      });
    },
  });

  // Delete comment mutation
  const deleteComment = useMutation({
    mutationFn: (commentId: number) =>
      apiRequest(`/api/comments/${commentId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/comments/user'] });
      toast({
        title: 'Success',
        description: 'Comment deleted successfully',
      });
    },
  });

  const handleEditProfile = () => {
    if (currentUser) {
      setProfileData({
        ...profileData,
        email: currentUser.email || '',
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      email: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData({
      ...profileData,
      [field]: value,
    });
  };

  const handleUpdateProfile = () => {
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    const updateData: any = {};

    if (profileData.email && profileData.email !== currentUser?.email) {
      updateData.email = profileData.email;
    }

    if (profileData.newPassword) {
      updateData.password = profileData.newPassword;
    }

    if (Object.keys(updateData).length > 0) {
      updateProfile.mutate(updateData);
    } else {
      toast({
        title: 'Info',
        description: 'No changes to update',
      });
      setIsEditing(false);
    }
  };

  const handleCancelRegistration = (registrationId: number) => {
    if (window.confirm('Are you sure you want to cancel this event registration?')) {
      cancelEventRegistration.mutate(registrationId);
    }
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment.mutate(commentId);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)]">
        <div className="glass-panel p-8 rounded-xl text-center">
          <p className="text-[var(--text-primary)]">Please login to view your profile</p>
        </div>
      </div>
    );
  }

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'CORE':
      case 'CORE_TEAM':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] border-[hsl(var(--accent))]/50';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)] pt-24 pb-12 px-4 relative overflow-hidden">
      <div className="absolute inset-0 dither-bg opacity-30 pointer-events-none"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-2 border border-[var(--border-color)] px-3 py-1 bg-[var(--card-bg)]/50 rounded-full">
              <span className="w-2 h-2 bg-[hsl(var(--accent))] rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-[var(--text-primary)] tracking-widest uppercase">User Dashboard</span>
            </div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)] font-mono">PROFILE_SETTINGS</h1>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar / Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)] sticky top-24">
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-24 w-24 mb-4 border-2 border-[hsl(var(--accent))]/30">
                  <AvatarImage src="" alt={currentUser.username} />
                  <AvatarFallback className="bg-[var(--card-bg)] text-2xl font-mono text-[hsl(var(--accent))]">
                    {getInitials(currentUser.username)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{currentUser.username}</h2>
                <p className="text-[var(--text-secondary)] text-sm mb-3">{currentUser.email}</p>
                <Badge className={`border ${getRoleBadgeColor(currentUser.role)}`}>
                  {currentUser.role}
                </Badge>
              </div>

              <Separator className="bg-[var(--border-color)] my-6" />

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)] flex items-center"><FaHistory className="mr-2" /> Member Since</span>
                  <span className="text-[var(--text-primary)] font-mono">{new Date(currentUser.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)] flex items-center"><FaCalendar className="mr-2" /> Events</span>
                  <span className="text-[var(--text-primary)] font-mono">{userEventRegistrations.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--text-secondary)] flex items-center"><FaComment className="mr-2" /> Comments</span>
                  <span className="text-[var(--text-primary)] font-mono">{userComments.length}</span>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  onClick={isEditing ? handleCancelEdit : handleEditProfile}
                  className="w-full btn-secondary"
                >
                  {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {isEditing ? (
              <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center">
                  <FaUser className="mr-2 text-[hsl(var(--accent))]" /> Edit Profile
                </h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">Email Address</label>
                    <Input
                      id="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)]"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="newPassword" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">New Password</label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={profileData.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">Confirm Password</label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={profileData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)]"
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleUpdateProfile} className="btn-primary">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Access & Permissions */}
                <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center">
                    <FaShieldAlt className="mr-2 text-[hsl(var(--accent))]" /> Access Level
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {currentUser.role === 'ADMIN' && (
                      <div className="clean-card p-4 rounded-lg border border-purple-500/30 bg-purple-500/5">
                        <div className="font-bold text-purple-400 mb-1">Full Admin Access</div>
                        <div className="text-xs text-gray-400">Can manage all content and users</div>
                      </div>
                    )}
                    {(currentUser.role === 'ADMIN' || currentUser.role === 'CORE') && (
                      <div className="clean-card p-4 rounded-lg border border-blue-500/30 bg-blue-500/5">
                        <div className="font-bold text-blue-400 mb-1">Content Management</div>
                        <div className="text-xs text-gray-400">Can create and edit content</div>
                      </div>
                    )}
                    <div className="clean-card p-4 rounded-lg border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/5">
                      <div className="font-bold text-[hsl(var(--accent))] mb-1">Event Registration</div>
                      <div className="text-xs text-[var(--text-secondary)]">Can register for events</div>
                    </div>
                    <div className="clean-card p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
                      <div className="font-bold text-amber-400 mb-1">Comment Access</div>
                      <div className="text-xs text-gray-400">Can comment on content</div>
                    </div>
                  </div>
                </div>

                {/* Tabs for Registrations & Comments */}
                <Tabs defaultValue="registrations" className="w-full">
                  <TabsList className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] p-1 rounded-lg">
                    <TabsTrigger value="registrations" className="flex-1 data-[state=active]:bg-[hsl(var(--accent))]/20 data-[state=active]:text-[hsl(var(--accent))]">Event Registrations</TabsTrigger>
                    <TabsTrigger value="comments" className="flex-1 data-[state=active]:bg-[hsl(var(--accent))]/20 data-[state=active]:text-[hsl(var(--accent))]">Your Comments</TabsTrigger>
                  </TabsList>

                  <TabsContent value="registrations" className="space-y-4 mt-6">
                    {userEventRegistrations.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-[var(--border-color)] rounded-xl">
                        <p className="text-[var(--text-secondary)]">You haven't registered for any events yet.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {userEventRegistrations.map((registration: any) => (
                          <div key={registration.id} className="clean-card p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <h4 className="font-bold text-[var(--text-primary)] text-lg">{registration.event?.title || 'Event'}</h4>
                              <p className="text-sm text-[var(--text-secondary)] mb-1">
                                {registration.event?.date || 'Date TBA'} | {registration.event?.location || 'Location TBA'}
                              </p>
                              <p className="text-xs text-[var(--text-secondary)]/70 line-clamp-1">{registration.event?.description}</p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelRegistration(registration.id)}
                              className="bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                            >
                              Cancel
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="comments" className="space-y-4 mt-6">
                    {userComments.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-[var(--border-color)] rounded-xl">
                        <p className="text-[var(--text-secondary)]">You haven't made any comments yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userComments.map((comment: any) => (
                          <div key={comment.id} className="clean-card p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-[var(--text-primary)] text-sm">
                                {comment.project_id
                                  ? `On Project: ${comment.project?.title || 'Unknown Project'}`
                                  : comment.blog_id
                                    ? `On Blog: ${comment.blog?.title || 'Unknown Blog'}`
                                    : `On Research: ${comment.research?.title || 'Unknown Research'}`
                                }
                              </h4>
                              <span className="text-xs text-[var(--text-secondary)] font-mono">{new Date(comment.created_at).toLocaleString()}</span>
                            </div>
                            <p className="text-[var(--text-primary)]/90 text-sm mb-4 bg-[var(--bg-body)]/30 p-3 rounded border border-[var(--border-color)]">
                              "{comment.content}"
                            </p>
                            <div className="flex justify-end">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteComment(comment.id)}
                                className="bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 h-8 text-xs"
                              >
                                Delete Comment
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;