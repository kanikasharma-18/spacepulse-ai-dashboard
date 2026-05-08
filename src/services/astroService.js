// Service to fetch current people in space
const ASTROS_API = 'http://api.open-notify.org/astros.json';

export async function getAstronauts() {
  try {
    const response = await fetch(ASTROS_API);
    if (!response.ok) throw new Error('Failed to fetch astronauts');
    const data = await response.json();
    
    // Filter for people on the ISS
    const issPeople = data.people.filter(p => p.craft === 'ISS');
    return {
      count: issPeople.length,
      names: issPeople.map(p => p.name).join(', '),
      all: issPeople
    };
  } catch (error) {
    console.error('Error fetching astronauts:', error);
    // Fallback to latest known crew (Expedition 71/72 era)
    return {
      count: 7,
      names: 'Oleg Kononenko, Nikolai Chub, Tracy Dyson, Matthew Dominick, Michael Barratt, Jeanette Epps, Alexander Grebenkin',
      all: []
    };
  }
}
