import { Link } from 'wouter';
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
    FaChartLine,
    FaUsers,
    FaProjectDiagram,
    FaBlog,
    FaCalendarAlt,
    FaClipboardList,
    FaHome,
    FaCog,
    FaQrcode,
    FaUserPlus,
    FaIdCard
} from 'react-icons/fa';

interface SidebarContentProps {
    activeView: string;
    setActiveView: (view: string) => void;
    isMobile?: boolean;
    closeMobile?: () => void;
}

const SidebarContent = ({ activeView, setActiveView, isMobile, closeMobile }: SidebarContentProps) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const isCore = user?.role === 'CORE';
    const hasAccess = isAdmin || isCore;

    const menuItems = hasAccess ? [
        ...(isAdmin ? [{ id: 'overview', label: 'Overview', icon: FaChartLine }, { id: 'users', label: 'Users', icon: FaUsers }] : []),
        ...(isCore ? [{ id: 'overview', label: 'Overview', icon: FaHome }] : []),
        { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
        { id: 'blogs', label: 'Blogs', icon: FaBlog },
        { id: 'events', label: 'Events', icon: FaCalendarAlt },
        { id: 'registrations', label: 'Registrations', icon: FaClipboardList },
        { id: 'recruitment', label: 'Recruitment', icon: FaUserPlus },
        { id: 'roster', label: 'Roster', icon: FaIdCard },
        { id: 'scan', label: 'Scan QR', icon: FaQrcode },
    ] : [
        { id: 'overview', label: 'Overview', icon: FaHome },
        { id: 'registrations', label: 'My Registrations', icon: FaClipboardList },
        { id: 'settings', label: 'Settings', icon: FaCog },
    ];

    // Deduplicate items just in case
    const uniqueItems = Array.from(new Map(menuItems.map(item => [item.id, item])).values());

    const handleNavigation = (viewId: string) => {
        setActiveView(viewId);
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
                    <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--text-primary)] to-[hsl(var(--accent))]">
                        {isAdmin ? 'Admin' : 'Dashboard'}
                    </h1>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-3 space-y-1">
                    {uniqueItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.id)}
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
        </div>
    );
};

interface SidebarProps {
    activeView: string;
    setActiveView: (view: string) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar = ({ activeView, setActiveView, isMobileOpen, setIsMobileOpen }: SidebarProps) => {
    return (
        <>
            <div className="hidden md:block w-64 h-full flex-shrink-0">
                <SidebarContent activeView={activeView} setActiveView={setActiveView} />
            </div>

            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                <SheetContent side="left" className="p-0 w-80 bg-[var(--card-bg)] border-r border-[var(--border-color)]">
                    <SidebarContent
                        activeView={activeView}
                        setActiveView={setActiveView}
                        isMobile={true}
                        closeMobile={() => setIsMobileOpen(false)}
                    />
                </SheetContent>
            </Sheet>
        </>
    );
};
