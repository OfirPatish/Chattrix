import { useState } from "react";
import AvatarSelector from "./AvatarSelector";
import { getAllAvatars } from "../../../lib/avatarUtils";
import Button from "../../../shared/components/ui/Button";

/**
 * Profile avatar display component
 * Shows user's current avatar and allows selecting a new one
 */
const ProfileAvatar = ({ profilePic }) => {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [avatars, setAvatars] = useState(getAllAvatars().slice(0, 8));

  return (
    <div className="space-y-3 sm:space-y-4 w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-base-200 rounded-lg">
        <div className="avatar online">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
            <img src={profilePic || "/avatar.png"} alt="Profile" className="mask mask-squircle" />
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-medium text-base sm:text-lg mb-0.5 sm:mb-1">Profile Picture</h3>
          <p className="text-xs sm:text-sm text-base-content/70 mb-2 sm:mb-3">
            Choose from our selection of Bottts avatars
          </p>
          <Button primary size="sm" onClick={() => setShowAvatarSelector(!showAvatarSelector)}>
            {showAvatarSelector ? "Close" : "Change Avatar"}
          </Button>
        </div>
      </div>

      {/* Avatar selector - shows when toggle is active */}
      <div
        className={`transition-all duration-300 overflow-hidden w-full ${
          showAvatarSelector ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {showAvatarSelector && <AvatarSelector avatars={avatars} onClose={() => setShowAvatarSelector(false)} />}
      </div>
    </div>
  );
};

export default ProfileAvatar;
