import { Link, useLocation } from 'wouter';
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
    FaChartLine,
    FaUsers,
    FaProjectDiagram,
    FaBlog,
    FaCalendarAlt,
    FaHome,
    FaCog,
    FaQrcode,
    FaUserPlus,
    FaUserTie,
    FaUser,
    FaShieldAlt
} from 'react-icons/fa';

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

const SidebarContent = ({ activeView, setActiveView, panelMode = 'admin', setPanelMode, isMobile, closeMobile }: SidebarContentProps) => {
    const { user } = useAuth();
    const [, navigate] = useLocation();
    const isAdmin = user?.role === 'ADMIN';
    const isCore = user?.role === 'CORE';
    const hasAdminAccess = isAdmin || isCore;
    const isUserMode = panelMode === 'user';

    const menuItems: MenuItem[] = hasAdminAccess && !isUserMode ? [
        ...(isAdmin ? [{ id: 'overview', label: 'Overview', icon: FaChartLine }, { id: 'users', label: 'Users', icon: FaUsers }] : []),
        ...(isCore ? [{ id: 'overview', label: 'Overview', icon: FaHome }] : []),
        { id: 'teams', label: 'Team', icon: FaUserTie },
        { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
        { id: 'blogs', label: 'Blogs', icon: FaBlog },
        { id: 'events', label: 'Events', icon: FaCalendarAlt },
        { id: 'recruitment', label: 'Recruitment', icon: FaUserPlus },
        { id: 'scan', label: 'Scan QR', icon: FaQrcode },
    ] : [
        { id: 'overview', label: 'User Overview', icon: FaHome },
        { id: 'my-tickets', label: 'My Event Passes', icon: FaQrcode, href: '/my-tickets' },
        { id: 'settings', label: 'Settings', icon: FaCog },
    ];

    // Deduplicate items just in case
    const uniqueItems = Array.from(new Map(menuItems.map(item => [item.id, item])).values());

    const handleNavigation = (item: MenuItem) => {
        if (item.href) {
            navigate(item.href);
        } else {
            setActiveView(item.id);
        }
        if (isMobile && closeMobile) {
            closeMobile();
        }
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-[var(--card-bg)] to-[var(--bg-body)] text-[var(--text-primary)] border-r border-[var(--border-color)] backdrop-blur-md">
            <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="w-8 h-8 rounded-lg bg-[hsl(var(--accent))] flex items-center justify-center hover:opacity-80 transition-opacity">
                        <span className="font-bold text-[var(--bg-body)]">A</span>
                    </Link>
                    <div>
                        <h1 className="text-base font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[hsl(var(--accent))]">
                            {isAdmin ? (isUserMode ? 'User View' : 'Admin Panel') : 'Dashboard'}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-3 space-y-1">
                    {uniqueItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group ${activeView === item.id
                                ? 'bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] shadow-[0_0_20px_-5px_hsl(var(--accent)/0.3)]'
                                : 'text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/5'
                                }`}
                        >
                            <item.icon className={`w-4 h-4 ${activeView === item.id ? 'text-[hsl(var(--accent))]' : 'text-[var(--text-secondary)]'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Bottom Actions: View Home Page & View User Panel Toggle */}
            <div className="p-3 border-t border-[var(--border-color)] space-y-2 bg-black/20">
                {hasAdminAccess && setPanelMode && (
                    <button
                        onClick={() => {
                            const nextMode = isUserMode ? 'admin' : 'user';
                            setPanelMode(nextMode);
                            setActiveView('overview');
                            if (isMobile && closeMobile) closeMobile();
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all border border-[hsl(var(--accent))]/30 bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/20 hover:border-[hsl(var(--accent))]/50 shadow-sm"
                    >
                        {isUserMode ? (
                            <>
                                <FaShieldAlt className="w-3.5 h-3.5" /> Back to Admin Panel
                            </>
                        ) : (
                            <>
                                <FaUser className="w-3.5 h-3.5" /> View User Panel
                            </>
                        )}
                    </button>
                )}

                <Link
                    href="/"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-white/20 hover:bg-white/5"
                >
                    <FaHome className="w-3.5 h-3.5 text-[hsl(var(--accent))]" /> View Home Page
                </Link>
            </div>
        </div>
    );
};

interface SidebarProps {
    activeView: string;
    setActiveView: (view: string) => void;
    panelMode?: 'admin' | 'user';
    setPanelMode?: (mode: 'admin' | 'user') => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar = ({ activeView, setActiveView, panelMode, setPanelMode, isMobileOpen, setIsMobileOpen }: SidebarProps) => {
    return (
        <>
            <div className="hidden md:block w-64 h-full flex-shrink-0">
                <SidebarContent activeView={activeView} setActiveView={setActiveView} panelMode={panelMode} setPanelMode={setPanelMode} />
            </div>

            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetContent side="left" className="p-0 w-80 bg-[var(--card-bg)] border-r border-[var(--border-color)]">
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
