import { ButtonHTMLAttributes, ReactNode } from 'react';

interface AdvancedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: 'trace' | 'hold' | 'scramble' | 'prism' | 'sonar' | 'scan';
    className?: string;
}

export const TraceButton = ({ children, className = '', ...props }: Omit<AdvancedButtonProps, 'variant'>) => (
    <button className={`btn-trace w-full h-12 flex items-center justify-center text-sm font-mono tracking-wider relative ${className}`} {...props}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <rect x="0" y="0" width="100%" height="100%" rx="12" />
        </svg>
        <span className="relative z-10">{children}</span>
    </button>
);

export const HoldButton = ({ children, className = '', ...props }: Omit<AdvancedButtonProps, 'variant'>) => {
    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        const btn = e.currentTarget;
        const timer = setTimeout(() => {
            btn.classList.add('activated');
            const label = btn.querySelector('.label-text');
            if (label) label.textContent = 'COMPLETE';
        }, 1000);

        btn.dataset.timer = timer.toString();
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
        const btn = e.currentTarget;
        if (btn.dataset.timer) {
            clearTimeout(parseInt(btn.dataset.timer));
        }
    };

    return (
        <button
            className={`btn-hold w-full h-12 flex items-center justify-center text-sm font-mono tracking-wider rounded-xl relative ${className}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            {...props}
        >
            <div className="progress-fill"></div>
            <span className="relative z-10 label-text">{children}</span>
        </button>
    );
};

export const ScrambleButton = ({ children, className = '', ...props }: Omit<AdvancedButtonProps, 'variant'>) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        const btn = e.currentTarget;
        const original = btn.dataset.original || children?.toString() || '';
        btn.dataset.original = original;

        let iterations = 0;
        const interval = setInterval(() => {
            btn.textContent = original.split('').map((letter, index) => {
                if (index < iterations) return original[index];
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');

            if (iterations >= original.length) clearInterval(interval);
            iterations += 1 / 2;
        }, 30);
    };

    return (
        <button
            className={`btn-scramble w-full h-12 rounded-xl text-sm ${className}`}
            onMouseEnter={handleMouseEnter}
            data-original={children?.toString()}
            {...props}
        >
            {children}
        </button>
    );
};

export const PrismButton = ({ children, className = '', ...props }: Omit<AdvancedButtonProps, 'variant'>) => (
    <button className={`btn-prism w-full h-12 rounded-xl text-sm flex items-center justify-center gap-2 ${className}`} {...props}>
        {children}
    </button>
);

export const SonarButton = ({ children, className = '', ...props }: Omit<AdvancedButtonProps, 'variant'>) => (
    <button className={`btn-sonar w-full h-12 rounded-xl text-sm font-bold tracking-widest uppercase ${className}`} {...props}>
        {children}
    </button>
);

export const ScanButton = ({ children, className = '', ...props }: Omit<AdvancedButtonProps, 'variant'>) => (
    <button className={`btn-scan px-8 py-4 text-sm rounded-xl ${className}`} {...props}>
        <span className="scan-line"></span>
        {children}
    </button>
);
