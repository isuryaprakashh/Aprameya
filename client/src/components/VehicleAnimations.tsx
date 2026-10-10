import React from 'react';
import { motion } from 'framer-motion';

// Vehicle type props
interface VehicleProps {
  className?: string;
  color?: string;
  size?: number;
}

// Car animation
export const CarAnimation: React.FC<VehicleProps> = ({ 
  className, 
  color = "#3B82F6", 
  size = 24 
}) => {
  // Define the animation variants for car parts
  const wheelVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: 360,
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const carBodyVariants = {
    initial: { x: -10, y: 0 },
    animate: { 
      x: 0, 
      y: [0, -1, 0, 1, 0],
      transition: { 
        x: { duration: 0.3, ease: "easeOut" },
        y: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
      }
    }
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial="initial"
      animate="animate"
    >
      {/* Car Body */}
      <motion.g variants={carBodyVariants}>
        <path 
          d="M7 17h10v-5l-2-5H9L7 12v5z" 
          fill={color} 
          stroke={color}
          strokeWidth="1" 
        />
        <path 
          d="M5 17h14" 
          stroke={color} 
          strokeWidth="1.5" 
        />
        <path 
          d="M8 8h8" 
          stroke="#fff" 
          strokeWidth="1" 
        />
      </motion.g>
      
      {/* Wheels */}
      <motion.circle 
        cx="7" 
        cy="17" 
        r="2" 
        fill="#333" 
        variants={wheelVariants}
      />
      <motion.circle 
        cx="17" 
        cy="17" 
        r="2" 
        fill="#333" 
        variants={wheelVariants}
      />
    </motion.svg>
  );
};

// Drone animation
export const DroneAnimation: React.FC<VehicleProps> = ({ 
  className, 
  color = "#0EA5E9", 
  size = 24 
}) => {
  // Define the animation variants for drone parts
  const propellerVariants = {
    initial: { rotate: 0, opacity: 0.7 },
    animate: { 
      rotate: 360,
      opacity: [0.7, 0.4, 0.7],
      transition: { 
        rotate: { duration: 0.5, repeat: Infinity, ease: "linear" },
        opacity: { duration: 1, repeat: Infinity, ease: "easeInOut" }
      }
    }
  };

  const droneBodyVariants = {
    initial: { y: 0 },
    animate: { 
      y: [0, -1, 0, 1, 0],
      transition: { 
        duration: 1.5, 
        repeat: Infinity, 
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial="initial"
      animate="animate"
    >
      {/* Drone Body */}
      <motion.g variants={droneBodyVariants}>
        <rect 
          x="8" 
          y="8" 
          width="8" 
          height="8" 
          rx="2" 
          fill={color} 
          stroke="none" 
        />
        <circle 
          cx="12" 
          cy="12" 
          r="1" 
          fill="#fff" 
        />
      </motion.g>
      
      {/* Propellers */}
      <motion.g variants={propellerVariants}>
        <circle cx="6" cy="6" r="2" fill={color} opacity="0.7" />
        <circle cx="18" cy="6" r="2" fill={color} opacity="0.7" />
        <circle cx="6" cy="18" r="2" fill={color} opacity="0.7" />
        <circle cx="18" cy="18" r="2" fill={color} opacity="0.7" />
      </motion.g>
      
      {/* Arms */}
      <line x1="8" y1="8" x2="6" y2="6" stroke={color} strokeWidth="1" />
      <line x1="16" y1="8" x2="18" y2="6" stroke={color} strokeWidth="1" />
      <line x1="8" y1="16" x2="6" y2="18" stroke={color} strokeWidth="1" />
      <line x1="16" y1="16" x2="18" y2="18" stroke={color} strokeWidth="1" />
    </motion.svg>
  );
};

// Truck animation
export const TruckAnimation: React.FC<VehicleProps> = ({ 
  className, 
  color = "#1D4ED8", 
  size = 24 
}) => {
  // Define the animation variants for truck parts
  const wheelVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: 360,
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const truckBodyVariants = {
    initial: { x: -10 },
    animate: { 
      x: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial="initial"
      animate="animate"
    >
      {/* Truck Body */}
      <motion.g variants={truckBodyVariants}>
        {/* Cabin */}
        <rect 
          x="2" 
          y="9" 
          width="6" 
          height="6" 
          rx="1" 
          fill={color} 
          stroke="none"
        />
        {/* Cargo */}
        <rect 
          x="8" 
          y="7" 
          width="12" 
          height="8" 
          rx="1" 
          fill={color} 
          stroke="none" 
          opacity="0.8"
        />
        {/* Window */}
        <rect 
          x="3" 
          y="10" 
          width="3" 
          height="2" 
          rx="0.5" 
          fill="#fff" 
          opacity="0.7"
        />
      </motion.g>
      
      {/* Wheels */}
      <motion.circle 
        cx="4" 
        cy="17" 
        r="2" 
        fill="#333" 
        variants={wheelVariants}
      />
      <motion.circle 
        cx="10" 
        cy="17" 
        r="2" 
        fill="#333" 
        variants={wheelVariants}
      />
      <motion.circle 
        cx="16" 
        cy="17" 
        r="2" 
        fill="#333" 
        variants={wheelVariants}
      />
    </motion.svg>
  );
};

// Bike animation
export const BikeAnimation: React.FC<VehicleProps> = ({ 
  className, 
  color = "#16A34A", 
  size = 24 
}) => {
  // Define the animation variants for bike parts
  const wheelVariants = {
    initial: { rotate: 0 },
    animate: { 
      rotate: 360,
      transition: { 
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const bikeBodyVariants = {
    initial: { rotate: -5 },
    animate: { 
      rotate: [-2, 2, -2],
      transition: { 
        duration: 1, 
        repeat: Infinity, 
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      initial="initial"
      animate="animate"
    >
      {/* Bike Body */}
      <motion.g variants={bikeBodyVariants}>
        {/* Frame */}
        <line x1="9" y1="10" x2="4" y2="15" stroke={color} strokeWidth="1.5" />
        <line x1="9" y1="10" x2="15" y2="15" stroke={color} strokeWidth="1.5" />
        <line x1="4" y1="15" x2="15" y2="15" stroke={color} strokeWidth="1.5" />
        <line x1="9" y1="10" x2="11" y2="6" stroke={color} strokeWidth="1.5" />
        <line x1="11" y1="6" x2="13" y2="6" stroke={color} strokeWidth="1.5" />
        <line x1="13" y1="6" x2="15" y2="15" stroke={color} strokeWidth="1.5" />
      </motion.g>
      
      {/* Wheels */}
      <motion.circle 
        cx="4" 
        cy="15" 
        r="3" 
        fill="none" 
        stroke="#333" 
        strokeWidth="1"
        variants={wheelVariants}
      />
      <motion.circle 
        cx="15" 
        cy="15" 
        r="3" 
        fill="none" 
        stroke="#333" 
        strokeWidth="1"
        variants={wheelVariants}
      />
    </motion.svg>
  );
};

// Export animation components
const VehicleAnimations = {
  Car: CarAnimation,
  Drone: DroneAnimation,
  Truck: TruckAnimation,
  Bike: BikeAnimation
};

export default VehicleAnimations;