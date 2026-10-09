/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Navbar } from './components/Navigation/Navbar';
import { HeroSection } from './components/Hero/HeroSection';
import { WorkSection } from './components/Work/WorkSection';
import { SkillsSection } from './components/Skills/SkillsSection';
import { AcademicsSection } from './components/Academics/AcademicsSection';
import { CredentialsSection } from './components/Credentials/CredentialsSection';
import { ContactSection } from './components/Contact/ContactSection';
import { ProjectModal } from './components/ProjectModal/ProjectModal';
import { MagneticCursor } from './components/Cursor/MagneticCursor';
import { StoryDeckView } from './components/StoryDeck/StoryDeckView';
import { RecruiterDossierModal } from './components/RecruiterDossier/RecruiterDossierModal';
import { SectionTransitionOverlay } from './components/Motion/SectionTransitionOverlay';
import { MagneticFocusSection } from './components/Motion/MagneticFocusSection';
import { Project } from './types';
import { Sparkles, LayoutGrid, ArrowUp } from 'lucide-react';
import { sound } from './services/soundEffects';

// Memoized content sections to prevent re-rendering when scroll progress changes
const MemoizedWorkSection = React.memo(WorkSection);
const MemoizedSkillsSection = React.memo(SkillsSection);
const MemoizedAcademicsSection = React.memo(AcademicsSection);
const MemoizedCredentialsSection = React.memo(CredentialsSection);
const MemoizedContactSection = React.memo(ContactSection);

const SECTIONS = ['hero', 'work', 'skills', 'academics', 'credentials', 'contact'] as const;

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Dynamic View & Experience Modes
  const [isDeckMode, setIsDeckMode] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Smooth Cross-Fade Section Transition State
  const [isNavigating, setIsNavigating] = useState(false);
  const [targetSectionTitle, setTargetSectionTitle] = useState('');
  const navTimeoutRef = useRef<number | null>(null);

  // Store element references to avoid repetitive DOM querying during scroll
  const sectionElementsRef = useRef<Map<string, HTMLElement>>(new Map());

  // Cache section DOM elements once on mount
  useEffect(() => {
    const map = new Map<string, HTMLElement>();
    for (const sectionId of SECTIONS) {
      const el = document.getElementById(sectionId);
      if (el) map.set(sectionId, el);
    }
    sectionElementsRef.current = map;
  }, [isDeckMode]);

  // Optimized Scroll Observer
  useEffect(() => {
    if (isDeckMode) return;

    let ticking = false;
    let lastCalculatedProgress = -1;
    let lastSection = 'hero';

    const updateScrollState = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const rawProgress = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollY / scrollHeight)) : 0;

      const quantizedProgress = Math.round(rawProgress * 1000) / 1000;
      if (Math.abs(quantizedProgress - lastCalculatedProgress) > 0.001) {
        lastCalculatedProgress = quantizedProgress;
        setScrollProgress(quantizedProgress);
      }

      const vhOffset = window.innerHeight * 0.35;
      const elementMap = sectionElementsRef.current;
      
      for (const sectionId of SECTIONS) {
        const el = elementMap.get(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= vhOffset && rect.bottom >= 0) {
            if (lastSection !== sectionId) {
              lastSection = sectionId;
              setActiveSection(sectionId);
            }
            break;
          }
        }
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollState();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isDeckMode]);

  // Keyboard shortcut listener for power users and recruiters
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'd' || e.key === 'D') {
        sound.playTick();
        setIsDeckMode((prev) => !prev);
      } else if (e.key === 'b' || e.key === 'B' || e.key === 'r' || e.key === 'R') {
        sound.playTick();
        setIsDossierOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Apple-style Fluid Smooth Section Navigation with Blur & Cross-fade Overlay
  const handleNavigateSection = useCallback((sectionId: string) => {
    sound.playTick();
    if (navTimeoutRef.current) {
      window.clearTimeout(navTimeoutRef.current);
    }

    if (isDeckMode) {
      setIsDeckMode(false);
    }

    // Set destination label
    const sectionNames: Record<string, string> = {
      hero: 'Overview',
      work: 'Featured Engineering',
      skills: 'Technical Stack',
      academics: 'Academics & Rigor',
      credentials: '18 Credentials',
      contact: 'Get in Touch'
    };
    setTargetSectionTitle(sectionNames[sectionId] || sectionId);
    setIsNavigating(true);

    // Give a brief 120ms blur-in grace before smoothly scrolling
    window.setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 120);

    // Cross-fade back to crystal clarity as viewport settles
    navTimeoutRef.current = window.setTimeout(() => {
      setIsNavigating(false);
      setTargetSectionTitle('');
    }, 700);
  }, [isDeckMode]);

  const handleExploreClick = useCallback(() => {
    handleNavigateSection('work');
  }, [handleNavigateSection]);

  const handleSelectProject = useCallback((proj: Project) => {
    setSelectedProject(proj);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const handleToggleDeckMode = useCallback(() => {
    sound.playSwoosh();
    setIsDeckMode((prev) => !prev);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenDossier = useCallback(() => {
    sound.playTick();
    setIsDossierOpen(true);
  }, []);

  const ambientBackground = useMemo(
    () => <div className="fixed inset-0 apple-ambient-glow pointer-events-none z-0" aria-hidden="true" />,
    []
  );

  return (
    <div className="relative min-h-screen bg-[#0D0E12] text-slate-100 selection:bg-amber-500/20 selection:text-white overflow-x-hidden">
      {/* Apple Ambient Sheen */}
      {ambientBackground}

      {/* Low-Opacity Blur & Cross-Fade Transition Overlay for Fluid Section Navigation */}
      <SectionTransitionOverlay 
        isNavigating={isNavigating} 
        targetSectionTitle={targetSectionTitle} 
      />

      {/* Floating Navigation Bar with Reading Progress and Experience Controls */}
      <Navbar 
        activeSection={activeSection} 
        scrollProgress={scrollProgress}
        isDeckMode={isDeckMode}
        onToggleDeckMode={handleToggleDeckMode}
        onOpenDossier={handleOpenDossier}
        onNavigateSection={handleNavigateSection}
      />

      {/* VIEW MODE 1: CINEMATIC PRESENTATION DECK MODE */}
      {isDeckMode ? (
        <main className="relative z-10 pt-20">
          <StoryDeckView
            onSwitchToScrollView={handleToggleDeckMode}
            onOpenDossier={handleOpenDossier}
          />
        </main>
      ) : (
        /* VIEW MODE 2: CONTINUOUS SCROLL VIEW (ENRICHED WITH PARALLAX & TACTILE MAGNETIC SNAPPING) */
        <main className="relative z-10">
          <HeroSection 
            onExploreClick={handleExploreClick}
            onOpenDossier={handleOpenDossier}
            onOpenDeck={handleToggleDeckMode}
          />

          {/* Magnetic Content-Focus Container: Work Section */}
          <MagneticFocusSection sectionLabel="Work Facets">
            <MemoizedWorkSection 
              onSelectProject={handleSelectProject}
            />
          </MagneticFocusSection>

          {/* Magnetic Content-Focus Container: Skills Section */}
          <MagneticFocusSection sectionLabel="Skills Architecture">
            <MemoizedSkillsSection />
          </MagneticFocusSection>

          {/* Magnetic Content-Focus Container: Academics Section */}
          <MagneticFocusSection sectionLabel="Academic Milestones">
            <MemoizedAcademicsSection />
          </MagneticFocusSection>

          <MemoizedCredentialsSection />
          <MemoizedContactSection />
        </main>
      )}

      {/* Floating Bottom Quick-Action Dock */}
      <aside aria-label="Quick Experience Bar" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 p-1.5 rounded-full bg-[#141620]/90 backdrop-blur-2xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.85)] animate-apple-fade-in-up">
        <button
          onClick={handleOpenDossier}
          className="px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 hover:text-white border border-amber-500/25 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          title="Open Recruiter 60-Second Brief [Press R]"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Why Hire Me (60s)</span>
        </button>

        <button
          onClick={handleToggleDeckMode}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            isDeckMode
              ? 'bg-white/20 text-white border border-white/30 shadow-sm font-semibold'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
          }`}
          title="Toggle Presentation Deck Mode [Press D]"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-slate-300" />
          <span>{isDeckMode ? 'Deck Active' : 'Deck Mode'}</span>
        </button>

        {!isDeckMode && (
          <button
            onClick={() => handleNavigateSection('hero')}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        )}
      </aside>

      {/* Recruiter 60-Second Dossier Modal */}
      <RecruiterDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />

      {/* Apple Magnetic Cursor with Interactive Morphing */}
      <MagneticCursor />

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={handleCloseModal}
      />
    </div>
  );
}
