import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { TeamMember } from '@/lib/types';
import { teamMembers as fallbackTeamMembers } from '@/lib/data';
import { getMemberSlug } from '@/lib/slugs';
import { Search, Users } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import TeamMemberCard, {
  isMentorMember,
  isAdvisorMember,
  isClubLeadMember,
} from '@/components/TeamMemberCard';

const FILTER_ROLES = ['All', 'Mentors', 'Club Leads', 'Advisors'];

export const Teams: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [, setLocation] = useLocation();

  const { data: dbMembers } = useQuery<TeamMember[]>({
    queryKey: ['/api/teams'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      try {
        const res = await fetch(`${baseUrl}/api/teams`, {
          credentials: 'include',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('Failed to fetch teams');
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    },
    staleTime: 30000,
  });

  const members: TeamMember[] = (
    dbMembers && dbMembers.length > 0 ? dbMembers : (fallbackTeamMembers as any[])
  )
    .slice()
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const filteredMembers = members.filter((member) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      member.name.toLowerCase().includes(term) ||
      member.role.toLowerCase().includes(term) ||
      (member.department && member.department.toLowerCase().includes(term)) ||
      (member.bio && member.bio.toLowerCase().includes(term)) ||
      (member.category && member.category.toLowerCase().includes(term)) ||
      (member.year && member.year.toLowerCase().includes(term))
    );
  });

  const mentors = filteredMembers.filter(isMentorMember);
  const clubLeads = filteredMembers.filter(isClubLeadMember);
  const advisors = filteredMembers.filter(isAdvisorMember);

  const showMentors = (selectedRole === 'All' || selectedRole === 'Mentors') && mentors.length > 0;
  const showClubLeads = (selectedRole === 'All' || selectedRole === 'Club Leads') && clubLeads.length > 0;
  const showAdvisors = (selectedRole === 'All' || selectedRole === 'Advisors') && advisors.length > 0;

  const totalVisibleCount =
    (showMentors ? mentors.length : 0) +
    (showClubLeads ? clubLeads.length : 0) +
    (showAdvisors ? advisors.length : 0);

  const handleCardClick = (member: TeamMember, index: number) => {
    const memberId = member.id || member._id || String(member.order || index + 1);
    setLocation(`/team/${getMemberSlug(member.name, memberId)}`);
  };

  return (
    <div className="w-full bg-ink text-paper min-h-screen">
      {/* ─── PAGE HERO (§7.8.2) ─── */}
      <section className="pt-12 sm:pt-16 pb-8 px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left">
        <h1 className="font-sans font-medium text-[clamp(34px,4.8vw,60px)] tracking-[-0.03em] leading-tight text-paper mb-3">
          Team
        </h1>
        <p className="font-sans text-[clamp(17px,1.4vw,20px)] text-text-2 max-w-2xl leading-relaxed mb-10">
          Faculty mentors, student leads, and research contributors engineering autonomous testbeds and vision pipelines.
        </p>

        {/* ─── FILTER BAR ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {FILTER_ROLES.map((role) => {
              const isSelected = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`h-7 px-3 rounded-[var(--r-full)] text-[12px] font-sans font-medium transition-colors cursor-pointer select-none border ${
                    isSelected
                      ? 'border-signal-line bg-signal-soft text-signal-text'
                      : 'border-hairline bg-transparent text-text-2 hover:border-hairline-2 hover:text-paper'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-mute pointer-events-none" />
            <Input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 text-[13px]"
            />
          </div>
        </div>
      </section>

      {/* ─── ROSTER SECTIONS (§8.6) ─── */}
      <section className="pb-24 px-5 sm:px-8 lg:px-12 max-w-container mx-auto text-left space-y-16">
        {totalVisibleCount > 0 ? (
          <>
            {/* 1. Mentors */}
            {showMentors && (
              <div>
                <div className="flex items-baseline justify-between border-b border-hairline pb-3 mb-6">
                  <h2 className="font-sans font-medium text-[22px] sm:text-[24px] tracking-[-0.01em] text-paper">
                    Faculty mentors
                  </h2>
                  <span className="font-mono text-[13px] text-mute">
                    {mentors.length} {mentors.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {mentors.map((member, idx) => (
                    <TeamMemberCard
                      key={member.id || member._id || idx}
                      member={member}
                      index={idx}
                      onClick={() => handleCardClick(member, idx)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 2. Club Leads */}
            {showClubLeads && (
              <div>
                <div className="flex items-baseline justify-between border-b border-hairline pb-3 mb-6">
                  <h2 className="font-sans font-medium text-[22px] sm:text-[24px] tracking-[-0.01em] text-paper">
                    Club leads
                  </h2>
                  <span className="font-mono text-[13px] text-mute">
                    {clubLeads.length} {clubLeads.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {clubLeads.map((member, idx) => (
                    <TeamMemberCard
                      key={member.id || member._id || idx}
                      member={member}
                      index={idx}
                      onClick={() => handleCardClick(member, idx)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 3. Advisors */}
            {showAdvisors && (
              <div>
                <div className="flex items-baseline justify-between border-b border-hairline pb-3 mb-6">
                  <h2 className="font-sans font-medium text-[22px] sm:text-[24px] tracking-[-0.01em] text-paper">
                    Advisors
                  </h2>
                  <span className="font-mono text-[13px] text-mute">
                    {advisors.length} {advisors.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {advisors.map((member, idx) => (
                    <TeamMemberCard
                      key={member.id || member._id || idx}
                      member={member}
                      index={idx}
                      onClick={() => handleCardClick(member, idx)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={Users}
            title="No team members found"
            description="Try modifying your keyword search or filter by a different category."
          />
        )}
      </section>
    </div>
  );
};

export default Teams;
