import { Phone, Video, ArrowLeft } from "lucide-react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useChatStore } from "../../../store/useChatStore";
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

          {/* Avatar */}
          <div className="chat-image avatar relative">
            <div className="w-8 sm:w-10 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-1 sm:ring-offset-2">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.username} />
            </div>
            {/* Status icon overlay with DaisyUI tooltip */}
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-base-100 ${
                isOnline ? "bg-success" : "bg-gray-400"
              } tooltip tooltip-bottom`}
              data-tip={isOnline ? "Online" : "Offline"}
            ></span>
          </div>

          {/* User info */}
          <div className="chat-header flex flex-col">
            <h3 className="font-medium text-sm sm:text-base">{selectedUser.username}</h3>
          </div>
        </div>
      </div>

      {/* Call/Video icons */}
      <div className="flex-none flex items-center gap-1 sm:gap-2">
        {/* Call icon */}
        <button className="btn btn-circle btn-ghost btn-xs sm:btn-sm">
          <Phone className="size-3 sm:size-4 text-success" />
        </button>

        {/* Video icon */}
        <button className="btn btn-circle btn-ghost btn-xs sm:btn-sm">
          <Video className="size-3 sm:size-4 text-primary" />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;
