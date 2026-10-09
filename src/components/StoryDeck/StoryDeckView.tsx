import React, { useState, useEffect, useCallback } from 'react';
import { 
  ChevronLeft, ChevronRight, Sparkles, Terminal, Award, 
  ExternalLink, ArrowRight, CheckCircle2, Cpu, BarChart2, 
  Layers, Database, ShieldCheck, Mail, Phone, Maximize2, LayoutGrid, Eye
} from 'lucide-react';
import { PROJECTS, SKILL_CATEGORIES, CREDENTIALS, ACADEMIC_MILESTONES, CONTACT_INFO } from '../../data/portfolioData';
import { NeroAssistantViewer } from '../Work/viewers/NeroAssistantViewer';
import { SalesIntelligenceViewer } from '../Work/viewers/SalesIntelligenceViewer';
import { AlgorithmicCoreViewer } from '../Work/viewers/AlgorithmicCoreViewer';
import { sound } from '../../services/soundEffects';

interface StoryDeckViewProps {
  onSwitchToScrollView: () => void;
  onOpenDossier: () => void;
}

export const StoryDeckView: React.FC<StoryDeckViewProps> = ({
  onSwitchToScrollView,
  onOpenDossier
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 6;

  const nextSlide = useCallback(() => {
    sound.playSwoosh();
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    sound.playSwoosh();
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  }, [totalSlides]);

  const goToSlide = (idx: number) => {
    sound.playTick();
    setCurrentSlide(idx);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key >= '1' && e.key <= '6') {
        goToSlide(parseInt(e.key) - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto z-20">
      {/* Top Deck Controls Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>EXECUTIVE PRESENTATION DECK</span>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Slide {currentSlide + 1} of {totalSlides}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playTick();
              onOpenDossier();
            }}
            className="px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-200 text-xs font-medium transition-all cursor-pointer hidden md:flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Recruiter 60-Sec Brief</span>
          </button>

          <button
            onClick={() => {
              sound.playTick();
              onSwitchToScrollView();
            }}
            className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 hover:text-white text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-slate-300" />
            <span>Continuous Scroll View</span>
          </button>
        </div>
      </div>

      {/* Slide Content Stage */}
      <div className="py-6 sm:py-10 flex-1 flex items-center">
        {/* SLIDE 1: HERO & EXECUTIVE IDENTITY */}
        {currentSlide === 0 && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-apple-fade-in-up">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono">
                <span>VIT-AP University · B.Tech CSE Core (2024–2028)</span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.02]">
                Architecting <br />
                <span className="apple-headline-gradient">High-Performance Intelligence.</span>
              </h1>
              <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-xl">
                I am <strong className="text-white">Geetesh Gollapalli</strong> — an engineer building autonomous OS-level automation, generative AI speech pipelines, and high-throughput data architectures.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-2xl font-bold font-mono text-amber-400">&lt;180ms</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">Speech Latency</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-2xl font-bold font-mono text-amber-300">14.8x</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">SIMD Speedup</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="text-2xl font-bold font-mono text-emerald-400">18 Certs</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">Stanford &amp; Google</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  onClick={nextSlide}
                  className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-slate-200 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Explore Systems (Slide 2)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenDossier}
                  className="px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Recruiter Dossier
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-3xl bg-black/60 border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-white/10">
                <span>CANDIDATE TELEMETRY</span>
                <span className="text-emerald-400">STATUS: READY</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Primary Focus:</span>
                  <span className="text-white font-medium">Autonomous Systems &amp; AI</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Education:</span>
                  <span className="text-white font-medium">B.Tech CSE Core, VIT-AP</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Key Accreditations:</span>
                  <span className="text-amber-300 font-medium">Stanford, Oracle AI, Meta</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Direct Contact:</span>
                  <span className="text-white font-medium">{CONTACT_INFO.email}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-slate-300 leading-relaxed">
                Use <strong>Left / Right Arrow keys</strong> to flip through slides or click next below.
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 2: NERO OS AUTOMATION */}
        {currentSlide === 1 && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-apple-fade-in-up">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>FACET 01 · SYSTEMS &amp; OS AUTOMATION</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                Nero — AI Desktop Assistant
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                A modular Windows AI assistant with a floating transparent frosted-glass GUI. Decoupled architectural engines for contextual dialogue, intent classification, and entity extraction.
              </p>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Windows UI Automation API:</strong> Deep tree-walking element inspection across Win32 and UWP applications without hardcoded coordinates.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Hybrid Speech Engine:</strong> Ultra-low latency speech-to-text (STT) and expressive text-to-speech (TTS) under 180ms.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Decoupled Threading:</strong> Separate QThread event loops for GUI, speech capture, and intent dispatch.</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {PROJECTS[0].techStack.map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <NeroAssistantViewer />
            </div>
          </div>
        )}

        {/* SLIDE 3: SALES INTELLIGENCE & LOD */}
        {currentSlide === 2 && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-apple-fade-in-up">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>FACET 02 · ENTERPRISE DATA &amp; ANALYTICS</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                Enterprise Sales Intelligence
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Multi-dimensional visual analytics system uncovering recurring revenue trends across product segments and geographical territories with Level-of-Detail (LOD) diagnostic tracking.
              </p>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>1.2M rows/s Processing:</strong> High-throughput automated Pandas ETL and MySQL aggregations.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Level-of-Detail (LOD) Expressions:</strong> Customer lifetime value (LTV) and cohort margin diagnostics in Tableau.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Multi-Tier Choropleth Maps:</strong> Interactive linking of geographical territories to profit variance metrics.</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {PROJECTS[1].techStack.map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <SalesIntelligenceViewer />
            </div>
          </div>
        )}

        {/* SLIDE 4: ALGORITHMIC CORE & SIMD */}
        {currentSlide === 3 && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-apple-fade-in-up">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span>FACET 03 · COMPUTATIONAL ARCHITECTURE &amp; SIMD</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                Algorithmic Systems Core
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                High-performance computational pipelines and algorithmic problem-solving architecture optimized for low-latency processing and zero-copy vectorized operations.
              </p>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>14.8x Execution Speedup:</strong> Zero-copy vector calculations using NumPy and SIMD AVX2 extensions over naive loops.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>C Shared Libraries:</strong> Foreign function interface (ctypes) linking low-overhead C numerical utility routines.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Asymptotic Rigor:</strong> O(N log N) divide-and-conquer bounds with Stanford Algorithms validation.</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {PROJECTS[2].techStack.map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <AlgorithmicCoreViewer />
            </div>
          </div>
        )}

        {/* SLIDE 5: SKILLS MATRIX & DOMAINS */}
        {currentSlide === 4 && (
          <div className="w-full space-y-6 animate-apple-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                  <span>ENGINEERED CAPABILITY MATRIX</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  8 Specialized Engineering Domains
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Comprehensive mastery across low-level operating system APIs, generative AI pipelines, and enterprise data architectures.
                </p>
              </div>
              <div className="text-xs font-mono text-slate-400">
                Total Skills: <strong className="text-white">60+ Production Capabilities</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 max-h-[58vh] overflow-y-auto pr-1">
              {SKILL_CATEGORIES.map((cat) => (
                <div key={cat.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-white mb-2 flex items-center justify-between">
                      <span>{cat.title}</span>
                      <span className="text-[10px] font-mono text-slate-500">{cat.skills.length}</span>
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.slice(0, 6).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-[11px] font-mono text-slate-300">
                          {skill}
                        </span>
                      ))}
                      {cat.skills.length > 6 && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-amber-400">
                          +{cat.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SLIDE 6: CREDENTIALS & ACADEMICS */}
        {currentSlide === 5 && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-apple-fade-in-up">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>FOUNDATIONS &amp; ACCREDITATION</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Stanford, Google, Oracle &amp; VIT-AP
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Academic rigor at <strong>VIT-AP University (B.Tech CSE Core)</strong> backed by 18 verified professional credentials from premier institutions.
              </p>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
                <div className="text-white font-semibold">B.Tech in Computer Science and Engineering (Core)</div>
                <div className="text-slate-400">VIT-AP University · 2024–2028 · Amaravati, India</div>
                <p className="text-slate-400 text-[11px] leading-relaxed pt-1">
                  Focus on Systems Architecture, Algorithm Design, AI Engineering, and Enterprise Data Pipelines.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenDossier}
                  className="w-full py-3 rounded-2xl bg-white text-black font-semibold text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Open Recruiter Dossier &amp; Contact</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1">
                <span>VERIFIED PROFESSIONAL ACCREDITATIONS (18 TOTAL):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
                {CREDENTIALS.slice(0, 8).map((cred) => (
                  <a
                    key={cred.id}
                    href={cred.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-black/60 border border-white/10 hover:border-white/30 transition-all group block text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-mono mb-1">
                      <span>{cred.issuer}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-white font-medium group-hover:text-amber-300 transition-colors leading-snug">
                      {cred.title}
                    </div>
                  </a>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 font-mono text-right">
                +10 more credentials verifiable in the scroll view
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Deck Navigation Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10">
        <button
          onClick={prevSlide}
          className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        {/* Slide Indicator Dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="px-4 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
