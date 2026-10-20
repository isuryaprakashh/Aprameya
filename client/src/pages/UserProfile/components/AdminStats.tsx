import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FolderGit2, BookOpen, ClipboardList } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { User, Project, ResearchItem } from '@/lib/types';

interface AdminStatsProps {
  users: User[];
  projects: Project[];
  research: ResearchItem[];
  eventRegistrations: { totalRegistrations: number };
  events: any[];
  blogs: any[];
  userGrowthData: any[];
  contentDistributionData: any[];
}

export const AdminStats = ({
  users,
  projects,
  research,
  eventRegistrations,
  userGrowthData,
  contentDistributionData,
}: AdminStatsProps) => {
  const stats = [
    { label: "REGISTERED USERS", value: users.length, icon: Users },
    { label: "LAB REPOSITORIES", value: projects.length, icon: FolderGit2 },
    { label: "RESEARCH ARTICLES", value: research.length, icon: BookOpen },
    { label: "EVENT REGISTRATIONS", value: eventRegistrations.totalRegistrations, icon: ClipboardList },
  ];

  return (
    <div className="space-y-8">
      {/* 4 Stat Cards: Space Grotesk 32px, mono label (Section 5.10) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-surface p-5 hover:border-border-strong transition-colors duration-fast"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[11px] text-text-3 uppercase tracking-[0.06em]">
                {stat.label}
              </span>
              <stat.icon className="w-4 h-4 text-text-3" />
            </div>
            <div className="font-display font-medium text-3xl text-text tracking-tight">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Chart Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="mb-4">
            <h3 className="font-display font-medium text-base text-text tracking-tight">
              User growth telemetry
            </h3>
            <p className="text-xs font-mono text-text-3">MONTHLY PORTAL REGISTRATIONS</p>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F0F10', borderColor: 'rgba(255,255,255,0.16)', borderRadius: '6px' }}
                  itemStyle={{ color: '#FAFAFA' }}
                />
                <Area type="monotone" dataKey="count" stroke="#DC2626" fillOpacity={0.15} fill="#DC2626" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="mb-4">
            <h3 className="font-display font-medium text-base text-text tracking-tight">
              Laboratory distribution
            </h3>
            <p className="text-xs font-mono text-text-3">ACTIVE ARTIFACTS & ENTRIES</p>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={contentDistributionData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                  {contentDistributionData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={['#DC2626', '#FAFAFA', '#A1A1AA', '#4ADE80'][index % 4]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F0F10', borderColor: 'rgba(255,255,255,0.16)', borderRadius: '6px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
