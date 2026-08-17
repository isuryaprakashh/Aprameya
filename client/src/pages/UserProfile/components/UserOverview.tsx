import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { FaUser, FaShieldAlt, FaCalendarAlt, FaTag, FaClock } from 'react-icons/fa';
import { User, EventRegistration } from '@/lib/types';

interface UserOverviewProps {
    currentUser: User;
    userEventRegistrations: EventRegistration[];
    tickets?: any[];
    setActiveView?: (view: string) => void;
    getInitials: (name: string) => string;
}

export const UserOverview = ({ currentUser, userEventRegistrations, tickets = [], getInitials }: UserOverviewProps) => {
    const getRoleBadge = (role: string) => {
        switch (role?.toUpperCase()) {
            case 'ADMIN':
                return 'badge-plum';
            case 'CORE':
            case 'CORE_TEAM':
                return 'bg-emerald-950/70 border border-emerald-400/40 text-emerald-300';
            default:
                return 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-400';
        }
    };

    const renderUserCard = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="morphic-metallic-card p-8 rounded-2xl relative overflow-hidden group">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
                    <Avatar className="w-24 h-24 border-2 border-emerald-400/30 shadow-[0_0_30px_-5px_rgba(32,64,31,0.5)]">
                        <AvatarFallback className="bg-gradient-to-br from-[#20401F] to-black text-white text-3xl font-bold font-display">
                            {getInitials(currentUser.username)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <h2 className="text-3xl font-bold text-white tracking-tight font-display">{currentUser.username}</h2>
                            <span className={`${getRoleBadge(currentUser.role)} px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-lg shadow-sm`}>
                                {currentUser.role} ACCESS
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                            <div className="flex items-center text-[#94A3B8]">
                                <FaUser className="mr-2 text-emerald-400" /> {currentUser.rollNumber || "No Roll Number"}
                            </div>
                            <div className="flex items-center text-[#94A3B8]">
                                <FaTag className="mr-2 text-emerald-400" /> {currentUser.email}
                            </div>
                            <div className="flex items-center text-[#94A3B8]">
                                <FaClock className="mr-2 text-emerald-400" /> Member since {new Date(currentUser.created_at || Date.now()).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-emerald-400" />
                    <h3 className="text-base font-bold text-white font-display">Access Privileges</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {(currentUser.role === 'ADMIN' || currentUser.role === 'CORE') && (
                        <div className="group relative overflow-hidden rounded-xl morphic-metallic-card p-6">
                            <h4 className="text-emerald-400 font-bold mb-1 text-base font-display">Laboratory Administration</h4>
                            <p className="text-xs text-[#94A3B8] leading-relaxed">Full control over research projects, recruitment applicants, and events.</p>
                        </div>
                    )}

                    <div className="group relative overflow-hidden rounded-xl morphic-metallic-card p-6">
                        <h4 className="text-white font-bold mb-1 text-base font-display">Workshop Registration</h4>
                        <p className="text-xs text-[#94A3B8] leading-relaxed">Active student clearance for autonomy hackathons and hands-on robotics workshops.</p>
                    </div>
                </div>
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
                            <p className="text-[10px] text-emerald-400 font-sans font-bold uppercase tracking-wider">Events Registered</p>
                            <h3 className="text-2xl font-bold text-white mt-1 font-display">{userEventRegistrations.length}</h3>
                        </div>
                        <FaCalendarAlt className="text-2xl text-emerald-500/40" />
                    </div>
                </div>

                <div className="morphic-metallic-card p-5 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-emerald-400 font-sans font-bold uppercase tracking-wider">Verified Passes</p>
                            <h3 className="text-2xl font-bold text-white mt-1 font-display">{tickets.length}</h3>
                        </div>
                        <FaShieldAlt className="text-2xl text-emerald-500/40" />
                    </div>
                </div>

                <div className="morphic-metallic-card p-5 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] text-emerald-400 font-sans font-bold uppercase tracking-wider">Cohort Status</p>
                            <h3 className="text-base font-bold text-white mt-1 font-display">Active Member</h3>
                        </div>
                        <FaUser className="text-2xl text-emerald-500/40" />
                    </div>
                </div>
            </div>
        </div>
    );
};
