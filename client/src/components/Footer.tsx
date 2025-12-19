import { Github, Twitter, Linkedin, Mail, MapPin, Instagram as InstagramIcon, Youtube } from 'lucide-react';
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="relative bg-[var(--bg-body)] border-t border-[var(--border-color)] pt-16 pb-8 font-sans overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent))]/50 to-transparent"></div>

      {/* Background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[hsl(var(--accent))]/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent))]/80 rounded-lg flex items-center justify-center">
                <span className="text-[var(--bg-body)] font-bold text-sm font-mono">A</span>
              </div>
              <div>
                <h3 className="text-[var(--text-primary)] font-bold text-xl tracking-tight">APRAMEYA</h3>
                <p className="text-[hsl(var(--accent))] text-xs font-mono">AI & Autonomous Club</p>
              </div>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-md mb-6">
              Pioneering the future of autonomous systems through collaborative research,
              innovative projects, and a passionate community of developers and researchers.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="https://github.com/KL-Aprameya"
                className="w-10 h-10 rounded-lg bg-[var(--text-primary)]/5 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/10 transition-all duration-300"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/aprameya_klu"
                className="w-10 h-10 rounded-lg bg-[var(--text-primary)]/5 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/10 transition-all duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/aprameyaclub/posts/?feedView=all"
                className="w-10 h-10 rounded-lg bg-[var(--text-primary)]/5 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/10 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://x.com/aprameya_klu"
                className="w-10 h-10 rounded-lg bg-[var(--text-primary)]/5 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/10 transition-all duration-300"
                aria-label="X"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@aprameya_klu"
                className="w-10 h-10 rounded-lg bg-[var(--text-primary)]/5 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/10 transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="mailto:aprameya.techclub@kluniversity.in"
                className="w-10 h-10 rounded-lg bg-[var(--text-primary)]/5 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] hover:border-[hsl(var(--accent))]/50 hover:bg-[hsl(var(--accent))]/10 transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[var(--text-primary)] font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-[hsl(var(--accent))] rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-[hsl(var(--accent))] group-hover:w-4 transition-all duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-[hsl(var(--accent))] group-hover:w-4 transition-all duration-300"></span>
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-[hsl(var(--accent))] group-hover:w-4 transition-all duration-300"></span>
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  href="/research"
                  className="text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-[hsl(var(--accent))] group-hover:w-4 transition-all duration-300"></span>
                  Research
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-[hsl(var(--accent))] group-hover:w-4 transition-all duration-300"></span>
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-[hsl(var(--accent))] group-hover:w-4 transition-all duration-300"></span>
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[var(--text-primary)] font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-[hsl(var(--accent))] rounded-full"></span>
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-[hsl(var(--accent))] group-hover:w-4 transition-all duration-300"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-[hsl(var(--accent))] group-hover:w-4 transition-all duration-300"></span>
                  Code of Conduct
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[var(--text-secondary)] hover:text-[hsl(var(--accent))] text-sm transition-colors duration-200 flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-[hsl(var(--accent))] group-hover:w-4 transition-all duration-300"></span>
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[var(--border-color)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-xs text-[var(--text-secondary)]">
              <span className="font-mono">© 2025 Aprameya all rights reserved </span>
              <span className="hidden md:block w-px h-4 bg-[var(--border-color)]"></span>
              <span className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                KL University, India
              </span>
            </div>


          </div>
        </div>
      </div>
    </footer>
  );
}
