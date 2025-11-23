import { useState } from 'react';
import { Link } from 'wouter';
import Logo from '../components/icons/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/v6-card';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to login');
        return;
      }

      window.location.href = '/';
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
              <p className="text-xs font-mono text-[hsl(var(--accent))] mb-2 tracking-widest">/// ACCESS CONTROL</p>
              <h1 className="font-bold text-5xl lg:text-6xl leading-none text-[var(--text-primary)]">
                WELCOME<br />BACK
              </h1>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-12 max-w-lg font-mono leading-relaxed">
              Continue your journey in autonomous vehicle innovation.
              Access your dashboard and connect with the community.
            </p>

            {/* Features */}
            <div className="space-y-4 border-l border-[var(--border-color)] pl-6">
              {[
                { icon: Shield, text: "Secure & Private" },
                { icon: User, text: "Personalized Dashboard" },
                { icon: ArrowRight, text: "Quick Access to Projects" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                >
                  <div className="w-8 h-8 bg-[var(--card-bg)] border border-[var(--border-color)] flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-[var(--text-primary)]" />
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
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
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Sign In</h2>
              <p className="text-[var(--text-secondary)]">Enter your credentials to access your account</p>
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
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="pl-10 bg-[var(--bg-body)] border-[var(--border-color)] text-[var(--text-primary)]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[var(--text-primary)]">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password"
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                      }
                      className="border-[var(--border-color)] data-[state=checked]:bg-[hsl(var(--accent))] data-[state=checked]:text-[var(--bg-body)]"
                    />
                    <Label htmlFor="rememberMe" className="text-sm text-[var(--text-secondary)]">Remember me</Label>
                  </div>
                  <Link href="#" className="text-sm text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]/80 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:bg-[hsl(var(--accent))]/90"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>

              <div className="text-center pt-4 border-t border-[var(--border-color)]">
                <p className="text-[var(--text-secondary)]">
                  New to Aprameya?{' '}
                  <Link href="/signup" className="text-[hsl(var(--accent))] hover:text-[hsl(var(--accent))]/80 font-medium hover:underline">
                    Create an account
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

export default Login;
