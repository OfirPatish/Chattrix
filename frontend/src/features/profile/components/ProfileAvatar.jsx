import { useState } from "react";
import AvatarSelector from "./AvatarSelector";
import { getAllAvatars } from "../../../lib/avatarUtils";

/**
 * Profile avatar display component
 * Shows user's current avatar and allows selecting a new one
 */
const ProfileAvatar = ({ profilePic }) => {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [avatars, setAvatars] = useState(getAllAvatars().slice(0, 8));

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 hover:bg-base-200 transition-colors p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="avatar online">
            <div className="w-20 h-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={profilePic || "/avatar.png"} alt="Profile" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-medium text-lg mb-1">Profile Picture</h3>
            <p className="text-sm text-base-content/70 mb-3">Choose from our selection of Bottts avatars</p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAvatarSelector(!showAvatarSelector)}>
              {showAvatarSelector ? "Close" : "Change Avatar"}
              {!showAvatarSelector && <span className="ml-1">👤</span>}
            </button>
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
