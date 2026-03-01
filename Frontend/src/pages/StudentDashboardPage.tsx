import React, { useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth as useClerkAuth } from '@clerk/clerk-react';
import SharedNavbar from '../components/SharedNavbar';
import { enrollmentsApi, postsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ─── Font helpers ────────────────────────────────────────────────────────── */
const serif: React.CSSProperties = { fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif" };
const label: React.CSSProperties = { fontFamily: "'Montserrat', 'Inter', sans-serif", letterSpacing: '0.1em' };
const body: React.CSSProperties  = { fontFamily: "'DM Sans', 'Inter', sans-serif" };

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
  tag: 'announcement' | 'resource' | 'assignment' | 'update' | 'general';
  isPinned: boolean;
  isPublished: boolean;
  attachments: Attachment[];
  folders?: { name: string; attachments: Attachment[] }[];
  coverImage?: string;
  createdAt: string;
  publishedBy?: { name?: string; email?: string };
}

/* ─── Tag config ──────────────────────────────────────────────────────────── */
const TAG_COLORS: Record<string, string> = {
  announcement: 'bg-amber-50 text-amber-700 border border-amber-200',
  resource:     'bg-sky-50 text-sky-700 border border-sky-200',
  assignment:   'bg-violet-50 text-violet-700 border border-violet-200',
  update:       'bg-emerald-50 text-emerald-700 border border-emerald-200',
  general:      'bg-stone-100 text-stone-600 border border-stone-200',
};

/* ─── Animation helpers ───────────────────────────────────────────────────── */
/** Fades + slides up when entering the viewport */
const FadeUp: React.FC<{ children: ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return (
    <div
      ref={ref}
      className={className}
      style={{ opacity: 0, transform: 'translateY(28px)', transition: 'opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1)' }}
    >
      {children}
    </div>
  );
};

// Keep backward compat alias
const FadeIn = FadeUp;

/* ══════════════════════════════════════════════════════════════════════════
   STUDENT DASHBOARD
══════════════════════════════════════════════════════════════════════════ */
const StudentDashboardPage: React.FC = () => {
  const { user, loading: authLoading, updateUserProfile } = useAuth();
  const { isSignedIn } = useClerkAuth();
  const navigate = useNavigate();

  const [enrollmentChecked, setEnrollmentChecked] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [, setCourseSlug] = useState('');
  const [courseName, setCourseName] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState('');

  // Profile completion modal
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileWhatsapp, setProfileWhatsapp] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const checkEnrollmentAndFetch = useCallback(async () => {
    let slug = '';
    try {
      const res = await enrollmentsApi.getMyEnrollments();
      const enrollments = res.data || [];
      if (!enrollments.length) {
        navigate('/courses');
        return;
      }
      slug = enrollments[0].courseSlug;
      setIsEnrolled(true);
      setCourseSlug(slug);
      const title = enrollments[0].courseId?.title;
      setCourseName(title || slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()));
    } catch {
      navigate('/courses');
      return;
    } finally {
      setEnrollmentChecked(true);
    }

    if (!slug) return;

    setPostsLoading(true);
    try {
      const postsRes = await postsApi.getPostsForCourse(slug);
      setPosts(postsRes.data || postsRes.posts || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load posts.');
    } finally {
      setPostsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (authLoading) return;
    // Use Clerk sign-in state so a backend sync failure never sends a paying user to /login
    if (!user && !isSignedIn) {
      sessionStorage.setItem('postLoginRedirect', '/student/dashboard');
      navigate('/login');
      return;
    }
    checkEnrollmentAndFetch();
  }, [authLoading, user, isSignedIn, checkEnrollmentAndFetch, navigate]);

  // Show profile modal once enrollment confirmed and profile is incomplete
  useEffect(() => {
    if (!enrollmentChecked || !isEnrolled || !user) return;
    const needsProfile = !user.name || user.name === 'New User' || !user.city || !user.whatsapp;
    if (needsProfile) {
      setProfileName(user.name && user.name !== 'New User' ? user.name : '');
      setProfileCity(user.city || '');
      setProfileWhatsapp(user.whatsapp || '');
      setShowProfileModal(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollmentChecked, isEnrolled, user?.name, user?.city, user?.whatsapp]);

  const handleSaveProfile = async () => {
    if (!profileName.trim()) { setProfileError('Please enter your full name.'); return; }
    if (!profileCity.trim()) { setProfileError('Please enter your city.'); return; }
    if (!profileWhatsapp.trim()) { setProfileError('Please enter your WhatsApp number.'); return; }
    setProfileSaving(true);
    setProfileError('');
    try {
      await updateUserProfile({ name: profileName.trim(), city: profileCity.trim(), whatsapp: profileWhatsapp.trim() });
      setShowProfileModal(false);
    } catch {
      setProfileError('Failed to save. Please try again.');
    } finally {
      setProfileSaving(false);
    }
  };

  const tags = ['all', ...Array.from(new Set(posts.map((p) => p.tag)))];
  const pinnedPosts = posts.filter((p) => p.isPinned);
  const allRegular = posts.filter(
    (p) => !p.isPinned && (activeTag === 'all' || p.tag === activeTag)
  );
  const totalPages = Math.ceil(allRegular.length / PAGE_SIZE);
  const regularPosts = allRegular.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── Loading screen ────────────────────────────────────────────────────── */
  if (authLoading || !enrollmentChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#fff9ed' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#888] font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!isEnrolled) return null;

  const firstName = user?.name && user.name !== 'New User' ? user.name.split(' ')[0] : 'Student';

  /* ── Page ──────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: '#fff9ed' }}>

      {/* ── Profile Completion Modal (blocking) ─────────────────────────── */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-extrabold text-black mb-1">Complete Your Profile</h2>
            <p className="text-neutral-500 text-sm mb-6">
              Welcome! Please fill in a few quick details so we can personalise your experience.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">City *</label>
                <input
                  type="text"
                  value={profileCity}
                  onChange={e => setProfileCity(e.target.value)}
                  placeholder="e.g. Delhi, Mumbai"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">WhatsApp Number *</label>
                <input
                  type="tel"
                  value={profileWhatsapp}
                  onChange={e => setProfileWhatsapp(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              {profileError && <p className="text-red-500 text-sm">{profileError}</p>}
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={profileSaving}
              className="mt-6 w-full bg-amber-400 hover:bg-amber-300 disabled:bg-amber-200 text-black font-bold py-3 rounded-xl transition-colors"
            >
              {profileSaving ? 'Saving…' : 'Save & Continue →'}
            </button>
          </div>
        </div>
      )}

      {/* Hero keyframes */}
      <style>{`
        @keyframes heroBadge  { from { opacity:0; transform:translateY(-14px) } to { opacity:1; transform:translateY(0) } }
        @keyframes heroLine1  { from { opacity:0; transform:translateY(22px)  } to { opacity:1; transform:translateY(0) } }
        @keyframes heroLine2  { from { opacity:0; transform:translateY(22px)  } to { opacity:1; transform:translateY(0) } }
        @keyframes heroSub    { from { opacity:0; transform:translateY(16px)  } to { opacity:1; transform:translateY(0) } }
        @keyframes cardPop    { from { opacity:0; transform:scale(0.93) translateY(18px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes barGrow    { from { width:0% } }
        @keyframes shimmerSweep {
          0%   { background-position: -200% center }
          100% { background-position:  200% center }
        }
        .h-badge  { animation: heroBadge 0.55s cubic-bezier(.22,1,.36,1) 0.05s both }
        .h-line1  { animation: heroLine1 0.65s cubic-bezier(.22,1,.36,1) 0.18s both }
        .h-line2  { animation: heroLine2 0.65s cubic-bezier(.22,1,.36,1) 0.28s both;
                    background: linear-gradient(90deg,#1a1a1a 0%,#b45309 42%,#1a1a1a 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: heroLine2 0.65s cubic-bezier(.22,1,.36,1) 0.28s both,
                               shimmerSweep 2.8s linear 0.9s 1; }
        .h-sub    { animation: heroSub  0.65s cubic-bezier(.22,1,.36,1) 0.38s both }
        .h-card-0 { animation: cardPop  0.6s  cubic-bezier(.22,1,.36,1) 0.48s both }
        .h-card-1 { animation: cardPop  0.6s  cubic-bezier(.22,1,.36,1) 0.60s both }
        .h-card-2 { animation: cardPop  0.6s  cubic-bezier(.22,1,.36,1) 0.72s both }
        .bar-grow { animation: barGrow  1.4s  cubic-bezier(.22,1,.36,1) 1.1s  both }
      `}</style>

      <SharedNavbar />

      {/* ── WELCOME HERO ─────────────────────────────────────────────────── */}
      <section
        className="pt-24 pb-16 px-4"
        style={{ background: 'linear-gradient(135deg,#fff9ed 0%,#fff3d4 60%,#ffe8b5 100%)' }}
      >
        <div className="max-w-5xl mx-auto text-center">

          {/* Animated status badges */}
          <div className="h-badge flex items-center gap-2 mb-6 flex-wrap justify-center">
            <span
              className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full border border-green-200"
              style={label}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Enrolled
            </span>
            <span
              className="inline-flex items-center bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-200"
              style={label}
            >
              CUET 2026
            </span>
          </div>

          {/* Heading — two lines, second with shimmer */}
          <h1 className="h-line1 text-4xl md:text-5xl font-extrabold text-[#1a1a1a] leading-tight mb-1" style={serif}>
            Welcome back,
          </h1>
          <h1 className="h-line2 text-4xl md:text-5xl font-extrabold leading-tight mb-5" style={serif}>
            {firstName}.
          </h1>
          <p className="h-sub text-[#888] text-base mb-10 mx-auto" style={{ ...body, maxWidth: 480, lineHeight: 1.75 }}>
            Your student dashboard — all updates, resources, and announcements in one place.
          </p>

          {/* Quick-stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Posts count */}
            <div className="h-card-0 bg-white rounded-2xl p-6 border border-gray-100" style={{ boxShadow:'0 4px 24px rgba(0,0,0,0.05)' }}>
              <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-3" style={label}>Posts & Resources</p>
              <p className="text-6xl font-extrabold text-[#1a1a1a] leading-none tabular-nums" style={serif}>{posts.length}</p>
              <p className="text-[#aaa] text-xs mt-2 uppercase tracking-widest" style={label}>items available</p>
              <div className="flex gap-1.5 mt-4 flex-wrap">
                {(['announcement','resource','assignment'] as const).map((t) => {
                  const count = posts.filter((p) => p.tag === t).length;
                  if (!count) return null;
                  return (
                    <span key={t} className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${TAG_COLORS[t]}`} style={label}>
                      {t} · {count}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Batch card */}
            <div className="h-card-1 bg-[#1a1a1a] rounded-2xl p-6" style={{ boxShadow:'0 4px 24px rgba(0,0,0,0.18)' }}>
              <p className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-3" style={label}>Your Batch</p>
              <p className="text-sm font-semibold text-white leading-snug" style={{ ...body, opacity:0.9 }}>
                {courseName && !/^[a-f0-9]{24}$/i.test(courseName) ? courseName : 'Exam Decoders'}
              </p>
              <p className="text-neutral-500 text-xs mt-2 uppercase tracking-widest" style={label}>CUET 2026</p>
              <div className="mt-4 inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/25 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full" style={label}>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Active Member
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── UPSELL BANNER ────────────────────────────────────────────────── */}
      <div className="px-4 -mt-4 mb-2">
        <div className="max-w-5xl mx-auto">
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl px-6 py-4 border border-amber-300/60"
            style={{ background: 'linear-gradient(135deg,#1a1a1a 0%,#2a2000 100%)', boxShadow: '0 4px 24px rgba(245,166,35,0.12)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <p className="text-white font-bold text-sm" style={label}>Strengthen your preparation</p>
                <p className="text-neutral-400 text-xs mt-0.5" style={body}>Purchase more courses to cover additional subjects — no expiry, lifetime access.</p>
              </div>
            </div>
            <a
              href="/courses"
              className="flex-shrink-0 bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
              style={label}
            >
              Explore Courses →
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Pinned posts */}
        {pinnedPosts.length > 0 && (
          <FadeIn className="mb-12">
            <p className="text-xs font-bold tracking-widest uppercase text-amber-600 mb-1" style={label}>Pinned</p>
            <h2 className="text-2xl font-extrabold text-[#1a1a1a] mb-5" style={serif}>Must-read posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pinnedPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </FadeIn>
        )}

        {/* ── ANNOUNCEMENTS & POSTS ────────────────────────────────────── */}
        <FadeIn>
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <p className="text-sm font-bold tracking-widest uppercase text-amber-600 mb-1" style={label}>Latest Updates</p>
              <h2 className="text-4xl font-extrabold text-[#1a1a1a]" style={serif}>Announcements & Posts</h2>
            </div>
            {posts.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => { setActiveTag(tag); setPage(1); }}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${
                      activeTag === tag
                        ? 'bg-amber-400 text-black shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600'
                    }`}
                  >
                    {tag === 'all' ? 'All Posts' : tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        {/* Posts grid */}
        {postsLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <FadeIn>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-center">{error}</div>
          </FadeIn>
        ) : regularPosts.length === 0 && pinnedPosts.length === 0 ? (
          <FadeIn>
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-5xl mb-4"></div>
              <p className="text-lg font-bold text-[#1a1a1a]">No posts yet</p>
              <p className="text-[#888] text-sm mt-1">Check back soon — the instructor will post updates here.</p>
            </div>
          </FadeIn>
        ) : (
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {regularPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:border-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                      p === page
                        ? 'bg-amber-400 text-black shadow'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:border-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </FadeIn>
        )}

        {/* ── YOUR RESOURCES & FACULTY removed ── */}

      </div>


    </div>
  );
};

/* ─── Post Card ─────────────────────────────────────────────────────────── */
interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const dateStr = new Date(post.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const images    = post.attachments?.filter((a) => a.type === 'image') ?? [];
  const videos    = post.attachments?.filter((a) => a.type === 'video' || a.cloudflareVideoId) ?? [];
  const documents = post.attachments?.filter((a) => a.type === 'document') ?? [];

  return (
    <div
      onClick={() => navigate(`/student/post/${post._id}`, { state: { post } })}
      className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
      style={{ borderLeft: '3px solid #F5A623' }}
    >
      {/* Cover image or amber accent top bar */}
      {post.coverImage ? (
        <img src={post.coverImage} alt={post.title} className="w-full h-40 object-cover flex-shrink-0" />
      ) : (
        <div className="w-full h-1 flex-shrink-0 bg-gradient-to-r from-amber-400 to-orange-300" />
      )}

      <div className="flex flex-col flex-1 p-5 text-left">
        {/* Tag badges */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${TAG_COLORS[post.tag] || TAG_COLORS.general}`}>
            {post.tag}
          </span>
          {post.isPinned && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Pinned</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-extrabold text-[#1a1a1a] leading-snug mb-2 line-clamp-2" style={serif}>{post.title}</h3>

        {/* Content preview */}
        <p className="text-[#888] text-sm leading-relaxed line-clamp-3 flex-1" style={body}>{post.content}</p>

        {/* Attachment pills */}
        {(images.length > 0 || videos.length > 0 || documents.length > 0 || (post.folders?.length ?? 0) > 0) && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {(post.folders?.length ?? 0) > 0 && (
              <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                {post.folders!.length} folder{post.folders!.length > 1 ? 's' : ''}
              </span>
            )}
            {images.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">
                {images.length} image{images.length > 1 ? 's' : ''}
              </span>
            )}
            {videos.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full font-semibold">
                {videos.length} video{videos.length > 1 ? 's' : ''}
              </span>
            )}
            {documents.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-full font-semibold">
                {documents.length} doc{documents.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs text-[#888]" style={body}>{dateStr}</span>
          <span className="text-xs text-amber-500 font-bold hover:text-amber-600 transition-colors" style={label}>View post →</span>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
