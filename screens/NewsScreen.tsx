
import React, { useState, useEffect } from 'react';
import { Share2, Bookmark, Heart, ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { fetchPiNetworkNews, getRelativeTime, categorizeNews, type NewsItem } from '../utils/newsApi';

const NewsScreen: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [visibleCount, setVisibleCount] = useState(5);
  const observerTarget = React.useRef<HTMLDivElement>(null);

  // Fetch news on component mount
  useEffect(() => {
    loadNews();
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && news.length > visibleCount) {
          // Add a small delay for better UX
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 5, news.length));
          }, 500);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [news.length, visibleCount]);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching Pi Network news from API...', new Date().toLocaleTimeString());
      // Fetch more items to support scrolling (up to 50)
      const response = await fetchPiNetworkNews(50);

      if (response.status === 'ok') {
        setNews(response.items);
        setLastUpdated(new Date());
        setVisibleCount(5); // Reset visible count on reload
        console.log('✅ News loaded successfully:', response.items.length, 'articles');
        console.log('📰 Latest article:', response.items[0]?.title);
      } else {
        setError(response.error || 'Failed to load news');
        console.error('❌ Failed to load news:', response.error);
      }
    } catch (err) {
      setError('Unable to fetch news. Please try again.');
      console.error('❌ Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNews();
    setRefreshing(false);
  };

  // Show loading state (initial)
  if (loading && news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-sm text-gray-400">Loading latest Pi Network news...</p>
      </div>
    );
  }

  // Show error state
  if (error && news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-red-400 text-center">
          <p className="text-sm mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-bold hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const displayedNews = news.slice(0, visibleCount);
  const hasMore = visibleCount < news.length;

  return (
    <div className="space-y-6 pt-2 animate-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">News Feed</h2>
        <div className="flex space-x-2 items-center">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="text-gray-400 hover:text-orange-500 transition-colors disabled:opacity-50"
            title="Refresh news"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button className="text-[10px] px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-gray-500 dark:text-gray-400 font-bold">LATEST</button>
          <button className="text-[10px] px-3 py-1 bg-orange-500 text-white rounded-full font-bold">LIVE</button>
        </div>
      </div>

      {lastUpdated && (
        <div className="text-center">
          <p className="text-[10px] text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()} • {lastUpdated.toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {displayedNews.map((item, index) => {
          const category = categorizeNews(item.title, item.description);
          const relativeTime = getRelativeTime(item.pubDate);

          return (
            <div key={`${item.title}-${index}`} className="glass-card rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 transition-transform active:scale-[0.98]">
              <div className="relative h-44 overflow-hidden bg-gradient-to-br from-orange-500/20 to-purple-500/20">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('fallback-bg');
                    }}
                  />
                ) : null}

                {/* Fallback or if image hidden */}
                <div className={`absolute inset-0 flex items-center justify-center -z-10 ${!item.thumbnail ? '' : 'hidden fallback-visible'}`}>
                  <div className="text-6xl opacity-20">π</div>
                </div>

                <style>{`
                  .fallback-bg .fallback-visible {
                    display: flex !important;
                    z-index: 0;
                  }
                `}</style>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-orange-400 border border-orange-500/30 uppercase">
                    {category}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  <span>{relativeTime}</span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-orange-400 transition-colors"
                  >
                    <ExternalLink size={10} className="mr-1" /> {item.source}
                  </a>
                </div>

                <h3 className="text-lg font-bold leading-tight line-clamp-2">{item.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{item.description}</p>

                <div className="pt-4 flex justify-between items-center border-t border-white/5">
                  <div className="flex space-x-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-400 transition-colors">
                      <Heart size={16} />
                      <span className="text-[10px]">Like</span>
                    </button>
                    <button
                      onClick={() => window.open(item.link, '_blank')}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors shadow-lg shadow-orange-500/20"
                    >
                      <ExternalLink size={14} />
                      <span className="text-[10px] font-bold">Open</span>
                    </button>
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: item.title,
                            url: item.link
                          });
                        }
                      }}
                      className="flex items-center space-x-1 text-gray-500 hover:text-cyan-400 transition-colors"
                    >
                      <Share2 size={16} />
                      <span className="text-[10px]">Share</span>
                    </button>
                  </div>
                  <button className="text-gray-500 hover:text-orange-400 transition-colors">
                    <Bookmark size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div ref={observerTarget} className="text-center py-6 space-y-2">
        {hasMore ? (
          <div className="flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            <p className="text-xs text-gray-500 animate-pulse">Loading more news...</p>
          </div>
        ) : (
          displayedNews.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600">You've reached the end of the news feed.</p>
              <button
                onClick={handleRefresh}
                className="text-xs text-orange-500 hover:text-orange-400 font-bold"
              >
                Refresh for updates
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NewsScreen;
