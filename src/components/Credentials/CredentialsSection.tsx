import React, { useState } from 'react';
import { ExternalLink, Search, CheckCircle2 } from 'lucide-react';
import { CREDENTIALS } from '../../data/portfolioData';
import { RevealOnScroll } from '../Motion/RevealOnScroll';
import { ParallaxItem } from '../Motion/ParallaxItem';

export const CredentialsSection: React.FC = () => {
  const [selectedIssuer, setSelectedIssuer] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const issuers = ['all', 'Google', 'IBM', 'Oracle University', 'Stanford University', 'Meta', 'Microsoft'];

  const filteredCredentials = CREDENTIALS.filter((cert) => {
    if (selectedIssuer !== 'all' && !cert.issuer.includes(selectedIssuer)) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      cert.title.toLowerCase().includes(query) ||
      cert.issuer.toLowerCase().includes(query) ||
      (cert.certId && cert.certId.toLowerCase().includes(query))
    );
  });

  return (
    <section id="credentials" className="apple-snap-section relative py-28 px-6 sm:px-12 lg:px-20 max-w-6xl mx-auto z-10">
      {/* Apple-style Section Header with Reveal */}
      <RevealOnScroll delay={0}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>STANDARDS &amp; ACCREDITATIONS</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              18 Verified Credentials.
            </h2>
            <p className="text-slate-400 text-base sm:text-lg font-normal max-w-xl leading-relaxed">
              Professional certifications in AI engineering, Stanford algorithms, full-stack systems, and Oracle cloud architectures.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search credentials..."
              className="w-full pl-11 pr-4 py-3 bg-white/[0.05] backdrop-blur-2xl border border-white/10 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all shadow-inner"
            />
          </div>
        </div>
      </RevealOnScroll>

      {/* Apple-style Segmented Issuer Filter Pills */}
      <RevealOnScroll delay={80}>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 scrollbar-none text-xs">
          {issuers.map((issuer) => (
            <button
              key={issuer}
              onClick={() => setSelectedIssuer(issuer)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 font-medium cursor-pointer ${
                selectedIssuer === issuer
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {issuer === 'all' ? 'All Issuers (18)' : issuer}
            </button>
          ))}
        </div>
      </RevealOnScroll>

      {/* 18 Credentials Grid with Staggered Parallax Float */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCredentials.map((cert, idx) => {
          const colSpeed = (idx % 3 === 0 ? 0.07 : idx % 3 === 1 ? -0.03 : 0.05);

          return (
            <ParallaxItem key={cert.id} speed={colSpeed}>
              <RevealOnScroll 
                staggerIndex={idx % 6} 
                staggerStep={70} 
                delay={120} 
                distance={30}
              >
                <div className="apple-glass-card rounded-3xl p-5 sm:p-6 border flex flex-col justify-between h-full transition-all hover:-translate-y-1 hover:border-amber-400/30">
                  <div className="space-y-3.5">
                    {/* Header row */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {cert.issuer}
                      </span>
                      <span className="text-[11px] text-amber-400/90 font-medium">{cert.category}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight leading-snug">
                      {cert.title}
                    </h3>

                    {/* Metadata / Cert ID if available */}
                    {cert.certId && (
                      <div className="text-[11px] font-mono text-slate-400 bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                        <div className="text-amber-300">ID: {cert.certId}</div>
                        {cert.date && <div className="text-slate-500">{cert.date}</div>}
                      </div>
                    )}
                  </div>

                  {/* Verification link */}
                  <div className="pt-4 mt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-mono">Verified Credential</span>
                    {cert.url ? (
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="apple-pill-btn inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white hover:text-black text-xs font-medium text-slate-200 transition-all cursor-pointer"
                      >
                        <span>Verify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs font-mono text-slate-500">Accredited</span>
                    )}
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
