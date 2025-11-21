import React from 'react';

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
                    <div className="operative-card">
                        <div className="operative-img-container"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop" className="operative-img" alt="Alex Kai" /></div>
                        <div className="operative-data"><div className="operative-status-dot"></div><h3 className="text-lg font-bold text-white mb-1">ALEX_KAI</h3><p className="text-xs text-emerald-500 font-mono mb-4">LEAD_ARCHITECT</p><div className="space-y-2 border-t border-white/10 pt-4"><div className="flex justify-between text-[10px] text-gray-500 font-mono"><span>CLEARANCE</span><span className="text-white">L5</span></div></div></div>
                    </div>
                    <div className="operative-card">
                        <div className="operative-img-container"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop" className="operative-img" alt="Sarah Jin" /></div>
                        <div className="operative-data"><div className="operative-status-dot"></div><h3 className="text-lg font-bold text-white mb-1">SARAH_JIN</h3><p className="text-xs text-emerald-500 font-mono mb-4">NEURAL_OPS</p><div className="space-y-2 border-t border-white/10 pt-4"><div className="flex justify-between text-[10px] text-gray-500 font-mono"><span>CLEARANCE</span><span className="text-white">L4</span></div></div></div>
                    </div>
                    <div className="operative-card">
                        <div className="operative-img-container"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop" className="operative-img" alt="Marcus V" /></div>
                        <div className="operative-data"><div className="operative-status-dot"></div><h3 className="text-lg font-bold text-white mb-1">MARCUS_V</h3><p className="text-xs text-emerald-500 font-mono mb-4">SYS_SECURITY</p><div className="space-y-2 border-t border-white/10 pt-4"><div className="flex justify-between text-[10px] text-gray-500 font-mono"><span>CLEARANCE</span><span className="text-white">L5</span></div></div></div>
                    </div>
                    <div className="operative-card">
                        <div className="operative-img-container"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop" className="operative-img" alt="Elena R" /></div>
                        <div className="operative-data"><div className="operative-status-dot"></div><h3 className="text-lg font-bold text-white mb-1">ELENA_R</h3><p className="text-xs text-emerald-500 font-mono mb-4">DATA_SCIENCE</p><div className="space-y-2 border-t border-white/10 pt-4"><div className="flex justify-between text-[10px] text-gray-500 font-mono"><span>CLEARANCE</span><span className="text-white">L3</span></div></div></div>
                    </div>

                    {/* Duplicate Set (Required for seamless loop) */}
                    <div className="operative-card">
                        <div className="operative-img-container"><img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop" className="operative-img" alt="Alex Kai" /></div>
                        <div className="operative-data"><div className="operative-status-dot"></div><h3 className="text-lg font-bold text-white mb-1">ALEX_KAI</h3><p className="text-xs text-emerald-500 font-mono mb-4">LEAD_ARCHITECT</p><div className="space-y-2 border-t border-white/10 pt-4"><div className="flex justify-between text-[10px] text-gray-500 font-mono"><span>CLEARANCE</span><span className="text-white">L5</span></div></div></div>
                    </div>
                    <div className="operative-card">
                        <div className="operative-img-container"><img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop" className="operative-img" alt="Sarah Jin" /></div>
                        <div className="operative-data"><div className="operative-status-dot"></div><h3 className="text-lg font-bold text-white mb-1">SARAH_JIN</h3><p className="text-xs text-emerald-500 font-mono mb-4">NEURAL_OPS</p><div className="space-y-2 border-t border-white/10 pt-4"><div className="flex justify-between text-[10px] text-gray-500 font-mono"><span>CLEARANCE</span><span className="text-white">L4</span></div></div></div>
                    </div>
                    <div className="operative-card">
                        <div className="operative-img-container"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop" className="operative-img" alt="Marcus V" /></div>
                        <div className="operative-data"><div className="operative-status-dot"></div><h3 className="text-lg font-bold text-white mb-1">MARCUS_V</h3><p className="text-xs text-emerald-500 font-mono mb-4">SYS_SECURITY</p><div className="space-y-2 border-t border-white/10 pt-4"><div className="flex justify-between text-[10px] text-gray-500 font-mono"><span>CLEARANCE</span><span className="text-white">L5</span></div></div></div>
                    </div>
                    <div className="operative-card">
                        <div className="operative-img-container"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop" className="operative-img" alt="Elena R" /></div>
                        <div className="operative-data"><div className="operative-status-dot"></div><h3 className="text-lg font-bold text-white mb-1">ELENA_R</h3><p className="text-xs text-emerald-500 font-mono mb-4">DATA_SCIENCE</p><div className="space-y-2 border-t border-white/10 pt-4"><div className="flex justify-between text-[10px] text-gray-500 font-mono"><span>CLEARANCE</span><span className="text-white">L3</span></div></div></div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default OperativeRoster;
