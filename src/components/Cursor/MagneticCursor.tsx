import React, { useEffect, useRef, useState } from 'react';

interface MorphTarget {
  left: number;
  top: number;
  width: number;
  height: number;
  borderRadius: string;
  isMagnified: boolean;
}

export const MagneticCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMagnified, setIsMagnified] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const ringSize = useRef({ width: 36, height: 36 });
  const ringScale = useRef(1);
  const ringRadius = useRef('9999px');
  
  // Track currently hovered interactive target
  const activeTargetRef = useRef<MorphTarget | null>(null);

  useEffect(() => {
    // Only activate for devices with a fine pointer (mouse/trackpad)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    setIsPointerDevice(true);

    let animationFrameId: number;

    const evaluateTarget = (e: MouseEvent) => {
      const targetEl = (e.target as HTMLElement | null)?.closest(
        'button, a, [data-magnetic="true"], [data-magnify="true"], [role="button"], input, textarea, select'
      ) as HTMLElement | null;

      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(targetEl);
        const bRadius = computedStyle.borderRadius || '16px';

        // Check if this element warrants magnification (e.g., navbar items, buttons tagged with data-magnify)
        const isMagnify = Boolean(
          targetEl.hasAttribute('data-magnify') ||
          targetEl.getAttribute('data-magnify') === 'true' ||
          targetEl.closest('[data-magnify="true"], header nav, header a, header button')
        );

        // Generous padding around the clickable element
        const padX = isMagnify ? 9 : 6;
        const padY = isMagnify ? 5 : 4;

        activeTargetRef.current = {
          left: rect.left - padX,
          top: rect.top - padY,
          width: rect.width + padX * 2,
          height: rect.height + padY * 2,
          borderRadius: bRadius === '0px' ? '12px' : bRadius,
          isMagnified: isMagnify,
        };
        setIsHovered(true);
        setIsMagnified(isMagnify);
      } else {
        activeTargetRef.current = null;
        setIsHovered(false);
        setIsMagnified(false);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      setIsVisible(true);

      // Dot directly follows cursor with zero latency
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX - 3}px, ${e.clientY - 3}px, 0)`;
      }

      evaluateTarget(e);
    };

    const onMouseOver = (e: MouseEvent) => {
      evaluateTarget(e);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
      activeTargetRef.current = null;
      setIsHovered(false);
      setIsMagnified(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Fast GPU-accelerated RAF loop with spring interpolation & magnification scaling
    const animateCursor = () => {
      animationFrameId = requestAnimationFrame(animateCursor);

      const ring = ringRef.current;
      if (!ring) return;

      const activeTarget = activeTargetRef.current;

      if (activeTarget) {
        // MORPH & MAGNIFY MODE: Smoothly wrap around the clickable element
        const targetX = activeTarget.left;
        const targetY = activeTarget.top;
        const targetW = activeTarget.width;
        const targetH = activeTarget.height;
        // Subtle magnification scale when targeting dock/navbar elements
        const targetScale = activeTarget.isMagnified ? 1.08 : 1.0;

        // Snappy spring lerp towards element bounds
        ringPos.current.x += (targetX - ringPos.current.x) * 0.35;
        ringPos.current.y += (targetY - ringPos.current.y) * 0.35;
        ringSize.current.width += (targetW - ringSize.current.width) * 0.35;
        ringSize.current.height += (targetH - ringSize.current.height) * 0.35;
        ringScale.current += (targetScale - ringScale.current) * 0.3;
        ringRadius.current = activeTarget.borderRadius;

        ring.style.transform = `translate3d(${ringPos.current.x.toFixed(2)}px, ${ringPos.current.y.toFixed(2)}px, 0) scale(${ringScale.current.toFixed(4)})`;
        ring.style.width = `${ringSize.current.width.toFixed(2)}px`;
        ring.style.height = `${ringSize.current.height.toFixed(2)}px`;
        ring.style.borderRadius = ringRadius.current;
      } else {
        // FREE ROAM MODE: Small circular ring trailing the mouse pointer
        const defaultSize = 36;
        const targetX = mousePos.current.x - defaultSize / 2;
        const targetY = mousePos.current.y - defaultSize / 2;
        const targetScale = 1.0;

        ringPos.current.x += (targetX - ringPos.current.x) * 0.28;
        ringPos.current.y += (targetY - ringPos.current.y) * 0.28;
        ringSize.current.width += (defaultSize - ringSize.current.width) * 0.3;
        ringSize.current.height += (defaultSize - ringSize.current.height) * 0.3;
        ringScale.current += (targetScale - ringScale.current) * 0.3;
        ringRadius.current = '9999px';

        ring.style.transform = `translate3d(${ringPos.current.x.toFixed(2)}px, ${ringPos.current.y.toFixed(2)}px, 0) scale(${ringScale.current.toFixed(4)})`;
        ring.style.width = `${ringSize.current.width.toFixed(2)}px`;
        ring.style.height = `${ringSize.current.height.toFixed(2)}px`;
        ring.style.borderRadius = ringRadius.current;
      }
    };

    animationFrameId = requestAnimationFrame(animateCursor);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  if (!isPointerDevice) return null;

  return (
    <>
      {/* GPU-accelerated morphing ring with tactile magnification */}
      <div
        ref={ringRef}
        className={`magnetic-cursor-ring ${
          isVisible ? 'opacity-100' : 'opacity-0'
        } ${
          isHovered
            ? isMagnified
              ? 'is-hovering is-magnifying border-white/90 bg-white/[0.1] shadow-[0_8px_30px_rgba(0,0,0,0.6),inset_0_0_12px_rgba(255,255,255,0.12)] ring-1 ring-white/40'
              : 'is-hovering border-white/70 bg-white/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.5)] ring-1 ring-white/20'
            : 'border-white/30 bg-white/[0.03] shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
        }`}
        aria-hidden="true"
      />

      {/* Central zero-lag tracking dot (dissolves cleanly when covering clickable) */}
      <div
        ref={dotRef}
        className={`magnetic-cursor-dot ${
          isVisible && !isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
        aria-hidden="true"
      />
    </>
  );
};
