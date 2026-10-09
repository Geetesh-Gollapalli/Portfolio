import React from 'react';

interface TransitionOverlayProps {
  isNavigating: boolean;
  targetSectionTitle?: string;
}

/**
 * Apple-style fluid section transition overlay.
 * Uses a low-opacity blur and cross-fade to eliminate harsh jump cuts between sections
 * and deliver a continuous, high-end "single-experience" feel.
 */
export const SectionTransitionOverlay: React.FC<TransitionOverlayProps> = ({
  isNavigating,
  targetSectionTitle
}) => {
  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[80] pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isNavigating
          ? 'opacity-100 backdrop-blur-md bg-black/35'
          : 'opacity-0 backdrop-blur-0 bg-transparent'
      }`}
    >
      {/* Subtle photonic transition flare */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b from-amber-500/[0.02] via-transparent to-slate-500/[0.02] transition-opacity duration-300 ${
          isNavigating ? 'opacity-100' : 'opacity-0'
        }`} 
      />

      {/* Ephemeral target destination indicator */}
      {targetSectionTitle && (
        <div 
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/75 border border-white/20 text-[11px] font-mono tracking-widest text-amber-300 uppercase transition-all duration-300 ${
            isNavigating ? 'opacity-90 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'
          }`}
        >
          Navigating to {targetSectionTitle}
        </div>
      )}
    </div>
  );
};
