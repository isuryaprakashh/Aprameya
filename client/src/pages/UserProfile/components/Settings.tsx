import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { FormActions } from '@/components/ui/FormActions';
import { compressImage } from '@/lib/imageUtils';
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

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file, 800, 0.85);
      handleInputChange('profile_image', compressed);
      toast({
        title: 'Photo Uploaded',
        description: 'Profile photo updated. Remember to save changes.',
      });
    } catch (err: any) {
      toast({
        title: 'Upload Error',
        description: err.message || 'Please select an image file (PNG, JPG, WEBP).',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    handleInputChange('display_name', currentUser?.display_name || '');
    handleInputChange('username', currentUser?.username || '');
    handleInputChange('profile_image', currentUser?.profile_image || '');
    handleInputChange('bio', currentUser?.bio || '');
    handleInputChange('department', currentUser?.department || '');
    handleInputChange('year', currentUser?.year || '');
    handleInputChange('newPassword', '');
    handleInputChange('confirmPassword', '');
    toast({ title: 'Changes Discarded', description: 'Reset profile form to current saved values.' });
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div className="bg-[var(--surface)] p-6 sm:p-8 rounded-[var(--r-lg)] border border-[var(--border)] space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-[var(--border)]">
          <div className="p-3 rounded-[var(--r-md)] bg-[var(--red-soft)] border border-[var(--red-line)]">
            <FaUser className="text-2xl text-[var(--red)]" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-medium text-[var(--text)] tracking-tight">Profile & Account Settings</h2>
            <p className="text-[var(--text-2)] text-sm">
              Customize your profile photo, username, bio, and personal details
            </p>
          </div>
        </div>

        {/* 1. Profile Photo / Avatar Section */}
        <div className="p-5 rounded-[var(--r-md)] bg-[var(--surface-2)] border border-[var(--border)] space-y-4">
          <label className="text-xs font-mono text-[var(--text-3)] uppercase tracking-wider block">
            Profile Photo
          </label>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group shrink-0">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 rounded-[20px] border border-[var(--border)] overflow-hidden">
                <AvatarImage src={currentImage} alt={displayNameValue || usernameValue} className="object-cover" />
                <AvatarFallback className="rounded-[20px] bg-[var(--surface)] text-[var(--text)] text-2xl font-display font-medium">
                  {getInitials(displayNameValue || usernameValue)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 space-y-3 w-full">
              <p className="text-xs text-[var(--text-2)] leading-relaxed">
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
                  className="border-[var(--border)] hover:border-[var(--border-strong)] text-[var(--text-2)] hover:text-[var(--text)] text-xs rounded-[var(--r-sm)] h-9"
                >
                  <FaUpload className="mr-2 h-3 w-3 text-[var(--red)]" /> Upload Photo
                </Button>
                {currentImage && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleInputChange('profile_image', '')}
                    className="text-[var(--red-text)] hover:bg-[var(--red-soft)] text-xs rounded-[var(--r-sm)] h-9"
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
                  className="text-xs bg-[var(--surface)] border-[var(--border)] rounded-[var(--r-sm)] text-[var(--text)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Basic Identity Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-display font-medium text-[var(--text)] flex items-center gap-2">
            <FaIdBadge className="text-[var(--red)]" /> Identity & Handle
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="text-xs font-mono text-[var(--text-3)] mb-2 block uppercase">
                Username / College ID <span className="text-[var(--red)]">*</span>
              </label>
              <Input
                id="username"
                value={usernameValue}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="e.g. 2400030358 or handle"
                className="bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] rounded-[var(--r-md)]"
              />
              <p className="text-[10px] text-[var(--text-3)] mt-1 font-mono">
                Your unique handle used for login and profile identifier.
              </p>
            </div>

            <div>
              <label htmlFor="display_name" className="text-xs font-mono text-[var(--text-3)] mb-2 block uppercase">
                Display Name (Full Name)
              </label>
              <Input
                id="display_name"
                value={displayNameValue}
                onChange={(e) => handleInputChange('display_name', e.target.value)}
                placeholder="e.g. Vempati Uday Kiran"
                className="bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] rounded-[var(--r-md)]"
              />
              <p className="text-[10px] text-[var(--text-3)] mt-1 font-mono">
                The name displayed publicly on cards, tickets, and badges.
              </p>
            </div>
          </div>
        </div>

        {/* 3. About Section / Bio */}
        <div className="space-y-2">
          <label htmlFor="bio" className="text-xs font-mono text-[var(--text-3)] uppercase flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FaInfoCircle className="text-[var(--red)]" /> About Section (Bio & Interests)
            </span>
            <span className="text-[10px] text-[var(--text-3)]">
              {(bioValue || '').length} characters
            </span>
          </label>
          <Textarea
            id="bio"
            rows={4}
            value={bioValue}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us about yourself, your technical skills, robotics interests, ongoing research projects, or achievements..."
            className="bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] rounded-[var(--r-md)] leading-relaxed resize-y"
          />
          <p className="text-[10px] text-[var(--text-3)] font-mono">
            This About section is visible in your user profile card and can be reviewed by laboratory administrators.
          </p>
        </div>

        {/* 4. Academic Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-display font-medium text-[var(--text)] flex items-center gap-2">
            <FaGraduationCap className="text-[var(--red)]" /> Department & Academic Year
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="department" className="text-xs font-mono text-[var(--text-3)] mb-2 block uppercase">
                Department / Specialization
              </label>
              <Input
                id="department"
                value={departmentValue}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder="e.g. Computer Science, AI & Robotics"
                className="bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] rounded-[var(--r-md)]"
              />
            </div>
            <div>
              <label htmlFor="year" className="text-xs font-mono text-[var(--text-3)] mb-2 block uppercase">
                Year of Study
              </label>
              <Input
                id="year"
                value={yearValue}
                onChange={(e) => handleInputChange('year', e.target.value)}
                placeholder="e.g. 2nd Year, 3rd Year"
                className="bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] rounded-[var(--r-md)]"
              />
            </div>
          </div>
        </div>

        {/* 5. Security & Password */}
        <div className="space-y-4 pt-4 border-t border-[var(--border)]">
          <h3 className="text-sm font-display font-medium text-[var(--text)] flex items-center gap-2">
            <FaLock className="text-[var(--red)]" /> Contact & Security
          </h3>
          <div>
            <label htmlFor="email" className="text-xs font-mono text-[var(--text-3)] mb-2 block uppercase">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={emailValue}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] rounded-[var(--r-md)]"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="newPassword" className="text-xs font-mono text-[var(--text-3)] mb-2 block uppercase">
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Leave blank to keep current"
                value={profileData.newPassword || ''}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className="bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] rounded-[var(--r-md)]"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-xs font-mono text-[var(--text-3)] mb-2 block uppercase">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={profileData.confirmPassword || ''}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="bg-[var(--surface-2)] border-[var(--border)] text-[var(--text)] rounded-[var(--r-md)]"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions: Cancel & Save Changes */}
        <FormActions
          onCancel={handleReset}
          onSave={handleUpdateProfile}
          saveLabel="Save Changes"
          cancelLabel="Cancel"
        />
      </div>
    </div>
  );
};
