import React, { useEffect, useRef, useState } from 'react';

interface RevealOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  threshold?: number;
  distance?: number; // px to slide up, default 32
  duration?: number; // ms, default 800
  staggerIndex?: number;
  staggerStep?: number;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  delay = 0,
  className = '',
  threshold = 0.1,
  distance = 32,
  duration = 800,
  staggerIndex,
  staggerStep = 75
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Compute total delay if stagger index is provided
  const computedDelay = staggerIndex !== undefined 
    ? Math.max(0, delay + staggerIndex * staggerStep) 
    : delay;

  useEffect(() => {
    // Immediate reveal if user prefers reduced motion
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px' // Slightly anticipatory trigger for fluid Apple-style entrance
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      className={`apple-reveal ${isRevealed ? 'is-revealed' : ''} ${className}`}
      style={{
        transitionDelay: `${computedDelay}ms`,
        transitionDuration: `${duration}ms`,
        transform: isRevealed ? 'translate3d(0, 0, 0)' : `translate3d(0, ${distance}px, 0)`
      }}
    >
      {children}
    </div>
  );
};

