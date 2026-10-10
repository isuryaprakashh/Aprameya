import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';

const QR_SECRET = process.env.QR_SECRET || 'aprameya-qr-fallback-secret';
const QR_EXPIRY_DAYS = parseInt(process.env.QR_EXPIRY_DAYS || '30', 10);

interface TicketTokenPayload {
    registrationId: string;
    eventId: string;
    rollNumber: string;
}

/**
 * Sign a JWT token containing ticket registration info.
 * This token is what gets encoded in the QR code.
 */
export function generateTicketToken(
    registrationId: string,
    eventId: string,
    rollNumber: string
): string {
    const payload: TicketTokenPayload = {
        registrationId,
        eventId,
        rollNumber,
    };

    return jwt.sign(payload, QR_SECRET, {
        expiresIn: `${QR_EXPIRY_DAYS}d`,
    });
}

/**
 * Verify and decode a QR token. Throws if invalid/expired/tampered.
 */
export function verifyTicketToken(token: string): TicketTokenPayload {
    return jwt.verify(token, QR_SECRET) as TicketTokenPayload;
}

/**
 * Generate a QR code data URL from a JWT token string.
 * This is returned to the client on registration — NOT stored in DB.
 */
export async function generateQRDataUrl(token: string): Promise<string> {
    return QRCode.toDataURL(token, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 300,
        color: {
            dark: '#000000',
            light: '#ffffff',
        },
    });
}
