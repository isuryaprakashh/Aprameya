import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, Calendar, QrCode, Settings, Clock, Mail } from 'lucide-react';
import { User } from '@/lib/types';
import { Link } from 'wouter';
import RoleBadge from '@/components/ui/RoleBadge';

interface UserOverviewProps {
  currentUser: User;
  userEventRegistrations?: any[];
  tickets?: any[];
  setActiveView?: (view: string) => void;
  getInitials: (name: string) => string;
}

export const UserOverview = ({
  currentUser,
  tickets = [],
  setActiveView,
  getInitials,
}: UserOverviewProps) => {
  const displayName = currentUser.display_name || currentUser.username;

  return (
    <div className="space-y-6">
      {/* User Identity Card (Section 4.4 & 5.9) */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <Avatar className="w-20 h-20 rounded-[16px] border border-border shrink-0 overflow-hidden">
            <AvatarImage src={currentUser.profile_image || ''} alt={displayName} className="object-cover" />
            <AvatarFallback className="rounded-[16px] bg-surface-2 text-text font-mono text-xl font-medium">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-display font-medium text-text tracking-tight">
                {displayName}
              </h2>
              <RoleBadge role={currentUser.role} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-text-2">
              <div className="flex items-center gap-2">
                <UserIcon className="w-3.5 h-3.5 text-text-3" />
                <span>{currentUser.rollNumber || currentUser.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-text-3" />
                <span className="truncate">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <Clock className="w-3.5 h-3.5 text-text-3" />
                <span>Member since {new Date(currentUser.created_at || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>

            {currentUser.bio && (
              <p className="text-xs text-text-2 pt-2 border-t border-border leading-relaxed">
                {currentUser.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/my-tickets"
          className="flex items-center gap-3.5 p-4 rounded-lg border border-border bg-surface hover:border-border-strong hover:bg-surface-2 transition-colors group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-md border border-border bg-surface-2 flex items-center justify-center text-text-2 group-hover:text-text shrink-0">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-text">Event Passes</div>
            <div className="text-xs font-mono text-text-3">View active tickets</div>
          </div>
        </Link>

        <Link
          href="/events"
          className="flex items-center gap-3.5 p-4 rounded-lg border border-border bg-surface hover:border-border-strong hover:bg-surface-2 transition-colors group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-md border border-border bg-surface-2 flex items-center justify-center text-text-2 group-hover:text-text shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-text">Browse Events</div>
            <div className="text-xs font-mono text-text-3">Bootcamps & sessions</div>
          </div>
        </Link>

        <Link
          href="/profile"
          className="flex items-center gap-3.5 p-4 rounded-lg border border-border bg-surface hover:border-border-strong hover:bg-surface-2 transition-colors group text-left cursor-pointer"
        >
          <div className="w-9 h-9 rounded-md border border-border bg-surface-2 flex items-center justify-center text-text-2 group-hover:text-text shrink-0">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-medium text-text">Account Settings</div>
            <div className="text-xs font-mono text-text-3">Profile & password</div>
          </div>
        </Link>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border p-5 bg-surface">
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 block mb-1">
            REGISTERED PASSES
          </span>
          <div className="font-display font-medium text-3xl text-text">
            {tickets.length}
          </div>
        </div>

        <div className="rounded-lg border border-border p-5 bg-surface">
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 block mb-1">
            LABORATORY ROLE
          </span>
          <div className="mt-1">
            <RoleBadge role={currentUser.role} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverview;
