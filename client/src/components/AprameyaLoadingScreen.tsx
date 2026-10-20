import React, { useEffect } from 'react';

interface AprameyaLoadingScreenProps {
  fullScreen?: boolean;
  minDuration?: number;
  message?: string;
  onComplete?: () => void;
}

/**
 * @deprecated Removed per DESIGN.md §7.6.8 ("A full-screen preloader delays LCP,
 * and the brand moment now lives in the hero. Page loads use skeletons.")
 */
export const AprameyaLoadingScreen: React.FC<AprameyaLoadingScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    if (onComplete) onComplete();
  }, [onComplete]);

  return null;
};

export default AprameyaLoadingScreen;
