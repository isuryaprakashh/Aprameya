import { Component, ErrorInfo, ReactNode } from "react";
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
                <div className="min-h-screen w-full flex items-center justify-center bg-[var(--bg)] p-4">
                    <Card className="max-w-md w-full border border-[var(--border)] bg-[var(--surface)] shadow-none rounded-[var(--r-lg)]">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto w-12 h-12 rounded-full bg-[var(--red-soft)] border border-[var(--red-line)] flex items-center justify-center mb-4">
                                <AlertCircle className="w-6 h-6 text-[var(--red)]" />
                            </div>
                            <CardTitle className="text-xl font-display font-medium text-[var(--text)] tracking-tight">
                                Something went wrong
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-center">
                            <p className="text-[var(--text-2)] text-sm">
                                An unexpected error occurred. Our team has been notified.
                            </p>

                            {import.meta.env.MODE === 'development' && this.state.error && (
                                <div className="mt-4 p-3 bg-[var(--red-soft)] border border-[var(--red-line)] rounded-[var(--r-sm)] text-left overflow-auto max-h-40">
                                    <p className="text-xs font-mono text-[var(--red-text)] break-all">
                                        {this.state.error.toString()}
                                    </p>
                                </div>
                            )}

                            <div className="pt-2">
                                <Button
                                    onClick={this.handleReload}
                                    className="w-full bg-[var(--red)] hover:bg-[var(--red-hover)] text-white rounded-[var(--r-md)] h-10 font-medium"
                                >
                                    Reload Page
                                </Button>
                                <div className="mt-4">
                                    <a href="/" className="text-xs text-[var(--text-3)] hover:text-[var(--text)] font-mono uppercase tracking-wider">
                                        ← Return to Home
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
