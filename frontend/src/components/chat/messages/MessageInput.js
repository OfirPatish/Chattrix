"use client";

import { useState, useRef, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import useChatStore from "@/store/chatStore";
import { useSocket } from "@/hooks/useSocket";
import { Send } from "lucide-react";

export default function MessageInput() {
  const { currentChat } = useChatStore();
  const { sendMessage, startTyping, stopTyping } = useSocket();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef(null);

  // Debounced callback to stop typing after 1 second of inactivity
  const debouncedStopTyping = useDebouncedCallback(() => {
    if (currentChat?._id) {
      stopTyping(currentChat._id);
      setIsTyping(false);
    }
  }, 1000);

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }

    // Start typing immediately if not already typing
    if (!isTyping && currentChat?._id) {
      setIsTyping(true);
      startTyping(currentChat._id);
    }

    // Debounce stop typing
    debouncedStopTyping();
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent event bubbling

      // Prevent duplicate submissions
      if (isSending || !message.trim() || !currentChat?._id) {
        return;
      }

      setIsSending(true);
      const messageToSend = message.trim();

      // Clear input immediately
      setMessage("");

      // Send message
      sendMessage(currentChat._id, messageToSend);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      // Stop typing indicator
      if (isTyping && currentChat?._id) {
        stopTyping(currentChat._id);
        setIsTyping(false);
      }

      // Cancel debounced stop typing since we're submitting
      debouncedStopTyping.cancel();

      // Allow sending again after a short delay (prevents rapid duplicate sends)
      setTimeout(() => {
        setIsSending(false);
      }, 500);
    },
    [
      message,
      currentChat,
      isSending,
      isTyping,
      sendMessage,
      stopTyping,
      debouncedStopTyping,
    ]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!currentChat) {
    return null;
  }

  return (
    <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-base-100 border-t border-base-300">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto"
      >
        <div className="flex items-end gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <div className="flex items-end gap-2 bg-base-200 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 border border-base-300 focus-within:bg-base-100 focus-within:border-primary focus-within:shadow-lg transition-all duration-200">
              <textarea
                ref={textareaRef}
                placeholder="Type a message..."
                className="w-full resize-none bg-transparent border-none outline-none text-base-content placeholder-base-content/50 text-sm sm:text-[15px] leading-relaxed pr-2 max-h-[120px] scrollbar-thin scrollbar-thumb-base-300 scrollbar-track-transparent"
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                rows={1}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isSending}
            className={`btn btn-circle btn-md sm:btn-lg transition-all flex-shrink-0 ${
              message.trim() && !isSending
                ? "btn-primary hover:scale-105 active:scale-95 shadow-lg"
                : "btn-disabled opacity-50"
            }`}
            aria-label="Send message"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
