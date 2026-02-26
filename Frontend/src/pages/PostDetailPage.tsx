import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SharedNavbar from '../components/SharedNavbar';

/* ─── FULL REDESIGN ─────────────────────────────────────────────────────────
   Open layout — no wrapping box. Order: header → images (carousel) →
   documents → videos.
────────────────────────────────────────────────────────────────────────── */

/* ─── Types ────────────────────────────────────────────────────────────────── */
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

/* ─── Tag config ─────────────────────────────────────────────────────────── */
const TAG_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
  announcement: { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',  label: 'Announcement' },
  resource:     { bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200',    label: 'Resource'     },
  assignment:   { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200', label: 'Assignment'   },
  update:       { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200',label: 'Update'       },
  general:      { bg: 'bg-stone-100',  text: 'text-stone-600',   border: 'border-stone-200',  label: 'General'      },
};

/* ─── Divider ───────────────────────────────────────────────────────────── */
const Divider = () => (
  <hr style={{ border: 'none', borderTop: '1px solid #EDE8DE', margin: '0' }} />
);

/* ─── Section heading ───────────────────────────────────────────────────── */
const SectionHeading: React.FC<{ icon: string; children: React.ReactNode }> = ({ icon, children }) => (
  <div className="flex items-center gap-2 mb-5">
    <span className="text-lg">{icon}</span>
    <span
      className="text-xs font-bold uppercase tracking-widest"
      style={{ color: '#aaa', fontFamily: "'Montserrat','Inter',sans-serif" }}
    >
      {children}
    </span>
  </div>
);

/* ─── Page entry animation hook ─────────────────────────────────────────── */
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
  const navigate  = useNavigate();
  const location  = useLocation();
  const post      = location.state?.post as Post | undefined;
  const [imgIdx, setImgIdx]     = useState(0);
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

  const tag = TAG_CONFIG[post.tag] ?? TAG_CONFIG.general;

  /* ── Carousel helpers ───────────────────────────────────────────────── */
  const prevImg = () => setImgIdx((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIdx((i) => (i + 1) % images.length);

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: '#FAF7F0' }}>
      <SharedNavbar />

      <div ref={pageRef} className="pt-24 pb-24 px-4">
        <div className="max-w-[700px] mx-auto">

          {/* ── Back link ─────────────────────────────────────────────── */}
          <button
            onClick={() => navigate('/student/dashboard')}
            className="inline-flex items-center gap-1.5 text-sm font-medium mb-10 transition-colors duration-200"
            style={{ color: '#aaa', fontFamily: "'DM Sans','Inter',sans-serif" }}
            onMouseEnter={e => (e.currentTarget.style.color = '#1a1a1a')}
            onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>

          {/* ══ HEADER ══════════════════════════════════════════════════ */}
          <div className="pb-8">
            {/* Badges + date */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize border ${tag.bg} ${tag.text} ${tag.border}`}
                  style={{ fontFamily: "'Montserrat','Inter',sans-serif", letterSpacing: '0.06em' }}
                >
                  {tag.label}
                </span>
                {post.isPinned && (
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200"
                    style={{ fontFamily: "'Montserrat','Inter',sans-serif", letterSpacing: '0.06em' }}
                  >
                    📌 Pinned
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-400" style={{ fontFamily: "'DM Sans','Inter',sans-serif" }}>
                {dateStr}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-4xl font-extrabold text-zinc-900 leading-tight mb-5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '-0.5px' }}
            >
              {post.title}
            </h1>

            {/* Cover image */}
            {post.coverImage && (
              <div className="mb-6 overflow-hidden rounded-2xl">
                <img src={post.coverImage} alt={post.title} className="w-full object-cover" style={{ maxHeight: 340 }} />
              </div>
            )}

            {/* Body text */}
            <p
              className="text-base leading-relaxed whitespace-pre-line"
              style={{ color: '#555', fontFamily: "'DM Sans','Inter',sans-serif", lineHeight: 1.85 }}
            >
              {post.content}
            </p>
          </div>

          {/* ══ IMAGES ══════════════════════════════════════════════════ */}
          {images.length > 0 && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid #EDE8DE' }} />
              <div className="py-8">
                <SectionHeading icon="🖼️">Images</SectionHeading>

                {images.length === 1 ? (
                  /* Single image */
                  <div
                    className="relative cursor-zoom-in group overflow-hidden rounded-2xl bg-gray-100"
                    onClick={() => setLightbox(images[0].url)}
                  >
                    <img
                      src={images[0].url}
                      alt={images[0].label || 'Image'}
                      className="w-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      style={{ maxHeight: 480 }}
                    />
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-semibold px-3 py-1 rounded-full"
                        style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}>
                        View full
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Carousel */
                  <div>
                    <div className="relative overflow-hidden rounded-2xl bg-gray-100">
                      {/* Main image */}
                      <img
                        src={images[imgIdx].url}
                        alt={images[imgIdx].label || `Image ${imgIdx + 1}`}
                        className="w-full object-cover cursor-zoom-in"
                        style={{ maxHeight: 480 }}
                        onClick={() => setLightbox(images[imgIdx].url)}
                      />

                      {/* Prev arrow */}
                      <button
                        onClick={prevImg}
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
                        style={{ background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(4px)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.75)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.50)')}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {/* Next arrow */}
                      <button
                        onClick={nextImg}
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200"
                        style={{ background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(4px)' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.75)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.50)')}
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>

                      {/* Counter */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                        <span
                          className="text-white text-xs font-bold px-3 py-1 rounded-full"
                          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
                        >
                          {imgIdx + 1} / {images.length}
                        </span>
                      </div>
                    </div>

                    {/* Thumbnail strip */}
                    <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setImgIdx(i)}
                          className="flex-shrink-0 overflow-hidden transition-all duration-200"
                          style={{
                            width: 64, height: 52, borderRadius: 10,
                            border: i === imgIdx ? '2.5px solid #F5A623' : '2px solid transparent',
                            opacity: i === imgIdx ? 1 : 0.5,
                          }}
                        >
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    {/* Caption */}
                    {images[imgIdx].label && (
                      <p className="mt-2 text-xs text-center text-gray-400"
                        style={{ fontFamily: "'DM Sans','Inter',sans-serif" }}>
                        {images[imgIdx].label}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ══ DOCUMENTS ═══════════════════════════════════════════════ */}
          {documents.length > 0 && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid #EDE8DE' }} />
              <div className="py-8">
                <SectionHeading icon="📄">Documents</SectionHeading>
                <div className="space-y-3">
                  {documents.map((att, i) => {
                    const ext = att.label?.split('.').pop()?.toUpperCase() ?? 'FILE';
                    const iconColor =
                      ext === 'PDF'                    ? '#C62828' :
                      ext === 'DOCX' || ext === 'DOC'  ? '#1565C0' :
                      ext === 'XLSX' || ext === 'XLS'  ? '#2E7D32' :
                      ext === 'PPTX' || ext === 'PPT'  ? '#D84315' : '#37474F';
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
                        className="flex items-center gap-4 group"
                        style={{
                          background: '#fff',
                          border: '1px solid #EDE8DE',
                          borderRadius: 16,
                          padding: '16px 20px',
                          textDecoration: 'none',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                          transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                          display: 'flex',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.09)';
                          (e.currentTarget as HTMLElement).style.borderColor = '#d4cabc';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                          (e.currentTarget as HTMLElement).style.borderColor = '#EDE8DE';
                        }}
                      >
                        <div
                          className="flex-shrink-0 flex items-center justify-center"
                          style={{ width: 44, height: 44, borderRadius: 12, background: iconColor }}
                        >
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate text-[#1a1a1a]"
                            style={{ fontFamily: "'DM Sans','Inter',sans-serif" }}>
                            {att.label || 'Document'}
                          </p>
                          <p className="text-xs mt-0.5 text-gray-400"
                            style={{ fontFamily: "'DM Sans','Inter',sans-serif" }}>
                            {extLabel} · Click to open
                          </p>
                        </div>
                        <svg className="w-4 h-4 flex-shrink-0 text-gray-300 group-hover:text-amber-500 transition-colors duration-200"
                          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </a>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ══ VIDEOS ══════════════════════════════════════════════════ */}
          {videos.length > 0 && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid #EDE8DE' }} />
              <div className="py-8">
                <SectionHeading icon="🎬">Videos</SectionHeading>
                <div className="space-y-6">
                  {videos.map((att, i) => {
                    const videoId = att.cloudflareVideoId || att.url?.split('/').pop();
                    return (
                      <div key={i}>
                        {att.label && att.label !== videoId && (
                          <p className="text-sm font-semibold text-[#1a1a1a] mb-2"
                            style={{ fontFamily: "'DM Sans','Inter',sans-serif" }}>
                            {att.label}
                          </p>
                        )}
                        <div
                          className="overflow-hidden rounded-2xl"
                          style={{ background: '#111', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
                        >
                          <div className="relative" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                              src={`https://iframe.cloudflarestream.com/${videoId}`}
                              title={att.label || `Video ${i + 1}`}
                              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                              allowFullScreen
                              className="absolute inset-0 w-full h-full border-0"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* ── Lightbox ────────────────────────────────────────────────────── */}
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

