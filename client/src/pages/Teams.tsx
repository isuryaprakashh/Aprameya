import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { TeamMember } from '@/lib/types';
import { teamMembers as fallbackTeamMembers } from '@/lib/data';
import { getMemberSlug } from '@/lib/slugs';
import { Search, User } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import TeamMemberCard, {
  isMentorMember,
  isAdvisorMember,
  isClubLeadMember,
} from '@/components/TeamMemberCard';

const FILTER_ROLES = ['All', 'Mentors', 'Club Leads', 'Advisors'];

export default function Teams() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [, setLocation] = useLocation();

  const { data: dbMembers } = useQuery<TeamMember[]>({
    queryKey: ['/api/teams'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
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

  // Global search filtering
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

  // Group members into the 3 canonical sections requested
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
    <main className="w-full bg-bg min-h-screen text-text">
      {/* ─── PAGE HEADER (DESIGN.md Section 5.4) ─── */}
      <section className="pt-24 pb-8 px-6 md:px-8 max-w-[1140px] mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 mb-2">
          03 — PERSONNEL ROSTER
        </p>
        <h1 className="font-display font-medium text-3xl sm:text-4xl md:text-5xl tracking-tight text-text mb-3">
          Team & leadership.
        </h1>
        <p className="text-base text-text-2 max-w-2xl leading-relaxed mb-8">
          Faculty mentors, technical leads, and research advisors engineering autonomous systems, robotics, and intelligent algorithms at Aprameya Lab.
        </p>

        {/* ─── FILTER & SEARCH BAR (DESIGN.md Section 4.7) ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {FILTER_ROLES.map((role) => {
              const active = selectedRole === role;
              let count = members.length;
              if (role === 'Mentors') count = members.filter(isMentorMember).length;
              else if (role === 'Club Leads') count = members.filter(isClubLeadMember).length;
              else if (role === 'Advisors') count = members.filter(isAdvisorMember).length;

              return (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`h-7 px-3.5 rounded-full text-xs font-mono uppercase tracking-[0.06em] whitespace-nowrap transition-colors duration-fast cursor-pointer flex items-center gap-2 ${
                    active
                      ? 'border border-red-line text-red-text bg-red-soft font-medium'
                      : 'border border-border text-text-2 hover:border-border-strong hover:text-text'
                  }`}
                >
                  <span>{role}</span>
                  <span
                    className={`text-[10px] ${
                      active ? 'text-red-text/80' : 'text-text-3'
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
            <input
              type="text"
              placeholder="Search member, role, dept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-md border border-border bg-surface text-xs text-text placeholder:text-text-3 focus:outline-none focus:border-border-strong transition-colors"
            />
          </div>
        </div>
      </section>

      {/* ─── PERSONNEL SECTIONS (MENTORS, CLUB LEADS, ADVISORS) ─── */}
      <section className="pb-28 px-6 md:px-8 max-w-[1140px] mx-auto space-y-16">
        {totalVisibleCount > 0 ? (
          <>
            {/* 1. MENTORS SECTION */}
            {showMentors && (
              <div id="mentors-section" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-4 gap-2">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.06em] text-red-text mb-1">
                      01 — FACULTY GUIDANCE
                    </p>
                    <div className="flex items-center gap-3">
                      <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-text">
                        MENTORS
                      </h2>
                      <span className="font-mono text-xs px-2 py-0.5 rounded border border-border text-text-3 bg-surface-2/40">
                        {mentors.length} {mentors.length === 1 ? 'PERSON' : 'PEOPLE'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-text-3 font-mono">
                    Academic supervision & research governance
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mentors.map((member, idx) => (
                    <TeamMemberCard
                      key={member.id || member._id || `mentor-${idx}`}
                      member={member}
                      index={idx}
                      onClick={() => handleCardClick(member, idx)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 2. CLUB LEADS SECTION */}
            {showClubLeads && (
              <div id="club-leads-section" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-4 gap-2">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.06em] text-red-text mb-1">
                      02 — EXECUTIVE & TECHNICAL LEADERSHIP
                    </p>
                    <div className="flex items-center gap-3">
                      <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-text">
                        CLUB LEADS
                      </h2>
                      <span className="font-mono text-xs px-2 py-0.5 rounded border border-border text-text-3 bg-surface-2/40">
                        {clubLeads.length} {clubLeads.length === 1 ? 'PERSON' : 'PEOPLE'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-text-3 font-mono">
                    Autonomy leads, domain heads & technical coordinators
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clubLeads.map((member, idx) => (
                    <TeamMemberCard
                      key={member.id || member._id || `lead-${idx}`}
                      member={member}
                      index={idx}
                      onClick={() => handleCardClick(member, idx)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 3. ADVISORS SECTION */}
            {showAdvisors && (
              <div id="advisors-section" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-4 gap-2">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.06em] text-red-text mb-1">
                      03 — STRATEGY & STEERING
                    </p>
                    <div className="flex items-center gap-3">
                      <h2 className="font-display font-medium text-2xl sm:text-3xl tracking-tight text-text">
                        ADVISORS
                      </h2>
                      <span className="font-mono text-xs px-2 py-0.5 rounded border border-border text-text-3 bg-surface-2/40">
                        {advisors.length} {advisors.length === 1 ? 'PERSON' : 'PEOPLE'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-text-3 font-mono">
                    Senior advisors & alumni strategic steering
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {advisors.map((member, idx) => (
                    <TeamMemberCard
                      key={member.id || member._id || `advisor-${idx}`}
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
            icon={User}
            title="No personnel found"
            description={
              searchTerm
                ? `No laboratory members matched "${searchTerm}". Try searching by another keyword or reset filters.`
                : 'No members found in this category.'
            }
            action={{
              label: 'Reset Filters & Search',
              onClick: () => {
                setSearchTerm('');
                setSelectedRole('All');
              },
            }}
          />
        )}
      </section>
    </main>
  );
}
