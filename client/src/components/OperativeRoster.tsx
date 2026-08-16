import { teamMembers } from '../lib/data';

const OperativeRoster = () => {
    return (
        <section className="max-w-7xl mx-auto w-full py-12">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

        /* --- MARQUEE COMPONENT STYLES --- */
        .marquee-container { 
            overflow: hidden; 
            position: relative; 
            width: 100%; 
            /* Fade edges mask */
            mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%); 
            -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
        }

        .marquee-track { 
            display: flex; 
            gap: 2rem; 
            width: max-content; 
            animation: scroll 40s linear infinite; 
        }

        .marquee-container:hover .marquee-track { 
            animation-play-state: paused; 
        }

        /* Moves track exactly 50% to the left to loop seamlessly (assuming duplicate set exists) */
        @keyframes scroll { 
            0% { transform: translateX(0); } 
            100% { transform: translateX(calc(-50% - 1rem)); } 
        }

        /* --- CARD STYLES --- */
        .operative-card { 
            width: 280px; 
            height: 380px; 
            background: rgba(255,255,255,0.02); 
            border: 1px solid rgba(255, 255, 255, 0.08); 
            border-radius: 12px; 
            overflow: hidden; 
            position: relative; 
            transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); 
            flex-shrink: 0; 
        }

        .operative-card:hover { 
            transform: translateY(-10px) scale(1.02); 
            border-color: #34d399; 
            background: rgba(52, 211, 153, 0.05); 
            box-shadow: 0 15px 40px -10px rgba(0,0,0,0.6); 
            z-index: 10; 
        }

        .operative-img-container { 
            height: 60%; 
            width: 100%; 
            position: relative; 
            overflow: hidden; 
        }

        .operative-img { 
            width: 100%; 
            height: 100%; 
            object-fit: cover; 
            filter: grayscale(100%) contrast(1.2); 
            transition: all 0.5s ease; 
        }

        .operative-card:hover .operative-img { 
            filter: grayscale(0%) contrast(1); 
        }

        /* Scanline effect over image */
        .operative-img-container::after { 
            content: ''; 
            position: absolute; 
            inset: 0; 
            background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 3px); 
            pointer-events: none; 
            opacity: 0.5; 
        }

        .operative-data { 
            padding: 1.5rem; 
            position: relative; 
        }

        .operative-status-dot { 
            width: 8px; 
            height: 8px; 
            background: #333; 
            border-radius: 50%; 
            position: absolute; 
            top: 1.5rem; 
            right: 1.5rem; 
            transition: background 0.3s; 
        }

        .operative-card:hover .operative-status-dot { 
            background: #34d399; 
            box-shadow: 0 0 10px #34d399; 
        }
      `}</style>

            {/* Section Header */}
            <div className="flex items-center gap-4 mb-8 px-4">
                <span className="w-6 h-6 rounded-full bg-white/10 text-[10px] flex items-center justify-center font-mono text-white">04</span>
                <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Operative Roster (Stream)</h2>
            </div>

            {/* Marquee Component */}
            <div className="marquee-container relative">
                <div className="marquee-track">
                    {/* Original Set */}
                    {teamMembers.map((member) => (
                        <div key={member.id} className="operative-card">
                            <div className="operative-img-container">
                                <img src={member.image} className="operative-img" alt={member.name} />
                            </div>
                            <div className="operative-data">
                                <div className="operative-status-dot"></div>
                                <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-tighter">{member.name.split(' ').slice(-1)[0]}_{member.name.split(' ')[0].charAt(0)}</h3>
                                <p className="text-xs text-emerald-500 font-mono mb-4 uppercase">{member.role.replace(' ', '_')}</p>
                                <div className="space-y-2 border-t border-white/10 pt-4">
                                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                                        <span>DEPARTMENT</span>
                                        <span className="text-white uppercase truncate max-w-[100px]">{member.department}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                                        <span>YEAR</span>
                                        <span className="text-white uppercase">{member.year}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Duplicate Set for Loop */}
                    {teamMembers.map((member) => (
                        <div key={`dup-${member.id}`} className="operative-card">
                            <div className="operative-img-container">
                                <img src={member.image} className="operative-img" alt={member.name} />
                            </div>
                            <div className="operative-data">
                                <div className="operative-status-dot"></div>
                                <h3 className="text-lg font-bold text-white mb-1 uppercase tracking-tighter">{member.name.split(' ').slice(-1)[0]}_{member.name.split(' ')[0].charAt(0)}</h3>
                                <p className="text-xs text-emerald-500 font-mono mb-4 uppercase">{member.role.replace(' ', '_')}</p>
                                <div className="space-y-2 border-t border-white/10 pt-4">
                                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                                        <span>DEPARTMENT</span>
                                        <span className="text-white uppercase truncate max-w-[100px]">{member.department}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                                        <span>YEAR</span>
                                        <span className="text-white uppercase">{member.year}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OperativeRoster;