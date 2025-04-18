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
    <div className="card bg-base-200 shadow-xl p-6 mb-6">
      <h3 className="card-title text-sm font-medium mb-4">Select an avatar:</h3>

      <div className="grid grid-cols-4 gap-4 py-2">
        {avatars.map((avatar, index) => (
          <div key={index} className="avatar-container relative flex justify-center">
            <div
              className={`avatar cursor-pointer transition-all duration-300 ${
                selectedIndex === index ? "ring ring-primary ring-offset-2" : "hover:opacity-90"
              }`}
              onClick={async () => {
                setSelectedIndex(index);
                await handleAvatarSelect(avatar);
              }}
            >
              <div className="w-14 h-14 mask mask-squircle relative">
                <img src={avatar} alt={`Avatar option ${index + 1}`} />
                {updatingAvatar && selectedIndex === index && (
                  <div className="absolute inset-0 bg-base-100/70 flex items-center justify-center rounded">
                    <span className="loading loading-spinner loading-md text-primary"></span>
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
