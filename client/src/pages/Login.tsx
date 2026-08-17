import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import Logo from '../components/icons/Logo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, User, Shield, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ChamferedButton from '@/components/ui/ChamferedButton';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('message');
    if (msg) {
      setSuccessMessage(msg);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid College ID or password');
        return;
      }

      window.location.href = '/';
    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Please check server connection.');
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
              <p className="text-[11px] font-sans font-medium text-[var(--text-muted)] mb-2 uppercase tracking-[0.15em]">Student Portal</p>
              <h1 className="text-4xl sm:text-5xl tracking-tight text-[var(--text-primary)] leading-tight">
                <span className="font-serif italic font-normal text-[1.1em] text-[var(--text-secondary)]">Welcome</span>{" "}
                <span className="font-display font-bold">Back</span>
              </h1>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-sm leading-relaxed">
              Sign in with your College ID Number (Roll No) to access laboratory repositories, track applications, and manage workshop passes.
            </p>

            <div className="space-y-3 border-l border-white/[0.06] pl-5 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-2.5">
                <Shield className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Single Sign-On with College ID Number</span>
              </div>
              <div className="flex items-center gap-2.5">
                <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Member Portal & Application Status</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
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
              <h2 className="text-xl font-bold text-white font-display">Sign In</h2>
              <p className="text-xs text-[#94A3B8] mt-1">Enter your College ID Number and password</p>
            </div>

            <div className="space-y-4">
              {successMessage && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span>{successMessage}</span>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="bg-red-950/40 border-red-800/50 text-red-300 text-xs">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="username" className="text-xs text-[var(--text-secondary)] font-medium">
                    College ID Number / Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                    <Input
                      type="text"
                      id="username"
                      placeholder="e.g. 2200030000"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-[var(--text-primary)] text-sm focus:border-white/[0.2]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs text-[var(--text-secondary)] font-medium">
                      Password
                    </Label>
                    <Link href="/forgot-password" className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password"
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

                <div className="pt-2">
                  <ChamferedButton
                    variant="primary"
                    size="md"
                    isLoading={isLoading}
                    className="w-full"
                  >
                    Sign In
                  </ChamferedButton>
                </div>
              </form>

              <div className="text-center pt-4 border-t border-white/[0.04]">
                <p className="text-xs text-[var(--text-secondary)]">
                  New student?{' '}
                  <Link href="/signup" className="text-[var(--text-primary)] hover:underline font-semibold">
                    Create Account
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

export default Login;
