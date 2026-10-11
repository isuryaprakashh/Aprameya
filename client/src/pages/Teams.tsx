import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { TeamMember } from '@/lib/types';
import { teamMembers as fallbackTeamMembers } from '@/lib/data';
import { getMemberSlug } from '@/lib/slugs';
import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaSearch,
  FaUsers,
  FaGraduationCap,
  FaMicrochip,
  FaAward
} from 'react-icons/fa';
import UnderConstruction from '@/components/UnderConstruction';

export default function Teams() {
  const [searchTerm, setSearchTerm] = useState('');
  const [, setLocation] = useLocation();

  const { data: dbMembers = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/teams'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/teams`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch team members');
      return res.json();
    },
    staleTime: 5000,
  });

  // Use DB members if loaded and non-empty, otherwise use verified fallback data from data.ts
  const members: TeamMember[] = dbMembers.length > 0 ? dbMembers : (fallbackTeamMembers as any[]);

  const isMentor = (m: TeamMember) => {
    const c = (m.category || '').toLowerCase();
    const r = (m.role || '').toLowerCase();
    const y = (m.year || '').toLowerCase();
    return (
      c.includes('mentor') ||
      c.includes('faculty') ||
      r.includes('mentor') ||
      r.includes('faculty') ||
      y.includes('faculty')
    );
  };

  const isAdvisor = (m: TeamMember) => {
    const c = (m.category || '').toLowerCase();
    const r = (m.role || '').toLowerCase();
    return !isMentor(m) && (c.includes('advisor') || r.includes('advisor'));
  };

  const isClubLead = (m: TeamMember) => {
    return !isMentor(m) && !isAdvisor(m);
  };

  const filteredMembers = members.filter((member) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      member.name.toLowerCase().includes(term) ||
      member.role.toLowerCase().includes(term) ||
      (member.department && member.department.toLowerCase().includes(term)) ||
      (member.bio && member.bio.toLowerCase().includes(term))
    );
  });

  const mentorsList = filteredMembers.filter(isMentor);
  const clubLeadsList = filteredMembers.filter(isClubLead);
  const advisorsList = filteredMembers.filter(isAdvisor);

  const facultyCount = members.filter(isMentor).length;
  const coreCount = members.filter(isClubLead).length;

  return (
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)] font-sans selection:bg-[hsl(var(--accent))]/30 pb-24">
      {/* Telemetry Header */}
      <section className="relative pt-32 pb-16 px-6 md:px-12 border-b border-white/[0.04] overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-[hsl(var(--accent))]/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
              <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-[hsl(var(--accent))]">
                ORGANIZATION & LABORATORY ROSTER
              </p>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl mb-4 tracking-tight text-[var(--text-primary)] font-display font-bold">
              <span className="text-[var(--text-secondary)] font-normal">Team &</span>{" "}
              <span>Leadership</span>
            </h1>

            <p className="text-base text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-10">
              Meet the faculty mentors, technical architects, and student researchers driving applied autonomous robotics, computer vision, and ROS 2 perception systems at Aprameya Lab.
            </p>

            {/* Telemetry Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
              <div className="border border-white/[0.06] bg-[var(--card-bg)] p-5 rounded-xl hover:border-[hsl(var(--accent))]/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-wider font-mono">
                    Total Personnel
                  </span>
                  <FaUsers className="text-[hsl(var(--accent))] w-4 h-4 opacity-75" />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                  {members.length}
                </div>
              </div>

              <div className="border border-white/[0.06] bg-[var(--card-bg)] p-5 rounded-xl hover:border-[hsl(var(--accent))]/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-wider font-mono">
                    Faculty Mentors
                  </span>
                  <FaGraduationCap className="text-red-400 w-4 h-4 opacity-75" />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                  {facultyCount || 2}
                </div>
              </div>

              <div className="border border-white/[0.06] bg-[var(--card-bg)] p-5 rounded-xl hover:border-[hsl(var(--accent))]/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-wider font-mono">
                    Core Technical Leads
                  </span>
                  <FaMicrochip className="text-blue-400 w-4 h-4 opacity-75" />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                  {coreCount || 4}
                </div>
              </div>

              <div className="border border-white/[0.06] bg-[var(--card-bg)] p-5 rounded-xl hover:border-[hsl(var(--accent))]/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[var(--text-muted)] font-medium uppercase tracking-wider font-mono">
                    National Ranking
                  </span>
                  <FaAward className="text-amber-400 w-4 h-4 opacity-75" />
                </div>
                <div className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                  3rd (IISc)
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Roster Controls & Member Grid */}
      <section className="py-12 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Search Bar (No category filter buttons) */}
        <div className="mb-10 max-w-md">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, role, division, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[hsl(var(--accent))]/60 transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Member Grid Loading & Empty States */}
        {isLoading && dbMembers.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-mono text-sm text-[var(--text-muted)] animate-pulse">
              SYNCING LABORATORY ROSTER...
            </p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <UnderConstruction
            title="NO MATCHING PERSONNEL FOUND"
            description="No team members match your current query. Adjust search keywords to inspect other laboratory divisions."
          />
        ) : (
          <div className="space-y-16">
            {/* 1. MENTORS SECTION */}
            {mentorsList.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-7 sm:h-8 bg-red-500 rounded-full shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.7)]" />
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold tracking-wider text-white uppercase flex items-center gap-3">
                    <span>MENTORS</span>
                    <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                      {mentorsList.length}
                    </span>
                  </h2>
                  <div className="flex-1 h-[1px] bg-white/10 ml-3" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {mentorsList.map((member, index) => renderMemberCard(member, index))}
                </div>
              </div>
            )}

            {/* 2. CLUB LEADS SECTION (Exact cyan bar style as requested) */}
            {clubLeadsList.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-7 sm:h-8 bg-[#00D8F6] rounded-full shrink-0 shadow-[0_0_12px_rgba(0,216,246,0.7)]" />
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold tracking-wider text-white uppercase flex items-center gap-3">
                    <span>CLUB LEADS</span>
                    <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                      {clubLeadsList.length}
                    </span>
                  </h2>
                  <div className="flex-1 h-[1px] bg-white/10 ml-3" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {clubLeadsList.map((member, index) => renderMemberCard(member, index))}
                </div>
              </div>
            )}

            {/* 3. ADVISORS SECTION (If any exist) */}
            {advisorsList.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-7 sm:h-8 bg-amber-400 rounded-full shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.7)]" />
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold tracking-wider text-white uppercase flex items-center gap-3">
                    <span>ADVISORS</span>
                    <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                      {advisorsList.length}
                    </span>
                  </h2>
                  <div className="flex-1 h-[1px] bg-white/10 ml-3" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {advisorsList.map((member, index) => renderMemberCard(member, index))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );

  function renderMemberCard(member: TeamMember, index: number) {
    const memberId = member.id || member._id || String(member.order || index + 1);
    const socialLinks = member.socialLinks || {};
    const email = member.email || socialLinks.email;
    const linkedin = member.linkedin || socialLinks.linkedin;
    const github = member.github || socialLinks.github;

    return (
      <motion.div
        key={member.id || member._id || index}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.04 }}
        onClick={() => setLocation(`/team/${getMemberSlug(member.name, memberId)}`)}
        className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] overflow-hidden transition-all duration-300 hover:border-[hsl(var(--accent))]/50 hover:shadow-[0_12px_36px_rgb(0,0,0,0.25)] group flex flex-col justify-between cursor-pointer"
      >
        <div>
          {/* Portrait Photo Container - VIVID, NATURAL, NO GRAYSCALE */}
          <div className="relative h-72 sm:h-80 overflow-hidden bg-zinc-950">
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/team_avatar_1.png';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-950 font-display text-4xl font-bold text-zinc-700">
                {member.name.substring(0, 2).toUpperCase()}
              </div>
            )}

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
              {member.year && (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-300 bg-black/85 backdrop-blur-md border border-red-500/25 px-2.5 py-0.5 rounded shadow">
                  {member.year}
                </span>
              )}
              {member.category && (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[hsl(var(--accent))] bg-black/85 backdrop-blur-md border border-[hsl(var(--accent))]/30 px-2.5 py-0.5 rounded ml-auto shadow">
                  {member.category}
                </span>
              )}
            </div>

            {/* Subtle Bottom Gradient Fade for seamless contrast */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--card-bg)] to-transparent pointer-events-none" />
          </div>

          {/* Member Details */}
          <div className="p-6">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)] group-hover:text-[hsl(var(--accent))] transition-colors">
                {member.name}
              </h3>
              {member.order !== undefined && member.order > 0 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border-color)] text-[var(--text-muted)] shrink-0">
                  #{member.order}
                </span>
              )}
            </div>

            <p className="text-xs font-mono text-[hsl(var(--accent))] mb-3 font-semibold">
              {member.role}
            </p>

            {member.department && (
              <p className="text-xs text-[var(--text-secondary)] mb-2.5 leading-relaxed">
                <span className="text-[var(--text-muted)] font-mono text-[11px]">Dept:</span>{' '}
                {member.department}
              </p>
            )}

            {member.bio && (
              <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed mb-3">
                {member.bio}
              </p>
            )}

            <div className="pt-1 flex items-center text-[11px] font-mono text-[hsl(var(--accent))] opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
              <span>View Profile & Credentials →</span>
            </div>
          </div>
        </div>

        {/* Social and Department Footer */}
        <div className="px-6 py-4 border-t border-[var(--border-color)]/70 flex items-center justify-between bg-black/10">
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            APRAMEYA LAB
          </span>

          <div className="flex items-center gap-3">
            {email && (
              <a
                href={`mailto:${email}`}
                onClick={(e) => e.stopPropagation()}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
                title={email}
                aria-label="Email"
              >
                <FaEnvelope className="w-3.5 h-3.5" />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[var(--text-muted)] hover:text-[#0A66C2] transition-colors p-1"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-3.5 h-3.5" />
              </a>
            )}
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors p-1"
                title="GitHub"
                aria-label="GitHub"
              >
                <FaGithub className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
}
