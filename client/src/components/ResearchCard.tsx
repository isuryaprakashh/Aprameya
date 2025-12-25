import { ResearchItem } from '@/lib/types';


interface ResearchCardProps {
    item: ResearchItem;
    onReadMore?: () => void;
}

const ResearchCard = ({ item, onReadMore }: ResearchCardProps) => {
    // Radius tokens (geometry-correct)
    const R_CARD = "rounded-[22px]";          // outer container
    const R_IMAGE = "rounded-[14px]";         // 22 - 8 = 14 → correct curve

    // Using CSS variables to map to user's requested logic
    return (
        <div className={`w-full ${R_CARD} bg-[var(--card-bg)] shadow-md p-2 transition-colors border border-[var(--border-color)]`}>
            <div className={`relative ${R_IMAGE} overflow-hidden h-[200px]`}>
                <img
                    src={item.image}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    alt={item.title}
                />
            </div>

            <div className="px-1 pt-3 pb-2">
                <p className="text-sm font-semibold text-[var(--text-primary)]">Research Paper</p>
                <p className="text-xs mt-1 text-[var(--text-secondary)] line-clamp-2" title={item.description}>
                    {item.title} - {item.description}
                </p>

                <div className="mt-3 flex justify-between items-center">
                    {/* <div className="text-center">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{item.date}</p>
                        <p className="text-xs text-[var(--text-secondary)] uppercase font-mono tracking-wider">Year</p>
                    </div> */}
                    <button
                        className="px-4 py-1.5 rounded-full text-sm bg-[var(--text-primary)] text-[var(--bg-body)] hover:opacity-90 transition-opacity"
                        onClick={onReadMore}
                    >
                        Read Paper
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResearchCard;
