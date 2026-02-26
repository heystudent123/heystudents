import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SharedNavbar from '../components/SharedNavbar';

interface Attachment {
  label: string;
  url: string;
  type?: 'image' | 'document' | 'video';
  cloudflareVideoId?: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  courseSlug: string;
  tag: string;
  isPinned: boolean;
  isPublished: boolean;
  attachments: Attachment[];
  coverImage?: string;
  createdAt: string;
}

const TAG_COLORS: Record<string, string> = {
  announcement: 'bg-red-100 text-red-700',
  resource: 'bg-blue-100 text-blue-700',
  assignment: 'bg-purple-100 text-purple-700',
  update: 'bg-green-100 text-green-700',
  general: 'bg-gray-100 text-gray-600',
};

const TAG_ICONS: Record<string, string> = {
  announcement: '📢',
  resource: '📚',
  assignment: '📝',
  update: '🔄',
  general: '💬',
};

const PostDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state?.post as Post | undefined;
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fff9ed] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Post not found.</p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-5 py-2 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const images    = post.attachments?.filter((a) => a.type === 'image') ?? [];
  const videos    = post.attachments?.filter((a) => a.type === 'video' || a.cloudflareVideoId) ?? [];
  const documents = post.attachments?.filter((a) => a.type === 'document') ?? [];

  const dateStr = new Date(post.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#fff9ed]">
      <SharedNavbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Back */}
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-amber-600 font-medium mb-6 transition-colors"
          >
            ← Back to Dashboard
          </button>

          {/* Card */}
          <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

            {/* Cover image */}
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-52 object-cover"
              />
            )}

            <div className="p-6 md:p-8">
              {/* Tag + date */}
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${TAG_COLORS[post.tag] || TAG_COLORS.general}`}>
                    {TAG_ICONS[post.tag]} {post.tag}
                  </span>
                  {post.isPinned && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full font-medium">
                      📌 Pinned
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{dateStr}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug mb-5">
                {post.title}
              </h1>

              {/* Divider */}
              <div className="h-px bg-gray-100 mb-5" />

              {/* Content */}
              <p className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
                {post.content}
              </p>

              {/* ── Videos ── */}
              {videos.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    🎥 Videos
                  </h2>
                  <div className="space-y-5">
                    {videos.map((att, i) => {
                      const videoId = att.cloudflareVideoId || att.url.split('/').pop();
                      return (
                        <div key={i} className="rounded-2xl overflow-hidden bg-black shadow-md">
                          <div className="relative" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                              src={`https://iframe.cloudflarestream.com/${videoId}`}
                              title={att.label || `Video ${i + 1}`}
                              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                              allowFullScreen
                              className="absolute inset-0 w-full h-full border-0"
                            />
                          </div>
                          {att.label && att.label !== videoId && (
                            <p className="px-4 py-2.5 text-xs text-gray-400 bg-gray-950 truncate">
                              {att.label}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* ── Images ── */}
              {images.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    🖼️ Images
                  </h2>
                  <div className={`grid gap-3 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {images.map((att, i) => (
                      <div
                        key={i}
                        onClick={() => setLightbox(att.url)}
                        className="relative rounded-2xl overflow-hidden cursor-zoom-in group aspect-video bg-gray-100"
                      >
                        <img
                          src={att.url}
                          alt={att.label || `Image ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-end p-2">
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs bg-black/50 px-2 py-0.5 rounded-full">
                            View full
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── Documents ── */}
              {documents.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    📄 Documents
                  </h2>
                  <div className="space-y-2">
                    {documents.map((att, i) => {
                      const ext = att.label?.split('.').pop()?.toUpperCase() || 'FILE';
                      const icon =
                        ext === 'PDF' ? '📕' :
                        ext === 'DOCX' || ext === 'DOC' ? '📘' :
                        ext === 'XLSX' || ext === 'XLS' ? '📗' :
                        ext === 'PPTX' || ext === 'PPT' ? '📙' : '📄';
                      return (
                        <a
                          key={i}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-2xl transition-all group"
                        >
                          <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                            {icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-amber-700 transition-colors">
                              {att.label || 'Document'}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{ext} · Click to open</p>
                          </div>
                          <span className="text-gray-400 group-hover:text-amber-500 text-lg flex-shrink-0 transition-colors">↗</span>
                        </a>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          </article>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Full view"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 w-9 h-9 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;
