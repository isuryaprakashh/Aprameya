import React, { useEffect, useRef } from 'react';

const MagneticVectorField = () => {
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
            time += 0.01;
            ctx.clearRect(0, 0, w, h);

            const gap = 30;
            const length = 10;

            for (let x = gap / 2; x < w; x += gap) {
                for (let y = gap / 2; y < h; y += gap) {
                    // Create a flowing field effect based on position and time
                    const angle = Math.sin(x * 0.002 + time) + Math.cos(y * 0.002 + time);

                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);

                    ctx.beginPath();
                    ctx.moveTo(-length / 2, 0);
                    ctx.lineTo(length / 2, 0);

                    // Color variation based on angle
                    const intensity = (Math.sin(angle * 2) + 1) / 2;
                    // Get accent color from CSS variable
                    const accentHSL = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
                    const [h, s, l] = accentHSL.split(' ').map(v => parseFloat(v));
                    ctx.strokeStyle = `hsla(${h}, ${s}%, ${l}%, ${0.1 + intensity * 0.3})`;
                    ctx.stroke();

                    ctx.restore();
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

export default MagneticVectorField;
