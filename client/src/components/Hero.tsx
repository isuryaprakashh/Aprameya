import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let grid: number[][];
        let cols: number;
        let rows: number;
        const resolution = 8;

        function make2DArray(cols: number, rows: number) {
            let arr = new Array(cols);
            for (let i = 0; i < arr.length; i++) {
                arr[i] = new Array(rows);
            }
            return arr;
        }

        function countNeighbors(grid: number[][], x: number, y: number) {
            let sum = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    let col = (x + i + cols) % cols;
                    let row = (y + j + rows) % rows;
                    sum += grid[col][row];
                }
            }
            sum -= grid[x][y];
            return sum;
        }

        function draw() {
            if (!canvas || !ctx) return;

            // Fade effect for "trails"
            ctx.fillStyle = 'rgba(8, 8, 8, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Compute next generation
            let next = make2DArray(cols, rows);

            // Draw and calculate
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    let state = grid[i][j];

                    // Count live neighbors
                    let neighbors = countNeighbors(grid, i, j);

                    // Rules of Game of Life
                    if (state == 0 && neighbors == 3) {
                        next[i][j] = 1;
                    } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
                        next[i][j] = 0;
                    } else {
                        next[i][j] = state;
                    }

                    // Visual Rendering
                    if (state == 1) {
                        // Draw "Active" cell
                        ctx.fillStyle = '#ffffff';
                        ctx.fillRect(i * resolution, j * resolution, resolution - 2, resolution - 2);
                    } else {
                        // Draw "Dead" cell (optional: subtle dither dot)
                        if (Math.random() > 0.98) {
                            ctx.fillStyle = '#222';
                            ctx.fillRect(i * resolution, j * resolution, 2, 2);
                        }
                    }
                }
            }

            grid = next;

            // Slow down animation slightly for "processing" feel
            setTimeout(() => {
                animationId = requestAnimationFrame(draw);
            }, 50);
        }

        function setup() {
            if (!canvas) return;
            const parent = canvas.parentElement;
            if (!parent) return;

            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;

            cols = Math.floor(canvas.width / resolution);
            rows = Math.floor(canvas.height / resolution);

            grid = make2DArray(cols, rows);

            // Initial random fill
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    grid[i][j] = Math.floor(Math.random() * 2);
                }
            }

            if (!animationId) {
                draw();
            }
        }

        setup();

        const handleResize = () => {
            cancelAnimationFrame(animationId);
            setup();
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / resolution);
            const y = Math.floor((e.clientY - rect.top) / resolution);

            if (x >= 0 && x < cols && y >= 0 && y < rows && grid) {
                if (grid[x][y] === 0) grid[x][y] = 1;
                if (x + 1 < cols) grid[x + 1][y] = 1;
                if (y + 1 < rows) grid[x][y + 1] = 1;
            }
        };

        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <main className="flex-grow pt-12">
            <div className="max-w-7xl mx-auto border-l border-r border-[#1a1a1a] min-h-[80vh] grid grid-cols-1 lg:grid-cols-12">

                {/* Left Content */}
                <div className="lg:col-span-7 p-6 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1a1a1a] relative overflow-hidden">
                    {/* Background Dither Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 dither-bg opacity-50"></div>

                    <div className="mt-12 z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-1 bg-[#222] text-[10px] text-gray-300">EST. 2024</span>
                            <span className="px-1 border border-[#333] text-[10px] text-gray-500">V.1.0.4</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold leading-[0.9] mb-6 text-white">
                            AUTONOMOUS<br />
                            INTELLIGENCE<br />
                            COLLECTIVE
                        </h1>
                        <p className="text-xs md:text-sm text-gray-400 max-w-md leading-relaxed mb-8">
                        // APRAMEYA is a student-led research lab focused on the intersection of embodied AI, computer vision, and autonomous systems control. We build machines that think.
                        </p>

                        <div className="flex gap-4">
                            <button className="bg-white text-black px-6 py-3 text-xs font-bold hover:bg-gray-200 transition-colors border border-white flex items-center gap-2">
                                INITIALIZE_PROTOCOL <ArrowRight className="w-3 h-3" />
                            </button>
                            <button className="px-6 py-3 text-xs font-bold text-gray-300 hover:text-white border border-[#333] hover:border-white transition-colors">
                                READ_DOCS
                            </button>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-4 text-[10px] text-gray-500 font-mono border-t border-[#1a1a1a] pt-4">
                        <div>
                            <span className="block text-white mb-1">01</span>
                            NEURAL NETWORKS
                        </div>
                        <div>
                            <span className="block text-white mb-1">02</span>
                            ROBOTICS
                        </div>
                        <div>
                            <span className="block text-white mb-1">03</span>
                            SIMULATION
                        </div>
                    </div>
                </div>

                {/* Right Content (Canvas Animation) */}
                <div className="lg:col-span-5 relative bg-[#080808] flex items-center justify-center overflow-hidden">
                    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 opacity-60"></canvas>

                    {/* Overlay Text on Canvas */}
                    <div className="z-10 pointer-events-none text-center mix-blend-difference">
                        <div className="border border-white/20 p-4 backdrop-blur-[2px]">
                            <p className="text-[10px] text-white/80 tracking-[0.3em] mb-2">SYSTEM STATUS</p>
                            <p className="text-2xl font-bold text-white tracking-tighter">LEARNING...</p>
                        </div>
                    </div>

                    {/* Decorative Corners */}
                    <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/50"></div>
                    <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/50"></div>
                    <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/50"></div>
                    <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/50"></div>
                </div>
            </div>

            {/* Scrolling Ticker */}
            <div className="border-y border-[#222] bg-white text-black py-2 overflow-hidden">
                <div className="marquee-container">
                    <div className="marquee-content text-xs font-bold tracking-widest uppercase flex gap-12">
                        <span>/// Building the Future</span>
                        <span>/// Deep Learning</span>
                        <span>/// Reinforcement Algorithms</span>
                        <span>/// Computer Vision</span>
                        <span>/// SLAM Integration</span>
                        <span>/// Aprameya Club</span>
                        <span>/// Join The Grid</span>
                        <span>/// Building the Future</span>
                        <span>/// Deep Learning</span>
                        <span>/// Reinforcement Algorithms</span>
                        <span>/// Computer Vision</span>
                        <span>/// SLAM Integration</span>
                        <span>/// Aprameya Club</span>
                        <span>/// Join The Grid</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
