import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Sparkles, LayoutGrid, Volume2, VolumeX, Terminal } from 'lucide-react';
import { sound } from '../../services/soundEffects';

interface NavbarProps {
  activeSection: string;
  scrollProgress: number;
  isDeckMode?: boolean;
  onToggleDeckMode?: () => void;
  onOpenDossier?: () => void;
  onNavigateSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeSection, 
  scrollProgress,
  isDeckMode = false,
  onToggleDeckMode,
  onOpenDossier,
  onNavigateSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [audioActive, setAudioActive] = useState(sound.enabled);
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);

  const getNavMagnificationClass = (idx: number) => {
    if (hoveredNavIndex === null) return 'scale-100 translate-y-0';
    if (hoveredNavIndex === idx) return 'scale-[1.18] -translate-y-0.5 text-white shadow-sm z-10';
    if (Math.abs(hoveredNavIndex - idx) === 1) return 'scale-[1.08] -translate-y-0.25 text-slate-200';
    return 'scale-95 text-slate-400 opacity-80';
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'work', label: 'Work' },
    { id: 'skills', label: 'Skills' },
    { id: 'academics', label: 'Academics' },
    { id: 'credentials', label: 'Credentials' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleScrollTo = (id: string) => {
    sound.playTick();
    setMobileMenuOpen(false);
    if (onNavigateSection) {
      onNavigateSection(id);
      return;
    }
    if (isDeckMode && onToggleDeckMode) {
      onToggleDeckMode();
    }
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleToggleSound = () => {
    const newState = sound.toggle();
    setAudioActive(newState);
  };

  const progressPercent = Math.min(100, Math.max(0, scrollProgress * 100));

  return (
    <>
      {/* Top Viewport Reading Progress Bar */}
      {!isDeckMode && (
        <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/[0.03] z-[60] pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200 transition-all duration-100 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-3 sm:px-4 pt-3 sm:pt-5 pb-2 pointer-events-none">
        <div
          className={`relative pointer-events-auto w-full max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
            scrolled || isDeckMode
              ? 'apple-glass shadow-[0_20px_50px_rgba(0,0,0,0.85)]'
              : 'bg-[#13151D]/85 backdrop-blur-xl border border-white/[0.08]'
          }`}
        >
          {/* Integrated Thin Reading Progress Bar at the Top Rim of Navbar */}
          {!isDeckMode && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/[0.05] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200 transition-all duration-150 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}

          {/* Brand Wordmark */}
          <a
            href="#hero"
            data-magnetic="true"
            data-magnify="true"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo('hero');
            }}
            className="group flex items-center gap-2 text-xs sm:text-[13px] tracking-tight font-medium text-white/90 hover:text-white transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 transition-transform group-hover:scale-125" />
            <span className="font-semibold tracking-wide text-white">GEETESH GOLLAPALLI</span>
          </a>

          {/* Segmented Nav Pill Links with macOS Dock-style Magnification */}
          {!isDeckMode && (
            <nav 
              onMouseLeave={() => setHoveredNavIndex(null)}
              className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-full border border-white/[0.06]"
            >
              {navLinks.map((link, idx) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    data-magnetic="true"
                    data-magnify="true"
                    onMouseEnter={() => setHoveredNavIndex(idx)}
                    onClick={() => handleScrollTo(link.id)}
                    className={`px-3 py-1 rounded-full text-xs transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer whitespace-nowrap transform will-change-transform ${getNavMagnificationClass(idx)} ${
                      isActive
                        ? 'bg-white/15 text-white font-medium shadow-sm border border-white/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Quick Controls & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* View Mode Toggle Button */}
            {onToggleDeckMode && (
              <button
                data-magnetic="true"
                data-magnify="true"
                onClick={() => {
                  sound.playTick();
                  onToggleDeckMode();
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap ${
                  isDeckMode
                    ? 'bg-white/20 text-white border border-white/30 shadow-sm font-semibold'
                    : 'bg-white/5 text-slate-300 hover:text-white border border-white/10 hover:bg-white/10'
                }`}
                title={isDeckMode ? 'Switch to Continuous Scroll View' : 'Switch to Presentation Deck Mode'}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{isDeckMode ? 'Deck Mode Active' : 'Deck Mode'}</span>
              </button>
            )}

            {/* Recruiter 60-Sec Brief Button */}
            {onOpenDossier && (
              <button
                data-magnetic="true"
                data-magnify="true"
                onClick={() => {
                  sound.playTick();
                  onOpenDossier();
                }}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 hover:text-white border border-amber-500/25 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Why Hire Me</span>
              </button>
            )}

            {/* Audio Toggle */}
            <button
              data-magnetic="true"
              data-magnify="true"
              onClick={handleToggleSound}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-115 active:scale-90 cursor-pointer"
              title={audioActive ? 'Mute micro-audio cues' : 'Enable tactile audio cues'}
              aria-label="Toggle haptic audio cues"
            >
              {audioActive ? <Volume2 className="w-3.5 h-3.5 text-slate-300" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Connect Button */}
            <button
              onClick={() => handleScrollTo('contact')}
              data-magnetic="true"
              data-magnify="true"
              className="apple-pill-btn hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-medium text-black bg-white hover:bg-slate-100 rounded-full shadow-sm transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-108 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>Connect</span>
              <ArrowUpRight className="w-3 h-3 text-black" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden pointer-events-auto absolute top-16 left-4 right-4 apple-glass rounded-3xl p-5 shadow-2xl flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <span className="text-white font-medium">Navigation</span>
              {onOpenDossier && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDossier();
                  }}
                  className="text-amber-300 font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Why Hire Me</span>
                </button>
              )}
            </div>
            <div className="flex flex-col gap-1 text-sm font-medium">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleScrollTo(link.id)}
                  className="text-left py-2 px-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
