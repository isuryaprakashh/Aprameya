import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { User, CLUB_DOMAINS } from '@/lib/types';

export default function RosterView() {
  const [domainFilter, setDomainFilter] = useState('');

  const { data: allUsers = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/users`, { credentials: 'include' });
      return res.json();
    },
  });

  // Show CORE, ADMIN, and users with an assigned domain
  const members = allUsers.filter(u =>
    u.role === 'CORE' || u.role === 'ADMIN' || u.domain
  );

  const filtered = domainFilter
    ? members.filter(u => u.domain === domainFilter)
    : members;

  const exportCSV = () => {
    const header = 'Username,Email,Roll No.,Domain,Title,Role';
    const rows = filtered.map(u =>
      [u.username, u.email, u.rollNumber || '', u.domain || '', u.title || '', u.role].join(',')
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aprameya-roster.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Member roster</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">{filtered.length} members</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)] text-sm text-[var(--text-secondary)] hover:border-[hsl(var(--accent))]/30 hover:text-[hsl(var(--accent))] transition-colors"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Domain filter */}
      <select
        value={domainFilter}
        onChange={e => setDomainFilter(e.target.value)}
        className="px-3 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-sm focus:outline-none focus:border-[hsl(var(--accent))]/50 transition-colors"
      >
        <option value="">All domains</option>
        {CLUB_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <div className="rounded-xl border border-[var(--border-color)] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center font-mono text-xs text-[var(--text-muted)] animate-pulse">Loading roster...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-mono text-xs text-[var(--text-muted)]">STATUS: 204 NO_CONTENT</p>
            <p className="text-sm text-[var(--text-secondary)] mt-2">No members in this domain yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--card-bg)]">
                <th className="text-left px-4 py-3 font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">Member</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">Domain</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">Title</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-[var(--text-muted)] uppercase tracking-wider">Access</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} className={`border-b border-[var(--border-color)]/50 hover:bg-[hsl(var(--accent))]/3 transition-colors ${i === filtered.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.username}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{u.rollNumber || u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)] hidden md:table-cell">
                    {u.domain || <span className="text-[var(--text-muted)]">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--text-secondary)] hidden sm:table-cell">
                    {u.title || <span className="text-[var(--text-muted)]">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded-full border font-mono text-[10px] ${
                      u.role === 'ADMIN' ? 'text-red-400 border-red-400/30 bg-red-400/8' :
                      u.role === 'CORE' ? 'text-blue-400 border-blue-400/30 bg-blue-400/8' :
                      'text-[var(--text-muted)] border-[var(--border-color)]'
                    }`}>{u.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
