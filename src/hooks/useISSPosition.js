/**
 * useISSPosition — polls the Open Notify ISS position API every 5 seconds.
 * Returns { lat, lng, timestamp, loading, error }
 */
import { useState, useEffect, useRef } from 'react';

const ISS_API = 'http://api.open-notify.org/iss-now.json';

export function useISSPosition(intervalMs = 5000) {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const timerRef = useRef(null);

  const fetchPosition = async () => {
    try {
      const res  = await fetch(ISS_API);
      if (!res.ok) throw new Error('Failed to fetch ISS position');
      const json = await res.json();
      setData({
        lat:       parseFloat(json.iss_position.latitude),
        lng:       parseFloat(json.iss_position.longitude),
        timestamp: json.timestamp,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosition();
    timerRef.current = setInterval(fetchPosition, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [intervalMs]);

  return { data, loading, error, refetch: fetchPosition };
}
