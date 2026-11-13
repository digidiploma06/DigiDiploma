import type { ReactNode } from "react";
import SiteNav from "./SiteNav";
import { Reveal, SplitWords } from "./motion";

/**
 * Shared top of every public page: the site nav plus an animated title band.
 * Pass `children` for extra controls (buttons, search) under the subtitle.
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
  /** Optional trailing words rendered in the violet-to-lime gradient */
  accent?: string;
  subtitle?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
}) => (
  <>
    <SiteNav />
    <header className={`dd dd-noise relative !min-h-0 overflow-hidden ${compact ? "pb-10 pt-28" : "pb-14 pt-32 sm:pb-20 sm:pt-40"}`}>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="dd-blob dd-blob-a" />
        <div className="dd-blob dd-blob-b" />
        <div className="dd-grid-bg absolute inset-0" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        {eyebrow ? (
          <Reveal y={16}>
            <div className="dd-eyebrow mb-4">{eyebrow}</div>
          </Reveal>
        ) : null}
        <h1 className={`dd-display text-white ${compact ? "text-4xl sm:text-6xl" : "text-5xl sm:text-7xl"}`}>
          <SplitWords text={title} />
          {accent ? (
            <>
              {" "}
              <SplitWords text={accent} delay={0.15} wordClassName={() => "dd-grad-text"} />
            </>
          ) : null}
        </h1>
        {subtitle ? (
          <Reveal delay={0.15} y={20}>
            <div className="mt-5 max-w-2xl text-lg text-[var(--dd-mute)]">{subtitle}</div>
          </Reveal>
        ) : null}
        {children ? (
          <Reveal delay={0.25} y={20}>
            <div className="mt-7">{children}</div>
          </Reveal>
        ) : null}
      </div>
    </header>
  </>
);

/** Nav only, with the spacing a fixed nav needs. For pages that keep their own hero. */
export const SiteNavSpacer = () => (
  <>
    <SiteNav />
    <div className="h-20" aria-hidden />
  </>
);

export default PageHero;
