export default function ChatListSkeleton({ count = 3 }) {
  return (
    <div className="p-4 space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="skeleton w-12 h-12 rounded-full shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-3/4"></div>
            <div className="skeleton h-3 w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

