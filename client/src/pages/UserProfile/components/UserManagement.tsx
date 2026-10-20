import { useState, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import RoleBadge from '@/components/ui/RoleBadge';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaTrash, FaEdit, FaUpload, FaSave, FaSearch } from 'react-icons/fa';
import { User } from '@/lib/types';
import { UseMutationResult } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface UserManagementProps {
  users: User[];
  updateUserRole: UseMutationResult<unknown, Error, { userId: string; role: string }, unknown>;
  updateUser?: UseMutationResult<unknown, Error, { userId: string } & any, unknown>;
  deleteUser: UseMutationResult<unknown, Error, string, unknown>;
  userToDelete: User | null;
  setUserToDelete: (user: User | null) => void;
}

export const UserManagement = ({
  users,
  updateUserRole,
  updateUser,
  deleteUser,
  userToDelete,
  setUserToDelete,
}: UserManagementProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    username: '',
    display_name: '',
    email: '',
    rollNumber: '',
    role: '',
    bio: '',
    profile_image: '',
  });

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.username && u.username.toLowerCase().includes(term)) ||
      (u.display_name && u.display_name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      (u.rollNumber && u.rollNumber.toLowerCase().includes(term)) ||
      (u.bio && u.bio.toLowerCase().includes(term))
    );
  });

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({
      username: user.username || '',
      display_name: user.display_name || '',
      email: user.email || '',
      rollNumber: user.rollNumber || '',
      role: user.role || 'ASPIRANT',
      bio: user.bio || '',
      profile_image: user.profile_image || '',
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setEditForm((prev) => ({ ...prev, profile_image: compressed }));
        toast({ title: 'Photo Ready', description: 'User image updated in editor.' });
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSaveUser = () => {
    if (!editingUser || !updateUser) return;
    if (!editForm.username.trim()) {
      toast({ title: 'Validation Error', description: 'Username is required', variant: 'destructive' });
      return;
    }
    if (!editForm.email.trim()) {
      toast({ title: 'Validation Error', description: 'Email is required', variant: 'destructive' });
      return;
    }

    updateUser.mutate(
      {
        userId: editingUser.id,
        ...editForm,
      },
      {
        onSuccess: () => {
          setEditingUser(null);
        },
      }
    );
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl animate-in fade-in p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border)]">
        <div>
          <h2 className="text-xl font-medium font-display text-[var(--text)]">User Management</h2>
          <p className="text-xs text-[var(--text-2)] mt-1">
            View and edit user details, profile photos, usernames, roles, and about sections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-3)]" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-xs bg-[var(--surface-2)] border-[var(--border)] w-48 sm:w-64 rounded-xl"
            />
          </div>
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full border border-[var(--border)] text-[var(--text-2)] shrink-0">
            {users.length} Users
          </span>
        </div>
      </div>

      <div className="pt-6">
        <div className="relative overflow-x-auto rounded-xl border border-[var(--border)]">
          <Table>
            <TableHeader className="bg-[var(--surface-2)]">
              <TableRow className="border-b border-[var(--border)]">
                <TableHead className="font-mono text-[10px] uppercase text-[var(--text-3)]">User / Profile</TableHead>
                <TableHead className="font-mono text-[10px] uppercase text-[var(--text-3)]">Roll No.</TableHead>
                <TableHead className="font-mono text-[10px] uppercase text-[var(--text-3)]">Email</TableHead>
                <TableHead className="font-mono text-[10px] uppercase text-[var(--text-3)] max-w-[200px]">About / Bio</TableHead>
                <TableHead className="font-mono text-[10px] uppercase text-[var(--text-3)]">Role</TableHead>
                <TableHead className="font-mono text-[10px] uppercase text-[var(--text-3)] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const displayName = user.display_name || user.username;
                return (
                  <TableRow
                    key={user.id}
                    className="border-b border-[var(--border)] hover:bg-[var(--surface-2)]/50 transition-colors"
                  >
                    {/* User Profile Avatar & Username */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 border border-[var(--border)] shrink-0">
                          <AvatarImage src={user.profile_image || ''} alt={displayName} className="object-cover" />
                          <AvatarFallback className="bg-[var(--surface-2)] text-[var(--text-2)] text-xs font-mono">
                            {getInitials(displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="leading-tight">
                          <p className="font-medium text-xs text-[var(--text)]">{displayName}</p>
                          <p className="text-[11px] font-mono text-[var(--text-3)]">@{user.username}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-xs text-[var(--text-2)]">{user.rollNumber || '—'}</TableCell>
                    <TableCell className="text-xs text-[var(--text-2)] font-mono">{user.email}</TableCell>

                    {/* About Section Snippet */}
                    <TableCell className="max-w-[200px]">
                      {user.bio ? (
                        <p className="text-xs text-[var(--text-2)] truncate" title={user.bio}>
                          {user.bio}
                        </p>
                      ) : (
                        <span className="text-[11px] text-[var(--text-3)] italic">No bio added</span>
                      )}
                    </TableCell>

                    {/* Role Selector */}
                    <TableCell>
                      <Select
                        defaultValue={user.role}
                        onValueChange={(r) => updateUserRole.mutate({ userId: user.id, role: r })}
                      >
                        <SelectTrigger className="w-[110px] h-7 text-xs bg-[var(--surface-2)] border-[var(--border)]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ASPIRANT">Aspirant</SelectItem>
                          <SelectItem value="CORE">Core</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Actions: Details, Edit, Delete */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUserForDetails(user)}
                          className="h-7 text-xs px-2"
                        >
                          Details
                        </Button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openEditModal(user)}
                          className="h-7 text-xs px-2 gap-1"
                          title="Edit User Details & Photo"
                        >
                          <FaEdit className="size-3" />
                          <span>Edit</span>
                        </Button>

                        <button
                          className="h-7 px-2 text-[var(--text-3)] hover:text-[var(--red)] transition-colors rounded-lg"
                          onClick={() => setUserToDelete(user)}
                          title="Delete User"
                        >
                          <FaTrash className="h-3 w-3" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* View Details Dialog */}
        <Dialog open={!!selectedUserForDetails} onOpenChange={(open) => !open && setSelectedUserForDetails(null)}>
          {selectedUserForDetails && (
            <DialogContent className="sm:max-w-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-2xl p-6">
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 border border-[var(--border)]">
                    <AvatarImage
                      src={selectedUserForDetails.profile_image || ''}
                      alt={selectedUserForDetails.display_name || selectedUserForDetails.username}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-[var(--surface-2)] text-[var(--text)] text-lg font-mono">
                      {getInitials(selectedUserForDetails.display_name || selectedUserForDetails.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-lg font-medium font-display text-[var(--text)]">
                      {selectedUserForDetails.display_name || selectedUserForDetails.username}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[var(--text-2)] font-mono">
                      @{selectedUserForDetails.username} • {selectedUserForDetails.email}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]">
                    <label className="text-[10px] font-mono text-[var(--text-3)] uppercase block mb-1">
                      Roll Number
                    </label>
                    <p className="font-mono font-medium text-[var(--text)]">
                      {selectedUserForDetails.rollNumber || 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]">
                    <label className="text-[10px] font-mono text-[var(--text-3)] uppercase block mb-1">
                      Role Privilege
                    </label>
                    <RoleBadge role={selectedUserForDetails.role} />
                  </div>
                  <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]">
                    <label className="text-[10px] font-mono text-[var(--text-3)] uppercase block mb-1">
                      Registration Date
                    </label>
                    <p className="text-[var(--text-2)] font-mono">
                      {selectedUserForDetails.created_at
                        ? new Date(selectedUserForDetails.created_at).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]">
                    <label className="text-[10px] font-mono text-[var(--text-3)] uppercase block mb-1">
                      Account Tenure
                    </label>
                    <p className="text-[var(--text-2)] font-mono">
                      {selectedUserForDetails.created_at
                        ? `${Math.floor(
                            (new Date().getTime() - new Date(selectedUserForDetails.created_at).getTime()) /
                              (1000 * 3600 * 24)
                          )} Days`
                        : '0 Days'}
                    </p>
                  </div>
                </div>

                {/* About / Bio Section */}
                <div className="p-4 bg-[var(--surface-2)] rounded-xl border border-[var(--border)]">
                  <label className="text-[10px] font-mono text-[var(--text-3)] uppercase block mb-1.5">
                    About Section (Bio)
                  </label>
                  {selectedUserForDetails.bio ? (
                    <p className="text-xs text-[var(--text-2)] leading-relaxed whitespace-pre-wrap">
                      {selectedUserForDetails.bio}
                    </p>
                  ) : (
                    <p className="text-xs text-[var(--text-3)] italic">
                      No About section has been added yet.
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      const u = selectedUserForDetails;
                      setSelectedUserForDetails(null);
                      openEditModal(u);
                    }}
                    className="gap-1.5"
                  >
                    <FaEdit className="size-3" />
                    <span>Edit This User</span>
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* Edit User Dialog (Admin Mode) */}
        <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
          {editingUser && (
            <DialogContent className="sm:max-w-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium font-display flex items-center gap-2">
                  <FaEdit className="text-[var(--red)]" /> Edit User Details
                </DialogTitle>
                <DialogDescription className="text-xs text-[var(--text-2)]">
                  Modify user profile image, username, display name, email, roll number, role, and about section.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Profile Photo Editor */}
                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-3">
                  <Label className="text-xs font-mono text-[var(--text-3)] uppercase block">
                    Profile Photo
                  </Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14 border border-[var(--border)] shrink-0">
                      <AvatarImage src={editForm.profile_image} className="object-cover" />
                      <AvatarFallback className="bg-[var(--surface)] text-[var(--text)] font-mono font-medium">
                        {getInitials(editForm.display_name || editForm.username)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2 flex-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => fileInputRef.current?.click()}
                          className="gap-1.5"
                        >
                          <FaUpload className="size-3" />
                          <span>Upload Photo</span>
                        </Button>
                        {editForm.profile_image && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditForm((p) => ({ ...p, profile_image: '' }))}
                            className="text-signal-text"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <Input
                        placeholder="Or image URL (https://...)"
                        value={editForm.profile_image}
                        onChange={(e) => setEditForm((p) => ({ ...p, profile_image: e.target.value }))}
                        className="text-xs h-8 bg-[var(--surface)] border-[var(--border)] rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Username & Display Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-mono text-[var(--text-3)] uppercase mb-1.5 block">
                      Username <span className="text-[var(--red)]">*</span>
                    </Label>
                    <Input
                      value={editForm.username}
                      onChange={(e) => setEditForm((p) => ({ ...p, username: e.target.value }))}
                      className="text-xs bg-[var(--surface-2)] border-[var(--border)] rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-mono text-[var(--text-3)] uppercase mb-1.5 block">
                      Display Name
                    </Label>
                    <Input
                      value={editForm.display_name}
                      onChange={(e) => setEditForm((p) => ({ ...p, display_name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      className="text-xs bg-[var(--surface-2)] border-[var(--border)] rounded-xl"
                    />
                  </div>
                </div>

                {/* Email & Roll Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-mono text-[var(--text-3)] uppercase mb-1.5 block">
                      Email Address <span className="text-[var(--red)]">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                      className="text-xs bg-[var(--surface-2)] border-[var(--border)] rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-mono text-[var(--text-3)] uppercase mb-1.5 block">
                      Roll Number
                    </Label>
                    <Input
                      value={editForm.rollNumber}
                      onChange={(e) => setEditForm((p) => ({ ...p, rollNumber: e.target.value }))}
                      placeholder="e.g. 2400030358"
                      className="text-xs bg-[var(--surface-2)] border-[var(--border)] rounded-xl font-mono"
                    />
                  </div>
                </div>

                {/* Role Privilege */}
                <div>
                  <Label className="text-xs font-mono text-[var(--text-3)] uppercase mb-1.5 block">
                    User Role
                  </Label>
                  <Select
                    value={editForm.role}
                    onValueChange={(val) => setEditForm((p) => ({ ...p, role: val }))}
                  >
                    <SelectTrigger className="text-xs bg-[var(--surface-2)] border-[var(--border)] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ASPIRANT">ASPIRANT (Standard User)</SelectItem>
                      <SelectItem value="CORE">CORE (Core Member)</SelectItem>
                      <SelectItem value="ADMIN">ADMIN (Super Administrator)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* About Section / Bio */}
                <div>
                  <Label className="text-xs font-mono text-[var(--text-3)] uppercase mb-1.5 block">
                    About Section (Bio & Information)
                  </Label>
                  <Textarea
                    rows={4}
                    value={editForm.bio}
                    onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Enter user biography, skills, robotics domain, or achievements..."
                    className="text-xs bg-[var(--surface-2)] border-[var(--border)] rounded-xl resize-y leading-relaxed"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border)]">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveUser}
                  loading={updateUser?.isPending}
                  className="gap-1.5"
                >
                  <FaSave className="size-3" />
                  <span>{updateUser?.isPending ? 'Saving...' : 'Save User Changes'}</span>
                </Button>
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
          <AlertDialogContent className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[var(--text)] font-medium font-display">Delete User?</AlertDialogTitle>
              <AlertDialogDescription className="text-[var(--text-2)] text-xs">
                Are you sure you want to delete <strong>{userToDelete?.username}</strong>? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent text-[var(--text-2)] hover:bg-[var(--surface-2)] border border-[var(--border)]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-[var(--red)] hover:bg-[var(--red-hover)] text-white"
                onClick={() => userToDelete && deleteUser.mutate(userToDelete.id)}
              >
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
