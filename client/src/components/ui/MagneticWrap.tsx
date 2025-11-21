import React, { useRef } from 'react';
import { useMagnetic } from '@/hooks/useMagnetic';

interface MagneticWrapProps {
    children: React.ReactNode;
    className?: string;
}

const MagneticWrap: React.FC<MagneticWrapProps> = ({ children, className = '' }) => {
    const ref = useRef<HTMLDivElement>(null);
    useMagnetic(ref);

    return (
        <div ref={ref} className={`magnetic-wrap ${className}`}>
            {children}
        </div>
    );
};

export default MagneticWrap;
