import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import Logo from '@/components/icons/Logo';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Signup() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    collegeId: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const cleanCollegeId = formData.collegeId.trim();

    if (!cleanCollegeId) {
      setError('Please enter your College ID number');
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
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: cleanCollegeId,
          password: formData.password,
          email: formData.email.trim(),
          name: formData.fullName.trim(),
          role: 'aspirant',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create account. User may already exist.');
        return;
      }

      setLocation('/login?message=Account+created+successfully.+Please+sign+in.');
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
        <div className="flex flex-col items-center text-center mb-6">
          <Link href="/" className="mb-4 inline-block">
            <Logo size="md" color="light" showText={false} />
          </Link>
          <h1 className="text-2xl font-medium tracking-tight text-paper">
            Create your account
          </h1>
          <p className="mt-1 text-xs text-mute font-sans">
            Aspirant access for events, workshops and recruitment
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 border border-signal-line bg-signal-soft text-xs text-signal-text font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="collegeId" className="text-xs text-mute">
              College ID number (Roll No)
            </Label>
            <Input
              id="collegeId"
              type="text"
              required
              value={formData.collegeId}
              onChange={handleInputChange}
              placeholder="e.g. 2300049169"
              className="mt-1.5 font-mono"
            />
          </div>

          <div>
            <Label htmlFor="fullName" className="text-xs text-mute">
              Full name
            </Label>
            <Input
              id="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g. Surya Prakash"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-xs text-mute">
              College email address
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="id@kluniversity.in"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-xs text-mute">
              Password
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="At least 6 characters"
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

          <div>
            <Label htmlFor="confirmPassword" className="text-xs text-mute">
              Confirm password
            </Label>
            <div className="relative mt-1.5">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Repeat password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-paper cursor-pointer"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              id="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="mt-1 size-3.5 accent-signal cursor-pointer"
            />
            <label htmlFor="agreeToTerms" className="text-xs text-text-2 leading-relaxed cursor-pointer font-sans">
              I agree to adhere to Aprameya ASC research ethics and laboratory policies.
            </label>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={isLoading}
            >
              Create account
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-hairline text-center space-y-2 text-xs">
          <p className="text-text-2">
            Already have an account?{' '}
            <Link href="/login">
              <span className="text-paper font-medium hover:underline cursor-pointer">
                Sign in
              </span>
            </Link>
          </p>
          <p className="text-mute">
            New aspirant?{' '}
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
