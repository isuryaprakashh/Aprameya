import React, { useState } from 'react';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaShareAlt
} from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import VehicleAnimations, { CarAnimation, DroneAnimation, TruckAnimation, BikeAnimation } from './VehicleAnimations';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'minimal';
}

const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description = '',
  className,
  variant = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  // Social sharing URLs
  const socials = [
    {
      name: 'Facebook',
      icon: <FaFacebook className="h-5 w-5" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'bg-blue-600 hover:bg-blue-700',
      animation: 'car',
      vehicleColor: '#3B82F6'
    },
    {
      name: 'Twitter',
      icon: <FaTwitter className="h-5 w-5" />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: 'bg-sky-500 hover:bg-sky-600',
      animation: 'drone',
      vehicleColor: '#0EA5E9'
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin className="h-5 w-5" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'bg-blue-700 hover:bg-blue-800',
      animation: 'truck',
      vehicleColor: '#1D4ED8'
    },
    {
      name: 'WhatsApp',
      icon: <FaWhatsapp className="h-5 w-5" />,
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: 'bg-green-500 hover:bg-green-600',
      animation: 'bike',
      vehicleColor: '#16A34A'
    }
  ];

  // Animation variants for the share button container
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for individual share buttons
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Custom vehicle animation paths for different social platforms
  const vehicleAnimation = (animation: string) => {
    switch (animation) {
      case 'car':
        return {
          hidden: { x: -50, opacity: 0 },
          visible: {
            x: 0,
            opacity: 1,
            transition: {
              type: 'spring',
              stiffness: 500,
              damping: 15
            }
          },
          exit: {
            x: 50,
            opacity: 0,
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 20
            }
          }
        };
      case 'drone':
        return {
          hidden: { y: 20, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              type: 'spring',
              stiffness: 400,
              damping: 10
            }
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 15
            }
          }
        };
      case 'truck':
        return {
          hidden: { x: -30, y: 10, opacity: 0 },
          visible: {
            x: 0,
            y: 0,
            opacity: 1,
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 20
            }
          },
          exit: {
            x: 30,
            y: -10,
            opacity: 0,
            transition: {
              type: 'spring',
              stiffness: 250,
              damping: 15
            }
          }
        };
      case 'bike':
        return {
          hidden: { x: -20, rotate: -10, opacity: 0 },
          visible: {
            x: 0,
            rotate: 0,
            opacity: 1,
            transition: {
              type: 'spring',
              stiffness: 600,
              damping: 20
            }
          },
          exit: {
            x: 20,
            rotate: 10,
            opacity: 0,
            transition: {
              type: 'spring',
              stiffness: 500,
              damping: 15
            }
          }
        };
      default:
        return itemVariants;
    }
  };

  // Get the appropriate vehicle animation component
  const getVehicleComponent = (type: string, color: string) => {
    switch (type) {
      case 'car':
        return <CarAnimation color={color} size={28} />;
      case 'drone':
        return <DroneAnimation color={color} size={28} />;
      case 'truck':
        return <TruckAnimation color={color} size={28} />;
      case 'bike':
        return <BikeAnimation color={color} size={28} />;
      default:
        return null;
    }
  };

  // Handle click on social share buttons
  const handleShareClick = (url: string, animationType: string) => {
    setActiveAnimation(animationType);

    // Add a slight delay to allow the animation to play
    setTimeout(() => {
      window.open(url, '_blank', 'width=600,height=400');

      // Reset active animation after a bit longer to allow the animation to complete
      setTimeout(() => {
        setActiveAnimation(null);
      }, 1000);
    }, 300);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Animation Stage - Fixed at bottom of screen */}
      <AnimatePresence>
        {activeAnimation && (
          <motion.div
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            <div className="bg-[var(--bg-body)]/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 rounded-full shadow-xl">
              {getVehicleComponent(
                activeAnimation,
                socials.find(s => s.animation === activeAnimation)?.vehicleColor || '#000'
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {variant === 'default' ? (
        /* Default Style with Main Button and Popup */
        <>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="outline"
            size="sm"
            className="rounded-full flex items-center gap-2"
          >
            <FaShareAlt className="h-4 w-4" />
            <span>Share</span>
          </Button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
                className="absolute z-50 mt-2 right-0 bg-[var(--card-bg)] p-3 rounded-lg shadow-md flex flex-col items-start gap-3 border border-[var(--border-color)] min-w-[220px]"
              >
                <div className="text-sm font-medium mb-1 w-full pb-2 border-b border-border">
                  Share via
                </div>
                {socials.map((social) => (
                  <motion.div
                    key={social.name}
                    variants={vehicleAnimation(social.animation)}
                    onClick={() => handleShareClick(social.url, social.animation)}
                    className="flex items-center gap-3 w-full cursor-pointer hover:bg-muted rounded-md p-2 transition-colors"
                  >
                    <div className={cn("text-white p-2 rounded-full flex items-center justify-center", social.color)}>
                      {social.icon}
                    </div>
                    <span className="text-sm">{social.name}</span>
                    <div className="ml-auto">
                      {getVehicleComponent(social.animation, social.vehicleColor)}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        /* Minimal Style with Icons and Animations */
        <div className="flex items-center gap-2">
          <TooltipProvider>
            {socials.map((social) => (
              <Tooltip key={social.name}>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShareClick(social.url, social.animation)}
                    className={cn("p-2 rounded-full text-white relative overflow-hidden group", social.color)}
                  >
                    <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                      {social.icon}
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                      {getVehicleComponent(social.animation, '#ffffff')}
                    </span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share on {social.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default SocialShare;