import React from 'react';
import { MapPin } from 'lucide-react';
import { ACADEMIC_MILESTONES } from '../../data/portfolioData';
import { RevealOnScroll } from '../Motion/RevealOnScroll';
import { ParallaxItem } from '../Motion/ParallaxItem';

export const AcademicsSection: React.FC = () => {
  return (
    <section id="academics" className="apple-snap-section relative py-28 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto z-10">
      {/* Apple-style Section Header with Reveal */}
      <RevealOnScroll delay={0}>
        <div className="space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>ACADEMIC FOUNDATION</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Education &amp; Rigor.
          </h2>
          <p className="text-slate-400 max-w-2xl text-base sm:text-lg font-normal leading-relaxed">
            Rigorous training across computer science foundations, competitive mathematics, and systems design.
          </p>
        </div>
      </RevealOnScroll>

      {/* Apple-style Vertical Timeline with Parallax Milestone Cards */}
      <div className="relative border-l border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
        {ACADEMIC_MILESTONES.map((milestone, idx) => {
          // Subtle differential parallax speeds between timeline cards
          const parallaxSpeed = idx % 2 === 0 ? 0.07 : 0.04;

          return (
            <ParallaxItem key={idx} speed={parallaxSpeed}>
              <RevealOnScroll 
                staggerIndex={idx} 
                staggerStep={110} 
                delay={100} 
                distance={36}
              >
                <div className="relative group">
                  {/* Timeline node */}
                  <div className="absolute -left-[31px] sm:-left-[47px] top-2 w-4 h-4 rounded-full bg-black border-2 border-white/60 flex items-center justify-center transition-all duration-300 group-hover:border-amber-400 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                    <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:scale-125 transition-transform" />
                  </div>

                  {/* Glass Milestone Card */}
                  <div className="apple-glass-card rounded-3xl p-6 sm:p-8 border space-y-4 transition-all duration-300 hover:border-amber-400/30">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono text-white bg-white/10 border border-white/10 px-3 py-1 rounded-full font-medium">
                          {milestone.year}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {milestone.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{milestone.location}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        {milestone.degree}
                      </h3>
                      <div className="text-sm sm:text-base font-medium text-amber-400 mt-1">
                        {milestone.institution}
                      </div>
                      {milestone.specialization && (
                        <div className="text-xs text-slate-400 mt-1 font-mono">
                          Specialization: {milestone.specialization}
                        </div>
                      )}
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2 pt-2">
                      {milestone.highlights.map((highlight, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                          <span className="text-amber-400/80 mt-1 text-xs">▸</span>
                          <span className="font-light leading-relaxed">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </ParallaxItem>
          );
        })}
      </div>
    </section>
  );
};
