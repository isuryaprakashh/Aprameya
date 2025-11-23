import { useEffect, useRef } from 'react';

export const ProximityMatrix = ({ className, children }: { className?: string, children?: React.ReactNode }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Use ResizeObserver to handle dynamic sizing
        const updateSize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            canvas.width = w;
            canvas.height = h;
            return { w, h };
        };

        let { w, h } = updateSize();

        const resizeObserver = new ResizeObserver(() => {
            const dims = updateSize();
            w = dims.w;
            h = dims.h;
        });
        resizeObserver.observe(container);

        let m = { x: -1000, y: -1000 };
        const handleMouseMove = (e: MouseEvent) => {
            const r = container.getBoundingClientRect();
            m.x = e.clientX - r.left;
            m.y = e.clientY - r.top;
        };
        const handleMouseLeave = () => {
            m.x = -1000;
            m.y = -1000;
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        const getThemeColor = (varName: string) => {
            return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        };

        let animationId: number;
        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            const gap = 25;
            const canvasNodeColor = getThemeColor('--canvas-node') || 'rgba(255, 255, 255, 0.15)';

            for (let x = 10; x < w; x += gap) {
                for (let y = 10; y < h; y += gap) {
                    const d = Math.hypot(x - m.x, y - m.y);
                    let radius = 1.5;
                    let color = canvasNodeColor;

                    if (d < 100) {
                        radius = 1.5 + (1 - d / 100) * 2;
                        color = `rgba(52, 211, 153, ${0.2 + (1 - d / 100) * 0.8})`;
                    }
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            }
            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            resizeObserver.disconnect();
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className={`bg-preview-container relative overflow-hidden ${className || ''}`} ref={containerRef}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
            <div className="relative z-10 h-full">
                {children}
            </div>
            {!children && <div className="bg-label">INTERACTION: MOUSE PROXIMITY</div>}
        </div>
    );
};

export const MagneticVectorField = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = container.clientWidth;
        let h = container.clientHeight;
        canvas.width = w;
        canvas.height = h;

        const resizeObserver = new ResizeObserver(() => {
            w = container.clientWidth;
            h = container.clientHeight;
            canvas.width = w;
            canvas.height = h;
        });
        resizeObserver.observe(container);

        let m = { x: w / 2, y: h / 2 };
        const handleMouseMove = (e: MouseEvent) => {
            const r = container.getBoundingClientRect();
            m.x = e.clientX - r.left;
            m.y = e.clientY - r.top;
        };
        container.addEventListener('mousemove', handleMouseMove);

        const getThemeColor = (varName: string) => {
            return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        };

        let animationId: number;
        const animate = () => {
            ctx.clearRect(0, 0, w, h);
            const gap = 30;
            const length = 10;
            const canvasNodeColor = getThemeColor('--canvas-node') || 'rgba(255, 255, 255, 0.15)';

            for (let x = gap / 2; x < w; x += gap) {
                for (let y = gap / 2; y < h; y += gap) {
                    const angle = Math.atan2(m.y - y, m.x - x);
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    ctx.beginPath();
                    ctx.moveTo(-length / 2, 0);
                    ctx.lineTo(length / 2, 0);
                    ctx.strokeStyle = canvasNodeColor;
                    ctx.stroke();
                    const d = Math.hypot(x - m.x, y - m.y);
                    if (d < 100) {
                        ctx.strokeStyle = '#34d399';
                        ctx.stroke();
                    }
                    ctx.restore();
                }
            }
            animationId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            resizeObserver.disconnect();
            container.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className="bg-preview-container" ref={containerRef}>
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="bg-label">INTERACTION: MOUSE DIRECTION</div>
        </div>
    );
};

export const VoidAurora = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const orbRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const orb = orbRef.current;
        if (!container || !orb) return;

        const handleMouseMove = (e: MouseEvent) => {
            const r = container.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            orb.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        };

        const handleMouseLeave = () => {
            orb.style.transform = `translate(50%, 50%) translate(-50%, -50%)`;
        };

        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className="bg-preview-container" ref={containerRef}>
            <div className="aurora-bg">
                <div className="noise-overlay"></div>
                <div className="aurora-orb" ref={orbRef}></div>
            </div>
            <div className="bg-label">INTERACTION: FLUID FOLLOW</div>
        </div>
    );
};
