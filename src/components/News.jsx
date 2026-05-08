import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Clock, Tag, Loader } from 'lucide-react';
import { getSpaceNews } from '../services/newsService';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const newsData = await getSpaceNews(6);
        setNews(newsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    
    // Refresh news every 5 minutes
    const interval = setInterval(fetchNews, 300000);
    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (date) => {
    try {
      const seconds = Math.floor((new Date() - new Date(date)) / 1000);
      if (seconds < 60) return 'Just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const colors = [
    'from-space-500 to-cosmos-500',
    'from-nebula-500 to-space-500',
    'from-cosmos-500 to-nebula-500',
    'from-space-400 to-nebula-500',
    'from-cosmos-400 to-space-500',
    'from-nebula-400 to-cosmos-500',
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-space-400 to-nebula-500 flex items-center justify-center">
            <Newspaper size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl text-white">
              Space <span className="text-gradient">News</span>
            </h1>
            <p className="text-sm text-slate-400">Latest missions, discoveries &amp; space industry updates</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="animate-spin text-nebula-400 mb-4" size={40} />
            <p className="text-slate-400">Loading latest space news...</p>
          </div>
        ) : error ? (
          <div className="glass-card p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : news.length > 0 ? (
          <>
            {/* Featured (top card) */}
            <div className="glass-card p-6 mb-6 hover:-translate-y-1 transition-transform duration-300 group cursor-pointer animate-fade-in">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-space-500/20 text-space-300 border border-space-500/30">
                      Featured
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock size={11} /> {getTimeAgo(news[0].date)}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-xl text-white mb-2 group-hover:text-gradient transition-all duration-200">
                    {news[0].title}
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {news[0].summary || news[0].description}
                  </p>
                  <a 
                    href={news[0].url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-space-400 font-medium hover:text-space-300"
                  >
                    Read more <ExternalLink size={11} />
                  </a>
                </div>
                {news[0].image && (
                  <img 
                    src={news[0].image}
                    alt={news[0].title}
                    className="hidden sm:block w-24 h-24 rounded-xl object-cover flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </div>
            </div>

            {/* News grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {news.slice(1).map((article, i) => (
                <a
                  key={article.id}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  {/* Image banner */}
                  {article.image ? (
                    <img 
                      src={article.image}
                      alt={article.title}
                      className="w-full h-24 rounded-xl object-cover mb-4 group-hover:opacity-90 transition-opacity"
                    />
                  ) : (
                    <div className={`w-full h-24 rounded-xl bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center mb-4 opacity-30 group-hover:opacity-50 transition-opacity`}>
                      <Newspaper size={32} className="text-white" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-slate-400 border border-white/10">
                      <Tag size={9} />
                      {article.source || 'News'}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-600 ml-auto">
                      <Clock size={9} />
                      {getTimeAgo(article.date)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm text-white mb-2 leading-snug group-hover:text-space-300 transition-colors duration-200 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                    {article.summary || article.description}
                  </p>

                  <span className="inline-flex items-center gap-1 text-xs text-space-400 font-medium group-hover:gap-2 transition-all duration-200">
                    Read more <ExternalLink size={11} />
                  </span>
                </a>
              ))}
            </div>
          </>
        ) : (
          <div className="glass-card p-8 text-center">
            <p className="text-slate-400">No news articles found. Please try again later.</p>
          </div>
        )}

      </div>
    </div>
  );
}
