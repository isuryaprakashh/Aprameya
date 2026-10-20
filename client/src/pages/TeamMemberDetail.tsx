import React, { useState } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { QRCodeCanvas } from 'qrcode.react';
import { TeamMember } from '@/lib/types';
import { teamMembers as fallbackTeamMembers } from '@/lib/data';
import { isMemberMatch } from '@/lib/slugs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Copy,
  Check,
  QrCode,
  Linkedin,
  Github,
  Mail,
  User,
  Download,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export default function TeamMemberDetail() {
  const [, params] = useRoute('/teams/:id');
  const [, altParams] = useRoute('/team/:id');
  const memberId = params?.id || altParams?.id || '';
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // 1. Fetch from specific member endpoint
  const { data: dbMember, isLoading: isMemberLoading } = useQuery<TeamMember>({
    queryKey: [`/api/teams/${memberId}`],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/teams/${memberId}`);
      if (!res.ok) throw new Error('Not found');
      return res.json();
    },
    enabled: Boolean(memberId),
    retry: 1,
  });

  // 2. Fetch full list for fallback matching
  const { data: allMembers = [], isLoading: isListLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/teams'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/teams`);
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 60000,
  });

  const memberFromList = allMembers.find((m) => isMemberMatch(m, memberId));
  const fallbackMember = fallbackTeamMembers.find((m) => isMemberMatch(m, memberId));
  const member: TeamMember | undefined = dbMember || memberFromList || fallbackMember;

  const isLoading = (isMemberLoading || isListLoading) && !member;

  const memberPublicUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(memberPublicUrl);
    setCopiedLink(true);
    toast({ title: 'Link copied', description: 'Profile URL copied to clipboard.' });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadQr = () => {
    const canvas = document.getElementById('team-member-qr-canvas') as HTMLCanvasElement;
    if (canvas && member) {
      const directUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${member.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_qr.png`;
      link.href = directUrl;
      link.click();
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-ink text-paper pt-28 pb-20 px-6 md:px-12 max-w-[1200px] mx-auto space-y-8">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <Skeleton className="lg:col-span-5 aspect-[4/5] w-full" />
          <div className="lg:col-span-7 space-y-4">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </main>
    );
  }

  if (!member) {
    return (
      <main className="min-h-screen bg-ink text-paper flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full border border-hairline bg-surface-1 p-8">
          <User className="size-10 text-signal mx-auto mb-4" />
          <h1 className="text-xl font-medium text-paper mb-2">Member not found</h1>
          <p className="text-sm text-text-2 mb-6">
            The requested team member profile does not exist in the active roster.
          </p>
          <Link href="/team">
            <Button variant="primary">Return to team</Button>
          </Link>
        </div>
      </main>
    );
  }

  const socialLinks = member.socialLinks || {};
  const email = member.email || socialLinks.email;
  const linkedin = member.linkedin || socialLinks.linkedin;
  const github = member.github || socialLinks.github;

  return (
    <main className="min-h-screen bg-ink text-paper pt-28 pb-24 px-6 md:px-12 max-w-[1200px] mx-auto">
      {/* Hidden QR canvas for downloads */}
      <div className="hidden">
        <QRCodeCanvas
          id="team-member-qr-canvas"
          value={memberPublicUrl}
          size={512}
          level="H"
          includeMargin={true}
        />
      </div>

      {/* Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-hairline">
        <div className="flex items-center gap-2 text-xs text-mute">
          <Link href="/team" className="hover:text-paper transition-colors flex items-center gap-1.5">
            <ArrowLeft className="size-3.5" />
            <span>Team roster</span>
          </Link>
          <span className="text-hairline">/</span>
          <span className="text-paper truncate max-w-[200px]">{member.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleCopyLink} className="gap-1.5 text-xs">
            {copiedLink ? <Check className="size-3.5 text-ok" /> : <Copy className="size-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Share'}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsQrModalOpen(true)}
            className="gap-1.5 text-xs text-mute hover:text-paper"
          >
            <QrCode className="size-3.5" />
            <span>QR Code</span>
          </Button>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: 4:5 Portrait Card (5 cols) */}
        <div className="lg:col-span-5 border border-hairline bg-surface-1 overflow-hidden">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-2">
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-mute">
                <User className="size-16 mb-2 text-text-disabled" />
                <span className="font-mono text-xs">{member.name}</span>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-hairline flex items-center justify-between text-xs">
            <span className="text-mute font-sans">Aprameya ASC</span>
            {member.year && <span className="font-mono text-mute">{member.year}</span>}
          </div>
        </div>

        {/* Right Column: Details & Bio (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">
                {member.role || 'Core Contributor'}
              </Badge>
              {member.category && (
                <span className="text-xs text-mute font-mono">
                  {member.category}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-paper">
              {member.name}
            </h1>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" className="gap-2 text-xs">
                  <Linkedin className="size-3.5" />
                  <span>LinkedIn</span>
                </Button>
              </a>
            )}
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" className="gap-2 text-xs">
                  <Github className="size-3.5" />
                  <span>GitHub</span>
                </Button>
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`}>
                <Button variant="secondary" size="sm" className="gap-2 text-xs">
                  <Mail className="size-3.5" />
                  <span>Email</span>
                </Button>
              </a>
            )}
          </div>

          {/* Bio / Dossier */}
          <div className="pt-6 border-t border-hairline space-y-3">
            <h2 className="text-sm font-medium text-paper">About</h2>
            <p className="text-sm text-text-2 leading-relaxed">
              {member.bio ||
                `${member.name} contributes to autonomous systems development, sensor pipeline calibration, and real-time computing architectures at Aprameya ASC.`}
            </p>
          </div>
        </div>
      </div>

      {/* QR Dialog */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="max-w-sm bg-ink border-hairline text-paper p-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-base font-medium text-paper">
              {member.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-mute">
              Scan to open profile page
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 p-4 bg-white rounded border border-hairline flex items-center justify-center mx-auto">
            <QRCodeCanvas value={memberPublicUrl} size={200} level="H" />
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Button variant="secondary" size="sm" onClick={handleDownloadQr} className="gap-1.5 text-xs">
              <Download className="size-3.5" />
              <span>Download PNG</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsQrModalOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
