import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import Logo from './icons/Logo';
import { ThemeToggle } from './theme-toggle';
import RoleBadge from './ui/RoleBadge';
import { Button } from './ui/button';
import Detect from './ui/detect';
import { LayoutDashboard, LogOut, Ticket, ChevronDown, QrCode, Mail } from 'lucide-react';

export const Header: React.FC = () => {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, logoutMutation } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/events', label: 'Events' },
    { href: '/team', label: 'Team' },
    { href: '/recruitment', label: 'Recruitment' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/about', label: 'About' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location === '/') return true;
    if (path !== '/' && location.startsWith(path)) return true;
    if (path === '/team' && (location === '/teams' || location.startsWith('/team/') || location.startsWith('/teams/'))) return true;
    return false;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setUserDropdownOpen(false);
  };

  const displayName = user?.display_name || user?.username || user?.name || 'Member';
  const initials = (user?.display_name || user?.username || user?.email || 'AP').slice(0, 2).toUpperCase();

  const formatRole = (role?: string) => {
    if (!role) return 'Member';
    const r = role.toLowerCase();
    if (r.includes('admin')) return 'Admin';
    if (r.includes('core')) return 'Core';
    if (r.includes('aspirant')) return 'Student';
    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-sticky h-16 w-full transition-colors duration-fast ${
        scrolled
          ? 'bg-ink/85 backdrop-blur-md border-b border-hairline'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-container h-full mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between">
        {/* Left: Brand Logo & Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0 select-none group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-[var(--r-1)]"
        >
          <Logo size="md" showText={true} />
        </Link>

        {/* Center: Desktop Navigation Links (≥ 900px) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-[14px] font-sans font-normal transition-colors relative block select-none rounded-[var(--r-1)] ${
                  active ? 'text-paper font-medium' : 'text-text-2 hover:text-paper'
                }`}
              >
                {link.label}
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-signal"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme Toggle & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {user ? (
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 sm:gap-2.5 px-2 sm:px-2.5 py-1.5 rounded-[10px] border border-hairline bg-surface-2 hover:bg-surface-3 hover:border-hairline-2 transition-all duration-fast cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
                aria-label="User menu"
                aria-expanded={userDropdownOpen}
              >
                {/* Squircle Avatar */}
                <div className="w-8 h-8 rounded-[9px] overflow-hidden bg-surface-3 border border-hairline flex items-center justify-center shrink-0">
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[12px] font-mono text-paper font-semibold tracking-tight">
                      {initials}
                    </span>
                  )}
                </div>

                {/* Welcome text & role */}
                <div className="hidden sm:flex items-center gap-1.5 text-[13px] font-sans leading-none">
                  <span className="text-mute font-normal">Welcome,</span>
                  <span className="font-medium text-paper max-w-[130px] lg:max-w-[160px] truncate">
                    {displayName}
                  </span>
                  <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded-[5px] bg-surface-3 border border-hairline text-mute">
                    ({formatRole(user.role)})
                  </span>
                </div>

                <ChevronDown
                  className={`w-3.5 h-3.5 text-mute transition-transform duration-fast shrink-0 ${
                    userDropdownOpen ? 'rotate-180 text-paper' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute right-0 mt-2 w-72 sm:w-80 rounded-[14px] border border-hairline-2 bg-white dark:bg-[#0B0B0B] p-2.5 shadow-2xl z-dropdown opacity-100"
                  >
                    {/* User Identity Header Card */}
                    <div className="p-3 rounded-[10px] bg-[#F5F5F5] dark:bg-[#141414] border border-hairline mb-2">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-[10px] overflow-hidden bg-surface-3 border border-hairline-2 flex items-center justify-center shrink-0 shadow-sm">
                          {user.profile_image ? (
                            <img
                              src={user.profile_image}
                              alt={displayName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[14px] font-mono text-paper font-bold">
                              {initials}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5 mb-0.5">
                            <p className="text-[14px] font-sans font-semibold text-paper truncate">
                              {displayName}
                            </p>
                            <RoleBadge role={user.role} className="scale-90 origin-right" />
                          </div>
                          <p className="text-[11px] font-mono text-mute truncate flex items-center gap-1.5">
                            <Mail className="w-3 h-3 shrink-0 text-text-3" />
                            <span className="truncate">{user.email}</span>
                          </p>
                          {user.rollNumber && (
                            <p className="text-[10px] font-mono text-text-3 mt-1 uppercase tracking-wider">
                              ID: {user.rollNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Navigation Options with Rich UX */}
                    <div className="space-y-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-[9px] hover:bg-surface-3 transition-colors group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-[8px] bg-surface-3 group-hover:bg-surface-2 border border-hairline flex items-center justify-center text-text-2 group-hover:text-paper shrink-0 transition-colors">
                          <LayoutDashboard className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium text-paper group-hover:text-paper leading-tight">
                            Dashboard
                          </div>
                          <div className="text-[11px] font-sans text-mute truncate">
                            {user.role === 'ADMIN' || user.role === 'CORE'
                              ? 'Admin control center & telemetry'
                              : 'Activity, registrations & status'}
                          </div>
                        </div>
                      </Link>

                      <Link
                        href="/my-tickets"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-[9px] hover:bg-surface-3 transition-colors group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-[8px] bg-surface-3 group-hover:bg-surface-2 border border-hairline flex items-center justify-center text-text-2 group-hover:text-paper shrink-0 transition-colors">
                          <Ticket className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium text-paper group-hover:text-paper leading-tight">
                            My Event Passes
                          </div>
                          <div className="text-[11px] font-sans text-mute truncate">
                            View active QR tickets & passes
                          </div>
                        </div>
                      </Link>

                      {(user.role === 'ADMIN' || user.role === 'CORE') && (
                        <Link
                          href="/dashboard/scan"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-[9px] hover:bg-surface-3 transition-colors group cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-[8px] bg-surface-3 group-hover:bg-surface-2 border border-hairline flex items-center justify-center text-text-2 group-hover:text-paper shrink-0 transition-colors">
                            <QrCode className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-medium text-paper group-hover:text-paper leading-tight">
                              Gate Scanner
                            </div>
                            <div className="text-[11px] font-sans text-mute truncate">
                              Scan attendee tickets at check-in
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="my-1.5 border-t border-hairline" />

                    {/* Sign Out Action */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-medium text-signal-text hover:bg-signal-soft transition-colors cursor-pointer text-left group"
                    >
                      <div className="w-8 h-8 rounded-[8px] bg-signal-soft border border-signal-line flex items-center justify-center text-signal-text shrink-0 group-hover:scale-105 transition-transform">
                        <LogOut className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="leading-tight">Sign out</span>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/recruitment">
                <Button variant="primary" size="sm">
                  Apply
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
