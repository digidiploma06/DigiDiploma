import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { useLiteMotion } from "./motion";

/** Admin screens keep the original light theme. */
const isAdminPath = (pathname: string) => pathname.startsWith("/admin");

/**
 * Switches the dark redesign theme on for every non-admin route by toggling
 * `dd-skin` on <body> (so dialogs, menus and toasts rendered in portals match).
 */
const SkinController = () => {
  const { pathname } = useLocation();
  const lite = useLiteMotion();
  const admin = isAdminPath(pathname);

  useEffect(() => {
    document.body.classList.toggle("dd-skin", !admin);
    return () => document.body.classList.remove("dd-skin");
  }, [admin]);

  useEffect(() => {
    document.body.classList.toggle("dd-lite", lite);
  }, [lite]);

  // New page: start at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

/** Fades each page in when the top-level route changes. */
export const PageFade = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const segment = pathname.split("/")[1] || "home";
  return (
    <div key={segment} className="dd-page-enter">
      {children}
    </div>
  );
};

export default SkinController;
