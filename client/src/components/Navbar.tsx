import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Logo from './icons/Logo';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from '@/components/theme-provider';

interface UserData {
  id: number;
  username: string;
  email: string;
  role: string;
}

const Navbar = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // Fetch current user
  const { data: user, isLoading } = useQuery<UserData>({
    queryKey: ['/api/users/me'],
    staleTime: 5000,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const handleLogout = async () => {
    try {
      await apiRequest('/api/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled
        ? 'glass-panel py-2'
        : 'glass-panel py-3'
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex items-center mr-4"
          >
            <Logo
              color={isDark ? "light" : "dark"}
              size={scrolled ? "sm" : "md"}
              showText={true}
            />
          </Link>

          <div className="hidden md:flex space-x-7 items-center">
            <Link href="/" className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${isActive('/') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}>
              Home
            </Link>
            <Link href="/projects" className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${isActive('/projects') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}>
              Projects
            </Link>
            <Link href="/blogs" className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${isActive('/blogs') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}>
              Blogs
            </Link>
            <Link href="/research" className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${isActive('/research') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}>
              Research
            </Link>
            <Link href="/events" className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${isActive('/events') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}>
              Events
            </Link>
            <Link href="/about" className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${isActive('/about') ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'}`}>
              About
            </Link>

            <div className="mr-2">
              <ThemeToggle />
            </div>

            {!user ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/login" className="ml-2 px-5 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
                  Login
                </Link>
              </motion.div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-9 w-9 cursor-pointer border-2 border-emerald-500/20 hover:border-emerald-500 transition-colors">
                    <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl">
                  <div className="p-3 font-medium text-sm bg-white/5 rounded-lg mb-2">
                    Signed in as <span className="font-bold text-emerald-400">{user.username}</span>
                  </div>
                  <DropdownMenuItem asChild className="py-2 px-3 rounded-lg">
                    <Link href="/profile" className="cursor-pointer flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                      <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="py-2 px-3 rounded-lg">
                    <Link href="/dashboard" className="cursor-pointer flex items-center">
                      <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      <span>Dashboard</span>
                      <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 focus:text-red-500 py-2 px-3 rounded-lg"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <motion.button
              onClick={toggleMobileMenu}
              className="text-foreground focus:outline-none p-2 rounded-full hover:bg-muted transition-colors"
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
              className={`py-2 font-medium text-muted-foreground hover:text-primary transition-colors ${isActive('/') ? 'text-primary' : ''}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link href="/projects"
              className={`py-2 font-medium text-muted-foreground hover:text-primary transition-colors ${isActive('/projects') ? 'text-primary' : ''}`}
              onClick={closeMobileMenu}
            >
              Projects
            </Link>
            <Link href="/blogs"
              className={`py-2 font-medium text-muted-foreground hover:text-primary transition-colors ${isActive('/blogs') ? 'text-primary' : ''}`}
              onClick={closeMobileMenu}
            >
              Blogs
            </Link>
            <Link href="/research"
              className={`py-2 font-medium text-muted-foreground hover:text-primary transition-colors ${isActive('/research') ? 'text-primary' : ''}`}
              onClick={closeMobileMenu}
            >
              Research
            </Link>
            <Link href="/events"
              className={`py-2 font-medium text-muted-foreground hover:text-primary transition-colors ${isActive('/events') ? 'text-primary' : ''}`}
              onClick={closeMobileMenu}
            >
              Events
            </Link>
            <Link href="/about"
              className={`py-2 font-medium text-muted-foreground hover:text-primary transition-colors ${isActive('/about') ? 'text-primary' : ''}`}
              onClick={closeMobileMenu}
            >
              About
            </Link>

            {!user ? (
              <Link href="/login"
                className="py-2.5 px-4 mt-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-all w-full text-center shadow-sm"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            ) : (
              <>
                <hr className="border-t border-border my-2" />
                <div className="py-2 px-3 bg-muted/50 rounded-lg mb-2 flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-bold text-emerald-400">{user.username}</span>
                  </div>
                </div>

                <Link href="/profile"
                  className={`py-2 font-medium text-muted-foreground hover:text-primary transition-colors flex items-center ${isActive('/profile') ? 'text-primary' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>

                <Link href="/dashboard"
                  className={`py-2 font-medium text-muted-foreground hover:text-primary transition-colors flex items-center ${isActive('/dashboard') ? 'text-primary' : ''}`}
                  onClick={closeMobileMenu}
                >
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Dashboard
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
    </motion.nav>
  );
};

export default Navbar;
