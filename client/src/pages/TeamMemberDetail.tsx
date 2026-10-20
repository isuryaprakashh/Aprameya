import { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { TeamMember } from '@/lib/types';
import { teamMembers as fallbackTeamMembers } from '@/lib/data';
import { getMemberSlug, isMemberMatch } from '@/lib/slugs';
import { Button } from '@/components/ui/button';
import ChamferedButton from '@/components/ui/ChamferedButton';
import WanderingEyesLoader from '@/components/WanderingEyesLoader';
import { useToast } from '@/hooks/use-toast';
import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaArrowLeft,
  FaQrcode,
  FaDownload,
  FaCopy,
  FaUserTie,
  FaGraduationCap,
  FaUniversity,
  FaCheckCircle,
  FaCheck,
  FaExternalLinkAlt
} from 'react-icons/fa';
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
      const res = await fetch(`${baseUrl}/api/teams/${memberId}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Not found');
      return res.json();
    },
    enabled: Boolean(memberId),
    retry: 1,
  });

  // 2. Fetch full list for fallback matching (order, name, fallback data)
  const { data: allMembers = [], isLoading: isListLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/teams'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/teams`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch team members');
      return res.json();
    },
  });

  // Comprehensive fallback strategy:
  // 1. Direct fetch match
  // 2. Slug / identifier match across all database team members
  // 3. Fallback list match in data.ts
  const member: TeamMember | undefined =
    dbMember ||
    allMembers.find((m) => isMemberMatch(m, memberId)) ||
    (fallbackTeamMembers as any[]).find((m) => isMemberMatch(m, memberId));

  const isLoading = (isMemberLoading || isListLoading) && !member;

  // Build the permanent public link for this team member using their clean name slug
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const memberSlug = getMemberSlug(member?.name, member?.id || member?._id || memberId);
  const memberPublicUrl = `${currentOrigin}/team/${memberSlug}`;

  // Copy Profile URL to Clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(memberPublicUrl);
      setCopiedLink(true);
      toast({
        title: 'Profile Link Copied',
        description: 'Direct link to this team member profile has been copied to your clipboard.',
      });
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast({
        title: 'Copy Failed',
        description: 'Unable to access clipboard. Please copy link manually.',
        variant: 'destructive',
      });
    }
  };

  // Download high-resolution QR Code
  const handleDownloadQr = () => {
    if (!member) return;
    const canvas = document.getElementById('team-member-qr-canvas') as HTMLCanvasElement;
    if (!canvas) {
      toast({ title: 'Error', description: 'QR Code canvas not found', variant: 'destructive' });
      return;
    }

    try {
      // Create high-res branded export canvas
      const exportCanvas = document.createElement('canvas');
      const qrSize = 400;
      const padding = 40;
      exportCanvas.width = qrSize + padding * 2;
      exportCanvas.height = qrSize + padding * 2 + 100;
      const ctx = exportCanvas.getContext('2d');

      if (!ctx) return;

      // Dark futuristic background
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      // Border glow
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 4;
      ctx.strokeRect(8, 8, exportCanvas.width - 16, exportCanvas.height - 16);

      // Header title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(member.name, exportCanvas.width / 2, 45);

      ctx.fillStyle = '#22c55e';
      ctx.font = '14px monospace';
      ctx.fillText(member.role, exportCanvas.width / 2, 68);

      // White box for QR code for 100% scan clarity
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(padding - 10, 85, qrSize + 20, qrSize + 20);

      // Draw the QR code
      ctx.drawImage(canvas, padding, 95, qrSize, qrSize);

      // Footer branding
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('APRAMEYA AUTONOMOUS SYSTEMS LAB', exportCanvas.width / 2, exportCanvas.height - 25);

      const dataUrl = exportCanvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${member.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_qr_code.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'QR Code Downloaded',
        description: `Successfully downloaded QR badge for ${member.name}.`,
      });
    } catch (err) {
      console.error('Download error:', err);
      // Fallback direct canvas download
      const directUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${member.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_qr_code.png`;
      link.href = directUrl;
      link.click();
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <WanderingEyesLoader
        fullPage
        size="md"
        text="RETRIEVING PERSONNEL TELEMETRY"
        subtext="ACCESSING RESEARCH LAB DOSSIER"
      />
    );
  }

  // Not Found State
  if (!member) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center pt-24 pb-16 px-6">
        <div className="max-w-md w-full text-center border border-[var(--border)] bg-[var(--surface)] p-8 rounded-2xl">
          <div className="w-12 h-12 rounded-xl bg-[var(--red-soft)] border border-[var(--red-line)] text-[var(--red)] flex items-center justify-center mx-auto mb-4">
            <FaUserTie className="w-6 h-6" />
          </div>
          <p className="text-[11px] font-mono text-[var(--text-3)] uppercase tracking-wider mb-1">Status: 404 Not Found</p>
          <h2 className="text-xl font-medium font-display text-[var(--text)] mb-2">Team member not found</h2>
          <p className="text-sm text-[var(--text-2)] mb-6 leading-relaxed">
            The requested team member profile does not exist or may have been updated in the laboratory registry.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <ChamferedButton
              variant="primary"
              size="md"
              onClick={() => setLocation('/team')}
              leftIcon={<FaArrowLeft className="h-3.5 w-3.5" />}
            >
              Return to Team Roster
            </ChamferedButton>
            <ChamferedButton
              variant="secondary"
              size="md"
              onClick={() => setLocation('/')}
            >
              Back to Home
            </ChamferedButton>
          </div>
        </div>
      </div>
    );
  }

  const socialLinks = member.socialLinks || {};
  const email = member.email || socialLinks.email;
  const linkedin = member.linkedin || socialLinks.linkedin;
  const github = member.github || socialLinks.github;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans pb-28 pt-24">
      {/* Hidden high-res canvas for immediate download generation */}
      <div className="hidden">
        <QRCodeCanvas
          id="team-member-qr-canvas"
          value={memberPublicUrl}
          size={512}
          level="H"
          includeMargin={true}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Navigation Breadcrumb Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-[var(--border)]"
        >
          <div className="flex items-center gap-2">
            <ChamferedButton
              variant="secondary"
              size="sm"
              onClick={() => setLocation('/team')}
              leftIcon={<FaArrowLeft className="w-3 h-3" />}
            >
              Back to Team
            </ChamferedButton>
            <span className="text-[var(--text-3)] text-xs">/</span>
            <span className="text-xs font-mono text-[var(--text-2)] truncate max-w-[200px] sm:max-w-none">
              {member.name}
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <ChamferedButton
              variant="secondary"
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copiedLink ? <FaCheck className="w-3 h-3 text-emerald-400" /> : <FaCopy className="w-3 h-3" />}
            >
              {copiedLink ? 'Copied' : 'Share Link'}
            </ChamferedButton>
            <ChamferedButton
              variant="primary"
              size="sm"
              onClick={() => setIsQrModalOpen(true)}
              leftIcon={<FaQrcode className="w-3.5 h-3.5" />}
            >
              View QR Code
            </ChamferedButton>
          </div>
        </motion.div>

        {/* Main Member Profile Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Portrait Photograph & QR Badge Card (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Primary Portrait Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden relative group">
              {/* Photo Box */}
              <div className="relative aspect-[4/5] w-full bg-[var(--surface-2)] overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      const fb = e.currentTarget.parentElement?.querySelector('.detail-fallback-tie') as HTMLElement;
                      if (fb) fb.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex flex-col items-center justify-center bg-[var(--surface-2)] text-[var(--text-3)] p-8 detail-fallback-tie ${member.image ? 'hidden' : 'flex'}`}>
                  <FaUserTie className="w-20 h-20 mb-4 text-[var(--text-3)]" />
                  <span className="font-display text-4xl font-medium tracking-wider text-[var(--text-2)]">
                    {member.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>

                {/* Badges on Portrait */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                  {member.year && (
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text)] bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] px-3 py-1 rounded-full">
                      {member.year}
                    </span>
                  )}
                  {member.category && (
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--red)] bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] px-3 py-1 rounded-full ml-auto">
                      {member.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Identity Footer on Card */}
              <div className="p-4 border-t border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-3)]">
                    Laboratory Profile
                  </p>
                  <p className="text-xs font-mono text-[var(--red)] mt-0.5">
                    Verified Personnel
                  </p>
                </div>
                {member.order !== undefined && member.order > 0 && (
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-2)]">
                    Roster #{member.order}
                  </span>
                )}
              </div>
            </div>

            {/* Quick QR Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2">
                  <FaQrcode className="w-4 h-4 text-[var(--red)]" />
                  <h3 className="text-sm font-medium text-[var(--text)]">Quick QR Badge</h3>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-3)] uppercase">SCAN TO OPEN</span>
              </div>

              <div className="flex items-center gap-4">
                <div
                  onClick={() => setIsQrModalOpen(true)}
                  className="bg-white p-2.5 rounded-xl border border-[var(--border)] cursor-pointer transition-transform shrink-0"
                  title="Click to expand QR Code"
                >
                  <QRCodeCanvas value={memberPublicUrl} size={88} level="M" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-xs text-[var(--text-2)] leading-relaxed">
                    Scan with any smartphone camera to view or save credentials directly.
                  </p>
                  <div className="flex items-center gap-2">
                    <ChamferedButton
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsQrModalOpen(true)}
                    >
                      Enlarge
                    </ChamferedButton>
                    <ChamferedButton
                      variant="secondary"
                      size="sm"
                      onClick={handleDownloadQr}
                      leftIcon={<FaDownload className="w-2.5 h-2.5" />}
                    >
                      Download
                    </ChamferedButton>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Member Dossier & Laboratory Credentials (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Header Telemetry */}
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase text-[var(--text-3)] tracking-wider">
                Aprameya Autonomous Systems Lab
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-[var(--text)] tracking-tight">
                {member.name}
              </h1>

              <p className="text-lg sm:text-xl font-mono text-[var(--red)] font-medium">
                {member.role}
              </p>

              {/* Department & Batch Metadata Tags */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {member.department && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-2)] font-mono">
                    <FaUniversity className="w-3 h-3 text-[var(--text-3)]" />
                    <span>{member.department}</span>
                  </div>
                )}

                {member.year && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-2)] font-mono">
                    <FaGraduationCap className="w-3 h-3 text-[var(--text-3)]" />
                    <span>{member.year}</span>
                  </div>
                )}

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-400 font-mono">
                  <FaCheckCircle className="w-3 h-3" />
                  <span>Active Researcher</span>
                </div>
              </div>
            </div>

            {/* Biography & Research Dossier */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-3">
              <h2 className="text-sm font-medium text-[var(--text)] font-display border-b border-[var(--border)] pb-3">
                Laboratory Profile & Research Summary
              </h2>

              <p className="text-sm text-[var(--text-2)] leading-relaxed whitespace-pre-line font-sans">
                {member.bio ||
                  `${member.name} contributes to research, autonomous vehicle architectures, sensor calibration pipelines, and institutional robotics initiatives at Aprameya Autonomous Systems Laboratory.`}
              </p>
            </div>

            {/* Specialization Domains */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3">
              <h3 className="text-sm font-medium text-[var(--text)] font-display border-b border-[var(--border)] pb-3">
                Core Domains & Capabilities
              </h3>

              <div className="flex flex-wrap gap-2">
                {[
                  'Autonomous Navigation',
                  'ROS 2 Architecture',
                  'Computer Vision & Tracking',
                  'LiDAR SLAM',
                  'Edge Computing',
                  'CAN-Bus Integration',
                ].map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-2)] hover:border-[var(--border-strong)] transition-colors"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Public Channels & Contact Information */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-4">
              <h3 className="text-sm font-medium text-[var(--text)] font-display border-b border-[var(--border)] pb-3">
                Contact & Verification Channels
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-strong)] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-2)] flex items-center justify-center shrink-0">
                      <FaEnvelope className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-mono text-[var(--text-3)] uppercase">EMAIL</p>
                      <p className="text-xs font-medium text-[var(--text)] truncate group-hover:text-[var(--red)]">
                        {email}
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] opacity-50">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface)] text-[var(--text-3)] flex items-center justify-center shrink-0">
                      <FaEnvelope className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[var(--text-3)] uppercase">EMAIL</p>
                      <p className="text-xs text-[var(--text-3)] font-mono">Not Provided</p>
                    </div>
                  </div>
                )}

                {linkedin ? (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-strong)] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-2)] flex items-center justify-center shrink-0">
                      <FaLinkedin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-mono text-[var(--text-3)] uppercase">LINKEDIN</p>
                      <p className="text-xs font-medium text-[var(--text)] truncate group-hover:text-[var(--red)] flex items-center gap-1">
                        Connect <FaExternalLinkAlt className="w-2.5 h-2.5 opacity-70" />
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] opacity-50">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface)] text-[var(--text-3)] flex items-center justify-center shrink-0">
                      <FaLinkedin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[var(--text-3)] uppercase">LINKEDIN</p>
                      <p className="text-xs text-[var(--text-3)] font-mono">Not Provided</p>
                    </div>
                  </div>
                )}

                {github ? (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-strong)] transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-2)] flex items-center justify-center shrink-0">
                      <FaGithub className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-mono text-[var(--text-3)] uppercase">GITHUB</p>
                      <p className="text-xs font-medium text-[var(--text)] truncate group-hover:text-[var(--red)] flex items-center gap-1">
                        Repos <FaExternalLinkAlt className="w-2.5 h-2.5 opacity-70" />
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] opacity-50">
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface)] text-[var(--text-3)] flex items-center justify-center shrink-0">
                      <FaGithub className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[var(--text-3)] uppercase">GITHUB</p>
                      <p className="text-xs text-[var(--text-3)] font-mono">Not Provided</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <ChamferedButton
                variant="secondary"
                size="md"
                onClick={() => setLocation('/team')}
                leftIcon={<FaArrowLeft className="h-3.5 w-3.5" />}
              >
                All Team Members
              </ChamferedButton>

              <ChamferedButton
                variant="primary"
                size="md"
                onClick={() => setIsQrModalOpen(true)}
                leftIcon={<FaQrcode className="h-3.5 w-3.5" />}
              >
                Share Member QR Code
              </ChamferedButton>
            </div>
          </motion.div>
        </div>
      </div>

      {/* QR Code Dialog Modal */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="sm:max-w-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-2xl p-6">
          <DialogHeader className="text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--red)] flex items-center justify-center mx-auto">
              <FaQrcode className="w-5 h-5" />
            </div>
            <DialogTitle className="text-xl font-medium font-display text-[var(--text)]">
              {member.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--text-2)] font-mono">
              {member.role} — {member.department || 'Aprameya Lab'}
            </DialogDescription>
          </DialogHeader>

          {/* QR Code Canvas Frame */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="p-4 bg-white rounded-xl border border-[var(--border)]">
              <QRCodeCanvas
                value={memberPublicUrl}
                size={220}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-[11px] font-mono text-[var(--text-3)] mt-3">
              Scan with smartphone camera to view profile
            </p>
          </div>

          {/* Direct URL input with copy */}
          <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)] flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-[var(--text-2)] truncate">
              {memberPublicUrl}
            </span>
            <ChamferedButton
              size="sm"
              variant="ghost"
              onClick={handleCopyLink}
              className="h-7 px-2.5 shrink-0"
            >
              {copiedLink ? <FaCheck className="w-3.5 h-3.5 text-emerald-400" /> : <FaCopy className="w-3.5 h-3.5" />}
            </ChamferedButton>
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <ChamferedButton
              variant="secondary"
              size="md"
              onClick={() => setIsQrModalOpen(false)}
              className="flex-1"
            >
              Close
            </ChamferedButton>
            <ChamferedButton
              variant="primary"
              size="md"
              onClick={handleDownloadQr}
              className="flex-1"
              leftIcon={<FaDownload className="w-3.5 h-3.5" />}
            >
              Download QR Badge
            </ChamferedButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
