import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Satellite, MapPin, Globe2, Zap, RefreshCw, Wifi } from 'lucide-react';
import L from 'leaflet';
import { getISSPosition } from '../services/issService';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon (Leaflet + Vite quirk)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom ISS icon
const issIcon = L.divIcon({
  html: `<div style="
    width:36px; height:36px;
    background: linear-gradient(135deg, #5c6bf3, #d946ef);
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.6);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 16px rgba(92,107,243,0.7);
    font-size: 18px;
  ">🛰️</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
});

// Auto-pan to ISS position
function MapPanner({ pos }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo(pos, map.getZoom(), { duration: 1.5 });
  }, [pos, map]);
  return null;
}

const MAX_TRAIL = 60; // keep last 60 positions for orbital trail

export default function ISSTracker() {
  const [issData, setIssData] = useState(null);
  const [trail, setTrail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [autoFollow, setAutoFollow] = useState(true);
  const mountedRef = useRef(true);

  const fetchPosition = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const data = await getISSPosition();
      if (!mountedRef.current) return;

      setIssData({
        latitude: parseFloat(data.latitude.toFixed(4)),
        longitude: parseFloat(data.longitude.toFixed(4)),
        altitude: data.altitude.toFixed(2),
        velocity: (data.velocity / 3.6).toFixed(3), // convert to km/s for display
        velocityKmH: data.velocity.toFixed(0),
        visibility: data.visibility || 'daylight',
      });

      setTrail(prev => {
        const next = [...prev, [data.latitude, data.longitude]];
        return next.length > MAX_TRAIL ? next.slice(next.length - MAX_TRAIL) : next;
      });

      setLastUpdate(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      if (mountedRef.current) setError('Unable to reach ISS tracking API. Showing last known position.');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchPosition(true);
    const interval = setInterval(() => fetchPosition(false), 5000);
    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pos = issData ? [issData.latitude, issData.longitude] : null;

  const statCards = [
    { label: 'Altitude', value: issData ? `${issData.altitude} km` : '—', icon: Globe2, color: 'text-nebula-400' },
    { label: 'Speed', value: issData ? `${issData.velocity} km/s` : '—', icon: Zap, color: 'text-space-400' },
    { label: 'Latitude', value: issData ? `${issData.latitude}°` : '—', icon: MapPin, color: 'text-cosmos-400' },
    { label: 'Longitude', value: issData ? `${issData.longitude}°` : '—', icon: MapPin, color: 'text-cosmos-400' },
    { label: 'Visibility', value: issData ? issData.visibility : '—', icon: Wifi, color: 'text-emerald-400' },
    { label: 'Orbit Speed', value: issData ? `${issData.velocityKmH} km/h` : '—', icon: Satellite, color: 'text-nebula-400' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nebula-500 to-space-500 flex items-center justify-center shadow-glow-sm">
              <Satellite size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl text-white">
                ISS <span className="text-gradient-nebula">Tracker</span>
              </h1>
              <p className="text-sm text-slate-400">Real-time International Space Station position</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoFollow(f => !f)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs border transition-all duration-200
                ${autoFollow
                  ? 'border-nebula-500/50 bg-nebula-500/15 text-nebula-300'
                  : 'border-white/10 bg-white/5 text-slate-400 hover:text-white'
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${autoFollow ? 'bg-nebula-400 animate-pulse' : 'bg-slate-600'}`} />
              {autoFollow ? 'Auto-follow ON' : 'Auto-follow OFF'}
            </button>
            <button
              onClick={() => fetchPosition(true)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-nebula-500/10 border border-nebula-500/30 text-nebula-400 hover:bg-nebula-500/20 hover:text-nebula-300 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {statCards.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="glass-card p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon size={13} className={s.color} />
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</span>
                </div>
                <div className={`font-display font-bold text-base ${s.color}`}>{s.value}</div>
              </div>
            );
          })}
        </div>

        {/* Map */}
        <div className="glass-card p-0 overflow-hidden rounded-2xl" style={{ height: '500px' }}>
          {loading && !issData ? (
            <div className="h-full flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nebula-500 to-space-500 flex items-center justify-center animate-float shadow-glow-sm">
                <Satellite size={30} className="text-white" />
              </div>
              <p className="text-slate-400 text-sm animate-pulse">Connecting to satellite network…</p>
            </div>
          ) : (
            <MapContainer
              center={pos || [0, 0]}
              zoom={3}
              style={{ height: '100%', width: '100%', background: '#090d1a' }}
              zoomControl={true}
              attributionControl={false}
            >
              {/* Dark space-themed tile layer */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com">CARTO</a>'
              />

              {/* Orbital trail */}
              {trail.length > 1 && (
                <Polyline
                  positions={trail}
                  color="#5c6bf3"
                  weight={2}
                  opacity={0.5}
                  dashArray="6 4"
                />
              )}

              {/* ISS Marker */}
              {pos && (
                <Marker position={pos} icon={issIcon}>
                  <Popup className="iss-popup">
                    <div className="text-slate-800 text-sm font-medium">
                      <p className="font-bold text-base mb-1">🛰️ ISS</p>
                      <p>Lat: {issData.latitude}°</p>
                      <p>Lon: {issData.longitude}°</p>
                      <p>Alt: {issData.altitude} km</p>
                      <p>Speed: {issData.velocityKmH} km/h</p>
                      {lastUpdate && <p className="text-xs text-slate-500 mt-1">Updated: {lastUpdate}</p>}
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Auto-follow */}
              {autoFollow && pos && <MapPanner pos={pos} />}
            </MapContainer>
          )}
        </div>

        {/* Status bar */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="status-dot status-dot-green animate-pulse" />
            Live telemetry · updates every 5 seconds
          </div>
          {error && <span className="text-amber-400">{error}</span>}
          {lastUpdate && (
            <span>Last update: <span className="text-nebula-400 font-medium">{lastUpdate}</span></span>
          )}
        </div>

      </div>
    </div>
  );
}
