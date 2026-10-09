import React, { useState } from 'react';
import { Search, Terminal, Cpu, BarChart2, Database, Layers, TrendingUp, Globe, ShieldCheck, Sparkles } from 'lucide-react';
import { SKILL_CATEGORIES } from '../../data/portfolioData';
import { SkillCategory } from '../../types';
import { RevealOnScroll } from '../Motion/RevealOnScroll';
import { ParallaxItem } from '../Motion/ParallaxItem';
import { sound } from '../../services/soundEffects';

const ROLE_LENSES = [
  { id: 'all', label: 'All Domains' },
  { id: 'ai-os', label: 'Autonomous AI & OS Systems', categories: ['ai-systems', 'desktop-os', 'languages'] },
  { id: 'data-bi', label: 'Enterprise Data & BI', categories: ['data-analytics', 'bi-visualization', 'cloud-devops'] },
  { id: 'core-cs', label: 'Systems & Algorithms', categories: ['algorithms-math', 'languages', 'security'] }
];

export const SkillsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleLens, setSelectedRoleLens] = useState('all');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5 text-amber-400" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-slate-300" />;
      case 'Database': return <Database className="w-5 h-5 text-emerald-400" />;
      case 'BarChart2': return <BarChart2 className="w-5 h-5 text-amber-300" />;
      case 'Layers': return <Layers className="w-5 h-5 text-rose-300" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-sky-400" />;
      case 'Globe': return <Globe className="w-5 h-5 text-slate-300" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-300" />;
      default: return <Cpu className="w-5 h-5 text-white" />;
    }
  };

  const filteredCategories = SKILL_CATEGORIES.filter((category) => {
    if (selectedRoleLens !== 'all') {
      const activeLens = ROLE_LENSES.find((l) => l.id === selectedRoleLens);
      if (activeLens && activeLens.categories && !activeLens.categories.includes(category.id)) {
        return false;
      }
    }

    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const titleMatch = category.title.toLowerCase().includes(query);
    const skillsMatch = category.skills.some((skill) =>
      skill.toLowerCase().includes(query)
    );
    return titleMatch || skillsMatch;
  });

  return (
    <section id="skills" className="apple-snap-section relative py-28 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto z-10">
      {/* Section Header */}
      <RevealOnScroll delay={0}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>TECHNICAL CAPABILITIES</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Engineered Stack.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg font-normal max-w-xl leading-relaxed">
              Specialized engineering domains across generative AI, autonomous Windows OS automation, distributed analytics, and core algorithmic architecture.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills (e.g. PyQt6, STT, C)..."
              className="w-full pl-11 pr-4 py-3 bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all shadow-inner"
            />
          </div>
        </div>
      </RevealOnScroll>

      {/* Recruiter Role Lens Selector */}
      <ParallaxItem speed={0.03}>
        <RevealOnScroll delay={60}>
          <div className="mb-8 p-2 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 pt-1 pb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Recruiter Role Lens (Instant Stack Filter):</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {ROLE_LENSES.map((lens) => (
                <button
                  key={lens.id}
                  onClick={() => {
                    sound.playTick();
                    setSelectedRoleLens(lens.id);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    selectedRoleLens === lens.id
                      ? 'bg-white text-black font-semibold shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {lens.label}
                </button>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </ParallaxItem>

      {/* Bento Grid of Pods with Staggered Parallax Float */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredCategories.map((category, idx) => {
          const colSpeed = (idx % 2 === 0 ? 0.08 : 0.04) * (idx % 4 === 1 ? -0.5 : 1);

          return (
            <ParallaxItem key={category.id} speed={colSpeed}>
              <RevealOnScroll 
                staggerIndex={idx} 
                staggerStep={65} 
                delay={120} 
                distance={30}
              >
                <div className="apple-glass-card rounded-3xl p-5 sm:p-6 border flex flex-col justify-between h-full transition-all duration-300 hover:border-amber-400/30 hover:shadow-[0_15px_35px_rgba(0,0,0,0.7)]">
                  <div className="space-y-4">
                    {/* Category Header */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-xl">
                          {getCategoryIcon(category.icon)}
                        </div>
                        <h3 className="text-xs sm:text-[13px] font-semibold text-white tracking-tight">
                          {category.title}
                        </h3>
                      </div>
                    </div>

                    {/* Skills Tags inside Pod */}
                    <div className="flex flex-wrap gap-1.5">
                      {category.skills.map((skill) => {
                        const isHighlighted =
                          searchQuery.trim() !== '' &&
                          skill.toLowerCase().includes(searchQuery.toLowerCase());

                        return (
                          <span
                            key={skill}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all duration-200 flex items-center ${
                              isHighlighted
                                ? 'bg-white text-black font-bold shadow-sm'
                                : 'bg-white/[0.05] text-slate-200 border border-white/10 hover:border-amber-400/30 hover:bg-white/[0.08]'
                            }`}
                          >
                            <span>{skill}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clean Category Footer */}
                  <div className="pt-3.5 mt-4 text-[11px] font-mono text-slate-500 flex justify-between items-center border-t border-white/[0.06]">
                    <span>{category.skills.length} core technologies</span>
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
