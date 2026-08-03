import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Home,
  Search,
  Calendar,
  Info,
  Phone,
  FileText,
  Upload,
  Building2,
  Users,
  HelpCircle,
  BookOpen,
  Shield,
  ScrollText,
  Mail,
  ArrowUpRight,
  Linkedin,
  Twitter,
  Instagram,
} from 'lucide-react';

/* ─── Data ─────────────────────────────────────────────────────────── */
const quickLinks = [
  { label: 'Home',        to: '/',            icon: Home },
  { label: 'Jobs',        to: '/jobs',         icon: Search },
  { label: 'Internships', to: '/internships',  icon: Briefcase },
  { label: 'Events',      to: '/events',       icon: Calendar },
  { label: 'About',       to: '/about',        icon: Info },
  { label: 'Contact',     to: '/contact',      icon: Phone },
];

const studentLinks = [
  { label: 'Browse Jobs',    to: '/jobs',            icon: Search },
  { label: 'Upload Resume',  to: '/student/profile', icon: Upload },
  { label: 'Internships',    to: '/internships',     icon: FileText },
];

const recruiterLinks = [
  { label: 'Post Jobs',         to: '/company/post-job',  icon: Building2 },
  { label: 'Host Events',       to: '/events/host',       icon: Calendar },
  { label: 'Search Candidates', to: '/company/dashboard', icon: Users },
];

const supportLinks = [
  { label: 'FAQ',              to: '/faq',     icon: HelpCircle },
  { label: 'Help Center',      to: '/help',    icon: BookOpen },
  { label: 'Privacy Policy',   to: '/privacy', icon: Shield },
  { label: 'Terms of Service', to: '/terms',   icon: ScrollText },
];

const socialLinks = [
  { Icon: Linkedin,  href: 'https://linkedin.com',  label: 'LinkedIn' },
  { Icon: Twitter,   href: 'https://twitter.com',   label: 'Twitter' },
  { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
];

/* ─── Sub-components ────────────────────────────────────────────────── */
const FooterSection = ({ title, links }) => (
  <div>
    <h3 className="text-slate-900 font-semibold text-sm uppercase tracking-widest mb-5 pb-2 border-b border-slate-200">
      {title}
    </h3>
    <ul className="space-y-3">
      {links.map(({ label, to, icon: Icon }) => (
        <li key={label}>
          <Link
            to={to}
            className="group flex items-center gap-2 text-slate-600 text-sm hover:text-accentBlue transition-colors duration-200"
          >
            <Icon className="w-3.5 h-3.5 flex-shrink-0 text-slate-400 group-hover:text-accentBlue transition-colors duration-200" />
            <span className="group-hover:translate-x-0.5 transition-transform duration-200 inline-block">
              {label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

/* ─── Main Footer ───────────────────────────────────────────────────── */
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm mt-16">
      {/* Top gradient accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accentBlue/50 to-transparent" />

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

          {/* Column 1 – Brand */}
          <div className="lg:col-span-1 sm:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 group mb-4">
              <div className="p-2 rounded-lg bg-accentBlue/10 border border-accentBlue/20 group-hover:bg-accentBlue/20 transition-colors duration-300">
                <Briefcase className="w-5 h-5 text-accentBlue" />
              </div>
              <span className="text-lg font-heading font-bold text-slate-900 tracking-wide logo">
                JobYtra
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mt-3 max-w-xs">
              Connecting JobYtra students with top recruiters. Discover opportunities, launch careers, and build your future — all in one platform.
            </p>

            {/* Email badge */}
            <a
              href="mailto:placements@jobytra.edu.in"
              className="inline-flex items-center gap-2 mt-5 text-xs text-gray-600 hover:text-accentBlue transition-colors duration-200 group"
            >
              <Mail className="w-3.5 h-3.5 text-gray-500 group-hover:text-accentBlue transition-colors duration-200" />
              placements@jobytra.edu.in
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </a>
          </div>

          {/* Columns 2–5 */}
          <FooterSection title="Quick Links"  links={quickLinks} />
          <FooterSection title="Students"     links={studentLinks} />
          <FooterSection title="Recruiters"   links={recruiterLinks} />
          <FooterSection title="Support"      links={supportLinks} />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-200" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-gray-500 text-xs text-center sm:text-left">
            © {year}{' '}
            <span className="text-gray-600 font-medium">JobYtra</span>
            . All rights reserved.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group p-2 rounded-lg border border-slate-200 bg-slate-50 hover:border-accentBlue/50 hover:bg-accentBlue/10 transition-all duration-250"
              >
                <Icon className="w-4 h-4 text-gray-500 group-hover:text-accentBlue transition-colors duration-200" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
