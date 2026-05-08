// ISS Position and tracking API service
let lastFetchTime = 0;
let cachedData = null;
const CACHE_DURATION = 30000; // Cache for 30 seconds to avoid rate limiting

// Mock ISS data for fallback
const MOCK_ISS_DATA = {
  latitude: 51.6416,
  longitude: -0.1919,
  altitude: 408.45,
  velocity: 7.66,
  visibility: 'daylight',
  footprint: 2400,
  timestamp: new Date().toISOString(),
};

export async function getISSPosition() {
  try {
    // Use cache if available and fresh
    const now = Date.now();
    if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('Using cached ISS data');
      return cachedData;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544', {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        
        cachedData = {
          latitude: data.latitude,
          longitude: data.longitude,
          altitude: data.altitude,
          velocity: data.velocity,
          visibility: data.visibility || 'daylight',
          footprint: data.footprint,
          timestamp: data.timestamp,
        };
        lastFetchTime = now;
        console.log('Fetched fresh ISS data from API');
        return cachedData;
      } else if (response.status === 429) {
        console.log('API rate limited, using cached/mock data');
        // Return cached data even if old, or use mock
        return cachedData || MOCK_ISS_DATA;
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.log('API timeout, using cached/mock data');
      }
    }

    // Return cached or mock data on error
    return cachedData || MOCK_ISS_DATA;
  } catch (error) {
    console.error('Error in getISSPosition:', error);
    return cachedData || MOCK_ISS_DATA;
  }
}

export async function getISSPasses(latitude, longitude, passes = 5) {
  try {
    const response = await fetch(
      `https://api.wheretheiss.at/v1/satellites/25544/passes?latitude=${latitude}&longitude=${longitude}&limit=${passes}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch ISS passes');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching ISS passes:', error);
    // Return mock passes data
    return [
      {
        startUTC: Math.floor(Date.now() / 1000) + 3600,
        endUTC: Math.floor(Date.now() / 1000) + 5400,
        maxUTC: Math.floor(Date.now() / 1000) + 4500,
        maxElevation: 72,
      },
      {
        startUTC: Math.floor(Date.now() / 1000) + 86400,
        endUTC: Math.floor(Date.now() / 1000) + 88200,
        maxUTC: Math.floor(Date.now() / 1000) + 87300,
        maxElevation: 45,
      },
    ];
  }
}
