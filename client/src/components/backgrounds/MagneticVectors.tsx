import { useEffect, useRef } from 'react';

interface MagneticVectorsProps {
  className?: string;
}

const MagneticVectors = ({ className = '' }: MagneticVectorsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number;
    let mouse = { x: 0, y: 0 };

    function resize() {
      if (!canvas || !container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
      mouse.x = width / 2;
      mouse.y = height / 2;
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, width, height);
      const gap = 30;
      const length = 10;

      for (let x = gap / 2; x < width; x += gap) {
        for (let y = gap / 2; y < height; y += gap) {
          const angle = Math.atan2(mouse.y - y, mouse.x - x);

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);

          ctx.beginPath();
          ctx.moveTo(-length / 2, 0);
          ctx.lineTo(length / 2, 0);
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.stroke();

          // Highlight if close
          const d = Math.hypot(x - mouse.x, y - mouse.y);
          if (d < 100) {
            ctx.strokeStyle = '#34d399';
            ctx.stroke();
          }

          ctx.restore();
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`bg-preview-container ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="bg-label">INTERACTION: MOUSE DIRECTION</div>
    </div>
  );
};

export default MagneticVectors;
