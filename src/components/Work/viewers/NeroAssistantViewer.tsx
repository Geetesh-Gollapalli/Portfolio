import React, { useState, useEffect } from 'react';
import { Mic, Search, CheckCircle2, Sliders, Sparkles } from 'lucide-react';

export const NeroAssistantViewer: React.FC = () => {
  const [activeIntent, setActiveIntent] = useState<'inspect' | 'dialogue' | 'automate'>('inspect');
  const [isListening, setIsListening] = useState(false);
  const [detectedElement, setDetectedElement] = useState('Win32_Window[MainFrame]');

  useEffect(() => {
    const timer = setInterval(() => {
      const elements = [
        'Win32_Window[MainFrame]',
        'UIA_Button[ID=304_Execute]',
        'UIA_EditControl[Name="Search"]',
        'UIA_TreeItem[Scope="Root"]'
      ];
      setDetectedElement(elements[Math.floor(Math.random() * elements.length)]);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#101016]/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-4 text-xs font-sans">
      {/* macOS Window Title Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          {/* macOS Traffic Light Buttons */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]/50" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]/50" />
            <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]/50" />
          </div>
          <span className="font-medium text-white/90 tracking-tight text-[13px]">Nero OS Core</span>
          <span className="text-[11px] font-mono text-slate-500">v2.4-UIA</span>
        </div>

        <button
          onClick={() => setIsListening(!isListening)}
          className={`apple-pill-btn px-3 py-1 rounded-full flex items-center gap-1.5 transition-all cursor-pointer font-medium text-[11px] ${
            isListening
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              : 'bg-white/5 text-slate-300 hover:text-white border border-white/5'
          }`}
        >
          <Mic className="w-3 h-3" />
          <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
        </button>
      </div>

      {/* Dynamic Soundwave Visualizer */}
      <div className="h-11 bg-black/50 rounded-2xl border border-white/5 flex items-center justify-center px-4 gap-1">
        {[24, 45, 18, 70, 92, 55, 30, 85, 40, 65, 28, 50, 75, 35, 90, 60, 20].map((height, i) => (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-amber-500 to-amber-200 rounded-full transition-all duration-200"
            style={{
              height: isListening ? `${Math.max(15, (height * (Math.sin(Date.now() / 200 + i) + 1.2)) / 2)}%` : `${height * 0.4}%`,
              opacity: isListening ? 0.9 : 0.35
            }}
          />
        ))}
      </div>

      {/* Apple-style Segmented Selector */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/5">
        <button
          onClick={() => setActiveIntent('inspect')}
          className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer text-xs font-medium ${
            activeIntent === 'inspect'
              ? 'bg-white/15 text-white shadow-sm border border-white/10'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          UI Inspection
        </button>
        <button
          onClick={() => setActiveIntent('dialogue')}
          className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer text-xs font-medium ${
            activeIntent === 'dialogue'
              ? 'bg-white/15 text-white shadow-sm border border-white/10'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Intent Payload
        </button>
        <button
          onClick={() => setActiveIntent('automate')}
          className={`py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer text-xs font-medium ${
            activeIntent === 'automate'
              ? 'bg-white/15 text-white shadow-sm border border-white/10'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          OS Action
        </button>
      </div>

      {/* Dynamic Content */}
      <div className="bg-black/60 rounded-2xl p-3.5 border border-white/[0.06] space-y-2 text-[11px] font-mono">
        {activeIntent === 'inspect' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5 font-sans">
                <Search className="w-3.5 h-3.5 text-amber-400" />
                Windows UI Automation Tree
              </span>
              <span className="text-emerald-400 font-semibold font-mono">Active</span>
            </div>
            <div className="p-2.5 bg-white/[0.02] rounded-xl border border-white/5 text-slate-300 space-y-1">
              <div className="text-amber-400">Target: {detectedElement}</div>
              <div className="text-slate-500">Handle: 0x004F2A10 · ControlType: UIA_Custom</div>
              <div className="text-slate-400">Dynamic Bounds: [X: 420, Y: 180, W: 320, H: 45]</div>
            </div>
          </div>
        )}

        {activeIntent === 'dialogue' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-sans">Intent Classification Engine</span>
              <span className="text-amber-400">Confidence: 98.4%</span>
            </div>
            <div className="p-2.5 bg-white/[0.02] rounded-xl border border-white/5 text-slate-300 space-y-1">
              <div><span className="text-slate-500">Intent:</span> <span className="text-amber-300">SYSTEM_WINDOW_TILE_LEFT</span></div>
              <div><span className="text-slate-500">Entities:</span> <span className="text-slate-300">[target="VS Code", workspace=1]</span></div>
              <div><span className="text-slate-500">Latency:</span> <span className="text-emerald-400">42ms end-to-end</span></div>
            </div>
          </div>
        )}

        {activeIntent === 'automate' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-sans">OS Execution Pipeline</span>
              <span className="text-emerald-400">Direct Invoke</span>
            </div>
            <div className="p-2.5 bg-white/[0.02] rounded-xl border border-white/5 text-slate-300">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Element InvokePattern() dispatched</span>
              </div>
              <div className="text-slate-400 mt-1">Dispatched to Windows UI thread without coordinates</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
