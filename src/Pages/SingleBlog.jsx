import { useEffect, useState, useRef } from 'react';
import Navbar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { blogApi, IMAGE_URL } from '../lib/api';
import { readingTime, formatDate, timeAgo, getLikes, toggleLike, getComments, addComment, deleteComment, stringToColor } from '../lib/utils';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function SingleBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [likeData, setLikeData] = useState({ count: 0, liked: false });
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ name: '', text: '' });
  const [commentError, setCommentError] = useState('');
  const [progress, setProgress] = useState(0);
  const [showBackTop, setShowBackTop] = useState(false);
  const articleRef = useRef(null);

  /* ── Fetch ── */
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [blogRes, allRes] = await Promise.all([blogApi.getOne(id), blogApi.getAll()]);
        const b = blogRes.data.data;
        setBlog(b);
        setLikeData(getLikes(id));
        setComments(getComments(id));
        const all = allRes.data.data || [];
        setRelatedBlogs(all.filter(x => x._id !== id).slice(0, 3));
      } catch {
        addToast('Failed to load post.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  /* ── Reading progress ── */
  useEffect(() => {
    const bar = document.getElementById('reading-progress');
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const winH = window.innerHeight;
      const scrolled = Math.max(0, -top);
      const total = height - winH;
      const pct = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
      setProgress(pct);
      if (bar) bar.style.width = pct + '%';
      setShowBackTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (bar) bar.style.width = '0%';
    };
  }, [blog]);

  /* ── Actions ── */
  const handleLike = () => setLikeData(toggleLike(id));

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: blog?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Link copied to clipboard!', 'success');
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await blogApi.delete(id);
      addToast('Post deleted.', 'success');
      navigate('/');
    } catch {
      addToast('Failed to delete post.', 'error');
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentForm.name.trim()) return setCommentError('Please enter your name.');
    if (!commentForm.text.trim()) return setCommentError('Please write a comment.');
    setComments(addComment(id, commentForm));
    setCommentForm({ name: '', text: '' });
    setCommentError('');
    addToast('Comment posted!', 'success');
  };

  const handleDeleteComment = (cid) => {
    setComments(deleteComment(id, cid));
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-pulse space-y-5">
          <div className="skeleton h-5 w-28 rounded" />
          <div className="skeleton h-10 w-4/5 rounded" />
          <div className="skeleton h-5 w-1/2 rounded" />
          <div className="skeleton rounded-2xl aspect-[16/9] w-full" />
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className={`skeleton h-4 rounded ${i % 5 === 4 ? 'w-2/3' : 'w-full'}`} />
          ))}
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-5">
            <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200 mb-2">Post not found</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">This post may have been deleted.</p>
          <Link to="/" className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const imgSrc = IMAGE_URL(blog.image, { width: 1600 });
  const date = formatDate(blog.createdAt || blog._id);
  const ago = timeAgo(blog.createdAt || blog._id);
  const readTime = readingTime(blog.description);
  const color = stringToColor(blog.title);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Reading progress bar */}
      <div id="reading-progress" style={{ width: progress + '%' }} />

      <Navbar />

      <main ref={articleRef}>
        {/* ── Hero image ── */}
        {imgSrc ? (
          <div className="w-full max-h-[500px] overflow-hidden bg-stone-900">
            <img src={imgSrc} alt={blog.title} decoding="async" fetchPriority="high" className="w-full max-h-[500px] object-cover" />
          </div>
        ) : (
          <div className="w-full h-48 sm:h-64" style={{ background: `linear-gradient(135deg, ${color}33, ${color}66)` }} />
        )}

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500 mb-6 flex-wrap">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="text-stone-600 dark:text-stone-400 truncate max-w-[240px]">{blog.title}</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white leading-tight mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}>
            {blog.title}
          </h1>

          {/* Subtitle */}
          {blog.subtitle && (
            <p className="text-lg text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">{blog.subtitle}</p>
          )}

          {/* Meta bar */}
          <div className="flex items-center justify-between flex-wrap gap-3 py-4 border-y border-stone-200 dark:border-stone-800 mb-8">
            <div className="flex items-center gap-4 text-sm text-stone-500 dark:text-stone-400 flex-wrap">
              {date && (
                <span className="flex items-center gap-1.5" title={date}>
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {ago || date}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              {/* Like */}
              <button onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  likeData.liked
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}>
                <svg className="w-4 h-4" fill={likeData.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {likeData.count > 0 ? likeData.count : 'Like'}
              </button>

              {/* Share */}
              <button onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>

              {/* Edit */}
              <button onClick={() => navigate(`/edit/${id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>

              {/* Delete */}
              <button onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>

          {/* ── Article body ── */}
          <div className="prose-blog">
            {blog.description?.split('\n').map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : <br key={i} />
            )}
          </div>

          {/* ── Tags / share row ── */}
          <div className="mt-10 pt-8 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between flex-wrap gap-4">
            <Link to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              All posts
            </Link>
            <div className="flex items-center gap-2">
              <button onClick={handleLike}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  likeData.liked
                    ? 'border-red-300 dark:border-red-700 text-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-red-300 hover:text-red-500'
                }`}>
                <svg className="w-4 h-4" fill={likeData.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {likeData.liked ? 'Liked' : 'Like this post'} {likeData.count > 0 && `· ${likeData.count}`}
              </button>
              <button onClick={handleShare}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-600 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
            </div>
          </div>

          {/* ── Comments ── */}
          <section className="mt-12">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? 's' : ''}` : 'Comments'}
            </h2>

            {/* Comment form */}
            <form onSubmit={handleComment} className="mb-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 space-y-3">
              <h3 className="text-sm font-semibold text-stone-700 dark:text-stone-300">Leave a comment</h3>
              <input
                type="text"
                placeholder="Your name"
                value={commentForm.name}
                onChange={e => setCommentForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-50 text-sm placeholder-stone-400 outline-none focus:border-orange-400 transition-colors"
              />
              <textarea
                placeholder="Share your thoughts…"
                value={commentForm.text}
                onChange={e => setCommentForm(f => ({ ...f, text: e.target.value }))}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-50 text-sm placeholder-stone-400 outline-none focus:border-orange-400 transition-colors resize-none"
              />
              {commentError && <p className="text-xs text-red-500">{commentError}</p>}
              <button type="submit"
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors">
                Post comment
              </button>
            </form>

            {/* Comment list */}
            {comments.length === 0 ? (
              <p className="text-sm text-stone-400 dark:text-stone-500 text-center py-6">No comments yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {comments.map(c => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                      style={{ background: stringToColor(c.name) }}>
                      {c.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="comment-bubble">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">{c.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-400 dark:text-stone-500">{timeAgo(c.createdAt)}</span>
                            <button onClick={() => handleDeleteComment(c.id)}
                              className="text-stone-300 dark:text-stone-600 hover:text-red-400 transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* ── Related posts ── */}
        {relatedBlogs.length > 0 && (
          <div className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40 py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200 mb-6">More posts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedBlogs.map(b => (
                  <Link key={b._id} to={`/blog/${b._id}`} className="group flex gap-4 p-4 rounded-2xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                    {IMAGE_URL(b.image, { width: 160 }) && (
                      <img src={IMAGE_URL(b.image, { width: 160 })} alt={b.title} loading="lazy" decoding="async"
                        className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-200 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                        {b.title}
                      </h3>
                      <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">{readingTime(b.description)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* ── Delete modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white dark:bg-stone-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-stone-200 dark:border-stone-700">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 text-center mb-1">Delete this post?</h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 text-center mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-semibold transition-colors">
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Back to top ── */}
      {showBackTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Back to top"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
