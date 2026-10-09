import React, { useState } from 'react';
import { ArrowUpRight, ChevronRight, ChevronLeft, Layers, Code, Sparkles, Terminal, Activity, Eye, LayoutGrid } from 'lucide-react';
import { Project } from '../../types';
import { PROJECTS } from '../../data/portfolioData';
import { NeroAssistantViewer } from './viewers/NeroAssistantViewer';
import { SalesIntelligenceViewer } from './viewers/SalesIntelligenceViewer';
import { AlgorithmicCoreViewer } from './viewers/AlgorithmicCoreViewer';
import { RevealOnScroll } from '../Motion/RevealOnScroll';
import { ParallaxItem } from '../Motion/ParallaxItem';
import { sound } from '../../services/soundEffects';

interface WorkSectionProps {
  onSelectProject: (project: Project) => void;
  onOpenLab?: () => void;
}

export const WorkSection: React.FC<WorkSectionProps> = ({ onSelectProject }) => {
  const [activeFacet, setActiveFacet] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState<'sandbox' | 'architecture' | 'code'>('sandbox');
  const [viewMode, setViewMode] = useState<'stage' | 'all'>('all');

  const currentProject = PROJECTS[activeFacet];

  const renderViewer = (index: number) => {
    switch (index) {
      case 0:
        return <NeroAssistantViewer />;
      case 1:
        return <SalesIntelligenceViewer />;
      case 2:
        return <AlgorithmicCoreViewer />;
      default:
        return null;
    }
  };

  const handleNextFacet = () => {
    sound.playTick();
    setActiveFacet((prev) => (prev < PROJECTS.length - 1 ? prev + 1 : 0));
  };

  const handlePrevFacet = () => {
    sound.playTick();
    setActiveFacet((prev) => (prev > 0 ? prev - 1 : PROJECTS.length - 1));
  };

  return (
    <section id="work" className="apple-snap-section relative py-28 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto z-10">
      {/* Apple-style Section Header with Reveal */}
      <RevealOnScroll delay={0}>
        <div className="space-y-4 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>FACET ARCHITECTURE</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Featured Engineering.
              </h2>
            </div>

            {/* View Mode Switcher (Interactive Stage vs All Cards) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center p-1 bg-white/[0.04] rounded-2xl border border-white/10 text-xs">
                <button
                  onClick={() => {
                    sound.playTick();
                    setViewMode('stage');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                    viewMode === 'stage'
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Interactive Stage
                </button>
                <button
                  onClick={() => {
                    sound.playTick();
                    setViewMode('all');
                  }}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                    viewMode === 'all'
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Facets
                </button>
              </div>
            </div>
          </div>

          <p className="text-slate-400 max-w-2xl text-base sm:text-lg font-normal leading-relaxed">
            Multi-tier systems ranging from Win32 automation and generative voice pipelines to enterprise SQL dashboards and SIMD computational kernels.
          </p>

          {/* Facet Selector Pills for Fast Recruiter Inspection */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
            <div className="flex flex-wrap items-center gap-2">
              {PROJECTS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    sound.playTick();
                    setActiveFacet(idx);
                    if (viewMode !== 'stage') setViewMode('stage');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                    activeFacet === idx && viewMode === 'stage'
                      ? 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-[1.02]'
                      : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-70">0{p.facetIndex}</span>
                  <span>{p.title.split('—')[0].trim()}</span>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: idx === 0 ? '#F59E0B' : idx === 1 ? '#D97706' : '#10B981' }} />
                </button>
              ))}
            </div>

            {viewMode === 'stage' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevFacet}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Previous Facet"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-slate-400 px-1">
                  0{activeFacet + 1} / 0{PROJECTS.length}
                </span>
                <button
                  onClick={handleNextFacet}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Next Facet"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </RevealOnScroll>

      {/* STAGE VIEW MODE (DYNAMIC & ENGAGING WITH PARALLAX DEPTH) */}
      {viewMode === 'stage' && (
        <ParallaxItem speed={0.06} className="relative">
          <div className="apple-glass-card rounded-[2.5rem] p-6 sm:p-10 border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/10 transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Specs (Parallax foreground, moves faster) */}
              <ParallaxItem speed={0.1} className="lg:col-span-6 space-y-6">
                {/* Category Pill Tag */}
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="text-amber-400 font-semibold">FACET 0{currentProject.facetIndex}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-300">{currentProject.category}</span>
                </div>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-snug">
                  {currentProject.title}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed">
                  {currentProject.description}
                </p>

                {/* Tech stack badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {currentProject.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 bg-white/[0.05] border border-white/[0.08]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Key Metrics row */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {currentProject.metrics.map((metric, mIdx) => (
                    <div key={mIdx} className="p-3.5 rounded-2xl bg-black/50 border border-white/[0.08]">
                      <div className="text-[11px] font-mono text-slate-400">{metric.label}</div>
                      <div className="text-sm sm:text-base font-semibold text-white mt-1 tabular-nums font-mono">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sub-Tabs: Sandbox vs Architecture vs Code */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playTick();
                      setActiveSubTab('sandbox');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeSubTab === 'sandbox'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Live Sandbox</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playTick();
                      setActiveSubTab('architecture');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeSubTab === 'architecture'
                        ? 'bg-amber-500/15 text-amber-200 border border-amber-500/30'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Architecture</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playTick();
                      setActiveSubTab('code');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeSubTab === 'code'
                        ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>Code Snippet</span>
                  </button>

                  <button
                    onClick={() => onSelectProject(currentProject)}
                    className="apple-pill-btn ml-auto inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-white/10 hover:bg-white hover:text-black rounded-full border border-white/15 transition-all cursor-pointer"
                  >
                    <span>Full Modal</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </ParallaxItem>

              {/* Right Column: Dynamic Stage Content (Parallax imagery/interactive canvas, slightly lags for depth) */}
              <ParallaxItem speed={-0.04} className="lg:col-span-6 flex flex-col justify-center">
                <div className="relative">
                  {activeSubTab === 'sandbox' && (
                    <div className="relative animate-apple-fade-in-up">
                      {renderViewer(activeFacet)}
                    </div>
                  )}

                  {activeSubTab === 'architecture' && (
                    <div className="relative p-6 rounded-3xl bg-[#14161F] border border-white/10 space-y-3.5 text-xs animate-apple-fade-in-up">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="font-mono text-amber-400 text-[11px]">SYSTEM DESIGN HIGHLIGHTS</span>
                        <span className="text-slate-500 font-mono">Facet 0{activeFacet + 1}</span>
                      </div>
                      <div className="space-y-2.5">
                        {currentProject.architectureHighlights.map((hl, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-slate-300 leading-relaxed">
                            <span className="text-amber-400 font-mono mt-0.5">•</span>
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeSubTab === 'code' && (
                    <div className="relative p-5 rounded-3xl bg-[#0F1117] border border-white/10 font-mono text-xs overflow-x-auto animate-apple-fade-in-up shadow-xl">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-slate-400 text-[11px]">
                        <span>Source: core_engine</span>
                        <span className="text-amber-400">Clean Architecture</span>
                      </div>
                      <pre className="text-slate-200 text-[11px] leading-relaxed overflow-x-auto max-h-72">
                        <code>{currentProject.codeSnippet}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </ParallaxItem>
            </div>
          </div>
        </ParallaxItem>
      )}

      {/* ALL FACETS VIEW MODE WITH MULTI-LAYER PARALLAX DEPTH */}
      {viewMode === 'all' && (
        <div className="space-y-14">
          {PROJECTS.map((project, idx) => (
            <ParallaxItem key={project.id} speed={0.05 * (idx % 2 === 0 ? 1 : 0.8)}>
              <div
                className="apple-glass-card rounded-[2rem] p-6 sm:p-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  <ParallaxItem speed={0.09} className="lg:col-span-6 space-y-6">
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      <span className="text-amber-400 font-semibold">FACET 0{project.facetIndex}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-300">{project.category}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-snug">
                      {project.title}
                    </h3>

                    <p className="text-slate-300 text-sm sm:text-base font-normal leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 bg-white/[0.05] border border-white/[0.08]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2">
                      {project.metrics.map((metric, mIdx) => (
                        <div key={mIdx} className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06]">
                          <div className="text-[11px] font-mono text-slate-400">{metric.label}</div>
                          <div className="text-sm sm:text-base font-semibold text-white mt-1 tabular-nums font-mono">
                            {metric.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => onSelectProject(project)}
                        className="apple-pill-btn group inline-flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-medium tracking-wide text-white bg-white/10 hover:bg-white hover:text-black rounded-full border border-white/15 transition-all duration-300 cursor-pointer shadow-lg"
                      >
                        <span>{project.actionLabel}</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>
                    </div>
                  </ParallaxItem>

                  <ParallaxItem speed={-0.03} className="lg:col-span-6 flex flex-col justify-center">
                    <div className="relative">
                      <div className="relative">
                        {renderViewer(idx)}
                      </div>
                    </div>
                  </ParallaxItem>
                </div>
              </div>
            </ParallaxItem>
          ))}
        </div>
      )}
    </section>
  );
};
