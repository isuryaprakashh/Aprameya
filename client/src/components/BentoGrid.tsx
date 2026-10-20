import { Bot, Code2, ArrowUpRight } from 'lucide-react';

export default function BentoGrid() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex justify-between items-end mb-8 border-b border-[var(--border)] pb-4">
                <h2 className="text-2xl font-display font-medium tracking-tight text-[var(--text)]">MODULES</h2>
                <span className="text-xs font-mono text-[var(--text-3)]">INDEX: 001-005</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[var(--border)] border border-[var(--border)] rounded-[var(--r-lg)] overflow-hidden">

                {/* Large Card: Generative Models */}
                <div className="md:col-span-2 lg:col-span-2 row-span-2 bg-[var(--surface)] p-6 group relative hover:bg-[var(--surface-2)] transition-colors">
                    <div className="h-full flex flex-col justify-between">
                        <div className="w-full h-48 mb-4 border border-[var(--border)] rounded-[var(--r-md)] bg-[var(--surface-2)]/50 flex items-center justify-center overflow-hidden relative">
                            {/* Abstract Neural SVG */}
                            <svg viewBox="0 0 200 100" className="w-full h-full stroke-[var(--text)]/20 fill-none stroke-1" preserveAspectRatio="none">
                                <path d="M10,50 Q50,10 100,50 T190,50" />
                                <path d="M10,50 Q50,90 100,50 T190,50" />
                                <line x1="50" y1="10" x2="50" y2="90" strokeDasharray="4" />
                                <line x1="150" y1="10" x2="150" y2="90" strokeDasharray="4" />
                                <circle cx="100" cy="50" r="20" className="stroke-[var(--text)]/40 fill-[var(--surface)]" />
                                <circle cx="100" cy="50" r="4" className="fill-[var(--red)]" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-[10px] font-mono text-[var(--text-3)] mb-2 uppercase tracking-wider">CORE RESEARCH</div>
                            <h3 className="text-xl font-display font-medium text-[var(--text)] mb-2 group-hover:translate-x-1 transition-transform">GENERATIVE ARCHITECTURES</h3>
                            <p className="text-xs text-[var(--text-2)] leading-relaxed">Exploring diffusion models, GANs, and LLMs. We dissect state-of-the-art papers and implement custom models for creative and functional outputs.</p>
                        </div>
                    </div>
                </div>

                {/* Tall Card: Workshops */}
                <div className="md:col-span-1 lg:col-span-1 row-span-2 bg-[var(--surface)] p-6 flex flex-col relative overflow-hidden">
                    <h3 className="text-sm font-mono text-[var(--text-3)] uppercase tracking-wider mb-6 border-b border-[var(--border)] pb-2">UPCOMING_LABS</h3>

                    <ul className="space-y-6 flex-grow">
                        <li className="group cursor-pointer">
                            <div className="flex justify-between text-[10px] font-mono text-[var(--text-3)] mb-1">
                                <span>NOV 24</span>
                                <span>18:00</span>
                            </div>
                            <div className="text-sm font-display font-medium text-[var(--text)] group-hover:text-[var(--red-text)] transition-colors">
                                INTRO TO PYTORCH
                            </div>
                        </li>
                        <li className="group cursor-pointer">
                            <div className="flex justify-between text-[10px] font-mono text-[var(--text-3)] mb-1">
                                <span>DEC 01</span>
                                <span>14:00</span>
                            </div>
                            <div className="text-sm font-display font-medium text-[var(--text)] group-hover:text-[var(--red-text)] transition-colors">
                                ROS2 BASICS
                            </div>
                        </li>
                        <li className="group cursor-pointer">
                            <div className="flex justify-between text-[10px] font-mono text-[var(--text-3)] mb-1">
                                <span>DEC 08</span>
                                <span>16:00</span>
                            </div>
                            <div className="text-sm font-display font-medium text-[var(--text)] group-hover:text-[var(--red-text)] transition-colors">
                                COMPUTER VISION
                            </div>
                        </li>
                    </ul>
                    <button className="w-full mt-4 py-2 border border-[var(--border)] text-[10px] font-mono rounded-[var(--r-sm)] hover:bg-[var(--surface-2)] transition-colors uppercase text-[var(--text-2)] hover:text-[var(--text)]">
                        View Calendar
                    </button>
                </div>

                {/* Card: Autonomous Systems */}
                <div className="bg-[var(--surface)] p-6 hover:bg-[var(--surface-2)] transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <Bot className="text-[var(--red)] w-6 h-6" />
                        <ArrowUpRight className="text-[var(--text-3)] w-4 h-4 group-hover:text-[var(--red)] transition-colors" />
                    </div>
                    <h3 className="text-sm font-display font-medium text-[var(--text)] mb-2">AUTONOMOUS DRIVING</h3>
                    <p className="text-[10px] text-[var(--text-2)]">LIDAR processing, path planning, and SLAM algorithms implementation.</p>
                </div>

                {/* Card: Hackathons */}
                <div className="bg-[var(--surface)] p-6 hover:bg-[var(--surface-2)] transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <Code2 className="text-[var(--red)] w-6 h-6" />
                        <ArrowUpRight className="text-[var(--text-3)] w-4 h-4 group-hover:text-[var(--red)] transition-colors" />
                    </div>
                    <h3 className="text-sm font-display font-medium text-[var(--text)] mb-2">HACKATHONS</h3>
                    <p className="text-[10px] text-[var(--text-2)]">48-hour coding sprints to solve real-world problems using AI.</p>
                </div>

                {/* Wide Card: Join CTA */}
                <div className="md:col-span-3 lg:col-span-4 bg-[var(--surface-2)] text-[var(--text)] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-display font-medium tracking-tight mb-2">READY TO DEPLOY?</h3>
                        <p className="text-xs text-[var(--text-2)] max-w-lg">Membership opens twice a year. Join a community of builders, researchers, and innovators.</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <input type="email" placeholder="ENTER_EMAIL" className="bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 text-xs font-mono placeholder-[var(--text-3)] focus:border-[var(--red)] focus:outline-none rounded-[var(--r-sm)] w-full md:w-64 text-[var(--text)]" />
                        <button className="bg-[var(--red)] text-white px-5 py-2.5 text-xs font-mono font-medium hover:bg-[var(--red-hover)] rounded-[var(--r-sm)] transition-colors shrink-0">
                            SUBMIT
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
