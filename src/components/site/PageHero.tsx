import type { ReactNode } from "react";
import SiteNav from "./SiteNav";

/**
 * Shared top of a public page: the site nav plus a clean title band.
 * Pass `children` for extra controls (buttons) under the subtitle.
 */
const PageHero = ({
  eyebrow,
  title,
  accent,
  subtitle,
  children,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  /** Optional trailing words shown in the brand blue */
  accent?: string;
  subtitle?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
}) => (
  <>
    <SiteNav />
    <header className={`dd dd-soft border-b border-[var(--dd-line)] ${compact ? "py-10" : "py-14 sm:py-20"}`}>
      <div className="dd-container">
        {eyebrow ? <div className="dd-eyebrow mb-4">{eyebrow}</div> : null}
        <h1 className="dd-h2">
          {title}
          {accent ? <span className="dd-accent"> {accent}</span> : null}
        </h1>
        {subtitle ? <div className="dd-lead mt-3 max-w-2xl">{subtitle}</div> : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </header>
  </>
);

/** Nav only, for pages that keep their own hero. (The nav is sticky, so no spacer is needed.) */
export const SiteNavSpacer = () => <SiteNav />;

export default PageHero;
