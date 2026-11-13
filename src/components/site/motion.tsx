import type { ReactNode } from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Gentle fade-up the first time a block scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px 0px -40px 0px" }}
      transition={{ duration: 0.45, delay: Math.min(delay, 0.2), ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
