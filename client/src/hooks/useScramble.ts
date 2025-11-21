import { useState, useCallback } from 'react';

export const useScramble = (originalText: string) => {
    const [text, setText] = useState(originalText);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

    const scramble = useCallback(() => {
        let iterations = 0;
        const interval = setInterval(() => {
            setText(originalText.split('').map((letter, index) => {
                if (index < iterations) return originalText[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(''));

            if (iterations >= originalText.length) clearInterval(interval);
            iterations += 1 / 2;
        }, 30);
    }, [originalText]);

    return { text, scramble };
};
