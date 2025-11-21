import { Bot, Code2, ArrowUpRight } from 'lucide-react';

export default function BentoGrid() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex justify-between items-end mb-8 border-b border-[#1a1a1a] pb-4">
                <h2 className="text-2xl font-bold">MODULES</h2>
                <span className="text-[10px] text-gray-500">INDEX: 001-005</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">

                {/* Large Card: Generative Models */}
                <div className="md:col-span-2 lg:col-span-2 row-span-2 bg-[#0a0a0a] p-6 group relative hover:bg-[#0f0f0f] transition-colors">
                    <div className="absolute top-4 right-4 dither-bg w-16 h-16 opacity-20"></div>
                    <div className="h-full flex flex-col justify-between">
                        <div className="w-full h-48 mb-4 border border-[#222] flex items-center justify-center overflow-hidden relative">
                            {/* Abstract Neural SVG */}
                            <svg viewBox="0 0 200 100" className="w-full h-full stroke-white/20 fill-none stroke-1" preserveAspectRatio="none">
                                <path d="M10,50 Q50,10 100,50 T190,50" />
                                <path d="M10,50 Q50,90 100,50 T190,50" />
                                <line x1="50" y1="10" x2="50" y2="90" strokeDasharray="4" />
                                <line x1="150" y1="10" x2="150" y2="90" strokeDasharray="4" />
                                <circle cx="100" cy="50" r="20" className="stroke-white fill-black" />
                                <circle cx="100" cy="50" r="4" className="fill-white" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-500 mb-2">CORE RESEARCH</div>
                            <h3 className="text-xl text-white mb-2 group-hover:translate-x-1 transition-transform">GENERATIVE ARCHITECTURES</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">Exploring diffusion models, GANs, and LLMs. We dissect state-of-the-art papers and implement custom models for creative and functional outputs.</p>
                        </div>
                    </div>
                </div>

                {/* Tall Card: Workshops */}
                <div className="md:col-span-1 lg:col-span-1 row-span-2 bg-[#0a0a0a] p-6 flex flex-col border-l border-[#1a1a1a] relative overflow-hidden">
                    <div className="absolute inset-0 dither-bg opacity-5 pointer-events-none"></div>
                    <h3 className="text-lg text-white mb-6 border-b border-[#222] pb-2">UPCOMING_LABS</h3>

                    <ul className="space-y-6 flex-grow">
                        <li className="group cursor-pointer">
                            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                <span>NOV 24</span>
                                <span>18:00</span>
                            </div>
                            <div className="text-sm text-gray-200 group-hover:text-white group-hover:underline decoration-1 underline-offset-4">
                                INTRO TO PYTORCH
                            </div>
                        </li>
                        <li className="group cursor-pointer">
                            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                <span>DEC 01</span>
                                <span>14:00</span>
                            </div>
                            <div className="text-sm text-gray-200 group-hover:text-white group-hover:underline decoration-1 underline-offset-4">
                                ROS2 BASICS
                            </div>
                        </li>
                        <li className="group cursor-pointer">
                            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                <span>DEC 08</span>
                                <span>16:00</span>
                            </div>
                            <div className="text-sm text-gray-200 group-hover:text-white group-hover:underline decoration-1 underline-offset-4">
                                COMPUTER VISION
                            </div>
                        </li>
                    </ul>
                    <button className="w-full mt-4 py-2 border border-[#333] text-[10px] hover:bg-white hover:text-black transition-colors uppercase">
                        View Calendar
                    </button>
                </div>

                {/* Card: Autonomous Systems */}
                <div className="bg-[#0a0a0a] p-6 hover:bg-[#0f0f0f] transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <Bot className="text-white w-6 h-6" />
                        <ArrowUpRight className="text-gray-600 w-4 h-4 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">AUTONOMOUS DRIVING</h3>
                    <p className="text-[10px] text-gray-400">LIDAR processing, path planning, and SLAM algorithms implementation.</p>
                </div>

                {/* Card: Hackathons */}
                <div className="bg-[#0a0a0a] p-6 hover:bg-[#0f0f0f] transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <Code2 className="text-white w-6 h-6" />
                        <ArrowUpRight className="text-gray-600 w-4 h-4 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-2">HACKATHONS</h3>
                    <p className="text-[10px] text-gray-400">48-hour coding sprints to solve real-world problems using AI.</p>
                </div>

                {/* Wide Card: Join CTA */}
                <div className="md:col-span-3 lg:col-span-4 bg-white text-black p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">READY TO DEPLOY?</h3>
                        <p className="text-xs text-gray-600 max-w-lg">Membership opens twice a year. Join a community of builders, researchers, and innovators.</p>
                    </div>
                    <div className="flex gap-0">
                        <input type="email" placeholder="ENTER_EMAIL" className="bg-transparent border border-black px-4 py-3 text-xs placeholder-gray-500 focus:outline-none w-48 md:w-64" />
                        <button className="bg-black text-white px-6 py-3 text-xs font-bold hover:bg-[#333] transition-colors">
                            SUBMIT
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
