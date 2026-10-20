import React from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { TicketRegistration } from '@/lib/types';
import { Ticket as TicketIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '@/components/EmptyState';
import TicketPass from '@/components/TicketPass';

export default function MyTickets() {
  const { user } = useAuth();

  const { data: tickets = [], isLoading } = useQuery<TicketRegistration[]>({
    queryKey: ['/api/tickets/my'],
    enabled: !!user,
  });

  if (!user) {
    return (
      <main className="min-h-screen bg-ink text-paper flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-hairline p-8 text-center bg-surface-1">
          <TicketIcon className="size-10 text-signal mx-auto mb-4" />
          <h1 className="text-xl font-medium text-paper mb-2">Sign in required</h1>
          <p className="text-sm text-text-2 mb-6">
            Please sign in with your college account to view your registered event passes.
          </p>
          <Link href="/login">
            <Button variant="primary" size="md" className="w-full">
              Sign in to portal
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink text-paper pt-28 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto">
      {/* Page Hero */}
      <section className="mb-10 md:mb-14">
        <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-paper">
          My event passes
        </h1>
        <p className="mt-3 text-base md:text-lg text-text-2 max-w-2xl leading-relaxed">
          Your registered access credentials for upcoming Aprameya workshops and technical symposiums.
        </p>
      </section>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="border border-hairline p-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && tickets.length === 0 && (
        <EmptyState
          icon={TicketIcon}
          title="You haven't registered for anything yet"
          description="Browse upcoming club workshops, guest lectures, and hackathons."
          action={{
            label: 'Browse events',
            onClick: () => {
              window.location.href = '/events';
            },
          }}
        />
      )}

      {/* Passes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tickets.map((ticket) => (
          <TicketPass
            key={ticket.id || ticket._id}
            ticket={ticket}
          />
        ))}
      </div>
    </main>
  );
}
