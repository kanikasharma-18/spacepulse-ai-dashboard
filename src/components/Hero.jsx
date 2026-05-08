import { Link } from 'react-router-dom';
import { Rocket, ArrowRight, Satellite, Globe2, Brain, BarChart3, Newspaper } from 'lucide-react';

const features = [
  {
    icon: Satellite,
    title: 'ISS Tracker',
    desc: 'Real-time International Space Station position on an interactive globe.',
    color: 'from-nebula-500 to-space-500',
    to: '/iss',
  },
  {
    icon: BarChart3,
    title: 'Space Charts',
    desc: 'Visualise launch statistics, orbital data and mission analytics.',
    color: 'from-space-500 to-cosmos-500',
    to: '/charts',
  },
  {
    icon: Newspaper,
    title: 'Space News',
    desc: 'Curated real-time feed from the world\'s top space agencies & media.',
    color: 'from-cosmos-500 to-nebula-500',
    to: '/news',
  },
  {
    icon: Brain,
    title: 'AI Chatbot',
    desc: 'Ask anything about space, missions, or astronomy — powered by AI.',
    color: 'from-nebula-400 to-cosmos-400',
    to: '/chatbot',
  },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24 pb-16">
      {/* Background orbs */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 rounded-full bg-space-600/20 blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full bg-cosmos-600/15 blur-3xl pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-nebula-600/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-space-500/40 bg-space-500/10 backdrop-blur-sm">
            <span className="status-dot status-dot-green" />
            <span className="text-xs font-semibold tracking-wider text-space-300 uppercase">
              Mission Control Active
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-none tracking-tight mb-6">
            <span className="block text-white">Space</span>
            <span className="block text-gradient">Pulse AI</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 leading-relaxed">
            Your mission-critical dashboard for real-time space exploration data.
            Track the ISS, explore charts, read space news, and converse with an AI — all in one place.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Link to="/dashboard" className="btn-primary text-base justify-center">
            <span className="flex items-center gap-2">
              <Rocket size={18} />
              Launch Dashboard
              <ArrowRight size={16} />
            </span>
          </Link>
          <Link to="/iss" className="btn-secondary text-base justify-center">
            <Globe2 size={18} />
            Track ISS Live
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { value: '408 km', label: 'ISS Altitude' },
            { value: '27,600', label: 'km/h Orbital Speed' },
            { value: '24/7', label: 'Live Tracking' },
            { value: 'AI', label: 'Powered Insights' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="font-display font-bold text-2xl text-gradient mb-1">{stat.value}</div>
              <div className="text-xs text-slate-500 tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <Link
                key={feat.title}
                to={feat.to}
                className="glass-card p-6 group hover:-translate-y-2 transition-all duration-300 hover:shadow-glow-sm animate-fade-in block"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2 font-display">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-space-400 font-medium group-hover:gap-2.5 transition-all duration-200">
                  Explore <ArrowRight size={12} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
