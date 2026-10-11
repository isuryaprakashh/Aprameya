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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FaTrash, FaEdit, FaUser, FaUpload, FaSave, FaSearch } from 'react-icons/fa';
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

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'CORE':
      case 'CORE_TEAM':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default:
        return 'bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] border-[hsl(var(--accent))]/50';
    }
  };

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
    <Card className="bg-[var(--card-bg)] border-[var(--border-color)] animate-in fade-in">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-xl font-bold font-display">User Management</CardTitle>
          <CardDescription>
            View and edit user details, profile photos, usernames, roles, and about sections
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-secondary)]" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs bg-[var(--bg-body)] border-[var(--border-color)] w-48 sm:w-64 rounded-lg"
            />
          </div>
          <Badge variant="outline" className="border-[hsl(var(--accent))] text-[hsl(var(--accent))] shrink-0">
            {users.length} Users
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative overflow-x-auto rounded-xl border border-[var(--border-color)]">
          <Table>
            <TableHeader className="bg-[var(--bg-body)]">
              <TableRow>
                <TableHead>User / Profile</TableHead>
                <TableHead>Roll No.</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="max-w-[200px]">About / Bio</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const displayName = user.display_name || user.username;
                return (
                  <TableRow
                    key={user.id}
                    className="border-b border-[var(--border-color)] hover:bg-[var(--text-primary)]/5"
                  >
                    {/* User Profile Avatar & Username */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 border border-[var(--border-color)] shrink-0">
                          <AvatarImage src={user.profile_image || ''} alt={displayName} className="object-cover" />
                          <AvatarFallback className="bg-[hsl(var(--accent))]/15 text-[hsl(var(--accent))] text-xs font-bold font-display">
                            {getInitials(displayName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="leading-tight">
                          <p className="font-semibold text-xs text-[var(--text-primary)]">{displayName}</p>
                          <p className="text-[11px] font-mono text-[var(--text-secondary)]">@{user.username}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-xs">{user.rollNumber || 'N/A'}</TableCell>
                    <TableCell className="text-xs text-[var(--text-secondary)]">{user.email}</TableCell>

                    {/* About Section Snippet */}
                    <TableCell className="max-w-[200px]">
                      {user.bio ? (
                        <p className="text-xs text-[var(--text-secondary)] truncate" title={user.bio}>
                          {user.bio}
                        </p>
                      ) : (
                        <span className="text-[11px] text-[var(--text-muted)] italic">No about bio added</span>
                      )}
                    </TableCell>

                    {/* Role Selector */}
                    <TableCell>
                      <Select
                        defaultValue={user.role}
                        onValueChange={(r) => updateUserRole.mutate({ userId: user.id, role: r })}
                      >
                        <SelectTrigger className="w-[110px] h-7 text-xs bg-[var(--bg-body)] border-[var(--border-color)]">
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
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUserForDetails(user)}
                          className="h-7 text-xs px-2 text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))] rounded-lg"
                        >
                          Details
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(user)}
                          className="h-7 text-xs px-2 border-[var(--border-color)] text-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))]/10 rounded-lg gap-1"
                          title="Edit User Details & Photo"
                        >
                          <FaEdit className="h-3 w-3" /> Edit
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                          onClick={() => setUserToDelete(user)}
                          title="Delete User"
                        >
                          <FaTrash className="h-3 w-3" />
                        </Button>
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
            <DialogContent className="sm:max-w-lg bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] rounded-2xl p-6">
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-[hsl(var(--accent))]/40 shadow-lg">
                    <AvatarImage
                      src={selectedUserForDetails.profile_image || ''}
                      alt={selectedUserForDetails.display_name || selectedUserForDetails.username}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-red-950 to-black text-white text-xl font-bold font-display">
                      {getInitials(selectedUserForDetails.display_name || selectedUserForDetails.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-lg font-bold font-display">
                      {selectedUserForDetails.display_name || selectedUserForDetails.username}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[var(--text-secondary)] font-mono">
                      @{selectedUserForDetails.username} • {selectedUserForDetails.email}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-3">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-[var(--bg-body)] rounded-xl border border-[var(--border-color)]">
                    <label className="text-[10px] font-mono text-[var(--text-secondary)] uppercase block mb-1">
                      Roll Number
                    </label>
                    <p className="font-bold text-[var(--text-primary)]">
                      {selectedUserForDetails.rollNumber || 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-[var(--bg-body)] rounded-xl border border-[var(--border-color)]">
                    <label className="text-[10px] font-mono text-[var(--text-secondary)] uppercase block mb-1">
                      Role Privilege
                    </label>
                    <Badge variant="outline" className={getRoleBadgeColor(selectedUserForDetails.role)}>
                      {selectedUserForDetails.role}
                    </Badge>
                  </div>
                  <div className="p-3 bg-[var(--bg-body)] rounded-xl border border-[var(--border-color)]">
                    <label className="text-[10px] font-mono text-[var(--text-secondary)] uppercase block mb-1">
                      Registration Date
                    </label>
                    <p className="text-[var(--text-primary)]">
                      {selectedUserForDetails.created_at
                        ? new Date(selectedUserForDetails.created_at).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-[var(--bg-body)] rounded-xl border border-[var(--border-color)]">
                    <label className="text-[10px] font-mono text-[var(--text-secondary)] uppercase block mb-1">
                      Account Tenure
                    </label>
                    <p className="text-[var(--text-primary)]">
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
                <div className="p-4 bg-[var(--bg-body)] rounded-xl border border-[var(--border-color)]">
                  <label className="text-[10px] font-mono text-[var(--text-secondary)] uppercase block mb-1.5">
                    About Section (Bio)
                  </label>
                  {selectedUserForDetails.bio ? (
                    <p className="text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap">
                      {selectedUserForDetails.bio}
                    </p>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] italic">
                      No About section has been added yet.
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const u = selectedUserForDetails;
                      setSelectedUserForDetails(null);
                      openEditModal(u);
                    }}
                    className="border-[hsl(var(--accent))] text-[hsl(var(--accent))] text-xs rounded-xl"
                  >
                    <FaEdit className="mr-1.5 h-3 w-3" /> Edit This User
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* Edit User Dialog (Admin Mode) */}
        <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
          {editingUser && (
            <DialogContent className="sm:max-w-xl bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)] rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold font-display flex items-center gap-2">
                  <FaEdit className="text-[hsl(var(--accent))]" /> Edit User Details
                </DialogTitle>
                <DialogDescription className="text-xs text-[var(--text-secondary)]">
                  Modify user profile image, username, display name, email, roll number, role, and about section.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* Profile Photo Editor */}
                <div className="p-4 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] space-y-3">
                  <Label className="text-xs font-mono text-[var(--text-secondary)] uppercase block">
                    Profile Photo
                  </Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-[hsl(var(--accent))]/40 shadow-md shrink-0">
                      <AvatarImage src={editForm.profile_image} className="object-cover" />
                      <AvatarFallback className="bg-red-950 text-white font-bold font-display">
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
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-8 text-xs border-[var(--border-color)] hover:border-[hsl(var(--accent))] rounded-lg"
                        >
                          <FaUpload className="mr-1.5 h-3 w-3" /> Upload Photo
                        </Button>
                        {editForm.profile_image && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditForm((p) => ({ ...p, profile_image: '' }))}
                            className="h-8 text-xs text-red-400 hover:text-red-300 rounded-lg"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <Input
                        placeholder="Or image URL (https://...)"
                        value={editForm.profile_image}
                        onChange={(e) => setEditForm((p) => ({ ...p, profile_image: e.target.value }))}
                        className="text-xs h-8 bg-[var(--card-bg)] border-[var(--border-color)] rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Username & Display Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-mono text-[var(--text-secondary)] uppercase mb-1.5 block">
                      Username <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      value={editForm.username}
                      onChange={(e) => setEditForm((p) => ({ ...p, username: e.target.value }))}
                      className="text-xs bg-[var(--bg-body)] border-[var(--border-color)] rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-mono text-[var(--text-secondary)] uppercase mb-1.5 block">
                      Display Name (Full Name)
                    </Label>
                    <Input
                      value={editForm.display_name}
                      onChange={(e) => setEditForm((p) => ({ ...p, display_name: e.target.value }))}
                      placeholder="e.g. John Doe"
                      className="text-xs bg-[var(--bg-body)] border-[var(--border-color)] rounded-xl"
                    />
                  </div>
                </div>

                {/* Email & Roll Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-mono text-[var(--text-secondary)] uppercase mb-1.5 block">
                      Email Address <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                      className="text-xs bg-[var(--bg-body)] border-[var(--border-color)] rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-mono text-[var(--text-secondary)] uppercase mb-1.5 block">
                      Roll Number
                    </Label>
                    <Input
                      value={editForm.rollNumber}
                      onChange={(e) => setEditForm((p) => ({ ...p, rollNumber: e.target.value }))}
                      placeholder="e.g. 2400030358"
                      className="text-xs bg-[var(--bg-body)] border-[var(--border-color)] rounded-xl"
                    />
                  </div>
                </div>

                {/* Role Privilege */}
                <div>
                  <Label className="text-xs font-mono text-[var(--text-secondary)] uppercase mb-1.5 block">
                    User Role
                  </Label>
                  <Select
                    value={editForm.role}
                    onValueChange={(val) => setEditForm((p) => ({ ...p, role: val }))}
                  >
                    <SelectTrigger className="text-xs bg-[var(--bg-body)] border-[var(--border-color)] rounded-xl">
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
                  <Label className="text-xs font-mono text-[var(--text-secondary)] uppercase mb-1.5 block">
                    About Section (Bio & Information)
                  </Label>
                  <Textarea
                    rows={4}
                    value={editForm.bio}
                    onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Enter user biography, skills, robotics domain, or achievements..."
                    className="text-xs bg-[var(--bg-body)] border-[var(--border-color)] rounded-xl resize-y leading-relaxed"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                <Button
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                  className="border-[var(--border-color)] text-xs rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveUser}
                  disabled={updateUser?.isPending}
                  className="bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90 text-xs rounded-xl font-semibold px-5"
                >
                  <FaSave className="mr-2" />
                  {updateUser?.isPending ? 'Saving...' : 'Save User Changes'}
                </Button>
              </div>
            </DialogContent>
          )}
        </Dialog>

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
          <AlertDialogContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[var(--text-primary)]">Delete User?</AlertDialogTitle>
              <AlertDialogDescription className="text-[var(--text-secondary)]">
                Are you sure you want to delete <strong>{userToDelete?.username}</strong>? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/10">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600 text-white"
                onClick={() => userToDelete && deleteUser.mutate(userToDelete.id)}
              >
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
