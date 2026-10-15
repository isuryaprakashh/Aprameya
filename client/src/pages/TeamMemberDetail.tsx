import { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { TeamMember } from '@/lib/types';
import { teamMembers as fallbackTeamMembers } from '@/lib/data';
import { getMemberSlug, isMemberMatch } from '@/lib/slugs';
import { Button } from '@/components/ui/button';
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
      <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)] flex flex-col items-center justify-center pt-24 pb-16 px-6">
        <div className="max-w-md w-full text-center border border-[var(--border-color)] bg-[var(--card-bg)] p-8 rounded-2xl shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
            <FaUserTie className="w-7 h-7" />
          </div>
          <p className="text-[11px] font-mono text-red-400 uppercase tracking-wider mb-1">STATUS: 404 NOT_FOUND</p>
          <h2 className="text-2xl font-bold font-display text-[var(--text-primary)] mb-2">Team Member Not Found</h2>
          <p className="text-xs text-[var(--text-secondary)] mb-6 leading-relaxed">
            The requested team member profile does not exist or may have been updated in the laboratory registry.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => setLocation('/team')}
              className="bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90 text-xs rounded-xl font-semibold px-5"
            >
              <FaArrowLeft className="mr-2 h-3.5 w-3.5" /> Return to Team Roster
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation('/')}
              className="border-[var(--border-color)] text-xs rounded-xl"
            >
              Back to Home
            </Button>
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
    <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-primary)] font-sans pb-28 pt-24 selection:bg-[hsl(var(--accent))]/30">
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
          className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-white/[0.06]"
        >
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/team')}
              className="text-xs text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] rounded-xl px-3 gap-2 border border-white/[0.05] hover:border-[hsl(var(--accent))]/30 transition-all"
            >
              <FaArrowLeft className="w-3 h-3" /> Back to Team Roster
            </Button>
            <span className="text-[var(--text-muted)] text-xs">/</span>
            <span className="text-xs font-mono text-[var(--text-muted)] truncate max-w-[200px] sm:max-w-none">
              {member.name}
            </span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyLink}
              className="h-8 text-xs px-3 border-[var(--border-color)] hover:border-[hsl(var(--accent))]/40 hover:text-[hsl(var(--accent))] rounded-xl gap-1.5"
            >
              {copiedLink ? <FaCheck className="w-3 h-3 text-emerald-400" /> : <FaCopy className="w-3 h-3" />}
              {copiedLink ? 'Copied' : 'Share Link'}
            </Button>
            <Button
              size="sm"
              onClick={() => setIsQrModalOpen(true)}
              className="h-8 text-xs px-3.5 bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90 font-semibold rounded-xl gap-1.5 shadow-[0_0_15px_-3px_hsl(var(--accent)/0.4)]"
            >
              <FaQrcode className="w-3.5 h-3.5" /> View QR Code
            </Button>
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
            {/* Primary Portrait Card - FULL CLARITY, NO GRAYSCALE */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] overflow-hidden shadow-[0_12px_40px_rgb(0,0,0,0.3)] relative group">
              {/* Photo Box */}
              <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full bg-zinc-950 overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      const fb = e.currentTarget.parentElement?.querySelector('.detail-fallback-tie') as HTMLElement;
                      if (fb) fb.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-600 p-8 detail-fallback-tie ${member.image ? 'hidden' : 'flex'}`}>
                  <FaUserTie className="w-24 h-24 mb-4 text-zinc-700" />
                  <span className="font-display text-4xl font-bold tracking-wider text-zinc-600">
                    {member.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>

                {/* Badges on Portrait */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
                  {member.year && (
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-red-300 bg-black/85 backdrop-blur-md border border-red-500/30 px-3 py-1 rounded-lg shadow-lg">
                      {member.year}
                    </span>
                  )}
                  {member.category && (
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[hsl(var(--accent))] bg-black/85 backdrop-blur-md border border-[hsl(var(--accent))]/40 px-3 py-1 rounded-lg shadow-lg ml-auto">
                      {member.category}
                    </span>
                  )}
                </div>

                {/* Subtle natural bottom edge gradient so face and body are 100% visible */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--card-bg)] to-transparent pointer-events-none" />
              </div>

              {/* Identity Footer on Card */}
              <div className="p-5 border-t border-[var(--border-color)] bg-black/20 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)]">
                    LABORATORY PROFILE
                  </p>
                  <p className="text-xs font-semibold text-[hsl(var(--accent))] mt-0.5">
                    Verified Personnel
                  </p>
                </div>
                {member.order !== undefined && member.order > 0 && (
                  <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/30 text-[hsl(var(--accent))] font-bold">
                    ROSTER #{member.order}
                  </span>
                )}
              </div>
            </div>

            {/* Quick QR Card */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                <div className="flex items-center gap-2">
                  <FaQrcode className="w-4 h-4 text-[hsl(var(--accent))]" />
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">Quick QR Badge</h3>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">SCAN TO OPEN</span>
              </div>

              <div className="flex items-center gap-4">
                <div
                  onClick={() => setIsQrModalOpen(true)}
                  className="bg-white p-2.5 rounded-xl border border-white/20 cursor-pointer hover:scale-105 transition-transform shrink-0 shadow-md"
                  title="Click to expand QR Code"
                >
                  <QRCodeCanvas value={memberPublicUrl} size={88} level="M" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Scan with any smartphone camera to view or save this member's credentials directly.
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsQrModalOpen(true)}
                      className="h-7 text-[11px] px-2.5 border-[var(--border-color)] hover:border-[hsl(var(--accent))]/40 hover:text-[hsl(var(--accent))] rounded-lg"
                    >
                      Enlarge
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownloadQr}
                      className="h-7 text-[11px] px-2.5 border-[var(--border-color)] hover:border-[hsl(var(--accent))]/40 hover:text-[hsl(var(--accent))] rounded-lg gap-1"
                    >
                      <FaDownload className="w-2.5 h-2.5" /> Download
                    </Button>
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
            className="lg:col-span-7 space-y-8"
          >
            {/* Header Telemetry */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--accent))] animate-pulse" />
                <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-[hsl(var(--accent))] font-semibold">
                  APRAMEYA AUTONOMOUS SYSTEMS & ROBOTICS LAB
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[var(--text-primary)] tracking-tight">
                {member.name}
              </h1>

              <p className="text-lg sm:text-xl font-mono text-[hsl(var(--accent))] font-semibold">
                {member.role}
              </p>

              {/* Department & Batch Metadata Tags */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {member.department && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-xs text-[var(--text-secondary)] font-medium">
                    <FaUniversity className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
                    <span>{member.department}</span>
                  </div>
                )}

                {member.year && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] text-xs text-[var(--text-secondary)] font-medium">
                    <FaGraduationCap className="w-3.5 h-3.5 text-red-400" />
                    <span>{member.year}</span>
                  </div>
                )}

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-400 font-medium">
                  <FaCheckCircle className="w-3.5 h-3.5" />
                  <span>Active Laboratory Researcher</span>
                </div>
              </div>
            </div>

            {/* Biography & Research Dossier */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 space-y-4 shadow-sm">
              <h2 className="text-base font-bold text-[var(--text-primary)] font-display flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                Laboratory Profile & Research Summary
              </h2>

              <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed whitespace-pre-line font-sans">
                {member.bio ||
                  `${member.name} contributes to cutting-edge research, autonomous vehicle architectures, sensor calibration pipelines, and institutional robotics initiatives at Aprameya Autonomous Systems Laboratory, KL University.`}
              </p>
            </div>

            {/* Specialization Domains */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)] font-display border-b border-[var(--border-color)] pb-3">
                Core Domains & Capabilities
              </h3>

              <div className="flex flex-wrap gap-2">
                {[
                  'Autonomous Vehicle Navigation',
                  'ROS 2 System Architecture',
                  'Computer Vision & Object Tracking',
                  'Sensor Fusion & LiDAR SLAM',
                  'Embedded Edge Computing',
                  'Hardware CAN-Bus Integration',
                ].map((spec) => (
                  <span
                    key={spec}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono bg-black/40 border border-white/[0.08] text-[var(--text-secondary)] hover:border-[hsl(var(--accent))]/40 hover:text-[hsl(var(--accent))] transition-colors"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Public Channels & Contact Information */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 space-y-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)] font-display border-b border-[var(--border-color)] pb-3">
                Contact & Verification Channels
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border-color)] bg-black/30 hover:border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/5 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] flex items-center justify-center shrink-0">
                      <FaEnvelope className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase">EMAIL</p>
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate group-hover:text-[hsl(var(--accent))]">
                        {email}
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.04] bg-black/10 opacity-60">
                    <div className="w-8 h-8 rounded-lg bg-white/5 text-[var(--text-muted)] flex items-center justify-center shrink-0">
                      <FaEnvelope className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase">EMAIL</p>
                      <p className="text-xs text-[var(--text-muted)] font-mono">Not Provided</p>
                    </div>
                  </div>
                )}

                {linkedin ? (
                  <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border-color)] bg-black/30 hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-[#0A66C2] flex items-center justify-center shrink-0">
                      <FaLinkedin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase">LINKEDIN</p>
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate group-hover:text-[#0A66C2] flex items-center gap-1">
                        Connect <FaExternalLinkAlt className="w-2.5 h-2.5 opacity-70" />
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.04] bg-black/10 opacity-60">
                    <div className="w-8 h-8 rounded-lg bg-white/5 text-[var(--text-muted)] flex items-center justify-center shrink-0">
                      <FaLinkedin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase">LINKEDIN</p>
                      <p className="text-xs text-[var(--text-muted)] font-mono">Not Provided</p>
                    </div>
                  </div>
                )}

                {github ? (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border-color)] bg-black/30 hover:border-white/40 hover:bg-white/5 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 text-[var(--text-primary)] flex items-center justify-center shrink-0">
                      <FaGithub className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase">GITHUB</p>
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate group-hover:text-[hsl(var(--accent))] flex items-center gap-1">
                        Repositories <FaExternalLinkAlt className="w-2.5 h-2.5 opacity-70" />
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.04] bg-black/10 opacity-60">
                    <div className="w-8 h-8 rounded-lg bg-white/5 text-[var(--text-muted)] flex items-center justify-center shrink-0">
                      <FaGithub className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-[var(--text-muted)] uppercase">GITHUB</p>
                      <p className="text-xs text-[var(--text-muted)] font-mono">Not Provided</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={() => setLocation('/team')}
                className="border-[var(--border-color)] hover:border-[hsl(var(--accent))]/50 hover:text-[hsl(var(--accent))] text-xs rounded-xl px-5 h-10"
              >
                <FaArrowLeft className="mr-2 h-3.5 w-3.5" /> Explore All Team Members
              </Button>

              <Button
                onClick={() => setIsQrModalOpen(true)}
                className="bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90 font-semibold text-xs rounded-xl px-5 h-10 shadow-[0_0_20px_-5px_hsl(var(--accent)/0.4)]"
              >
                <FaQrcode className="mr-2 h-3.5 w-3.5" /> Share Member QR Code
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* QR Code Dialog Modal */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="sm:max-w-md bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] rounded-2xl p-6">
          <DialogHeader className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/30 text-[hsl(var(--accent))] flex items-center justify-center mx-auto">
              <FaQrcode className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-bold font-display text-[var(--text-primary)]">
              {member.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--text-secondary)] font-mono">
              {member.role} — {member.department || 'Aprameya Lab'}
            </DialogDescription>
          </DialogHeader>

          {/* QR Code Canvas Frame */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="p-4 bg-white rounded-2xl shadow-2xl border border-white/20">
              <QRCodeCanvas
                value={memberPublicUrl}
                size={240}
                level="H"
                includeMargin={true}
              />
            </div>
            <p className="text-[11px] font-mono text-[var(--text-muted)] mt-3">
              Scan with phone camera to open profile
            </p>
          </div>

          {/* Direct URL input with copy */}
          <div className="p-3 bg-black/40 rounded-xl border border-[var(--border-color)] flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-[var(--text-secondary)] truncate">
              {memberPublicUrl}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyLink}
              className="h-7 text-xs px-2.5 text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/10 shrink-0"
            >
              {copiedLink ? <FaCheck className="w-3.5 h-3.5" /> : <FaCopy className="w-3.5 h-3.5" />}
            </Button>
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsQrModalOpen(false)}
              className="flex-1 border-[var(--border-color)] text-xs h-10 rounded-xl"
            >
              Close
            </Button>
            <Button
              onClick={handleDownloadQr}
              className="flex-1 bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90 text-xs h-10 rounded-xl font-semibold gap-2 shadow-[0_0_20px_-5px_hsl(var(--accent)/0.4)]"
            >
              <FaDownload className="w-3.5 h-3.5" /> Download QR Badge
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
