import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMsg = res.statusText;
    try {
      const text = await res.text();
      if (text) {
        try {
          const json = JSON.parse(text);
          errorMsg = json.error || json.message || text;
        } catch {
          errorMsg = text;
        }
      }
    } catch {
      // fallback
    }
    throw new Error(errorMsg || `${res.status}`);
  }
}

type RequestOptions = {
  method?: string;
  body?: string;
  headers?: Record<string, string>;
};

export async function apiRequest(
  url: string,
  options?: RequestOptions
): Promise<Response> {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : url;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(fullUrl, {
      method: options?.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      },
      body: options?.body,
      credentials: "include",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    await throwIfResNotOk(res);
    return res;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw err;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const url = queryKey[0] as string;
      const fullUrl = url.startsWith("/") ? `${baseUrl}${url}` : url;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const res = await fetch(fullUrl, {
          credentials: "include",
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (unauthorizedBehavior === "returnNull" && res.status === 401) {
          return null;
        }

        await throwIfResNotOk(res);
        return await res.json();
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') {
          console.warn(`Query for ${url} timed out`);
        }
        throw err;
      }
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
