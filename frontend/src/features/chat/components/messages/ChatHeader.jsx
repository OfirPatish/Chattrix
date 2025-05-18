import { Phone, Video, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../../../../store/useAuthStore";
import { useChatStore } from "../../../../store/useChatStore";
import { useState, useEffect } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Add ESC key listener to close chat
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedUser) {
        setSelectedUser(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedUser, setSelectedUser]);

  if (!selectedUser) {
    return <div className="navbar bg-base-100 border-b border-base-300 min-h-8 sm:min-h-12 p-0"></div>;
  }

  const isOnline = onlineUsers?.includes(selectedUser._id);

  // Handler for mobile back button
  const handleBackClick = () => {
    setSelectedUser(null);
  };

  return (
    <div className="navbar bg-base-100 border-b border-base-300 min-h-8 sm:min-h-12 p-1 sm:p-2 md:px-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile back button */}
          {isMobile && (
            <button onClick={handleBackClick} className="btn btn-sm btn-ghost btn-circle md:hidden">
              <ArrowLeft size={16} />
            </button>
          )}

          {/* User avatar */}
          <div className="avatar">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.username} />
            </div>
          </div>

          {/* User info */}
          <div>
            <div className="font-medium text-sm sm:text-base">{selectedUser.username}</div>
            <div className="text-xs flex items-center gap-1">
              <span className={`inline-block w-2 h-2 rounded-full ${isOnline ? "bg-success" : "bg-base-300"}`}></span>
              <span>{isOnline ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex-none">
        <button className="btn btn-ghost btn-circle">
          <Phone size={18} />
        </button>
        <button className="btn btn-ghost btn-circle">
          <Video size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
