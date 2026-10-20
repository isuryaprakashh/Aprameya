import { Link, useLocation } from 'wouter';
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  BookOpen,
  Calendar,
  Home,
  Settings as SettingsIcon,
  QrCode,
  UserPlus,
  Shield,
  User,
} from 'lucide-react';
import Logo from '@/components/icons/Logo';
import RoleBadge from '@/components/ui/RoleBadge';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
}

interface SidebarContentProps {
  activeView: string;
  setActiveView: (view: string) => void;
  panelMode?: 'admin' | 'user';
  setPanelMode?: (mode: 'admin' | 'user') => void;
  isMobile?: boolean;
  closeMobile?: () => void;
}

const SidebarContent = ({
  activeView,
  setActiveView,
  panelMode = 'admin',
  setPanelMode,
  isMobile,
  closeMobile,
}: SidebarContentProps) => {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const isAdmin = user?.role === 'ADMIN';
  const isCore = user?.role === 'CORE';
  const hasAdminAccess = isAdmin || isCore;
  const isUserMode = panelMode === 'user';

  const menuItems: MenuItem[] =
    hasAdminAccess && !isUserMode
      ? [
          ...(isAdmin
            ? [
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'users', label: 'Users & Roles', icon: Users },
              ]
            : []),
          ...(isCore ? [{ id: 'overview', label: 'Overview', icon: LayoutDashboard }] : []),
          { id: 'projects', label: 'Projects', icon: FolderGit2 },
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'teams', label: 'Team', icon: Users },
          { id: 'blogs', label: 'Blogs', icon: BookOpen },
          { id: 'recruitment', label: 'Applications', icon: UserPlus },
          { id: 'scan', label: 'Scan QR', icon: QrCode },
          { id: 'settings', label: 'Profile & Settings', icon: User },
        ]
      : [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'my-tickets', label: 'Event Passes', icon: QrCode, href: '/my-tickets' },
          { id: 'settings', label: 'Profile & Settings', icon: User },
        ];

  const uniqueItems = Array.from(new Map(menuItems.map((item) => [item.id, item])).values());

  const handleNavigation = (item: MenuItem) => {
    if (item.href) {
      navigate(item.href);
    } else if (item.id === 'overview') {
      setActiveView('overview');
      navigate('/dashboard');
    } else if (item.id === 'settings') {
      setActiveView('settings');
      navigate('/dashboard/settings');
    } else {
      setActiveView(item.id);
      navigate(`/dashboard/${item.id}`);
    }
    if (isMobile && closeMobile) {
      closeMobile();
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg text-text border-r border-border font-body">
      {/* Brand header */}
      <div className="h-16 px-5 border-b border-border flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo size="sm" showText={false} />
          <span className="font-display font-medium text-base text-text tracking-tight">
            Aprameya
          </span>
        </Link>
        <RoleBadge role={user?.role} />
      </div>

      {/* Nav list: Active item has --surface-2 bg and 2px red left indicator (Section 5.10) */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-0.5 px-2">
          {uniqueItems.map((item) => {
            const isActive = activeView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center gap-3 px-3.5 h-10 rounded-md text-sm transition-colors duration-fast text-left cursor-pointer ${
                  isActive
                    ? 'bg-surface-2 text-text font-medium border-l-2 border-red rounded-l-none'
                    : 'text-text-2 hover:text-text hover:bg-surface-2/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-red-text' : 'text-text-3'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom controls */}
      <div className="p-3 border-t border-border space-y-2">
        {hasAdminAccess && setPanelMode && (
          <button
            onClick={() => {
              const nextMode = isUserMode ? 'admin' : 'user';
              setPanelMode(nextMode);
              setActiveView('overview');
              if (isMobile && closeMobile) closeMobile();
            }}
            className="w-full flex items-center justify-center gap-2 h-9 rounded-md text-xs font-mono border border-border-strong text-text-2 hover:text-text hover:bg-surface-2 transition-colors cursor-pointer"
          >
            {isUserMode ? (
              <>
                <Shield className="w-3.5 h-3.5" /> Back to Admin Panel
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" /> Switch to User View
              </>
            )}
          </button>
        )}

        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 h-9 rounded-md text-xs font-mono text-text-3 hover:text-text transition-colors"
        >
          <Home className="w-3.5 h-3.5" /> View Public Site
        </Link>
      </div>
    </div>
  );
};

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  panelMode?: 'admin' | 'user';
  setPanelMode?: (mode: 'admin' | 'user') => void;
}

export const Sidebar = ({
  activeView,
  setActiveView,
  isMobileOpen,
  setIsMobileOpen,
  panelMode = 'admin',
  setPanelMode,
}: SidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar 240px (Section 5.10) */}
      <aside className="hidden md:block w-60 shrink-0 h-screen sticky top-0">
        <SidebarContent
          activeView={activeView}
          setActiveView={setActiveView}
          panelMode={panelMode}
          setPanelMode={setPanelMode}
        />
      </aside>

      {/* Mobile Drawer */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-bg border-r border-border">
          <SidebarContent
            activeView={activeView}
            setActiveView={setActiveView}
            panelMode={panelMode}
            setPanelMode={setPanelMode}
            isMobile={true}
            closeMobile={() => setIsMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
