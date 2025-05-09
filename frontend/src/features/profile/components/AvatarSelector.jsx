import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../../store/useAuthStore";

/**
 * Avatar selector component for user profile
 * Allows users to view and select from available avatars
 */
const AvatarSelector = ({ avatars, onClose }) => {
  const { updateProfile } = useAuthStore();
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Handle avatar selection
  const handleAvatarSelect = async (avatarDataUri) => {
    try {
      setUpdatingAvatar(true);
      await updateProfile({ profilePic: avatarDataUri });
      onClose();
    } catch (error) {
      toast.error("Failed to update avatar. Please try again.");
    } finally {
      setUpdatingAvatar(false);
    }
  };

  return (
    <div className="bg-base-200 p-3 sm:p-4 rounded-lg w-full overflow-hidden">
      <h3 className="text-xs sm:text-sm font-medium mb-3 sm:mb-4">Select an avatar:</h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 w-full">
        {avatars.map((avatar, index) => (
          <div key={index} className="avatar-container relative flex justify-center">
            <div
              className={`avatar cursor-pointer transition-all duration-300 ${
                selectedIndex === index ? "ring ring-primary ring-offset-2 ring-offset-base-200" : "hover:opacity-90"
              }`}
              onClick={async () => {
                setSelectedIndex(index);
                await handleAvatarSelect(avatar);
              }}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mask mask-squircle relative">
                <img src={avatar} alt={`Avatar option ${index + 1}`} className="w-full h-full object-cover" />
                {updatingAvatar && selectedIndex === index && (
                  <div className="absolute inset-0 bg-base-100/70 flex items-center justify-center rounded">
                    <span className="loading loading-spinner loading-sm sm:loading-md text-primary"></span>
                  </div>
                )}
              </div>
            </div>
            {selectedIndex === index && <div className="badge badge-primary badge-sm absolute -top-2 -right-2">✓</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;
