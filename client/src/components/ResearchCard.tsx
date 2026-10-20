import { ResearchItem } from '@/lib/types';
import ChamferedButton from '@/components/ui/ChamferedButton';

interface ResearchCardProps {
    item: ResearchItem;
    onReadMore?: () => void;
}

const ResearchCard = ({ item, onReadMore }: ResearchCardProps) => {
    return (
        <div className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--border-strong)] transition-colors flex flex-col h-full group">
            <div className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-2)]">
                {item.image ? (
                    <img
                        src={item.image}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={item.title}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[var(--text-3)]">
                        PUBLICATION
                    </div>
                )}
                <span className="absolute top-3 left-3 text-[11px] font-mono uppercase tracking-wider text-[var(--red)] bg-[var(--red-soft)] border border-[var(--red-line)] px-2.5 py-0.5 rounded-full">
                    {item.category || 'Publication'}
                </span>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-base font-medium font-display text-[var(--text)] group-hover:text-[var(--red)] transition-colors">
                    {item.title}
                </h3>
                <p className="text-xs mt-2 text-[var(--text-2)] line-clamp-2 leading-relaxed flex-1" title={item.description}>
                    {item.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-between items-center">
                    <span className="text-[11px] text-[var(--text-3)] font-mono">{item.date || 'Peer Review'}</span>
                    <ChamferedButton
                        variant="secondary"
                        size="sm"
                        onClick={onReadMore}
                    >
                        Read Abstract
                    </ChamferedButton>
                </div>
            </div>
        </div>
    );
};

export default ResearchCard;
