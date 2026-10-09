import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ParallaxItemProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Speed factor relative to scroll:
   *  - Positive (e.g. 0.05 to 0.15): moves upwards faster (foreground card, feels floating closer)
   *  - Negative (e.g. -0.03 to -0.08): drifts downwards slightly (background layer, adds rich depth)
   *  - 0: standard scroll
   */
  speed?: number;
  /**
   * Explicit custom pixel translation if desired (e.g., -60 to 60)
   */
  floatDistance?: number;
  /**
   * Smooth scrubbing damping in seconds (default: 0.8 for buttery Apple-grade momentum)
   */
  scrub?: number | boolean;
  /**
   * Additional subtle 3D spatial perspective tilt as user scrolls past
   */
  tilt?: boolean;
}

/**
 * GSAP-Based Scroll-Driven Parallax Floating Card
 * 
 * Uses GSAP ScrollTrigger with smooth scrub momentum to decouple content cards
 * from the viewport background, creating tactile multi-plane floating depth.
 */
export const ParallaxItem: React.FC<ParallaxItemProps> = ({
  children,
  className = '',
  speed = 0.08,
  floatDistance,
  scrub = 0.8,
  tilt = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect user's reduced motion preferences
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    // Calculate vertical parallax distance
    // Foreground cards (speed > 0) move upward (-y) as user scrolls down,
    // creating the floating foreground sensation.
    const movementY = floatDistance !== undefined ? floatDistance : Math.round(-180 * speed);

    const ctx = gsap.context(() => {
      // Primary scroll-driven vertical float with momentum scrub
      gsap.fromTo(
        el,
        {
          y: -movementY * 0.5,
          force3D: true,
        },
        {
          y: movementY * 0.5,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: scrub,
            invalidateOnRefresh: true,
          },
        }
      );

      // Optional subtle 3D spatial tilt
      if (tilt) {
        gsap.fromTo(
          el,
          {
            rotateX: 3,
            transformPerspective: 1000,
          },
          {
            rotateX: -3,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [speed, floatDistance, scrub, tilt]);

  return (
    <div
      ref={containerRef}
      className={`will-change-transform ${className}`}
    >
      {children}
    </div>
  );
};
