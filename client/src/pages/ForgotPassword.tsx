import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import Logo from '@/components/icons/Logo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Lock, KeyRound, ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPassword() {
  const [step, setStep] = useState<'REQUEST_OTP' | 'VERIFY_RESET' | 'SUCCESS'>('REQUEST_OTP');

  // Step 1 State
  const [identifier, setIdentifier] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

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
      setError('Please enter your College ID or registered email');
      setIsLoading(false);
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to request reset OTP. Check your ID.');
        return;
      }

      setMaskedEmail(data.maskedEmail || identifier);
      setStatusMessage(data.message || 'Verification code sent to your registered email.');
      setCountdown(60);
      setStep('VERIFY_RESET');
    } catch {
      setError('Network communication failed. Please check your connection.');
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
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to resend code');
        return;
      }

      setStatusMessage('A new verification code has been dispatched.');
      setCountdown(60);
    } catch {
      setError('Failed to resend code.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Verify OTP and update password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setStatusMessage('');

    if (otp.length !== 6) {
      setError('Verification code must be exactly 6 digits');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: identifier.trim(),
          otp: otp.trim(),
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid or expired OTP');
        return;
      }

      setStep('SUCCESS');
    } catch {
      setError('Password reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center p-6 text-paper">
      {/* 400px Centered Card (§8.10) */}
      <div className="w-full max-w-[400px] border border-hairline p-8 bg-surface-1">
        <div className="flex flex-col items-center text-center mb-6">
          <Link href="/" className="mb-4 inline-block">
            <Logo size="md" color="light" showText={false} />
          </Link>
          <h1 className="text-2xl font-medium tracking-tight text-paper">
            Reset password
          </h1>
          <p className="mt-1 text-xs text-mute font-sans">
            Verify identity via college email OTP
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 border border-signal-line bg-signal-soft text-xs text-signal-text font-sans">
            {error}
          </div>
        )}
        {statusMessage && (
          <div className="mb-5 p-3 border border-hairline bg-surface-2 text-xs text-text-2 font-sans">
            {statusMessage}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'REQUEST_OTP' && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-xs text-text-2 mb-5 leading-relaxed font-sans">
                Enter your College ID or registered email. We will send a 6-digit OTP to your address.
              </p>

              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <Label htmlFor="identifier" className="text-xs text-mute">
                    College ID or email address
                  </Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute size-4" />
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="e.g. 2200030000 or id@kluniversity.in"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="pl-10"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={isLoading}
                  >
                    Send verification code
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'VERIFY_RESET' && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="mb-4 p-3 border border-hairline bg-surface-2 text-xs flex items-center justify-between">
                <div>
                  <span className="text-mute block text-[11px]">Sent to</span>
                  <span className="font-medium text-paper">{maskedEmail}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep('REQUEST_OTP');
                    setError('');
                  }}
                  className="text-xs text-mute hover:text-paper underline cursor-pointer"
                >
                  Change
                </button>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label htmlFor="otp" className="text-xs text-mute">
                      6-digit verification OTP
                    </Label>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={countdown > 0 || isLoading}
                      className="text-xs text-mute hover:text-paper disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={11} className={isLoading ? 'animate-spin' : ''} />
                      <span>{countdown > 0 ? `Resend (${countdown}s)` : 'Resend'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute size-4" />
                    <Input
                      id="otp"
                      type="text"
                      maxLength={6}
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="pl-10 font-mono tracking-widest text-center"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-xs text-mute">
                    New password
                  </Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute size-4" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-xs text-mute">
                    Confirm new password
                  </Label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute size-4" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    loading={isLoading}
                  >
                    Update password
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'SUCCESS' && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 space-y-4"
            >
              <div className="size-12 rounded-full border border-ok/30 bg-ok/10 flex items-center justify-center mx-auto text-ok">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-paper">Password updated</h3>
                <p className="text-xs text-mute mt-1">
                  Your credentials have been updated. You can now sign in with your new password.
                </p>
              </div>

              <Link href="/login">
                <Button variant="primary" size="lg" className="w-full">
                  Sign in
                </Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center pt-5 border-t border-hairline mt-6">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-mute hover:text-paper transition-colors">
            <ArrowLeft size={13} />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
