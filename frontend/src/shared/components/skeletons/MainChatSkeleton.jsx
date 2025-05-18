import ChatSkeleton from "./ChatSkeleton";

/**
 * Main skeleton that mimics the entire chat page layout including containers
 */
const MainChatSkeleton = () => {
  return (
    <div className="min-h-screen bg-base-200 pt-12 sm:pt-14 md:pt-16">
      <div className="container mx-auto h-[calc(100vh-3rem)] sm:h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] overflow-hidden">
        <div className="w-full p-0 max-w-7xl mx-auto h-full">
          <div className="card w-full bg-base-100 shadow-xl h-full overflow-hidden">
            <div className="card-body p-0 overflow-hidden">
              <ChatSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainChatSkeleton;
