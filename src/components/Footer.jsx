import { Link } from 'react-router-dom';
import { Rocket, Code, MessageCircle, Globe2, Heart } from 'lucide-react';

const footerLinks = {
  Features: [
    { label: 'ISS Tracker', to: '/iss' },
    { label: 'Space Charts', to: '/charts' },
    { label: 'Space News', to: '/news' },
    { label: 'AI Chatbot', to: '/chatbot' },
  ],
  Dashboard: [
    { label: 'Overview', to: '/dashboard' },
    { label: 'Analytics', to: '/dashboard' },
    { label: 'Live Feed', to: '/dashboard' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-dark-500/60 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-space-500 to-cosmos-500 shadow-glow-sm">
                <Rocket size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg tracking-wide">
                SpacePulse AI
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-6">
              Real-time space exploration data, AI-powered insights, and live mission tracking — all at your fingertips.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Code, href: '#', label: 'GitHub' },
                { Icon: MessageCircle, href: '#', label: 'Twitter' },
                { Icon: Globe2, href: '#', label: 'Website' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 hover:border-space-500/50 text-slate-400 hover:text-white transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold tracking-widest text-slate-500 uppercase mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-space-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} SpacePulse AI Dashboard. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            Made with <Heart size={12} className="text-cosmos-400 fill-cosmos-400" /> for space explorers
          </p>
        </div>
      </div>
    </footer>
  );
}
