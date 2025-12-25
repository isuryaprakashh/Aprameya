import React, { useEffect, useRef } from 'react';

const ProximityMatrix = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let w: number, h: number;
        let time = 0;

        const resize = () => {
            w = container.clientWidth;
            h = container.clientHeight;
            canvas.width = w;
            canvas.height = h;
        };

        const animate = () => {
            time += 0.005;

            // Auto-move the focal point in a figure-8 pattern
            const focalX = w / 2 + Math.cos(time) * (w / 3);
            const focalY = h / 2 + Math.sin(time * 2) * (h / 3);

            ctx.clearRect(0, 0, w, h);
            const gap = 25;

            for (let x = 10; x < w; x += gap) {
                for (let y = 10; y < h; y += gap) {
                    const d = Math.hypot(x - focalX, y - focalY);

                    let radius = 1.5;
                    let color = 'rgba(255,255,255,0.1)';

                    if (d < 150) { // Increased range slightly for better visibility
                        radius = 1.5 + (1 - d / 150) * 2.5;
                        // Get accent color from CSS variable
                        const accentHSL = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
                        const [h, s, l] = accentHSL.split(' ').map(v => parseFloat(v));
                        color = `hsla(${h}, ${s}%, ${l}%, ${0.2 + (1 - d / 150) * 0.8})`;
                    }

                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fillStyle = color;
                    ctx.fill();
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        resize();
        window.addEventListener('resize', resize);
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full bg-[var(--bg-body)] overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />

        </div>
    );
};

export default ProximityMatrix;
