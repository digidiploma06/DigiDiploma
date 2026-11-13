import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, MessageCircle, X, ArrowUpRight } from "lucide-react";

export const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/BXyJ9ykaMnKKyHokiz2lII?mode=hqrt2";

const LINKS: { label: string; to: string; newTab?: boolean; highlight?: boolean }[] = [
  { label: "Home", to: "/" },
  { label: "Materials", to: "/materials" },
  { label: "Projects", to: "/projects" },
  { label: "VVIMP Store", to: "/vvimp-store", highlight: true },
  { label: "Internship", to: "/internship", newTab: true },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const SiteNav = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const openCommunity = () => window.open(WHATSAPP_COMMUNITY_URL, "_blank");

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="dd-nav fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6"
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 transition-all duration-500 sm:px-6 ${
          scrolled ? "dd-glass h-14 shadow-[0_10px_50px_-20px_rgba(124,92,255,0.6)]" : "h-16 border border-transparent"
        }`}
        aria-label="Main"
      >
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/icons/android-chrome-512x512.png"
            alt="DigiDiploma logo"
            className="h-9 w-9 rounded-xl object-contain"
          />
          <span className="dd-display text-xl text-white sm:text-2xl">DigiDiploma</span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) =>
            l.newTab ? (
              <a key={l.to} href={l.to} target="_blank" rel="noopener noreferrer" className="dd-navlink">
                {l.label}
              </a>
            ) : (
              <Link
                key={l.to}
                to={l.to}
                aria-current={pathname === l.to ? "page" : undefined}
                className="dd-navlink"
                style={l.highlight ? { color: "var(--dd-lime)" } : undefined}
              >
                {l.label}
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={openCommunity} className="dd-btn dd-btn-lime dd-btn-sm dd-desktop-only">
            <MessageCircle className="h-4 w-4" />
            Join Community
          </button>
          <button
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/25 p-0 text-white lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="dd-glass mx-auto mt-2 max-w-7xl rounded-3xl p-3 lg:hidden"
          >
            {LINKS.map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
              >
                {l.newTab ? (
                  <a
                    href={l.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-semibold text-white active:bg-white/10"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                    <ArrowUpRight className="h-4 w-4 text-white/40" />
                  </a>
                ) : (
                  <Link
                    to={l.to}
                    className="flex items-center justify-between rounded-2xl px-4 py-3 text-lg font-semibold active:bg-white/10"
                    style={{ color: l.highlight ? "var(--dd-lime)" : "#fff" }}
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                    <ArrowUpRight className="h-4 w-4 text-white/40" />
                  </Link>
                )}
              </motion.div>
            ))}
            <button
              onClick={() => {
                openCommunity();
                setOpen(false);
              }}
              className="dd-btn dd-btn-lime mt-2 w-full"
            >
              <MessageCircle className="h-5 w-5" />
              Join Community
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default SiteNav;
