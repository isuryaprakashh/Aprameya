import { useState } from 'react';
import { Link } from 'wouter';
import Logo from '../components/icons/Logo';
import { Eye, EyeOff } from 'lucide-react';
import ChamferedButton from '@/components/ui/ChamferedButton';

const Signup = () => {
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
      const baseUrl = import.meta.env.VITE_API_URL || '';
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
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to sign up');
        return;
      }

      window.location.href =
        '/login?message=Account created successfully! Please log in with your College ID.';
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-24 bg-bg text-text">
      {/* Centered 400px card (Section 5.8) */}
      <div className="w-full max-w-[420px] rounded-lg border border-border p-8 bg-surface">
        <div className="flex flex-col items-center text-center mb-6">
          <Link href="/" className="mb-4 inline-block">
            <Logo size="md" color="light" showText={false} />
          </Link>
          <h2 className="font-display font-medium text-2xl tracking-tight text-text mb-1">
            Create account
          </h2>
          <p className="text-xs text-text-3 font-mono">
            DEFAULT ASPIRANT ROLE · PORTAL ACCESS
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-md border border-red-line bg-red-soft text-xs text-red-text font-body">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-body font-medium text-text mb-1.5" htmlFor="collegeId">
              College ID Number (Roll No)
            </label>
            <input
              id="collegeId"
              type="text"
              required
              value={formData.collegeId}
              onChange={handleInputChange}
              placeholder="e.g. 2300049169"
              className="w-full h-[44px] px-3.5 rounded-md border border-border-strong bg-transparent text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-body font-medium text-text mb-1.5" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="e.g. Surya Prakash"
              className="w-full h-[44px] px-3.5 rounded-md border border-border-strong bg-transparent text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-body font-medium text-text mb-1.5" htmlFor="email">
              College Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="id@kluniversity.in"
              className="w-full h-[44px] px-3.5 rounded-md border border-border-strong bg-transparent text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-body font-medium text-text mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="At least 6 characters"
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

          <div>
            <label className="block text-xs font-body font-medium text-text mb-1.5" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Repeat password"
                className="w-full h-[44px] pl-3.5 pr-10 rounded-md border border-border-strong bg-transparent text-sm text-text placeholder:text-text-3 focus:outline-none focus:border-focus-ring"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 hover:text-text cursor-pointer"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-2">
            <input
              id="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 accent-red cursor-pointer"
            />
            <label htmlFor="agreeToTerms" className="text-xs text-text-2 leading-relaxed cursor-pointer">
              I agree to adhere to the Aprameya club research ethics and laboratory policies.
            </label>
          </div>

          <div className="pt-2">
            <ChamferedButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Create account
            </ChamferedButton>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center space-y-2">
          <p className="text-xs text-text-2">
            Already have an account?{' '}
            <Link href="/login">
              <span className="text-text font-medium hover:underline cursor-pointer">
                Sign in
              </span>
            </Link>
          </p>
          <p className="text-[11px] font-mono text-text-3">
            New aspirant?{' '}
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

export default Signup;
