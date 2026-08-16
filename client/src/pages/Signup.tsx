import { useState } from 'react';
import { Link } from 'wouter';
import Logo from '../components/icons/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Shield, Users, Zap, Hash } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/v6-card';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    rollNumber: '',
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
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
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
      setError('Please agree to the Terms of Service and Privacy Policy');
      setIsLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.rollNumber)) {
      setError('Roll number must be exactly 10 digits');
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
          username: formData.username,
          email: formData.email,
          rollNumber: formData.rollNumber,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to sign up');
        return;
      }

      // Success - redirect to login
      window.location.href = '/login?message=Registration successful! Please log in.';
    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[var(--bg-body)] relative overflow-hidden">
      <div className="absolute inset-0 dither-bg opacity-30 pointer-events-none"></div>
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center lg:text-left">
            <Link href="/" className="inline-flex items-center justify-center lg:justify-start mb-8">
              <Logo size="xl" />
            </Link>
            <div className="mb-6">
              <p className="text-xs font-mono text-[var(--text-secondary)] mb-2">/// NEW USER REGISTRATION</p>
              <h1 className="font-bold text-5xl lg:text-6xl leading-none text-[var(--text-primary)]">
                JOIN THE<br />FUTURE
              </h1>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-12 max-w-lg font-mono leading-relaxed">
              Become part of our vibrant community of innovators, researchers, and engineers
              shaping the future of autonomous vehicle technology.
            </p>

            {/* Benefits */}
            <div className="space-y-4 border-l border-[var(--border-color)] pl-6">
              {[
                { icon: Users, text: "Join 50+ passionate members" },
                { icon: Zap, text: "Access cutting-edge projects" },
                { icon: Shield, text: "Learn from industry experts" }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <div className="w-8 h-8 bg-[var(--card-bg)] border border-[var(--border-color)] flex items-center justify-center">
                    <benefit.icon className="w-4 h-4 text-[var(--text-primary)]" />
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Signup Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <GlassPanel className="border-0 shadow-2xl backdrop-blur-sm p-0">
            <div className="p-6 text-center pb-6">
              <div className="lg:hidden mb-4">
                <Link href="/" className="inline-flex items-center justify-center">
                  <Logo size="lg" />
                </Link>
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Create Account</h2>
              <p className="text-[var(--text-secondary)]">Join Aprameya and start your innovation journey</p>
            </div>

            <div className="p-6 pt-0 space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-[var(--text-primary)]">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
                    <Input
                      type="text"
                      id="username"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="pl-10 bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-primary)]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[var(--text-primary)]">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
                    <Input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-primary)]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rollNumber" className="text-[var(--text-primary)]">Roll Number</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
                    <Input
                      type="text"
                      id="rollNumber"
                      placeholder="Enter 10-digit roll number"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      maxLength={10}
                      pattern="\d{10}"
                      className="pl-10 bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-primary)]"
                      required
                    />
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">Must be exactly 10 digits</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-[var(--text-primary)]">Role</Label>
                  <div className="p-3 bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)]">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-[hsl(var(--accent))]" />
                      <span className="font-medium text-[var(--text-primary)]">Aspirant</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      New members start as Aspirants. You can be promoted to Core Team by admins later.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[var(--text-primary)]">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-primary)]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[var(--text-primary)]">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-primary)]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                    }
                    className="mt-1 border-black dark:border-white data-[state=checked]:bg-[hsl(var(--accent))] data-[state=checked]:text-[var(--bg-body)]"
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    I agree to the{' '}
                    <Link href="#" className="text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]/80 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]/80 hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>

              <div className="text-center pt-4 border-t border-[var(--border-color)]">
                <p className="text-[var(--text-secondary)]">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]/80 font-medium hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;