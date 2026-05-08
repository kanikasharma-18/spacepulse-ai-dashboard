import { Link } from 'react-router-dom';
import {
  Satellite, BarChart3, Newspaper, Brain,
  Activity, Clock, Globe2, Zap, ArrowRight,
  TrendingUp, Radio,
} from 'lucide-react';

const widgets = [
  {
    id: 'iss',
    title: 'ISS Tracker',
    subtitle: 'Live orbital position',
    icon: Satellite,
    color: 'from-nebula-500 to-space-500',
    to: '/iss',
    size: 'lg:col-span-2',
  },
  {
    id: 'charts',
    title: 'Space Analytics',
    subtitle: 'Launch & mission data',
    icon: BarChart3,
    color: 'from-space-500 to-cosmos-500',
    to: '/charts',
    size: '',
  },
  {
    id: 'chatbot',
    title: 'AI Assistant',
    subtitle: 'Space intelligence',
    icon: Brain,
    color: 'from-cosmos-500 to-nebula-400',
    to: '/chatbot',
    size: '',
  },
  {
    id: 'news',
    title: 'Space News',
    subtitle: 'Latest missions & discoveries',
    icon: Newspaper,
    color: 'from-space-400 to-nebula-500',
    to: '/news',
    size: 'lg:col-span-2',
  },
];

const quickStats = [
  { label: 'ISS Altitude', value: '408 km', icon: Globe2, trend: '+0.2%', up: true },
  { label: 'Orbital Speed', value: '7.66 km/s', icon: Zap, trend: 'Stable', up: null },
  { label: 'Crew On Board', value: '7', icon: Activity, trend: 'Current', up: null },
  { label: 'Orbit #', value: '~136,000+', icon: Radio, trend: '+16/day', up: true },
];

export default function Dashboard() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-1">
              Mission <span className="text-gradient">Control</span>
            </h1>
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <Clock size={14} className="text-space-400" />
              {dateStr}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-card px-4 py-2 flex items-center gap-2 text-sm text-slate-300">
              <span className="status-dot status-dot-green" />
              All Systems Nominal
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card p-5 hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-space-500/20 flex items-center justify-center">
                    <Icon size={16} className="text-space-400" />
                  </div>
                  {stat.up !== null && (
                    <span className={`text-xs font-medium flex items-center gap-0.5 ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                      <TrendingUp size={10} />
                      {stat.trend}
                    </span>
                  )}
                  {stat.up === null && (
                    <span className="text-xs text-slate-500">{stat.trend}</span>
                  )}
                </div>
                <div className="font-display font-bold text-xl text-white mb-0.5">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Widget Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {widgets.map((w) => {
            const Icon = w.icon;
            return (
              <Link
                key={w.id}
                to={w.to}
                className={`glass-card p-6 group hover:-translate-y-2 transition-all duration-300 hover:shadow-glow-sm ${w.size}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${w.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white font-display text-sm">{w.title}</h3>
                      <p className="text-xs text-slate-500">{w.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-600 group-hover:text-space-400 group-hover:translate-x-1 transition-all duration-200" />
                </div>

                {/* Placeholder body */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] min-h-[140px] flex flex-col items-center justify-center gap-3 p-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${w.color} opacity-20 flex items-center justify-center`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <p className="text-xs text-slate-500 text-center">
                    Navigate to <span className="text-space-400 font-medium">{w.title}</span> to load data
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-space-400 font-medium group-hover:gap-3 transition-all duration-200">
                  Open module <ArrowRight size={12} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Activity Feed */}
        <div className="mt-8 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-lg text-white flex items-center gap-2">
              <Activity size={18} className="text-space-400" />
              System Activity
            </h2>
            <span className="text-xs text-slate-500">{timeStr} UTC</span>
          </div>
          <div className="space-y-3">
            {[
              { msg: 'ISS telemetry stream connected', time: 'Just now', color: 'bg-emerald-400' },
              { msg: 'Space news feed refreshed', time: '2 min ago', color: 'bg-nebula-400' },
              { msg: 'AI assistant ready', time: '3 min ago', color: 'bg-cosmos-400' },
              { msg: 'Chart data last synced', time: '5 min ago', color: 'bg-space-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className={`w-2 h-2 rounded-full ${item.color} flex-shrink-0`} />
                <span className="text-sm text-slate-300 flex-1">{item.msg}</span>
                <span className="text-xs text-slate-600 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
