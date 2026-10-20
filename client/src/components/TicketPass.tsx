import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { TicketRegistration as TicketType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Download, RefreshCw, CheckCircle2 } from 'lucide-react';

interface TicketPassProps {
  ticket: TicketType;
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
}

export const TicketPass: React.FC<TicketPassProps> = ({
  ticket,
  eventTitle,
  eventDate,
  eventTime,
  eventLocation,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const title = eventTitle || ticket.eventTitle || 'Aprameya Event';
  const date = eventDate || ticket.eventDate || 'Upcoming';
  const location = eventLocation || 'R&D Block, KL University';
  const time = eventTime || '10:00 AM';

  const downloadQR = () => {
    const svg = document.getElementById(`ticket-qr-${ticket.id || ticket._id}`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `ticket-${ticket.rollNumber || 'pass'}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto select-none">
      {/* 3D Flip Card Container (§7.3.18 & §6.24) */}
      <div
        className="relative w-full aspect-[1/1.4] cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 w-full h-full bg-ink border border-hairline p-6 flex flex-col justify-between backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-hairline">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-signal" />
                  <span className="font-mono text-xs text-mute uppercase tracking-wider">
                    Entry Pass
                  </span>
                </div>
                <Badge variant="outline" className="font-mono text-[11px]">
                  {ticket.isAttended ? 'Verified' : 'Valid'}
                </Badge>
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-medium text-paper leading-snug">
                  {title}
                </h3>
                <div className="mt-4 space-y-2 text-xs text-mute">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3.5 text-paper" />
                    <span className="font-mono text-text-2">{date}</span>
                    <span className="text-hairline">|</span>
                    <Clock className="size-3.5 text-paper" />
                    <span className="font-mono text-text-2">{time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-paper" />
                    <span className="text-text-2">{location}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-hairline">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[11px] text-mute font-sans">Attendee</div>
                  <div className="text-sm font-medium text-paper truncate">
                    {ticket.fullName}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-mute font-sans">Roll Number</div>
                  <div className="font-mono text-sm text-paper">
                    {ticket.rollNumber}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="font-mono text-xs text-signal font-semibold">
                  {ticket.entryCode || 'APX-PASS'}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-mute hover:text-paper">
                  <RefreshCw className="size-3" />
                  <span>Tap to view QR</span>
                </div>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 w-full h-full bg-surface-1 border border-hairline p-6 flex flex-col items-center justify-between backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-hairline">
              <span className="font-mono text-xs text-mute">Scanner verification</span>
              <span className="font-mono text-xs text-paper font-medium">
                {ticket.entryCode}
              </span>
            </div>

            <div className="my-auto p-4 bg-white rounded border border-hairline flex items-center justify-center">
              <QRCodeSVG
                id={`ticket-qr-${ticket.id || ticket._id}`}
                value={ticket.qrToken || ticket.entryCode || 'APRAMEYA'}
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="w-full text-center space-y-2 pt-3 border-t border-hairline">
              <p className="font-mono text-base font-semibold text-paper">
                {ticket.entryCode}
              </p>
              <p className="text-xs text-mute">Present at entrance gate</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-center gap-3">
        <Button variant="secondary" size="sm" onClick={downloadQR} className="gap-1.5 text-xs">
          <Download className="size-3.5" />
          <span>Save QR code</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFlipped(!isFlipped)}
          className="gap-1.5 text-xs text-mute hover:text-paper"
        >
          <RefreshCw className="size-3.5" />
          <span>Flip pass</span>
        </Button>
      </div>
    </div>
  );
};

export default TicketPass;
