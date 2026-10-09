import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle2, Sparkles, Terminal, Cpu, ArrowRight, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { sound } from '../../services/soundEffects';

export interface SkillProofData {
  skill: string;
  category: string;
  role: string;
  project: string;
  proof: string;
  metric: string;
  codeSnippet?: string;
  highlights: string[];
}

interface SkillProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  proof: SkillProofData | null;
  onOpenLab?: () => void;
  relatedSkills?: string[];
  onSelectSkill?: (skillName: string) => void;
}

export const SkillProofModal: React.FC<SkillProofModalProps> = ({
  isOpen,
  onClose,
  proof,
  onOpenLab,
  relatedSkills = [],
  onSelectSkill,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        sound.playTick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !proof || typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fade-in"
      onClick={() => {
        sound.playTick();
        onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#09090f] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.98),0_0_45px_rgba(0,240,255,0.25)] text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Badge & Close Button */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[#F59E0B] text-xs font-mono font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VERIFIED SKILL PROOF</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">{proof.category}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>{proof.skill}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Engineering Domain: <span className="text-[#F59E0B] font-medium">{proof.role}</span>
            </p>
          </div>

          <button
            onClick={() => {
              sound.playTick();
              onClose();
            }}
            data-magnetic="true"
            data-magnify="true"
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-all cursor-pointer border border-white/10"
            title="Close [Esc]"
            aria-label="Close proof inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-6 space-y-6">
          {/* Project & Verified Metric Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8 p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Primary Production Project</span>
              </div>
              <div className="text-base sm:text-lg font-semibold text-white tracking-tight">
                {proof.project}
              </div>
            </div>

            <div className="sm:col-span-4 p-4 rounded-2xl bg-amber-950/20 border border-[#F59E0B]/30 text-center flex flex-col justify-center">
              <div className="text-base sm:text-lg font-bold font-mono text-[#F59E0B]">
                {proof.metric}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">
                Verified Invariant
              </div>
            </div>
          </div>

          {/* Implementation & Proof Narrative */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Implementation Narrative & Architecture</span>
            </h4>
            <div className="p-4 rounded-2xl bg-black/50 border border-white/[0.08] text-sm text-slate-200 leading-relaxed font-sans">
              {proof.proof}
            </div>
          </div>

          {/* Architecture Highlights */}
          {proof.highlights && proof.highlights.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Key Engineering Highlights:
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {proof.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Invariant Snippet if available */}
          {proof.codeSnippet && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Production Code Pattern</span>
                </span>
                <span className="text-[11px] text-slate-500">Zero-Mock Invariant</span>
              </div>
              <pre className="p-4 rounded-2xl bg-black/80 border border-white/10 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed shadow-inner">
                <code>{proof.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Related Skills in this Domain */}
          {relatedSkills.length > 1 && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Explore More Skills in {proof.category}:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {relatedSkills.map((sk) => (
                  <button
                    key={sk}
                    onClick={() => {
                      sound.playTick();
                      if (onSelectSkill) onSelectSkill(sk);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      sk === proof.skill
                        ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40 font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                    }`}
                  >
                    {sk}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Candidate Skill Authenticated</span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenLab && (
              <button
                onClick={() => {
                  sound.playTick();
                  onClose();
                  onOpenLab();
                }}
                className="apple-pill-btn px-4 py-2 rounded-full bg-[#F59E0B]/15 hover:bg-[#F59E0B]/25 text-[#F59E0B] border border-[#F59E0B]/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Test in Systems Lab</span>
              </button>
            )}

            <button
              onClick={() => {
                sound.playTick();
                onClose();
              }}
              className="apple-pill-btn px-5 py-2 rounded-full bg-white hover:bg-slate-100 text-black text-xs font-semibold cursor-pointer shadow-md transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
