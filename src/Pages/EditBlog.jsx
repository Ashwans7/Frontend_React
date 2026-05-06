import { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '../Components/NavBar';
import { blogApi, IMAGE_URL } from '../lib/api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { wordCount } from '../lib/utils';

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [data, setData] = useState({ title: '', subtitle: '', description: '', image: null });
  const [existingImage, setExistingImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    blogApi.getOne(id)
      .then(res => {
        const b = res.data.data;
        setData({ title: b.title || '', subtitle: b.subtitle || '', description: b.description || '', image: null });
        setExistingImage(b.image || null);
      })
      .catch(() => { addToast('Failed to load post.', 'error'); navigate('/'); })
      .finally(() => setFetching(false));
  }, [id]);

  const validate = () => {
    const e = {};
    if (!data.title.trim()) e.title = 'Title is required.';
    if (!data.subtitle.trim()) e.subtitle = 'Subtitle is required.';
    if (!data.description.trim()) e.description = 'Content is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFile = useCallback((file) => {
    if (!file?.type.startsWith('image/')) { addToast('Please select a valid image.', 'error'); return; }
    setData(prev => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
    setExistingImage(null);
  }, []);

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

  const removeImage = () => {
    setData(prev => ({ ...prev, image: null }));
    setPreview(null);
    setExistingImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const formData = new FormData();
    formData.append('title', data.title.trim());
    formData.append('subtitle', data.subtitle.trim());
    formData.append('description', data.description.trim());
    if (data.image) formData.append('image', data.image);
    try {
      setLoading(true);
      await blogApi.update(id, formData);
      addToast('Post updated!', 'success');
      navigate(`/blog/${id}`);
    } catch (err) {
      addToast(err.response?.data?.message || 'Something went wrong.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentImageSrc = preview || (existingImage ? IMAGE_URL(existingImage) : null);
  const wc = wordCount(data.description);
  const readMins = Math.max(1, Math.round(wc / 200));

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl border text-stone-900 dark:text-stone-50 bg-white dark:bg-stone-900 placeholder-stone-400 dark:placeholder-stone-600 text-base outline-none transition-colors ${
      errors[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-stone-200 dark:border-stone-700 focus:border-orange-400 dark:focus:border-orange-500'
    }`;

  if (fetching) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-pulse space-y-5">
          <div className="skeleton h-7 w-40 rounded" />
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="skeleton h-44 w-full rounded-xl" />
          <div className="skeleton h-52 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-20">

        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500 mb-4 flex-wrap">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <Link to={`/blog/${id}`} className="hover:text-orange-500 transition-colors truncate max-w-[160px]">{data.title || 'Post'}</Link>
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span>Edit</span>
          </nav>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white mb-1">Edit post</h1>
              <p className="text-stone-500 dark:text-stone-400 text-sm">Update your post details below.</p>
            </div>
            <button type="button" onClick={() => setShowPreview(p => !p)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                showPreview ? 'bg-orange-500 border-orange-500 text-white'
                : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="mb-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            {currentImageSrc && <img src={currentImageSrc} alt="cover" className="w-full max-h-56 object-cover" />}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
                {data.title || <span className="text-stone-300 dark:text-stone-600">Your title…</span>}
              </h2>
              {data.subtitle && <p className="text-stone-500 dark:text-stone-400 mb-4">{data.subtitle}</p>}
              <div className="prose-blog text-sm">
                {data.description
                  ? data.description.split('\n').map((p, i) => p.trim() ? <p key={i}>{p}</p> : <br key={i} />)
                  : <p className="text-stone-300 dark:text-stone-600">Your content will appear here…</p>}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold tracking-wider text-stone-500 dark:text-stone-400 uppercase mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input type="text" name="title" value={data.title} onChange={handleChange}
              placeholder="Post title…" className={inputCls('title')} />
            {errors.title && <p className="mt-1.5 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-semibold tracking-wider text-stone-500 dark:text-stone-400 uppercase mb-2">
              Subtitle <span className="text-red-400">*</span>
            </label>
            <input type="text" name="subtitle" value={data.subtitle} onChange={handleChange}
              placeholder="A short tagline or hook…" className={inputCls('subtitle')} />
            {errors.subtitle && <p className="mt-1.5 text-xs text-red-500">{errors.subtitle}</p>}
          </div>

          {/* Cover image */}
          <div>
            <label className="block text-xs font-semibold tracking-wider text-stone-500 dark:text-stone-400 uppercase mb-2">
              Cover Image
              <span className="ml-2 text-stone-400 dark:text-stone-500 font-normal normal-case tracking-normal text-xs">
                (keep current or replace)
              </span>
            </label>
            {currentImageSrc ? (
              <div className="relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 group">
                <img src={currentImageSrc} alt="Cover" className="w-full max-h-60 object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-stone-900 rounded-lg text-xs font-semibold text-stone-800 dark:text-stone-200 shadow-lg">
                    Replace
                  </button>
                  <button type="button" onClick={removeImage}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-stone-900 rounded-lg text-xs font-semibold text-red-500 shadow-lg">
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all py-10 ${
                  dragOver ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/10'
                  : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Drop image here or <span className="text-orange-500">browse</span>
                </p>
              </div>
            )}
            <input ref={fileInputRef} type="file" name="image" accept="image/*"
              onChange={e => handleFile(e.target.files[0])} className="hidden" />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold tracking-wider text-stone-500 dark:text-stone-400 uppercase">
                Content <span className="text-red-400">*</span>
              </label>
              <span className="text-xs text-stone-400 dark:text-stone-500">{wc} words · {readMins} min read</span>
            </div>
            <textarea name="description" value={data.description} onChange={handleChange}
              placeholder="Write your post content here…"
              rows={14}
              className={`${inputCls('description')} resize-y leading-relaxed`}
            />
            {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 flex-wrap">
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
              {loading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving…</>
              ) : (
                <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Save Changes</>
              )}
            </button>
            <Link to={`/blog/${id}`}
              className="px-5 py-3 border border-stone-200 dark:border-stone-700 text-sm font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
