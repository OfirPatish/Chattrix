import { useChatStore } from "../../store/useChatStore";
import { useState, useEffect } from "react";
import Sidebar from "./components/SidebarView";
import EmptyChat from "./components/messages/EmptyChat";
import ChatContainer from "./components/messages/ChatContainer";

const Home = () => {
  const { selectedUser } = useChatStore();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  // Add window resize listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-base-200 pt-12 sm:pt-14 md:pt-16">
      <div className="container mx-auto h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] overflow-hidden">
        <div className="w-full p-0 max-w-7xl mx-auto h-full">
          <div className="card w-full bg-base-100 shadow-xl h-full overflow-hidden">
            <div className="card-body p-0 overflow-hidden">
              <div className="flex h-full rounded-lg overflow-hidden">
                {/* On mobile: Show sidebar ONLY when no chat is selected */}
                {/* On desktop: Always show sidebar */}
                {(!isMobileView || !selectedUser) && <Sidebar fullWidth={isMobileView && !selectedUser} />}

                {/* On mobile: Show chat when selected, nothing when no chat */}
                {/* On desktop: Show chat when selected, EmptyChat when no chat */}
                {selectedUser ? <ChatContainer /> : !isMobileView && <EmptyChat />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
