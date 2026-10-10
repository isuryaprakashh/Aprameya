import { useEffect } from 'react';

export const useMagnetic = (ref: React.RefObject<HTMLElement>) => {
    useEffect(() => {
        const wrap = ref.current;
        if (!wrap) return;
        const btn = wrap.querySelector('.magnetic-target') as HTMLElement;
        if (!btn) return;

        const handleMove = (e: MouseEvent) => {
            const rect = wrap.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        };

        const handleLeave = () => {
            btn.style.transform = 'translate(0px, 0px)';
        };

        wrap.addEventListener('mousemove', handleMove);
        wrap.addEventListener('mouseleave', handleLeave);

        return () => {
            wrap.removeEventListener('mousemove', handleMove);
            wrap.removeEventListener('mouseleave', handleLeave);
        };
    }, []);
};
