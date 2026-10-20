import React from 'react';
import { Github, Twitter, Linkedin, Mail, MapPin, Instagram as InstagramIcon, Youtube } from 'lucide-react';
import { Link } from "wouter";

export const Footer: React.FC = () => {
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
    <footer className="w-full bg-ink border-t border-hairline pt-16 pb-28 md:pb-12 text-left selection:bg-signal-soft">
      <div className="max-w-container mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Brand & mission */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-sans font-medium text-[20px] tracking-tight text-paper">
                Aprameya
              </span>
            </div>
            <p className="text-[14px] text-text-2 leading-relaxed max-w-sm mb-6 font-sans">
              Autonomous Systems & Robotics Club at KL University. Building perception platforms, aerial telemetry, and physical testbeds.
            </p>

            {/* Social buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {socialLinks.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-[var(--r-2)] border border-hairline flex items-center justify-center text-mute hover:text-paper hover:bg-surface-2 transition-colors duration-fast"
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-3">
            <h4 className="font-sans text-[13px] text-mute font-medium mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-text-2 hover:text-paper transition-colors duration-fast font-sans"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Join */}
          <div className="lg:col-span-2">
            <h4 className="font-sans text-[13px] text-mute font-medium mb-4">
              Join
            </h4>
            <ul className="space-y-2">
              {joinLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-text-2 hover:text-paper transition-colors duration-fast font-sans"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h4 className="font-sans text-[13px] text-mute font-medium mb-4">
              Contact
            </h4>
            <div className="space-y-2 text-[14px] text-text-2 font-sans">
              <p className="text-paper">R609e Laboratory</p>
              <p className="flex items-center gap-1.5 text-mute text-[13px]">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>KL University, Vaddeswaram</span>
              </p>
              <a
                href="mailto:aprameya.techclub@kluniversity.in"
                className="text-mute hover:text-paper text-[13px] block truncate transition-colors"
              >
                aprameya.techclub@kluniversity.in
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-mute font-sans">
          <p>© 2026 Aprameya Autonomous Systems Club</p>
          <p>Built by the Aprameya web engineering team</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
