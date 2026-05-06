/** Estimate reading time */
export function readingTime(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

/** Format ISO date or ObjectId to readable string */
export function formatDate(idOrDate, short = false) {
  if (!idOrDate) return '';
  try {
    const d = new Date(idOrDate);
    if (!isNaN(d.getTime())) {
      if (short) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    if (typeof idOrDate === 'string' && idOrDate.length >= 8) {
      const ts = parseInt(idOrDate.substring(0, 8), 16) * 1000;
      const d2 = new Date(ts);
      if (short) return d2.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      return d2.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return '';
  } catch { return ''; }
}

/** Relative time: "3 days ago" */
export function timeAgo(idOrDate) {
  if (!idOrDate) return '';
  try {
    const d = new Date(idOrDate);
    if (isNaN(d.getTime())) return '';
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  } catch { return ''; }
}

/** Truncate to N words */
export function truncate(text = '', words = 20) {
  const arr = text.trim().split(/\s+/);
  if (arr.length <= words) return text;
  return arr.slice(0, words).join(' ') + '…';
}

/** Deterministic color from string */
export function stringToColor(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 52%)`;
}

/** Initials from string */
export function getInitials(str = '') {
  return str.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');
}

/** Extract plain-text excerpt */
export function excerpt(text = '', chars = 160) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= chars) return clean;
  return clean.slice(0, chars).replace(/\s\S*$/, '') + '…';
}

/** Word count */
export function wordCount(text = '') {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Slugify a title */
export function slugify(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/** LocalStorage likes */
export function getLikes(id) {
  try {
    const data = JSON.parse(localStorage.getItem('blog_likes') || '{}');
    return { count: data[id]?.count || 0, liked: data[id]?.liked || false };
  } catch { return { count: 0, liked: false }; }
}

export function toggleLike(id) {
  try {
    const data = JSON.parse(localStorage.getItem('blog_likes') || '{}');
    const current = data[id] || { count: 0, liked: false };
    data[id] = { count: current.liked ? current.count - 1 : current.count + 1, liked: !current.liked };
    localStorage.setItem('blog_likes', JSON.stringify(data));
    return data[id];
  } catch { return { count: 0, liked: false }; }
}

/** LocalStorage comments */
export function getComments(id) {
  try {
    const data = JSON.parse(localStorage.getItem('blog_comments') || '{}');
    return data[id] || [];
  } catch { return []; }
}

export function addComment(id, comment) {
  try {
    const data = JSON.parse(localStorage.getItem('blog_comments') || '{}');
    const list = data[id] || [];
    const newComment = { ...comment, id: Date.now(), createdAt: new Date().toISOString() };
    data[id] = [newComment, ...list];
    localStorage.setItem('blog_comments', JSON.stringify(data));
    return data[id];
  } catch { return []; }
}

export function deleteComment(blogId, commentId) {
  try {
    const data = JSON.parse(localStorage.getItem('blog_comments') || '{}');
    data[blogId] = (data[blogId] || []).filter(c => c.id !== commentId);
    localStorage.setItem('blog_comments', JSON.stringify(data));
    return data[blogId];
  } catch { return []; }
}

/** Autosave draft */
export function saveDraft(draft) {
  try { localStorage.setItem('blog_draft', JSON.stringify({ ...draft, savedAt: Date.now() })); } catch {}
}
export function loadDraft() {
  try { return JSON.parse(localStorage.getItem('blog_draft') || 'null'); } catch { return null; }
}
export function clearDraft() {
  try { localStorage.removeItem('blog_draft'); } catch {}
}
