'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

// Static map of motion components. These MUST live outside the render function:
// calling motion(tag) during render creates a brand-new component type on every
// render, which makes React unmount/remount the subtree — replaying the reveal
// animation on every state change (the FAQ/tabs "flicker").
const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  header: motion.header,
  footer: motion.footer,
  article: motion.article,
} as const;

type RevealTag = keyof typeof MOTION_TAGS;

type RevealProps = {
  children: ReactNode;
  as?: RevealTag;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
  delay?: number;
};

/**
 * Scroll-reveal wrapper: fades + slides in (opacity 0→1, translateY 28px→0)
 * once when it enters the viewport. Mirrors the prototype's IntersectionObserver
 * (threshold 0.12). Respects prefers-reduced-motion.
 */
export default function Reveal({
  children,
  as = 'div',
  className,
  id,
  style,
  delay = 0,
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = MOTION_TAGS[as];

  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} id={id} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      id={id}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}
