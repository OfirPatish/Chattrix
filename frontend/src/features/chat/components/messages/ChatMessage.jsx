import React, { useEffect, useState } from "react";
import { formatMessageTime } from "../../../../shared/utils/utils";
import { ImageOff } from "lucide-react";
import ImageModal from "../../../../shared/components/ui/ImageModal";

/**
 * Reusable chat message component
 *
 * @param {Object} props Component properties
 * @param {Object} props.message Message data object
 * @param {boolean} props.isCurrentUser Whether message is from current user
 * @param {React.RefObject} props.ref Optional ref for scrolling
 */
const ChatMessage = ({ message, isCurrentUser, forwardedRef }) => {
  const [visible, setVisible] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Add fade-in animation effect
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        className={`chat ${
          isCurrentUser ? "chat-end" : "chat-start"
        } w-full mb-4 transition-opacity duration-300 ease-in-out ${visible ? "opacity-100" : "opacity-0"}`}
        ref={forwardedRef}
      >
        {/* Profile picture is not displayed in chat to reduce redundant rendering */}

        <div
          className={`chat-bubble rounded-2xl relative ${isCurrentUser ? "chat-bubble-primary" : ""} ${
            message.imageUrl ? "p-1" : "p-3"
          }`}
        >
          {message.imageUrl && (
            <div className="relative max-w-[200px] sm:max-w-[250px] md:max-w-[300px] cursor-pointer rounded-xl overflow-hidden">
              {imageError ? (
                <div className="flex flex-col items-center justify-center p-4 bg-base-200 rounded-xl gap-2">
                  <ImageOff className="w-8 h-8 text-base-content/50" />
                  <span className="text-xs text-base-content/70">Image deleted or unavailable</span>
                </div>
              ) : (
                <img
                  src={message.imageUrl}
                  alt="Attachment"
                  className="w-full h-auto rounded-xl"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    setImageError(true);
                  }}
                  onClick={() => setShowImageModal(true)}
                />
              )}
            </div>
          )}
          {message.content && (
            <span
              className={`break-words whitespace-pre-wrap flex-1 w-full block ${message.imageUrl ? "mt-2 px-2" : ""}`}
            >
              {message.content}
            </span>
          )}
          <div className="w-full flex justify-end">
            <span className="text-xs text-base-content/60 pt-1 pr-1">{formatMessageTime(message.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {message.imageUrl && !imageError && (
        <ImageModal imageUrl={message.imageUrl} isOpen={showImageModal} onClose={() => setShowImageModal(false)} />
      )}
    </>
  );
};

export default ChatMessage;
