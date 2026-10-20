import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Layers, Calendar, Users, MoreHorizontal, X, FileText, BookOpen, Info, LogIn, LogOut, Ticket, User, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/components/theme-provider';

export const Dock: React.FC = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { theme, setTheme } = useTheme();
  const [moreOpen, setMoreOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // Hide dock if visual viewport shrinks by > 150px (mobile keyboard open)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const initialHeight = window.visualViewport.height;

    const handleResize = () => {
      if (!window.visualViewport) return;
      const isKb = initialHeight - window.visualViewport.height > 150;
      setKeyboardOpen(isKb);
    };

    window.visualViewport.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  if (keyboardOpen || location.startsWith('/dashboard/scan')) {
    return null;
  }

  const items = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/projects', label: 'Projects', icon: Layers },
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/team', label: 'Team', icon: Users },
  ];

  const isActive = (href: string) => {
    if (href === '/' && location === '/') return true;
    if (href !== '/' && location.startsWith(href)) return true;
    if (href === '/team' && (location === '/teams' || location.startsWith('/team/'))) return true;
    return false;
  };

  const initials = (user?.username || user?.email || 'AP').slice(0, 2).toUpperCase();

  return (
    <>
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-3 left-3 right-3 z-dock h-16 bg-ink/90 backdrop-blur-lg border border-hairline rounded-[var(--r-5)] shadow-float flex items-center justify-around px-2"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full relative text-center py-1 select-none"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.8 }}
                className="flex flex-col items-center gap-1"
              >
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    active ? 'text-paper' : 'text-mute'
                  }`}
                />
                <span className={`text-[10px] font-sans leading-none ${active ? 'text-paper font-medium' : 'text-mute'}`}>
                  {item.label}
                </span>
                {active && (
                  <motion.span
                    layoutId="dock-dot"
                    className="w-1 h-1 rounded-full bg-signal"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}

        {/* More / User Avatar button */}
        <button
          type="button"
          onClick={() => setMoreOpen(!moreOpen)}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none"
          aria-label="More navigation options"
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.8 }}
            className="flex flex-col items-center gap-1"
          >
            {user ? (
              <div className="w-5 h-5 rounded-[6px] overflow-hidden bg-surface-3 border border-hairline flex items-center justify-center text-[9px] font-mono text-paper font-medium">
                {user.profile_image ? (
                  <img src={user.profile_image} alt="" className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
            ) : (
              <MoreHorizontal className="w-5 h-5 text-mute" />
            )}
            <span className="text-[10px] font-sans leading-none text-mute">
              {user ? 'Account' : 'More'}
            </span>
          </motion.div>
        </button>
      </nav>

      {/* Mobile More Bottom Sheet */}
      <AnimatePresence>
        {moreOpen && (
          <div className="fixed inset-0 z-sheet md:hidden flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="absolute inset-0 bg-scrim backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 30 }}
              className="relative w-full bg-surface-1 border-t border-hairline rounded-t-[var(--r-5)] p-5 z-10 max-h-[85vh] overflow-y-auto"
            >
              {/* Drag handle */}
              <div className="w-9 h-1 rounded-full bg-hairline-3 mx-auto mb-5" />

              <div className="flex items-center justify-between pb-3 border-b border-hairline mb-4">
                <span className="font-sans font-medium text-[16px] text-paper">
                  Explore & Settings
                </span>
                <button
                  type="button"
                  onClick={() => setMoreOpen(false)}
                  className="p-1 rounded-[var(--r-1)] text-mute hover:text-paper"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {user && (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Link
                    href="/profile"
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-[var(--r-2)] border border-hairline bg-surface-2 text-[13px] font-sans text-paper"
                  >
                    <User className="w-4 h-4 text-paper" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-2.5 p-3 rounded-[var(--r-2)] border border-hairline bg-surface-2 text-[13px] font-sans text-paper"
                  >
                    <LayoutDashboard className="w-4 h-4 text-paper" />
                    <span>Dashboard</span>
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-4">
                <Link
                  href="/recruitment"
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-[var(--r-2)] border border-hairline bg-surface-2/60 text-[13px] font-sans text-paper"
                >
                  <FileText className="w-4 h-4 text-signal-text" />
                  <span>Recruitment</span>
                </Link>

                <Link
                  href="/blogs"
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-[var(--r-2)] border border-hairline bg-surface-2/60 text-[13px] font-sans text-paper"
                >
                  <BookOpen className="w-4 h-4 text-mute" />
                  <span>Blogs</span>
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-[var(--r-2)] border border-hairline bg-surface-2/60 text-[13px] font-sans text-paper"
                >
                  <Info className="w-4 h-4 text-mute" />
                  <span>About</span>
                </Link>

                <Link
                  href="/my-tickets"
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-[var(--r-2)] border border-hairline bg-surface-2/60 text-[13px] font-sans text-paper"
                >
                  <Ticket className="w-4 h-4 text-mute" />
                  <span>My tickets</span>
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full flex items-center justify-between p-3 rounded-[var(--r-2)] border border-hairline bg-surface-2/60 hover:bg-surface-2 active:scale-[0.99] transition-all cursor-pointer mb-4 text-left select-none group"
                aria-label="Toggle appearance"
              >
                <div className="flex items-center gap-2.5">
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-mute group-hover:text-paper transition-colors" />
                  ) : (
                    <Moon className="w-4 h-4 text-mute group-hover:text-paper transition-colors" />
                  )}
                  <span className="text-[13px] font-sans text-paper">Appearance</span>
                </div>
                <span className="text-[11px] font-mono text-mute uppercase tracking-wider bg-surface-3 px-2 py-0.5 rounded-[5px] border border-hairline">
                  {theme === 'dark' ? 'Dark' : 'Light'}
                </span>
              </button>

              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    logoutMutation.mutate();
                    setMoreOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-[var(--r-2)] border border-signal-line text-[14px] text-signal-text font-sans font-medium hover:bg-signal-soft transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMoreOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 p-3 rounded-[var(--r-2)] border border-hairline-2 text-[14px] text-paper font-sans font-medium"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign in</span>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMoreOpen(false)}
                    className="flex-1 flex items-center justify-center p-3 rounded-[var(--r-2)] bg-signal text-[14px] text-on-signal font-sans font-medium"
                  >
                    <span>Register</span>
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Dock;
