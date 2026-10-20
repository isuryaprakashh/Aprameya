import { Users, FolderGit2, BookOpen, ClipboardList, TrendingUp, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { User, Project, ResearchItem } from '@/lib/types';

interface AdminStatsProps {
  users: User[];
  projects: Project[];
  research: ResearchItem[];
  eventRegistrations: { totalRegistrations: number };
  events: any[];
  blogs: any[];
  userGrowthData: { name: string; count: number }[];
  contentDistributionData: { name: string; value: number; color?: string }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Projects: '#E8261E',
  Events: '#10B981',
  Research: '#38BDF8',
  Blogs: '#F59E0B',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-hairline-2 bg-surface-2/95 backdrop-blur-md px-3 py-2 shadow-float text-left">
        <p className="font-mono text-[11px] text-mute uppercase tracking-wider">{label}</p>
        <p className="font-sans font-medium text-sm text-paper flex items-center gap-1.5 mt-0.5">
          <span className="w-2 h-2 rounded-full bg-signal shrink-0" />
          <span>{payload[0].value} {payload[0].value === 1 ? 'registration' : 'registrations'}</span>
        </p>
      </div>
    );
  }
  return null;
};

const DonutTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-lg border border-hairline-2 bg-surface-2/95 backdrop-blur-md px-3 py-2 shadow-float text-left">
        <p className="font-mono text-[11px] text-mute uppercase tracking-wider">{data.name}</p>
        <p className="font-sans font-medium text-sm text-paper flex items-center gap-1.5 mt-0.5">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: data.payload.color || CATEGORY_COLORS[data.name] || '#E8261E' }} />
          <span>{data.value} {data.value === 1 ? 'entry' : 'entries'}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const AdminStats = ({
  users,
  projects,
  research,
  eventRegistrations,
  events,
  blogs,
  userGrowthData,
}: AdminStatsProps) => {
  const stats = [
    { label: "REGISTERED USERS", value: users.length, icon: Users, accent: "text-signal" },
    { label: "LAB REPOSITORIES", value: projects.length, icon: FolderGit2, accent: "text-ok" },
    { label: "RESEARCH ARTICLES", value: research.length, icon: BookOpen, accent: "text-sky-400" },
    { label: "EVENT REGISTRATIONS", value: eventRegistrations.totalRegistrations, icon: ClipboardList, accent: "text-amber-400" },
  ];

  const distribution = [
    { name: 'Projects', value: projects.length, color: CATEGORY_COLORS.Projects },
    { name: 'Events', value: events.length, color: CATEGORY_COLORS.Events },
    { name: 'Research', value: research.length, color: CATEGORY_COLORS.Research },
    { name: 'Blogs', value: blogs.length, color: CATEGORY_COLORS.Blogs },
  ];

  const totalArtifacts = distribution.reduce((sum, item) => sum + item.value, 0);

  // If all are 0, provide placeholder non-empty dataset for visual preview
  const chartData = totalArtifacts === 0
    ? distribution.map(d => ({ ...d, value: 1 }))
    : distribution;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="rounded-xl border border-hairline bg-surface-1 p-5 hover:border-hairline-2 transition-all duration-fast text-left group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[11px] text-mute uppercase tracking-[0.06em]">
                {stat.label}
              </span>
              <div className="p-2 rounded-lg bg-surface-2 border border-hairline group-hover:border-hairline-2 transition-colors">
                <stat.icon className={`w-4 h-4 ${stat.accent}`} />
              </div>
            </div>
            <div className="font-mono text-3xl font-light text-paper tracking-tight tabular-nums">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Modernized Chart Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User Growth Telemetry */}
        <div className="lg:col-span-7 rounded-xl border border-hairline bg-surface-1 p-6 text-left flex flex-col justify-between">
          <div className="flex items-start justify-between mb-6 pb-3 border-b border-hairline">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-signal" />
                <h3 className="font-sans font-medium text-base text-paper tracking-tight">
                  User growth telemetry
                </h3>
              </div>
              <p className="text-[11px] font-mono text-mute uppercase tracking-wider">
                Monthly portal registrations
              </p>
            </div>
            <span className="font-mono text-xs text-mute px-2 py-0.5 rounded border border-hairline bg-surface-2">
              {users.length} Total Users
            </span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E8261E" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#E8261E" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tick={{ fill: 'currentColor' }}
                  className="text-mute font-mono"
                />
                <YAxis
                  stroke="#71717A"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  tick={{ fill: 'currentColor' }}
                  className="text-mute font-mono"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#E8261E"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#userGrowthGradient)"
                  activeDot={{ r: 5, fill: '#E8261E', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Laboratory Distribution */}
        <div className="lg:col-span-5 rounded-xl border border-hairline bg-surface-1 p-6 text-left flex flex-col justify-between">
          <div className="flex items-start justify-between mb-4 pb-3 border-b border-hairline">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PieIcon className="w-4 h-4 text-ok" />
                <h3 className="font-sans font-medium text-base text-paper tracking-tight">
                  Laboratory distribution
                </h3>
              </div>
              <p className="text-[11px] font-mono text-mute uppercase tracking-wider">
                Active artifacts & entries
              </p>
            </div>
            <span className="font-mono text-xs text-mute px-2 py-0.5 rounded border border-hairline bg-surface-2">
              {totalArtifacts} Total
            </span>
          </div>

          <div className="relative h-[200px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={78}
                  paddingAngle={totalArtifacts > 0 ? 3 : 0}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={totalArtifacts === 0 ? 'rgba(255,255,255,0.1)' : entry.color}
                    />
                  ))}
                </Pie>
                {totalArtifacts > 0 && <Tooltip content={<DonutTooltip />} />}
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Donut Metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-2xl font-light text-paper leading-none">
                {totalArtifacts}
              </span>
              <span className="font-mono text-[10px] text-mute uppercase tracking-wider mt-1">
                Items
              </span>
            </div>
          </div>

          {/* Breakdown Pills */}
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-hairline">
            {distribution.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-2 rounded-lg bg-surface-2/60 border border-hairline"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-sans text-xs text-text-2">{item.name}</span>
                </div>
                <span className="font-mono text-xs font-medium text-paper">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
