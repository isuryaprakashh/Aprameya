import { useState, useRef } from 'react';
import { Box } from 'lucide-react';

export const ButtonTrace = ({ text = "SYS_DIAGNOSTIC" }) => (
    <button className="btn-trace w-full h-12 flex items-center justify-center text-sm font-mono tracking-wider relative">
        <svg><rect x="0" y="0" width="100%" height="100%" rx="8" /></svg>
        <span className="relative z-10">{text}</span>
    </button>
);

export const ButtonHold = ({ text = "HOLD_TO_PURGE" }) => {
    const [activated, setActivated] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startHold = () => {
        if (activated) return;
        setProgress(100);
        timerRef.current = setTimeout(() => {
            setActivated(true);
        }, 1000);
    };

    const endHold = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (!activated) setProgress(0);
    };

    return (
        <button
            className={`btn-hold w-full h-12 flex items-center justify-center text-sm font-mono tracking-wider rounded-lg relative ${activated ? 'activated' : ''}`}
            onMouseDown={startHold}
            onMouseUp={endHold}
            onMouseLeave={endHold}
        >
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            <span className="relative z-10">{activated ? "PURGE_COMPLETE" : text}</span>
        </button>
    );
};

export const ButtonScramble = ({ text = "ENCRYPTED_DATA" }) => {
    const [displayText, setDisplayText] = useState(text);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

    const scramble = () => {
        let iterations = 0;
        const interval = setInterval(() => {
            setDisplayText(text.split('').map((letter, index) => {
                if (index < iterations) return text[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join(''));
            if (iterations >= text.length) clearInterval(interval);
            iterations += 1 / 2;
        }, 30);
    };

    return (
        <button className="btn-scramble w-full h-12 rounded-lg text-sm" onMouseEnter={scramble}>
            {displayText}
        </button>
    );
};

export const ButtonPrism = () => (
    <button className="btn-prism w-full h-12 rounded-lg text-sm flex items-center justify-center gap-2">
        <Box className="w-4 h-4" />
        <span>View Model 3D</span>
    </button>
);

export const ButtonSonar = () => (
    <button className="btn-sonar w-full h-12 rounded-lg text-sm font-bold tracking-widest uppercase">
        Broadcast
    </button>
);
