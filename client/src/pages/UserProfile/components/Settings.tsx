
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaUser, FaSave } from 'react-icons/fa';

interface SettingsProps {
    profileData: any;
    currentUser: any;
    handleInputChange: (field: string, value: string) => void;
    handleUpdateProfile: () => void;
}

export const Settings = ({ profileData, currentUser, handleInputChange, handleUpdateProfile }: SettingsProps) => {
    return (
        <div className="space-y-6">
            <div className="glass-panel p-6 rounded-xl border border-[var(--border-color)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/20">
                        <FaUser className="text-2xl text-[hsl(var(--accent))]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Profile Settings</h2>
                        <p className="text-[var(--text-secondary)] text-sm">Update your personal information</p>
                    </div>
                </div>

                <div className="space-y-4 max-w-2xl">
                    <div>
                        <label htmlFor="email" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">Email Address</label>
                        <Input
                            id="email"
                            value={profileData.email || currentUser.email} // Fallback to current email if empty state
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)]"
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="newPassword" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">New Password</label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="Leave blank to keep current"
                                value={profileData.newPassword}
                                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)]"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="text-xs font-mono text-[var(--text-secondary)] mb-2 block uppercase">Confirm Password</label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                value={profileData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className="bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)]"
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end">
                        <Button onClick={handleUpdateProfile} className="bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90">
                            <FaSave className="mr-2" /> Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
