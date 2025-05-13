import { MessageSquare, Users, ArrowRight } from "lucide-react";

const EmptyChat = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center bg-base-100/50">
      <div className="hero min-h-[80%]">
        <div className="hero-content text-center">
          <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <div className="mockup-browser border bg-base-300 mb-8 shadow-lg">
              <div className="mockup-browser-toolbar">
                <div className="input input-bordered input-sm">chattrix.com</div>
              </div>
              <div className="flex justify-center items-center px-4 py-16 bg-base-200 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0">
                  <div className="grid grid-cols-8 grid-rows-5 gap-2 w-full h-full p-4">
                    {Array(40)
                      .fill()
                      .map((_, i) => (
                        <div key={i} className="flex items-center justify-center opacity-10">
                          <div className="w-6 h-6 rounded-sm border border-base-content/20"></div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Main logo */}
                <div className="relative z-10 rounded-2xl w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-base-100 shadow-xl flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 relative">
                    <MessageSquare
                      className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 text-primary absolute inset-0"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>
              </div>
            </div>

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
