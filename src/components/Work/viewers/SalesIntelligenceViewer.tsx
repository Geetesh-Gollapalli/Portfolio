import React, { useState } from 'react';
import { TrendingUp, BarChart2 } from 'lucide-react';

interface MetricPoint {
  segment: string;
  revenue: number;
  margin: number;
  growth: string;
}

export const SalesIntelligenceViewer: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<'Global' | 'North America' | 'APAC' | 'EMEA'>('Global');
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'margin'>('revenue');

  const regionData: Record<string, MetricPoint[]> = {
    Global: [
      { segment: 'Enterprise SaaS', revenue: 4.8, margin: 78, growth: '+24.5%' },
      { segment: 'Data Infra', revenue: 3.2, margin: 82, growth: '+31.2%' },
      { segment: 'AI Compute', revenue: 2.9, margin: 69, growth: '+44.0%' },
      { segment: 'Professional Svcs', revenue: 1.4, margin: 45, growth: '+8.1%' }
    ],
    'North America': [
      { segment: 'Enterprise SaaS', revenue: 2.6, margin: 80, growth: '+22.0%' },
      { segment: 'Data Infra', revenue: 1.8, margin: 84, growth: '+28.5%' },
      { segment: 'AI Compute', revenue: 1.5, margin: 71, growth: '+48.2%' },
      { segment: 'Professional Svcs', revenue: 0.8, margin: 48, growth: '+9.4%' }
    ],
    APAC: [
      { segment: 'Enterprise SaaS', revenue: 1.4, margin: 76, growth: '+29.4%' },
      { segment: 'Data Infra', revenue: 0.9, margin: 79, growth: '+36.0%' },
      { segment: 'AI Compute', revenue: 0.9, margin: 67, growth: '+41.5%' },
      { segment: 'Professional Svcs', revenue: 0.4, margin: 42, growth: '+6.2%' }
    ],
    EMEA: [
      { segment: 'Enterprise SaaS', revenue: 0.8, margin: 75, growth: '+19.8%' },
      { segment: 'Data Infra', revenue: 0.5, margin: 81, growth: '+25.1%' },
      { segment: 'AI Compute', revenue: 0.5, margin: 68, growth: '+38.7%' },
      { segment: 'Professional Svcs', revenue: 0.2, margin: 41, growth: '+5.5%' }
    ]
  };

  const currentData = regionData[selectedRegion];
  const maxRevenue = 5.0;

  return (
    <div className="w-full bg-[#101016]/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-4 text-xs font-sans">
      {/* macOS Window Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]/50" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#d89e24]/50" />
            <span className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]/50" />
          </div>
          <span className="font-medium text-white/90 tracking-tight text-[13px]">Sales Analytics</span>
        </div>

        {/* Region Segmented Bar */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/5">
          {(['Global', 'North America', 'APAC', 'EMEA'] as const).map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-300 cursor-pointer ${
                selectedRegion === region
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Apple-style Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 bg-black/50 rounded-2xl border border-white/[0.06]">
          <div className="text-slate-400 text-[10px] uppercase font-mono tracking-wider">Gross Rev</div>
          <div className="text-sm sm:text-base font-semibold text-white mt-1 tabular-nums font-mono">
            ${currentData.reduce((acc, d) => acc + d.revenue, 0).toFixed(1)}M
          </div>
        </div>
        <div className="p-3 bg-black/50 rounded-2xl border border-white/[0.06]">
          <div className="text-slate-400 text-[10px] uppercase font-mono tracking-wider">Avg Margin</div>
          <div className="text-sm sm:text-base font-semibold text-emerald-400 mt-1 tabular-nums font-mono">
            {(currentData.reduce((acc, d) => acc + d.margin, 0) / currentData.length).toFixed(1)}%
          </div>
        </div>
        <div className="p-3 bg-black/50 rounded-2xl border border-white/[0.06]">
          <div className="text-slate-400 text-[10px] uppercase font-mono tracking-wider">YoY Growth</div>
          <div className="text-sm sm:text-base font-semibold text-[#8B5CF6] mt-1 tabular-nums font-mono">
            +27.8%
          </div>
        </div>
      </div>

      {/* Interactive Bar Chart */}
      <div className="bg-black/60 rounded-2xl p-4 border border-white/[0.06] space-y-3">
        <div className="flex items-center justify-between text-slate-400 text-[11px]">
          <span className="font-medium">Segment Contribution</span>
          <div className="flex items-center gap-1.5 bg-white/[0.04] px-2 py-0.5 rounded-lg border border-white/5">
            <button
              onClick={() => setActiveMetric('revenue')}
              className={`cursor-pointer transition-colors ${activeMetric === 'revenue' ? 'text-white font-medium' : 'text-slate-500'}`}
            >
              Revenue
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => setActiveMetric('margin')}
              className={`cursor-pointer transition-colors ${activeMetric === 'margin' ? 'text-white font-medium' : 'text-slate-500'}`}
            >
              Margin
            </button>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {currentData.map((item) => {
            const widthPct = Math.round((item.revenue / maxRevenue) * 100);
            return (
              <div key={item.segment} className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">{item.segment}</span>
                  <div className="flex items-center gap-2 tabular-nums font-mono">
                    <span className="text-white font-semibold">
                      {activeMetric === 'revenue' ? `$${item.revenue}M` : `${item.margin}%`}
                    </span>
                    <span className="text-emerald-400 text-[10px]">{item.growth}</span>
                  </div>
                </div>
                {/* Smooth rounded bar */}
                <div className="h-2.5 w-full bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200"
                    style={{ width: `${activeMetric === 'revenue' ? widthPct : item.margin}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
        <span>MySQL DW · LOD Expressions</span>
        <span className="text-slate-400">Latency: 14ms</span>
      </div>
    </div>
  );
};
