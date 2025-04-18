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
    <div className="space-y-6">
      <div className="card bg-base-100 transition-colors p-4 ">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="avatar online">
            <div className="w-20 h-20 rounded-full">
              <img src={profilePic || "/avatar.png"} alt="Profile" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-medium text-lg mb-1">Profile Picture</h3>
            <p className="text-sm text-base-content/70 mb-3">Choose from our selection of Bottts avatars</p>
            <Button primary size="sm" onClick={() => setShowAvatarSelector(!showAvatarSelector)}>
              {showAvatarSelector ? "Close" : "Change Avatar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Avatar selector - shows when toggle is active */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          showAvatarSelector ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {showAvatarSelector && <AvatarSelector avatars={avatars} onClose={() => setShowAvatarSelector(false)} />}
      </div>
    </div>
  );
};

export default ProfileAvatar;
