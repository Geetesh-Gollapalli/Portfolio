import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check, Code2, ArrowUpRight } from 'lucide-react';
import { Project } from '../../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!project || typeof document === 'undefined') return null;

  const handleCopy = () => {
    if (project.codeSnippet) {
      navigator.clipboard.writeText(project.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#121218]/90 backdrop-blur-3xl border border-white/15 rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col font-sans ring-1 ring-white/10">
        {/* macOS Style Header Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            {/* macOS traffic light controls */}
            <div className="flex items-center gap-1.5 mr-2">
              <button
                onClick={onClose}
                className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] border border-[#e0443e]/50 cursor-pointer hover:opacity-80 transition-opacity"
                title="Close"
              />
              <span className="w-3.5 h-3.5 rounded-full bg-[#febc2e] border border-[#d89e24]/50" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#28c840] border border-[#1aab29]/50" />
            </div>

            <div>
              <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
                Facet 0{project.facetIndex} · {project.category}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {project.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Tagline */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            {project.tagline}
          </p>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {project.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] flex flex-col justify-center"
              >
                <div className="text-xs font-mono text-slate-400">{metric.label}</div>
                <div className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>

          {/* Description & Architecture Highlights */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Architectural Specifications
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {project.description}
            </p>
            <ul className="space-y-2.5 pt-2">
              {project.architectureHighlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <span className="text-amber-400 mt-1 font-mono">▸</span>
                  <span className="leading-relaxed">{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Badges */}
          <div className="space-y-2 pt-1">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Technology Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs font-mono text-slate-200 bg-white/[0.05] border border-white/10 rounded-xl"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Code Excerpt */}
          {project.codeSnippet && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[#8B5CF6]" />
                  Implementation Excerpt
                </span>
                <button
                  onClick={handleCopy}
                  className="apple-pill-btn flex items-center gap-1.5 px-3 py-1 text-xs font-mono text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 rounded-full transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#08080c] rounded-2xl p-4 sm:p-5 border border-white/10 font-mono text-xs overflow-x-auto text-slate-300 leading-relaxed shadow-inner">
                <pre>{project.codeSnippet}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 border-t border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
          <div className="text-xs font-mono text-slate-500">
            Invariant: Verified &amp; Tested
          </div>
          <button
            onClick={onClose}
            className="apple-pill-btn px-6 py-2 text-xs font-semibold text-black bg-white hover:bg-slate-100 rounded-full transition-all cursor-pointer shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
