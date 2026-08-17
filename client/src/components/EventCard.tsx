import { Event } from '../lib/types';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onRegister: () => void;
}

const EventCard = ({ event, onRegister }: EventCardProps) => {
  return (
    <div className="h-full flex flex-col justify-between p-6 rounded-xl border border-emerald-500/15 bg-[#0B130E] hover:border-emerald-400/35 hover:bg-[#0E1A13] transition-all duration-300 shadow-lg shadow-black/20 group">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded">
            {event.type}
          </span>
          <span className="text-[11px] text-[#94A3B8] font-mono flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400/80" />
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

        <h3 className="font-display font-bold text-lg text-white mb-2 leading-snug">
          {event.title}
        </h3>
        
        <p className="text-xs text-[#94A3B8] line-clamp-3 leading-relaxed mb-4">
          {event.description}
        </p>

        <div className="text-[11px] text-[#64748B] flex items-center gap-1.5 mb-6">
          <MapPin className="w-3.5 h-3.5 text-emerald-400/70 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>

      <button
        onClick={onRegister}
        className="w-full py-2.5 rounded-lg font-medium text-xs bg-gradient-to-b from-[#2A723E] to-[#1C512A] border border-[#4ADE80]/30 text-white hover:from-[#32874A] hover:to-[#226334] shadow-md shadow-[#1C512A]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Register Pass</span>
        <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
      </button>
    </div>
  );
};

export default EventCard;
