import { useQuery } from '@tanstack/react-query';
import { teamMembers as fallbackMembers } from '../lib/data';
import { TeamMember } from '../lib/types';
import { Link } from 'wouter';

const OperativeRoster = () => {
    const { data: dbMembers = [] } = useQuery<TeamMember[]>({
        queryKey: ['/api/teams'],
        queryFn: async () => {
            const baseUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${baseUrl}/api/teams`, { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch teams');
            return res.json();
        },
        staleTime: 5000,
    });

    const members = dbMembers.length > 0 ? dbMembers : (fallbackMembers as any[]);

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {members.map((member) => (
                    <div
                        key={member.id || member._id}
                        className="rounded-xl morphic-metallic-card overflow-hidden transition-all duration-300 group flex flex-col"
                    >
                        <div className="relative h-64 overflow-hidden bg-black">
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
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1A050A] to-transparent pointer-events-none" />
                            {member.year && (
                                <span className="absolute top-3 left-3 text-[10px] font-sans font-semibold uppercase tracking-wider text-red-300 bg-black/80 backdrop-blur-md border border-red-500/20 px-2 py-0.5 rounded">
                                    {member.year}
                                </span>
                            )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-display font-bold text-base text-white mb-1 group-hover:text-metallic-red transition-colors">
                                    {member.name}
                                </h3>
                                <p className="text-xs text-red-400 font-mono mb-3">
                                    {member.role}
                                </p>
                            </div>

                            <div className="pt-3 border-t border-red-500/10 text-[11px] text-[#94A3B8]">
                                <span>{member.department || 'Aprameya Lab'}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 text-center">
                <Link
                    href="/teams"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-zinc-300 hover:text-white hover:border-red-500/40 bg-zinc-950/60 transition-colors"
                >
                    View All Laboratory Personnel & Members →
                </Link>
            </div>
        </div>
    );
};

export default OperativeRoster;