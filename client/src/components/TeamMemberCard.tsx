import React from 'react';
import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { TeamMember } from '../lib/types';
import { Tag } from './ui/badge';

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

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member, onClick }) => {
  const isMentor = isMentorMember(member);
  const isAdvisor = isAdvisorMember(member);

  // Clean primary category label
  const categoryLabel = isMentor
    ? 'Faculty Mentor'
    : isAdvisor
    ? 'Advisor'
    : member.category?.trim() && !member.category.toLowerCase().includes('lead')
    ? member.category.trim()
    : 'Core Team';

  // Clean academic year label (only for students, omitting redundant faculty tags)
  const getYearLabel = () => {
    const raw = (member.year || '').trim();
    if (isMentor || isAdvisor) {
      // Don't duplicate "Faculty" or "Advisory" on top of the card
      return null;
    }
    if (raw && !raw.toLowerCase().includes('faculty') && !raw.toLowerCase().includes('core')) {
      return raw;
    }
    return '3rd Year';
  };

  const yearLabel = getYearLabel();

  const socialLinks = member.socialLinks || {};
  const email = member.email || socialLinks.email;
  const linkedin = member.linkedin || socialLinks.linkedin;
  const github = member.github || socialLinks.github;

  return (
    <article
      className="group flex flex-col justify-between w-full rounded-[var(--r-3)] border border-hairline bg-surface-1 overflow-hidden text-left cursor-pointer transition-colors duration-fast hover:border-hairline-2"
      onClick={onClick}
    >
      <div>
        {/* 4:5 Portrait container without dark/light gradient fade over face */}
        <div className="relative w-full aspect-[4/5] bg-surface-2 overflow-hidden border-b border-hairline">
          {member.image ? (
            <img
              src={member.image}
              alt={member.name}
              loading="lazy"
              className="w-full h-full object-cover object-top transition-transform duration-slow ease-out group-hover:scale-[1.02]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
                const fb = e.currentTarget.parentElement?.querySelector('.card-fallback-avatar') as HTMLElement;
                if (fb) fb.style.display = 'flex';
              }}
            />
          ) : null}

          {/* Fallback avatar */}
          <div
            className={`w-full h-full flex items-center justify-center font-sans font-medium text-3xl text-mute bg-surface-2 card-fallback-avatar ${
              member.image ? 'hidden' : 'flex'
            }`}
          >
            {member.name.substring(0, 2).toUpperCase()}
          </div>

          {/* Top Badges: Balanced Top-Left (Role) and Top-Right (Academic Year) — No side-by-side jamming */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
            <span className="px-2.5 py-1 rounded-[6px] bg-ink/80 backdrop-blur-md border border-hairline text-[11px] font-mono text-paper font-medium tracking-tight shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-signal shrink-0" />
              <span>{categoryLabel}</span>
            </span>

            {yearLabel && (
              <span className="px-2 py-0.5 rounded-[5px] bg-ink/75 backdrop-blur-md border border-hairline text-[10px] font-mono text-text-2 tracking-wide ml-auto">
                {yearLabel}
              </span>
            )}
          </div>
        </div>

        {/* Clean text section below the photo (NO fade overlay) */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-sans font-medium text-[17px] text-paper leading-snug tracking-[-0.01em]">
                {member.name}
              </h3>
              <p className="font-sans text-[13px] text-signal font-normal mt-0.5">
                {member.role}
              </p>
            </div>
            <ArrowUpRight className="w-4 h-4 text-mute group-hover:text-paper transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-0.5" />
          </div>
          <div className="flex items-center gap-2 text-[12px] text-mute mt-2 font-sans">
            <span className="truncate">{member.department || 'Department of Computer Science'}</span>
            {yearLabel && (
              <>
                <span className="text-hairline-3">•</span>
                <span className="shrink-0 font-mono text-[11px] text-text-2">{yearLabel}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Social actions row */}
      <div className="px-4 py-2.5 border-t border-hairline flex items-center justify-between text-mute mt-auto bg-surface-2/30">
        <span className="font-mono text-[11px] text-mute uppercase">
          Aprameya
        </span>

        <div className="flex items-center gap-1">
          {email && (
            <a
              href={`mailto:${email}`}
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-[var(--r-1)] hover:text-paper hover:bg-surface-2 transition-colors"
              title="Send email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-[var(--r-1)] hover:text-paper hover:bg-surface-2 transition-colors"
              title="LinkedIn profile"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-[var(--r-1)] hover:text-paper hover:bg-surface-2 transition-colors"
              title="GitHub profile"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default TeamMemberCard;
