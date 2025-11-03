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
    <div className="p-4 border-t border-base-300 bg-base-100/80 backdrop-blur-xl shadow-lg">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <div className="flex items-end gap-2 bg-base-200 rounded-3xl px-4 py-2.5 border border-base-300 focus-within:bg-base-100 focus-within:border-primary focus-within:shadow-lg transition-all duration-200">
            <textarea
              ref={textareaRef}
              placeholder="Message"
              className="w-full resize-none bg-transparent border-none outline-none text-base-content placeholder-base-content/50 text-[15px] leading-relaxed pr-2 max-h-[120px]"
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              type="submit"
              disabled={!message.trim() || isSending}
              className={`btn btn-circle btn-sm transition-all ${
                message.trim() && !isSending
                  ? "btn-primary hover:scale-110 active:scale-95"
                  : "btn-disabled"
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
