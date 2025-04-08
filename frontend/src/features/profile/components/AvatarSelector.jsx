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
      // Only send profilePic parameter
      await updateProfile({ profilePic: avatarDataUri });
      // Toast notification is removed from here to prevent duplication
      onClose(); // Close the selector after successful update
    } catch (error) {
      toast.error("Failed to update avatar. Please try again.");
    } finally {
      setUpdatingAvatar(false);
    }
  };

  return (
    <div className="card bg-base-200 shadow-xl p-6 mb-6">
      <h3 className="card-title text-sm font-medium mb-4">Select an avatar:</h3>

      {updatingAvatar && (
        <div className="flex justify-center mb-4">
          <div className="loading loading-spinner loading-md text-primary"></div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 py-2">
        {avatars.map((avatar, index) => (
          <div key={index} className="avatar-container relative flex justify-center">
            <div
              className={`avatar cursor-pointer transition-all duration-300 ${
                selectedIndex === index ? "ring ring-primary ring-offset-2" : "hover:opacity-90"
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <div className="w-14 h-14 mask mask-squircle">
                <img src={avatar} alt={`Avatar option ${index + 1}`} />
              </div>
            </div>

            {selectedIndex === index && <div className="badge badge-primary badge-sm absolute -top-2 -right-2">✓</div>}
          </div>
        ))}
      </div>

      <div className="card-actions justify-end mt-6">
        <button className="btn btn-sm btn-ghost" onClick={onClose} disabled={updatingAvatar}>
          Cancel
        </button>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => selectedIndex !== null && handleAvatarSelect(avatars[selectedIndex])}
          disabled={updatingAvatar || selectedIndex === null}
        >
          {updatingAvatar ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Updating...
            </>
          ) : (
            "Select Avatar"
          )}
        </button>
      </div>
    </div>
  );
};

export default AvatarSelector;
