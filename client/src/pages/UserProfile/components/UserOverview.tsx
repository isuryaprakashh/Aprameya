import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaUser, FaShieldAlt, FaTag, FaClock, FaInfoCircle, FaQrcode, FaCalendarAlt, FaCog } from 'react-icons/fa';
import { User } from '@/lib/types';
import { Link } from 'wouter';

interface UserOverviewProps {
    currentUser: User;
    userEventRegistrations?: any[];
    tickets?: any[];
    setActiveView?: (view: string) => void;
    getInitials: (name: string) => string;
}

export const UserOverview = ({ currentUser, tickets = [], setActiveView, getInitials }: UserOverviewProps) => {
    const getRoleBadge = (role: string) => {
        switch (role?.toUpperCase()) {
            case 'ADMIN':
                return 'bg-red-950/80 border border-red-400/50 text-red-200 shadow-[inset_0_1px_1px_rgba(254,202,202,0.3)]';
            case 'CORE':
            case 'CORE_TEAM':
                return 'bg-blue-950/60 border border-blue-400/40 text-blue-300';
            default:
                return 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-400';
        }
    };

    const displayName = currentUser.display_name || currentUser.username;

    const renderUserCard = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="morphic-metallic-card p-8 rounded-2xl relative overflow-hidden group">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                    <Avatar className="w-24 h-24 border-2 border-red-400/30 shadow-[0_0_30px_-5px_rgba(220,38,38,0.5)] shrink-0">
                        <AvatarImage src={currentUser.profile_image || ''} alt={displayName} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-[#7F1D1D] to-black text-white text-3xl font-bold font-display">
                            {getInitials(displayName)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <div>
                                <h2 className="text-3xl font-bold text-white tracking-tight font-display">{displayName}</h2>
                                {currentUser.display_name && (
                                    <p className="text-xs font-mono text-zinc-400">@{currentUser.username}</p>
                                )}
                            </div>
                            <span className={`${getRoleBadge(currentUser.role)} px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm w-fit`}>
                                {currentUser.role} ACCESS
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                            <div className="flex items-center text-[#94A3B8]">
                                <FaUser className="mr-2 text-[hsl(var(--accent))]" /> {currentUser.rollNumber || "No Roll Number"}
                            </div>
                            <div className="flex items-center text-[#94A3B8]">
                                <FaTag className="mr-2 text-[hsl(var(--accent))]" /> {currentUser.email}
                            </div>
                            <div className="flex items-center text-[#94A3B8]">
                                <FaClock className="mr-2 text-[hsl(var(--accent))]" /> Member since {new Date(currentUser.created_at || Date.now()).toLocaleDateString()}
                            </div>
                        </div>

                        {currentUser.bio && (
                            <div className="pt-3 border-t border-white/[0.08] mt-3">
                                <p className="text-[11px] font-mono uppercase tracking-wider text-[hsl(var(--accent))]/90 mb-1 flex items-center gap-1.5">
                                    <FaInfoCircle className="w-3 h-3" /> About
                                </p>
                                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">{currentUser.bio}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                    href="/my-tickets"
                    className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/5 transition-all group cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 flex items-center justify-center text-[hsl(var(--accent))] shrink-0 group-hover:scale-105 transition-transform">
                        <FaQrcode className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[hsl(var(--accent))] transition-colors">
                            My Entry Passes
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                            View scannable QR ticket codes
                        </div>
                    </div>
                </Link>

                <Link
                    href="/events"
                    className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/5 transition-all group cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                        <FaCalendarAlt className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-blue-400 transition-colors">
                            Explore Events
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                            Workshops & symposiums
                        </div>
                    </div>
                </Link>

                <button
                    onClick={() => setActiveView?.('settings')}
                    className="flex items-center gap-3 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] hover:border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/5 transition-all group text-left cursor-pointer"
                >
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[var(--text-secondary)] shrink-0 group-hover:scale-105 transition-transform">
                        <FaCog className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-primary)] transition-colors">
                            Profile Settings
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                            Update bio, photo & password
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {renderUserCard()}

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="morphic-metallic-card p-5 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-[hsl(var(--accent))] font-sans font-bold uppercase tracking-wider">Verified Passes</p>
                            <h3 className="text-2xl font-bold text-white mt-1 font-display">{tickets.length}</h3>
                            <Link href="/my-tickets" className="text-[11px] text-[hsl(var(--accent))] hover:underline mt-1 inline-block">
                                View QR passes →
                            </Link>
                        </div>
                        <FaQrcode className="text-2xl text-[hsl(var(--accent))]/40" />
                    </div>
                </div>

                <div className="morphic-metallic-card p-5 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-[hsl(var(--accent))] font-sans font-bold uppercase tracking-wider">Access Clearance</p>
                            <h3 className="text-xl font-bold text-white mt-1 font-display">{currentUser.role}</h3>
                            <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                                {currentUser.role === 'ADMIN' ? 'Full Administrator' : currentUser.role === 'CORE' ? 'Core Lead' : 'Verified Aspirant'}
                            </p>
                        </div>
                        <FaShieldAlt className="text-2xl text-[hsl(var(--accent))]/40" />
                    </div>
                </div>

                <div className="morphic-metallic-card p-5 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-[hsl(var(--accent))] font-sans font-bold uppercase tracking-wider">Cohort Status</p>
                            <h3 className="text-base font-bold text-white mt-1 font-display">Active Member</h3>
                            <p className="text-[11px] text-[var(--text-secondary)] mt-1">Autonomous Systems Lab</p>
                        </div>
                        <FaUser className="text-2xl text-[hsl(var(--accent))]/40" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserOverview;
