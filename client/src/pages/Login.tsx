import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import Logo from '../components/icons/Logo';
import { Eye, EyeOff } from 'lucide-react';
import ChamferedButton from '@/components/ui/ChamferedButton';
import { queryClient } from '@/lib/queryClient';

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

      const userData = await response.json();
      queryClient.setQueryData(["/api/me"], userData);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('aprameya_intro_completed', 'true');
      }
      if (userData.role === 'ADMIN' || userData.role === 'CORE') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/';
      }
    } catch {
      setError('Network error. Please check server connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24 bg-bg text-text">
      {/* Centered 400px card (Section 5.8) */}
      <div className="w-full max-w-[420px] rounded-lg border border-border p-8 bg-surface">
        {/* Logo on top */}
        <div className="flex flex-col items-center text-center mb-6">
          <Link href="/" className="mb-4 inline-block">
            <Logo size="md" color="light" showText={false} />
          </Link>
          <h2 className="font-display font-medium text-2xl tracking-tight text-text mb-1">
            Welcome back
          </h2>
          <p className="text-xs text-text-3 font-mono">
            SIGN IN TO ACCESS LABORATORY REPOSITORIES
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 p-3 rounded-md border border-red-line bg-red-soft text-xs text-red-text font-body">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-5 p-3 rounded-md border border-border bg-surface-2 text-xs text-text-2 font-body">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-body font-medium text-text mb-1.5" htmlFor="username">
              College ID Number (Roll No)
            </label>
            <input
              id="username"
              type="text"
              required
              value={formData.username}
              onChange={handleInputChange}
              placeholder="e.g. 2300049169"
              className="w-full h-[44px] px-3.5 rounded-md border border-border-strong bg-transparent text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring font-mono"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-body font-medium text-text" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password">
                <span className="text-[11px] font-mono text-text-3 hover:text-text transition-colors cursor-pointer">
                  Forgot?
                </span>
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full h-[44px] pl-3.5 pr-10 rounded-md border border-border-strong bg-transparent text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 hover:text-text cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <ChamferedButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Sign in
            </ChamferedButton>
          </div>
        </form>

        {/* Links */}
        <div className="mt-6 pt-6 border-t border-border text-center space-y-2">
          <p className="text-xs text-text-2">
            Don't have an account?{' '}
            <Link href="/signup">
              <span className="text-text font-medium hover:underline cursor-pointer">
                Create one
              </span>
            </Link>
          </p>
          <p className="text-[11px] font-mono text-text-3">
            Interested in joining the club?{' '}
            <Link href="/recruitment">
              <span className="text-red-text hover:underline cursor-pointer">
                Apply for recruitment →
              </span>
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
