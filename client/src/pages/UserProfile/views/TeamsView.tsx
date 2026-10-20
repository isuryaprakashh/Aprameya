import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaLinkedin,
  FaGithub,
  FaEnvelope,
  FaUserTie,
  FaArrowLeft,
  FaSave,
  FaUpload,
  FaImage,
  FaCheck,
  FaQrcode,
  FaEye,
  FaDownload,
  FaCopy,
  FaExternalLinkAlt,
  FaArrowUp,
  FaArrowDown
} from 'react-icons/fa';
import { QRCodeCanvas } from 'qrcode.react';
import { getMemberSlug } from '@/lib/slugs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { TeamMember } from '@/lib/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Ring } from '@/components/ui/ring';
import { FormActions } from '@/components/ui/FormActions';
import { compressImage } from '@/lib/imageUtils';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = ['All', 'Club Leads', 'Mentors', 'Advisors'];
const FORM_CATEGORIES = ['Club Leads', 'Mentors', 'Advisors'];

const PRESET_AVATARS = [
  { label: 'Lab UVH', url: '/assets/UVH.jpg' },
];

export default function TeamsView() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // View state: 'list' | 'editor'
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAdmin) {
    return (
      <div className="p-12 text-center rounded-[var(--r-lg)] border border-hairline bg-surface-1">
        <h3 className="font-display font-medium text-lg text-paper mb-2">Access Restricted</h3>
        <p className="text-xs text-mute font-mono">
          Only administrators have permission to edit and manage team members data.
        </p>
      </div>
    );
  }
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [qrModalMember, setQrModalMember] = useState<TeamMember | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    category: 'Core Team',
    department: '',
    year: '',
    image: '',
    bio: '',
    email: '',
    linkedin: '',
    github: '',
    order: 0,
  });

  const { data: teamMembers = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ['/api/teams'],
    queryFn: async () => {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      try {
        const res = await fetch(`${baseUrl}/api/teams`, { credentials: 'include', signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('Failed to fetch teams');
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    },
    staleTime: 30000,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: Partial<TeamMember>) =>
      apiRequest('/api/teams', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      toast({ title: 'Success', description: 'Team member added successfully' });
      setViewMode('list');
    },
    onError: (err: any) => {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('not authenticated') || msg.includes('401')) {
        toast({
          title: 'Session Expired',
          description: 'Your login session has expired. Redirecting to login...',
          variant: 'destructive',
        });
        setTimeout(() => {
          window.location.href = '/login?redirect=/dashboard';
        }, 1200);
      } else {
        toast({ title: 'Error', description: msg || 'Failed to add team member', variant: 'destructive' });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<TeamMember>) =>
      apiRequest(`/api/teams/${data.id || data._id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      toast({ title: 'Success', description: 'Team member updated successfully' });
      setViewMode('list');
    },
    onError: (err: any) => {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('not authenticated') || msg.includes('401')) {
        toast({
          title: 'Session Expired',
          description: 'Your login session has expired. Redirecting to login...',
          variant: 'destructive',
        });
        setTimeout(() => {
          window.location.href = '/login?redirect=/dashboard';
        }, 1200);
      } else {
        toast({ title: 'Error', description: msg || 'Failed to update team member', variant: 'destructive' });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/teams/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      toast({ title: 'Deleted', description: 'Team member removed' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to delete member', variant: 'destructive' });
    },
  });

  const [isReordering, setIsReordering] = useState(false);

  const reorderMutation = useMutation({
    mutationFn: (orders: { id: string; order: number }[]) =>
      apiRequest('/api/teams/reorder', {
        method: 'POST',
        body: JSON.stringify({ orders }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      toast({ title: 'Order Saved', description: 'Team roster order updated successfully.' });
    },
    onError: (err: any) => {
      toast({ title: 'Error', description: err.message || 'Failed to save order', variant: 'destructive' });
    },
    onSettled: () => {
      setIsReordering(false);
    },
  });

  const handleMoveOrder = (member: TeamMember, direction: 'up' | 'down') => {
    const memberId = member.id || member._id;
    const currentIndex = filteredMembers.findIndex((m) => (m.id || m._id) === memberId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= filteredMembers.length) return;

    setIsReordering(true);

    const newItems = [...filteredMembers];
    const [moved] = newItems.splice(currentIndex, 1);
    newItems.splice(targetIndex, 0, moved);

    const ordersToSave = newItems.map((m, idx) => ({
      id: (m.id || m._id)!,
      order: idx + 1,
    }));

    // Optimistically update query cache for instant feedback
    queryClient.setQueryData<TeamMember[]>(['/api/teams'], (old = []) => {
      const orderMap = new Map(ordersToSave.map((o) => [o.id, o.order]));
      return old
        .map((m) => {
          const id = m.id || m._id;
          if (id && orderMap.has(id)) {
            return { ...m, order: orderMap.get(id)! };
          }
          return m;
        })
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    });

    reorderMutation.mutate(ordersToSave);
  };

  const isSaving = createMutation.isPending || updateMutation.isPending || isReordering;

  // Open Editor for Creating
  const startCreate = () => {
    const defaultCat =
      selectedCategory === 'Mentors'
        ? 'Mentors'
        : selectedCategory === 'Advisors'
        ? 'Advisors'
        : 'Club Leads';

    setFormData({
      name: '',
      role: '',
      category: defaultCat,
      department: '',
      year: '',
      image: '',
      bio: '',
      email: '',
      linkedin: '',
      github: '',
      order: (teamMembers.length || 0) + 1,
    });
    setViewMode('editor');
  };

  // Open Editor for Editing
  const startEdit = (member: TeamMember) => {
    setFormData({
      id: member.id || member._id,
      _id: member._id || member.id,
      name: member.name || '',
      role: member.role || '',
      category: member.category || 'Core Team',
      department: member.department || '',
      year: member.year || '',
      image: member.image || '',
      bio: member.bio || '',
      email: member.email || member.socialLinks?.email || '',
      linkedin: member.linkedin || member.socialLinks?.linkedin || '',
      github: member.github || member.socialLinks?.github || '',
      order: member.order ?? 0,
    });
    setViewMode('editor');
  };

  const handleInputChange = (field: keyof TeamMember, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Image upload handler using shared compression utility
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedUrl = await compressImage(file, 800, 0.85);
      handleInputChange('image', compressedUrl);
      toast({ title: 'Image Uploaded', description: 'Photo loaded and ready to save.' });
    } catch (err: any) {
      toast({
        title: 'Upload Error',
        description: err.message || 'Please choose an image file (PNG, JPG, WEBP).',
        variant: 'destructive',
      });
    }
  };

  const handleSave = () => {
    if (!formData.name?.trim()) {
      toast({ title: 'Validation Error', description: 'Member name is required', variant: 'destructive' });
      return;
    }
    if (!formData.role?.trim()) {
      toast({ title: 'Validation Error', description: 'Role / Designation is required', variant: 'destructive' });
      return;
    }

    const payload = {
      ...formData,
      order: Number(formData.order) || 0,
    };

    if (payload.id || payload._id) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleViewQr = (member: TeamMember) => {
    setQrModalMember(member);
  };

  const handleCopyQrLink = async (member: TeamMember) => {
    const slug = getMemberSlug(member.name, member.id || member._id);
    const url = `${window.location.origin}/team/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      toast({ title: 'Link Copied', description: 'Team member profile link copied to clipboard' });
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast({ title: 'Copy Failed', description: 'Could not access clipboard', variant: 'destructive' });
    }
  };

  const handleDownloadQr = (member: TeamMember) => {
    const memberId = member.id || member._id;
    try {
      const existingCanvas = document.getElementById(`qr-admin-hidden-${memberId}`) as HTMLCanvasElement;
      if (!existingCanvas) {
        toast({ title: 'Error', description: 'QR Canvas not initialized', variant: 'destructive' });
        return;
      }

      // Render high-res export image with badge frame
      const exportCanvas = document.createElement('canvas');
      const qrSize = 400;
      const padding = 40;
      exportCanvas.width = qrSize + padding * 2;
      exportCanvas.height = qrSize + padding * 2 + 100;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      // Dark background
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      // Border glow
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 4;
      ctx.strokeRect(8, 8, exportCanvas.width - 16, exportCanvas.height - 16);

      // Member name & role
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(member.name, exportCanvas.width / 2, 45);

      ctx.fillStyle = '#22c55e';
      ctx.font = '14px monospace';
      ctx.fillText(member.role, exportCanvas.width / 2, 68);

      // White container for QR code
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(padding - 10, 85, qrSize + 20, qrSize + 20);
      ctx.drawImage(existingCanvas, padding, 95, qrSize, qrSize);

      // Footer branding
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('APRAMEYA AUTONOMOUS SYSTEMS LAB', exportCanvas.width / 2, exportCanvas.height - 25);

      const dataUrl = exportCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `${member.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_qr_code.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: 'QR Code Downloaded',
        description: `Successfully downloaded QR badge for ${member.name}.`,
      });
    } catch (err) {
      console.error('Download QR error:', err);
      toast({ title: 'Download Error', description: 'Failed to download QR code image', variant: 'destructive' });
    }
  };

  const isMentor = (m: TeamMember) => {
    const c = (m.category || '').toLowerCase();
    const r = (m.role || '').toLowerCase();
    const y = (m.year || '').toLowerCase();
    return (
      c.includes('mentor') ||
      c.includes('faculty') ||
      r.includes('mentor') ||
      r.includes('faculty') ||
      y.includes('faculty')
    );
  };

  const isAdvisor = (m: TeamMember) => {
    const c = (m.category || '').toLowerCase();
    const r = (m.role || '').toLowerCase();
    return !isMentor(m) && (c.includes('advisor') || r.includes('advisor'));
  };

  const isClubLead = (m: TeamMember) => {
    return !isMentor(m) && !isAdvisor(m);
  };

  const filteredMembers = teamMembers.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.department && m.department.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Mentors') return isMentor(m);
    if (selectedCategory === 'Club Leads') return isClubLead(m);
    if (selectedCategory === 'Advisors') return isAdvisor(m);

    return true;
  }).slice().sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  // ==========================================
  // FULL PAGE EDITOR VIEW (No Popup Dialog)
  // ==========================================
  if (viewMode === 'editor') {
    const isEditing = Boolean(formData.id || formData._id);

    return (
      <div className="space-y-8 max-w-5xl mx-auto pb-16 animate-fadeIn">
        {/* Navigation Breadcrumb / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-color)]">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className="text-xs text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] mb-2 -ml-2 gap-1.5"
            >
              <FaArrowLeft className="w-3 h-3" /> Back to Team
            </Button>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[var(--text-primary)]">
              {isEditing ? `Edit Team Member: ${formData.name}` : 'Add New Team Member'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
              Update personal identity, laboratory role, and profile photograph
            </p>
          </div>
        </div>

        {/* Editor Content Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Team Image Editor */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
              <div>
                <h3 className="text-sm font-display font-medium text-[var(--text)] flex items-center gap-2">
                  <FaImage className="text-[var(--red)]" /> Member Photograph
                </h3>
                <p className="text-xs text-[var(--text-2)] mt-0.5">
                  Upload an image from your computer, provide a URL, or pick a preset avatar.
                </p>
              </div>

              {/* Photo Preview Card */}
              <div className="relative aspect-[4/5] rounded-[var(--r-md)] overflow-hidden bg-black/60 border border-[var(--border)] group flex items-center justify-center">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt={formData.name || 'Team member'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="text-center p-6 text-[var(--text-3)]">
                    <FaUserTie className="w-16 h-16 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-mono">NO IMAGE ASSIGNED</p>
                  </div>
                )}

                {/* Live Badge Overlays */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  {formData.year && (
                    <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-[var(--red-text)] bg-black/80 backdrop-blur-md border border-[var(--red-line)] px-2 py-0.5 rounded-[var(--r-sm)]">
                      {formData.year}
                    </span>
                  )}
                  {formData.category && (
                    <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-[var(--text)] bg-black/80 backdrop-blur-md border border-[var(--border)] px-2 py-0.5 rounded-[var(--r-sm)] ml-auto">
                      {formData.category}
                    </span>
                  )}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Upload Controls */}
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-[var(--border-color)] hover:border-[hsl(var(--accent))]/50 hover:text-[hsl(var(--accent))] text-xs h-10 rounded-xl gap-2 font-medium"
                >
                  <FaUpload className="w-3.5 h-3.5" /> Upload Image from Computer
                </Button>

                {/* Direct URL input */}
                <div>
                  <Label className="text-xs text-[var(--text-secondary)] font-mono">Or Image URL / Path</Label>
                  <Input
                    placeholder="https://... or upload photo above"
                    value={formData.image || ''}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    className="mt-1 bg-[var(--bg-body)] border-[var(--border-color)] text-xs rounded-xl"
                  />
                </div>

                {/* Preset Avatars Library */}
                <div className="pt-2">
                  <Label className="text-xs text-[var(--text-secondary)] font-mono mb-2 block">
                    Preset Club Avatars
                  </Label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_AVATARS.map((preset) => {
                      const isSelected = formData.image === preset.url;
                      return (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => handleInputChange('image', preset.url)}
                          className={`relative aspect-square rounded-lg overflow-hidden border transition-all ${
                            isSelected
                              ? 'border-[hsl(var(--accent))] ring-2 ring-[hsl(var(--accent))]/30 scale-105'
                              : 'border-[var(--border-color)] opacity-70 hover:opacity-100 hover:border-white/30'
                          }`}
                          title={preset.label}
                        >
                          <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[hsl(var(--accent))]/20 flex items-center justify-center">
                              <FaCheck className="w-3 h-3 text-[hsl(var(--accent))]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {formData.image && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleInputChange('image', '')}
                    className="w-full text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 rounded-lg"
                  >
                    Remove Photo
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Member Details Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-5">
              <h3 className="text-sm font-display font-medium text-[var(--text)] border-b border-[var(--border)] pb-3">
                Laboratory Personnel Identity
              </h3>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <Label htmlFor="memberName" className="text-xs font-mono text-[var(--text-3)]">
                    Full Name <span className="text-[var(--red)]">*</span>
                  </Label>
                  <Input
                    id="memberName"
                    placeholder="e.g. Singavarapu Sai Revanth"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1 bg-[var(--surface-2)] border-[var(--border)] text-sm rounded-[var(--r-md)]"
                  />
                </div>

                {/* Role */}
                <div>
                  <Label htmlFor="memberRole" className="text-xs font-mono text-[var(--text-secondary)]">
                    Role / Laboratory Designation <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="memberRole"
                    placeholder="e.g. Core Team Lead, Perception & Vision Lead"
                    value={formData.role || ''}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="mt-1 bg-[var(--bg-body)] border-[var(--border-color)] text-sm rounded-xl"
                  />
                </div>

                {/* Category & Order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memberCategory" className="text-xs font-mono text-[var(--text-secondary)]">
                      Roster Category
                    </Label>
                    <select
                      id="memberCategory"
                      value={formData.category || 'Club Leads'}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="mt-1 w-full px-3 py-2.5 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[hsl(var(--accent))]"
                    >
                      {FORM_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="memberOrder" className="text-xs font-mono text-[var(--text-secondary)]">
                      Display Sequence Order
                    </Label>
                    <Input
                      id="memberOrder"
                      type="number"
                      placeholder="1, 2, 3..."
                      value={formData.order ?? 0}
                      onChange={(e) => handleInputChange('order', e.target.value)}
                      className="mt-1 bg-[var(--bg-body)] border-[var(--border-color)] text-sm rounded-xl"
                    />
                  </div>
                </div>

                {/* Department & Year */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="memberDept" className="text-xs font-mono text-[var(--text-secondary)]">
                      Department / Specialization
                    </Label>
                    <Input
                      id="memberDept"
                      placeholder="e.g. Computer Science & Engineering"
                      value={formData.department || ''}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="mt-1 bg-[var(--bg-body)] border-[var(--border-color)] text-sm rounded-xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="memberYear" className="text-xs font-mono text-[var(--text-secondary)]">
                      Year / Status Tag
                    </Label>
                    <Input
                      id="memberYear"
                      placeholder="e.g. Faculty, Core Team, 4th Year"
                      value={formData.year || ''}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className="mt-1 bg-[var(--bg-body)] border-[var(--border-color)] text-sm rounded-xl"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="memberBio" className="text-xs font-mono text-[var(--text-secondary)]">
                    Bio / Technical Summary
                  </Label>
                  <Textarea
                    id="memberBio"
                    rows={3}
                    placeholder="Brief description of specialized autonomy research, sensor fusion work, or lab leadership..."
                    value={formData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="mt-1 bg-[var(--surface-2)] border-[var(--border)] text-sm rounded-[var(--r-md)]"
                  />
                </div>
              </div>
            </div>

            {/* Social & Contact Card */}
            <div className="rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4">
              <h3 className="text-sm font-display font-medium text-[var(--text)] border-b border-[var(--border)] pb-3">
                Contact & Public Channels
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="memberEmail" className="text-xs font-mono text-[var(--text-secondary)]">
                    Email Address
                  </Label>
                  <Input
                    id="memberEmail"
                    placeholder="user@kluniversity.in"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1 bg-[var(--bg-body)] border-[var(--border-color)] text-xs rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="memberLinkedin" className="text-xs font-mono text-[var(--text-secondary)]">
                    LinkedIn URL
                  </Label>
                  <Input
                    id="memberLinkedin"
                    placeholder="https://linkedin.com/in/..."
                    value={formData.linkedin || ''}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    className="mt-1 bg-[var(--bg-body)] border-[var(--border-color)] text-xs rounded-xl"
                  />
                </div>

                <div>
                  <Label htmlFor="memberGithub" className="text-xs font-mono text-[var(--text-secondary)]">
                    GitHub URL
                  </Label>
                  <Input
                    id="memberGithub"
                    placeholder="https://github.com/..."
                    value={formData.github || ''}
                    onChange={(e) => handleInputChange('github', e.target.value)}
                    className="mt-1 bg-[var(--bg-body)] border-[var(--border-color)] text-xs rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <FormActions
              onCancel={() => setViewMode('list')}
              onSave={handleSave}
              isSaving={isSaving}
              saveLabel="Save Changes"
              cancelLabel="Cancel"
            />
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ROSTER LIST VIEW (Default Page View)
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Team Management
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">
            {teamMembers.length} verified laboratory personnel and core leads
          </p>
        </div>
        <Button
          onClick={startCreate}
          className="bg-[var(--red)] hover:bg-[var(--red-hover)] text-white font-medium text-xs h-9 px-4 rounded-[var(--r-md)] transition-all self-start sm:self-auto gap-1.5 shadow-sm"
        >
          <FaPlus className="mr-1.5 h-3.5 w-3.5" /> Add Team Member
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-3)] w-3.5 h-3.5" />
          <Input
            placeholder="Search team member by name, role, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[var(--surface)] border-[var(--border)] text-sm rounded-[var(--r-md)]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-[var(--r-sm)] text-xs font-mono transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[var(--text)] text-[var(--bg)] font-medium'
                  : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--text)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      {isLoading && teamMembers.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2">
          <Ring size={20} />
          <span className="text-xs text-mute font-sans">Loading team...</span>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="p-12 text-center rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)]">
          <p className="font-mono text-xs text-[var(--text-3)] mb-2">STATUS: 204 NO_CONTENT</p>
          <h3 className="text-base font-display font-medium text-[var(--text)] mb-1">No Team Members Found</h3>
          <p className="text-xs text-[var(--text-2)] max-w-sm mx-auto mb-4">
            {searchTerm || selectedCategory !== 'All'
              ? 'No team members match your current filters. Try resetting search.'
              : 'Add your first faculty mentor or core lead to display on the public Teams page.'}
          </p>
          <Button
            onClick={startCreate}
            className="bg-[var(--red)] text-white hover:bg-[var(--red-hover)] text-xs px-3.5 py-2 rounded-[var(--r-md)]"
          >
            <FaPlus className="mr-1.5 h-3 w-3" /> Add Member
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member, index) => (
            <div
              key={member.id || member._id}
              className="rounded-[var(--r-lg)] border border-[var(--border)] bg-[var(--surface)] p-5 flex flex-col justify-between hover:border-[var(--border-strong)] transition-all duration-300 group relative overflow-hidden"
            >
              <div>
                <div className="flex items-start gap-4 mb-3">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-[var(--r-md)] overflow-hidden bg-black/40 border border-[var(--border)] shrink-0 flex items-center justify-center relative group-hover:border-[var(--border-strong)] transition-colors">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top transition-all duration-300"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                          const fb = e.currentTarget.parentElement?.querySelector('.member-fallback-tie') as HTMLElement;
                          if (fb) fb.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full items-center justify-center member-fallback-tie ${member.image ? 'hidden' : 'flex'}`}>
                      <FaUserTie className="w-6 h-6 text-[var(--text-muted)]" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm text-[var(--text-primary)] truncate">
                        {member.name}
                      </h4>
                      {/* Interactive Reordering Controls */}
                      <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg border border-[var(--border-color)] bg-black/50 text-[var(--text-muted)] text-[10px] font-mono shadow-sm shrink-0">
                        <button
                          type="button"
                          disabled={index === 0 || isReordering}
                          onClick={() => handleMoveOrder(member, 'up')}
                          className="hover:text-red-400 disabled:opacity-20 disabled:hover:text-[var(--text-muted)] p-1 rounded transition-colors active:scale-95"
                          title="Move member up in order"
                        >
                          <FaArrowUp className="w-2.5 h-2.5" />
                        </button>
                        <span className="font-bold px-1 text-red-400">
                          #{member.order !== undefined && member.order > 0 ? member.order : index + 1}
                        </span>
                        <button
                          type="button"
                          disabled={index === filteredMembers.length - 1 || isReordering}
                          onClick={() => handleMoveOrder(member, 'down')}
                          className="hover:text-red-400 disabled:opacity-20 disabled:hover:text-[var(--text-muted)] p-1 rounded transition-colors active:scale-95"
                          title="Move member down in order"
                        >
                          <FaArrowDown className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[hsl(var(--accent))] font-medium mt-0.5 truncate">
                      {member.role}
                    </p>
                    {member.category && (
                      <span className="inline-block mt-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] border border-[hsl(var(--accent))]/20">
                        {member.category}
                      </span>
                    )}
                  </div>
                </div>

                {member.department && (
                  <p className="text-xs text-[var(--text-secondary)] mb-2 font-sans">
                    <span className="text-[var(--text-muted)] font-mono text-[11px]">Dept:</span> {member.department}
                  </p>
                )}

                {member.year && (
                  <p className="text-xs text-[var(--text-secondary)] mb-2 font-sans">
                    <span className="text-[var(--text-muted)] font-mono text-[11px]">Year/Batch:</span> {member.year}
                  </p>
                )}

                {member.bio && (
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3 leading-relaxed">
                    {member.bio}
                  </p>
                )}

                {/* Social Links */}
                <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-color)]/60 text-xs text-[var(--text-muted)]">
                  {(member.email || member.socialLinks?.email) && (
                    <a
                      href={`mailto:${member.email || member.socialLinks?.email}`}
                      className="hover:text-[var(--text-primary)] transition-colors p-1"
                      title={member.email || member.socialLinks?.email}
                    >
                      <FaEnvelope className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {(member.linkedin || member.socialLinks?.linkedin) && (
                    <a
                      href={member.linkedin || member.socialLinks?.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#0A66C2] transition-colors p-1"
                      title="LinkedIn"
                    >
                      <FaLinkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {(member.github || member.socialLinks?.github) && (
                    <a
                      href={member.github || member.socialLinks?.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--text-primary)] transition-colors p-1"
                      title="GitHub"
                    >
                      <FaGithub className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[var(--border-color)]">
                {/* Quick Reorder Buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    disabled={index === 0 || isReordering}
                    onClick={() => handleMoveOrder(member, 'up')}
                    className="h-8 w-8 p-0 border-[var(--border-color)] hover:border-red-500/50 hover:text-red-400 rounded-lg transition-colors"
                    title="Move Member Up in Order"
                  >
                    <FaArrowUp className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    type="button"
                    disabled={index === filteredMembers.length - 1 || isReordering}
                    onClick={() => handleMoveOrder(member, 'down')}
                    className="h-8 w-8 p-0 border-[var(--border-color)] hover:border-red-500/50 hover:text-red-400 rounded-lg transition-colors"
                    title="Move Member Down in Order"
                  >
                    <FaArrowDown className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Hidden QR Canvas for high-res export */}
                <div className="hidden">
                  <QRCodeCanvas
                    id={`qr-admin-hidden-${member.id || member._id}`}
                    value={`${window.location.origin}/team/${getMemberSlug(member.name, member.id || member._id)}`}
                    size={400}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                {/* QR Code Feature Dropdown beside Edit Profile & Photo */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs px-2.5 sm:px-3 border-[var(--border-color)] hover:border-[hsl(var(--accent))]/50 hover:text-[hsl(var(--accent))] rounded-lg gap-1.5 transition-colors"
                      title="Link to QR Code"
                    >
                      <FaQrcode className="h-3 w-3 text-[hsl(var(--accent))]" /> QR Code
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] min-w-[170px] p-1.5 rounded-[var(--r-md)] shadow-none">
                    <DropdownMenuItem
                      onClick={() => handleViewQr(member)}
                      className="cursor-pointer text-xs flex items-center gap-2 px-3 py-2 rounded-[var(--r-sm)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] focus:bg-[var(--surface-2)] focus:text-[var(--text)]"
                    >
                      <FaEye className="w-3.5 h-3.5 text-[var(--red)]" /> View QR Code
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDownloadQr(member)}
                      className="cursor-pointer text-xs flex items-center gap-2 px-3 py-2 rounded-[var(--r-sm)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] focus:bg-[var(--surface-2)] focus:text-[var(--text)]"
                    >
                      <FaDownload className="w-3.5 h-3.5 text-[var(--red)]" /> Download QR Code
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => startEdit(member)}
                  className="h-8 text-xs px-2.5 sm:px-3 border-[var(--border)] hover:border-[var(--border-strong)] hover:text-[var(--text)] rounded-[var(--r-sm)] gap-1.5"
                >
                  <FaEdit className="h-3 w-3" /> Edit Profile & Photo
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(member.id || member._id!)}
                  className="h-8 text-xs px-2 text-[var(--red-text)] hover:bg-[var(--red-soft)] rounded-[var(--r-sm)]"
                  title="Delete Member"
                >
                  <FaTrash className="h-3 w-3" />
                </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Super Admin QR Code Viewer Dialog */}
      <Dialog open={!!qrModalMember} onOpenChange={(open) => !open && setQrModalMember(null)}>
        {qrModalMember && (
          <DialogContent className="sm:max-w-md bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-[var(--r-lg)] p-6 shadow-none">
            <DialogHeader className="text-center space-y-2">
              <div className="w-12 h-12 rounded-[var(--r-md)] bg-[var(--red-soft)] border border-[var(--red-line)] text-[var(--red-text)] flex items-center justify-center mx-auto">
                <FaQrcode className="w-6 h-6 text-[var(--red)]" />
              </div>
              <DialogTitle className="text-xl font-display font-medium text-[var(--text)] tracking-tight">
                {qrModalMember.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-[var(--text-3)] font-mono">
                {qrModalMember.role} — Profile QR Code
              </DialogDescription>
            </DialogHeader>

            {/* QR Canvas Frame */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="p-4 bg-white rounded-2xl shadow-2xl border border-white/20">
                <QRCodeCanvas
                  value={`${window.location.origin}/team/${getMemberSlug(qrModalMember.name, qrModalMember.id || qrModalMember._id)}`}
                  size={240}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-[11px] font-mono text-[var(--text-muted)] mt-3">
                Scan with mobile camera to open profile page
              </p>
            </div>

            {/* URL Link with Copy Button */}
            <div className="p-3 bg-black/40 rounded-xl border border-[var(--border-color)] flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-[var(--text-secondary)] truncate">
                {`${window.location.origin}/team/${getMemberSlug(qrModalMember.name, qrModalMember.id || qrModalMember._id)}`}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopyQrLink(qrModalMember)}
                className="h-7 text-xs px-2.5 text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/10 shrink-0"
                title="Copy Link"
              >
                {copiedLink ? <FaCheck className="w-3.5 h-3.5 text-emerald-400" /> : <FaCopy className="w-3.5 h-3.5" />}
              </Button>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => window.open(`/team/${getMemberSlug(qrModalMember.name, qrModalMember.id || qrModalMember._id)}`, '_blank')}
                className="flex-1 border-[var(--border-color)] text-xs h-10 rounded-xl gap-1.5"
              >
                <FaExternalLinkAlt className="w-3 h-3" /> Open Page
              </Button>
              <Button
                onClick={() => handleDownloadQr(qrModalMember)}
                className="flex-1 bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90 text-xs h-10 rounded-xl font-semibold gap-1.5"
              >
                <FaDownload className="w-3.5 h-3.5" /> Download QR
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
