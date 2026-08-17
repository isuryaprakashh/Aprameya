import { Github, Twitter, Linkedin, Mail, MapPin, Instagram as InstagramIcon, Youtube } from 'lucide-react';
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="relative bg-[var(--bg-body)] border-t border-white/[0.04] pt-16 pb-12 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand section */}
          <div className="md:col-span-6 lg:col-span-5">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="font-display font-bold text-xl text-[var(--text-primary)] tracking-tight">APRAMEYA</span>
              <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-[var(--text-muted)] bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.06]">
                R&D Lab
              </span>
            </div>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm mb-6">
              Undergraduate robotics research and autonomous systems engineering at KL University. Building hardware prototypes and ROS 2 pipelines.
            </p>

            {/* Social links */}
            <div className="flex gap-2.5">
              {[
                { href: "https://github.com/KL-Aprameya", icon: <Github className="w-4 h-4" />, label: "GitHub" },
                { href: "https://instagram.com/aprameya_klu", icon: <InstagramIcon className="w-4 h-4" />, label: "Instagram" },
                { href: "https://www.linkedin.com/company/aprameyaclub/posts/?feedView=all", icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn" },
                { href: "https://x.com/aprameya_klu", icon: <Twitter className="w-4 h-4" />, label: "X" },
                { href: "https://www.youtube.com/@aprameya_klu", icon: <Youtube className="w-4 h-4" />, label: "YouTube" },
                { href: "mailto:aprameya.techclub@kluniversity.in", icon: <Mail className="w-4 h-4" />, label: "Email" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-white/[0.15] hover:bg-white/[0.04] transition-colors"
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 lg:col-span-3 lg:col-start-7">
            <h4 className="text-[var(--text-primary)] font-semibold mb-4 text-xs font-sans uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/projects", label: "Projects" },
                { href: "/events", label: "Events & Workshops" },
                { href: "/recruitment", label: "Recruitment" },
                { href: "/blogs", label: "Technical Blogs" },
                { href: "/about", label: "About Innovation Lab" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-sm transition-colors block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional / Contact */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="text-[var(--text-primary)] font-semibold mb-4 text-xs font-sans uppercase tracking-wider">
              Affiliation
            </h4>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
              Department of Computer Science & Engineering<br />
              K L Deemed to be University
            </p>
            <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              Vaddeswaram, Andhra Pradesh, India
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[var(--text-muted)]">
          <div>
            © {new Date().getFullYear()} Aprameya Innovation Lab. All rights reserved.
          </div>
          <div>
            Built by Aprameya Dev Team
          </div>
        </div>
      </div>
    </footer>
  );
}
