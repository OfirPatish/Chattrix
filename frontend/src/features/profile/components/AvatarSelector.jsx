import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../../store/useAuthStore";

/**
 * Avatar selector component for user profile
 * Allows users to view and select from available avatars
 * Using flexible grid layout without empty spaces
 */
const AvatarSelector = ({ avatars }) => {
  const { updateProfile } = useAuthStore();
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Handle avatar selection
  const handleAvatarSelect = async (avatarDataUri) => {
    try {
      setUpdatingAvatar(true);
      await updateProfile({ profilePic: avatarDataUri });
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error("Failed to update avatar. Please try again.");
    } finally {
      setUpdatingAvatar(false);
    }
  };

  return (
    <div className="pt-2">
      {/* Flexible grid that adapts to content without empty spaces */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {avatars.map((avatar, index) => {
          const isSelected = selectedIndex === index;
          const isUpdating = updatingAvatar && selectedIndex === index;

          return (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-105 ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-lg scale-105"
                  : "border-base-300 hover:border-base-content/30"
              }`}
              onClick={async () => {
                setSelectedIndex(index);
                await handleAvatarSelect(avatar);
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="avatar">
                  <div className="w-16 h-16 mask mask-squircle relative">
                    <img src={avatar} alt={`Avatar option ${index + 1}`} className="w-full h-full object-cover" />
                    {isUpdating && (
                      <div className="absolute inset-0 bg-base-100/70 flex items-center justify-center rounded">
                        <span className="loading loading-spinner loading-sm text-primary"></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Selection indicator */}
                <div className="flex items-center justify-center min-h-[24px]">
                  {isSelected ? (
                    <div className="badge badge-primary badge-sm gap-1">
                      <span>✓</span>
                      Selected
                    </div>
                  ) : (
                    <div className="text-xs text-base-content/50 text-center">Option {index + 1}</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarSelector;
