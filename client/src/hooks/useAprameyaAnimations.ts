import { useEffect, useRef } from 'react';

export const useNeuralCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width: number, height: number;
        let animationFrameId: number;
        const nodes: any[] = [];
        let globalMouse = { x: -1000, y: -1000 };

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const initNodes = () => {
            nodes.length = 0;
            for (let i = 0; i < 40; i++) {
                nodes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5
                });
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            globalMouse.x = e.clientX;
            globalMouse.y = e.clientY;
        };

        const animateGlobal = () => {
            ctx.clearRect(0, 0, width, height);
            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                if (node.x < 0 || node.x > width) node.vx *= -1;
                if (node.y < 0 || node.y > height) node.vy *= -1;

                ctx.beginPath();
                ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                ctx.fill();

                const d = Math.hypot(node.x - globalMouse.x, node.y - globalMouse.y);
                if (d < 150) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(globalMouse.x, globalMouse.y);
                    ctx.strokeStyle = `rgba(52, 211, 153, ${1 - d / 150})`;
                    ctx.stroke();
                }
            });
            animationFrameId = requestAnimationFrame(animateGlobal);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);

        resize();
        initNodes();
        animateGlobal();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return canvasRef;
};
