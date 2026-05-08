import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Rocket, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'ISS Tracker', to: '/iss' },
  { label: 'Charts', to: '/charts' },
  { label: 'News', to: '/news' },
  { label: 'Chatbot', to: '/chatbot' },
];

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 backdrop-blur-xl border-b border-white/10 bg-dark-500/80'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-space-500 to-cosmos-500 shadow-glow-sm group-hover:shadow-glow-lg transition-shadow duration-300">
            <Rocket size={18} className="text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-nebula-400 animate-pulse" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display font-bold text-sm tracking-wider text-white">
              SpacePulse
            </span>
            <span className="text-[10px] font-medium tracking-[0.2em] text-space-400 uppercase">
              AI Dashboard
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'text-white bg-space-500/20 border border-space-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-space-400" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10">
            <span className="status-dot status-dot-green" />
            <span className="text-xs font-medium text-emerald-400">Live</span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            id="theme-toggle"
            aria-label="Toggle theme"
            className="relative w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 group"
          >
            {isDark ? (
              <Sun size={16} className="text-yellow-400 group-hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon size={16} className="text-space-400 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* CTA */}
          <Link to="/dashboard" className="hidden sm:block btn-primary py-2 px-4 text-sm">
            <span className="flex items-center gap-1.5">
              <Zap size={14} />
              Launch
            </span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            id="mobile-menu-toggle"
            aria-label="Toggle menu"
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200"
          >
            {menuOpen ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="md:hidden absolute top-full left-0 right-0 mx-4 mt-2 rounded-2xl border border-white/10 backdrop-blur-xl bg-dark-400/90 p-4 space-y-1 animate-slide-up shadow-glass"
        >
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-space-500/20 text-white border border-space-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="status-dot status-dot-green" /> Live Feed Active
            </span>
            <Link to="/dashboard" className="btn-primary py-2 px-4 text-sm">
              <span className="flex items-center gap-1.5"><Zap size={14} /> Launch</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
