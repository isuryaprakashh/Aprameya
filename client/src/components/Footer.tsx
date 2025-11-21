import { Github, Twitter, Linkedin, Mail, MapPin } from 'lucide-react';
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="relative bg-[var(--bg-body)] border-t border-[var(--border-color)] pt-16 pb-8 font-sans overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

      {/* Background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm font-mono">A</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl tracking-tight">APRAMEYA</h3>
                <p className="text-emerald-400 text-xs font-mono">Autonomous Systems Research</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">
              Pioneering the future of autonomous systems through collaborative research,
              innovative projects, and a passionate community of developers and researchers.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@aprameya.ai"
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-emerald-500 group-hover:w-4 transition-all duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-emerald-500 group-hover:w-4 transition-all duration-300"></span>
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-emerald-500 group-hover:w-4 transition-all duration-300"></span>
                  Team
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-emerald-500 group-hover:w-4 transition-all duration-300"></span>
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-emerald-500 group-hover:w-4 transition-all duration-300"></span>
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/research"
                  className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-emerald-500 group-hover:w-4 transition-all duration-300"></span>
                  Research
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-emerald-500 group-hover:w-4 transition-all duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="/code-of-conduct"
                  className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-emerald-500 group-hover:w-4 transition-all duration-300"></span>
                  Code of Conduct
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-emerald-500 group-hover:w-4 transition-all duration-300"></span>
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="font-mono">© 2025 Aprameya all rights reserved </span>
              <span className="hidden md:block w-px h-4 bg-white/10"></span>
              <span className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                KL University, India
              </span>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 text-xs font-mono font-medium">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
