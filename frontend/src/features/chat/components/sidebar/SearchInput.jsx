import { X } from "lucide-react";

/**
 * Reusable search input component for both desktop and mobile views
 */
const SearchInput = ({
  searchQuery,
  setSearchQuery,
  isMobile = false,
  showSearch = true,
  setShowSearch = () => {},
}) => {
  // If this is mobile view and showSearch is false, don't render
  if (isMobile && !showSearch) return null;

  return (
    <div className={`border-b border-base-300 w-full p-2 ${isMobile ? "sm:hidden" : "hidden sm:block"}`}>
      <div className="join w-full">
        <div className="join-item flex-1">
          <input
            type="text"
            placeholder="Search contacts..."
            className="input input-bordered input-sm w-full text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus={isMobile}
            style={{ fontSize: "16px" }} /* Prevents zoom on iOS devices */
          />
        </div>
        {searchQuery && (
          <button
            className="btn btn-sm join-item"
            onClick={() => {
              setSearchQuery("");
              // Only close the search on mobile
              if (isMobile) setShowSearch(false);
            }}
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
