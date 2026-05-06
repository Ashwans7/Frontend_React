export default function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 animate-pulse">
      <div className="aspect-[16/9] bg-stone-200 dark:bg-stone-800" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-4 w-3/5 rounded" />
        <div className="space-y-2 mt-2">
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-full rounded" />
          <div className="skeleton h-3 w-2/3 rounded" />
        </div>
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800">
          <div className="skeleton h-3 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}
