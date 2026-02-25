import React, { useState, useEffect } from 'react';
import SharedNavbar from '../components/SharedNavbar';
import Footer from '../components/Footer';
import { videosApi } from '../services/api';

interface Video {
  _id: string;
  title: string;
  description: string;
  category: string;
  cloudflareVideoId: string;
  thumbnail: string;
  duration: number;
  tags: string[];
  viewCount: number;
  createdAt: string;
}

const CATEGORIES = [
  'All',
  'General',
  'Tutorial',
  'Event',
  'News',
  'Campus Tour',
  'Accommodation',
  'Career',
  'Other',
];

const formatDuration = (seconds: number): string => {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const VideosPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError('');
      const params: Record<string, string> = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (search) params.search = search;
      const res = await videosApi.getVideos(params);
      setVideos(res.data || []);
    } catch {
      setError('Failed to load videos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  return (
    <>
      <SharedNavbar />
      <div className="navbar-spacer" />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-blue-700 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Video Library</h1>
          <p className="text-blue-100 text-lg mb-6">
            Watch campus tours, tutorials, events and more
          </p>
          <form onSubmit={handleSearch} className="flex max-w-md mx-auto gap-2">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search videos…"
              className="flex-1 rounded-lg px-4 py-2 text-gray-900 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white text-primary font-semibold px-5 py-2 rounded-lg text-sm hover:bg-blue-50 transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                activeCategory === cat
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* States */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12 text-red-600">{error}</div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No videos found{search ? ` for "${search}"` : ''}.
          </div>
        )}

        {/* Video grid */}
        {!loading && !error && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer group"
                onClick={() => setSelectedVideo(video)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-900 rounded-t-xl overflow-hidden">
                  <img
                    src={
                      video.thumbnail ||
                      `https://videodelivery.net/${video.cloudflareVideoId}/thumbnails/thumbnail.jpg`
                    }
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/320x180?text=Video';
                    }}
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                    <div className="bg-white bg-opacity-90 rounded-full w-12 h-12 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-primary ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7L8 5z" />
                      </svg>
                    </div>
                  </div>
                  {/* Duration badge */}
                  {video.duration > 0 && (
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">
                      {formatDuration(video.duration)}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <span className="text-xs font-medium text-primary bg-blue-50 px-2 py-0.5 rounded-full">
                    {video.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-2 line-clamp-2 text-sm leading-snug">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {video.viewCount} views ·{' '}
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl">
            {/* Close & title bar */}
            <div className="flex items-center justify-between px-5 py-3 bg-gray-900">
              <h2 className="text-white font-semibold text-sm truncate pr-4">
                {selectedVideo.title}
              </h2>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-white text-2xl leading-none flex-shrink-0"
              >
                ×
              </button>
            </div>

            {/* Cloudflare Stream iframe embed */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={`https://iframe.cloudflarestream.com/${selectedVideo.cloudflareVideoId}?autoplay=true&controls=true&preload=auto`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            {/* Video meta */}
            <div className="bg-gray-900 px-5 py-4">
              <span className="text-xs font-medium text-blue-400 bg-blue-900 bg-opacity-40 px-2 py-0.5 rounded-full">
                {selectedVideo.category}
              </span>
              <h3 className="text-white font-semibold text-base mt-2">
                {selectedVideo.title}
              </h3>
              {selectedVideo.description && (
                <p className="text-gray-400 text-sm mt-1">{selectedVideo.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>{selectedVideo.viewCount} views</span>
                {selectedVideo.duration > 0 && (
                  <span>{formatDuration(selectedVideo.duration)}</span>
                )}
                <span>{new Date(selectedVideo.createdAt).toLocaleDateString()}</span>
              </div>
              {selectedVideo.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {selectedVideo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideosPage;
