import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Logo from './icons/Logo';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, User } from 'lucide-react';
import { ThemeCustomizer } from './ThemeCustomizer';
import { useTheme } from '@/components/theme-provider';


const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const { user, logoutMutation } = useAuth();



  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide navbar on dashboard routes - AFTER all hooks
  if (location.startsWith('/dashboard')) {
    return null;
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const getInitials = (username: string) => {
    return username?.substring(0, 2).toUpperCase() || 'A';
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    closeMobileMenu();
  };

  return (
    <motion.nav
      className={`fixed z-50 transition-all duration-300 left-0 right-0 mx-auto w-[95%] md:w-full top-2 md:top-0 rounded-2xl md:rounded-none ${scrolled
        ? 'glass-panel py-2'
        : 'glass-panel py-4'
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-8">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center min-w-[200px]"
          >
            <Logo
              color={isDark ? "light" : "dark"}
              size={scrolled ? "sm" : "md"}
              showText={true}
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isActive('/') ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
              Home
            </Link>
            <Link href="/projects" className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isActive('/projects') ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
              Projects
            </Link>
            <Link href="/blogs" className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isActive('/blogs') ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
              Blogs
            </Link>
            <Link href="/events" className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isActive('/events') ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
              Events
            </Link>
            <Link href="/research" className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isActive('/research') ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
              Research
            </Link>
            <Link href="/about" className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isActive('/about') ? 'bg-[#E8F5E9] text-[#2E7D32]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}>
              About
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4 min-w-[200px] justify-end">
            <ThemeCustomizer />
            {!user ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/login" className="px-6 py-2 text-sm bg-[hsl(var(--accent))] hover:opacity-90 text-[var(--bg-body)] rounded-full font-medium transition-colors shadow-lg shadow-[hsl(var(--accent))]/20">
                  Login
                </Link>
              </motion.div>
            ) : (
              <div className="flex items-center gap-4">


                <Link href="/profile">
                  <Avatar className="h-10 w-10 cursor-pointer border-2 border-[hsl(var(--accent))]/20 hover:border-[hsl(var(--accent))] transition-colors">
                    <AvatarFallback className="bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] font-bold">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeCustomizer />
            <motion.button
              onClick={toggleMobileMenu}
              className="text-[var(--text-primary)] focus:outline-none p-2 rounded-full hover:bg-[var(--text-primary)]/5 transition-colors"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <motion.div
          className={`md:hidden pt-4 pb-2 ${mobileMenuOpen ? 'block' : 'hidden'}`}
          initial={false}
          animate={mobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-3">
            <Link href="/"
              className={`py-2 font-medium text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] transition-colors ${isActive('/') ? 'text-[hsl(var(--accent))]' : ''}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link href="/projects"
              className={`py-2 font-medium text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] transition-colors ${isActive('/projects') ? 'text-[hsl(var(--accent))]' : ''}`}
              onClick={closeMobileMenu}
            >
              Projects
            </Link>
            <Link href="/blogs"
              className={`py-2 font-medium text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] transition-colors ${isActive('/blogs') ? 'text-[hsl(var(--accent))]' : ''}`}
              onClick={closeMobileMenu}
            >
              Blogs
            </Link>
            <Link href="/events"
              className={`py-2 font-medium text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] transition-colors ${isActive('/events') ? 'text-[hsl(var(--accent))]' : ''}`}
              onClick={closeMobileMenu}
            >
              Events
            </Link>
            <Link href="/research"
              className={`py-2 font-medium text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] transition-colors ${isActive('/research') ? 'text-[hsl(var(--accent))]' : ''}`}
              onClick={closeMobileMenu}
            >
              Research
            </Link>
            <Link href="/about"
              className={`py-2 font-medium text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] transition-colors ${isActive('/about') ? 'text-[hsl(var(--accent))]' : ''}`}
              onClick={closeMobileMenu}
            >
              About
            </Link>

            {!user ? (
              <Link href="/login"
                className="py-2.5 px-4 mt-2 rounded-full bg-[hsl(var(--accent))] text-[var(--bg-body)] hover:opacity-90 transition-all w-full text-center shadow-sm"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            ) : (
              <>
                <hr className="border-t border-[var(--border-color)] my-2" />
                <div className="py-2 px-3 bg-[var(--text-primary)]/5 rounded-lg mb-2 flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback className="bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))]">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-bold text-[hsl(var(--accent))]">{user.username}</span>
                  </div>
                </div>

                <Link href="/profile"
                  className={`py-2 font-medium text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] transition-colors flex items-center ${isActive('/profile') ? 'text-[hsl(var(--accent))]' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>



                <button
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  className="py-2 font-medium text-red-500 hover:text-red-700 transition-colors text-left flex items-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav >
  );
};

export default Navbar;
