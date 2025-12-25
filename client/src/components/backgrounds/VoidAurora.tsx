import React, { useEffect, useRef } from 'react';

const VoidAurora = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const orbRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const orb = orbRef.current;
        if (!container || !orb) return;

        let animationFrameId: number;
        let time = 0;

        const animate = () => {
            time += 0.005;

            // Auto-move the orb in a smooth, floating pattern
            const r = container.getBoundingClientRect();
            const centerX = r.width / 2;
            const centerY = r.height / 2;

            // Lissajous curve-like movement
            const x = centerX + Math.cos(time) * (r.width / 3) + Math.sin(time * 0.5) * 50;
            const y = centerY + Math.sin(time * 0.7) * (r.height / 3) + Math.cos(time * 0.3) * 30;

            orb.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[var(--bg-body)] overflow-hidden">
            <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none z-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />
            <div
                ref={orbRef}
                className="absolute w-[300px] h-[300px] rounded-full pointer-events-none blur-[40px]"
                style={{
                    background: `radial-gradient(circle, hsl(var(--accent) / 0.4) 0%, rgba(0,0,0,0) 70%)`,
                    transform: 'translate(50%, 50%) translate(-50%, -50%)',
                    top: 0,
                    left: 0
                }}
            />

        </div>
    );
};

export default VoidAurora;
