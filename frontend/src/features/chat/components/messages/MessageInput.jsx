import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../../../../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../../store/useAuthStore";

const MessageInput = () => {
  const [messageText, setMessageText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef(null);
  const textInputRef = useRef(null);
  const { sendMessage, selectedUser, scrollToLatestMessage } = useChatStore();
  const { authUser } = useAuthStore();

  // Focus the text input when a user is selected
  useEffect(() => {
    if (selectedUser && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [selectedUser]);

  /**
   * Handles image selection and preview generation
   */
  const handleImageSelection = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (32MB limit for ImgBB)
    if (selectedFile.size > 32 * 1024 * 1024) {
      toast.error("Image size should be less than 32MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  /**
   * Removes the selected image from the message
   */
  const removeSelectedImage = () => {
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  /**
   * Sends the message and resets the form
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() && !imagePreview) return;
    if (!authUser || !selectedUser) {
      toast.error("Cannot send message");
      return;
    }

    setIsUploading(true);
    try {
      await sendMessage({
        content: messageText.trim(),
        image: imagePreview,
      });

      // Clear form after successful send
      setMessageText("");
      setImagePreview(null);
      if (imageInputRef.current) imageInputRef.current.value = "";

      // Focus back on the input with a small delay to ensure DOM has updated
      setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      }, 100);

      // Trigger scroll to bottom when sending a new message
      if (scrollToLatestMessage) {
        scrollToLatestMessage();
      }
    } catch (error) {
      // Error is already handled by the store
    } finally {
      setIsUploading(false);
    }
  };

  const isDisabled = !authUser || !selectedUser || isUploading;

  return (
    <div className="p-2 sm:p-3 md:p-4 w-full bg-base-200/30 border-t border-base-300 flex-shrink-0">
      {imagePreview && (
        <div className="mb-2 sm:mb-3 flex items-center gap-2">
          <div className="relative">
            <div className="avatar">
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-lg">
                <img src={imagePreview} alt="Preview" />
              </div>
            </div>
            <button
              onClick={removeSelectedImage}
              className="btn btn-circle btn-xs absolute -top-1.5 -right-1.5 btn-error"
              type="button"
              disabled={isUploading}
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center w-full gap-1 sm:gap-2">
        <div className="flex-1">
          <input
            ref={textInputRef}
            type="text"
            className="input input-bordered input-sm sm:input-md w-full rounded-lg text-base"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={isDisabled}
            maxLength={1000}
            style={{ fontSize: "16px" }} /* Prevents zoom on iOS devices */
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageInputRef}
            onChange={handleImageSelection}
            disabled={isUploading}
          />
        </div>

        <button
          type="button"
          className="btn btn-sm sm:btn-md btn-circle"
          onClick={() => imageInputRef.current?.click()}
          disabled={isDisabled}
          title="Add image"
        >
          <Image size={16} className={imagePreview ? "text-success" : ""} />
        </button>

        <button
          type="submit"
          className="btn btn-sm sm:btn-md btn-primary btn-circle"
          disabled={(!messageText.trim() && !imagePreview) || isDisabled}
        >
          {isUploading ? <span className="loading loading-spinner loading-sm"></span> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
