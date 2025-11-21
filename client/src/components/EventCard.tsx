import { useState } from 'react';
import { Event } from '../lib/types';
import { Zap, Music, CreditCard, MessageSquare, Database, Calendar } from 'lucide-react';

interface EventCardProps {
  event: Event;
  onRegisterInterest: (event: Event) => void;
}

const EventCard = ({ event, onRegisterInterest }: EventCardProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [buttonText, setButtonText] = useState("Initialize Connection");

  const handleConnect = () => {
    if (!isConnected) {
      setButtonText("Establishing Uplink...");

      setTimeout(() => {
        setIsConnected(true);
        setButtonText("Connection Secure");
        onRegisterInterest(event);
      }, 1500);
    } else {
      setIsConnected(false);
      setButtonText("Initialize Connection");
    }
  };

  return (
    <div className="clean-card p-8 flex flex-col justify-between h-full">
      <div className="shimmer pointer-events-none"></div>

      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-white">{event.type}</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-1 rounded">
            {event.date}
          </span>
        </div>

        {/* Orbit System */}
        <div className="orbit-system mb-8">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center z-20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <Zap className="w-5 h-5 text-black fill-current" />
          </div>

          <div className={`orbit-node w-10 h-10 rounded-full flex items-center justify-center top-[10%] left-[20%] hover:text-white hover:border-white/50 bg-[#0a0a0a] ${isConnected ? 'docked' : ''}`}>
            <Music className="w-4 h-4" />
          </div>
          <div className={`orbit-node w-10 h-10 rounded-full flex items-center justify-center top-[20%] right-[10%] hover:text-white hover:border-white/50 bg-[#0a0a0a] ${isConnected ? 'docked' : ''}`}>
            <CreditCard className="w-4 h-4" />
          </div>
          <div className={`orbit-node w-10 h-10 rounded-full flex items-center justify-center bottom-[20%] left-[15%] hover:text-white hover:border-white/50 bg-[#0a0a0a] ${isConnected ? 'docked' : ''}`}>
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className={`orbit-node w-10 h-10 rounded-full flex items-center justify-center bottom-[10%] right-[25%] hover:text-white hover:border-white/50 bg-[#0a0a0a] ${isConnected ? 'docked' : ''}`}>
            <Database className="w-4 h-4" />
          </div>
        </div>

        <h3 className="text-lg font-medium text-white text-center mb-2">{event.title}</h3>
        <p className="text-xs text-gray-500 text-center mb-8 max-w-xs mx-auto line-clamp-3">
          {event.description}
        </p>
      </div>

      <button
        onClick={handleConnect}
        className={`w-full py-3 text-sm font-medium transition-all duration-300 rounded-lg ${isConnected
            ? 'bg-emerald-400 text-black border-emerald-400'
            : 'btn-secondary'
          }`}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default EventCard;
