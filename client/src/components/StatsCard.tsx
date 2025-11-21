import { StatItem } from '../lib/types';

interface StatsCardProps {
  stats: StatItem[];
}

const StatsCard = ({ stats }: StatsCardProps) => {
  return (
    <div className="py-16 px-4 bg-[#0a0a0a] border-b border-[#1a1a1a]">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="clean-card p-6 text-center">
              <div className="shimmer pointer-events-none"></div>
              <div className="text-white text-4xl font-bold mb-2 font-mono">{stat.value}</div>
              <p className="text-gray-500 font-medium text-xs uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
