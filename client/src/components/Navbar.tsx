import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import Logo from './icons/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, ChevronRight, LayoutDashboard } from 'lucide-react';
import ChamferedButton from '@/components/ui/ChamferedButton';

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`
            relative flex items-center justify-between 
            w-full max-w-6xl px-4 py-2.5
            rounded-xl transition-all duration-500
            ${scrolled
              ? 'bg-[var(--bg-body)]/90 backdrop-blur-xl border border-white/[0.06] shadow-lg shadow-black/10'
              : 'bg-transparent border-transparent'
            }
          `}
        >
          {/* Logo */}
          <Link href="/" onClick={closeMobileMenu} className="flex items-center gap-2.5 relative z-10 shrink-0">
            <Logo color="light" size="sm" showText={false} />
            <span className="font-display font-bold tracking-tight text-base text-[var(--text-primary)]">
              APRAMEYA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            <div className={`
               flex items-center p-1 rounded-full border transition-colors duration-500
               ${scrolled ? 'bg-white/[0.03] border-white/[0.06]' : 'bg-white/[0.03] border-white/[0.04] backdrop-blur-md'}
             `}>
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className="relative px-4 py-1.5 rounded-full text-[13px] font-sans font-medium cursor-pointer group transition-colors">
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
            {!user ? (
              <Link href="/login">
                <ChamferedButton variant="primary" size="sm">
                  Login
                </ChamferedButton>
              </Link>
            ) : (
              <div className="flex items-center gap-2 pl-3 border-l border-white/[0.06]">
                <Link href="/dashboard">
                  <ChamferedButton variant="secondary" size="sm" leftIcon={<LayoutDashboard size={14} />}>
                    Dashboard
                  </ChamferedButton>
                </Link>
                <button
                  onClick={() => logoutMutation.mutate()}
                  className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[var(--text-primary)] cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
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
              className="fixed top-0 right-0 z-[50] h-full w-[80%] max-w-sm bg-[var(--card-bg)] border-l border-white/[0.06] p-6 shadow-2xl md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-display font-bold text-lg text-[var(--text-primary)]">Menu</span>
                <button onClick={closeMobileMenu} className="p-2 rounded-full hover:bg-white/[0.05] transition-colors cursor-pointer">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={closeMobileMenu}>
                    <div className={`
                        flex items-center justify-between p-3.5 rounded-lg transition-colors
                        ${isActive(link.href) ? 'bg-white/[0.05] border border-white/[0.06]' : 'hover:bg-white/[0.02]'}
                      `}>
                      <span className={`font-sans font-medium text-sm ${isActive(link.href) ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                        {link.label}
                      </span>
                      {isActive(link.href) && <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-primary)]" />}
                    </div>
                  </Link>
                ))}
              </div>

              {user && (
                <div className="mt-auto pt-6 border-t border-white/[0.06] space-y-3">
                  <Link href="/dashboard" onClick={closeMobileMenu}>
                    <div className="flex items-center gap-3 p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                        <LayoutDashboard size={18} className="text-[var(--text-secondary)]" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-[var(--text-primary)]">{user.display_name || user.username}</div>
                        <div className="text-xs text-[var(--text-muted)]">Dashboard</div>
                      </div>
                      <ChevronRight size={16} className="text-[var(--text-muted)]" />
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2.5 rounded-lg bg-red-500/10 text-red-500 font-medium text-xs hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut size={14} /> Log out
                  </button>
                </div>
              )}

              {!user && (
                <div className="mt-auto">
                  <Link href="/login" onClick={closeMobileMenu}>
                    <button className="w-full py-3.5 rounded-lg bg-gradient-to-b from-[#2A723E] to-[#1C512A] border border-[#4ADE80]/30 text-white font-semibold text-sm cursor-pointer shadow-lg shadow-[#1C512A]/30">
                      Log in
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
