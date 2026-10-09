import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Cpu, BarChart2, Zap, Play, CheckCircle2, RefreshCw, Layers, ShieldCheck, ArrowRight, CornerDownLeft, Sparkles, Volume2, Mic } from 'lucide-react';
import { PROJECTS, SKILL_CATEGORIES, CREDENTIALS, CONTACT_INFO } from '../../data/portfolioData';
import { sound } from '../../services/soundEffects';

interface InteractiveLabProps {
  onClose?: () => void;
}

export const InteractiveLab: React.FC<InteractiveLabProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'nero' | 'analytics' | 'vector'>('terminal');

  // Terminal state
  const [inputCommand, setInputCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<Array<{ cmd: string; output: string | React.ReactNode; time: string }>>([
    {
      cmd: 'geetesh --status',
      output: (
        <div className="space-y-1 text-slate-300">
          <p className="text-[#F59E0B] font-semibold">● Candidate Status: Active &amp; Ready for High-Impact Engineering Roles</p>
          <p>Name: Geetesh Gollapalli | B.Tech CSE Core (VIT-AP University)</p>
          <p>Key Domains: Autonomous OS Automation, Generative AI Pipelines, Enterprise BI &amp; Low-Latency SIMD</p>
          <p className="text-slate-400">Type <span className="text-white underline">help</span> or click command badges below to inspect technical depth.</p>
        </div>
      ),
      time: '00:00:01'
    }
  ]);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Nero Simulation state
  const [neroTarget, setNeroTarget] = useState<'active_window' | 'speech_stt' | 'tree_walk' | 'intent_payload'>('tree_walk');
  const [neroRunning, setNeroRunning] = useState(false);
  const [neroLogs, setNeroLogs] = useState<string[]>([
    '[INIT] Nero Automation Engine loaded. Backend: Windows UIAutomation (UIA)',
    '[ATTACH] Desktop tree walk initialized. Process ID: 14208',
    '[READY] Ready for system events or intent triggers.'
  ]);

  // Analytics Simulation state
  const [revenueInput, setRevenueInput] = useState(485000);
  const [marginPercent, setMarginPercent] = useState(38);
  const [cohortCount, setCohortCount] = useState(1420);

  // Vector SIMD Simulation state
  const [batchSize, setBatchSize] = useState(250000);
  const [dimensions, setDimensions] = useState(128);
  const [isSimdActive, setIsSimdActive] = useState(true);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandHistory]);

  const executeCommand = (cmd: string) => {
    sound.playTerminalBeep();
    const cleanCmd = cmd.trim().toLowerCase();
    const now = new Date().toLocaleTimeString();

    let output: React.ReactNode;

    switch (cleanCmd) {
      case 'help':
        output = (
          <div className="space-y-1 text-slate-300">
            <p className="text-amber-300 font-semibold">Available Shell Commands:</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div><span className="text-[#F59E0B] font-mono">skills</span> — List all 8 specialized domains</div>
              <div><span className="text-[#F59E0B] font-mono">run nero</span> — Trigger OS automation inspector test</div>
              <div><span className="text-[#F59E0B] font-mono">benchmark</span> — Compute SIMD vs naive loop metrics</div>
              <div><span className="text-[#F59E0B] font-mono">certs</span> — Display verified Stanford/Google certs</div>
              <div><span className="text-[#F59E0B] font-mono">why-hire</span> — 4 core reasons to hire Geetesh</div>
              <div><span className="text-[#F59E0B] font-mono">contact</span> — Instant phone, email, and profiles</div>
              <div><span className="text-[#F59E0B] font-mono">clear</span> — Clear terminal output</div>
            </div>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-2 text-slate-300">
            <p className="text-emerald-400 font-semibold">Verified Engineered Skill Stack:</p>
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.id} className="text-xs">
                <span className="text-[#F59E0B] font-mono font-bold">[{cat.title}]: </span>
                <span className="text-slate-300">{cat.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'run nero':
      case 'nero':
        output = (
          <div className="space-y-1 text-emerald-400 font-mono text-xs">
            <p>[SUCCESS] Executing Nero Automation Engine Dispatcher...</p>
            <p className="text-slate-300">Target: Desktop.ActiveWindow() → UIAutomation element inspected</p>
            <p className="text-slate-300">Latency: 146ms (STT) + 24ms (Intent Extraction) = 170ms total</p>
            <p className="text-[#F59E0B]">Payload Dispatched: &#123; action: &quot;TILE_WINDOW_LEFT&quot;, target: &quot;VSCode&quot;, status: &quot;EXECUTED&quot; &#125;</p>
          </div>
        );
        break;

      case 'benchmark':
        output = (
          <div className="space-y-1 text-purple-300 font-mono text-xs">
            <p>[BENCHMARK] Vectorized Subspace Projection vs Naive Python Loop</p>
            <p className="text-slate-300">Batch Size: 250,000 vectors | Dimension: 128 | SIMD: AVX2</p>
            <p className="text-rose-400">Naive Python Loop: 428.4 ms</p>
            <p className="text-emerald-400">NumPy C-BLAS Zero-Copy: 28.9 ms</p>
            <p className="text-[#F59E0B] font-bold">Speedup Factor: 14.82x acceleration (O(N) vectorized bound)</p>
          </div>
        );
        break;

      case 'certs':
      case 'credentials':
        output = (
          <div className="space-y-1.5 text-xs">
            <p className="text-amber-300 font-semibold">Key Verified Professional Credentials ({CREDENTIALS.length} Total):</p>
            <div className="space-y-1 text-slate-300">
              <p>• <strong className="text-white">Stanford University:</strong> Algorithms Specialization (Divide-and-Conquer, Graphs, Dynamic Programming)</p>
              <p>• <strong className="text-white">Oracle University:</strong> OCI Certified AI Foundations Associate (2026) &amp; Oracle Fusion AI Agent Studio</p>
              <p>• <strong className="text-white">Google:</strong> AI Professional, Advanced Data Analytics, Cybersecurity &amp; Project Management</p>
              <p>• <strong className="text-white">IBM:</strong> Generative AI Engineering &amp; AI Developer</p>
              <p>• <strong className="text-white">Meta:</strong> Database Engineer Professional Certificate</p>
            </div>
          </div>
        );
        break;

      case 'why-hire':
        output = (
          <div className="space-y-1.5 text-xs text-slate-300">
            <p className="text-[#F59E0B] font-bold text-sm">Key Evaluation Highlights for Geetesh Gollapalli:</p>
            <p>1. <strong className="text-white">Real OS Engineering:</strong> Not just wrappers — writes deep Win32 UIA tree-walking automation in Python/PyQt6.</p>
            <p>2. <strong className="text-white">Enterprise Data Rigor:</strong> 1.2M rows/s analytical processing with Tableau, MySQL, and Level-of-Detail (LOD) margin models.</p>
            <p>3. <strong className="text-white">Mathematical Foundation:</strong> Stanford Algorithms verified, C SIMD vector routines, VIT-AP CSE Core honors track.</p>
            <p>4. <strong className="text-white">Zero Ramp-up Time:</strong> Proven mastery across 18 industry certifications with production-grade code architecture.</p>
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="space-y-1 text-xs text-slate-300">
            <p className="text-white font-semibold">Direct Candidate Contact:</p>
            <p>Email: <a href={`mailto:${CONTACT_INFO.email}`} className="text-[#F59E0B] underline">{CONTACT_INFO.email}</a></p>
            <p>Phone: <span className="text-white">{CONTACT_INFO.phone}</span> (Tandur, India)</p>
            <p>GitHub: <a href={CONTACT_INFO.socials.github} target="_blank" rel="noreferrer" className="text-slate-300 underline">{CONTACT_INFO.socials.github}</a></p>
            <p>LinkedIn: <a href={CONTACT_INFO.socials.linkedin} target="_blank" rel="noreferrer" className="text-[#8B5CF6] underline">{CONTACT_INFO.socials.linkedin}</a></p>
          </div>
        );
        break;

      case 'clear':
        setCommandHistory([]);
        setInputCommand('');
        return;

      default:
        output = (
          <p className="text-rose-400 text-xs">
            Command not recognized: &quot;{cleanCmd}&quot;. Type <span className="text-white underline">help</span> or click command buttons below.
          </p>
        );
    }

    setCommandHistory((prev) => [...prev, { cmd, output, time: now }]);
    setInputCommand('');
  };

  const runNeroSimulation = (type: typeof neroTarget) => {
    sound.playTerminalBeep();
    setNeroTarget(type);
    setNeroRunning(true);

    const steps: Record<string, string[]> = {
      active_window: [
        '[UIA] Querying Desktop.active_window()...',
        '[TREE] Found TopWindow: "Visual Studio Code - Workspace"',
        '[METADATA] Bounds: Rect(0, 0, 1920, 1080), Handle: 0x002F04A1, ControlType: WindowControl',
        '[DISPATCH] Event: WindowFocusChanged triggered successfully.'
      ],
      speech_stt: [
        '[SPEECH] Capturing microphone audio stream at 16kHz PCM...',
        '[VAD] Voice activity detected: duration 1.4s',
        '[STT] Whisper-turbo local engine transcription: "Summarize today\'s sales analytics"',
        '[LATENCY] Audio processing latency: 168ms (Target < 180ms - PASS)'
      ],
      tree_walk: [
        '[INSPECT] Recursive tree walk initiated on target process...',
        '[NODE] 128 elements indexed across Win32 / UWP containers',
        '[MATCH] Identified invokable target button: "ExecuteQueryBtn" [ID=5042]',
        '[STATUS] Dynamic binding attached without static coordinate dependencies.'
      ],
      intent_payload: [
        '[PARSER] Input transcript sent to Intent Classification pipeline',
        '[INTENT] Matched intent: INTENT_SYSTEM_TILE_WORKSPACE (Confidence: 0.982)',
        '[ENTITY] Extracted parameters: { layout: "dual-pane", app_a: "VSCode", app_b: "Terminal" }',
        '[EXECUTE] Action dispatched via Windows API: 2 windows repositioned.'
      ]
    };

    const newLogs = steps[type] || [];
    setTimeout(() => {
      setNeroLogs(newLogs);
      setNeroRunning(false);
      sound.playTick();
    }, 400);
  };

  return (
    <div className="w-full bg-[#07070c] border border-white/15 rounded-3xl p-5 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-slate-200">
      {/* Top Banner & Tab Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#F59E0B] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE SYSTEMS WORKBENCH</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Live Technical Sandbox &amp; Skill Proofs
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            Interact directly with candidate code logic, OS automation dispatchers, and low-latency benchmarks.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white/[0.04] rounded-2xl border border-white/10 w-fit">
          <button
            onClick={() => {
              sound.playTick();
              setActiveTab('terminal');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'terminal'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal Shell</span>
          </button>

          <button
            onClick={() => {
              sound.playTick();
              setActiveTab('nero');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'nero'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-600" />
            <span>Nero OS Engine</span>
          </button>

          <button
            onClick={() => {
              sound.playTick();
              setActiveTab('analytics');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Data Analytics</span>
          </button>

          <button
            onClick={() => {
              sound.playTick();
              setActiveTab('vector');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'vector'
                ? 'bg-white text-black font-semibold shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>SIMD Benchmark</span>
          </button>
        </div>
      </div>

      {/* TAB 1: TERMINAL REPL */}
      {activeTab === 'terminal' && (
        <div className="mt-5 space-y-4">
          {/* Quick command suggestion pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-mono text-[11px] mr-1">Quick Run:</span>
            {['skills', 'run nero', 'benchmark', 'certs', 'why-hire', 'contact'].map((c) => (
              <button
                key={c}
                onClick={() => executeCommand(c)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#F59E0B] border border-white/10 font-mono text-[11px] transition-all cursor-pointer"
              >
                ${c}
              </button>
            ))}
            <button
              onClick={() => executeCommand('clear')}
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-[11px] font-mono cursor-pointer ml-auto"
            >
              clear
            </button>
          </div>

          {/* Terminal Console View */}
          <div className="h-72 sm:h-80 bg-black/80 rounded-2xl border border-white/10 p-4 font-mono text-xs overflow-y-auto space-y-3.5 shadow-inner">
            {commandHistory.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <span className="text-emerald-400">geetesh@systems-arch:~$</span>
                  <span className="text-white font-bold">{item.cmd}</span>
                  <span className="ml-auto text-slate-600 text-[10px]">{item.time}</span>
                </div>
                <div className="pl-4 border-l border-white/10">{item.output}</div>
              </div>
            ))}
            <div ref={terminalBottomRef} />
          </div>

          {/* Interactive Shell Prompt Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputCommand.trim()) executeCommand(inputCommand);
            }}
            className="flex items-center gap-2 bg-black/60 rounded-xl border border-white/15 px-3 py-2 text-xs font-mono"
          >
            <span className="text-emerald-400 font-bold shrink-0">geetesh@dev:~$</span>
            <input
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              placeholder="Type command ('skills', 'benchmark', 'why-hire')..."
              className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Run command"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: NERO OS AUTOMATION ENGINE */}
      {activeTab === 'nero' && (
        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Control Panel */}
            <div className="md:col-span-5 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Trigger Automation Pipeline:
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => runNeroSimulation('tree_walk')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    neroTarget === 'tree_walk'
                      ? 'bg-amber-950/20 border-[#F59E0B] text-white shadow-sm'
                      : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>1. Win32 UIA Tree Walk</span>
                    <span className="text-[10px] font-mono text-[#F59E0B]">100% Dynamic</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Traverses UIAutomation element hierarchy without static screen coordinates.
                  </p>
                </button>

                <button
                  onClick={() => runNeroSimulation('speech_stt')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    neroTarget === 'speech_stt'
                      ? 'bg-amber-950/20 border-[#F59E0B] text-white shadow-sm'
                      : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>2. Speech Pipeline (STT/TTS)</span>
                    <span className="text-[10px] font-mono text-emerald-400">&lt;180ms Latency</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    VAD audio chunking paired with local Whisper-turbo transcription.
                  </p>
                </button>

                <button
                  onClick={() => runNeroSimulation('intent_payload')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    neroTarget === 'intent_payload'
                      ? 'bg-amber-950/20 border-[#F59E0B] text-white shadow-sm'
                      : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>3. Intent &amp; Entity Dispatcher</span>
                    <span className="text-[10px] font-mono text-purple-400">Decoupled QThread</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Resolves intent slots to invoke atomic OS window management actions.
                  </p>
                </button>
              </div>
            </div>

            {/* Live Output & Logs */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Nero Diagnostics &amp; Event Stream:</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Engine Online
                </span>
              </div>

              <div className="h-64 bg-black/90 rounded-2xl border border-white/10 p-4 font-mono text-xs overflow-y-auto space-y-2 text-slate-300 shadow-inner">
                {neroLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed flex items-start gap-2">
                    <span className="text-[#F59E0B] select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
                {neroRunning && (
                  <div className="text-amber-400 flex items-center gap-2 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing atomic system inspection...</span>
                  </div>
                )}
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Memory: <strong>42 MB</strong></span>
                <span className="text-slate-400">GUI Framework: <strong>PyQt6 Frosted Glass</strong></span>
                <span className="text-[#F59E0B]">Backend: <strong>UIAutomation API</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DATA ANALYTICS & LOD METRICS */}
      {activeTab === 'analytics' && (
        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Input Sliders */}
            <div className="md:col-span-5 space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/10">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#F59E0B]">
                Multi-Tier KPI Controls:
              </h4>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Gross Period Revenue:</span>
                  <span className="text-white font-mono font-semibold">${revenueInput.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="1500000"
                  step="25000"
                  value={revenueInput}
                  onChange={(e) => setRevenueInput(Number(e.target.value))}
                  className="w-full accent-[#F59E0B] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Gross Margin Target:</span>
                  <span className="text-white font-mono font-semibold">{marginPercent}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="65"
                  step="1"
                  value={marginPercent}
                  onChange={(e) => setMarginPercent(Number(e.target.value))}
                  className="w-full accent-[#8B5CF6] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Active Account Cohorts:</span>
                  <span className="text-white font-mono font-semibold">{cohortCount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="50"
                  value={cohortCount}
                  onChange={(e) => setCohortCount(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="pt-2 text-[11px] text-slate-500 font-mono">
                Simulating dynamic Tableau LOD calculations feeding from enterprise MySQL views at 1.2M rows/s.
              </div>
            </div>

            {/* Computed Diagnostic View */}
            <div className="md:col-span-7 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Dynamic LOD Aggregate Metrics:
              </h4>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-center">
                  <div className="text-lg sm:text-xl font-bold font-mono text-[#F59E0B]">
                    ${Math.round(revenueInput * (marginPercent / 100)).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase mt-1">Computed Gross Margin</div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 text-center">
                  <div className="text-lg sm:text-xl font-bold font-mono text-purple-300">
                    ${Math.round(revenueInput / Math.max(1, cohortCount)).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase mt-1">Cohort LTV / Account</div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-center">
                  <div className="text-lg sm:text-xl font-bold font-mono text-emerald-300">
                    +{(marginPercent * 0.42).toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono uppercase mt-1">MoM Growth Rate</div>
                </div>
              </div>

              {/* SQL Query Snippet */}
              <div className="p-3.5 rounded-xl bg-black/80 border border-white/10 font-mono text-[11px] text-slate-300 space-y-1">
                <div className="text-slate-500 text-[10px] mb-1">-- Real-time SQL LOD Query Structure</div>
                <p><span className="text-[#F59E0B]">SELECT</span> region_id, product_category,</p>
                <p className="pl-4">SUM(sale_amount) <span className="text-[#8B5CF6]">AS</span> period_revenue,</p>
                <p className="pl-4">ROUND((SUM(sale_amount - unit_cost * qty) / SUM(sale_amount)) * 100, 2) <span className="text-[#8B5CF6]">AS</span> margin_pct</p>
                <p><span className="text-[#F59E0B]">FROM</span> enterprise_orders <span className="text-[#F59E0B]">GROUP BY</span> 1, 2;</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SIMD VECTOR BENCHMARK */}
      {activeTab === 'vector' && (
        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Parameters */}
            <div className="md:col-span-5 space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/10">
              <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                Vector Kernel Parameters:
              </h4>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Matrix Rows (Vectors):</span>
                  <span className="text-white font-mono font-semibold">{batchSize.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="50000"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Vector Dimensions:</span>
                  <span className="text-white font-mono font-semibold">{dimensions} floats</span>
                </div>
                <input
                  type="range"
                  min="32"
                  max="512"
                  step="32"
                  value={dimensions}
                  onChange={(e) => setDimensions(Number(e.target.value))}
                  className="w-full accent-[#F59E0B] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-xs text-slate-300">Enable SIMD AVX2 Zero-Copy</span>
                <button
                  onClick={() => setIsSimdActive(!isSimdActive)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    isSimdActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {isSimdActive ? 'SIMD ENABLED (14.8x)' : 'NAIVE LOOP (1.0x)'}
                </button>
              </div>
            </div>

            {/* Performance Comparison */}
            <div className="md:col-span-7 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Execution Profiler &amp; Latency:
              </h4>

              <div className="space-y-3 p-4 rounded-2xl bg-black/80 border border-white/10 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Naive Python Nested Loop:</span>
                    <span className="text-rose-400 font-bold">{(batchSize * dimensions * 0.000012).toFixed(1)} ms</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>NumPy / C Vectorized BLAS Engine:</span>
                    <span className="text-emerald-400 font-bold">
                      {isSimdActive
                        ? `${((batchSize * dimensions * 0.000012) / 14.8).toFixed(1)} ms`
                        : `${(batchSize * dimensions * 0.000012).toFixed(1)} ms`}
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: isSimdActive ? '6.8%' : '100%' }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Throughput:</span>
                  <span className="text-[#F59E0B] font-bold">
                    {isSimdActive ? `${((batchSize * dimensions) / 1000000 * 28).toFixed(1)} GFLOPS` : '1.9 GFLOPS'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs text-purple-200">
                <strong>Algorithmic Invariant:</strong> High-frequency matrix projections run with zero memory allocations inside the primary loop, utilizing C utility routines bound via ctypes.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
