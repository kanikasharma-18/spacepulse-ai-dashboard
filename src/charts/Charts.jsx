import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart,
  Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';
import { BarChart3, TrendingUp, PieChart as PieIcon, Activity, Globe2, Zap } from 'lucide-react';

// ─── Static space analytics data ────────────────────────────────────────────

const launchData = [
  { year: '2018', SpaceX: 21, NASA: 3, ESA: 6, ISRO: 7 },
  { year: '2019', SpaceX: 13, NASA: 3, ESA: 5, ISRO: 6 },
  { year: '2020', SpaceX: 26, NASA: 5, ESA: 5, ISRO: 2 },
  { year: '2021', SpaceX: 31, NASA: 6, ESA: 7, ISRO: 3 },
  { year: '2022', SpaceX: 61, NASA: 4, ESA: 6, ISRO: 5 },
  { year: '2023', SpaceX: 96, NASA: 6, ESA: 5, ISRO: 7 },
  { year: '2024', SpaceX: 134, NASA: 7, ESA: 7, ISRO: 8 },
];

const altitudeData = [
  { name: 'LEO (200–2000 km)', value: 58 },
  { name: 'MEO (2k–35k km)', value: 14 },
  { name: 'GEO (35,786 km)', value: 21 },
  { name: 'HEO (>35k km)', value: 5 },
  { name: 'Deep Space', value: 2 },
];

const PIE_COLORS = ['#5c6bf3', '#d946ef', '#06b6d4', '#10b981', '#f59e0b'];

const issAltitudeHistory = [
  { month: 'Nov', altitude: 407.2, velocity: 27600 },
  { month: 'Dec', altitude: 408.1, velocity: 27610 },
  { month: 'Jan', altitude: 409.4, velocity: 27620 },
  { month: 'Feb', altitude: 408.9, velocity: 27615 },
  { month: 'Mar', altitude: 407.6, velocity: 27595 },
  { month: 'Apr', altitude: 408.5, velocity: 27608 },
  { month: 'May', altitude: 408.2, velocity: 27605 },
];

const missionSuccessData = [
  { agency: 'SpaceX', success: 94, partial: 4, failure: 2 },
  { agency: 'NASA', success: 97, partial: 2, failure: 1 },
  { agency: 'ESA', success: 92, partial: 5, failure: 3 },
  { agency: 'ISRO', success: 87, partial: 7, failure: 6 },
  { agency: 'Roscosmos', success: 90, partial: 5, failure: 5 },
];

const crewData = [
  { subject: 'EVA Hours', ISS: 85, Artemis: 30 },
  { subject: 'Science Exp.', ISS: 95, Artemis: 60 },
  { subject: 'Comm. Links', ISS: 80, Artemis: 70 },
  { subject: 'Autonomy', ISS: 50, Artemis: 85 },
  { subject: 'Duration', ISS: 90, Artemis: 40 },
  { subject: 'Cargo (t)', ISS: 70, Artemis: 55 },
];

// ─── Custom tooltip ──────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs text-slate-200 border border-white/10 shadow-xl">
      {label && <p className="font-semibold text-white mb-1">{label}</p>}
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}{p.unit || ''}</span>
        </p>
      ))}
    </div>
  );
};

// ─── Section wrapper ─────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, icon: Icon, children }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-space-500/20 flex items-center justify-center">
          <Icon size={16} className="text-space-400" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-sm text-white">{title}</h3>
          {subtitle && <p className="text-[10px] text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function Charts() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-space-500 to-cosmos-500 flex items-center justify-center shadow-glow-sm">
            <BarChart3 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-white">
              Space <span className="text-gradient">Analytics</span>
            </h1>
            <p className="text-sm text-slate-400">Launch statistics, mission data &amp; orbital analytics</p>
          </div>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 1 — Launches per year (grouped bar) */}
          <ChartCard
            title="Launches Per Year"
            subtitle="Rockets launched by agency 2018–2024"
            icon={BarChart3}
          >
            <BarChart data={launchData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Bar dataKey="SpaceX" fill="#5c6bf3" radius={[3, 3, 0, 0]} />
              <Bar dataKey="NASA" fill="#06b6d4" radius={[3, 3, 0, 0]} />
              <Bar dataKey="ESA" fill="#d946ef" radius={[3, 3, 0, 0]} />
              <Bar dataKey="ISRO" fill="#10b981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ChartCard>

          {/* 2 — Satellite altitude distribution (pie) */}
          <ChartCard
            title="Orbital Altitude Distribution"
            subtitle="Active satellites by orbit band"
            icon={PieIcon}
          >
            <PieChart>
              <Pie
                data={altitudeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={40}
                paddingAngle={3}
                label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {altitudeData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ChartCard>

          {/* 3 — ISS altitude & velocity trend (dual-axis area) */}
          <ChartCard
            title="ISS Orbital Parameters"
            subtitle="Altitude (km) & velocity (km/h) – last 7 months"
            icon={TrendingUp}
          >
            <AreaChart data={issAltitudeHistory} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="altGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5c6bf3" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#5c6bf3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis yAxisId="alt" domain={[406, 411]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Area
                yAxisId="alt"
                type="monotone"
                dataKey="altitude"
                name="Altitude (km)"
                stroke="#5c6bf3"
                strokeWidth={2}
                fill="url(#altGrad)"
                dot={{ fill: '#5c6bf3', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ChartCard>

          {/* 4 — Mission success rates (stacked bar) */}
          <ChartCard
            title="Mission Success Rate"
            subtitle="Outcomes by agency (%)"
            icon={Activity}
          >
            <BarChart data={missionSuccessData} layout="vertical" margin={{ top: 4, right: 4, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis dataKey="agency" type="category" tick={{ fill: '#94a3b8', fontSize: 11 }} width={72} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Bar dataKey="success" name="Success %" stackId="a" fill="#10b981" />
              <Bar dataKey="partial" name="Partial %" stackId="a" fill="#f59e0b" />
              <Bar dataKey="failure" name="Failure %" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartCard>

          {/* 5 — ISS vs Artemis radar */}
          <ChartCard
            title="ISS vs Artemis Capability"
            subtitle="Comparative mission profile radar"
            icon={Globe2}
          >
            <RadarChart data={crewData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
              <Radar name="ISS" dataKey="ISS" stroke="#5c6bf3" fill="#5c6bf3" fillOpacity={0.25} />
              <Radar name="Artemis" dataKey="Artemis" stroke="#d946ef" fill="#d946ef" fillOpacity={0.2} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#94a3b8' }} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ChartCard>

          {/* 6 — ISS velocity trend line */}
          <ChartCard
            title="ISS Velocity Trend"
            subtitle="Orbital velocity (km/h) — last 7 months"
            icon={Zap}
          >
            <LineChart data={issAltitudeHistory} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="velGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#d946ef" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis domain={[27580, 27640]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="velocity"
                name="Velocity (km/h)"
                stroke="url(#velGrad)"
                strokeWidth={2.5}
                dot={{ fill: '#06b6d4', r: 4 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ChartCard>

        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-slate-600">
          Data based on public space agency reports · ISS orbital params updated periodically
        </p>
      </div>
    </div>
  );
}
