import { FaLinkedinIn, FaGithub, FaEnvelope } from 'react-icons/fa';
import { TeamMember } from '../lib/types';

interface TeamMemberCardProps {
  member: TeamMember;
}

const TeamMemberCard = ({ member }: TeamMemberCardProps) => {
  return (
    <div className="clean-card overflow-hidden group">
      <div className="h-48 bg-[var(--card-bg)] overflow-hidden relative">
        <div className="shimmer pointer-events-none"></div>
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-500"
        />
      </div>
      <div className="p-6 text-center">
        <h3 className="font-mono font-bold text-xl mb-1 text-white">{member.name}</h3>
        <p className="text-emerald-400 mb-3 text-sm uppercase tracking-wider">{member.role}</p>
        <p className="text-gray-500 mb-4 text-xs">{member.department}, {member.year}</p>
        <div className="flex justify-center space-x-3">
          {member.socialLinks.linkedin && (
            <a href={member.socialLinks.linkedin} className="text-gray-400 hover:text-emerald-400 transition-colors">
              <FaLinkedinIn />
            </a>
          )}
          {member.socialLinks.github && (
            <a href={member.socialLinks.github} className="text-gray-400 hover:text-emerald-400 transition-colors">
              <FaGithub />
            </a>
          )}
          {member.socialLinks.email && (
            <a href={member.socialLinks.email} className="text-gray-400 hover:text-emerald-400 transition-colors">
              <FaEnvelope />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
