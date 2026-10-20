import React from 'react';
import { Event } from '../lib/types';
import { MapPin } from 'lucide-react';
import StatusBadge from './ui/StatusBadge';
import { Button } from './ui/button';
import Detect from './ui/detect';
import { Tag } from './ui/badge';

interface EventCardProps {
  event: Event;
  onRegister?: () => void;
  isRegistered?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onRegister, isRegistered = false }) => {
  const rawDate = event.date || '';
  const dateObj = new Date(rawDate);
  const isValidDate = !isNaN(dateObj.getTime());

  const month = isValidDate
    ? dateObj.toLocaleDateString('en-US', { month: 'short' })
    : 'Upcoming';
  const day = isValidDate ? String(dateObj.getDate()).padStart(2, '0') : '—';
  const isPast = event.status?.toLowerCase() === 'past' || (isValidDate && dateObj.getTime() < Date.now());

  return (
    <Detect
      label="event"
      id={event.id || event._id || event.title}
      as="article"
      className="group flex flex-col justify-between w-full rounded-[var(--r-3)] border border-hairline p-5 sm:p-6 bg-transparent text-left transition-colors duration-fast"
    >
      <div>
        {/* Header row: Status + Type */}
        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={event.status || 'Upcoming'} />
          {event.type && (
            <Tag size="dense">
              {event.type}
            </Tag>
          )}
        </div>

        {/* 16:10 Image if available */}
        {event.image && (
          <div className="relative w-full aspect-[16/10] rounded-[var(--r-2)] overflow-hidden bg-surface-2 border border-hairline mb-4">
            <img
              src={event.image}
              alt={event.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-slow ease-out group-hover:scale-[1.02]"
            />
          </div>
        )}

        {/* Date block + Title */}
        <div className="flex items-start gap-4 mb-3">
          <div className="shrink-0 w-12 text-center py-1 px-1 rounded-[var(--r-1)] border border-hairline bg-surface-1">
            <div className="font-sans text-[11px] uppercase text-mute font-medium">
              {month}
            </div>
            <div className="font-mono text-[20px] font-light text-paper leading-none mt-1 tabular-nums">
              {day}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-sans font-medium text-[17px] text-paper tracking-[-0.01em] line-clamp-2 leading-snug">
              {event.title}
            </h3>
            {event.location && (
              <div className="flex items-center gap-1.5 mt-1.5 text-[12px] text-mute font-mono truncate">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-[14px] text-text-2 line-clamp-2 leading-relaxed mb-6">
          {event.description}
        </p>
      </div>

      {/* Button */}
      {isPast ? (
        <Button variant="secondary" size="md" className="w-full">
          View recap
        </Button>
      ) : isRegistered ? (
        <Button variant="secondary" size="md" success successText="Registered" className="w-full">
          Registered
        </Button>
      ) : (
        <Button variant="secondary" size="md" onClick={onRegister} className="w-full">
          Register
        </Button>
      )}
    </Detect>
  );
};

export default EventCard;
