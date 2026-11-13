import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, Users, X } from "lucide-react";
import { ALL_BRANCHES } from "@/constants/branches";

export const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/BXyJ9ykaMnKKyHokiz2lII?mode=hqrt2";

const RESOURCES = [
  { label: "All Study Materials", to: "/materials" },
  { label: "VVIMP Store", to: "/vvimp-store" },
  { label: "Exam Timetable", to: "/exam-timetable" },
  { label: "Free Projects", to: "/projects" },
];

const LINKS = [
  { label: "VVIMP Store", to: "/vvimp-store" },
  { label: "Projects", to: "/projects" },
  { label: "Internship", to: "/internship" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const branchUrl = (branch: string) => `/materials?branch=${encodeURIComponent(branch)}`;

const SiteNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { pathname, search } = useLocation();

  // Close menus on navigation
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname, search]);

  // Close the Material dropdown on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const openCommunity = () => window.open(WHATSAPP_COMMUNITY_URL, "_blank");

  return (
    <header className="dd-nav">
      <nav className="dd-container flex h-[72px] items-center justify-between gap-6" aria-label="Main">
        <Link to="/" className="flex flex-shrink-0 items-center gap-2.5">
          <img src="/icons/android-chrome-512x512.png" alt="" className="h-9 w-9 rounded-lg object-contain" />
          <span className="dd-display text-[1.45rem] font-extrabold leading-none">
            DigiDiploma<span className="dd-accent">.</span>
          </span>
        </Link>

        <div className="dd-desktop-only flex items-center gap-7">
          <div
            className="relative"
            ref={menuRef}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              type="button"
              className="dd-navlink p-0"
              aria-expanded={menuOpen}
              aria-haspopup="true"
              onClick={() => setMenuOpen((v) => !v)}
            >
              Material
              <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`} />
            </button>
            {menuOpen && (
              <div className="absolute left-1/2 top-full h-3 w-full -translate-x-1/2" aria-hidden />
            )}
            {menuOpen && (
              <div className="dd-menu grid grid-cols-5 gap-4">
                <div className="col-span-3">
                  <div className="dd-menu-title">Diploma branches</div>
                  <div className="grid grid-cols-1">
                    {ALL_BRANCHES.map((b) => (
                      <Link key={b} to={branchUrl(b)} className="dd-menu-item">
                        {b}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="col-span-2 border-l border-[var(--dd-line)] pl-4">
                  <div className="dd-menu-title">Resources</div>
                  {RESOURCES.map((r) => (
                    <Link key={r.to} to={r.to} className="dd-menu-item">
                      {r.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} aria-current={pathname === l.to ? "page" : undefined} className="dd-navlink">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={openCommunity} className="dd-btn dd-btn-outline-blue dd-btn-sm dd-desktop-only">
            <Users className="h-4 w-4" />
            Join Community
          </button>
          <button
            type="button"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--dd-line)] p-0 text-[var(--dd-ink)] lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-[var(--dd-line)] bg-white lg:hidden">
          <div className="dd-container py-4">
            <div className="dd-menu-title">Material</div>
            {RESOURCES.map((r) => (
              <Link key={r.to} to={r.to} className="dd-menu-item text-base">
                {r.label}
              </Link>
            ))}
            <details className="mt-1">
              <summary className="dd-menu-item cursor-pointer list-none text-base">
                <span className="inline-flex items-center gap-1">
                  Browse by branch <ChevronDown className="h-4 w-4" />
                </span>
              </summary>
              <div className="pl-3">
                {ALL_BRANCHES.map((b) => (
                  <Link key={b} to={branchUrl(b)} className="dd-menu-item">
                    {b}
                  </Link>
                ))}
              </div>
            </details>
            <div className="my-3 border-t border-[var(--dd-line)]" />
            {LINKS.filter((l) => l.to !== "/vvimp-store" && l.to !== "/projects").map((l) => (
              <Link key={l.to} to={l.to} className="dd-menu-item text-base">
                {l.label}
              </Link>
            ))}
            <button type="button" onClick={openCommunity} className="dd-btn dd-btn-blue mt-4 w-full">
              <Users className="h-5 w-5" />
              Join Community
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteNav;
