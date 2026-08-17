import { Event } from '../lib/types';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onRegister: () => void;
}

const EventCard = ({ event, onRegister }: EventCardProps) => {
  return (
    <div className="h-full flex flex-col justify-between p-6 rounded-xl morphic-metallic-card transition-all duration-300 group">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-red-300 bg-red-950/60 border border-red-400/30 px-2.5 py-1 rounded shadow-[inset_0_1px_1px_rgba(254,202,202,0.2)]">
            {event.type}
          </span>
          <span className="text-[11px] text-[#94A3B8] font-mono flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-red-400" />
            {event.date}
          </span>
        </div>

        {event.image && (
          <div className="relative h-40 rounded-lg overflow-hidden mb-4 bg-black">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <h3 className="font-display font-bold text-lg text-white mb-2 leading-snug group-hover:text-metallic-red transition-all">
          {event.title}
        </h3>
        
        <p className="text-xs text-[#94A3B8] line-clamp-3 leading-relaxed mb-4">
          {event.description}
        </p>

        <div className="text-[11px] text-[#64748B] flex items-center gap-1.5 mb-6">
          <MapPin className="w-3.5 h-3.5 text-red-400/80 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>

      <button
        onClick={onRegister}
        className="w-full py-2.5 rounded-lg text-xs btn-metallic-red flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Register Pass</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default EventCard;
