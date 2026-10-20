import React from 'react';
import { Event } from '../lib/types';
import { MapPin } from 'lucide-react';
import StatusBadge from './ui/StatusBadge';
import { Button } from './ui/button';
import Detect from './ui/detect';
import { Tag } from './ui/badge';

interface EventRowProps {
  event: Event;
  onRegister?: () => void;
  isRegistered?: boolean;
}

export const EventRow: React.FC<EventRowProps> = ({
  event,
  onRegister,
  isRegistered = false,
}) => {
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
      as="div"
      className="group w-full py-4 sm:py-5 border-b border-hairline transition-colors duration-fast flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex items-start gap-4 sm:gap-6 min-w-0">
        {/* Date block (56px) */}
        <div className="shrink-0 w-14 text-left py-1">
          <div className="font-sans text-[12px] text-mute uppercase font-medium">
            {month}
          </div>
          <div className="font-mono text-[28px] font-light text-paper leading-tight tabular-nums">
            {day}
          </div>
        </div>

        {/* Content column */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-sans font-medium text-[18px] sm:text-[20px] text-paper tracking-[-0.01em] truncate">
              {event.title}
            </h3>
            {event.type && (
              <Tag size="dense">
                {event.type}
              </Tag>
            )}
            <StatusBadge status={event.status || (isPast ? 'Completed' : 'Upcoming')} />
          </div>

          <p className="text-[14px] text-text-2 line-clamp-1 mb-1.5">
            {event.description}
          </p>

          {event.location && (
            <div className="flex items-center gap-1.5 text-[13px] text-mute font-mono">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action button */}
      <div className="shrink-0 pt-2 md:pt-0">
        {isPast ? (
          <Button variant="secondary" size="sm" className="w-full md:w-auto">
            Recap
          </Button>
        ) : isRegistered ? (
          <Button variant="secondary" size="sm" success successText="Registered" className="w-full md:w-auto">
            Registered
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRegister?.();
            }}
            className="w-full md:w-auto"
          >
            Register
          </Button>
        )}
      </div>
    </Detect>
  );
};

export default EventRow;
