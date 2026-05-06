import Navbar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';

export default function About() {
  const features = [
    { icon: '✍️', title: 'Write & Publish', desc: 'Create posts with a clean editor, drag-and-drop cover images, live preview, and autosave drafts.' },
    { icon: '🌙', title: 'Dark Mode', desc: 'Full dark mode support that respects your system preference and persists across sessions.' },
    { icon: '💬', title: 'Comments', desc: 'Readers can leave comments on any post. Comments are stored locally in the browser.' },
    { icon: '❤️', title: 'Likes', desc: 'Like posts you enjoy. Like counts are tracked per device using localStorage.' },
    { icon: '🔍', title: 'Search & Filter', desc: 'Instantly search across all posts by title, subtitle, or content. Sort by newest, oldest, or A–Z.' },
    { icon: '📊', title: 'Reading Stats', desc: 'Every post shows estimated reading time and a live reading progress bar as you scroll.' },
    { icon: '📱', title: 'Fully Responsive', desc: 'Looks great on every screen size — mobile, tablet, and desktop.' },
    { icon: '⚡', title: 'Fast & Minimal', desc: 'Built with Vite + React 19. No unnecessary dependencies. Loads instantly.' },
  ];

  const stack = [
    { name: 'React 19', role: 'Frontend UI', color: '#61dafb' },
    { name: 'Vite', role: 'Build tool', color: '#646cff' },
    { name: 'Tailwind CSS v4', role: 'Styling', color: '#38bdf8' },
    { name: 'Node.js + Express', role: 'Backend API', color: '#68a063' },
    { name: 'MongoDB + Mongoose', role: 'Database', color: '#47a248' },
    { name: 'Multer', role: 'Image uploads', color: '#f97316' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-14">

        {/* Hero */}
        <div className="text-center mb-14 fade-up">
          <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-orange-200 dark:shadow-orange-900/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 dark:text-white mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}>
            About DevDiary
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-lg leading-relaxed max-w-xl mx-auto">
            A minimal, feature-rich blog platform built with the MERN stack. Write, share, and discover ideas worth reading.
          </p>
        </div>

        {/* Features grid */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200 mb-6">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map(f => (
              <div key={f.title} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 hover:border-orange-300 dark:hover:border-orange-700 transition-colors">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="text-sm font-bold text-stone-800 dark:text-stone-200 mb-1">{f.title}</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-200 mb-6">Tech Stack</h2>
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            {stack.map((item, i) => (
              <div key={item.name} className={`flex items-center justify-between px-5 py-4 ${i !== stack.length - 1 ? 'border-b border-stone-100 dark:border-stone-800' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">{item.name}</span>
                </div>
                <span className="text-xs text-stone-400 dark:text-stone-500">{item.role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/10 rounded-2xl border border-orange-200 dark:border-orange-800/50 p-8">
          <h2 className="text-xl font-bold text-stone-900 dark:text-white mb-2">Ready to write?</h2>
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-5">Share your knowledge with the community.</p>
          <Link to="/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Write a post
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
