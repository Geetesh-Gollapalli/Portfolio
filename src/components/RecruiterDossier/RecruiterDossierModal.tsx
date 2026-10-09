import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, Award, Terminal, Briefcase, Mail, Phone, ExternalLink, Copy, Check, Sparkles, Download, ArrowRight } from 'lucide-react';
import { CONTACT_INFO, CREDENTIALS, PROJECTS } from '../../data/portfolioData';
import { sound } from '../../services/soundEffects';

interface RecruiterDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLab?: () => void;
}

export const RecruiterDossierModal: React.FC<RecruiterDossierModalProps> = ({
  isOpen,
  onClose,
  onOpenLab
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleCopyEmail = () => {
    sound.playTick();
    navigator.clipboard.writeText(CONTACT_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPhone = () => {
    sound.playTick();
    navigator.clipboard.writeText(CONTACT_INFO.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a10] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title & Close */}
        <div className="flex items-start justify-between pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-mono font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>RECRUITER 60-SECOND BRIEF</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Why Geetesh Gollapalli?
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Candidate Dossier for Computer Science, AI Systems, and High-Performance Engineering roles.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playTick();
              onClose();
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Pillars of Competence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/30 transition-colors">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1.5">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>1. Autonomous OS &amp; AI Automation</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Engineered <strong>Nero</strong> with Windows UI Automation API for dynamic tree inspection, decoupled threading, and speech pipeline with sub-180ms latency.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/30 transition-colors">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1.5">
              <Award className="w-4 h-4 text-amber-300" />
              <span>2. 18 Verified Top-Tier Credentials</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Stanford University Algorithms Specialization, Google AI &amp; Advanced Data Analytics, Oracle Cloud AI Associate, and IBM Generative AI.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/30 transition-colors">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1.5">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>3. Enterprise Analytics &amp; High-Throughput SQL</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built dynamic multidimensional sales intelligence systems processing 1.2M rows/s with Level-of-Detail (LOD) margin diagnostics.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-400/30 transition-colors">
            <div className="flex items-center gap-2 text-white font-semibold text-sm mb-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>4. Low-Latency Algorithmic Foundation</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              B.Tech in CSE Core at VIT-AP University. Vectorized matrix kernels in NumPy and C delivering 14.8x speedups with asymptotic O(N log N) bounds.
            </p>
          </div>
        </div>

        {/* Quantifiable Highlights Bar */}
        <div className="p-4 rounded-2xl bg-[#141620] border border-white/10 flex flex-wrap items-center justify-around gap-4 text-center">
          <div>
            <div className="text-2xl font-bold font-mono text-amber-400">&lt;180ms</div>
            <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">Speech Pipeline Latency</div>
          </div>
          <div className="h-8 w-px bg-white/10 hidden sm:block" />
          <div>
            <div className="text-2xl font-bold font-mono text-amber-300">14.8x</div>
            <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">SIMD Vector Speedup</div>
          </div>
          <div className="h-8 w-px bg-white/10 hidden sm:block" />
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-400">18 Cfg</div>
            <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">Stanford / Google / Oracle Certs</div>
          </div>
          <div className="h-8 w-px bg-white/10 hidden sm:block" />
          <div>
            <div className="text-2xl font-bold font-mono text-white">2024–28</div>
            <div className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">B.Tech CSE Core (VIT-AP)</div>
          </div>
        </div>

        {/* Instant Recruiter Actions */}
        <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-slate-200 transition-all cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Email Copied!' : 'Copy Email Address'}</span>
            </button>

            <button
              onClick={handleCopyPhone}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white font-medium text-xs hover:bg-white/10 transition-all cursor-pointer"
            >
              {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Phone className="w-4 h-4 text-slate-300" />}
              <span>{copiedPhone ? 'Phone Copied!' : CONTACT_INFO.phone}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {onOpenLab && (
              <button
                onClick={() => {
                  sound.playTick();
                  onClose();
                  onOpenLab();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 border border-amber-500/25 text-xs font-medium transition-all cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Test in Interactive Lab</span>
              </button>
            )}

            <a
              href={CONTACT_INFO.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all"
              title="LinkedIn Profile"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
