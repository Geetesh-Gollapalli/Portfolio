import React from 'react';
import { ChevronRight, Terminal, Sparkles, LayoutGrid, Zap } from 'lucide-react';
import { sound } from '../../services/soundEffects';

interface HeroSectionProps {
  onExploreClick?: () => void;
  onOpenDossier?: () => void;
  onOpenDeck?: () => void;
  onOpenLab?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ 
  onExploreClick,
  onOpenDossier,
  onOpenDeck,
  onOpenLab
}) => {
  const handleScrollTo = (id: string) => {
    sound.playTick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="apple-snap-section relative min-h-[92vh] flex flex-col justify-center items-start px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto pt-32 pb-20 z-10 pointer-events-none"
    >
      <div className="w-full max-w-3xl space-y-8 pointer-events-auto">
        {/* Keynote Eyebrow Badge (Stagger Step 1) */}
        <div className="animate-apple-fade-in-up animation-delay-100 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-xs font-mono tracking-wide text-slate-300">
            Systems &amp; Generative AI Engineer
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-mono text-amber-400/90">
            Core CS Architecture
          </span>
        </div>

        {/* Monolithic Headline (Stagger Step 2) */}
        <div className="animate-apple-fade-in-up animation-delay-250 space-y-3">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-white leading-[0.96] text-balance">
            Engineering <br />
            <span className="apple-headline-gradient">
              intelligence.
            </span>
          </h1>
        </div>

        {/* Subtitle with refined contrast (Stagger Step 3) */}
        <p className="animate-apple-fade-in-up animation-delay-400 text-lg sm:text-2xl text-slate-300/90 font-normal leading-relaxed max-w-2xl text-balance tracking-tight">
          Geetesh Gollapalli <span className="text-slate-600 font-light">—</span> Computer Science Engineer, AI Systems &amp; Data Architect.
        </p>

        {/* Spec Row (Stagger Step 4) */}
        <div className="animate-apple-fade-in-up animation-delay-550 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-[13px] text-slate-400 font-mono pt-1">
          <span className="text-slate-200">Autonomous Systems</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-200">Generative AI &amp; STT/TTS</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-200">Data Pipelines</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-200">Win32 UI Automation</span>
          <span className="text-slate-600">·</span>
          <span className="text-amber-300 font-medium">VIT-AP CSE Core</span>
        </div>

        {/* Interactive Actions & Recruiter Fast Tracks (Stagger Step 5) */}
        <div className="animate-apple-fade-in-up animation-delay-700 pt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              sound.playTick();
              if (onExploreClick) onExploreClick();
              else handleScrollTo('work');
            }}
            data-magnetic="true"
            className="apple-pill-btn group inline-flex items-center gap-2.5 px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wide text-black bg-white hover:bg-slate-100 rounded-full shadow-md cursor-pointer"
          >
            <span>Explore Work</span>
            <ChevronRight className="w-4 h-4 text-black transition-transform group-hover:translate-x-0.5" />
          </button>

          {onOpenDossier && (
            <button
              onClick={() => {
                sound.playTick();
                onOpenDossier();
              }}
              data-magnetic="true"
              className="apple-pill-btn inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-semibold tracking-wide text-amber-200 hover:text-white rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 backdrop-blur-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Why Hire Me (60-Sec Brief)</span>
            </button>
          )}

          {onOpenDeck && (
            <button
              onClick={() => {
                sound.playTick();
                onOpenDeck();
              }}
              data-magnetic="true"
              className="apple-pill-btn inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-medium tracking-wide text-slate-300 hover:text-white rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 backdrop-blur-xl transition-all cursor-pointer"
            >
              <LayoutGrid className="w-4 h-4 text-slate-300" />
              <span>Presentation Deck Mode</span>
            </button>
          )}

          {onOpenLab && (
            <button
              onClick={() => {
                sound.playTick();
                onOpenLab();
              }}
              data-magnetic="true"
              className="apple-pill-btn inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-medium tracking-wide text-slate-300 hover:text-white rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 backdrop-blur-xl transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Interactive Lab</span>
            </button>
          )}

          <button
            onClick={() => handleScrollTo('contact')}
            data-magnetic="true"
            className="apple-pill-btn inline-flex items-center gap-2 px-5 py-3.5 text-xs sm:text-sm font-medium tracking-wide text-slate-400 hover:text-white rounded-full bg-transparent hover:bg-white/5 border border-white/5 transition-all cursor-pointer"
          >
            <Terminal className="w-4 h-4 text-slate-400" />
            <span>Connect</span>
          </button>
        </div>
      </div>

      {/* Apple-style Scroll Down Indicator (Stagger Step 6) */}
      <div className="animate-apple-fade-in-up animation-delay-850 absolute left-1/2 -translate-x-1/2 bottom-8 hidden sm:flex flex-col items-center gap-2 text-slate-500 text-[11px] tracking-widest font-mono pointer-events-none">
        <div className="w-5 h-9 rounded-full border border-white/20 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-white/70 animate-bounce" />
        </div>
        <span>SCROLL DOWN</span>
      </div>
    </section>
  );
};
