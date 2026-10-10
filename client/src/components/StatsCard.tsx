import { StatItem } from '../lib/types';
import { CleanCard } from './ui/v6-card';

interface StatsCardProps {
  stats: StatItem[];
}

const StatsCard = ({ stats }: StatsCardProps) => {
  return (
    <div className="py-16 px-4 bg-transparent border-b border-[var(--border-color)]">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <CleanCard key={index} className="p-6 text-center">
              <div className="shimmer pointer-events-none"></div>
              <div className="text-[var(--text-primary)] text-4xl font-bold mb-2 font-mono">{stat.value}</div>
              <p className="text-[var(--text-secondary)] font-medium text-xs uppercase tracking-widest">{stat.label}</p>
            </CleanCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
