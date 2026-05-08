// ISS Position and tracking API service

export async function getISSPosition() {
  try {
    const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
    
    if (!response.ok) {
      throw new Error('Failed to fetch ISS position');
    }

    const data = await response.json();
    
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      altitude: data.altitude,
      velocity: data.velocity,
      visibility: data.visibility,
      footprint: data.footprint,
      timestamp: data.timestamp,
    };
  } catch (error) {
    console.error('Error fetching ISS position:', error);
    throw error;
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
    throw error;
  }
}
