import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  FaUser,
  FaSave,
  FaUpload,
  FaTrash,
  FaIdBadge,
  FaInfoCircle,
  FaLock,
  FaGraduationCap
} from 'react-icons/fa';

interface SettingsProps {
  profileData: any;
  currentUser: any;
  handleInputChange: (field: string, value: string) => void;
  handleUpdateProfile: () => void;
}

export const Settings = ({
  profileData,
  currentUser,
  handleInputChange,
  handleUpdateProfile
}: SettingsProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentImage = profileData.profile_image !== undefined ? profileData.profile_image : (currentUser?.profile_image || '');
  const usernameValue = profileData.username !== undefined ? profileData.username : (currentUser?.username || '');
  const displayNameValue = profileData.display_name !== undefined ? profileData.display_name : (currentUser?.display_name || '');
  const bioValue = profileData.bio !== undefined ? profileData.bio : (currentUser?.bio || '');
  const departmentValue = profileData.department !== undefined ? profileData.department : (currentUser?.department || '');
  const yearValue = profileData.year !== undefined ? profileData.year : (currentUser?.year || '');
  const emailValue = profileData.email !== undefined ? profileData.email : (currentUser?.email || '');

  const getInitials = (name?: string) => {
    if (!name) return 'AP';
    return name.substring(0, 2).toUpperCase();
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please select an image file (PNG, JPG, WEBP).',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const raw = ev.target?.result as string;
      if (!raw) return;

      const img = new Image();
      img.src = raw;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.85);
        handleInputChange('profile_image', compressed);
        toast({
          title: 'Photo Uploaded',
          description: 'Profile photo updated. Remember to save changes.',
        });
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[var(--border-color)] space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-[var(--border-color)]">
          <div className="p-3 rounded-xl bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
            <FaUser className="text-2xl text-[hsl(var(--accent))]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] font-display">Profile & Account Settings</h2>
            <p className="text-[var(--text-secondary)] text-sm">
              Customize your profile photo, username, bio, and personal details
            </p>
          </div>
        </div>

        {/* 1. Profile Photo / Avatar Section */}
        <div className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] space-y-4">
          <label className="text-xs font-mono text-[var(--text-secondary)] uppercase tracking-wider block">
            Profile Photo
          </label>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group shrink-0">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-[hsl(var(--accent))]/40 shadow-xl">
                <AvatarImage src={currentImage} alt={displayNameValue || usernameValue} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-red-950 to-black text-white text-2xl font-bold font-display">
                  {getInitials(displayNameValue || usernameValue)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-3 w-full">
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Upload a portrait photo to display across the Aprameya portal, user roster, and dashboard.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFile}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-[var(--border-color)] hover:border-[hsl(var(--accent))] hover:text-[hsl(var(--accent))] text-xs rounded-xl h-9"
                >
                  <FaUpload className="mr-2 h-3 w-3" /> Upload Photo
                </Button>
                {currentImage && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleInputChange('profile_image', '')}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs rounded-xl h-9"
                  >
                    <FaTrash className="mr-2 h-3 w-3" /> Remove Photo
                  </Button>
                )}
              </div>
              <div className="pt-1">
                <Input
                  placeholder="Or paste an image URL (https://...)"
                  value={currentImage}
                  onChange={(e) => handleInputChange('profile_image', e.target.value)}
                  className="text-xs bg-[var(--bg-body)] border-[var(--border-color)] rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Basic Identity Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <FaIdBadge className="text-[hsl(var(--accent))]" /> Identity & Handle
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">
                Username / College ID <span className="text-red-400">*</span>
              </label>
              <Input
                id="username"
                value={usernameValue}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="e.g. 2400030358 or handle"
                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] rounded-xl"
              />
              <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                Your unique handle used for login and profile identifier.
              </p>
            </div>

            <div>
              <label htmlFor="display_name" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">
                Display Name (Full Name)
              </label>
              <Input
                id="display_name"
                value={displayNameValue}
                onChange={(e) => handleInputChange('display_name', e.target.value)}
                placeholder="e.g. Vempati Uday Kiran"
                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] rounded-xl"
              />
              <p className="text-[10px] text-[var(--text-muted)] mt-1 font-mono">
                The name displayed publicly on cards, tickets, and badges.
              </p>
            </div>
          </div>
        </div>

        {/* 3. About Section / Bio */}
        <div className="space-y-2">
          <label htmlFor="bio" className="text-xs font-mono text-[var(--text-secondary)] uppercase flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FaInfoCircle className="text-[hsl(var(--accent))]" /> About Section (Bio & Interests)
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              {(bioValue || '').length} characters
            </span>
          </label>
          <Textarea
            id="bio"
            rows={4}
            value={bioValue}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us about yourself, your technical skills, robotics interests, ongoing research projects, or achievements..."
            className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] rounded-xl leading-relaxed resize-y"
          />
          <p className="text-[10px] text-[var(--text-muted)] font-mono">
            This About section is visible in your user profile card and can be reviewed by laboratory administrators.
          </p>
        </div>

        {/* 4. Academic Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <FaGraduationCap className="text-[hsl(var(--accent))]" /> Department & Academic Year
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="department" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">
                Department / Specialization
              </label>
              <Input
                id="department"
                value={departmentValue}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="e.g. Computer Science, AI & Robotics"
                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] rounded-xl"
              />
            </div>
            <div>
              <label htmlFor="year" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">
                Year of Study
              </label>
              <Input
                id="year"
                value={yearValue}
                onChange={(e) => handleInputChange('year', e.target.value)}
                placeholder="e.g. 2nd Year, 3rd Year"
                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 5. Security & Password */}
        <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <FaLock className="text-[hsl(var(--accent))]" /> Contact & Security
          </h3>
          <div>
            <label htmlFor="email" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={emailValue}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] rounded-xl"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="newPassword" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Leave blank to keep current"
                value={profileData.newPassword || ''}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] rounded-xl"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={profileData.confirmPassword || ''}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="pt-4 flex items-center justify-end border-t border-[var(--border-color)]">
          <Button
            onClick={handleUpdateProfile}
            className="bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90 rounded-xl px-6 h-11 font-semibold text-xs shadow-lg shadow-[hsl(var(--accent))]/20"
          >
            <FaSave className="mr-2" /> Save Profile Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
