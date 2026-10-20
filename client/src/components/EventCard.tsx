import { Event } from '../lib/types';
import { MapPin, ArrowRight } from 'lucide-react';
import StatusBadge from './ui/StatusBadge';

interface EventCardProps {
  event: Event;
  onRegister: () => void;
}

const EventCard = ({ event, onRegister }: EventCardProps) => {
  // Format date parts if parseable
  const rawDate = event.date || '';
  const dateObj = new Date(rawDate);
  const isValidDate = !isNaN(dateObj.getTime());

  const month = isValidDate
    ? dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
    : 'UPCOMING';
  const day = isValidDate ? dateObj.getDate() : '—';

  return (
    <div className="flex flex-col justify-between w-full rounded-lg border border-border p-6 transition-colors duration-fast hover:border-border-strong hover:bg-surface group bg-transparent">
      <div>
        {/* Header row: Status + Type */}
        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={event.status || 'Upcoming'} />
          <span className="font-mono text-xs uppercase tracking-[0.06em] text-text-3">
            {event.type || 'Event'}
          </span>
        </div>

        {/* 16:10 Image if available */}
        {event.image && (
          <div className="relative w-full aspect-[16/10] rounded-md overflow-hidden bg-surface-2 border border-border mb-4">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-opacity duration-fast"
            />
          </div>
        )}

        {/* Date block + Title */}
        <div className="flex items-start gap-4 mb-3">
          <div className="shrink-0 w-12 text-center py-1.5 px-1 rounded border border-border bg-surface-2">
            <div className="font-mono text-[10px] uppercase tracking-wider text-text-3 font-semibold">
              {month}
            </div>
            <div className="font-display font-medium text-lg text-text leading-none mt-0.5">
              {day}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-medium text-base text-text tracking-tight group-hover:text-text transition-colors line-clamp-2">
              {event.title}
            </h3>
            {event.location && (
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-text-3 font-mono truncate">
                <MapPin className="w-3.5 h-3.5 text-text-3 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-text-2 line-clamp-2 leading-relaxed mb-6">
          {event.description}
        </p>
      </div>

      {/* Button: secondary button or text with arrow */}
      <button
        onClick={onRegister}
        className="w-full h-10 px-4 rounded-md border border-border-strong text-text hover:bg-surface-2 transition-colors duration-fast flex items-center justify-center gap-2 font-body text-sm font-medium cursor-pointer"
      >
        <span>Register</span>
        <ArrowRight className="w-4 h-4 text-text-2 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};

export default EventCard;
