import { lazy, Suspense } from 'react';
import { useAuth } from "@/context/AuthContext";
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FaBars, FaSave } from 'react-icons/fa';

// Extracted Components
import { Sidebar } from './UserProfile/components/Sidebar';
import { UserOverview } from './UserProfile/components/UserOverview';
import { AdminStats } from './UserProfile/components/AdminStats';
import { UserManagement } from './UserProfile/components/UserManagement';
import { Settings } from './UserProfile/components/Settings';
import { FormField } from '@/components/ui/FormField';

// Extracted Hook
import { useUserProfileData } from './UserProfile/hooks/useUserProfileData';

// Lazy-loaded views for better code splitting
const EventsView = lazy(() => import('./UserProfile/views/EventsView'));
const RegistrationsView = lazy(() => import('./UserProfile/views/RegistrationsView'));
const ProjectsView = lazy(() => import('./UserProfile/views/ProjectsView'));
const BlogsView = lazy(() => import('./UserProfile/views/BlogsView'));
const ResearchView = lazy(() => import('./UserProfile/views/ResearchView'));

const UserProfile = () => {
  const { toast } = useToast();
  const { user: currentUser, isLoading: authLoading } = useAuth();

  // Use extracted hook for all data management
  const {
    activeView, setActiveView,
    isMobileOpen, setIsMobileOpen,
    selectedItem, setSelectedItem,
    isDialogOpen, setIsDialogOpen,
    userToDelete, setUserToDelete,
    profileData, setProfileData,
    users, eventRegistrations, events, userEventRegistrations, projects, blogs, research,
    userGrowthData, contentDistributionData,
    updateUserRole, deleteUser,
    handleSave, handleDelete
  } = useUserProfileData();

  // Helper functions
  const getInitials = (username: string) => username.substring(0, 2).toUpperCase();

  const handleInputChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleUpdateProfile = () => {
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
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
      // Call mutation here
    } else {
      toast({ title: 'Info', description: 'No changes to update' });
    }
  };

  const handleEdit = (item: any, type: string) => {
    const formItem = { ...item, contentType: type };
    if (type === 'project') {
      formItem.technologies = Array.isArray(item.technologies) ? item.technologies.join(', ') : item.technologies;
      formItem.team = Array.isArray(item.team) ? item.team.join(', ') : item.team;
    } else if (type === 'research') {
      formItem.authors = Array.isArray(item.authors) ? item.authors.join(', ') : item.authors;
    }
    setSelectedItem(formItem);
    setIsDialogOpen(true);
  };

  const handleCreate = (type: string) => {
    const newItem: any = { contentType: type };
    if (type === 'project') Object.assign(newItem, { title: '', description: '', category: '', technologies: '', team: '', image: '' });
    else if (type === 'blog') Object.assign(newItem, { title: '', excerpt: '', content: '', category: '', image: '' });
    else if (type === 'research') Object.assign(newItem, { title: '', description: '', category: '', authors: '', image: '' });
    else if (type === 'event') Object.assign(newItem, { title: '', description: '', type: '', date: '', time: '', location: '', image: '' });
    setSelectedItem(newItem);
    setIsDialogOpen(true);
  };

  const renderForm = () => {
    if (!selectedItem) return null;
    const { contentType } = selectedItem;
    const inputChange = (f: string, v: any) => setSelectedItem((p: any) => ({ ...p, [f]: v }));

    return (
      <div className="space-y-4 pt-4">
        {contentType === 'project' && <>
          <FormField label="Title" id="title" value={selectedItem.title} onChange={(e: any) => inputChange('title', e.target.value)} />
          <FormField label="Category" id="category" value={selectedItem.category} onChange={(e: any) => inputChange('category', e.target.value)} />
          <FormField label="Description" id="description" value={selectedItem.description} onChange={(e: any) => inputChange('description', e.target.value)} isTextArea />
          <FormField label="Technologies" id="technologies" value={selectedItem.technologies} onChange={(e: any) => inputChange('technologies', e.target.value)} />
          <FormField label="Team" id="team" value={selectedItem.team} onChange={(e: any) => inputChange('team', e.target.value)} />
          <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(e: any) => inputChange('image', e.target.value)} />
        </>}
        {contentType === 'blog' && <>
          <FormField label="Title" id="title" value={selectedItem.title} onChange={(e: any) => inputChange('title', e.target.value)} />
          <FormField label="Excerpt" id="excerpt" value={selectedItem.excerpt} onChange={(e: any) => inputChange('excerpt', e.target.value)} />
          <FormField label="Content" id="content" value={selectedItem.content} onChange={(e: any) => inputChange('content', e.target.value)} isTextArea rows={8} />
          <FormField label="Category" id="category" value={selectedItem.category} onChange={(e: any) => inputChange('category', e.target.value)} />
          <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(e: any) => inputChange('image', e.target.value)} />
        </>}
        {contentType === 'research' && <>
          <FormField label="Title" id="title" value={selectedItem.title} onChange={(e: any) => inputChange('title', e.target.value)} />
          <FormField label="Category" id="category" value={selectedItem.category} onChange={(e: any) => inputChange('category', e.target.value)} />
          <FormField label="Description" id="description" value={selectedItem.description} onChange={(e: any) => inputChange('description', e.target.value)} isTextArea />
          <FormField label="Authors" id="authors" value={selectedItem.authors} onChange={(e: any) => inputChange('authors', e.target.value)} />

          <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(e: any) => inputChange('image', e.target.value)} />
        </>}
        {contentType === 'event' && <>
          <FormField label="Title" id="title" value={selectedItem.title} onChange={(e: any) => inputChange('title', e.target.value)} />
          <FormField label="Type" id="type" value={selectedItem.type} onChange={(e: any) => inputChange('type', e.target.value)} />
          <FormField label="Description" id="description" value={selectedItem.description} onChange={(e: any) => inputChange('description', e.target.value)} isTextArea />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date" id="date" type="date" value={selectedItem.date} onChange={(e: any) => inputChange('date', e.target.value)} />
            <FormField label="Time" id="time" value={selectedItem.time} onChange={(e: any) => inputChange('time', e.target.value)} />
          </div>
          <FormField label="Location" id="location" value={selectedItem.location} onChange={(e: any) => inputChange('location', e.target.value)} />
          <FormField label="Image URL" id="image" value={selectedItem.image} onChange={(e: any) => inputChange('image', e.target.value)} />
        </>}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
          <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} className="bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90">
            <FaSave className="mr-2" /> Save Changes
          </Button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        if (currentUser?.role === 'ADMIN') {
          return <AdminStats
            users={users}
            projects={projects}
            research={research}
            eventRegistrations={eventRegistrations}
            events={events}
            blogs={blogs}
            userGrowthData={userGrowthData}
            contentDistributionData={contentDistributionData}
          />;
        }
        return <UserOverview
          currentUser={currentUser!}
          userEventRegistrations={userEventRegistrations}
          setActiveView={setActiveView}
          getInitials={getInitials}
        />;

      case 'users':
        if (currentUser?.role !== 'ADMIN') return null;
        return <UserManagement
          users={users}
          updateUserRole={updateUserRole}
          deleteUser={deleteUser}
          userToDelete={userToDelete}
          setUserToDelete={setUserToDelete}
        />;

      case 'settings':
        return <Settings
          profileData={profileData}
          currentUser={currentUser}
          handleInputChange={handleInputChange}
          handleUpdateProfile={handleUpdateProfile}
        />;

      case 'events':
        return <Suspense fallback={<div className="text-center py-12 text-[var(--text-secondary)]">Loading...</div>}>
          <EventsView />
        </Suspense>;

      case 'registrations':
        return <Suspense fallback={<div className="text-center py-12 text-[var(--text-secondary)]">Loading...</div>}>
          <RegistrationsView />
        </Suspense>;

      case 'projects':
        return <Suspense fallback={<div className="text-center py-12 text-[var(--text-secondary)]">Loading...</div>}>
          <ProjectsView handleEdit={handleEdit} handleCreate={handleCreate} handleDelete={handleDelete} />
        </Suspense>;

      case 'blogs':
        return <Suspense fallback={<div className="text-center py-12 text-[var(--text-secondary)]">Loading...</div>}>
          <BlogsView handleEdit={handleEdit} handleCreate={handleCreate} handleDelete={handleDelete} />
        </Suspense>;

      case 'research':
        return <Suspense fallback={<div className="text-center py-12 text-[var(--text-secondary)]">Loading...</div>}>
          <ResearchView handleEdit={handleEdit} handleCreate={handleCreate} handleDelete={handleDelete} />
        </Suspense>;

      default:
        return null;
    }
  };

  if (authLoading) {
    return <div className="flex h-screen items-center justify-center text-[var(--text-primary)]">Loading profile...</div>;
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-body)]">
        <div className="glass-panel p-8 rounded-xl text-center">
          <p className="text-[var(--text-primary)]">Please login to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[var(--bg-body)] text-[var(--text-primary)] font-sans selection:bg-[hsl(var(--accent))]/30 overflow-hidden pt-24">
      <Sidebar activeView={activeView} setActiveView={setActiveView} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--card-bg)]/50 backdrop-blur-md">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
            <FaBars />
          </Button>
          <span className="font-bold text-lg">User Profile</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {renderContent()}
        </main>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)]">
            <DialogHeader>
              <DialogTitle>{selectedItem?.id ? 'Edit' : 'Create'} {selectedItem?.contentType?.charAt(0).toUpperCase() + selectedItem?.contentType?.slice(1)}</DialogTitle>
              <DialogDescription>
                Make changes to the item here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            {renderForm()}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserProfile;
