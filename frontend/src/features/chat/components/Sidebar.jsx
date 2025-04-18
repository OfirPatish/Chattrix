import { useEffect, useState } from "react";
import { useChatStore } from "../../../store/useChatStore";
import { useAuthStore } from "../../../store/useAuthStore";
import SidebarSkeleton from "../../../shared/components/skeletons/SidebarSkeleton";
import { Users, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const navigate = useNavigate();

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);

  useEffect(() => {
    if (authUser) {
      getUsers();
    }
  }, [getUsers, authUser]);

  // If no auth user, don't render content
  if (!authUser) {
    return null;
  }

  // On mobile, always filter to show only online users
  const filteredUsers = showOnlineOnly && onlineUsers ? users.filter((user) => onlineUsers?.includes(user._id)) : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full min-w-[72px] w-28 sm:w-40 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 overflow-hidden">
      {/* Only show contacts header on non-mobile view */}
      {!isMobile && (
        <div className="border-b border-base-300 w-full p-2 sm:p-4 lg:p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="badge badge-primary p-2 sm:p-3">
              <Users className="size-3 sm:size-4" />
            </div>
            <span className="font-medium text-lg">Contacts</span>
          </div>
          {/* Online filter toggle - hidden on smallest screens */}
          <div className="mt-1 hidden sm:flex items-center gap-2">
            <label className="cursor-pointer label gap-2 justify-start p-0">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="toggle toggle-sm toggle-primary"
              />
              <span className="label-text text-xs lg:text-sm">Online only</span>
            </label>
          </div>
        </div>
      )}

      <div className="overflow-y-auto w-full py-1 sm:py-2 lg:py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-2 sm:p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative">
              <div className="avatar">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full">
                  <img src={user.profilePic || "/avatar.png"} alt={user.username} />
                </div>
              </div>
            </div>

            {/* User info - always visible */}
            <div className="text-left min-w-0 flex-1">
              <div
                className="font-medium truncate text-xs lg:text-sm max-w-[80px] sm:max-w-[120px] lg:max-w-full tooltip tooltip-right"
                data-tip={user.username}
              >
                {user.username}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="flex items-center justify-center mt-4 mx-2 p-2 bg-base-200 rounded-lg">
            <span className="text-center w-full text-xs sm:text-sm font-medium text-base-content/60">
              {isMobile
                ? "No users online right now."
                : "No users found. Try adjusting your filters or check back later!"}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
