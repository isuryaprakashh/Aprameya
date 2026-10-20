import { useQuery } from '@tanstack/react-query';
import { teamMembers as fallbackMembers } from '../lib/data';
import { TeamMember } from '../lib/types';
import { getMemberSlug } from '@/lib/slugs';
import { Link } from 'wouter';
import ChamferedButton from '@/components/ui/ChamferedButton';
import { ArrowRight } from 'lucide-react';

const OperativeRoster = () => {
    const { data: dbMembers = [] } = useQuery<TeamMember[]>({
        queryKey: ['/api/teams'],
        queryFn: async () => {
            const baseUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${baseUrl}/api/teams`, { credentials: 'include' });
            if (!res.ok) throw new Error('Failed to fetch teams');
            return res.json();
        },
        staleTime: 30000,
    });

    const members = (dbMembers.length > 0 ? dbMembers : (fallbackMembers as any[]))
        .slice()
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

    // Show leading personnel on About page, invite to explore full team page
    const displayMembers = members.slice(0, 8);

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayMembers.map((member) => {
                    const memberId = member.id || member._id;
                    const slug = getMemberSlug(member.name, memberId);
                    return (
                        <Link key={memberId} href={`/team/${slug}`}>
                            <div className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] overflow-hidden hover:border-[var(--border-strong)] transition-colors group flex flex-col cursor-pointer h-full">
                                <div className="relative aspect-square overflow-hidden bg-[var(--surface-2)] flex items-center justify-center">
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-[filter,transform] duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                                                const fb = e.currentTarget.parentElement?.querySelector('.operative-fallback-initials') as HTMLElement;
                                                if (fb) fb.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`w-full h-full items-center justify-center font-display text-4xl font-medium text-[var(--text-3)] operative-fallback-initials ${member.image ? 'hidden' : 'flex'}`}>
                                        {member.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    {member.year && (
                                        <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider text-[var(--text-2)] bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] px-2 py-0.5 rounded-full">
                                            {member.year}
                                        </span>
                                    )}
                                </div>

                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-display font-medium text-base text-[var(--text)] mb-1 group-hover:text-[var(--red)] transition-colors">
                                            {member.name}
                                        </h3>
                                        <p className="text-xs text-[var(--text-2)] font-mono mb-3">
                                            {member.role}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-[var(--border)] text-[11px] text-[var(--text-3)] font-mono flex items-center justify-between">
                                        <span className="truncate">{member.department || 'Aprameya Lab'}</span>
                                        <span className="text-[10px] text-[var(--text-2)] group-hover:text-[var(--red)] transition-colors">View →</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-8 text-center">
                <Link href="/team">
                    <ChamferedButton variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                        View all {members.length} laboratory personnel
                    </ChamferedButton>
                </Link>
            </div>
        </div>
    );
};

export default OperativeRoster;