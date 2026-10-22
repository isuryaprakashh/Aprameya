import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Prefetches data for all major pages in the background with staggered delays.
 * This ensures that when a user navigates to any page, the data is already
 * available in the React Query cache — providing instant page loads.
 *
 * Prefetching is done once on mount and respects existing cache (won't refetch
 * if data was already loaded by a page the user visited first).
 */
export function usePrefetchAllData() {
  const queryClient = useQueryClient();
  const hasPrefetched = useRef(false);

  useEffect(() => {
    if (hasPrefetched.current) return;
    hasPrefetched.current = true;

    const baseUrl = import.meta.env.VITE_API_URL || '';

    const fetchWithTimeout = async (url: string, timeoutMs = 8000): Promise<any> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(`${baseUrl}${url}`, {
          credentials: 'include',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (!res.ok) return [];
        const data = await res.json();
        return data;
      } catch {
        clearTimeout(timeoutId);
        return [];
      }
    };

    // Define all the queries to prefetch, matching the exact queryKey and
    // queryFn patterns used in each page so React Query deduplicates correctly.
    const prefetchTasks: { queryKey: string[]; staleTime: number; delayMs: number }[] = [
      { queryKey: ['/api/events'],                delayMs: 500,  staleTime: 5000 },
      { queryKey: ['/api/projects'],              delayMs: 1000, staleTime: 30000 },
      { queryKey: ['/api/teams'],                 delayMs: 1500, staleTime: 30000 },
      { queryKey: ['/api/blogs'],                 delayMs: 2000, staleTime: 60000 },
      { queryKey: ['/api/research'],              delayMs: 2500, staleTime: 60000 },
      { queryKey: ['/api/recruitment/settings'],  delayMs: 3000, staleTime: Infinity },
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];

    prefetchTasks.forEach(({ queryKey, staleTime, delayMs }) => {
      const timer = setTimeout(() => {
        queryClient.prefetchQuery({
          queryKey,
          queryFn: () => fetchWithTimeout(queryKey[0]),
          staleTime,
        });
      }, delayMs);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [queryClient]);
}
