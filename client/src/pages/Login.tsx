import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import Logo from '@/components/icons/Logo';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('message');
    if (msg) setSuccessMessage(msg);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid college ID or password');
        return;
      }

      const userData = await response.json();
      
      // Update cache immediately so user is visible across Header, Dock, ProtectedRoute without requiring page reload
      queryClient.setQueryData(['/api/me'], userData);
      await queryClient.invalidateQueries({ queryKey: ['/api/me'] });

      setLocation('/');
    } catch {
      setError('Connection failed. Please verify the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink flex items-center justify-center p-6 text-paper">
      {/* 400px Centered Card (§8.10) */}
      <div className="w-full max-w-[400px] border border-hairline p-8 bg-surface-1">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <Link href="/" className="mb-4 inline-block">
            <Logo size="md" color="light" showText={false} />
          </Link>
          <h1 className="text-2xl font-medium tracking-tight text-paper">
            Welcome back
          </h1>
          <p className="mt-1 text-xs text-mute font-sans">
            Sign in to access your Aprameya account
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 p-3 border border-signal-line bg-signal-soft text-xs text-signal-text font-sans">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-5 p-3 border border-hairline bg-surface-2 text-xs text-text-2 font-sans">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-xs text-mute">
              College ID number
            </Label>
            <Input
              id="username"
              type="text"
              required
              value={formData.username}
              onChange={handleInputChange}
              placeholder="e.g. 2300049169"
              className="mt-1.5 font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <Label htmlFor="password" className="text-xs text-mute">
                Password
              </Label>
              <Link href="/forgot-password">
                <span className="text-xs text-mute hover:text-paper transition-colors cursor-pointer">
                  Forgot?
                </span>
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-paper cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
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
              Sign in
            </Button>
          </div>
        </form>

        {/* Footer Links */}
        <div className="mt-6 pt-6 border-t border-hairline text-center space-y-2 text-xs">
          <p className="text-text-2">
            Don't have an account?{' '}
            <Link href="/signup">
              <span className="text-paper font-medium hover:underline cursor-pointer">
                Create one
              </span>
            </Link>
          </p>
          <p className="text-mute">
            Interested in joining the club?{' '}
            <Link href="/recruitment">
              <span className="text-signal-text hover:underline cursor-pointer">
                Apply for recruitment
              </span>
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
