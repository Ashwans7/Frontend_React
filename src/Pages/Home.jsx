import { useEffect, useState, useMemo } from 'react';
import Card from '../Components/Card';
import CardSkeleton from '../Components/CardSkeleton';
import Navbar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { blogApi } from '../lib/api';
import { Link } from 'react-router-dom';

const POSTS_PER_PAGE = 9;

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [layout, setLayout] = useState('grid'); // 'grid' | 'list'
  const [page, setPage] = useState(1);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await blogApi.getAll();
      setBlogs(res.data.data || []);
    } catch {
      setError('Could not connect to the server. Make sure the backend is running on port 3000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBlogs(); }, []);

  // Reset page on search/sort change
  useEffect(() => { setPage(1); }, [search, sortBy]);

  const filtered = useMemo(() => {
    let result = [...blogs];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.title?.toLowerCase().includes(q) ||
        b.subtitle?.toLowerCase().includes(q) ||
        b.description?.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'newest') result.reverse();
    else if (sortBy === 'oldest') { /* already oldest-first from DB */ }
    else if (sortBy === 'az') result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    else if (sortBy === 'longest') result.sort((a, b) => (b.description?.length || 0) - (a.description?.length || 0));
    return result;
  }, [blogs, search, sortBy]);

  const featured = !search ? filtered[0] : null;
  const rest = !search ? filtered.slice(1) : filtered;
  const paginated = rest.slice(0, page * POSTS_PER_PAGE);
  const hasMore = paginated.length < rest.length;

  const stats = useMemo(() => {
    const totalWords = blogs.reduce((acc, b) => acc + (b.description?.split(/\s+/).filter(Boolean).length || 0), 0);
    const avgRead = blogs.length ? Math.max(1, Math.round(totalWords / blogs.length / 200)) : 0;
    return { total: blogs.length, totalWords, avgRead };
  }, [blogs]);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Navbar onSearch={setSearch} />

      <main>
        {/* ── Hero ── */}
        {!search && !loading && blogs.length > 0 && (
          <section className="hero-pattern border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
              <div className="max-w-2xl fade-up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                  {stats.total} {stats.total === 1 ? 'post' : 'posts'} published
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold text-stone-900 dark:text-white leading-[1.15] mb-4">
                  Ideas worth{' '}
                  <span className="gradient-text">reading.</span>
                </h1>
                <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed mb-8 max-w-lg">
                  A developer's journal — tutorials, opinions, and deep dives on building software.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Link to="/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Start writing
                  </Link>
                  <a href="#posts"
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium rounded-xl transition-colors">
                    Browse posts
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Stats row */}
              {stats.total > 0 && (
                <div className="flex items-center gap-6 mt-10 pt-8 border-t border-stone-200 dark:border-stone-800 fade-up-delay-1">
                  {[
                    { label: 'Posts', value: stats.total },
                    { label: 'Avg. read time', value: `${stats.avgRead} min` },
                    { label: 'Total words', value: stats.totalWords.toLocaleString() },
                  ].map(s => (
                    <div key={s.label}>
                      <p className="text-xl font-bold text-stone-900 dark:text-white">{s.value}</p>
                      <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10" id="posts">

          {/* ── Error ── */}
          {error && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-2">Connection failed</h2>
              <p className="text-stone-500 dark:text-stone-400 text-sm mb-6 max-w-sm">{error}</p>
              <button onClick={fetchBlogs}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors">
                Retry
              </button>
            </div>
          )}

          {/* ── Loading ── */}
          {loading && (
            <div className="space-y-8">
              <div className="rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse h-[400px]" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            </div>
          )}

          {/* ── Empty ── */}
          {!loading && !error && blogs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-28 text-center">
              <div className="w-20 h-20 rounded-2xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-stone-800 dark:text-stone-200 mb-2">No posts yet</h2>
              <p className="text-stone-500 dark:text-stone-400 text-sm mb-7 max-w-xs">
                Be the first to share something worth reading.
              </p>
              <Link to="/create"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                Write your first post
              </Link>
            </div>
          )}

          {/* ── No search results ── */}
          {!loading && !error && blogs.length > 0 && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-1">No results for "{search}"</h2>
              <p className="text-stone-500 dark:text-stone-400 text-sm">Try a different keyword.</p>
            </div>
          )}

          {/* ── Content ── */}
          {!loading && !error && filtered.length > 0 && (
            <>
              {/* Featured */}
              {featured && (
                <div className="mb-10 fade-up">
                  <Card blog={featured} featured />
                </div>
              )}

              {/* Toolbar */}
              <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                <h2 className="text-base font-bold text-stone-800 dark:text-stone-200">
                  {search
                    ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${search}"`
                    : `All Posts (${rest.length})`}
                </h2>
                <div className="flex items-center gap-2">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="text-xs bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 rounded-lg px-2.5 py-1.5 outline-none focus:border-orange-400 transition-colors cursor-pointer"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="az">A → Z</option>
                    <option value="longest">Longest read</option>
                  </select>

                  {/* Layout toggle */}
                  <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-lg p-0.5">
                    <button
                      onClick={() => setLayout('grid')}
                      className={`p-1.5 rounded-md transition-colors ${layout === 'grid' ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'}`}
                      aria-label="Grid view"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setLayout('list')}
                      className={`p-1.5 rounded-md transition-colors ${layout === 'list' ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-white' : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'}`}
                      aria-label="List view"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid / List */}
              {layout === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {paginated.map((blog, i) => (
                    <div key={blog._id} className={`fade-up-delay-${Math.min(i % 3 + 1, 3)}`}>
                      <Card blog={blog} layout="grid" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {paginated.map(blog => (
                    <Card key={blog._id} blog={blog} layout="list" />
                  ))}
                </div>
              )}

              {/* Load more */}
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={() => setPage(p => p + 1)}
                    className="px-6 py-2.5 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium rounded-xl transition-colors"
                  >
                    Load more posts
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Newsletter CTA ── */}
        {!loading && !error && blogs.length > 0 && (
          <section className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/40">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">Want to contribute?</h2>
              <p className="text-stone-500 dark:text-stone-400 text-sm mb-6 max-w-sm mx-auto">
                Share your knowledge with the community. Write a post and inspire others.
              </p>
              <Link to="/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Write a post
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer totalPosts={blogs.length} />
    </div>
  );
}
