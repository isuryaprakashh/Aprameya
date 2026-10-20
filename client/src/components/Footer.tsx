import { Github, Twitter, Linkedin, Mail, MapPin, Instagram as InstagramIcon, Youtube } from 'lucide-react';
import { Link } from "wouter";

export default function Footer() {
  const exploreLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/events", label: "Events" },
    { href: "/team", label: "Team" },
    { href: "/recruitment", label: "Recruitment" },
    { href: "/blogs", label: "Blogs" },
    { href: "/about", label: "About" },
  ];

  const joinLinks = [
    { href: "/recruitment", label: "Apply for recruitment" },
    { href: "/events", label: "Attend events & workshops" },
    { href: "/about#contact", label: "Contact coordinators" },
  ];

  const socialLinks = [
    { href: "https://github.com/KL-Aprameya", icon: <Github className="w-4 h-4" />, label: "GitHub" },
    { href: "https://instagram.com/aprameya_klu", icon: <InstagramIcon className="w-4 h-4" />, label: "Instagram" },
    { href: "https://www.linkedin.com/company/aprameyaclub/posts/?feedView=all", icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn" },
    { href: "https://x.com/aprameya_klu", icon: <Twitter className="w-4 h-4" />, label: "X" },
    { href: "https://www.youtube.com/@aprameya_klu", icon: <Youtube className="w-4 h-4" />, label: "YouTube" },
    { href: "mailto:aprameya.techclub@kluniversity.in", icon: <Mail className="w-4 h-4" />, label: "Email" },
  ];

  return (
    <footer className="w-full bg-bg border-t border-border pt-16 pb-8 font-body">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        {/* 4 columns desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Col 1: Brand + one-line mission + social icon buttons */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display font-medium text-lg tracking-tight text-text">
                Aprameya
              </span>
            </div>
            <p className="text-sm text-text-2 leading-relaxed max-w-sm mb-6">
              Autonomous Systems & Robotics Club of KL University. Engineering physical self-driving platforms and intelligent systems.
            </p>

            {/* Social ghost icon buttons (36px) */}
            <div className="flex items-center gap-2">
              {socialLinks.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-md border border-border flex items-center justify-center text-text-2 hover:text-text hover:bg-surface-2 hover:border-border-strong transition-colors duration-fast"
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Explore (the 7 pages) */}
          <div className="lg:col-span-3">
            <h4 className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 font-medium mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-2 hover:text-text transition-colors duration-fast"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Join */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 font-medium mb-4">
              Join
            </h4>
            <ul className="space-y-2">
              {joinLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-2 hover:text-text transition-colors duration-fast"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs uppercase tracking-[0.06em] text-text-3 font-medium mb-4">
              Contact
            </h4>
            <div className="space-y-2 text-sm text-text-2">
              <a
                href="mailto:aprameya.techclub@kluniversity.in"
                className="hover:text-text transition-colors break-words block"
              >
                aprameya.techclub@kluniversity.in
              </a>
              <p className="flex items-start gap-1.5 pt-2 text-xs text-text-3 font-mono">
                <MapPin className="w-3.5 h-3.5 text-text-3 shrink-0 mt-0.5" />
                <span>KL University, Vijayawada, AP</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row: copyright left, Built by Aprameya right in label token */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-mono text-xs text-text-3">
            © {new Date().getFullYear()} Aprameya. All rights reserved.
          </p>
          <p className="font-mono text-xs text-text-3 uppercase tracking-[0.06em]">
            Built by Aprameya
          </p>
        </div>
      </div>
    </footer>
  );
}
