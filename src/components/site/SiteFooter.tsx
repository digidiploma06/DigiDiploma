import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, MapPin, MessageCircle, Youtube } from "lucide-react";
import { WHATSAPP_COMMUNITY_URL } from "./SiteNav";

const TelegramIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/digi_diploma.in?igsh=eHM5MjZteHVmbjlv", icon: <Instagram className="h-5 w-5" /> },
  { label: "WhatsApp", href: WHATSAPP_COMMUNITY_URL, icon: <MessageCircle className="h-5 w-5" /> },
  { label: "Telegram", href: "https://t.me/digidiploma", icon: <TelegramIcon /> },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/chaitanya-zagade-766051294?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    icon: <Linkedin className="h-5 w-5" />,
  },
  { label: "YouTube", href: "https://www.youtube.com/@DigiDiploma", icon: <Youtube className="h-5 w-5" /> },
];

const COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Internship", to: "/internship" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Study Materials", to: "/materials" },
      { label: "VVIMP Store", to: "/vvimp-store" },
      { label: "Exam Timetable", to: "/exam-timetable" },
      { label: "Free Projects", to: "/projects" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help & Contact", to: "/contact" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Cookie Policy", to: "/cookies" },
    ],
  },
];

const SiteFooter = () => (
  <footer className="dd-footer">
    <div className="dd-container py-14 sm:py-16">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5">
            <img src="/icons/android-chrome-512x512.png" alt="" className="h-10 w-10 rounded-lg object-contain" />
            <span className="text-2xl font-extrabold text-white" style={{ fontFamily: '"Schibsted Grotesk", sans-serif' }}>
              DigiDiploma<span style={{ color: "#60a5fa" }}>.</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm leading-relaxed">
            Empowering diploma students with comprehensive study materials, project management, and interactive
            learning resources.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <Link to="/contact">Contact our team</Link>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Pune, Maharashtra, India
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="dd-footer-title">{col.title}</div>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-7 md:flex-row">
        <div className="text-center text-sm md:text-left">
          <p>&copy; {new Date().getFullYear()} DigiDiploma. All rights reserved.</p>
          <p className="mt-1 text-xs text-slate-500">
            Designed and Developed by{" "}
            <a href="https://github.com/Onkar3333/" target="_blank" rel="noopener noreferrer">
              Onkar Bansode
            </a>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-2 text-sm">Follow us</span>
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={s.label}
              aria-label={s.label}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-[var(--dd-blue)]"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
