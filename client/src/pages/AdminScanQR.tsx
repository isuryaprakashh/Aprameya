import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Event } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    QrCode,
    Camera,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Download,
    Users,
    Loader2,
    RotateCcw,
    Shield,
    Search,
    CameraOff,
} from 'lucide-react';

interface ScanResult {
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
    ticket?: {
        fullName: string;
        rollNumber: string;
        year: number;
        scannedAt: string;
        eventTitle: string;
    };
}

interface TicketEntry {
    id: string;
    fullName: string;
    rollNumber: string;
    year: number;
    scanned: boolean;
    scannedAt: string | null;
    createdAt: string;
}

interface AdminScanQRProps {
    isEmbedded?: boolean;
}

const AdminScanQR = ({ isEmbedded = false }: AdminScanQRProps) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [selectedEventId, setSelectedEventId] = useState('');
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [manualToken, setManualToken] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [scanMode, setScanMode] = useState<'camera' | 'manual'>('manual');
    const scannerRef = useRef<any>(null);
    const html5QrCodeRef = useRef<any>(null);

    // Fetch events
    const { data: events = [] } = useQuery<Event[]>({
        queryKey: ['/api/events'],
    });

    // Fetch registrations for selected event
    const {
        data: eventData,
        refetch: refetchEventData,
        isLoading: loadingEventData,
    } = useQuery<{
        event: any;
        tickets: TicketEntry[];
        totalTickets: number;
        scannedCount: number;
    }>({
        queryKey: [`/api/tickets/event/${selectedEventId}`],
        enabled: !!selectedEventId,
    });

    // Initialize camera scanner
    const startCameraScanner = async () => {
        if (scannerRef.current) return;

        // Wait a tick for DOM checking if needed, or just check
        if (!document.getElementById('qr-reader')) {
            console.log("QR Reader element not found, skipping start");
            return;
        }

        try {
            const { Html5Qrcode } = await import('html5-qrcode');
            const scanner = new Html5Qrcode('qr-reader');
            html5QrCodeRef.current = scanner;

            await scanner.start(
                { facingMode: 'environment' },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                async (decodedText: string) => {
                    // Stop scanner after reading
                    await scanner.stop();
                    scannerRef.current = null;
                    setIsScanning(false);
                    handleScanToken(decodedText);
                },
                () => { } // Ignore errors (no QR found in frame)
            );

            scannerRef.current = scanner;
            setIsScanning(true);
        } catch (err) {
            console.error('Camera scanner error:', err);
            toast({
                title: 'Camera Error',
                description: 'Could not access camera. Try manual mode.',
                variant: 'destructive',
            });
        }
    };

    const stopCameraScanner = async () => {
        if (html5QrCodeRef.current) {
            try {
                await html5QrCodeRef.current.stop();
            } catch (err) {
                // Ignore stop errors
            }
            scannerRef.current = null;
            html5QrCodeRef.current = null;
            setIsScanning(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCameraScanner();
        };
    }, []);

    const handleScanToken = async (token: string) => {
        if (!token.trim()) return;
        setIsProcessing(true);
        setScanResult(null);

        try {
            const res = await apiRequest('/api/tickets/scan', {
                method: 'POST',
                body: JSON.stringify({
                    token: token.trim(),
                    expectedEventId: selectedEventId || undefined,
                }),
            });

            const data = await res.json();

            setScanResult({
                type: 'success',
                title: '✅ Verified!',
                message: `${data.ticket.fullName} — ${data.ticket.rollNumber}`,
                ticket: data.ticket,
            });

            // Refresh the registrations list
            if (selectedEventId) refetchEventData();
        } catch (err: any) {
            let errMsg = 'Scan failed';
            let resultType: ScanResult['type'] = 'error';
            let resultTitle = '❌ Invalid';

            try {
                const errText = err.message || '';
                if (errText.includes('{')) {
                    const json = JSON.parse(errText.substring(errText.indexOf('{')));
                    errMsg = json.error || errMsg;

                    if (json.code === 'ALREADY_SCANNED') {
                        resultType = 'warning';
                        resultTitle = '⚠️ Already Scanned';
                        toast({
                            title: 'Already Scanned',
                            description: json.scannedAt
                                ? `Masked as scanned at ${new Date(json.scannedAt).toLocaleTimeString()}`
                                : 'This ticket has taken been scanned.',
                            variant: 'destructive',
                        });
                    } else if (json.code === 'WRONG_EVENT') {
                        resultTitle = '🔀 Wrong Event';
                        toast({
                            title: 'Wrong Event',
                            description: 'This ticket is for a different event.',
                            variant: 'destructive',
                        });
                    } else if (json.code === 'EXPIRED') {
                        resultTitle = '⏰ Expired';
                        toast({
                            title: 'Ticket Expired',
                            description: 'This ticket is no longer valid.',
                            variant: 'destructive',
                        });
                    }
                }
            } catch { }

            setScanResult({
                type: resultType,
                title: resultTitle,
                message: errMsg,
            });
        } finally {
            setIsProcessing(false);
            setManualToken('');
        }
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleScanToken(manualToken);
    };

    const handleExportCSV = async () => {
        if (!selectedEventId) return;
        try {
            const baseUrl = import.meta.env.VITE_API_URL || '';
            const res = await fetch(`${baseUrl}/api/tickets/event/${selectedEventId}/export`, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Export failed');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `registrations_${selectedEventId}.csv`;
            link.click();
            window.URL.revokeObjectURL(url);

            toast({ title: 'CSV Exported', description: 'File downloaded successfully.' });
        } catch (err) {
            toast({ title: 'Export Failed', description: 'Could not export CSV.', variant: 'destructive' });
        }
    };

    if (!user || (user.role !== 'ADMIN' && user.role !== 'CORE')) {
        return (
            <div className={isEmbedded ? "flex items-center justify-center p-12" : "min-h-screen bg-[var(--bg-body)] flex items-center justify-center p-4"}>
                <Card className="max-w-md w-full bg-[var(--card-bg)] border-[var(--border-color)]">
                    <CardContent className="p-8 text-center">
                        <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Access Denied</h2>
                        <p className="text-[var(--text-secondary)]">Only admins and core team members can access the scanner.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className={isEmbedded ? "" : "min-h-screen bg-[var(--bg-body)] pt-24 pb-16 px-4"}>
            <div className={isEmbedded ? "max-w-5xl mx-auto" : "container mx-auto max-w-5xl"}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[hsl(var(--accent))]/10 rounded-xl flex items-center justify-center">
                            <QrCode className="w-5 h-5 text-[hsl(var(--accent))]" />
                        </div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Scan Tickets</h1>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm ml-[52px]">
                        Verify event attendance by scanning QR codes
                    </p>
                </motion.div>

                {/* Event Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <Card className="bg-[var(--card-bg)] border-[var(--border-color)]">
                        <CardContent className="p-5">
                            <Label className="text-[var(--text-secondary)] text-sm mb-2 block">Select Event</Label>
                            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                                <SelectTrigger className="bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-primary)]">
                                    <SelectValue placeholder="Choose an event to scan for..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {events.map((ev) => (
                                        <SelectItem key={ev.id} value={ev.id}>
                                            {ev.title} — {ev.date}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {eventData && (
                                <div className="flex gap-4 mt-4 text-sm">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-body)]">
                                        <Users className="w-4 h-4 text-[hsl(var(--accent))]" />
                                        <span className="text-[var(--text-secondary)]">Total:</span>
                                        <span className="font-semibold text-[var(--text-primary)]">{eventData.totalTickets}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/5">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span className="text-[var(--text-secondary)]">Scanned:</span>
                                        <span className="font-semibold text-green-500">{eventData.scannedCount}</span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Scanner */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="bg-[var(--card-bg)] border-[var(--border-color)]">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
                                        <Camera className="w-5 h-5 text-[hsl(var(--accent))]" />
                                        Scanner
                                    </CardTitle>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant={scanMode === 'camera' ? 'default' : 'outline'}
                                            onClick={async () => {
                                                if (scanMode === 'camera') return;
                                                // Switch TO camera: mode first (to render div), then start (via button or effect?)
                                                // Actually the 'Start Camera' button handles the start.
                                                // We just need to ensure we stop if we were somehow in manual (which doesn't have a scanner running).
                                                // But usually manual doesn't have a running scanner. 
                                                // Safe to just switch mode.
                                                setScanMode('camera');
                                            }}
                                            className="text-xs"
                                        >
                                            <Camera className="w-3 h-3 mr-1" />
                                            Camera
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={scanMode === 'manual' ? 'default' : 'outline'}
                                            onClick={async () => {
                                                if (scanMode === 'manual') return;
                                                // Switch TO manual: Must STOP camera first because manual view REMOVES the qr-reader div.
                                                await stopCameraScanner();
                                                setScanMode('manual');
                                            }}
                                            className="text-xs"
                                        >
                                            <Search className="w-3 h-3 mr-1" />
                                            Manual
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>

                                {/* Camera Mode UI - Always rendered but hidden when not active to prevent DOM thrashing */}
                                <div className={scanMode === 'camera' ? 'block' : 'hidden'}>
                                    <div className="space-y-4">
                                        <div className="relative rounded-lg overflow-hidden bg-black/5 min-h-[280px]">
                                            {/* Scanner Container - React leaves this empty for the library */}
                                            <div id="qr-reader" className="w-full h-full" />

                                            {/* Placeholder Overlay - React manages this fully */}
                                            {!isScanning && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/5 z-10">
                                                    <div className="text-center p-6">
                                                        <CameraOff className="w-10 h-10 text-[var(--text-secondary)] mx-auto mb-3" />
                                                        <p className="text-sm text-[var(--text-secondary)]">Camera not active</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-3">
                                            {!isScanning ? (
                                                <Button
                                                    onClick={startCameraScanner}
                                                    className="flex-1 bg-[hsl(var(--accent))] text-[var(--bg-body)]"
                                                >
                                                    <Camera className="w-4 h-4 mr-2" />
                                                    Start Camera
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={stopCameraScanner}
                                                    variant="outline"
                                                    className="flex-1"
                                                >
                                                    <CameraOff className="w-4 h-4 mr-2" />
                                                    Stop Camera
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Manual Mode UI */}
                                <div className={scanMode === 'manual' ? 'block' : 'hidden'}>
                                    <form onSubmit={handleManualSubmit} className="space-y-4">
                                        <div>
                                            <Label className="text-[var(--text-secondary)]">Paste QR Token</Label>
                                            <Input
                                                value={manualToken}
                                                onChange={(e) => setManualToken(e.target.value)}
                                                placeholder="Paste the QR code content here..."
                                                className="mt-1.5 bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-primary)] font-mono text-xs"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={!manualToken.trim() || isProcessing}
                                            className="w-full bg-[hsl(var(--accent))] text-[var(--bg-body)]"
                                        >
                                            {isProcessing ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                            )}
                                            Verify Token
                                        </Button>
                                    </form>
                                </div>

                                {/* Scan Result */}
                                <AnimatePresence mode="wait">
                                    {scanResult && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className={`mt-6 p-4 rounded-xl border ${scanResult.type === 'success'
                                                ? 'bg-green-500/5 border-green-500/20'
                                                : scanResult.type === 'warning'
                                                    ? 'bg-yellow-500/5 border-yellow-500/20'
                                                    : 'bg-red-500/5 border-red-500/20'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {scanResult.type === 'success' ? (
                                                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                                                ) : scanResult.type === 'warning' ? (
                                                    <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
                                                ) : (
                                                    <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                                                )}
                                                <div>
                                                    <h4 className="font-semibold text-[var(--text-primary)]">{scanResult.title}</h4>
                                                    <p className="text-sm text-[var(--text-secondary)] mt-1">{scanResult.message}</p>
                                                    {scanResult.ticket && (
                                                        <div className="mt-3 text-xs text-[var(--text-secondary)] space-y-1">
                                                            <p>Year: {scanResult.ticket.year}</p>
                                                            <p>Event: {scanResult.ticket.eventTitle}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => setScanResult(null)}
                                                className="mt-3 text-xs"
                                            >
                                                <RotateCcw className="w-3 h-3 mr-1" />
                                                Scan Next
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Registrations Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="bg-[var(--card-bg)] border-[var(--border-color)]">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
                                        <Users className="w-5 h-5 text-[hsl(var(--accent))]" />
                                        Registrations
                                    </CardTitle>
                                    {selectedEventId && (
                                        <Button size="sm" variant="outline" onClick={handleExportCSV} className="text-xs">
                                            <Download className="w-3 h-3 mr-1" />
                                            Export CSV
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {!selectedEventId ? (
                                    <div className="text-center py-12 text-[var(--text-secondary)]">
                                        <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                        <p className="text-sm">Select an event to view registrations</p>
                                    </div>
                                ) : loadingEventData ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin text-[hsl(var(--accent))]" />
                                    </div>
                                ) : eventData?.tickets.length === 0 ? (
                                    <div className="text-center py-12 text-[var(--text-secondary)]">
                                        <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                        <p className="text-sm">No registrations yet</p>
                                    </div>
                                ) : (
                                    <div className="max-h-[500px] overflow-y-auto">
                                        <table className="w-full text-sm">
                                            <thead className="sticky top-0 bg-[var(--card-bg)]">
                                                <tr className="border-b border-[var(--border-color)]">
                                                    <th className="text-left py-2 px-2 text-xs text-[var(--text-secondary)] font-medium">Name</th>
                                                    <th className="text-left py-2 px-2 text-xs text-[var(--text-secondary)] font-medium">Roll No.</th>
                                                    <th className="text-center py-2 px-2 text-xs text-[var(--text-secondary)] font-medium">Year</th>
                                                    <th className="text-center py-2 px-2 text-xs text-[var(--text-secondary)] font-medium">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {eventData?.tickets.map((ticket) => (
                                                    <tr key={ticket.id} className="border-b border-[var(--border-color)]/50 hover:bg-[var(--bg-body)]/50 transition-colors">
                                                        <td className="py-2.5 px-2 text-[var(--text-primary)] font-medium">{ticket.fullName}</td>
                                                        <td className="py-2.5 px-2 text-[var(--text-secondary)] font-mono text-xs">{ticket.rollNumber}</td>
                                                        <td className="py-2.5 px-2 text-center text-[var(--text-secondary)]">{ticket.year}</td>
                                                        <td className="py-2.5 px-2 text-center">
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-[10px] ${ticket.scanned
                                                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                                    : 'bg-[var(--bg-body)] text-[var(--text-secondary)] border-[var(--border-color)]'
                                                                    }`}
                                                            >
                                                                {ticket.scanned ? '✓ Scanned' : 'Pending'}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AdminScanQR;
