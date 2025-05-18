import { Users } from "lucide-react";

const SidebarSkeleton = ({ fullWidth = false }) => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className={`h-full border-r border-base-300 flex flex-col transition-all duration-200 overflow-hidden ${
        fullWidth ? "w-full" : "min-w-[72px] w-28 sm:w-40 lg:w-72"
      }`}
    >
      {/* Desktop header */}
      <div className="border-b border-base-300 w-full p-3 sm:p-4 hidden sm:flex">
        <div className="flex items-center w-full">
          <div className="flex items-center gap-2">
            <div className="badge badge-primary p-2">
              <Users className="size-4" />
            </div>
            <div className="skeleton h-5 w-20"></div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="border-b border-base-300 w-full p-2 flex items-center justify-between sm:hidden">
        <div className="badge badge-primary p-2">
          <Users className="size-4" />
        </div>
        <div className="skeleton h-4 w-8 rounded-full"></div>
      </div>

      {/* Desktop search input */}
      <div className="border-b border-base-300 w-full p-2 hidden sm:block">
        <div className="skeleton h-8 w-full rounded-lg"></div>
      </div>

      {/* Mobile search input - randomly show or hide to simulate toggle state */}
      {Math.random() > 0.5 && (
        <div className="border-b border-base-300 w-full p-2 sm:hidden">
          <div className="skeleton h-8 w-full rounded-lg"></div>
        </div>
      )}

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-1 sm:py-2 animate-pulse">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-2 sm:p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full skeleton ring ring-base-300 ring-offset-base-100 ring-offset-2" />
              {/* Online indicator - randomly show for some contacts */}
              {idx % 3 === 0 && (
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full skeleton bg-success border-2 border-base-100" />
              )}
            </div>

            {/* User info skeleton - visible on all screen sizes */}
            <div className="text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-20 lg:w-32 mb-1"></div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
