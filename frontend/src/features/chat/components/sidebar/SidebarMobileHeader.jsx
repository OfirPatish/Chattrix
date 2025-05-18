import { Users, Search } from "lucide-react";

/**
 * Mobile header section for the sidebar
 */
const SidebarMobileHeader = ({ setShowSearch }) => {
  return (
    <div className="border-b border-base-300 w-full p-2 flex items-center justify-between sm:hidden">
      <div className="badge badge-primary p-2">
        <Users className="size-4" />
      </div>

      {/* Mobile search button */}
      <button onClick={() => setShowSearch((prev) => !prev)} className="btn btn-ghost btn-sm btn-circle">
        <Search className="size-4" />
      </button>
    </div>
  );
};

export default SidebarMobileHeader;
