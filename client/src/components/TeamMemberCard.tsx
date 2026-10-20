import React from 'react';
import { Github, Linkedin, Mail, ArrowRight } from 'lucide-react';
import { TeamMember } from '../lib/types';

interface TeamMemberCardProps {
  member: TeamMember;
  index?: number;
  onClick?: () => void;
}

export const isMentorMember = (m: TeamMember): boolean => {
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

export const isAdvisorMember = (m: TeamMember): boolean => {
  const c = (m.category || '').toLowerCase();
  const r = (m.role || '').toLowerCase();
  return !isMentorMember(m) && (c.includes('advisor') || r.includes('advisor'));
};

export const isClubLeadMember = (m: TeamMember): boolean => {
  return !isMentorMember(m) && !isAdvisorMember(m);
};

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, index, onClick }) => {
  const isMentor = isMentorMember(member);
  const isAdvisor = isAdvisorMember(member);

  // Derive badges matching reference card
  const yearBadge =
    member.year && member.year.trim().length > 0
      ? member.year.toUpperCase()
      : isMentor
      ? 'FACULTY'
      : isAdvisor
      ? 'ADVISORY'
      : '3RD YEAR';

  const categoryBadge =
    member.category && member.category.trim().length > 0
      ? member.category.toUpperCase()
      : isMentor
      ? 'FACULTY MENTOR'
      : isAdvisor
      ? 'ADVISOR'
      : 'CORE TEAM';

  // Order display (#1, #2, etc.)
  const orderNumber =
    member.order !== undefined && member.order !== null
      ? member.order
      : index !== undefined
      ? index + 1
      : null;

  // Social URLs
  const socialLinks = member.socialLinks || {};
  const email = member.email || socialLinks.email;
  const linkedin = member.linkedin || socialLinks.linkedin;
  const github = member.github || socialLinks.github;

  return (
    <div
      onClick={onClick}
      className="group flex flex-col justify-between w-full rounded-xl border border-border bg-surface hover:border-border-strong transition-all duration-fast text-left overflow-hidden cursor-pointer"
    >
      <div>
        {/* Top Portrait Photograph Container: 10% more compact aspect-square/1.02, full color, crisp top alignment */}
        <div className="relative w-full aspect-[1/1.02] bg-surface-2 overflow-hidden border-b border-border">
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover object-top transition-transform duration-base group-hover:scale-[1.02]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                const fb = e.currentTarget.parentElement?.querySelector('.card-fallback-avatar') as HTMLElement;
                if (fb) fb.style.display = 'flex';
              }}
            />
          ) : null}

          {/* Monogram avatar fallback if image absent or errors out */}
          <div
            className={`w-full h-full flex items-center justify-center font-display font-medium text-3xl text-text-3 bg-surface-2 card-fallback-avatar ${
              member.image ? 'hidden' : 'flex'
            }`}
          >
            {member.name.substring(0, 2).toUpperCase()}
          </div>

          {/* Top-Left Badge: Year */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-black/80 border border-white/15 font-mono text-[9px] tracking-wider text-text-2 uppercase backdrop-blur-xs">
              {yearBadge}
            </span>
          </div>

          {/* Top-Right Badge: Category / Team */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-black/80 border border-red-line font-mono text-[9px] font-medium tracking-wider text-red-text uppercase backdrop-blur-xs">
              {categoryBadge}
            </span>
          </div>
        </div>

        {/* Card Body Details: Tightened padding by 10% */}
        <div className="p-4 sm:p-4.5">
          {/* Name & Order Row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              className="font-display font-medium text-base sm:text-lg text-white tracking-tight uppercase line-clamp-1"
              title={member.name}
            >
              {member.name}
            </h3>
            {orderNumber !== null && (
              <span className="shrink-0 font-mono text-[10px] text-text-3 border border-border px-1.5 py-0.5 rounded bg-surface-2/60">
                #{orderNumber}
              </span>
            )}
          </div>

          {/* Role (Uppercase Red Accent) */}
          <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-red-text mb-1.5">
            {member.role}
          </p>

          {/* Department */}
          <p className="font-mono text-[11px] text-text-3 mb-3.5">
            <span className="text-text-3">Dept:</span>{' '}
            <span className="text-text-2">{member.department || 'CSE'}</span>
          </p>

          {/* Action Link: Lighter red/coral color with no underline */}
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#ff7875] hover:text-[#ffa39e] transition-all">
            <span>View Profile & Credentials</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Card Footer Bar: Tightened padding */}
      <div className="px-4 sm:px-4.5 py-2.5 border-t border-border bg-surface-2/20 flex items-center justify-between mt-auto">
        <span className="font-mono text-[9px] uppercase tracking-wider text-text-3">
          APRAMEYA LAB
        </span>

        {/* Social Icons */}
        <div className="flex items-center gap-2 text-text-3">
          {email ? (
            <a
              href={`mailto:${email}`}
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded hover:text-text hover:bg-surface-2 transition-colors"
              aria-label="Email"
              title="Email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="p-1 text-text-3/40" title="Email unavailable">
              <Mail className="w-3.5 h-3.5" />
            </span>
          )}

          {linkedin ? (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded hover:text-text hover:bg-surface-2 transition-colors"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="p-1 text-text-3/40" title="LinkedIn unavailable">
              <Linkedin className="w-3.5 h-3.5" />
            </span>
          )}

          {github ? (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded hover:text-text hover:bg-surface-2 transition-colors"
              aria-label="GitHub"
              title="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="p-1 text-text-3/40" title="GitHub unavailable">
              <Github className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
