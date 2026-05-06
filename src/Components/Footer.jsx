import { Link } from 'react-router-dom';

export default function Footer({ totalPosts = 0 }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <span className="font-bold text-stone-900 dark:text-white">DevDiary</span>
            </div>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-[220px]">
              A minimal blog for developers to share ideas, tutorials, and stories.
            </p>
            {totalPosts > 0 && (
              <p className="mt-3 text-xs text-stone-400 dark:text-stone-500">
                {totalPosts} {totalPosts === 1 ? 'post' : 'posts'} published
              </p>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/', label: 'Home' },
                { to: '/create', label: 'Write a Post' },
                { to: '/about', label: 'About' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-stone-600 dark:text-stone-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stack */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest text-stone-400 dark:text-stone-500 uppercase mb-4">Built with</h3>
            <ul className="space-y-2.5">
              {['React 19', 'Node.js + Express', 'MongoDB + Mongoose', 'Tailwind CSS v4', 'Vite'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-400 dark:text-stone-500">
            © {year} DevDiary. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-stone-400 dark:text-stone-500">
            <span>Made with ❤️ and React</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
