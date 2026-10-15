import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * ScrollToTop ensures that whenever the user navigates to another page
 * or route, the viewport is immediately scrolled back to the top (0, 0).
 */
export const ScrollToTop = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Instant scroll to the very top of the window
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });

    // Also reset document-level scroll positions
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // Reset any internal scroll containers across the document
    const scrollContainers = document.querySelectorAll<HTMLElement>(
      'main, .overflow-y-auto, [data-scroll-container]'
    );
    scrollContainers.forEach((container) => {
      container.scrollTop = 0;
    });
  }, [location]);

  return null;
};

export default ScrollToTop;
