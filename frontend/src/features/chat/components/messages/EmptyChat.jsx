import { MessageSquare } from "lucide-react";

const EmptyChat = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center bg-base-100/50">
      <div className="hero min-h-[80%]">
        <div className="hero-content text-center">
          <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            {/* Main logo */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to Chattrix!
            </h1>

            <div className="badge badge-primary badge-outline my-4 p-3 gap-2 text-sm sm:text-base">
              <span className="loading loading-dots loading-xs"></span>
              Waiting for conversation
            </div>

            <p className="py-4 opacity-80 text-sm sm:text-base md:text-lg text-base-content/80">
              Select a conversation from the sidebar to start chatting with your friends and colleagues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyChat;
