import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_URL } from '../lib/api';
import { readingTime, formatDate, stringToColor, getLikes, toggleLike, excerpt } from '../lib/utils';

function Card({ blog, featured = false, layout = 'grid' }) {
  const imgSrc = IMAGE_URL(blog.image, { width: featured ? 1400 : layout === 'list' ? 320 : 640 });
  const date = formatDate(blog.createdAt || blog._id, true);
  const readTime = readingTime(blog.description);
  const color = stringToColor(blog.title);

  const [likeData, setLikeData] = useState(() => getLikes(blog._id));

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLikeData(toggleLike(blog._id));
  };

  /* ── Featured hero card ── */
  if (featured) {
    return (
      <Link to={`/blog/${blog._id}`} className="group block">
        <article className="relative rounded-2xl overflow-hidden bg-stone-900 shadow-xl h-[400px] sm:h-[460px]">
          {imgSrc ? (
            <img src={imgSrc} alt={blog.title} decoding="async" fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:opacity-65 group-hover:scale-[1.03] transition-all duration-700" />
          ) : (
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}99, ${color}44)` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute top-5 left-5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white shadow">Featured</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-3 text-stone-300 text-xs">
              {date && <span>{date}</span>}
              <span>·</span>
              <span>{readTime}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2 line-clamp-2 group-hover:text-orange-300 transition-colors">
              {blog.title}
            </h2>
            {blog.subtitle && (
              <p className="text-stone-300 text-sm sm:text-base line-clamp-2 mb-5">{blog.subtitle}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-orange-400 text-sm font-semibold group-hover:gap-3 transition-all">
                Read article
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <button onClick={handleLike}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${likeData.liked ? 'text-red-400' : 'text-stone-400 hover:text-red-400'}`}>
                <svg className="w-4 h-4" fill={likeData.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {likeData.count > 0 && likeData.count}
              </button>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  /* ── List layout ── */
  if (layout === 'list') {
    return (
      <Link to={`/blog/${blog._id}`} className="group block">
        <article className="flex gap-5 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-md transition-all duration-200">
          <div className="w-28 h-20 sm:w-36 sm:h-24 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0">
            {imgSrc ? (
              <img src={imgSrc} alt={blog.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${color}33, ${color}66)` }} />
            )}
          </div>
          <div className="flex flex-col justify-between min-w-0 flex-1 py-0.5">
            <div>
              <div className="flex items-center gap-2 mb-1.5 text-xs text-stone-400 dark:text-stone-500">
                {date && <span>{date}</span>}
                <span>·</span>
                <span>{readTime}</span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-50 line-clamp-2 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors mb-1">
                {blog.title}
              </h2>
              {blog.subtitle && (
                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">{blog.subtitle}</p>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-semibold text-orange-500 dark:text-orange-400">Read →</span>
              <button onClick={handleLike}
                className={`flex items-center gap-1 text-xs font-medium transition-colors ${likeData.liked ? 'text-red-500' : 'text-stone-400 hover:text-red-500'}`}>
                <svg className="w-3.5 h-3.5" fill={likeData.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {likeData.count > 0 && likeData.count}
              </button>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  /* ── Default grid card ── */
  return (
    <Link to={`/blog/${blog._id}`} className="group block h-full">
      <article className="h-full flex flex-col bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-lg dark:hover:shadow-stone-950/60 transition-all duration-250">
        <div className="relative overflow-hidden aspect-[16/9] bg-stone-100 dark:bg-stone-800 shrink-0">
          {imgSrc ? (
            <img src={imgSrc} alt={blog.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}22, ${color}55)` }}>
              <svg className="w-9 h-9 text-stone-300 dark:text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-5">
          <div className="flex items-center gap-2 mb-2.5 text-xs text-stone-400 dark:text-stone-500">
            {date && <span>{date}</span>}
            <span>·</span>
            <span>{readTime}</span>
          </div>

          <h2 className="text-[15px] font-bold text-stone-900 dark:text-stone-50 mb-1.5 leading-snug line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {blog.title}
          </h2>

          {blog.subtitle && (
            <p className="text-xs font-medium text-stone-500 dark:text-stone-400 mb-2 line-clamp-1">{blog.subtitle}</p>
          )}

          {blog.description && (
            <p className="text-sm text-stone-500 dark:text-stone-400 line-clamp-3 leading-relaxed flex-1">
              {excerpt(blog.description, 120)}
            </p>
          )}

          <div className="mt-4 pt-3.5 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">Read more →</span>
            <button onClick={handleLike}
              className={`flex items-center gap-1 text-xs font-medium transition-colors ${likeData.liked ? 'text-red-500' : 'text-stone-400 hover:text-red-500'}`}>
              <svg className="w-3.5 h-3.5" fill={likeData.liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {likeData.count > 0 && likeData.count}
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default Card;
