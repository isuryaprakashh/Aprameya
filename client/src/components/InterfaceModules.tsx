import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Moon, Layers, Zap, Music, CreditCard, MessageSquare, Database, ShieldCheck, Lock, Copy } from 'lucide-react';

export const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3;
    const images = [
        "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1501854140884-074bf6b243e7?q=80&w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop"
    ];

    const moveSlide = (direction: number) => {
        setCurrentSlide((prev) => (prev + direction + totalSlides) % totalSlides);
    };

    return (
        <div className="clean-card group">
            <div className="relative h-[320px] w-full overflow-hidden">
                <div className="slide-track h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {images.map((img, i) => (
                        <div key={i} className="slide-item">
                            <img src={img} className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-700" alt={`Slide ${i + 1}`} />
                        </div>
                    ))}
                </div>
                <div className="absolute bottom-6 right-6 flex gap-2 z-20">
                    <button onClick={() => moveSlide(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--card-bg)]/20 backdrop-blur-md border border-[var(--border-color)] hover:bg-[var(--card-bg)]/40 text-[var(--text-primary)] transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveSlide(1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--card-bg)]/20 backdrop-blur-md border border-[var(--border-color)] hover:bg-[var(--card-bg)]/40 text-[var(--text-primary)] transition-all">
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="absolute top-6 left-6 z-20">
                    <span className="px-3 py-1 rounded-full bg-[var(--bg-body)]/50 backdrop-blur-md border border-[var(--border-color)] text-[10px] font-medium uppercase tracking-wider text-[var(--text-primary)]">Sanctuary</span>
                </div>
            </div>
            <div className="p-8">
                <h3 className="text-2xl font-medium text-[var(--text-primary)] mb-2">Temporal Dilation</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-6 leading-relaxed">A designated zone for disconnecting from high-frequency networks.</p>
                <button className="w-full btn-primary py-3 text-sm flex items-center justify-between px-6">
                    <span>Enter Quiet Mode</span>
                    <Moon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export const IntegrationHub = () => {
    const [connected, setConnected] = useState(false);
    const [buttonText, setButtonText] = useState("Initialize Connection");

    const handleConnect = () => {
        if (!connected) {
            setButtonText("Establishing Uplink...");
            setTimeout(() => {
                setConnected(true);
                setButtonText("Connection Secure");
            }, 800);
        } else {
            setConnected(false);
            setButtonText("Initialize Connection");
        }
    };

    return (
        <div className="clean-card p-8 flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--text-primary)]/5 flex items-center justify-center border border-[var(--border-color)]">
                            <Layers className="w-4 h-4 text-[var(--text-primary)]" />
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">Integration Hub</span>
                    </div>
                    <span className="text-[10px] text-[var(--text-secondary)] font-mono bg-[var(--text-primary)]/5 px-2 py-1 rounded">V 2.4.0</span>
                </div>
                <div className="orbit-system mb-8">
                    <div className="absolute w-full h-full border border-dashed rounded-full opacity-20" style={{ borderColor: 'var(--text-secondary)' }}></div>
                    <div className="absolute w-[60%] h-[60%] top-[20%] left-[20%] border rounded-full opacity-30" style={{ borderColor: 'var(--text-secondary)' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[var(--text-primary)] rounded-full flex items-center justify-center z-20 shadow-lg">
                        <Zap className="w-5 h-5 text-[var(--bg-body)] fill-current" />
                    </div>
                    <div className={`node w-10 h-10 rounded-full flex items-center justify-center top-[10%] left-[20%] hover:text-[var(--accent)] hover:border-[var(--accent)] ${connected ? 'docked' : ''}`}>
                        <Music className="w-4 h-4" />
                    </div>
                    <div className={`node w-10 h-10 rounded-full flex items-center justify-center top-[20%] right-[10%] hover:text-[var(--accent)] hover:border-[var(--accent)] ${connected ? 'docked' : ''}`}>
                        <CreditCard className="w-4 h-4" />
                    </div>
                    <div className={`node w-10 h-10 rounded-full flex items-center justify-center bottom-[20%] left-[15%] hover:text-[var(--accent)] hover:border-[var(--accent)] ${connected ? 'docked' : ''}`}>
                        <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className={`node w-10 h-10 rounded-full flex items-center justify-center bottom-[10%] right-[25%] hover:text-[var(--accent)] hover:border-[var(--accent)] ${connected ? 'docked' : ''}`}>
                        <Database className="w-4 h-4" />
                    </div>
                </div>
                <h3 className="text-lg font-medium text-[var(--text-primary)] text-center mb-2">Connect Ecosystem</h3>
                <p className="text-xs text-[var(--text-secondary)] text-center mb-8 max-w-xs mx-auto">Seamlessly link payment gateways.</p>
            </div>
            <button
                onClick={handleConnect}
                className={`w-full btn-secondary py-3 text-sm font-medium ${connected ? '!bg-[hsl(var(--accent))] !border-[hsl(var(--accent))] !text-[var(--bg-body)]' : ''}`}
            >
                {buttonText}
            </button>
        </div>
    );
};

export const CleanStats = () => {
    const [stats, setStats] = useState([42, 68, 12]);

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(stats.map(() => Math.floor(Math.random() * 90) + 5));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="clean-card p-8">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)]">System Status</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">Real-time telemetry</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] pulse-core"></span>
                    <span className="text-xs text-[hsl(var(--accent))] font-medium">Stable</span>
                </div>
            </div>
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-[var(--text-secondary)]">Processing Unit</span>
                        <span className="font-mono text-[var(--text-primary)]">{stats[0]}%</span>
                    </div>
                    <div className="stat-bar-bg h-1.5 w-full">
                        <div className="stat-bar-fill h-full" style={{ width: `${stats[0]}%` }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-[var(--text-secondary)]">Memory Allocation</span>
                        <span className="font-mono text-[var(--text-primary)]">{stats[1]}%</span>
                    </div>
                    <div className="stat-bar-bg h-1.5 w-full">
                        <div className="stat-bar-fill h-full" style={{ width: `${stats[1]}%` }}></div>
                    </div>
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-[var(--text-secondary)]">Network Load</span>
                        <span className="font-mono text-[var(--text-primary)]">{stats[2]}%</span>
                    </div>
                    <div className="stat-bar-bg h-1.5 w-full">
                        <div className="stat-bar-fill h-full bg-[hsl(var(--accent))]" style={{ width: `${stats[2]}%` }}></div>
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex gap-4">
                <button onClick={() => setStats(stats.map(() => Math.floor(Math.random() * 90) + 5))} className="flex-1 py-2 text-xs border border-[var(--border-color)] rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-colors">Refresh Data</button>
                <button className="flex-1 py-2 text-xs bg-[var(--btn-bg)] rounded text-[var(--text-primary)] hover:bg-[var(--btn-bg-hover)] transition-colors">View Logs</button>
            </div>
        </div>
    );
};

export const IDCard = () => {
    return (
        <div className="clean-card relative h-[380px] flex flex-col">
            <div className="shimmer pointer-events-none"></div>
            <div className="h-32 w-full bg-gradient-to-b from-[var(--text-primary)]/5 to-transparent relative border-b border-[var(--border-color)]">
                <div className="absolute -bottom-8 left-8 w-16 h-16 rounded-xl overflow-hidden border-4 border-[var(--card-bg)]">
                    <img src="https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover grayscale" alt="Profile" />
                </div>
                <div className="absolute top-6 right-6 text-[var(--text-secondary)]">
                    <ShieldCheck className="w-6 h-6" />
                </div>
            </div>
            <div className="p-8 pt-10 flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-medium text-[var(--text-primary)]">Operative 04</h3>
                    <p className="text-xs text-[hsl(var(--accent))] mt-1 font-mono">/// ACCESS_GRANTED</p>
                    <div className="mt-6 space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
                            <span className="text-xs text-[var(--text-secondary)]">Department</span>
                            <span className="text-xs text-[var(--text-primary)]">R&D / Cybernetics</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[var(--border-color)]">
                            <span className="text-xs text-[var(--text-secondary)]">Clearance</span>
                            <span className="text-xs text-[var(--text-primary)] bg-[var(--text-primary)]/5 px-2 py-0.5 rounded">Level 5</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <div className="flex-grow h-10 bg-[var(--btn-bg)] border border-[var(--border-color)] rounded-lg flex items-center px-3 gap-2">
                        <Lock className="w-3 h-3 text-[var(--text-secondary)]" />
                        <span className="text-xs text-[var(--text-secondary)] font-mono tracking-widest">••••••••••••</span>
                    </div>
                    <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--border-color)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-body)] transition-colors text-[var(--text-secondary)]">
                        <Copy className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
