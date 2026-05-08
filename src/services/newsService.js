// News API service - integrates multiple news sources

const MOCK_NEWS = [
  {
    id: 1,
    title: 'NASA\'s Artemis III Mission on Track for 2026 Lunar Landing',
    summary: 'NASA confirms the crewed Artemis III mission targeting the lunar south pole remains on schedule.',
    source: 'NASA',
    date: new Date(Date.now() - 2 * 3600000).toISOString(),
    category: 'lunar',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&h=300&fit=crop',
    url: '#',
  },
  {
    id: 2,
    title: 'SpaceX Starship Completes Orbital Test Flight Successfully',
    summary: 'SpaceX\'s fully integrated Starship vehicle completed its first successful orbital test.',
    source: 'SpaceX',
    date: new Date(Date.now() - 5 * 3600000).toISOString(),
    category: 'launch',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500&h=300&fit=crop',
    url: '#',
  },
  {
    id: 3,
    title: 'James Webb Telescope Reveals Earliest Galaxies',
    summary: 'New JWST images push back the known frontier of galaxy formation.',
    source: 'JWST',
    date: new Date(Date.now() - 8 * 3600000).toISOString(),
    category: 'astronomy',
    image: 'https://images.unsplash.com/photo-1462332420958-a05d1e7413413?w=500&h=300&fit=crop',
    url: '#',
  },
  {
    id: 4,
    title: 'ESA\'s Mars Express Detects Subglacial Lake Signals',
    summary: 'Fresh radar data strengthens evidence of liquid water beneath Mars\'s south pole.',
    source: 'ESA',
    date: new Date(Date.now() - 12 * 3600000).toISOString(),
    category: 'mars',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500&h=300&fit=crop',
    url: '#',
  },
  {
    id: 5,
    title: 'India\'s Gaganyaan Crew Module Passes Safety Tests',
    summary: 'ISRO\'s human spaceflight programme crosses a key milestone.',
    source: 'ISRO',
    date: new Date(Date.now() - 24 * 3600000).toISOString(),
    category: 'missions',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&h=300&fit=crop',
    url: '#',
  },
  {
    id: 6,
    title: 'Voyager 1 Resumes Sending Science Data After Glitch',
    summary: 'NASA engineers successfully restored Voyager 1\'s full science data return.',
    source: 'NASA',
    date: new Date(Date.now() - 48 * 3600000).toISOString(),
    category: 'deep-space',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=500&h=300&fit=crop',
    url: '#',
  },
];

export async function getSpaceNews(limit = 10) {
  try {
    // Try multiple news APIs in order of preference
    
    // Option 1: Try NewsAPI with space keywords
    try {
      const newsApiKey = import.meta.env.VITE_NEWS_API_KEY;
      if (newsApiKey) {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=space+NASA+SpaceX+astronomy&sortBy=publishedAt&language=en&pageSize=${limit}&apiKey=${newsApiKey}`,
          { signal: AbortSignal.timeout(5000) }
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.articles && data.articles.length > 0) {
            return data.articles.slice(0, limit).map(article => ({
              id: article.url,
              title: article.title,
              summary: article.description || article.content?.substring(0, 200),
              source: article.source.name,
              date: article.publishedAt,
              category: 'news',
              image: article.urlToImage || 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&h=300&fit=crop',
              url: article.url,
            }));
          }
        }
      }
    } catch (error) {
      console.log('NewsAPI unavailable, trying alternative...');
    }

    // Option 2: Try SpaceNews API
    try {
      const response = await fetch(
        'https://api.spaceflightnewsapi.net/v4/articles/?limit=' + limit,
        { signal: AbortSignal.timeout(5000) }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results.slice(0, limit).map(article => ({
            id: article.id,
            title: article.title,
            summary: article.summary,
            source: article.news_site || 'SpaceNews',
            date: article.published_at,
            category: article.type || 'news',
            image: article.image_url || 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500&h=300&fit=crop',
            url: article.url,
          }));
        }
      }
    } catch (error) {
      console.log('SpaceNews API unavailable');
    }

    // Fallback: Return mock data
    console.log('Using mock news data');
    return MOCK_NEWS.slice(0, limit);

  } catch (error) {
    console.error('Error fetching news:', error);
    return MOCK_NEWS.slice(0, limit);
  }
}

export async function getNewsByCategory(category, limit = 5) {
  try {
    const allNews = await getSpaceNews(50);
    return allNews.filter(article => 
      article.category.includes(category) || article.source.toLowerCase().includes(category)
    ).slice(0, limit);
  } catch (error) {
    console.error('Error filtering news:', error);
    return MOCK_NEWS.filter(n => n.category === category).slice(0, limit);
  }
}
