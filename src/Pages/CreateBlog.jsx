import { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '../Components/NavBar';
import { blogApi } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { wordCount, saveDraft, loadDraft, clearDraft } from '../lib/utils';

export default function CreateBlog() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [data, setData] = useState({ title: '', subtitle: '', description: '', image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const [draftBanner, setDraftBanner] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  /* ── Load draft on mount ── */
  useEffect(() => {
    const draft = loadDraft();
    if (draft && (draft.title || draft.subtitle || draft.description)) {
      setDraftBanner(true);
    }
  }, []);

  const restoreDraft = () => {
    const draft = loadDraft();
    if (draft) {
      setData({ title: draft.title || '', subtitle: draft.subtitle || '', description: draft.description || '', image: null });
      setDraftBanner(false);
      addToast('Draft restored.', 'info');
    }
  };

  /* ── Autosave every 10s ── */
  useEffect(() => {
    if (!data.title && !data.description) return;
    const t = setTimeout(() => {
      saveDraft({ title: data.title, subtitle: data.subtitle, description: data.description });
      setLastSaved(new Date());
    }, 10000);
    return () => clearTimeout(t);
  }, [data.title, data.subtitle, data.description]);

  const validate = () => {
    const e = {};
    if (!data.title.trim()) e.title = 'Title is required.';
    if (!data.subtitle.trim()) e.subtitle = 'Subtitle is required.';
    if (!data.image) e.image = 'Cover image is required.';
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
    setErrors(prev => ({ ...prev, image: '' }));
  }, []);

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

  const removeImage = () => {
    setData(prev => ({ ...prev, image: null }));
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const formData = new FormData();
    formData.append('title', data.title.trim());
    formData.append('subtitle', data.subtitle.trim());
    formData.append('description', data.description.trim());
    formData.append('image', data.image);
    try {
      setLoading(true);
      await blogApi.create(formData);
      clearDraft();
      addToast('Post published!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || 'Something went wrong.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const wc = wordCount(data.description);
  const readMins = Math.max(1, Math.round(wc / 200));

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl border text-stone-900 dark:text-stone-50 bg-white dark:bg-stone-900 placeholder-stone-400 dark:placeholder-stone-600 text-base outline-none transition-colors ${
      errors[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-stone-200 dark:border-stone-700 focus:border-orange-400 dark:focus:border-orange-500'
    }`;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Navbar />

      {/* Draft banner */}
      {draftBanner && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              You have an unsaved draft.
            </div>
            <div className="flex items-center gap-2">
              <button onClick={restoreDraft}
                className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline">
                Restore draft
              </button>
              <button onClick={() => { clearDraft(); setDraftBanner(false); }}
                className="text-xs text-amber-500 hover:text-amber-700 dark:hover:text-amber-300">
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 pb-20">

        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500 mb-4">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span>New Post</span>
          </nav>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white mb-1">Write a new post</h1>
              <p className="text-stone-500 dark:text-stone-400 text-sm">Share your thoughts with the world.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPreview(p => !p)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                showPreview
                  ? 'bg-orange-500 border-orange-500 text-white'
                  : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>

        {/* Preview panel */}
        {showPreview && (
          <div className="mb-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            {preview && <img src={preview} alt="cover" className="w-full max-h-56 object-cover" />}
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
              placeholder="Give your post a compelling title…" className={inputCls('title')} />
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
              Cover Image <span className="text-red-400">*</span>
            </label>
            {preview ? (
              <div className="relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 group">
                <img src={preview} alt="Preview" className="w-full max-h-60 object-cover" />
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
                  : errors.image ? 'border-red-300 bg-red-50 dark:bg-red-900/10'
                  : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/10'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                    Drop image here or <span className="text-orange-500">browse</span>
                  </p>
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">PNG, JPG, WEBP · max 10MB</p>
                </div>
              </div>
            )}
            <input ref={fileInputRef} type="file" name="image" accept="image/*"
              onChange={e => handleFile(e.target.files[0])} className="hidden" />
            {errors.image && <p className="mt-1.5 text-xs text-red-500">{errors.image}</p>}
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold tracking-wider text-stone-500 dark:text-stone-400 uppercase">
                Content <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-3 text-xs text-stone-400 dark:text-stone-500">
                {lastSaved && <span>Autosaved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                <span>{wc} words · {readMins} min read</span>
              </div>
            </div>
            <textarea
              name="description"
              value={data.description}
              onChange={handleChange}
              placeholder="Write your post content here… Use blank lines to separate paragraphs."
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
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Publishing…</>
              ) : (
                <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Publish Post</>
              )}
            </button>
            <button type="button"
              onClick={() => { saveDraft({ title: data.title, subtitle: data.subtitle, description: data.description }); setLastSaved(new Date()); addToast('Draft saved.', 'info'); }}
              className="flex items-center gap-2 px-5 py-3 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium rounded-xl transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
              Save draft
            </button>
            <Link to="/" className="px-5 py-3 text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
