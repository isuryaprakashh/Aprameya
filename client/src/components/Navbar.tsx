import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import Logo from './icons/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, ChevronRight, LayoutDashboard } from 'lucide-react';
import { ThemeCustomizer } from './ThemeCustomizer';
import { useTheme } from '@/components/theme-provider';
import ChamferedButton from '@/components/ui/ChamferedButton';

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const { user, logoutMutation } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (location.startsWith('/dashboard')) {
    return null;
  }

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const isActive = (path: string) => location === path;

  const handleLogout = () => {
    logoutMutation.mutate();
    closeMobileMenu();
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Projects' },
    { href: '/events', label: 'Events' },
    { href: '/recruitment', label: 'Recruitment' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/about', label: 'About' },
  ];

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`
            relative flex items-center justify-between 
            w-full max-w-6xl px-4 py-3 
            rounded-2xl transition-all duration-500
            ${scrolled
              ? 'bg-[var(--glass-panel)] backdrop-blur-xl border border-[var(--border-color)] shadow-lg shadow-black/5'
              : 'bg-transparent border-transparent'
            }
          `}
        >
          {/* Logo */}
          <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-3 relative z-10 shrink-0">
            <div className="bg-[var(--bg-body)] rounded-lg p-1.5 border border-[var(--border-color)]">
              <Logo color={isDark ? "light" : "dark"} size="sm" showText={false} />
            </div>
            <span className={`font-bold tracking-tight text-lg ${scrolled ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]'}`}>
              APRAMEYA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            <div className={`
               flex items-center p-1.5 rounded-full border transition-colors duration-500
               ${scrolled ? 'bg-[var(--card-bg)]/50 border-[var(--border-color)]' : 'bg-[var(--glass-panel)]/80 border-[var(--border-color)] backdrop-blur-md'}
             `}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className="relative px-5 py-2 rounded-full text-sm font-medium cursor-pointer group transition-colors">
                    {isActive(link.href) && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-[var(--text-primary)] rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className={`relative z-10 transition-colors ${isActive(link.href) ? 'text-[var(--bg-body)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}`}>
                      {link.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3 relative z-10 shrink-0">
            <ThemeCustomizer />

            {!user ? (
              <Link href="/login">
                <ChamferedButton
                  variant="primary"
                  size="sm"
                >
                  Login
                </ChamferedButton>
              </Link>
            ) : (
              <div className="flex items-center gap-2 pl-3 border-l border-[var(--border-color)]">
                <Link href="/dashboard">
                  <ChamferedButton
                    variant="command"
                    size="sm"
                    leftIcon={<LayoutDashboard size={14} className="text-[hsl(var(--accent))]" />}
                  >
                    Dashboard
                  </ChamferedButton>
                </Link>
                <button
                  onClick={() => logoutMutation.mutate()}
                  className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeCustomizer />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-primary)]"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-[50] h-full w-[80%] max-w-sm bg-[var(--card-bg)] border-l border-[var(--border-color)] p-6 shadow-2xl md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-bold text-xl tracking-tight font-display">Navigation</span>
                <button onClick={closeMobileMenu} className="p-2 rounded-full hover:bg-[var(--border-color)] transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-2">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={closeMobileMenu}>
                    <div className={`
                        flex items-center justify-between p-4 rounded-xl transition-colors
                        ${isActive(link.href) ? 'bg-[var(--btn-bg-hover)] border border-[var(--border-color)]' : 'hover:bg-[var(--bg-body)]'}
                      `}>
                      <span className={isActive(link.href) ? 'font-semibold text-[hsl(var(--accent))]' : 'text-[var(--text-secondary)]'}>
                        {link.label}
                      </span>
                      {isActive(link.href) && <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent))]" />}
                    </div>
                  </Link>
                ))}
              </div>

              {user && (
                <div className="mt-auto pt-6 border-t border-[var(--border-color)] space-y-3">
                  <Link href="/dashboard" onClick={closeMobileMenu}>
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-[var(--bg-body)] border border-[var(--border-color)] hover:border-[hsl(var(--accent))]/50 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-[hsl(var(--accent))]/10 border border-[hsl(var(--accent))]/30 flex items-center justify-center text-[hsl(var(--accent))]">
                        <LayoutDashboard size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-[var(--text-primary)]">{user.display_name || user.username}</div>
                        <div className="text-xs text-[hsl(var(--accent))] font-mono">Open Dashboard</div>
                      </div>
                      <ChevronRight size={16} className="text-[var(--text-secondary)]" />
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-500 font-medium text-xs hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 font-mono"
                  >
                    <LogOut size={14} /> LOGOUT
                  </button>
                </div>
              )}

              {!user && (
                <div className="mt-auto">
                  <Link href="/login" onClick={closeMobileMenu}>
                    <button className="w-full py-4 rounded-xl bg-[hsl(var(--accent))] text-[var(--bg-body)] font-bold shadow-lg shadow-[hsl(var(--accent))]/20">
                      Login to Dashboard
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
