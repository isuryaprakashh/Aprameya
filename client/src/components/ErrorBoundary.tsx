import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg-body)] p-4">
                    <Card className="max-w-md w-full border-red-500/20 bg-[var(--card-bg)] shadow-2xl">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                                <AlertCircle className="w-6 h-6 text-red-500" />
                            </div>
                            <CardTitle className="text-xl font-bold text-[var(--text-primary)]">
                                Something went wrong
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-center">
                            <p className="text-[var(--text-secondary)] text-sm">
                                An unexpected error occurred. Our team has been notified.
                            </p>

                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <div className="mt-4 p-3 bg-red-500/5 rounded-lg text-left overflow-auto max-h-40">
                                    <p className="text-xs font-mono text-red-400 break-all">
                                        {this.state.error.toString()}
                                    </p>
                                </div>
                            )}

                            <div className="pt-2">
                                <Button
                                    onClick={this.handleReload}
                                    className="w-full bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/90"
                                >
                                    Reload Page
                                </Button>
                                <div className="mt-4">
                                    <a href="/" className="text-xs text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] underline">
                                        Return to Home
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}
