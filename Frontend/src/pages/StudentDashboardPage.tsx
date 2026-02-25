import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SharedNavbar from '../components/SharedNavbar';
import { enrollmentsApi, postsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

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
  coverImage?: string;
  createdAt: string;
  publishedBy?: { name?: string; email?: string };
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

const StudentDashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [enrollmentChecked, setEnrollmentChecked] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTag, setActiveTag] = useState<string>('all');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const COURSE_SLUG = 'du-campus-advantage';

  const checkEnrollmentAndFetch = useCallback(async () => {
    try {
      const res = await enrollmentsApi.checkEnrollment(COURSE_SLUG);
      if (!res.isEnrolled) {
        navigate('/courses');
        return;
      }
      setIsEnrolled(true);
    } catch {
      navigate('/courses');
      return;
    } finally {
      setEnrollmentChecked(true);
    }

    // Fetch posts
    setPostsLoading(true);
    try {
      const postsRes = await postsApi.getPostsForCourse(COURSE_SLUG);
      setPosts(postsRes.data || postsRes.posts || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load posts.');
    } finally {
      setPostsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      sessionStorage.setItem('postLoginRedirect', '/student/dashboard');
      navigate('/login');
      return;
    }
    checkEnrollmentAndFetch();
  }, [authLoading, user, checkEnrollmentAndFetch, navigate]);

  const tags = ['all', ...Array.from(new Set(posts.map((p) => p.tag)))];
  const pinnedPosts = posts.filter((p) => p.isPinned);
  const regularPosts = posts.filter(
    (p) =>
      !p.isPinned &&
      (activeTag === 'all' || p.tag === activeTag)
  );

  if (authLoading || !enrollmentChecked) {
    return (
      <div className="min-h-screen bg-[#fff9ed] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!isEnrolled) return null;

  return (
    <div className="min-h-screen bg-[#fff9ed]">
      <SharedNavbar />

      {/* Hero */}
      <div className="pt-24 pb-10 px-4 bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber-600 font-semibold text-sm mb-1 flex items-center gap-1.5">
            DU Campus Advantage
            <span className="text-green-600">· ✓ Enrolled</span>
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-gray-500 text-base">
            Your student dashboard — all updates, resources, and announcements in one place.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Pinned Posts */}
        {pinnedPosts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
              📌 Pinned
            </h2>
            <div className="space-y-4">
              {pinnedPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  expanded={expandedPost === post._id}
                  onToggle={() =>
                    setExpandedPost(expandedPost === post._id ? null : post._id)
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Tag filter */}
        {posts.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-6">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                  activeTag === tag
                    ? 'bg-amber-500 text-white shadow'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-400'
                }`}
              >
                {tag === 'all' ? 'All Posts' : `${TAG_ICONS[tag] || ''} ${tag}`}
              </button>
            ))}
          </div>
        )}

        {/* Posts */}
        {postsLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-center">
            {error}
          </div>
        ) : regularPosts.length === 0 && pinnedPosts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-lg font-medium">No posts yet</p>
            <p className="text-sm mt-1">Check back soon — the instructor will post updates here.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {regularPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                expanded={expandedPost === post._id}
                onToggle={() =>
                  setExpandedPost(expandedPost === post._id ? null : post._id)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Post Card ─────────────────────────────────────────────────────────── */
interface PostCardProps {
  post: Post;
  expanded: boolean;
  onToggle: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, expanded, onToggle }) => {
  const dateStr = new Date(post.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border transition-all duration-200 ${
        post.isPinned ? 'border-amber-200' : 'border-gray-100'
      }`}
    >
      {/* Cover image */}
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-40 object-cover rounded-t-2xl"
        />
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                TAG_COLORS[post.tag] || TAG_COLORS.general
              }`}
            >
              {TAG_ICONS[post.tag]} {post.tag}
            </span>
            {post.isPinned && (
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                📌 Pinned
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">{dateStr}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>

        {/* Content */}
        <div
          className={`text-gray-600 text-sm leading-relaxed whitespace-pre-line ${
            expanded ? '' : 'line-clamp-3'
          }`}
        >
          {post.content}
        </div>

        {post.content.length > 200 && (
          <button
            onClick={onToggle}
            className="text-amber-600 text-sm font-medium mt-2 hover:underline"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {/* Attachments */}
        {post.attachments?.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Attachments</p>
            {post.attachments.map((att, i) => {
              if (att.type === 'video' || att.cloudflareVideoId) {
                const videoId = att.cloudflareVideoId || att.url.split('/').pop();
                return (
                  <div key={i}>
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <span>🎥</span>{att.label || 'Video'}
                    </p>
                    <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={`https://iframe.cloudflarestream.com/${videoId}`}
                        title={att.label || 'Video'}
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0"
                      />
                    </div>
                  </div>
                );
              }
              if (att.type === 'image') {
                return (
                  <div key={i}>
                    <a href={att.url} target="_blank" rel="noopener noreferrer">
                      <img
                        src={att.url}
                        alt={att.label || 'Image'}
                        className="rounded-xl max-h-72 w-full object-cover border border-gray-100 hover:opacity-95 transition-opacity"
                      />
                      {att.label && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><span>🖼️</span>{att.label}</p>}
                    </a>
                  </div>
                );
              }
              // document (default)
              return (
                <a
                  key={i}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  <span>📄</span>
                  {att.label || att.url}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboardPage;
