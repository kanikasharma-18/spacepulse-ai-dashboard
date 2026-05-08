import { useState, useEffect } from 'react';
import { Satellite, MapPin, Globe2, Wifi, RefreshCw } from 'lucide-react';
import { getISSPosition } from '../services/issService';

export default function ISSTracker() {
  const [issData, setIssData] = useState({
    latitude: null,
    longitude: null,
    altitude: null,
    velocity: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchISSPosition = async () => {
      try {
        setLoading(true);
        const data = await getISSPosition();
        setIssData({
          latitude: data.latitude.toFixed(4),
          longitude: data.longitude.toFixed(4),
          altitude: data.altitude.toFixed(2),
          velocity: data.velocity.toFixed(2),
        });
        setLastUpdate(new Date().toLocaleTimeString());
        setError(null);
      } catch (err) {
        console.error('Error fetching ISS position:', err);
        setError('Failed to fetch ISS position');
      } finally {
        setLoading(false);
      }
    };

    fetchISSPosition();

    // Update every 5 seconds
    const interval = setInterval(fetchISSPosition, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await getISSPosition();
      setIssData({
        latitude: data.latitude.toFixed(4),
        longitude: data.longitude.toFixed(4),
        altitude: data.altitude.toFixed(2),
        velocity: data.velocity.toFixed(2),
      });
      setLastUpdate(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      setError('Failed to fetch ISS position');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nebula-500 to-space-500 flex items-center justify-center">
              <Satellite size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl text-white">
                ISS <span className="text-gradient-nebula">Tracker</span>
              </h1>
              <p className="text-sm text-slate-400">Real-time International Space Station position</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-nebula-500/10 border border-nebula-500/30 text-nebula-400 hover:bg-nebula-500/20 hover:text-nebula-300 transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Altitude', value: issData.altitude ? `${issData.altitude} km` : '—', icon: Globe2 },
            { label: 'Speed', value: issData.velocity ? `${issData.velocity} km/h` : '—', icon: Wifi },
            { label: 'Latitude', value: issData.latitude || '—', icon: MapPin },
            { label: 'Longitude', value: issData.longitude || '—', icon: MapPin },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} className="text-nebula-400" />
                  <span className="text-xs text-slate-500">{s.label}</span>
                </div>
                <div className="font-display font-bold text-lg text-white">{s.value}</div>
              </div>
            );
          })}
        </div>

        {/* Map placeholder */}
        <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[480px] relative overflow-hidden">
          {/* Decorative rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 rounded-full border border-nebula-500/10 animate-spin-slow" />
            <div className="absolute w-96 h-96 rounded-full border border-space-500/10 animate-spin-slow" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
            <div className="absolute w-[500px] h-[500px] rounded-full border border-cosmos-500/5 animate-spin-slow" style={{ animationDuration: '50s' }} />
          </div>

          {error ? (
            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center animate-float shadow-glow-sm">
                <Satellite size={36} className="text-white" />
              </div>
              <h3 className="font-display font-semibold text-xl text-white">Error Loading Data</h3>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 rounded-lg bg-nebula-500/20 border border-nebula-500/30 text-nebula-400 hover:bg-nebula-500/30 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          ) : issData.latitude ? (
            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-6">
              <div className="text-center">
                <h3 className="font-display font-semibold text-2xl text-white mb-2">ISS Current Position</h3>
                <p className="text-slate-400 text-sm">
                  Last updated: <span className="text-nebula-400 font-semibold">{lastUpdate}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="glass-card p-4 rounded-lg border border-nebula-500/30">
                  <p className="text-xs text-slate-500 mb-1">Latitude</p>
                  <p className="font-display font-bold text-lg text-nebula-400">{issData.latitude}°</p>
                </div>
                <div className="glass-card p-4 rounded-lg border border-nebula-500/30">
                  <p className="text-xs text-slate-500 mb-1">Longitude</p>
                  <p className="font-display font-bold text-lg text-nebula-400">{issData.longitude}°</p>
                </div>
                <div className="glass-card p-4 rounded-lg border border-space-500/30">
                  <p className="text-xs text-slate-500 mb-1">Altitude</p>
                  <p className="font-display font-bold text-lg text-space-400">{issData.altitude} km</p>
                </div>
                <div className="glass-card p-4 rounded-lg border border-space-500/30">
                  <p className="text-xs text-slate-500 mb-1">Velocity</p>
                  <p className="font-display font-bold text-lg text-space-400">{issData.velocity} km/h</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-nebula-500/10 border border-nebula-500/30 text-nebula-400 text-xs font-medium">
                <span className="status-dot status-dot-green animate-pulse" />
                Live telemetry active
              </div>

              <p className="text-slate-500 text-xs text-center max-w-sm">
                🗺️ Interactive map with orbital path coming soon. Position updates every 5 seconds.
              </p>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-nebula-500 to-space-500 flex items-center justify-center animate-float shadow-glow-sm">
                <Satellite size={36} className="text-white" />
              </div>
              <h3 className="font-display font-semibold text-xl text-white">Loading ISS Position...</h3>
              <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                Fetching real-time data from orbit...
              </p>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-nebula-500/10 border border-nebula-500/30 text-nebula-400 text-xs font-medium">
                <span className="status-dot status-dot-yellow animate-pulse" />
                Connecting to satellite network
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
