import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

const chartPlaceholders = [
  { title: 'Launches Per Year', icon: BarChart3, desc: 'Bar chart showing global rocket launches by year.' },
  { title: 'Mission Success Rate', icon: PieChart, desc: 'Pie chart of mission outcomes across agencies.' },
  { title: 'Orbital Altitude Distribution', icon: TrendingUp, desc: 'Line chart of active satellites by altitude band.' },
  { title: 'Launch Sites Activity', icon: Activity, desc: 'Activity heatmap across global spaceports.' },
];

export default function Charts() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-space-500 to-cosmos-500 flex items-center justify-center">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-white">
              Space <span className="text-gradient">Analytics</span>
            </h1>
            <p className="text-sm text-slate-400">Launch statistics, mission data & orbital analytics</p>
          </div>
        </div>

        {/* Chart grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chartPlaceholders.map((chart, i) => {
            const Icon = chart.icon;
            return (
              <div key={chart.title} className="glass-card p-6 animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-space-500/20 flex items-center justify-center">
                    <Icon size={16} className="text-space-400" />
                  </div>
                  <h3 className="font-display font-semibold text-sm text-white">{chart.title}</h3>
                </div>

                {/* Skeleton chart */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] min-h-[200px] p-4 flex flex-col justify-end gap-2">
                  {chart.icon === BarChart3 && (
                    <div className="flex items-end gap-2 h-32">
                      {[40, 65, 50, 80, 55, 90, 70, 85, 60, 75].map((h, j) => (
                        <div
                          key={j}
                          className="flex-1 rounded-t-sm bg-gradient-to-t from-space-600 to-space-400 opacity-30"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  )}
                  {chart.icon === PieChart && (
                    <div className="flex items-center justify-center h-32">
                      <div className="w-24 h-24 rounded-full border-8 border-space-500/30 border-t-space-400 border-r-cosmos-400 animate-spin-slow opacity-40" />
                    </div>
                  )}
                  {chart.icon === TrendingUp && (
                    <svg viewBox="0 0 200 80" className="w-full h-32 opacity-30">
                      <polyline
                        points="0,70 30,55 60,60 90,35 120,45 150,20 180,30 200,15"
                        fill="none"
                        stroke="url(#lineGrad)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#06b6d4" />
                          <stop offset="100%" stopColor="#5c6bf3" />
                        </linearGradient>
                      </defs>
                    </svg>
                  )}
                  {chart.icon === Activity && (
                    <div className="grid grid-cols-10 gap-1 h-32 content-center">
                      {Array.from({ length: 70 }, (_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-sm bg-space-500 opacity-10"
                          style={{ opacity: Math.random() * 0.4 + 0.05 }}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-slate-500 text-center mt-2">{chart.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
