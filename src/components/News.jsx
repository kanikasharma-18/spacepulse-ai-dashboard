import { Newspaper, ExternalLink, Clock, Tag } from 'lucide-react';

const dummyNews = [
  {
    id: 1,
    title: 'NASA\'s Artemis III Mission on Track for 2026 Lunar Landing',
    summary: 'NASA confirms the crewed Artemis III mission targeting the lunar south pole remains on schedule.',
    tag: 'NASA',
    time: '2h ago',
    color: 'from-space-500 to-cosmos-500',
  },
  {
    id: 2,
    title: 'SpaceX Starship Completes Orbital Test Flight Successfully',
    summary: 'SpaceX\'s fully integrated Starship vehicle completed its first successful orbital test, splashing down on target.',
    tag: 'SpaceX',
    time: '5h ago',
    color: 'from-nebula-500 to-space-500',
  },
  {
    id: 3,
    title: 'James Webb Telescope Reveals Earliest Galaxies in the Universe',
    summary: 'New JWST images push back the known frontier of galaxy formation to just 300 million years after the Big Bang.',
    tag: 'JWST',
    time: '8h ago',
    color: 'from-cosmos-500 to-nebula-500',
  },
  {
    id: 4,
    title: 'ESA\'s Mars Express Detects Subglacial Lake Signals',
    summary: 'The European Space Agency reports fresh radar data strengthening evidence of liquid water beneath Mars\'s south pole.',
    tag: 'ESA',
    time: '12h ago',
    color: 'from-space-400 to-nebula-500',
  },
  {
    id: 5,
    title: 'India\'s Gaganyaan Crew Module Passes Critical Safety Tests',
    summary: 'ISRO\'s human spaceflight programme crosses a key milestone as its crew module survives extreme abort scenario tests.',
    tag: 'ISRO',
    time: '1d ago',
    color: 'from-cosmos-400 to-space-500',
  },
  {
    id: 6,
    title: 'Voyager 1 Resumes Sending Usable Science Data After Glitch',
    summary: 'After months of corrupted transmissions, NASA engineers successfully restored Voyager 1\'s full science data return.',
    tag: 'Deep Space',
    time: '2d ago',
    color: 'from-nebula-400 to-cosmos-500',
  },
];

export default function News() {
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

        {/* Featured (top card) */}
        <div className="glass-card p-6 mb-6 hover:-translate-y-1 transition-transform duration-300 group cursor-pointer animate-fade-in">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-space-500/20 text-space-300 border border-space-500/30">
                  Featured
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock size={11} /> Just now
                </span>
              </div>
              <h2 className="font-display font-bold text-xl text-white mb-2 group-hover:text-gradient transition-all duration-200">
                {dummyNews[0].title}
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">{dummyNews[0].summary}</p>
              <span className="inline-flex items-center gap-1.5 text-xs text-space-400 font-medium">
                Read more <ExternalLink size={11} />
              </span>
            </div>
            <div className={`hidden sm:flex w-24 h-24 rounded-xl bg-gradient-to-br ${dummyNews[0].color} flex-shrink-0 items-center justify-center opacity-60`}>
              <Newspaper size={32} className="text-white" />
            </div>
          </div>
        </div>

        {/* News grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dummyNews.slice(1).map((article, i) => (
            <div
              key={article.id}
              className="glass-card p-5 hover:-translate-y-1 transition-all duration-300 group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Icon banner */}
              <div className={`w-full h-24 rounded-xl bg-gradient-to-br ${article.color} flex items-center justify-center mb-4 opacity-30 group-hover:opacity-50 transition-opacity`}>
                <Newspaper size={32} className="text-white" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-slate-400 border border-white/10">
                  <Tag size={9} />
                  {article.tag}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-600 ml-auto">
                  <Clock size={9} />
                  {article.time}
                </span>
              </div>

              <h3 className="font-semibold text-sm text-white mb-2 leading-snug group-hover:text-space-300 transition-colors duration-200 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">{article.summary}</p>

              <span className="inline-flex items-center gap-1 text-xs text-space-400 font-medium group-hover:gap-2 transition-all duration-200">
                Read more <ExternalLink size={11} />
              </span>
            </div>
          ))}
        </div>

        {/* Load more placeholder */}
        <div className="mt-10 text-center">
          <button className="btn-secondary text-sm">
            Load More Articles
          </button>
        </div>

      </div>
    </div>
  );
}
