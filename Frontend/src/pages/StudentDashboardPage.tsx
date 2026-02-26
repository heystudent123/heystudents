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
  const [courseSlug, setCourseSlug] = useState('');
  const [courseName, setCourseName] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState('');
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
      // Use populated course title if available, fall back to humanising the slug
      const title = enrollments[0].courseId?.title;
      setCourseName(title || slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()));
    } catch {
      navigate('/courses');
      return;
    } finally {
      setEnrollmentChecked(true);
    }

    if (!slug) return;

    // Fetch posts
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
    if (!user) {
      sessionStorage.setItem('postLoginRedirect', '/student/dashboard');
      navigate('/login');
      return;
    }
    checkEnrollmentAndFetch();
  }, [authLoading, user, checkEnrollmentAndFetch, navigate]);

  const tags = ['all', ...Array.from(new Set(posts.map((p) => p.tag)))];
  const pinnedPosts = posts.filter((p) => p.isPinned);
  const allRegular = posts.filter(
    (p) => !p.isPinned && (activeTag === 'all' || p.tag === activeTag)
  );
  const totalPages = Math.ceil(allRegular.length / PAGE_SIZE);
  const regularPosts = allRegular.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
            {courseName || 'Your Course'}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pinnedPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
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
                onClick={() => { setActiveTag(tag); setPage(1); }}
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {regularPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:border-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                      p === page
                        ? 'bg-amber-500 text-white shadow'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:border-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};
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
      className={`flex flex-col bg-white rounded-2xl shadow-sm border cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden ${
        post.isPinned ? 'border-amber-300' : 'border-gray-100'
      }`}
    >
      {/* Cover image — tall, or gradient placeholder */}
      {post.coverImage ? (
        <img src={post.coverImage} alt={post.title} className="w-full h-40 object-cover flex-shrink-0" />
      ) : (
        <div className={`w-full h-3 flex-shrink-0 ${post.isPinned ? 'bg-gradient-to-r from-amber-400 to-orange-400' : 'bg-gradient-to-r from-gray-100 to-gray-200'}`} />
      )}

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 text-left">
        {/* Tag + pinned badge */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${TAG_COLORS[post.tag] || TAG_COLORS.general}`}>
            {TAG_ICONS[post.tag]} {post.tag}
          </span>
          {post.isPinned && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">📌 Pinned</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 leading-snug mb-2 line-clamp-2">{post.title}</h3>

        {/* Content preview */}
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">{post.content}</p>

        {/* Attachment pills */}
        {(images.length > 0 || videos.length > 0 || documents.length > 0) && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {images.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-medium">
                🖼️ {images.length} image{images.length > 1 ? 's' : ''}
              </span>
            )}
            {videos.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full font-medium">
                🎥 {videos.length} video{videos.length > 1 ? 's' : ''}
              </span>
            )}
            {documents.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-full font-medium">
                📄 {documents.length} doc{documents.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}

        {/* Footer: date + view post */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">{dateStr}</span>
          <span className="text-xs text-amber-500 font-semibold">View post →</span>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
