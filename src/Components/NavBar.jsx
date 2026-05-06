import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onSearch }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (val) => {
    setSearchVal(val);
    onSearch?.(val);
  };

  const closeSearch = () => {
    setSearchVal('');
    onSearch?.('');
    setSearchOpen(false);
  };

  const isHome = location.pathname === '/';
  const isWrite = location.pathname === '/create' || location.pathname.startsWith('/edit');

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      scrolled
        ? 'bg-white/95 dark:bg-stone-950/95 backdrop-blur-lg shadow-sm border-b border-stone-200/80 dark:border-stone-800/80'
        : 'bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-[60px]">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-orange-500 group-hover:bg-orange-600 transition-colors flex items-center justify-center shadow-sm shadow-orange-200 dark:shadow-orange-900/30">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <span className="font-bold text-[17px] text-stone-900 dark:text-white tracking-tight">DevDiary</span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link to="/" className={`px-3 py-1.5 rounded-lg transition-colors ${
              isHome ? 'text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800'
                     : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}>Home</Link>
            <Link to="/about" className={`px-3 py-1.5 rounded-lg transition-colors ${
              location.pathname === '/about' ? 'text-stone-900 dark:text-white bg-stone-100 dark:bg-stone-800'
                     : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}>About</Link>
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1.5">

            {/* Search — desktop */}
            <div className="hidden md:flex items-center">
              {searchOpen ? (
                <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 rounded-lg px-3 py-2 w-52">
                  <svg className="w-4 h-4 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                  </svg>
                  <input
                    ref={searchRef}
                    value={searchVal}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Search posts…"
                    className="bg-transparent text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 outline-none flex-1 min-w-0"
                    onKeyDown={e => { if (e.key === 'Escape') closeSearch(); }}
                  />
                  {searchVal ? (
                    <button onClick={closeSearch} className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  ) : (
                    <button onClick={closeSearch} className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  aria-label="Search"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Dark mode */}
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Toggle theme"
            >
              {dark ? (
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Write CTA — only show when not already on write/edit */}
            {!isWrite && (
              <Link
                to="/create"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-orange-200 dark:shadow-orange-900/30"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Write
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="md:hidden border-t border-stone-200 dark:border-stone-800 py-3 space-y-1 pb-4">
            <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 rounded-lg px-3 py-2 mb-3">
              <svg className="w-4 h-4 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
              <input
                value={searchVal}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search posts…"
                className="bg-transparent text-sm text-stone-800 dark:text-stone-100 placeholder-stone-400 outline-none flex-1"
              />
            </div>
            <Link to="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Home
            </Link>
            <Link to="/about" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              About
            </Link>
            <Link to="/create" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Write a post
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
