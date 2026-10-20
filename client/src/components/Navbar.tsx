import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import Logo from './icons/Logo';
import { Menu, X, LogOut, LayoutDashboard, User, Shield, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import RoleBadge from './ui/RoleBadge';

const Navbar = () => {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, logoutMutation } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  if (location.startsWith('/dashboard')) {
    return null;
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    if (path === '/team' && (location === '/teams' || location.startsWith('/team/') || location.startsWith('/teams/'))) return true;
    return false;
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/events', label: 'Events' },
    { href: '/team', label: 'Team' },
    { href: '/recruitment', label: 'Recruitment' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/about', label: 'About' },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
    setUserDropdownOpen(false);
    closeMobileMenu();
  };

  const getInitials = (name?: string) => {
    if (!name) return 'AP';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-50 h-16 w-full transition-colors duration-fast ${
          scrolled
            ? 'bg-bg/80 backdrop-blur-md border-b border-border'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[1200px] h-full mx-auto px-6 md:px-8 flex items-center justify-between">
          {/* Left: Logo */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring rounded-md"
          >
            <img
              src="/logo-white.png"
              alt="Aprameya Logo"
              className="h-8 sm:h-9 w-auto object-contain transition-transform duration-fast group-hover:scale-105"
            />
            <span className="font-display font-bold text-base sm:text-lg tracking-wider text-text uppercase">
              APRAMEYA
            </span>
          </Link>

          {/* Center (desktop): Inter 14px, text-2. Active page: text plus 2px red underline */}
          <nav className="hidden lg:flex items-center gap-7 h-full">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative h-full flex items-center focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-ring rounded-sm"
                >
                  <span
                    className={`font-body text-sm transition-colors duration-fast ${
                      active ? 'text-text font-medium' : 'text-text-2 hover:text-text'
                    }`}
                  >
                    {link.label}
                  </span>
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-red" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Theme toggle + Auth actions */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <ThemeToggle />

            {!user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="h-8 px-3 inline-flex items-center justify-center rounded-md text-sm font-body text-text-2 hover:text-text hover:bg-surface-2 transition-colors duration-fast"
                >
                  Sign in
                </Link>
                <Link
                  href="/recruitment"
                  className="h-8 px-3 inline-flex items-center justify-center rounded-md text-sm font-body font-medium bg-red text-white hover:bg-red-hover transition-colors duration-fast"
                >
                  Apply
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full border border-border hover:border-border-strong transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  aria-expanded={userDropdownOpen}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.display_name || user.username}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-surface-2 text-text-2 text-xs font-mono font-medium flex items-center justify-center">
                      {getInitials(user.display_name || user.username)}
                    </div>
                  )}
                </button>

                {/* Dropdown Menu (DESIGN.md Section 4.11) */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md bg-surface-2 border border-border-strong p-1.5 shadow-xl z-60 animate-in fade-in-50 zoom-in-95 duration-fast">
                    <div className="px-2.5 py-2 border-b border-border mb-1">
                      <div className="font-medium text-sm text-text truncate">
                        {user.display_name || user.username}
                      </div>
                      <div className="mt-1">
                        <RoleBadge role={user.role} />
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 h-9 rounded-sm text-sm text-text-2 hover:text-text hover:bg-surface transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 h-9 rounded-sm text-sm text-text-2 hover:text-text hover:bg-surface transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>

                    {(user.role === 'ADMIN' || user.role === 'CORE') && (
                      <Link
                        href="/dashboard?view=overview"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 h-9 rounded-sm text-sm text-text-2 hover:text-text hover:bg-surface transition-colors"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Manage</span>
                      </Link>
                    )}

                    <div className="border-t border-border my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-2.5 h-9 rounded-sm text-sm text-red-text hover:bg-red-soft transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Right: Theme toggle + Menu Icon (< 900px) */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md border border-border text-text hover:bg-surface-2 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Sheet on --bg (DESIGN.md Section 4.2) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-bg flex flex-col p-6 lg:hidden overflow-y-auto animate-in fade-in duration-fast">
          <div className="flex-1 divide-y divide-border">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between h-14"
                >
                  <span
                    className={`font-display text-xl ${
                      active ? 'text-text font-medium' : 'text-text-2'
                    }`}
                  >
                    {link.label}
                  </span>
                  {active && <span className="w-2 h-2 rounded-full bg-red" />}
                </Link>
              );
            })}
          </div>

          {/* Pinned CTA at bottom */}
          <div className="pt-6 border-t border-border mt-auto space-y-3">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-text">
                    {user.display_name || user.username}
                  </span>
                  <RoleBadge role={user.role} />
                </div>
                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="w-full h-12 flex items-center justify-center rounded-md bg-surface-2 border border-border text-text font-medium text-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full h-12 flex items-center justify-center rounded-md border border-red-line text-red-text font-medium text-sm hover:bg-red-soft"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="h-12 flex items-center justify-center rounded-md border border-border-strong text-text font-medium text-sm hover:bg-surface-2"
                >
                  Sign in
                </Link>
                <Link
                  href="/recruitment"
                  onClick={closeMobileMenu}
                  className="h-12 flex items-center justify-center rounded-md bg-red text-white font-medium text-sm hover:bg-red-hover"
                >
                  Apply
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
