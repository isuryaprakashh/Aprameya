import { useState } from 'react';
import { Link } from 'wouter';
import Logo from '../components/icons/Logo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Mail, Lock, Shield, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import ChamferedButton from '@/components/ui/ChamferedButton';

const Signup = () => {
  const [formData, setFormData] = useState({
    collegeId: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const cleanCollegeId = formData.collegeId.trim();

    if (!cleanCollegeId) {
      setError('Please enter your College ID Number (Roll Number)');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please acknowledge club guidelines to register');
      setIsLoading(false);
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${baseUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: cleanCollegeId,
          rollNumber: cleanCollegeId,
          display_name: formData.fullName.trim() || cleanCollegeId,
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to sign up');
        return;
      }

      // Success - redirect to login
      window.location.href = '/login?message=Account created successfully! Please log in with your College ID.';
    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-[var(--bg-body)] text-[var(--text-primary)] relative overflow-hidden font-sans">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side - Branding */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-left">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
              <Logo size="md" color="light" showText={false} />
              <span className="font-display font-bold text-lg text-[var(--text-primary)]">APRAMEYA</span>
            </Link>
            <div className="mb-4">
              <p className="text-[11px] font-sans font-medium text-[var(--text-muted)] mb-2 uppercase tracking-[0.15em]">Student Registration</p>
              <h1 className="text-4xl sm:text-5xl tracking-tight text-[var(--text-primary)] leading-tight font-display font-bold">
                <span className="text-[var(--text-secondary)] font-normal">Create</span>{" "}
                <span>Account</span>
              </h1>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-sm leading-relaxed">
              Create an account using your official KL University College ID Number to register for workshops, access laboratory repositories, and manage your credentials.
            </p>

            <div className="space-y-3 border-l border-white/[0.06] pl-5 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-2.5">
                <Shield className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Username is strictly your College ID Number</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Verification OTPs dispatched via Official Club Email</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="rounded-xl border border-emerald-500/15 bg-[#0B130E] p-8 sm:p-9 shadow-xl shadow-black/30">
            <div className="text-left pb-5 border-b border-emerald-500/10 mb-6">
              <div className="lg:hidden mb-4">
                <Link href="/" className="inline-flex items-center gap-2">
                  <Logo size="sm" color="light" showText={false} />
                  <span className="font-display font-bold text-base text-white">APRAMEYA</span>
                </Link>
              </div>
              <h2 className="text-xl font-bold text-white font-display">Create Account</h2>
              <p className="text-xs text-[#94A3B8] mt-1">Register using your official College ID Number</p>
            </div>

            <div className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-950/40 border-red-800/50 text-red-300 text-xs">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                
                {/* College ID Number (Username) */}
                <div className="space-y-1.5">
                  <Label htmlFor="collegeId" className="text-xs text-[var(--text-secondary)] font-medium">
                    College ID Number (Roll No) <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                    <Input
                      type="text"
                      id="collegeId"
                      placeholder="e.g. 2200030000"
                      value={formData.collegeId}
                      onChange={handleInputChange}
                      className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-[var(--text-primary)] text-sm focus:border-white/[0.2]"
                      required
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs text-[var(--text-secondary)] font-medium">
                    Full Name <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                    <Input
                      type="text"
                      id="fullName"
                      placeholder="Your Full Name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-[var(--text-primary)] text-sm focus:border-white/[0.2]"
                      required
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs text-[var(--text-secondary)] font-medium">
                    Email Address <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                    <Input
                      type="email"
                      id="email"
                      placeholder="student@kluniversity.in"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-[var(--text-primary)] text-sm focus:border-white/[0.2]"
                      required
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs text-[var(--text-secondary)] font-medium">
                      Password <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 h-10 bg-white/[0.02] border-white/[0.06] text-[var(--text-primary)] text-sm focus:border-white/[0.2]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs text-[var(--text-secondary)] font-medium">
                      Confirm <span className="text-red-400">*</span>
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-10 pr-10 h-10 bg-white/[0.02] border-white/[0.06] text-[var(--text-primary)] text-sm focus:border-white/[0.2]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                    }
                    className="border-neutral-700 data-[state=checked]:bg-white data-[state=checked]:text-black"
                  />
                  <Label htmlFor="agreeToTerms" className="text-xs text-[var(--text-secondary)] font-normal cursor-pointer">
                    I agree to the Aprameya Code of Conduct & Lab Guidelines
                  </Label>
                </div>

                <div className="pt-2">
                  <ChamferedButton
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                    className="w-full"
                  >
                    Register Account
                  </ChamferedButton>
                </div>
              </form>

              <div className="text-center pt-4 border-t border-white/[0.04]">
                <p className="text-xs text-[var(--text-secondary)]">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[var(--text-primary)] hover:underline font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
