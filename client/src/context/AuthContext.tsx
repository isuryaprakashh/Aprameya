import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
    loginMutation: any;
    logoutMutation: any;
    registerMutation: any;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();

    const {
        data: user,
        error,
        isLoading,
    } = useQuery<User | null>({
        queryKey: ["/api/me"],
        queryFn: async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_URL || "";
                const res = await fetch(`${baseUrl}/api/me`);
                if (res.status === 401) return null;
                if (!res.ok) throw new Error("Failed to fetch user");
                return await res.json();
            } catch (e) {
                return null;
            }
        },
        staleTime: Infinity,
    });

    const loginMutation = useMutation({
        mutationFn: async (credentials: any) => {
            const res = await apiRequest("/api/login", {
                method: "POST",
                body: JSON.stringify(credentials),
            });
            return await res.json();
        },
        onSuccess: (user: User) => {
            queryClient.setQueryData(["/api/me"], user);
            toast({
                title: "Welcome back!",
                description: `Logged in as ${user.username}`,
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Login failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const registerMutation = useMutation({
        mutationFn: async (credentials: any) => {
            const res = await apiRequest("/api/register", {
                method: "POST",
                body: JSON.stringify(credentials),
            });
            return await res.json();
        },
        onSuccess: (user: User) => {
            queryClient.setQueryData(["/api/me"], user);
            toast({
                title: "Welcome!",
                description: "Account created successfully",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Registration failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            await apiRequest("/api/logout", { method: "POST" });
        },
        onSuccess: () => {
            queryClient.setQueryData(["/api/me"], null);
            toast({
                title: "Logged out",
                description: "See you soon!",
            });
        },
        onError: (error: Error) => {
            toast({
                title: "Logout failed",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    return (
        <AuthContext.Provider
            value={{
                user: user ?? null,
                isLoading,
                error: error as Error | null,
                loginMutation,
                logoutMutation,
                registerMutation,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
