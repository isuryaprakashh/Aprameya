import { useEffect, useRef } from 'react';

const NeuralCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let animationFrameId: number;
        let canvasNodeColor = 'rgba(255, 255, 255, 0.15)'; // Default

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resize);
        resize();

        const updateColors = () => {
            const style = getComputedStyle(document.documentElement);
            canvasNodeColor = style.getPropertyValue('--canvas-node').trim() || 'rgba(255, 255, 255, 0.15)';
        };
        updateColors();

        // Observer for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && (mutation.attributeName === 'class' || mutation.attributeName === 'data-theme')) {
                    updateColors();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });

        const nodes: { x: number; y: number; vx: number; vy: number }[] = [];
        for (let i = 0; i < 40; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }

        let globalMouse = { x: -1000, y: -1000 };
        const handleMouseMove = (e: MouseEvent) => {
            globalMouse.x = e.clientX;
            globalMouse.y = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                ctx.beginPath();
                ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = canvasNodeColor;
                ctx.fill();

                const d = Math.hypot(node.x - globalMouse.x, node.y - globalMouse.y);
                if (d < 150) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(globalMouse.x, globalMouse.y);
                    // Keep the emerald line as per reference, or make it dynamic if desired.
                    // Reference uses hardcoded rgba(52, 211, 153, ...)
                    ctx.strokeStyle = `rgba(52, 211, 153, ${1 - d / 150})`;
                    ctx.stroke();
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} id="neural-canvas" className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-60 transition-opacity duration-500" />;
};

export default NeuralCanvas;
