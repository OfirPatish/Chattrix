import { useState, useEffect } from "react";
import SidebarSkeleton from "./SidebarSkeleton";
import MessageSkeleton from "./MessageSkeleton";
import { Phone, Video, ArrowLeft } from "lucide-react";

/**
 * Main chat skeleton that handles responsive layout similar to the actual chat layout
 * On mobile: Shows either sidebar or chat, not both
 * On desktop: Shows both sidebar and chat side by side
 */
const ChatSkeleton = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  // Randomly decide whether to show a chat (like having selectedUser)
  const [hasSelectedChat] = useState(Math.random() > 0.5);

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const ChatWithHeaderAndInput = () => (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Chat header skeleton */}
      <div className="navbar bg-base-100 border-b border-base-300 min-h-8 sm:min-h-12 p-1 sm:p-2 md:px-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile back button */}
            <div className="md:hidden">
              <button className="btn btn-sm btn-ghost btn-circle">
                <ArrowLeft size={16} />
              </button>
            </div>

            {/* User avatar */}
            <div className="avatar">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full skeleton ring ring-primary ring-offset-base-100 ring-offset-2" />
            </div>

            {/* User info */}
            <div>
              <div className="skeleton h-4 sm:h-5 w-24 mb-1"></div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-success"></span>
                <div className="skeleton h-3 w-14"></div>
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

      {/* Messages area */}
      <MessageSkeleton />

      {/* Message input skeleton */}
      <div className="p-2 sm:p-3 md:p-4 w-full bg-base-200/30 border-t border-base-300">
        <div className="flex items-center w-full gap-1 sm:gap-2">
          <div className="flex-1">
            <div className="skeleton h-8 sm:h-10 w-full rounded-lg"></div>
          </div>
          <div className="skeleton h-8 sm:h-10 w-8 sm:w-10 rounded-full"></div>
          <div className="skeleton h-8 sm:h-10 w-8 sm:w-10 rounded-full"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full rounded-lg overflow-hidden">
      {/* On mobile: Show sidebar ONLY when no chat is selected */}
      {/* On desktop: Always show sidebar */}
      {(!isMobileView || !hasSelectedChat) && <SidebarSkeleton fullWidth={isMobileView && !hasSelectedChat} />}

      {/* On mobile: Show chat when selected, nothing when no chat */}
      {/* On desktop: Show chat when selected, EmptyChat when no chat */}
      {hasSelectedChat ? <ChatWithHeaderAndInput /> : !isMobileView && <div className="flex-1 bg-base-100/50"></div>}
    </div>
  );
};

export default ChatSkeleton;
