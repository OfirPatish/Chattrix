import { Send, Phone, Video, Image as ImageIcon } from "lucide-react";

const PREVIEW_MESSAGES = [
  {
    id: 1,
    content: "Hey! How's it going?",
    isSent: false,
    createdAt: "12:00 PM",
  },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
    createdAt: "12:01 PM",
  },
  {
    id: 3,
    content: "Check out this image!",
    isSent: false,
    imageUrl: "https://picsum.photos/200/300",
    createdAt: "12:02 PM",
  },
];

const ChatPreview = () => (
  <div className="relative bg-base-200 p-4 rounded-xl">
    {/* Preview overlay badge */}
    <div className="absolute top-2 right-2 z-10">
      <div className="badge badge-neutral">Preview Only</div>
    </div>
    <div className="max-w-lg mx-auto">
      {/* Chat Preview Mockup */}
      <div className="card bg-base-100 shadow-md overflow-hidden">
        {/* Chat Header */}
        <div className="navbar bg-base-100 border-b border-base-300 min-h-8 sm:min-h-12 p-1 sm:p-2 md:px-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Avatar */}
              <div className="chat-image avatar">
                <div className="w-8 sm:w-10 rounded-full">
                  <img src="/avatar.png" alt="Demo User" />
                </div>
              </div>
              {/* User info */}
              <div className="chat-header flex flex-col">
                <h3 className="font-medium text-sm sm:text-base">Demo User</h3>
                <div className="text-xs mt-0.5">
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>
          {/* Action icons */}
          <div className="flex-none flex items-center gap-1 sm:gap-2">
            <button className="btn btn-circle btn-ghost btn-xs sm:btn-sm" disabled>
              <Phone className="size-3 sm:size-4 text-success" />
            </button>
            <button className="btn btn-circle btn-ghost btn-xs sm:btn-sm" disabled>
              <Video className="size-3 sm:size-4 text-primary" />
            </button>
          </div>
        </div>
        {/* Chat Messages */}
        <div className="p-2 sm:p-4 space-y-4 min-h-[200px] max-h-[250px] overflow-y-auto bg-base-100 flex flex-col">
          {PREVIEW_MESSAGES.map((message) => (
            <div key={message.id} className={`chat ${message.isSent ? "chat-end" : "chat-start"} w-full mb-2`}>
              <div
                className={`chat-bubble rounded-2xl relative ${message.isSent ? "chat-bubble-primary" : ""} ${
                  message.imageUrl ? "p-1" : "p-3"
                }`}
              >
                {message.imageUrl && (
                  <div className="relative max-w-[200px] sm:max-w-[250px] md:max-w-[300px] rounded-xl overflow-hidden mb-2">
                    <img src={message.imageUrl} alt="Attachment" className="w-full h-auto rounded-xl" loading="lazy" />
                  </div>
                )}
                {message.content && (
                  <span
                    className={`break-words whitespace-pre-wrap flex-1 w-full block ${
                      message.imageUrl ? "mt-2 px-2" : ""
                    }`}
                  >
                    {message.content}
                  </span>
                )}
                <div className="w-full flex justify-end">
                  <span className="text-xs text-base-content/60 pt-1 pr-1">{message.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Chat Input (disabled, with image icon) */}
        <div className="p-3 bg-base-200/30 border-t border-base-300">
          <div className="flex items-center w-full gap-2">
            <div className="flex-1">
              <input
                type="text"
                className="input input-bordered w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Type a message..."
                value="This is a preview"
                readOnly
                disabled
              />
            </div>
            <button className="btn btn-circle btn-ghost" disabled title="Add image">
              <ImageIcon className="size-5" />
            </button>
            <button className="btn btn-circle btn-primary" disabled>
              <Send className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ChatPreview;
