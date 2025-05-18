import React from "react";
import { useChatStore } from "../../../../store/useChatStore";
import { Loader2 } from "lucide-react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "../../../../shared/components/skeletons/MessageSkeleton";
import ChatMessage from "./ChatMessage";
import { useAuthStore } from "../../../../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { useMessageLoader } from "../../../../shared/hooks/useMessageLoader";
import { MESSAGES_PER_PAGE, isCurrentUserMessage } from "../../../../store/useChatStore";

const ChatContainer = () => {
  // All hooks and refs must be declared before any conditional return
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
    hasMore,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const { page, loadingMore, fetchMoreMessages, messageEndRef, chatDivRef, handleScroll, showNoMoreMessages } =
    useMessageLoader({
      getMessages,
      isMessagesLoading,
      selectedUser,
      authUser,
      messages,
      MESSAGES_PER_PAGE,
      isCurrentUserMessage,
      hasMore,
    });

  // Redirect if user is not authenticated
  React.useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);

  // Handle message subscription
  React.useEffect(() => {
    if (!selectedUser?._id || !authUser) return;
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, subscribeToMessages, unsubscribeFromMessages, authUser]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <ChatHeader />

      {isMessagesLoading && page === 1 ? (
        <MessageSkeleton />
      ) : (
        <div
          id="scrollableChatDiv"
          ref={chatDivRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4 scrollbar-thin bg-base-100 rounded-lg border border-base-300"
          style={{
            overscrollBehavior: "contain",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div className="flex flex-col w-full">
            {/* Show loading spinner at the top when loading more */}
            {loadingMore && (
              <div className="flex justify-center py-2">
                <span className="loading loading-spinner loading-xs text-primary"></span>
                <span className="text-xs ml-2">Loading older messages...</span>
              </div>
            )}
            {/* Show 'No more messages' at the top */}
            {showNoMoreMessages && !loadingMore && (
              <div className="text-center text-xs opacity-60 py-2 w-full">No more messages</div>
            )}
            {messages.map((message, index) => (
              <ChatMessage
                key={message._id}
                message={message}
                isCurrentUser={isCurrentUserMessage(authUser, message.senderId)}
                ref={index === messages.length - 1 ? messageEndRef : null}
                isLatestMessage={index === messages.length - 1}
              />
            ))}
          </div>
        </div>
      )}

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
