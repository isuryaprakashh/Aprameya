
import { useAuth } from "@/context/AuthContext";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
    FaChartLine,
    FaUsers,
    FaProjectDiagram,
    FaBlog,
    FaFlask,
    FaCalendarAlt,
    FaClipboardList,
    FaHome,
    FaNewspaper,
    FaCog,
    FaTimes
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

    const menuItems = isAdmin ? [
        { id: 'overview', label: 'Overview', icon: FaChartLine },
        { id: 'users', label: 'Users', icon: FaUsers },
        { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
        { id: 'blogs', label: 'Blogs', icon: FaBlog },
        { id: 'research', label: 'Research', icon: FaFlask },
        { id: 'events', label: 'Events', icon: FaCalendarAlt },
        { id: 'registrations', label: 'Registrations', icon: FaClipboardList },
    ] : [
        { id: 'overview', label: 'Overview', icon: FaHome },
        { id: 'events', label: 'Upcoming Events', icon: FaCalendarAlt },
        { id: 'registrations', label: 'My Registrations', icon: FaClipboardList },
        { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
        { id: 'blogs', label: 'Blogs', icon: FaNewspaper },
        { id: 'research', label: 'Research', icon: FaFlask },
        { id: 'settings', label: 'Settings', icon: FaCog },
    ].filter(item => {
        if (user?.role === 'ASPIRANT') {
            return !['projects', 'blogs', 'research'].includes(item.id);
        }
        return true;
    });

    const handleNavigation = (viewId: string) => {
        setActiveView(viewId);
        if (isMobile && closeMobile) {
            closeMobile();
        }
    };

    return (
        <div className="flex flex-col h-full bg-[var(--card-bg)] text-[var(--text-primary)] border-r border-[var(--border-color)]">
            <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[hsl(var(--accent))] flex items-center justify-center">
                        <span className="font-bold text-[var(--bg-body)]">A</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">
                        {isAdmin ? 'Admin' : 'User'}<span className="text-[hsl(var(--accent))]">Profile</span>
                    </h1>
                </div>
                {isMobile && (
                    <Button variant="ghost" size="icon" onClick={closeMobile}>
                        <FaTimes />
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="px-3 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeView === item.id
                                ? 'bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/5 hover:text-[var(--text-primary)]'
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
