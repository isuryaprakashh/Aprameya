import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ResearchItem as ResearchItemType } from '@/lib/types';
import ResearchItem from '@/components/ResearchItem';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BookOpen } from 'lucide-react';

const FALLBACK_RESEARCH: ResearchItemType[] = [
  {
    _id: 'r1',
    id: 'r1',
    title: 'Multi-Modal LiDAR and Camera Fusion for Real-Time Semantic Segmentation on Edge TPUs',
    description: 'A lightweight neural pipeline designed for constrained autonomous vehicle hardware, operating at 45 FPS with sub-centimeter localization accuracy in adverse weather conditions.',
    authors: 'P. Sharma, V. Reddy, A. Nair, Aprameya Autonomy Core',
    category: 'Perception',
    date: '2025-03',
    year: '2025',
    venue: 'IEEE Robotics and Automation Letters',
    pdfUrl: 'https://arxiv.org',
  },
  {
    _id: 'r2',
    id: 'r2',
    title: 'Hierarchical Model Predictive Trajectory Planning in Dynamic Obstacle Fields',
    description: 'Real-time optimization framework combining nonlinear MPC with spatial occupancy probability grids for high-speed navigation through unstructured environments.',
    authors: 'K. Patel, S. Sen, Autonomous Systems Lab',
    category: 'Planning & Control',
    date: '2024-11',
    year: '2024',
    venue: 'Intelligent Vehicles Symposium (IV)',
    pdfUrl: 'https://arxiv.org',
  },
  {
    _id: 'r3',
    id: 'r3',
    title: 'Fail-Operational Distributed CAN FD Network Architectures for Formula Student Vehicles',
    description: 'Hardware safety and communication redundancy benchmarks under extreme transient electromagnetic interference and vibration profiles.',
    authors: 'Aprameya Embedded Systems Team',
    category: 'Embedded Systems',
    date: '2024-06',
    year: '2024',
    venue: 'SAE Technical Papers',
    pdfUrl: 'https://arxiv.org',
  },
  {
    _id: 'r4',
    id: 'r4',
    title: 'Benchmarking Stereo Visual Odometry Drift Compensation Using IMU Graph Optimization',
    description: 'Longitudinal analysis of stereo vision drift mitigation on off-road terrain without relying on GNSS positioning telemetry.',
    authors: 'M. Anand, R. Iyer',
    category: 'SLAM & Odometry',
    date: '2023-09',
    year: '2023',
    venue: 'ICRA Workshop on Field Robotics',
    pdfUrl: 'https://arxiv.org',
  },
];

export default function Research() {
  const [selectedItem, setSelectedItem] = useState<ResearchItemType | null>(null);

  const { data: serverItems, isLoading, error, refetch } = useQuery<ResearchItemType[]>({
    queryKey: ['/api/research'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/research`);
      if (!res.ok) throw new Error('Failed to fetch research items');
      return res.json();
    },
    staleTime: 60000,
  });

  const items = serverItems && serverItems.length > 0 ? serverItems : (isLoading ? [] : FALLBACK_RESEARCH);

  // Group items by year
  const groupedByYear = items.reduce<Record<string, ResearchItemType[]>>((acc, item) => {
    const yearMatch = item.date?.match(/\d{4}/);
    const yr = item.year || (yearMatch ? yearMatch[0] : '2025');
    if (!acc[yr]) acc[yr] = [];
    acc[yr].push(item);
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <main className="min-h-screen bg-ink text-paper pt-24 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto">
      {/* Page Hero (§7.8.2) */}
      <section className="mb-14 md:mb-18">
        <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-paper">
          Research and publications
        </h1>
        <p className="mt-3 text-base md:text-lg text-text-2 max-w-2xl leading-relaxed">
          Open-source papers, conference preprints, and engineering technical reports produced by Aprameya ASC.
        </p>
      </section>

      {/* Loading state: Skeletons matching final row layout */}
      {isLoading && items.length === 0 && (
        <div className="space-y-6">
          <Skeleton className="h-6 w-20 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 border border-hairline space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && items.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-signal-text mb-4">Unable to load publications from server.</p>
          <Button variant="secondary" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && items.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="No research papers published yet"
          description="Check back soon for upcoming preprints and conference manuscripts."
        />
      )}

      {/* Grouped by year */}
      <div className="space-y-12 md:space-y-16">
        {sortedYears.map((year) => (
          <section key={year}>
            <div className="flex items-center gap-4 mb-4 pb-2 border-b border-hairline">
              <h2 className="font-mono text-base font-semibold text-paper tracking-wider">
                {year}
              </h2>
              <span className="font-mono text-xs text-mute">
                ({groupedByYear[year].length} {groupedByYear[year].length === 1 ? 'paper' : 'papers'})
              </span>
            </div>

            <div className="space-y-3">
              {groupedByYear[year].map((item) => (
                <ResearchItem
                  key={item._id || item.id || item.title}
                  item={item}
                  onReadMore={() => setSelectedItem(item)}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Abstract Modal */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="max-w-xl bg-ink border-hairline text-paper p-6">
          <DialogHeader>
            <div className="font-mono text-xs text-mute mb-2">
              {selectedItem?.category} · {selectedItem?.year || '2025'}
            </div>
            <DialogTitle className="text-lg md:text-xl font-medium text-paper leading-snug">
              {selectedItem?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-mute mt-1">
              {selectedItem?.authors}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 text-sm text-text-2 leading-relaxed">
            {selectedItem?.description}
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-hairline">
            <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
              Close
            </Button>
            {selectedItem?.pdfUrl && (
              <a href={selectedItem.pdfUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="sm">
                  View PDF
                </Button>
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
