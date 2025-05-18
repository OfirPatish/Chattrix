import { Users } from "lucide-react";

/**
 * Desktop header section for the sidebar
 */
const SidebarHeader = () => {
  return (
    <div className="border-b border-base-300 w-full p-3 sm:p-4 flex flex-col gap-3 bg-base-100 hidden sm:flex">
      {/* Title */}
      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <div className="badge badge-primary p-2">
            <Users className="size-4" />
          </div>
          <span className="font-medium text-base">Contacts</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;
