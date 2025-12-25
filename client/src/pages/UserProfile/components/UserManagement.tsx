
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaTrash } from 'react-icons/fa';
import { User } from '@/lib/types';
import { UseMutationResult } from '@tanstack/react-query';

interface UserManagementProps {
    users: User[];
    updateUserRole: UseMutationResult<unknown, Error, { userId: string; role: string }, unknown>;
    deleteUser: UseMutationResult<unknown, Error, string, unknown>;
    userToDelete: User | null;
    setUserToDelete: (user: User | null) => void;
}

export const UserManagement = ({
    users, updateUserRole, deleteUser, userToDelete, setUserToDelete
}: UserManagementProps) => {

    const getRoleBadgeColor = (role: string) => {
        switch (role?.toUpperCase()) {
            case 'ADMIN': return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'CORE':
            case 'CORE_TEAM': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            default: return 'bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))] border-[hsl(var(--accent))]/50';
        }
    };

    return (
        <Card className="bg-[var(--card-bg)] border-[var(--border-color)] animate-in fade-in">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user roles and permissions</CardDescription>
                </div>
                <Badge variant="outline" className="border-[hsl(var(--accent))] text-[hsl(var(--accent))]">{users.length} Users</Badge>
            </CardHeader>
            <CardContent>
                <div className="relative overflow-x-auto rounded-md border border-[var(--border-color)]">
                    <Table>
                        <TableHeader className="bg-[var(--bg-body)]">
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead>Roll No.</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id} className="border-b border-[var(--border-color)] hover:bg-[var(--text-primary)]/5">
                                    <TableCell className="font-bold text-[var(--text-primary)]">{user.username}</TableCell>
                                    <TableCell>{user.rollNumber || "N/A"}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Select defaultValue={user.role} onValueChange={(r) => updateUserRole.mutate({ userId: user.id, role: r })}>
                                            <SelectTrigger className="w-[120px] h-8 text-xs bg-[var(--bg-body)] border-[var(--border-color)]"><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ASPIRANT">Aspirant</SelectItem>
                                                <SelectItem value="CORE">Core</SelectItem>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="h-8 text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))]">
                                                        Details
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                                                    <DialogHeader>
                                                        <DialogTitle>User Details: {user.username}</DialogTitle>
                                                        <DialogDescription>
                                                            Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="text-xs font-mono text-[var(--text-secondary)] uppercase">Roll No.</label>
                                                                <p className="text-[var(--text-primary)] font-bold">{user.rollNumber || "N/A"}</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-mono text-[var(--text-secondary)] uppercase">Role</label>
                                                                <Badge variant="outline" className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-mono text-[var(--text-secondary)] uppercase">Registered</label>
                                                                <p className="text-[var(--text-primary)]">{user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}</p>
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-mono text-[var(--text-secondary)] uppercase">Days as Member</label>
                                                                <p className="text-[var(--text-primary)]">
                                                                    {user.created_at ? Math.floor((new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 3600 * 24)) : 0} Days
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="p-3 bg-[var(--bg-body)] rounded-md border border-[var(--border-color)]">
                                                            <label className="text-xs font-mono text-[var(--text-secondary)] uppercase block mb-1">Password (Hash)</label>
                                                            <code className="text-xs text-[hsl(var(--accent))] break-all">
                                                                {user.password || "N/A"}
                                                            </code>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                onClick={() => {
                                                    setUserToDelete(user);
                                                }}
                                            >
                                                <FaTrash className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
                    <AlertDialogContent className="bg-[var(--card-bg)] border-[var(--border-color)]">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-[var(--text-primary)]">Delete User?</AlertDialogTitle>
                            <AlertDialogDescription className="text-[var(--text-secondary)]">
                                Are you sure you want to delete <strong>{userToDelete?.username}</strong>? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/10">Cancel</AlertDialogCancel>
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
