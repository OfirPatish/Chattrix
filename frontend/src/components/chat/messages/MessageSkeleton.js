export default function MessageSkeleton({ count = 5 }) {
  return (
    <div className="space-y-4 py-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`flex gap-3 animate-pulse ${
            i % 2 === 0 ? "justify-end" : "justify-start"
          }`}
        >
          {i % 2 !== 0 && (
            <div className="skeleton w-8 h-8 rounded-full shrink-0"></div>
          )}
          <div
            className={`skeleton rounded-2xl ${
              i % 2 === 0 ? "w-48" : "w-56"
            } h-16`}
          ></div>
          {i % 2 === 0 && (
            <div className="skeleton w-8 h-8 rounded-full shrink-0"></div>
          )}
        </div>
      ))}
    </div>
  );
}

