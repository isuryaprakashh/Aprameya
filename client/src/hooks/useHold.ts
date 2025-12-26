import { useState, useRef, useCallback } from 'react';

export const useHold = (onComplete: () => void, duration = 1000) => {
    const [progress, setProgress] = useState(0);
    const [activated, setActivated] = useState(false);

    const startTimeRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    const startHold = useCallback(() => {
        if (activated) return;
        startTimeRef.current = Date.now();

        const animate = () => {
            const elapsed = Date.now() - (startTimeRef.current || 0);
            const p = Math.min(elapsed / duration, 1);
            setProgress(p * 100);

            if (p < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setActivated(true);
                onComplete();
            }
        };

        rafRef.current = requestAnimationFrame(animate);
    }, [activated, duration, onComplete]);

    const endHold = useCallback(() => {
        if (activated) return;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setProgress(0);
    }, [activated]);

    return { progress, activated, startHold, endHold };
};
