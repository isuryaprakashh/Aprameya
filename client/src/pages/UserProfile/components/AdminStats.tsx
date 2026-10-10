
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaChartLine, FaUsers, FaProjectDiagram, FaFlask, FaClipboardList } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { User, Project, ResearchItem } from '@/lib/types';

interface AdminStatsProps {
    users: User[];
    projects: Project[];
    research: ResearchItem[];
    eventRegistrations: { totalRegistrations: number };
    events: any[]; // Or Event[]
    blogs: any[]; // Or BlogPost[]
    userGrowthData: any[];
    contentDistributionData: any[];
}

export const AdminStats = ({
    users, projects, research, eventRegistrations,
    userGrowthData, contentDistributionData
}: AdminStatsProps) => {

    const stats = [
        { label: "Total Users", value: users.length, icon: FaUsers, color: "text-blue-500" },
        { label: "Total Projects", value: projects.length, icon: FaProjectDiagram, color: "text-emerald-500" },
        { label: "Research Items", value: research.length, icon: FaFlask, color: "text-violet-500" },
        { label: "Registrations", value: eventRegistrations.totalRegistrations, icon: FaClipboardList, color: "text-amber-500" },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="bg-[var(--card-bg)] border-[var(--border-color)] overflow-hidden relative group hover:border-[hsl(var(--accent))]/50 transition-colors duration-300">
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${stat.color.replace('text-', 'bg-')}`} />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">{stat.label}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-[var(--card-bg)] border-[var(--border-color)]">
                    <CardHeader>
                        <CardTitle className="text-[var(--text-primary)] flex items-center gap-2">
                            <FaChartLine className="text-[hsl(var(--accent))]" /> User Growth
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={userGrowthData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" opacity={0.3} />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} itemStyle={{ color: 'hsl(var(--accent))' }} />
                                <Area type="monotone" dataKey="count" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="bg-[var(--card-bg)] border-[var(--border-color)]">
                    <CardHeader>
                        <CardTitle className="text-[var(--text-primary)]">Content Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={contentDistributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {contentDistributionData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
