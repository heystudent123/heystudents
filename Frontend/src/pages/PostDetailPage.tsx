import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SharedNavbar from '../components/SharedNavbar';

/* ─── Types ───────────────────────────────────────────────────────────────── */
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

/* ─── Tag config ──────────────────────────────────────────────────────────── */
const TAG_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
  announcement: { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',  label: 'Announcement' },
  resource:     { bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200',    label: 'Resource'     },
  assignment:   { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200', label: 'Assignment'   },
  update:       { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200',label: 'Update'       },
  general:      { bg: 'bg-stone-100',  text: 'text-stone-600',   border: 'border-stone-200',  label: 'General'      },
};

/* ─── Section label component ─────────────────────────────────────────────── */
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-gray-400 mb-4 flex items-center gap-2">
    {children}
  </p>
);

/* ─── Page entry animation hook ───────────────────────────────────────────── */
const usePageReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  return ref;
};

/* ══════════════════════════════════════════════════════════════════════════
   POST DETAIL PAGE
══════════════════════════════════════════════════════════════════════════ */
const PostDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state?.post as Post | undefined;
  const [lightbox, setLightbox] = useState<string | null>(null);
  const pageRef = usePageReveal();

  /* ── Not found ──────────────────────────────────────────────────────── */
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAF7F0' }}>
        <div className="text-center">
          <p className="text-gray-400 mb-6 text-lg font-medium">Post not found.</p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="px-6 py-2.5 bg-amber-400 text-black rounded-xl font-bold text-sm hover:bg-amber-500 transition-colors"
          >
            ← Back to Dashboard
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

  const tag     = TAG_CONFIG[post.tag] ?? TAG_CONFIG.general;

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: '#FAF7F0' }}>
      <style>{`
        @keyframes playPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,166,35,0.35); }
          50%       { box-shadow: 0 0 0 12px rgba(245,166,35,0); }
        }
        .play-btn { animation: playPulse 2.4s ease-in-out infinite; }
        .play-btn:hover { transform: scale(1.12) !important; }
        .doc-row { transition: background 0.22s ease, box-shadow 0.22s ease; }
        .doc-row:hover { background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
      `}</style>

      <SharedNavbar />

      <div ref={pageRef} className="pt-24 pb-20 px-4">
        <div className="max-w-[780px] mx-auto">

          {/* ── Back link ────────────────────────────────────────────── */}
          <button
            onClick={() => navigate('/student/dashboard')}
            className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors duration-200"
            style={{ color: '#888' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1a1a1a')}
            onMouseLeave={e => (e.currentTarget.style.color = '#888')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          {/* ── Main Post Card ───────────────────────────────────────── */}
          <article
            className="bg-white overflow-hidden"
            style={{ borderRadius: 24, boxShadow: '0 4px 40px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            {/* Cover image */}
            {post.coverImage && (
              <div className="overflow-hidden" style={{ borderRadius: '24px 24px 0 0' }}>
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full object-cover"
                  style={{ maxHeight: 320 }}
                />
              </div>
            )}

            {/* ── POST HEADER ─────────────────────────────────────────── */}
            <div
              className="px-8 pt-10 pb-8"
              style={{ borderBottom: '1px solid #F2EDE0' }}
            >
              {/* Badge row + date */}
              <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize border ${tag.bg} ${tag.text} ${tag.border}`}
                    style={{ fontFamily: "'Montserrat','Inter',sans-serif", letterSpacing: '0.06em' }}
                  >
                    {tag.label}
                  </span>
                  {post.isPinned && (
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200"
                      style={{ fontFamily: "'Montserrat','Inter',sans-serif", letterSpacing: '0.06em' }}>
                      Pinned
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400" style={{ fontFamily: "'DM Sans','Inter',sans-serif" }}>
                  {dateStr}
                </span>
              </div>

              {/* Post title */}
              <h1
                className="text-3xl font-extrabold text-zinc-900 leading-tight mb-5"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '-0.5px' }}
              >
                {post.title}
              </h1>

              {/* Post body */}
              <p
                className="text-base leading-relaxed whitespace-pre-line"
                style={{ color: '#555', fontFamily: "'DM Sans','Inter',sans-serif", lineHeight: 1.8 }}
              >
                {post.content}
              </p>
            </div>

            {/* ── VIDEOS ──────────────────────────────────────────────── */}
            {videos.length > 0 && (
              <div className="px-8 py-8" style={{ borderBottom: '1px solid #F2EDE0' }}>
                <SectionLabel>Videos</SectionLabel>
                <div className="space-y-5">
                  {videos.map((att, i) => {
                    const videoId = att.cloudflareVideoId || att.url?.split('/').pop();
                    return (
                      <div key={i} className="overflow-hidden" style={{ borderRadius: 16 }}>
                        <div className="relative bg-[#1a1a1a]" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            src={`https://iframe.cloudflarestream.com/${videoId}`}
                            title={att.label || `Video ${i + 1}`}
                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full border-0"
                          />
                        </div>
                        {att.label && att.label !== videoId && (
                          <p
                            className="px-5 py-3 text-xs truncate"
                            style={{ background: '#111', color: '#888', fontFamily: "'DM Sans','Inter',sans-serif" }}
                          >
                            {att.label}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── IMAGES ──────────────────────────────────────────────── */}
            {images.length > 0 && (
              <div className="px-8 py-8" style={{ borderBottom: '1px solid #F2EDE0' }}>
                <SectionLabel>Images</SectionLabel>
                <div className={`grid gap-3 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {images.map((att, i) => (
                    <div
                      key={i}
                      onClick={() => setLightbox(att.url)}
                      className="relative cursor-zoom-in group bg-gray-100"
                      style={{ borderRadius: 16, overflow: 'hidden', maxHeight: 460 }}
                    >
                      <img
                        src={att.url}
                        alt={att.label || `Image ${i + 1}`}
                        className="w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        style={{ maxHeight: 460 }}
                      />
                      {/* "View full" overlay */}
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span
                          className="text-white text-xs font-semibold px-3 py-1 rounded-full"
                          style={{ background: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(6px)' }}
                        >
                          View full
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── DOCUMENTS ───────────────────────────────────────────── */}
            {documents.length > 0 && (
              <div className="px-8 py-8">
                <SectionLabel>Documents</SectionLabel>
                <div className="space-y-2.5">
                  {documents.map((att, i) => {
                    const ext = att.label?.split('.').pop()?.toUpperCase() ?? 'FILE';
                    const iconColor =
                      ext === 'PDF'                          ? '#C62828' :
                      ext === 'DOCX' || ext === 'DOC'       ? '#1565C0' :
                      ext === 'XLSX' || ext === 'XLS'       ? '#2E7D32' :
                      ext === 'PPTX' || ext === 'PPT'       ? '#D84315' : '#37474F';
                    const extLabel =
                      ext === 'PDF'  ? 'PDF' :
                      ext === 'DOCX' ? 'Word Doc' :
                      ext === 'XLSX' ? 'Spreadsheet' :
                      ext === 'PPTX' ? 'Presentation' : ext;
                    return (
                      <a
                        key={i}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="doc-row flex items-center gap-4 cursor-pointer"
                        style={{
                          background: '#FAF7F0',
                          border: '1px solid #EDE8DE',
                          borderRadius: 14,
                          padding: '16px 20px',
                          textDecoration: 'none',
                        }}
                      >
                        {/* Icon square */}
                        <div
                          className="flex-shrink-0 flex items-center justify-center"
                          style={{
                            width: 42, height: 42,
                            borderRadius: 10,
                            background: iconColor,
                          }}
                        >
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </div>

                        {/* File info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-bold truncate"
                            style={{ color: '#1a1a1a', fontFamily: "'DM Sans','Inter',sans-serif" }}
                          >
                            {att.label || 'Document'}
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: '#888', fontFamily: "'DM Sans','Inter',sans-serif" }}
                          >
                            {extLabel} · Click to open
                          </p>
                        </div>

                        {/* Arrow */}
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="#aaa" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </article>

          {/* Spacer */}
          <div className="h-4" />
        </div>
      </div>



      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.92)' }}
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt="Full view"
            className="max-w-full max-h-[90vh] shadow-2xl"
            style={{ borderRadius: 16 }}
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 flex items-center justify-center w-9 h-9 rounded-full transition-colors duration-200"
            style={{ background: 'rgba(255,255,255,0.15)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;
