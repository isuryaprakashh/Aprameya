
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaUser, FaShieldAlt, FaClipboardList, FaCalendarAlt, FaTag, FaClock } from 'react-icons/fa';
import { User, EventRegistration } from '@/lib/types';

interface UserOverviewProps {
    currentUser: User;
    userEventRegistrations: EventRegistration[];
    tickets?: any[];
    setActiveView?: (view: string) => void;
    getInitials: (name: string) => string;
}

export const UserOverview = ({ currentUser, userEventRegistrations, tickets = [], getInitials }: UserOverviewProps) => {
    const getRoleBadgeColor = (role: string) => {
        switch (role?.toUpperCase()) {
            case 'ADMIN': return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'CORE':
            case 'CORE_TEAM': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            default: return 'bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] border-[hsl(var(--accent))]/50';
        }
    };

    const renderUserCard = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="glass-panel p-8 rounded-2xl border border-[var(--border-color)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--accent))]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                    <Avatar className="w-24 h-24 border-4 border-[hsl(var(--accent))]/20 shadow-[0_0_30px_-10px_hsl(var(--accent))]">
                        <AvatarFallback className="bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent))]/50 text-[var(--bg-body)] text-3xl font-bold">
                            {getInitials(currentUser.username)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-tight">{currentUser.username}</h2>
                            <Badge variant="outline" className={`${getRoleBadgeColor(currentUser.role)} px-3 py-1 text-xs uppercase tracking-wider font-semibold shadow-sm`}>
                                {currentUser.role} ACCESS
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                            <div className="flex items-center text-[var(--text-secondary)]">
                                <FaUser className="mr-2 opacity-70" /> {currentUser.rollNumber || "No Roll Number"}
                            </div>
                            <div className="flex items-center text-[var(--text-secondary)]">
                                <FaTag className="mr-2 opacity-70" /> {currentUser.email}
                            </div>
                            <div className="flex items-center text-[var(--text-secondary)]">
                                <FaClock className="mr-2 opacity-70" /> Member since {new Date(currentUser.created_at || Date.now()).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-[hsl(var(--accent))]" />
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Access Level</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(currentUser.role === 'ADMIN' || currentUser.role === 'CORE') && (
                        <div className="group relative overflow-hidden rounded-xl border border-blue-500/20 bg-gradient-to-br from-[#0f172a] to-[#1e293b] hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-blue-900/20">
                            <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-300" />
                            <div className="relative p-6">
                                <h4 className="text-blue-400 font-bold mb-2 text-lg">Content Management</h4>
                                <p className="text-sm text-blue-300/70">Full administrative control over content and users.</p>
                            </div>
                        </div>
                    )}

                    <div className="group relative overflow-hidden rounded-xl border border-emerald-500/20 bg-gradient-to-br from-[#0f172a] to-[#1e293b] hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-emerald-900/20">
                        <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-300" />
                        <div className="relative p-6">
                            <h4 className="text-emerald-400 font-bold mb-2 text-lg">Event Registration</h4>
                            <p className="text-sm text-emerald-300/70">Standard access to browse and register for events.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-[var(--card-bg)] border-[var(--border-color)]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-[var(--text-secondary)] flex items-center">
                            <FaClipboardList className="mr-2 text-amber-500" /> My Registrations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[var(--text-primary)]">{userEventRegistrations.length + tickets.length}</div>
                        <p className="text-xs text-[var(--text-secondary)]">Active Event Signups</p>
                    </CardContent>
                </Card>

                <Card className="bg-[var(--card-bg)] border-[var(--border-color)]">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-[var(--text-secondary)] flex items-center">
                            <FaCalendarAlt className="mr-2 text-emerald-500" /> Days Active
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-[var(--text-primary)]">
                            {Math.floor((Date.now() - new Date(currentUser.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24))}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">Days since registration</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    // If user is NOT admin, show a slightly different overview when in 'overview' mode
    // But wait, the original code had a switch case. 
    // 'overview' -> if ADMIN -> AdminStats, else -> UserProfileDashboard (This component)
    // So this component IS the user view.

    return renderUserCard();
};
