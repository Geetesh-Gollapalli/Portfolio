import React, { useState, useEffect } from 'react';
import { Play, Pause, Zap } from 'lucide-react';

export const AlgorithmicCoreViewer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [throughput, setThroughput] = useState(1.24);
  const [processedVectors, setProcessedVectors] = useState(842900);
  const [activeThreads, setActiveThreads] = useState(128);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setThroughput(+(1.2 + Math.random() * 0.15).toFixed(2));
      setProcessedVectors((prev) => prev + Math.floor(Math.random() * 3500 + 4000));
    }, 500);
    return () => clearInterval(interval);
  }, [isRunning]);

  const nodes = [
    { x: 20, y: 30, val: '0.84' },
    { x: 50, y: 15, val: '0.91' },
    { x: 80, y: 30, val: '0.76' },
    { x: 20, y: 70, val: '0.99' },
    { x: 50, y: 85, val: '0.88' },
    { x: 80, y: 70, val: '0.95' },
    { x: 50, y: 50, val: '1.00' }
  ];

  return (
    <div className="w-full bg-[#101016]/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-4 text-xs font-sans">
      {/* macOS Window Title Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]/50" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]/50" />
            <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]/50" />
          </div>
          <span className="font-medium text-white/90 tracking-tight text-[13px]">Algorithmic Lattice</span>
          <span className="text-[11px] font-mono text-slate-500">AVX2</span>
        </div>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className="apple-pill-btn px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer font-medium text-[11px]"
        >
          {isRunning ? <Pause className="w-3 h-3 text-cyan-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
          <span>{isRunning ? 'Running' : 'Paused'}</span>
        </button>
      </div>

      {/* Dynamic Wireframe Model */}
      <div className="relative h-36 bg-black/60 rounded-2xl border border-white/[0.06] overflow-hidden flex items-center justify-center p-2">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="appleWireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0.65" />
            </linearGradient>
          </defs>
          <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="url(#appleWireGradient)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="50%" y1="15%" x2="50%" y2="50%" stroke="url(#appleWireGradient)" strokeWidth="1.5" />
          <line x1="80%" y1="30%" x2="50%" y2="50%" stroke="url(#appleWireGradient)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="20%" y1="70%" x2="50%" y2="50%" stroke="url(#appleWireGradient)" strokeWidth="1.5" />
          <line x1="50%" y1="85%" x2="50%" y2="50%" stroke="url(#appleWireGradient)" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="80%" y1="70%" x2="50%" y2="50%" stroke="url(#appleWireGradient)" strokeWidth="1.5" />
        </svg>

        {nodes.map((node, i) => (
          <div
            key={i}
            className={`absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ${
              node.val === '1.00' ? 'scale-110 z-10' : ''
            }`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-[10px] font-mono shadow-md border ${
                node.val === '1.00'
                  ? 'bg-amber-500/25 text-amber-300 border-amber-500/60 shadow-sm'
                  : 'bg-white/10 text-slate-300 border-white/20'
              }`}
            >
              N{i + 1}
            </div>
            <span className="text-[9px] font-mono text-slate-400 mt-0.5 tabular-nums">{node.val}</span>
          </div>
        ))}

        <div className="absolute bottom-2.5 left-3.5 text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Zero-Copy Invariant Pipeline</span>
        </div>
      </div>

      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 bg-black/50 rounded-2xl border border-white/[0.06]">
          <div className="text-slate-400 text-[10px] uppercase font-mono tracking-wider">Throughput</div>
          <div className="text-sm sm:text-base font-semibold text-amber-400 mt-1 tabular-nums font-mono">
            {throughput}M <span className="text-[10px] text-slate-400">vec/s</span>
          </div>
        </div>
        <div className="p-3 bg-black/50 rounded-2xl border border-white/[0.06]">
          <div className="text-slate-400 text-[10px] uppercase font-mono tracking-wider">Processed</div>
          <div className="text-sm sm:text-base font-semibold text-white mt-1 tabular-nums font-mono">
            {processedVectors.toLocaleString()}
          </div>
        </div>
        <div className="p-3 bg-black/50 rounded-2xl border border-white/[0.06]">
          <div className="text-slate-400 text-[10px] uppercase font-mono tracking-wider">Threads</div>
          <div className="text-sm sm:text-base font-semibold text-amber-300 mt-1 tabular-nums font-mono">
            {activeThreads} Parallel
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
        <span>C Library / NumPy Vectorized</span>
        <span className="text-emerald-400 font-semibold">14.8x Speedup</span>
      </div>
    </div>
  );
};
