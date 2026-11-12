import { Link } from "react-router-dom";
import { Instagram, Linkedin, MessageCircle, Youtube, ArrowUpRight } from "lucide-react";
import { ALL_BRANCHES } from "@/constants/branches";
import { Marquee } from "./motion";
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

const EXPLORE = [
  { label: "Home", to: "/" },
  { label: "Materials", to: "/materials" },
  { label: "Projects", to: "/projects" },
  { label: "VVIMP Store", to: "/vvimp-store" },
  { label: "Exam Timetable", to: "/exam-timetable" },
  { label: "Internship", to: "/internship" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const SiteFooter = () => (
  <footer className="relative border-t border-white/10 bg-[#07070d]">
    <Marquee speed={40} className="border-b border-white/10 py-6">
      {["Notes", "VVIMP", "Model Answers", "Projects", "MSBTE K-Scheme", "Question Banks", "Microprojects"].map((w) => (
        <span key={w} className="dd-display flex items-center gap-12 text-5xl text-white/[0.07] sm:text-7xl">
          {w}
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: "var(--dd-lime)", opacity: 0.6 }} />
        </span>
      ))}
    </Marquee>

    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="mb-5 flex items-center gap-3">
            <img src="/icons/android-chrome-512x512.png" alt="DigiDiploma logo" className="h-12 w-12 rounded-2xl object-contain" />
            <div>
              <div className="dd-display text-3xl text-white">DigiDiploma</div>
              <div className="dd-eyebrow mt-1">Revolutionizing Digital Education</div>
            </div>
          </div>
          <p className="max-w-md leading-relaxed text-[var(--dd-mute)]">
            Empowering diploma students with comprehensive study materials, project management, and interactive
            learning resources.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-300 hover:-translate-y-1 hover:border-[var(--dd-lime)] hover:bg-[var(--dd-lime)] hover:text-[var(--dd-ink)]"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="dd-eyebrow mb-5">Explore</h4>
          <ul className="space-y-3">
            {EXPLORE.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="group inline-flex items-center gap-1 text-[var(--dd-mute)] transition-colors hover:text-white"
                >
                  {l.label}
                  <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="dd-eyebrow mb-5">Branches</h4>
          <ul className="space-y-3">
            {ALL_BRANCHES.map((branch) => (
              <li key={branch}>
                <Link
                  to={`/materials?branch=${encodeURIComponent(branch)}`}
                  className="text-[var(--dd-mute)] transition-colors hover:text-white"
                >
                  {branch}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-sm text-[var(--dd-mute)]">&copy; {new Date().getFullYear()} DigiDiploma. All rights reserved.</p>
          <p className="mt-1 text-xs text-white/40">
            Designed and Developed by{" "}
            <a
              href="https://github.com/Onkar3333/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[var(--dd-violet-2)] hover:underline"
            >
              Onkar Bansode
            </a>
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link to="/privacy" className="text-[var(--dd-mute)] hover:text-white">Privacy Policy</Link>
          <Link to="/terms" className="text-[var(--dd-mute)] hover:text-white">Terms of Service</Link>
          <Link to="/cookies" className="text-[var(--dd-mute)] hover:text-white">Cookie Policy</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
