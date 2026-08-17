import { ResearchItem } from '@/lib/types';

interface ResearchCardProps {
    item: ResearchItem;
    onReadMore?: () => void;
}

const ResearchCard = ({ item, onReadMore }: ResearchCardProps) => {
    return (
        <div className="w-full rounded-xl morphic-metallic-card p-2 transition-all duration-300 group">
            <div className="relative rounded-lg overflow-hidden h-[200px] bg-black">
                <img
                    src={item.image}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={item.title}
                />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-sans font-bold uppercase tracking-wider text-metallic-green bg-emerald-950/70 border border-emerald-400/30 px-2.5 py-0.5 rounded shadow-[inset_0_1px_1px_rgba(167,243,208,0.2)]">
                    Publication
                </span>
            </div>

            <div className="p-4">
                <h3 className="text-base font-bold font-display text-white group-hover:text-metallic-green transition-colors">
                    {item.title}
                </h3>
                <p className="text-xs mt-1.5 text-[#94A3B8] line-clamp-2 leading-relaxed" title={item.description}>
                    {item.description}
                </p>

                <div className="mt-4 pt-3 border-t border-emerald-500/15 flex justify-between items-center">
                    <span className="text-[11px] text-[#64748B] font-mono">{item.date || 'Peer Review'}</span>
                    <button
                        className="px-3.5 py-1.5 rounded-lg text-xs btn-metallic-green cursor-pointer"
                        onClick={onReadMore}
                    >
                        Read Abstract
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResearchCard;
