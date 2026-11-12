import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  animate,
} from "framer-motion";
import Lenis from "lenis";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * True on low-end phones or when the user asked for reduced motion.
 * Heavy effects (tilt, magnetic, smooth scroll, cursor glow) switch off.
 */
export function useLiteMotion(): boolean {
  const reduced = useReducedMotion();
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
    const fewCores = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setLite(lowMemory || (fewCores && coarse));
  }, []);

  return Boolean(reduced) || lite;
}

/** True when the device has a real mouse (hover effects make sense). */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);
  return fine;
}

/** Smooth wheel scrolling on desktop. Does nothing on touch or in lite mode. */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [enabled]);
}

/** Fade + slide in when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 36,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px 0px -60px 0px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Headline that rises in word by word. */
export function SplitWords({
  text,
  className,
  delay = 0,
  wordClassName,
}: {
  text: string;
  className?: string;
  delay?: number;
  wordClassName?: (word: string, index: number) => string | undefined;
}) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className={`inline-block ${wordClassName?.(word, i) ?? ""}`}
            initial={{ y: "110%", rotate: 6 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: delay + i * 0.07, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** 3D tilt card with a cursor-following spotlight. Plain card on touch / lite. */
export function Tilt({
  children,
  className = "",
  max = 9,
  disabled = false,
  onClick,
  role,
  tabIndex,
  onKeyDown,
  style,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  disabled?: boolean;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 180, damping: 18 });
  const ry = useSpring(0, { stiffness: 180, damping: 18 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    if (disabled) return;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`dd-card ${className}`}
      style={{ ...style, rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      onKeyDown={onKeyDown}
    >
      {children}
    </motion.div>
  );
}

/** Wrapper that pulls its child toward the cursor. */
export function Magnetic({
  children,
  strength = 0.35,
  disabled = false,
  className,
}: {
  children: ReactNode;
  strength?: number;
  disabled?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 16 });
  const y = useSpring(0, { stiffness: 220, damping: 16 });

  if (disabled) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-block" }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Number that counts up when it scrolls into view. */
export function Counter({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

/** Endless horizontal ticker. */
export function Marquee({
  children,
  speed = 32,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const style = { "--dd-marquee-speed": `${speed}s` } as CSSProperties;
  return (
    <div className={`dd-marquee ${className}`} style={style}>
      <div className="dd-marquee-track">{children}</div>
      <div className="dd-marquee-track" aria-hidden>
        {children}
      </div>
    </div>
  );
}

/** Soft glow that follows the mouse across the page (desktop only). */
export function CursorGlow({ enabled }: { enabled: boolean }) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 90, damping: 20 });
  const sy = useSpring(y, { stiffness: 90, damping: 20 });

  useEffect(() => {
    if (!enabled) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 200);
      y.set(e.clientY - 200);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[400px] w-[400px] rounded-full"
      style={{
        x: sx,
        y: sy,
        background: "radial-gradient(circle, rgba(124,92,255,0.16) 0%, transparent 65%)",
      }}
    />
  );
}

/** Mouse-driven parallax values for hero layers. Returns x/y transforms per depth. */
export function useMouseParallax(enabled: boolean) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (!enabled) return;
    const move = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [enabled, mx, my]);

  return { sx, sy };
}

export { motion, useTransform, EASE };
