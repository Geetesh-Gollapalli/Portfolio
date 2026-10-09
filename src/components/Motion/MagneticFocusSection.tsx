import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface MagneticFocusSectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  sectionLabel?: string;
}

/**
 * Magnetic Snapping & Content-Focus Section Container
 * 
 * Powered by Framer Motion:
 * - Subtly scales and snaps content to the center of the viewport during scroll.
 * - Dynamic focal illumination and spring physics replicate the tactile physical
 *   docking sensation seen on high-end Apple hardware product landing pages.
 */
export const MagneticFocusSection: React.FC<MagneticFocusSectionProps> = ({
  id,
  children,
  className = '',
  sectionLabel
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track progress of this section as it traverses through the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // [start of section enters bottom of viewport, end of section leaves top of viewport]
    offset: ['start end', 'end start']
  });

  // Scale: 0.945 when approaching -> 1.0 (dead center focus) -> 0.945 when scrolling past
  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0.945, 0.985, 1.0, 0.985, 0.945]
  );

  // Opacity: subtly dimmed when off-center, full brilliance at center focal lock
  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [0.82, 0.96, 1.0, 0.96, 0.82]
  );

  // Tactile magnetic Y attraction: subtle elastic pull towards viewport center
  const rawY = useTransform(
    scrollYProgress,
    [0, 0.35, 0.5, 0.65, 1],
    [22, 6, 0, -6, -22]
  );

  // Center ambient glow halo behind the section when centered
  const glowOpacity = useTransform(
    scrollYProgress,
    [0.32, 0.5, 0.68],
    [0, 0.6, 0]
  );

  // Spring physics for authentic physical mass and crisp magnetic snapping
  const scale = useSpring(rawScale, { stiffness: 260, damping: 28 });
  const opacity = useSpring(rawOpacity, { stiffness: 240, damping: 26 });
  const y = useSpring(rawY, { stiffness: 220, damping: 24 });

  return (
    <div ref={containerRef} className="relative w-full overflow-visible py-4 sm:py-6">
      {/* Ambient center focal bloom (Apple dynamic backlighting) */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 h-[75%] bg-radial from-amber-500/[0.02] via-slate-500/[0.01] to-transparent rounded-[60px] blur-3xl -z-10"
        aria-hidden="true"
      />

      {/* Main Framer Motion Snapping Container */}
      <motion.div
        id={id}
        style={{
          scale,
          opacity,
          y,
          transformOrigin: '50% 50%'
        }}
        className={`relative will-change-transform ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
};
