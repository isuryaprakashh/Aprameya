import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import Logo from '../components/icons/Logo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, KeyRound, ArrowLeft, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ChamferedButton from '@/components/ui/ChamferedButton';

const ForgotPassword = () => {
  const [step, setStep] = useState<'REQUEST_OTP' | 'VERIFY_RESET' | 'SUCCESS'>('REQUEST_OTP');
  
  // Step 1 State
  const [identifier, setIdentifier] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  
  // Step 2 State
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [countdown, setCountdown] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Step 1: Request 6-digit OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setStatusMessage('');

    if (!identifier.trim()) {
      setError('Please enter your College ID Number or registered email');
      setIsLoading(false);
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${baseUrl}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to dispatch verification code');
        return;
      }

      setMaskedEmail(data.maskedEmail || identifier);
      setTargetEmail(data.email || identifier);
      setStatusMessage(data.message || 'Verification OTP dispatched.');
      setStep('VERIFY_RESET');
      setCountdown(60); // 60s cooldown for resend
    } catch (err) {
      console.error('OTP request error:', err);
      setError('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (countdown > 0 || isLoading) return;
    setIsLoading(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${baseUrl}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: targetEmail || identifier })
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to resend code');
        return;
      }

      setStatusMessage('A fresh 6-digit code has been dispatched to your email.');
      setCountdown(60);
    } catch (err) {
      setError('Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit Reset Password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const cleanOtp = otp.trim();

    if (!cleanOtp || cleanOtp.length < 6) {
      setError('Please enter the full 6-digit verification code');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${baseUrl}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          otp: cleanOtp,
          newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Password reset failed. Check your OTP code.');
        return;
      }

      setStep('SUCCESS');
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Network connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-[var(--bg-body)] text-[var(--text-primary)] relative overflow-hidden font-sans">
      <div className="w-full max-w-lg relative z-10">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <Logo size="md" color="light" showText={false} />
            <span className="font-display font-bold text-base text-[var(--text-primary)]">APRAMEYA</span>
          </Link>
          <p className="text-[11px] font-sans font-medium text-[var(--text-muted)] mb-2 uppercase tracking-[0.15em]">Account Recovery</p>
          <h1 className="text-3xl sm:text-4xl tracking-tight text-[var(--text-primary)]">
            <span className="font-serif italic font-normal text-[1.1em] text-[var(--text-secondary)]">Reset</span>{" "}
            <span className="font-display font-bold">Password</span>
          </h1>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[var(--card-bg)] p-8 sm:p-9">
          
          {error && (
            <Alert variant="destructive" className="bg-red-950/40 border-red-800/50 text-red-300 text-xs mb-5">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {statusMessage && step === 'VERIFY_RESET' && (
            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[var(--text-secondary)] text-xs mb-5 flex items-start gap-2">
              <CheckCircle2 size={14} className="text-[var(--text-primary)] shrink-0 mt-0.5" />
              <span>{statusMessage}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            
            {/* STEP 1: REQUEST OTP */}
            {step === 'REQUEST_OTP' && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-xs text-[var(--text-secondary)] mb-5 leading-relaxed">
                  Enter your College ID Number or registered email address. We will dispatch a 6-digit OTP from the official club email (<span className="text-[var(--text-primary)]">aprameya.techclub@kluniversity.in</span>).
                </p>

                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="identifier" className="text-xs text-[var(--text-secondary)] font-medium">
                      College ID Number or Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                      <Input
                        type="text"
                        id="identifier"
                        placeholder="e.g. 2200030000 or student@kluniversity.in"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-[var(--text-primary)] text-sm focus:border-white/[0.2]"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <ChamferedButton
                      variant="primary"
                      size="md"
                      isLoading={isLoading}
                      className="w-full"
                    >
                      Send Verification Code (OTP)
                    </ChamferedButton>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 2: VERIFY OTP & SET NEW PASSWORD */}
            {step === 'VERIFY_RESET' && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-[var(--text-secondary)] flex items-center justify-between">
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px] uppercase">Destination</span>
                    <span className="font-semibold text-[var(--text-primary)]">{maskedEmail}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setStep('REQUEST_OTP'); setError(''); }}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-3.5">
                  
                  {/* OTP Code */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="otp" className="text-xs text-[var(--text-secondary)] font-medium">
                        6-Digit Verification OTP
                      </Label>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={countdown > 0 || isLoading}
                        className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw size={11} className={isLoading ? "animate-spin" : ""} />
                        {countdown > 0 ? `Resend (${countdown}s)` : 'Resend code'}
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                      <Input
                        type="text"
                        id="otp"
                        maxLength={6}
                        placeholder="••••••"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="pl-10 h-11 bg-white/[0.02] border-white/[0.06] text-[var(--text-primary)] text-lg tracking-[0.3em] text-center font-mono focus:border-white/[0.2]"
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword" className="text-xs text-[var(--text-secondary)] font-medium">
                      New Password (min 6 characters)
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                      <Input
                        type="password"
                        id="newPassword"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-[var(--text-primary)] text-sm focus:border-white/[0.2]"
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs text-[var(--text-secondary)] font-medium">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[var(--text-muted)] w-4 h-4" />
                      <Input
                        type="password"
                        id="confirmPassword"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-10 bg-white/[0.02] border-white/[0.06] text-[var(--text-primary)] text-sm focus:border-white/[0.2]"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <ChamferedButton
                      variant="primary"
                      size="md"
                      isLoading={isLoading}
                      className="w-full"
                    >
                      Update Password
                    </ChamferedButton>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 3: SUCCESS STATE */}
            {step === 'SUCCESS' && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center mx-auto mb-4 text-[var(--text-primary)]">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] font-display mb-1.5">Password Updated</h3>
                <p className="text-xs text-[var(--text-secondary)] mb-6 max-w-sm mx-auto leading-relaxed">
                  Your password has been successfully reset. You can now sign in with your College ID Number.
                </p>

                <Link href="/login">
                  <ChamferedButton variant="primary" size="md" className="w-full">
                    Sign In
                  </ChamferedButton>
                </Link>
              </motion.div>
            )}

          </AnimatePresence>

          <div className="text-center pt-5 border-t border-white/[0.04] mt-5">
            <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <ArrowLeft size={13} />
              <span>Back to Login</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
