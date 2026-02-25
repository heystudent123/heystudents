import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tus from 'tus-js-client';
import { postsApi, videosApi } from '../services/api';

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

const TAGS = ['general', 'announcement', 'resource', 'assignment', 'update'];
const COURSE_SLUG = 'du-campus-advantage';

const emptyForm = {
  title: '',
  content: '',
  courseSlug: COURSE_SLUG,
  tag: 'general',
  isPinned: false,
  isPublished: true,
  coverImage: '',
  attachments: [] as Attachment[],
};

const AdminPostsPage: React.FC = () => {
  const navigate = useNavigate();

  // Admin auth guard
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    try {
      const u = JSON.parse(stored);
      if (u.role !== 'admin') navigate('/');
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const videoFileRef = useRef<HTMLInputElement>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);
  const docFileRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await postsApi.getAdminPosts();
      setPosts(res.data || res.posts || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (post: Post) => {
    setForm({
      title: post.title,
      content: post.content,
      courseSlug: post.courseSlug,
      tag: post.tag,
      isPinned: post.isPinned,
      isPublished: post.isPublished,
      coverImage: post.coverImage || '',
      attachments: post.attachments || [],
    });
    setEditingId(post._id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await postsApi.updatePost(editingId, form);
      } else {
        await postsApi.createPost(form);
      }
      setShowModal(false);
      fetchPosts();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await postsApi.deletePost(id);
      setDeleteConfirm(null);
      fetchPosts();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Delete failed.');
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    setVideoProgress(0);
    setError('');
    try {
      const urlRes = await videosApi.getUploadUrl();
      const { uploadURL, uid } = urlRes.data;
      await new Promise<void>((resolve, reject) => {
        const upload = new tus.Upload(file, {
          uploadUrl: uploadURL,
          chunkSize: 50 * 1024 * 1024,
          metadata: { name: file.name, type: file.type },
          onProgress: (sent, total) => setVideoProgress(Math.round((sent / total) * 100)),
          onSuccess: () => resolve(),
          onError: (err) => reject(err),
        });
        upload.start();
      });
      setForm((f) => ({
        ...f,
        attachments: [
          ...f.attachments,
          { label: file.name, url: `https://iframe.cloudflarestream.com/${uid}`, type: 'video' as const, cloudflareVideoId: uid },
        ],
      }));
    } catch {
      setError('Video upload failed. Please try again.');
    } finally {
      setUploadingVideo(false);
      setVideoProgress(null);
      if (videoFileRef.current) videoFileRef.current.value = '';
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setError('');
    try {
      const res = await postsApi.uploadAttachment(file);
      setForm((f) => ({
        ...f,
        attachments: [...f.attachments, { label: res.data.originalName, url: res.data.url, type: 'image' as const }],
      }));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Image upload failed.');
    } finally {
      setUploadingImage(false);
      if (imageFileRef.current) imageFileRef.current.value = '';
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingDoc(true);
    setError('');
    try {
      const res = await postsApi.uploadAttachment(file);
      setForm((f) => ({
        ...f,
        attachments: [...f.attachments, { label: res.data.originalName, url: res.data.url, type: 'document' as const }],
      }));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Document upload failed.');
    } finally {
      setUploadingDoc(false);
      if (docFileRef.current) docFileRef.current.value = '';
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    setError('');
    try {
      const res = await postsApi.uploadAttachment(file);
      setForm((f) => ({ ...f, coverImage: res.data.url }));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Cover image upload failed.');
    } finally {
      setUploadingCover(false);
      if (coverFileRef.current) coverFileRef.current.value = '';
    }
  };

  const removeAttachment = (idx: number) => {
    setForm((f) => ({
      ...f,
      attachments: f.attachments.filter((_, i) => i !== idx),
    }));
  };

  const ATTACHMENT_ICONS: Record<string, string> = { video: '🎥', image: '🖼️', document: '📄' };

  const TAG_COLORS: Record<string, string> = {
    announcement: 'bg-red-100 text-red-700',
    resource: 'bg-blue-100 text-blue-700',
    assignment: 'bg-purple-100 text-purple-700',
    update: 'bg-green-100 text-green-700',
    general: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-500 hover:text-gray-700"
            >
              ←
            </button>
            <h1 className="text-xl font-bold text-gray-900">Posts Management</h1>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              {COURSE_SLUG}
            </span>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors"
          >
            <span className="text-lg leading-none">+</span> New Post
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-6 text-sm">
            {error}
            <button className="ml-2 underline" onClick={() => setError('')}>Dismiss</button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-lg font-medium">No posts yet</p>
            <button onClick={openCreate} className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors">
              Create first post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${TAG_COLORS[post.tag] || TAG_COLORS.general}`}>
                      {post.tag}
                    </span>
                    {post.isPinned && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">📌 Pinned</span>}
                    {!post.isPublished && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Draft</span>}
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 truncate">{post.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{post.content}</p>
                  {post.attachments?.length > 0 && (
                    <p className="text-xs text-blue-500 mt-1">📎 {post.attachments.length} attachment{post.attachments.length > 1 ? 's' : ''}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(post)}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(post._id)}
                    className="px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 rounded-lg text-red-600 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? 'Edit Post' : 'Create Post'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <p className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">{error}</p>
              )}
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Post title"
                />
              </div>
              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  rows={6}
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  placeholder="Write your post content here…"
                />
              </div>
              {/* Tag + Course Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                  <select
                    value={form.tag}
                    onChange={(e) => setForm((f) => ({ ...f, tag: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {TAGS.map((t) => (
                      <option key={t} value={t} className="capitalize">{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                  <input
                    type="text"
                    value={form.courseSlug}
                    onChange={(e) => setForm((f) => ({ ...f, courseSlug: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image <span className="text-gray-400">(optional)</span></label>
                {form.coverImage ? (
                  <div className="relative">
                    <img src={form.coverImage} alt="Cover" className="w-full h-36 object-cover rounded-lg border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, coverImage: '' }))}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                    uploadingCover ? 'border-amber-300 bg-amber-50 pointer-events-none' : 'border-gray-300 hover:border-amber-400 hover:bg-amber-50'
                  }`}>
                    {uploadingCover ? (
                      <><div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /><span className="text-sm text-amber-600">Uploading…</span></>
                    ) : (
                      <><span className="text-lg">🖼️</span><span className="text-sm text-gray-500">Click to upload cover image</span></>
                    )}
                    <input ref={coverFileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={uploadingCover} />
                  </label>
                )}
              </div>
              {/* Toggles */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPinned}
                    onChange={(e) => setForm((f) => ({ ...f, isPinned: e.target.checked }))}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-sm text-gray-700">Pin post</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm((f) => ({ ...f, isPublished: e.target.checked }))}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="text-sm text-gray-700">Published</span>
                </label>
              </div>
              {/* ── Attachments ─────────────────────────────────── */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                  <span className="text-sm font-semibold text-gray-700">📎 Attachments</span>
                </div>

                {/* Uploaded items */}
                {form.attachments.length > 0 && (
                  <div className="px-4 pt-3 pb-1 space-y-2">
                    {form.attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                        <span className="text-base flex-shrink-0">{ATTACHMENT_ICONS[att.type || 'document'] || '📎'}</span>
                        <span className="text-sm text-gray-700 flex-1 truncate">{att.label || 'Attachment'}</span>
                        <button onClick={() => removeAttachment(idx)} className="text-red-400 hover:text-red-600 flex-shrink-0 text-sm">✕</button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4 space-y-3">
                  {/* VIDEO — Cloudflare Stream */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">🎥 Video · Cloudflare Stream</p>
                    {uploadingVideo ? (
                      <div className="rounded-lg border border-purple-200 bg-purple-50 p-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-purple-700 font-medium">Uploading video…</span>
                          <span className="text-xs text-purple-700 font-bold">{videoProgress ?? 0}%</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${videoProgress ?? 0}%` }} />
                        </div>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-purple-200 hover:border-purple-400 hover:bg-purple-50 rounded-lg cursor-pointer transition-colors">
                        <span>🎬</span>
                        <span className="text-sm text-gray-500">Click to upload video</span>
                        <input ref={videoFileRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                      </label>
                    )}
                  </div>

                  {/* IMAGES — Cloudinary */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">🖼️ Images · Cloudinary</p>
                    <label className={`flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      uploadingImage ? 'border-blue-300 bg-blue-50 pointer-events-none' : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50'
                    }`}>
                      {uploadingImage ? (
                        <><div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /><span className="text-sm text-blue-600">Uploading…</span></>
                      ) : (
                        <><span>🖼️</span><span className="text-sm text-gray-500">Click to upload image</span></>
                      )}
                      <input ref={imageFileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                    </label>
                  </div>

                  {/* DOCUMENTS — Cloudinary */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">📄 Documents · Cloudinary</p>
                    <label className={`flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      uploadingDoc ? 'border-green-300 bg-green-50 pointer-events-none' : 'border-green-200 hover:border-green-400 hover:bg-green-50'
                    }`}>
                      {uploadingDoc ? (
                        <><div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /><span className="text-sm text-green-600">Uploading…</span></>
                      ) : (
                        <><span>📄</span><span className="text-sm text-gray-500">Click to upload PDF or document</span></>
                      )}
                      <input ref={docFileRef} type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" className="hidden" onChange={handleDocUpload} disabled={uploadingDoc} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploadingVideo || uploadingImage || uploadingDoc || uploadingCover}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
              >
                {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Post?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPostsPage;
