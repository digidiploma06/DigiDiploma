import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

/** On every page change, start at the top of the new page. */
const SkinController = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

/** Short fade when the top-level route changes. */
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
