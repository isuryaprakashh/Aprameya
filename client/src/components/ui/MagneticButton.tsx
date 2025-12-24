import React from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className, onClick }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={className}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};

export default MagneticButton;
