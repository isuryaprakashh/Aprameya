import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from "@/context/AuthContext";
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FaBars, FaSave, FaArrowLeft, FaUpload, FaHome, FaUser, FaShieldAlt } from 'react-icons/fa';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
const ProjectsView = lazy(() => import('./UserProfile/views/ProjectsView'));
const BlogsView = lazy(() => import('./UserProfile/views/BlogsView'));
const RecruitmentView = lazy(() => import('./UserProfile/views/RecruitmentView'));
const TeamsView = lazy(() => import('./UserProfile/views/TeamsView'));
import AdminScanQR from './AdminScanQR';
import AprameyaLoadingScreen from '@/components/AprameyaLoadingScreen';
import AprameyaLoader from '@/components/AprameyaLoader';

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
    users, eventRegistrations, events, userEventRegistrations, tickets, projects, blogs, research,
    userGrowthData, contentDistributionData,
    isSaving,
    updateUserRole, deleteUser, updateUser,
    updateProfile,
    handleSave, handleDelete
  } = useUserProfileData();

  const [panelMode, setPanelMode] = useState<'admin' | 'user'>('admin');
  const mainScrollRef = useRef<HTMLElement>(null);

  // Automatically scroll user dashboard container and window to top on view/mode change
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [activeView, panelMode, selectedItem, isDialogOpen]);

  // Helper functions
  const getInitials = (username: string) => username.substring(0, 2).toUpperCase();

  const getAccentColor = (role?: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN': return 'red';
      case 'CORE':
      case 'CORE_TEAM': return 'blue';
      default: return 'emerald';
    }
  };

  const accentColor = getAccentColor(currentUser?.role);

  useEffect(() => {
    if (accentColor) {
      document.documentElement.setAttribute('data-accent', accentColor);
    }
    return () => {
      document.documentElement.setAttribute('data-accent', 'emerald');
    };
  }, [accentColor]);

  const handleInputChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleUpdateProfile = () => {
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    const updateData: any = {};
    if (profileData.username !== undefined && profileData.username.trim() && profileData.username.trim() !== currentUser?.username) {
      updateData.username = profileData.username.trim();
    }
    if (profileData.display_name !== undefined && profileData.display_name !== (currentUser?.display_name || '')) {
      updateData.display_name = profileData.display_name.trim();
    }
    if (profileData.profile_image !== undefined && profileData.profile_image !== (currentUser?.profile_image || '')) {
      updateData.profile_image = profileData.profile_image;
    }
    if (profileData.bio !== undefined && profileData.bio !== (currentUser?.bio || '')) {
      updateData.bio = profileData.bio;
    }
    if (profileData.department !== undefined && profileData.department !== (currentUser?.department || '')) {
      updateData.department = profileData.department;
    }
    if (profileData.year !== undefined && profileData.year !== (currentUser?.year || '')) {
      updateData.year = profileData.year;
    }
    if (profileData.email && profileData.email !== currentUser?.email) {
      updateData.email = profileData.email.trim();
    }
    if (profileData.newPassword) {
      updateData.password = profileData.newPassword;
    }
    if (Object.keys(updateData).length > 0) {
      updateProfile.mutate(updateData);
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
    else if (type === 'event') Object.assign(newItem, { title: '', description: '', type: '', date: '', time: '', location: '', image: '', ticketEnabled: false, capacity: '' });
    else if (type === 'team') Object.assign(newItem, { name: '', role: '', category: 'Core Team', department: '', year: '', image: '', bio: '', email: '', linkedin: '', github: '', order: 0 });
    setSelectedItem(newItem);
    setIsDialogOpen(true);
  };

  const ImageUploadField = ({ label, id, value, onChange }: { label: string; id: string; value: string; onChange: (url: string) => void }) => {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid File', description: 'Please choose an image file (PNG, JPG, WEBP).', variant: 'destructive' });
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        const raw = ev.target?.result as string;
        if (!raw) return;
        const img = new Image();
        img.src = raw;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          onChange(compressed);
          toast({ title: 'Image Uploaded', description: 'Photo loaded and ready to save.' });
        };
      };
      reader.readAsDataURL(file);
    };

    return (
      <div className="space-y-1.5">
        <Label className="text-xs font-mono text-[var(--text-secondary)]">{label}</Label>
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          {value ? (
            <div className="relative w-24 h-20 rounded-xl overflow-hidden border border-[var(--border-color)] bg-black/40 shrink-0 group">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 text-xs font-semibold"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="w-24 h-20 rounded-xl border border-dashed border-[var(--border-color)] flex items-center justify-center text-[10px] font-mono text-[var(--text-secondary)]/50 shrink-0 text-center px-1">
              No Image
            </div>
          )}
          <div className="flex-1 space-y-2 w-full">
            <input type="file" ref={fileRef} onChange={handleFile} accept="image/*" className="hidden" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
              className="text-xs h-8 border-[var(--border-color)] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]"
            >
              <FaUpload className="mr-1.5 h-3 w-3" /> Upload from Computer
            </Button>
            <Input
              id={id}
              placeholder="Or paste image URL (https://...)"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="bg-[var(--bg-body)] border-[var(--border-color)] text-xs rounded-xl"
            />
          </div>
        </div>
      </div>
    );
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
          <FormField label="Technologies (comma separated)" id="technologies" value={selectedItem.technologies} onChange={(e: any) => inputChange('technologies', e.target.value)} />
          <FormField label="Team Members (comma separated)" id="team" value={selectedItem.team} onChange={(e: any) => inputChange('team', e.target.value)} />
          <ImageUploadField label="Project Banner / Image" id="image" value={selectedItem.image || ''} onChange={(url) => inputChange('image', url)} />
        </>}
        {contentType === 'blog' && <>
          <FormField label="Title" id="title" value={selectedItem.title} onChange={(e: any) => inputChange('title', e.target.value)} />
          <FormField label="Excerpt" id="excerpt" value={selectedItem.excerpt} onChange={(e: any) => inputChange('excerpt', e.target.value)} />
          <FormField label="Content" id="content" value={selectedItem.content} onChange={(e: any) => inputChange('content', e.target.value)} isTextArea rows={8} />
          <FormField label="Category" id="category" value={selectedItem.category} onChange={(e: any) => inputChange('category', e.target.value)} />
          <ImageUploadField label="Blog Featured Image" id="image" value={selectedItem.image || ''} onChange={(url) => inputChange('image', url)} />
        </>}
        {contentType === 'research' && <>
          <FormField label="Title" id="title" value={selectedItem.title} onChange={(e: any) => inputChange('title', e.target.value)} />
          <FormField label="Category" id="category" value={selectedItem.category} onChange={(e: any) => inputChange('category', e.target.value)} />
          <FormField label="Description" id="description" value={selectedItem.description} onChange={(e: any) => inputChange('description', e.target.value)} isTextArea />
          <FormField label="Authors (comma separated)" id="authors" value={selectedItem.authors} onChange={(e: any) => inputChange('authors', e.target.value)} />
          <ImageUploadField label="Research Publication Image" id="image" value={selectedItem.image || ''} onChange={(url) => inputChange('image', url)} />
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
          <div className="grid grid-cols-2 gap-4 items-end">
            <FormField label="Capacity" id="capacity" type="number" value={selectedItem.capacity || ''} onChange={(e: any) => inputChange('capacity', e.target.value)} />
          </div>
          <ImageUploadField label="Event Banner Image" id="image" value={selectedItem.image || ''} onChange={(url) => inputChange('image', url)} />
          <div className="flex flex-row items-center justify-between rounded-lg border border-[var(--border-color)] p-4 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="ticketEnabled" className="text-base text-[var(--text-primary)]">Enable Ticket System</Label>
              <div className="text-[0.8rem] text-[var(--text-secondary)]">Generate QR codes for attendees</div>
            </div>
            <Switch
              id="ticketEnabled"
              checked={!!selectedItem.ticketEnabled}
              onCheckedChange={(checked: boolean) => inputChange('ticketEnabled', checked)}
            />
          </div>
        </>}
        {contentType === 'team' && <>
          <FormField label="Full Name" id="name" value={selectedItem.name || ''} onChange={(e: any) => inputChange('name', e.target.value)} />
          <FormField label="Role / Designation" id="role" value={selectedItem.role || ''} onChange={(e: any) => inputChange('role', e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category" id="category" value={selectedItem.category || ''} onChange={(e: any) => inputChange('category', e.target.value)} />
            <FormField label="Department" id="department" value={selectedItem.department || ''} onChange={(e: any) => inputChange('department', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Year / Batch" id="year" value={selectedItem.year || ''} onChange={(e: any) => inputChange('year', e.target.value)} />
            <FormField label="Display Order" id="order" type="number" value={selectedItem.order ?? 0} onChange={(e: any) => inputChange('order', e.target.value)} />
          </div>
          <ImageUploadField label="Team Member Photo" id="image" value={selectedItem.image || ''} onChange={(url) => inputChange('image', url)} />
          <FormField label="Bio / Summary" id="bio" value={selectedItem.bio || ''} onChange={(e: any) => inputChange('bio', e.target.value)} isTextArea />
          <div className="grid grid-cols-3 gap-3">
            <FormField label="Email" id="email" value={selectedItem.email || ''} onChange={(e: any) => inputChange('email', e.target.value)} />
            <FormField label="LinkedIn URL" id="linkedin" value={selectedItem.linkedin || ''} onChange={(e: any) => inputChange('linkedin', e.target.value)} />
            <FormField label="GitHub URL" id="github" value={selectedItem.github || ''} onChange={(e: any) => inputChange('github', e.target.value)} />
          </div>
        </>}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
          <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90 disabled:opacity-50">
            <FaSave className="mr-2" /> {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        if (currentUser?.role === 'ADMIN' && panelMode !== 'user') {
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
          tickets={tickets}
          setActiveView={setActiveView}
          getInitials={getInitials}
        />;

      case 'users':
        if (currentUser?.role !== 'ADMIN') return null;
        return <UserManagement
          users={users}
          updateUserRole={updateUserRole}
          updateUser={updateUser}
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
        return <Suspense fallback={<AprameyaLoader size={36} showText={true} />}>
          <EventsView handleEdit={handleEdit} handleCreate={handleCreate} handleDelete={handleDelete} />
        </Suspense>;

      case 'projects':
        return <Suspense fallback={<AprameyaLoader size={36} showText={true} />}>
          <ProjectsView handleEdit={handleEdit} handleCreate={handleCreate} handleDelete={handleDelete} />
        </Suspense>;

      case 'blogs':
        return <Suspense fallback={<AprameyaLoader size={36} showText={true} />}>
          <BlogsView handleEdit={handleEdit} handleCreate={handleCreate} handleDelete={handleDelete} />
        </Suspense>;

      case 'scan':
        return <AdminScanQR isEmbedded={true} />;

      case 'recruitment':
        return <Suspense fallback={<AprameyaLoader size={36} showText={true} />}>
          <RecruitmentView />
        </Suspense>;

      case 'teams':
        return <Suspense fallback={<AprameyaLoader size={36} showText={true} />}>
          <TeamsView />
        </Suspense>;

      default:
        return null;
    }
  };

  if (authLoading) {
    return <AprameyaLoadingScreen minDuration={1000} message="AUTHENTICATING OPERATIVE PROFILE..." />;
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

  const [, navigate] = useLocation();

  return (
    <div
      className="flex h-screen bg-[var(--bg-body)] text-[var(--text-primary)] font-sans selection:bg-[hsl(var(--accent))]/30 overflow-hidden"
      data-accent={accentColor}
    >
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        panelMode={panelMode}
        setPanelMode={setPanelMode}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Header with View User Panel and View Home Page */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 border-b border-[var(--border-color)] bg-[var(--card-bg)]/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/30 text-[hsl(var(--accent))] font-bold uppercase tracking-wider">
              {currentUser.role === 'ADMIN' ? (panelMode === 'user' ? 'USER PANEL (STUDENT VIEW)' : 'ADMIN PANEL') : 'USER DASHBOARD'}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              Signed in as <strong className="text-[var(--text-primary)]">{currentUser.username}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {currentUser.role === 'ADMIN' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPanelMode(panelMode === 'user' ? 'admin' : 'user');
                  setActiveView('overview');
                }}
                className="h-8 text-xs rounded-xl border-[hsl(var(--accent))]/40 bg-[hsl(var(--accent))]/10 hover:bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] font-medium gap-1.5"
              >
                {panelMode === 'user' ? (
                  <>
                    <FaShieldAlt className="w-3 h-3" /> Back to Admin Panel
                  </>
                ) : (
                  <>
                    <FaUser className="w-3 h-3" /> View User Panel
                  </>
                )}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="h-8 text-xs rounded-xl border-[var(--border-color)] hover:border-[hsl(var(--accent))]/50 hover:text-[hsl(var(--accent))] gap-1.5"
            >
              <FaHome className="w-3.5 h-3.5 text-[hsl(var(--accent))]" /> View Home Page
            </Button>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-3 border-b border-[var(--border-color)] bg-[var(--card-bg)]/80 backdrop-blur-md gap-2">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs gap-1" onClick={() => navigate('/')}>
            <FaHome className="w-3.5 h-3.5 text-[hsl(var(--accent))]" /> Home
          </Button>
          <span className="font-bold text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] truncate">
            {currentUser.role === 'ADMIN' ? (panelMode === 'user' ? 'User View' : 'Admin') : 'Dashboard'}
          </span>
          <div className="flex items-center gap-1">
            {currentUser.role === 'ADMIN' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-[11px] text-[hsl(var(--accent))]"
                onClick={() => {
                  setPanelMode(panelMode === 'user' ? 'admin' : 'user');
                  setActiveView('overview');
                }}
              >
                {panelMode === 'user' ? 'Admin' : 'User Panel'}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setIsMobileOpen(true)}>
              <FaBars className="w-4 h-4" />
            </Button>
          </div>
        </header>

        <main ref={mainScrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {selectedItem && isDialogOpen ? (
            <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setIsDialogOpen(false); setSelectedItem(null); }}
                    className="text-xs text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] mb-1 -ml-2 gap-1.5"
                  >
                    <FaArrowLeft className="w-3 h-3" /> Back to Dashboard
                  </Button>
                  <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
                    {selectedItem?.id ? 'Edit' : 'Create'} {selectedItem?.contentType?.charAt(0).toUpperCase() + selectedItem?.contentType?.slice(1)}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                    Configure details and parameters below
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => { setIsDialogOpen(false); setSelectedItem(null); }}
                    disabled={isSaving}
                    className="text-xs h-9 rounded-xl border-[var(--border-color)]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90 text-xs h-9 px-4 rounded-xl font-medium"
                  >
                    <FaSave className="mr-1.5 h-3 w-3" /> {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
                {renderForm()}
              </div>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
